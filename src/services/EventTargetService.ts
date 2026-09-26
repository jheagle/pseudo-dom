/**
 * Substitute for the DOM EventTarget Class.
 */
import { EventService } from './EventService'
import PseudoEventListener from '../classes/PseudoEventListener'
import { listenerOptions, PseudoEventTarget } from '../interfaces/PseudoEventTarget'
import getParentNodes from '../functions/getParentNodes'
import { LinkedList } from 'collect-your-stuff/dist/collections/linked-list/LinkedList'
import { Linker } from 'collect-your-stuff/dist/collections/linked-list/Linker'

// The listeners for each event type, in the order they will run: the order they were added, with default listeners last.
type registeredListeners = { [key: string]: LinkedList }

type defaultEvents = { [key: string]: Function }

/**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * Dispatching an event sends it through the tree the way the DOM does: down from the root to the target (capture
 * listeners), to the target itself, then back up to the root (the listeners which are not capture listeners, when the
 * event bubbles).
 */
class EventTargetService implements PseudoEventTarget {
  private readonly listeners: registeredListeners
  private readonly defaultEvent: defaultEvents

  constructor () {
    this.listeners = {}
    this.defaultEvent = {}
  }

  /**
   * The listeners registered for a type of event, creating the (empty) list of them when there are none yet.
   * @param type
   */
  private listenersFor (type: string): LinkedList {
    if (!(type in this.listeners)) {
      this.listeners[type] = new LinkedList()
    }
    return this.listeners[type]
  }

  /**
   * Run the listeners registered on this target for the type of the event which apply to the phase the event is in
   * (at the target, the capture listeners run before the others). Listeners which are added while this runs do not run
   * for this event, and listeners which are removed while it runs no longer do. Running stops as soon as immediate
   * propagation is stopped. A listener which throws does not stop the others.
   * @param event The event, which is at a phase and has a current target
   * @returns The errors which the listeners threw
   */
  private runEvents (event: EventService): Array<any> {
    const errors: Array<any> = []
    if (!(event.type in this.listeners)) {
      return errors
    }
    const listeners: Array<PseudoEventListener> = Array.from(this.listeners[event.type]).map((linker: Linker) => linker.data)
    // At the target the capture listeners come first, otherwise the order is the order they were added
    const ordered: Array<PseudoEventListener> = event.eventPhase === EventService.AT_TARGET
      ? listeners.filter(listener => listener.capture).concat(listeners.filter(listener => !listener.capture))
      : listeners
    for (const listener of ordered) {
      if (event.inner.immediatePropagationStopped) {
        break
      }
      if (listener.rejectEvent(event)) {
        continue
      }
      if (listener.once) {
        this.removeListener(event.type, listener)
      }
      event.inner.inPassiveListener = listener.passive
      try {
        listener.handleEvent(event)
      } catch (error) {
        errors.push(error)
      }
      event.inner.inPassiveListener = false
    }
    return errors
  }

  /**
   * Take a listener out of the registered listeners, so that it does not run again.
   * @param type
   * @param listener
   */
  private removeListener (type: string, listener: PseudoEventListener): void {
    listener.removed = true
    const registered: LinkedList = this.listeners[type]
    Array.from(registered)
      .filter((linker: Linker) => linker.data === listener)
      .forEach((linker: Linker) => registered.remove(linker))
  }

  /**
   * Register the function to run when nothing else has prevented the default for this type of event.
   * @param type
   * @param callback
   */
  protected setDefaultEvent (type: string, callback: Function): void {
    this.listenersFor(type)
    this.defaultEvent[type] = callback
  }

  /**
   * Registers an event handler of a specific event type. Adding the same handler again for the same type and phase does
   * nothing, like the DOM.
   * @param type The type of event to listen for
   * @param callback The function to call (or an object with a handleEvent function)
   * @param useCapture Listen while the event travels down to the target (true), or an object with capture, once and passive
   */
  public addEventListener (type: string, callback: Function | {
    handleEvent: Function
  } | any, useCapture: listenerOptions | boolean = false): void {
    let options: listenerOptions = { capture: false, once: false, passive: false }
    if (typeof useCapture === 'object' && useCapture !== null) {
      // Originally useCapture was a single boolean flag, later optional other flags can be used
      // Here we take all the given flags from the object and assign them as the options
      options = Object.assign(options, useCapture)
    } else {
      options.capture = !!useCapture
    }
    const listeners: LinkedList = this.listenersFor(type)
    const alreadyAdded: boolean = Array.from(listeners)
      .some((linker: Linker) => linker.data.callback === callback && linker.data.capture === options.capture)
    if (alreadyAdded) {
      return
    }
    // A function runs with this target as this, an object runs its handleEvent as itself
    const handler: Function = typeof callback === 'function' ? callback.bind(this) : callback.handleEvent.bind(callback)
    const listener: PseudoEventListener = new PseudoEventListener(type, options, handler, callback)
    // Listeners run in the order they were added, except that listeners which are not defaults always come before the defaults
    const firstDefault = Array.from(listeners).find((linker: Linker) => linker.data.isDefault)
    if (firstDefault && !listener.isDefault) {
      listeners.insertBefore(firstDefault, listener)
    } else {
      listeners.append(listener)
    }
  }

  /**
   * Removes an event listener, the one which was added with the same type, handler and phase.
   * @param type The type of event
   * @param callback The handler which was added
   * @param options Whether the listener was a capture listener (true), or an object with capture
   */
  public removeEventListener (type: string, callback: Function, options: listenerOptions | boolean = false): void {
    if (!(type in this.listeners)) {
      return
    }
    const capture: boolean = typeof options === 'object' && options !== null ? !!options.capture : !!options
    Array.from(this.listeners[type])
      .map((linker: Linker) => linker.data as PseudoEventListener)
      .filter(listener => !listener.isDefault && listener.callback === callback && listener.capture === capture)
      .forEach(listener => this.removeListener(type, listener))
  }

  /**
   * Dispatches an event to this target and through the tree: capture listeners of the ancestors from the root down,
   * then the listeners of this target, then (when the event bubbles) the other listeners of the ancestors from the
   * parent up to the root. stopPropagation() stops it reaching further targets, stopImmediatePropagation() also stops
   * the remaining listeners of the current target. Afterwards, unless the default was prevented, the default action
   * of this target (see setDefaultEvent) runs. The event can be dispatched again afterwards.
   * @param event The event to dispatch
   * @returns False when the event was cancelable and a listener prevented the default, otherwise true
   * @throws {Error} When the event is already being dispatched, or (after the whole dispatch has finished) the error
   * which a listener threw (an error with all of them in its errors property when several did)
   */
  public dispatchEvent (event: EventService): boolean {
    if (event.inner.dispatching) {
      throw new Error('The event is already being dispatched.')
    }
    event.inner.dispatching = true
    event.inner.target = this
    // The ancestors, the root first, which can have listeners
    const ancestors: Array<EventTargetService> = getParentNodes(this)
      .filter((node: any) => node instanceof EventTargetService) as unknown as Array<EventTargetService>
    event.inner.path = ([this] as Array<EventTargetService>).concat(ancestors.slice().reverse())
    const errors: Array<any> = []
    const visit = (target: EventTargetService, phase: number): void => {
      event.inner.eventPhase = phase
      event.inner.currentTarget = target
      errors.push(...target.runEvents(event))
    }
    for (const ancestor of ancestors) {
      if (event.inner.propagationStopped) {
        break
      }
      visit(ancestor, EventService.CAPTURING_PHASE)
    }
    if (!event.inner.propagationStopped) {
      visit(this, EventService.AT_TARGET)
    }
    if (event.bubbles) {
      for (const ancestor of ancestors.slice().reverse()) {
        if (event.inner.propagationStopped) {
          break
        }
        visit(ancestor, EventService.BUBBLING_PHASE)
      }
    }
    event.inner.finishDispatch()
    if (!event.defaultPrevented && typeof this.defaultEvent[event.type] === 'function') {
      try {
        this.defaultEvent[event.type](event)
      } catch (error) {
        errors.push(error)
      }
    }
    if (errors.length === 1) {
      throw errors[0]
    }
    if (errors.length > 1) {
      throw Object.assign(new Error(`${errors.length} listeners threw an error while dispatching the ${event.type} event.`), { errors })
    }
    return !event.defaultPrevented
  }
}

export default EventTargetService

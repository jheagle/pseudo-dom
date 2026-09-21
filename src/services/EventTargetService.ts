/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { EventService } from './EventService'
import PseudoEventListener from '../classes/PseudoEventListener'
import { listenerOptions, PseudoEventTarget } from '../interfaces/PseudoEventTarget'
import { LinkedList } from 'collect-your-stuff/dist/collections/linked-list/LinkedList'
import { Linker } from 'collect-your-stuff/dist/collections/linked-list/Linker'

// The listeners for each event type, in the order they will run: the order they were added, with default listeners last.
type registeredListeners = { [key: string]: LinkedList }

type defaultEvents = { [key: string]: Function }

/**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {Object.<string, Array.<PseudoEventListener>>} listeners
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */
class EventTargetService implements PseudoEventTarget {
  private readonly listeners: registeredListeners
  private readonly defaultEvent: defaultEvents

  /**
   * @constructor
   */
  constructor () {
    this.listeners = {}
    this.defaultEvent = {}
  }

  /**
   * The listeners registered for a type of event, creating the (empty) list of them when there are none yet.
   * @param {string} type
   * @returns {LinkedList}
   */
  private listenersFor (type: string): LinkedList {
    if (!(type in this.listeners)) {
      this.listeners[type] = new LinkedList()
    }
    return this.listeners[type]
  }

  /**
   * Run each of the listeners registered on this target for the type of the event.
   * Listeners which do not apply to the event's phase are skipped, running stops once immediate propagation is stopped,
   * and listeners added or removed while running do not change which ones run for this event.
   * @param {EventService} event
   * @returns {*} true when there was nothing registered, otherwise the last value returned from a handler (null when none ran)
   */
  private runEvents (event: EventService): any {
    if (!(event.type in this.listeners)) {
      return true
    }
    const listeners = this.listeners[event.type]
    let eventReturn: any = null
    // Work from a copy of the linkers so that removing a listener (for example a once listener) does not disturb the walk
    for (const linker of Array.from(listeners)) {
      const listener: PseudoEventListener = linker.data
      if (event.inner.immediatePropagationStopped) {
        break
      }
      if (listener.rejectEvent(event)) {
        continue
      }
      eventReturn = listener.handleEvent(event)
      if (listener.once) {
        listeners.remove(linker)
      }
    }
    return eventReturn
  }

  /**
   * Register the function to run when nothing else has prevented the default for this type of event.
   * @param {string} type
   * @param {Function} callback
   */
  protected setDefaultEvent (type: string, callback: Function): void {
    this.listenersFor(type)
    this.defaultEvent[type] = callback
  }

  private runDefaultEvent (event: EventService): boolean {
    if (event.defaultPrevented) {
      return false
    }
    this.defaultEvent[event.type](event)
    return true
  }

  private startEvents (eventType: string): boolean {
    const event: EventService = new EventService(eventType)
    event.inner.target = this
    ;[
      EventService.CAPTURING_PHASE,
      EventService.AT_TARGET,
      EventService.BUBBLING_PHASE
    ].forEach(phase => {
      let continueEvents: any = null
      if (phase === EventService.AT_TARGET || !event.inner.propagationStopped) {
        event.inner.eventPhase = phase
        event.composedPath().forEach(target => {
          event.inner.currentTarget = target
          continueEvents = (event.currentTarget as EventTargetService).runEvents(event)
        })
      }
      if (event.eventPhase === EventService.AT_TARGET && typeof continueEvents !== 'boolean' && this.defaultEvent[eventType]) {
        this.runDefaultEvent(event)
      }
    })
    return true
  }

  public addEventListener (type: string, callback: Function | {
    handleEvent: Function
  } | any, useCapture: listenerOptions | boolean = false): void {
    let options: listenerOptions = { capture: false, once: false, passive: false }
    if (typeof useCapture === 'object') {
      // Originally useCapture was a single boolean flag, later optional other flags can be used
      // Here we take all the given flags from the object and assign them as the options
      options = Object.assign(options, useCapture)
    } else {
      options.capture = useCapture
    }
    const listener: PseudoEventListener = new PseudoEventListener(type, options, (callback.handleEvent || callback).bind(this), callback)
    const listeners = this.listenersFor(type)
    // Listeners run in the order they were added, except that listeners which are not defaults always come before the defaults
    const firstDefault = Array.from(listeners).find((linker: Linker) => linker.data.isDefault)
    if (firstDefault && !listener.isDefault) {
      listeners.insertBefore(firstDefault, listener)
    } else {
      listeners.append(listener)
    }
  }

  public removeEventListener (type: string, callback: Function): void {
    if (!(type in this.listeners)) {
      return
    }
    const listeners = this.listeners[type]
    Array.from(listeners)
      .filter((linker: Linker) => !linker.data.isDefault && linker.data.callback === callback)
      .forEach((linker: Linker) => listeners.remove(linker))
  }

  public dispatchEvent (event: EventService, target: EventTargetService = this): boolean {
    event.inner.target = target
    if (!(event.type in this.listeners)) {
      return true
    }
    this.runEvents(event)
    return !event.defaultPrevented
  }
}

export default EventTargetService

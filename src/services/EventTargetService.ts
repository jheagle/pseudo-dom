/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { EventService } from './EventService'
import PseudoEventListener from '../classes/PseudoEventListener'
import { listenerOptions, PseudoEventTarget } from '../interfaces/PseudoEventTarget'

// The listeners for each event type, the first item is the next to run (the top of the stack).
type registeredListeners = { [key: string]: Array<PseudoEventListener> }

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
   * Run each of the listeners registered on this target for the type of the event.
   * @param {EventService} event
   * @returns {*} true when there was nothing registered, otherwise the last value returned from a handler (null when none ran)
   */
  private runEvents (event: EventService): any {
    if (!(event.type in this.listeners)) {
      return true
    }
    const stack = this.listeners[event.type]
    let eventReturn: any = null
    if (stack.length === 0) {
      return eventReturn
    }
    if (event.inner.immediatePropagationStopped || stack[0].rejectEvent(event)) {
      return eventReturn
    }
    // Temporarily hold the listeners which have run
    const runningListeners: Array<PseudoEventListener> = []
    let currentListener: PseudoEventListener | undefined = stack.shift()
    while (currentListener) {
      eventReturn = currentListener.handleEvent(event)
      if (!currentListener.once) {
        runningListeners.push(currentListener)
      }
      if (stack.length === 0 || event.inner.immediatePropagationStopped || stack[0].rejectEvent(event)) {
        break
      }
      currentListener = stack.shift()
    }
    // Rebuild the stack, keeping the original order
    stack.unshift(...runningListeners)
    return eventReturn
  }

  /**
   * Register the function to run when nothing else has prevented the default for this type of event.
   * @param {string} type
   * @param {Function} callback
   */
  protected setDefaultEvent (type: string, callback: Function): void {
    if (!(type in this.listeners)) {
      this.listeners[type] = []
    }
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
    if (!(type in this.listeners)) {
      this.listeners[type] = []
    }
    const listener: PseudoEventListener = new PseudoEventListener(type, options, (callback.handleEvent || callback).bind(this), callback)
    this.listeners[type].push(listener)
    // Listeners run in the order they were added, except that listeners which are not defaults always come before the defaults
    this.listeners[type] = [].concat(
      this.listeners[type].filter(registered => !registered.isDefault),
      this.listeners[type].filter(registered => registered.isDefault)
    )
  }

  public removeEventListener (type: string, callback: Function): void {
    if (!(type in this.listeners)) {
      return
    }
    this.listeners[type] = this.listeners[type].filter(listener => listener.isDefault || listener.callback !== callback)
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

/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoEvent from './PseudoEvent'
import PseudoEventListener from './PseudoEventListener'
import Stack from 'collect-your-stuff/dist/collections/stack/Stack'
import Stackable from 'collect-your-stuff/dist/collections/stack/Stackable'

export type listenerOptions = { capture: boolean, once: boolean, passive: boolean }

type registeredListeners = { [key: string]: Stack }

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
class PseudoEventTarget {
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
   *
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  private runEvents (event: PseudoEvent): boolean {
    if (!(event.type in this.listeners)) {
      return true
    }
    /**
     *
     * @type {Array<PseudoEventListener>}
     */
    const stack: Stack = this.listeners[event.type]
    let eventReturn = null
    if (this.listeners[event.type].empty()) {
      return eventReturn
    }
    let currentListener: Stackable | any | null = this.listeners[event.type].top()
    if (currentListener === null) {
      return eventReturn
    }
    if (event.inner.immediatePropagationStopped || currentListener.task.rejectEvent(event)) {
      return eventReturn
    }
    // Temporary store the stack
    const runningListeners: Stack = new Stack()
    currentListener = this.listeners[event.type].pop()
    while (currentListener !== null) {
      eventReturn = currentListener.task.handleEvent(event)
      if (currentListener.data.once) {
        return currentListener.task
      }
      runningListeners.push(currentListener)
      currentListener = this.listeners[event.type].top()
      if (currentListener === null) {
        return eventReturn
      }
      if (event.inner.immediatePropagationStopped || currentListener.task.rejectEvent(event)) {
        return eventReturn
      }
      currentListener = this.listeners[event.type].pop()
    }
    if (!runningListeners.empty()) {
      // Rebuild the stack
      let completedListener = runningListeners.pop()
      while (completedListener !== null) {
        this.listeners[event.type].push(completedListener)
      }
    }
    return eventReturn
  }

  /**
   *
   * @param {string} type
   * @param {Function} callback
   */
  protected setDefaultEvent (type: string, callback: Function) {
    if (!(type in this.listeners)) {
      this.listeners[type] = new Stack()
    }
    this.defaultEvent[type] = callback
  }

  /**
   *
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  private runDefaultEvent (event: PseudoEvent): boolean {
    if (event.defaultPrevented) {
      return false
    }
    this.defaultEvent[event.type](event)
  }

  /**
   *
   * @param {PseudoEvent} eventType
   * @returns {boolean}
   */
  private startEvents (eventType: string): boolean {
    /**
     * type PseudoEvent
     */
    const event: PseudoEvent = new PseudoEvent(eventType)
    event.inner.target = this
    console.log('startEvents', event.type, event.target)
    ;[
      PseudoEvent.CAPTURING_PHASE,
      PseudoEvent.AT_TARGET,
      PseudoEvent.BUBBLING_PHASE
    ].forEach(phase => {
      let continueEvents = null
      if (phase === PseudoEvent.AT_TARGET || !event.inner.propagationStopped) {
        event.inner.eventPhase = phase
        event.composedPath().forEach(target => {
          event.inner.currentTarget = target
          continueEvents = event.currentTarget.runEvents(event)
        })
      }
      if (event.eventPhase === PseudoEvent.AT_TARGET && typeof continueEvents !== 'boolean' && this.defaultEvent[eventType]) {
        this.runDefaultEvent(event)
      }
    })
    return true
  }

  /**
   *
   * @param {string} type
   * @param {function|Object} callback
   * @param {boolean|Object} [useCapture=false]
   */
  public addEventListener (type: string, callback: Function | {
    handleEvent: Function
  } | any, useCapture: listenerOptions | boolean = false) {
    let options: listenerOptions = { capture: false, once: false, passive: false }
    if (typeof useCapture === 'object') {
      // Originally useCapture was a single boolean flag, later optional other flags can be used
      // Here we take all the given flags from the object and assign them as the options
      options = Object.keys(useCapture).reduce((opts, opt: keyof listenerOptions) => {
        opts[opt] = useCapture[opt]
        return opts
      }, options)
    } else {
      options.capture = useCapture
    }
    if (!(type in this.listeners)) {
      this.listeners[type] = new Stack()
    }
    const listener: PseudoEventListener = new PseudoEventListener(type, options, (callback.handleEvent || callback).bind(this))
    this.listeners[type].push(listener)
    const defaultListeners = []
    const explicitListeners = []
    let currentListener: Stackable | any = this.listeners[type].pop()
    while (currentListener !== null) {
      if (currentListener.task.isDefault) {
        defaultListeners.push(currentListener)
      } else {
        explicitListeners.push(currentListener)
      }
      currentListener = this.listeners[type].pop()
    }
    this.listeners[type] = Stack.fromArray([].concat(explicitListeners, defaultListeners))
  }

  /**
   *
   * @param {string} type
   * @param {function} callback
   */
  public removeEventListener (type: string, callback: Function) {
    if (!(type in this.listeners)) {
      return
    }
    const stack: Stack = this.listeners[type]
    let currentListener: Stackable | any = stack.pop()
    const checkedListeners = []
    while (currentListener !== null) {
      const listener = currentListener.task
      if (listener.handleEvent === callback && !listener.isDefault) {
        continue
      }
      checkedListeners.push(currentListener)
    }
    this.listeners[type] = Stack.fromArray(checkedListeners)
  }

  /**
   *
   * @param {Event|PseudoEvent} event
   * @param {EventTarget|PseudoEventTarget} target
   * @returns {boolean}
   */
  public dispatchEvent (event: PseudoEvent, target: PseudoEventTarget = this): boolean {
    event.inner.target = target
    if (!(event.type in this.listeners)) {
      return true
    }
    this.runEvents(event)
    return !event.defaultPrevented
  }
}

export default PseudoEventTarget

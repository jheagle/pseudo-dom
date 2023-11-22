'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
require('core-js/modules/esnext.async-iterator.for-each.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.for-each.js')
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.reduce.js')
var _PseudoEvent = _interopRequireDefault(require('./PseudoEvent'))
var _PseudoEventListener = _interopRequireDefault(require('./PseudoEventListener'))
var _Stack = _interopRequireDefault(require('collect-your-stuff/dist/collections/stack/Stack'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

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
  runEvents (event) {
    if (!(event.type in this.listeners)) {
      return true
    }
    /**
     *
     * @type {Array<PseudoEventListener>}
     */
    const stack = this.listeners[event.type]
    let eventReturn = null
    if (this.listeners[event.type].empty()) {
      return eventReturn
    }
    let currentListener = this.listeners[event.type].top()
    if (currentListener === null) {
      return eventReturn
    }
    if (event.inner.immediatePropagationStopped || currentListener.task.rejectEvent(event)) {
      return eventReturn
    }
    // Temporary store the stack
    const runningListeners = new _Stack.default()
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
      const completedListener = runningListeners.pop()
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
  setDefaultEvent (type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = new _Stack.default()
    }
    this.defaultEvent[type] = callback
  }

  /**
   *
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  runDefaultEvent (event) {
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
  startEvents (eventType) {
    /**
     * type PseudoEvent
     */
    const event = new _PseudoEvent.default(eventType)
    event.inner.target = this
    console.log('startEvents', event.type, event.target);
    [_PseudoEvent.default.CAPTURING_PHASE, _PseudoEvent.default.AT_TARGET, _PseudoEvent.default.BUBBLING_PHASE].forEach(phase => {
      let continueEvents = null
      if (phase === _PseudoEvent.default.AT_TARGET || !event.inner.propagationStopped) {
        event.inner.eventPhase = phase
        event.composedPath().forEach(target => {
          event.inner.currentTarget = target
          continueEvents = event.currentTarget.runEvents(event)
        })
      }
      if (event.eventPhase === _PseudoEvent.default.AT_TARGET && typeof continueEvents !== 'boolean' && this.defaultEvent[eventType]) {
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
  addEventListener (type, callback) {
    const useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
    let options = {
      capture: false,
      once: false,
      passive: false
    }
    if (typeof useCapture === 'object') {
      // Originally useCapture was a single boolean flag, later optional other flags can be used
      // Here we take all the given flags from the object and assign them as the options
      options = Object.keys(useCapture).reduce((opts, opt) => {
        opts[opt] = useCapture[opt]
        return opts
      }, options)
    } else {
      options.capture = useCapture
    }
    if (!(type in this.listeners)) {
      this.listeners[type] = new _Stack.default()
    }
    const listener = new _PseudoEventListener.default(type, options, (callback.handleEvent || callback).bind(this))
    this.listeners[type].push(listener)
    const defaultListeners = []
    const explicitListeners = []
    let currentListener = this.listeners[type].pop()
    while (currentListener !== null) {
      if (currentListener.task.isDefault) {
        defaultListeners.push(currentListener)
      } else {
        explicitListeners.push(currentListener)
      }
      currentListener = this.listeners[type].pop()
    }
    this.listeners[type] = _Stack.default.fromArray([].concat(explicitListeners, defaultListeners))
  }

  /**
   *
   * @param {string} type
   * @param {function} callback
   */
  removeEventListener (type, callback) {
    if (!(type in this.listeners)) {
      return
    }
    const stack = this.listeners[type]
    const currentListener = stack.pop()
    const checkedListeners = []
    while (currentListener !== null) {
      const listener = currentListener.task
      if (listener.handleEvent === callback && !listener.isDefault) {
        continue
      }
      checkedListeners.push(currentListener)
    }
    this.listeners[type] = _Stack.default.fromArray(checkedListeners)
  }

  /**
   *
   * @param {Event|PseudoEvent} event
   * @param {EventTarget|PseudoEventTarget} target
   * @returns {boolean}
   */
  dispatchEvent (event) {
    const target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
    event.inner.target = target
    if (!(event.type in this.listeners)) {
      return true
    }
    this.runEvents(event)
    return !event.defaultPrevented
  }
}
var _default = exports.default = PseudoEventTarget

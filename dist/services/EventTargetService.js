'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
require('core-js/modules/esnext.iterator.for-each.js')
const __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule
    ? mod
    : {
        default: mod
      }
}
Object.defineProperty(exports, '__esModule', {
  value: true
})
/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const EventService_1 = require('./EventService')
const PseudoEventListener_1 = __importDefault(require('../classes/PseudoEventListener'))
/**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {Object.<string, Array.<PseudoEventListener>>} listeners
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */
class EventTargetService {
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
  runEvents (event) {
    if (!(event.type in this.listeners)) {
      return true
    }
    const stack = this.listeners[event.type]
    let eventReturn = null
    if (stack.length === 0) {
      return eventReturn
    }
    if (event.inner.immediatePropagationStopped || stack[0].rejectEvent(event)) {
      return eventReturn
    }
    // Temporarily hold the listeners which have run
    const runningListeners = []
    let currentListener = stack.shift()
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
  setDefaultEvent (type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = []
    }
    this.defaultEvent[type] = callback
  }

  runDefaultEvent (event) {
    if (event.defaultPrevented) {
      return false
    }
    this.defaultEvent[event.type](event)
    return true
  }

  startEvents (eventType) {
    const event = new EventService_1.EventService(eventType)
    event.inner.target = this;
    [EventService_1.EventService.CAPTURING_PHASE, EventService_1.EventService.AT_TARGET, EventService_1.EventService.BUBBLING_PHASE].forEach(phase => {
      let continueEvents = null
      if (phase === EventService_1.EventService.AT_TARGET || !event.inner.propagationStopped) {
        event.inner.eventPhase = phase
        event.composedPath().forEach(target => {
          event.inner.currentTarget = target
          continueEvents = event.currentTarget.runEvents(event)
        })
      }
      if (event.eventPhase === EventService_1.EventService.AT_TARGET && typeof continueEvents !== 'boolean' && this.defaultEvent[eventType]) {
        this.runDefaultEvent(event)
      }
    })
    return true
  }

  addEventListener (type, callback, useCapture = false) {
    let options = {
      capture: false,
      once: false,
      passive: false
    }
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
    const listener = new PseudoEventListener_1.default(type, options, (callback.handleEvent || callback).bind(this), callback)
    this.listeners[type].push(listener)
    // Listeners run in the order they were added, except that listeners which are not defaults always come before the defaults
    this.listeners[type] = [].concat(this.listeners[type].filter(registered => !registered.isDefault), this.listeners[type].filter(registered => registered.isDefault))
  }

  removeEventListener (type, callback) {
    if (!(type in this.listeners)) {
      return
    }
    this.listeners[type] = this.listeners[type].filter(listener => listener.isDefault || listener.callback !== callback)
  }

  dispatchEvent (event, target = this) {
    event.inner.target = target
    if (!(event.type in this.listeners)) {
      return true
    }
    this.runEvents(event)
    return !event.defaultPrevented
  }
}
exports.default = EventTargetService

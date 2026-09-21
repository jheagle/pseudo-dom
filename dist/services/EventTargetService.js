'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
require('core-js/modules/esnext.iterator.find.js')
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
const LinkedList_1 = require('collect-your-stuff/dist/collections/linked-list/LinkedList')
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
   * The listeners registered for a type of event, creating the (empty) list of them when there are none yet.
   * @param {string} type
   * @returns {LinkedList}
   */
  listenersFor (type) {
    if (!(type in this.listeners)) {
      this.listeners[type] = new LinkedList_1.LinkedList()
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
  runEvents (event) {
    if (!(event.type in this.listeners)) {
      return true
    }
    const listeners = this.listeners[event.type]
    let eventReturn = null
    // Work from a copy of the linkers so that removing a listener (for example a once listener) does not disturb the walk
    for (const linker of Array.from(listeners)) {
      const listener = linker.data
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
  setDefaultEvent (type, callback) {
    this.listenersFor(type)
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
    const listener = new PseudoEventListener_1.default(type, options, (callback.handleEvent || callback).bind(this), callback)
    const listeners = this.listenersFor(type)
    // Listeners run in the order they were added, except that listeners which are not defaults always come before the defaults
    const firstDefault = Array.from(listeners).find(linker => linker.data.isDefault)
    if (firstDefault && !listener.isDefault) {
      listeners.insertBefore(firstDefault, listener)
    } else {
      listeners.append(listener)
    }
  }

  removeEventListener (type, callback) {
    if (!(type in this.listeners)) {
      return
    }
    const listeners = this.listeners[type]
    Array.from(listeners).filter(linker => !linker.data.isDefault && linker.data.callback === callback).forEach(linker => listeners.remove(linker))
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

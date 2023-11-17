'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
require('core-js/modules/esnext.async-iterator.for-each.js')
require('core-js/modules/esnext.iterator.for-each.js')
var _PseudoEvent = _interopRequireDefault(require('./PseudoEvent'))
var _PseudoEventListener = _interopRequireDefault(require('./PseudoEventListener'))
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
    this.listeners = []
    this.defaultEvent = []
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
    this.listeners[event.type] = stack.reduce(
    /**
     *
     * @param {Array<PseudoEventListener>} listeners
     * @param {PseudoEventListener} listener
     * @returns {Array<PseudoEventListener>}
     */
      (listeners, listener) => {
        if (event.immediatePropagationStopped || listener.rejectEvent(event)) {
          return listeners.concat(listener)
        }
        eventReturn = listener.handleEvent(event)
        if (listener.eventOptions.once) {
          event.currentTarget.removeEventListener(event.eventType, event.handleEvent)
          return listeners
        }
        return listeners.concat(listener)
      }, [])
    return eventReturn
  }

  /**
   *
   * @param {string} type
   * @param {Function} callback
   */
  setDefaultEvent (type, callback) {
    if (!(type in this.listeners)) {
      this[type] = () => this.startEvents(type)
      this.listeners[type] = []
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
    event.setReadOnlyProperties({
      target: this
    })
    console.log('startEvents', event.type, event.target);
    [_PseudoEvent.default.CAPTURING_PHASE, _PseudoEvent.default.AT_TARGET, _PseudoEvent.default.BUBBLING_PHASE].forEach(phase => {
      let continueEvents = null
      if (phase === _PseudoEvent.default.AT_TARGET || !event.propagationStopped) {
        event.setReadOnlyProperties({
          eventPhase: phase
        })
        event.composedPath().forEach(target => {
          event.setReadOnlyProperties({
            currentTarget: target
          })
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
      options = Object.keys(useCapture).reduce((opts, opt) => {
        opts[opt] = useCapture[opt]
        return opts
      }, options)
    } else {
      options.capture = useCapture
    }
    if (!(type in this.listeners)) {
      this[type] = () => this.startEvents(type)
      this.listeners[type] = []
    }
    this.listeners[type] = this.listeners[type].concat([Object.assign(Object.create(_PseudoEventListener.default), _PseudoEventListener.default, {
      eventType: type,
      eventOptions: Object.assign({}, _PseudoEventListener.default.eventOptions, options),
      handleEvent: (callback.handleEvent || callback).bind(this)
    })])
    const groupedDefault = this.listeners[type].reduce((listeners, listener) => listener.isDefault ? Object.assign({}, listeners, {
      default: listeners.default.concat([listener])
    }) : Object.assign({}, listeners, {
      explicit: listeners.explicit.concat([listener])
    }), {
      explicit: [],
      default: []
    })
    this.listeners[type] = [].concat(groupedDefault.explicit, groupedDefault.default)
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
    for (let i = 0, l = stack.length; i < l; i++) {
      if (stack[i].handleEvent === callback && !stack[i].isDefault) {
        stack.splice(i, 1)
        return
      }
    }
  }

  /**
   *
   * @param {Event|PseudoEvent} event
   * @param {EventTarget|PseudoEventTarget} target
   * @returns {boolean}
   */
  dispatchEvent (event) {
    const target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
    event.setReadOnlyProperties({
      target
    })
    if (!(event.type in this.listeners)) {
      return true
    }
    this.runEvents(event)
    return !event.defaultPrevented
  }
}
var _default = exports.default = PseudoEventTarget

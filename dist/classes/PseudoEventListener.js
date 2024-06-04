'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _PseudoEvent = _interopRequireDefault(require('../interfaces/PseudoEvent'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

/**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventType
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
class PseudoEventListener {
  constructor (eventType) {
    const {
      capture = false,
      once = false,
      passive = false
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
    const handleEvent = arguments.length > 2 ? arguments[2] : undefined
    this.eventOptions = {
      capture: false,
      once: false,
      passive: false
    }
    this.eventType = ''
    this.isDefault = false
    this.eventOptions = {
      capture,
      once,
      passive
    }
    this.eventType = eventType
    this.handler = handleEvent
  }

  get once () {
    return this.eventOptions.once
  }

  /**
   * @method
   * @name PseudoEventListener#handleEvent
   * @param {PseudoEvent} event
   * @returns {*}
   */
  handleEvent (event) {
    return this.handler(event)
  }

  /**
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doCapturePhase (event) {
    return event.eventPhase === _PseudoEvent.default.CAPTURING_PHASE && this.eventOptions.capture
  }

  /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doTargetPhase (event) {
    return event.eventPhase === _PseudoEvent.default.AT_TARGET
  }

  /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  doBubblePhase (event) {
    return event.eventPhase === _PseudoEvent.default.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
  }

  /**
   * @method
   * @name PseudoEventListener#skipPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  skipPhase (event) {
    return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
  }

  /**
   * @method
   * @name PseudoEventListener#skipDefault
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  skipDefault (event) {
    return this.isDefault && event.defaultPrevented
  }

  /**
   * @method
   * @name PseudoEventListener#stopPropagation
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  stopPropagation (event) {
    return !this.doTargetPhase(event) && event.inner.propagationStopped
  }

  /**
   * @method
   * @name PseudoEventListener#nonPassiveHalt
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  nonPassiveHalt (event) {
    return !this.eventOptions.passive && (this.skipDefault(event) || event.inner.immediatePropagationStopped || this.stopPropagation(event))
  }

  /**
   * @method
   * @name PseudoEventListener#rejectEvent
   * @param {PseudoEvent} event
   * @returns {*|boolean}
   */
  rejectEvent (event) {
    return this.nonPassiveHalt(event) || this.skipPhase(event)
  }
}
var _default = exports.default = PseudoEventListener

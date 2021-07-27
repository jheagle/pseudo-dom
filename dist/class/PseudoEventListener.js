'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.PseudoEventListener = void 0

const _PseudoEvent = require('./PseudoEvent')

/**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

/**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventTypes
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
const PseudoEventListener = {
  eventType: '',
  eventOptions: {
    capture: false,
    once: false,
    passive: false
  },
  isDefault: false,

  /**
   * @method
   * @name PseudoEventListener#handleEvent
   * @param {PseudoEvent} event
   * @returns {undefined}
   */
  handleEvent: function handleEvent (event) {
    return undefined
  },

  /**
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doCapturePhase: function doCapturePhase (event) {
    return event.eventPhase === _PseudoEvent.PseudoEvent.CAPTURING_PHASE && this.eventOptions.capture
  },

  /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doTargetPhase: function doTargetPhase (event) {
    return event.eventPhase === _PseudoEvent.PseudoEvent.AT_TARGET
  },

  /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  doBubblePhase: function doBubblePhase (event) {
    return event.eventPhase === _PseudoEvent.PseudoEvent.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
  },

  /**
   * @method
   * @name PseudoEventListener#skipPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  skipPhase: function skipPhase (event) {
    return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
  },

  /**
   * @method
   * @name PseudoEventListener#skipDefault
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  skipDefault: function skipDefault (event) {
    return this.isDefault && event.defaultPrevented
  },

  /**
   * @method
   * @name PseudoEventListener#stopPropagation
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  stopPropagation: function stopPropagation (event) {
    return !this.doTargetPhase(event) && event.propagationStopped
  },

  /**
   * @method
   * @name PseudoEventListener#nonPassiveHalt
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  nonPassiveHalt: function nonPassiveHalt (event) {
    return !this.eventOptions.passive && (this.skipDefault(event) || event.immediatePropagationStopped || this.stopPropagation(event))
  },

  /**
   * @method
   * @name PseudoEventListener#rejectEvent
   * @param {PseudoEvent} event
   * @returns {*|boolean}
   */
  rejectEvent: function rejectEvent (event) {
    return this.nonPassiveHalt(event) || this.skipPhase(event)
  }
}
exports.PseudoEventListener = PseudoEventListener

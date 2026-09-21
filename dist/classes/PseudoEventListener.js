'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
/**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const EventService_1 = require('../services/EventService')
/**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventType
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
class PseudoEventListener {
  constructor (eventType, {
    capture = false,
    once = false,
    passive = false
  } = {}, handleEvent, originalCallback = handleEvent) {
    this.eventOptions = {
      capture: false,
      once: false,
      passive: false
    }
    this.eventType = ''
    this.defaultListener = false
    this.eventOptions = {
      capture,
      once,
      passive
    }
    this.eventType = eventType
    this.handler = handleEvent
    this.originalCallback = originalCallback
  }

  /**
   * The function (or object with handleEvent) which was originally given when registering, used to find this listener again for removal.
   */
  get callback () {
    return this.originalCallback
  }

  get isDefault () {
    return this.defaultListener
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
    return event.eventPhase === EventService_1.EventService.CAPTURING_PHASE && this.eventOptions.capture
  }

  /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doTargetPhase (event) {
    return event.eventPhase === EventService_1.EventService.AT_TARGET
  }

  /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  doBubblePhase (event) {
    return event.eventPhase === EventService_1.EventService.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
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
exports.default = PseudoEventListener

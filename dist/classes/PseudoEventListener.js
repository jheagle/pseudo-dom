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
  /**
   * @param {string} eventType The type of event this listens for
   * @param {Object} [options] The capture, once and passive options
   * @param {Function} handleEvent The function which is called with the event, already bound to what it should run as
   * @param {Function} [originalCallback=handleEvent] The function (or object) which was given when registering, used to find this listener again
   * @constructor
   */
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
    this.isRemoved = false
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

  /** Whether this listener listens in the capture phase (and at the target) rather than in the bubble phase. */
  get capture () {
    return this.eventOptions.capture
  }

  get isDefault () {
    return this.defaultListener
  }

  get once () {
    return this.eventOptions.once
  }

  /** Whether the listener promises not to prevent the default (preventDefault does nothing while it runs). */
  get passive () {
    return this.eventOptions.passive
  }

  /** Whether this listener has been removed, a removed listener does not run even if the event already started. */
  get removed () {
    return this.isRemoved
  }

  set removed (removed) {
    this.isRemoved = removed
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
   * A capture listener runs while the event travels down to the target.
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doCapturePhase (event) {
    return event.eventPhase === EventService_1.EventService.CAPTURING_PHASE && this.eventOptions.capture
  }

  /**
   * Every listener of the target itself runs, capture listeners first.
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doTargetPhase (event) {
    return event.eventPhase === EventService_1.EventService.AT_TARGET
  }

  /**
   * A listener which is not a capture listener runs while the event travels back up (when it bubbles).
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doBubblePhase (event) {
    return event.eventPhase === EventService_1.EventService.BUBBLING_PHASE && !this.eventOptions.capture
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
   * Whether this listener should not run for the event as it is now (it was removed, or it is for another phase).
   * Stopping propagation is handled by the dispatching, since it stops other targets and not the listeners of the
   * current one.
   * @method
   * @name PseudoEventListener#rejectEvent
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  rejectEvent (event) {
    return this.isRemoved || this.skipPhase(event)
  }
}
exports.default = PseudoEventListener

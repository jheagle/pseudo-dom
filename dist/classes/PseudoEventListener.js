'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
/**
 * Substitute for the DOM EventEventListener Class.
 */
const EventService_1 = require('../services/EventService')
/**
 * Handle events as they are stored and implemented.
 */
class PseudoEventListener {
  /**
   * @param eventType The type of event this listens for
   * @param options The capture, once and passive options
   * @param handleEvent The function which is called with the event, already bound to what it should run as
   * @param originalCallback The function (or object) which was given when registering, used to find this listener again
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
   * @param event
   */
  handleEvent (event) {
    return this.handler(event)
  }

  /**
   * A capture listener runs while the event travels down to the target.
   * @param event
   */
  doCapturePhase (event) {
    return event.eventPhase === EventService_1.EventService.CAPTURING_PHASE && this.eventOptions.capture
  }

  /**
   * Every listener of the target itself runs, capture listeners first.
   * @param event
   */
  doTargetPhase (event) {
    return event.eventPhase === EventService_1.EventService.AT_TARGET
  }

  /**
   * A listener which is not a capture listener runs while the event travels back up (when it bubbles).
   * @param event
   */
  doBubblePhase (event) {
    return event.eventPhase === EventService_1.EventService.BUBBLING_PHASE && !this.eventOptions.capture
  }

  /**
   * @param event
   */
  skipPhase (event) {
    return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
  }

  /**
   * Whether this listener should not run for the event as it is now (it was removed, or it is for another phase).
   * Stopping propagation is handled by the dispatching, since it stops other targets and not the listeners of the
   * current one.
   * @param event
   */
  rejectEvent (event) {
    return this.isRemoved || this.skipPhase(event)
  }
}
exports.default = PseudoEventListener

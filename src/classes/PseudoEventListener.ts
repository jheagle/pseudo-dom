/**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoEvent from './PseudoEvent'
import { listenerOptions } from './PseudoEventTarget'

/**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventType
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
class PseudoEventListener {
  private eventOptions: listenerOptions = {
    capture: false,
    once: false,
    passive: false
  }
  private eventType: string = ''
  private handler: Function
  private isDefault: boolean = false

  constructor (eventType: string, { capture = false, once = false, passive = false } = {}, handleEvent: Function) {
    this.eventOptions = { capture, once, passive }
    this.eventType = eventType
    this.handler = handleEvent
  }

  get once (): boolean {
    return this.eventOptions.once
  }

  /**
   * @method
   * @name PseudoEventListener#handleEvent
   * @param {PseudoEvent} event
   * @returns {*}
   */
  handleEvent (event: PseudoEvent): any {
    return this.handler(event)
  }

  /**
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doCapturePhase (event: PseudoEvent): boolean {
    return event.eventPhase === PseudoEvent.CAPTURING_PHASE && this.eventOptions.capture
  }

  /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doTargetPhase (event: PseudoEvent): boolean {
    return event.eventPhase === PseudoEvent.AT_TARGET
  }

  /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  doBubblePhase (event: PseudoEvent): boolean | any {
    return event.eventPhase === PseudoEvent.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
  }

  /**
   * @method
   * @name PseudoEventListener#skipPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  skipPhase (event: PseudoEvent): boolean {
    return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
  }

  /**
   * @method
   * @name PseudoEventListener#skipDefault
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  skipDefault (event: PseudoEvent): boolean | any {
    return this.isDefault && event.defaultPrevented
  }

  /**
   * @method
   * @name PseudoEventListener#stopPropagation
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  stopPropagation (event: PseudoEvent): boolean {
    return !this.doTargetPhase(event) && event.inner.propagationStopped
  }

  /**
   * @method
   * @name PseudoEventListener#nonPassiveHalt
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  nonPassiveHalt (event: PseudoEvent): boolean | any {
    return !this.eventOptions.passive && (this.skipDefault(event) ||
      event.inner.immediatePropagationStopped ||
      this.stopPropagation(event)
    )
  }

  /**
   * @method
   * @name PseudoEventListener#rejectEvent
   * @param {PseudoEvent} event
   * @returns {*|boolean}
   */
  rejectEvent (event: PseudoEvent): any | boolean {
    return this.nonPassiveHalt(event) || this.skipPhase(event)
  }
}

export default PseudoEventListener

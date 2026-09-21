/**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { EventService } from '../services/EventService'
import { listenerOptions } from '../interfaces/PseudoEventTarget'

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
  private readonly originalCallback: Function
  private readonly defaultListener: boolean = false

  constructor (eventType: string, { capture = false, once = false, passive = false } = {}, handleEvent: Function, originalCallback: Function = handleEvent) {
    this.eventOptions = { capture, once, passive }
    this.eventType = eventType
    this.handler = handleEvent
    this.originalCallback = originalCallback
  }

  /**
   * The function (or object with handleEvent) which was originally given when registering, used to find this listener again for removal.
   */
  get callback (): Function {
    return this.originalCallback
  }

  get isDefault (): boolean {
    return this.defaultListener
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
  handleEvent (event: EventService): any {
    return this.handler(event)
  }

  /**
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doCapturePhase (event: EventService): boolean {
    return event.eventPhase === EventService.CAPTURING_PHASE && this.eventOptions.capture
  }

  /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  doTargetPhase (event: EventService): boolean {
    return event.eventPhase === EventService.AT_TARGET
  }

  /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  doBubblePhase (event: EventService): boolean | any {
    return event.eventPhase === EventService.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
  }

  /**
   * @method
   * @name PseudoEventListener#skipPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  skipPhase (event: EventService): boolean {
    return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
  }

  /**
   * @method
   * @name PseudoEventListener#skipDefault
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  skipDefault (event: EventService): boolean | any {
    return this.isDefault && event.defaultPrevented
  }

  /**
   * @method
   * @name PseudoEventListener#stopPropagation
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
  stopPropagation (event: EventService): boolean {
    return !this.doTargetPhase(event) && event.inner.propagationStopped
  }

  /**
   * @method
   * @name PseudoEventListener#nonPassiveHalt
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
  nonPassiveHalt (event: EventService): boolean | any {
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
  rejectEvent (event: EventService): any | boolean {
    return this.nonPassiveHalt(event) || this.skipPhase(event)
  }
}

export default PseudoEventListener

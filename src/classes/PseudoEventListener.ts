/**
 * Substitute for the DOM EventEventListener Class.
 */
import { EventService } from '../services/EventService'
import { listenerOptions } from '../interfaces/PseudoEventTarget'

/**
 * Handle events as they are stored and implemented.
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
  private isRemoved: boolean = false

  /**
   * @param eventType The type of event this listens for
   * @param options The capture, once and passive options
   * @param handleEvent The function which is called with the event, already bound to what it should run as
   * @param originalCallback The function (or object) which was given when registering, used to find this listener again
   */
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

  /** Whether this listener listens in the capture phase (and at the target) rather than in the bubble phase. */
  get capture (): boolean {
    return this.eventOptions.capture
  }

  get isDefault (): boolean {
    return this.defaultListener
  }

  get once (): boolean {
    return this.eventOptions.once
  }

  /** Whether the listener promises not to prevent the default (preventDefault does nothing while it runs). */
  get passive (): boolean {
    return this.eventOptions.passive
  }

  /** Whether this listener has been removed, a removed listener does not run even if the event already started. */
  get removed (): boolean {
    return this.isRemoved
  }

  set removed (removed: boolean) {
    this.isRemoved = removed
  }

  /**
   * @param event
   */
  handleEvent (event: EventService): any {
    return this.handler(event)
  }

  /**
   * A capture listener runs while the event travels down to the target.
   * @param event
   */
  doCapturePhase (event: EventService): boolean {
    return event.eventPhase === EventService.CAPTURING_PHASE && this.eventOptions.capture
  }

  /**
   * Every listener of the target itself runs, capture listeners first.
   * @param event
   */
  doTargetPhase (event: EventService): boolean {
    return event.eventPhase === EventService.AT_TARGET
  }

  /**
   * A listener which is not a capture listener runs while the event travels back up (when it bubbles).
   * @param event
   */
  doBubblePhase (event: EventService): boolean {
    return event.eventPhase === EventService.BUBBLING_PHASE && !this.eventOptions.capture
  }

  /**
   * @param event
   */
  skipPhase (event: EventService): boolean {
    return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
  }

  /**
   * Whether this listener should not run for the event as it is now (it was removed, or it is for another phase).
   * Stopping propagation is handled by the dispatching, since it stops other targets and not the listeners of the
   * current one.
   * @param event
   */
  rejectEvent (event: EventService): boolean {
    return this.isRemoved || this.skipPhase(event)
  }
}

export default PseudoEventListener

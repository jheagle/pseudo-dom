/**
 * Substitute for the DOM CustomEvent Class.
 */
import { EventService } from './EventService'

/**
 * The options for creating a custom event.
 */
export type CustomEventInit = {
  bubbles?: boolean,
  cancelable?: boolean,
  composed?: boolean,
  /** Whatever data the event should carry (default null) */
  detail?: any
}

/**
 * Simulate the behaviour of the CustomEvent Class when there is no DOM available: an event which carries data.
 */
export class CustomEventService extends EventService {
  private readonly eventDetail: any

  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg: string = '', init: CustomEventInit = {}) {
    super(typeArg, init)
    this.eventDetail = typeof init.detail === 'undefined' ? null : init.detail
  }

  get detail (): any {
    return this.eventDetail
  }
}

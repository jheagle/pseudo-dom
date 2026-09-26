/**
 * Substitute for the DOM UIEvent Class.
 */
import { EventService } from './EventService'

/**
 * The options for creating an event, on top of the ones every event has.
 */
export type UIEventInit = {
  bubbles?: boolean,
  cancelable?: boolean,
  composed?: boolean,
  /** Details about the event, such as how many times the mouse was clicked (default 0) */
  detail?: number,
  /** The window the event happened in (default null) */
  view?: any
}

/**
 * Simulate the behaviour of the UIEvent Class when there is no DOM available: the events which come from a user
 * interface (the mouse, the keyboard, focus and input).
 */
export class UIEventService extends EventService {
  private readonly uiDetail: number
  private readonly uiView: any

  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg: string = '', init: UIEventInit = {}) {
    super(typeArg, init)
    this.uiDetail = init.detail || 0
    this.uiView = init.view || null
  }

  get detail (): number {
    return this.uiDetail
  }

  get view (): any {
    return this.uiView
  }
}

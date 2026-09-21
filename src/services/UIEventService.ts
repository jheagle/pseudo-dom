/**
 * @file Substitute for the DOM UIEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { EventService } from './EventService'

/**
 * The options for creating an event, on top of the ones every event has.
 * @typedef {Object} UIEventInit
 * @property {boolean} [bubbles=false]
 * @property {boolean} [cancelable=false]
 * @property {boolean} [composed=false]
 * @property {number} [detail=0] Details about the event, such as how many times the mouse was clicked
 * @property {*} [view=null] The window the event happened in
 */
export type UIEventInit = { bubbles?: boolean, cancelable?: boolean, composed?: boolean, detail?: number, view?: any }

/**
 * Simulate the behaviour of the UIEvent Class when there is no DOM available: the events which come from a user
 * interface (the mouse, the keyboard, focus and input).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments EventService
 * @property {number} detail
 * @property {*} view
 */
export class UIEventService extends EventService {
  private readonly uiDetail: number
  private readonly uiView: any

  /**
   * @param {string} [typeArg=''] The type of the event
   * @param {UIEventInit} [init={}] The options for the event
   * @constructor
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

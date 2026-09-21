/**
 * @file Substitute for the DOM CustomEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { EventService } from './EventService'

/**
 * The options for creating a custom event.
 * @typedef {Object} CustomEventInit
 * @property {boolean} [bubbles=false]
 * @property {boolean} [cancelable=false]
 * @property {boolean} [composed=false]
 * @property {*} [detail=null] Whatever data the event should carry
 */
export type CustomEventInit = { bubbles?: boolean, cancelable?: boolean, composed?: boolean, detail?: any }

/**
 * Simulate the behaviour of the CustomEvent Class when there is no DOM available: an event which carries data.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments EventService
 * @property {*} detail
 */
export class CustomEventService extends EventService {
  private readonly eventDetail: any

  /**
   * @param {string} [typeArg=''] The type of the event
   * @param {CustomEventInit} [init={}] The options for the event
   * @constructor
   */
  constructor (typeArg: string = '', init: CustomEventInit = {}) {
    super(typeArg, init)
    this.eventDetail = typeof init.detail === 'undefined' ? null : init.detail
  }

  get detail (): any {
    return this.eventDetail
  }
}

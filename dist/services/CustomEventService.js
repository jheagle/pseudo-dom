'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.CustomEventService = void 0
/**
 * Substitute for the DOM CustomEvent Class.
 */
const EventService_1 = require('./EventService')
/**
 * Simulate the behaviour of the CustomEvent Class when there is no DOM available: an event which carries data.
 */
class CustomEventService extends EventService_1.EventService {
  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg = '', init = {}) {
    super(typeArg, init)
    this.eventDetail = typeof init.detail === 'undefined' ? null : init.detail
  }

  get detail () {
    return this.eventDetail
  }
}
exports.CustomEventService = CustomEventService

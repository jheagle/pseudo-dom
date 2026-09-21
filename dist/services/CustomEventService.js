'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.CustomEventService = void 0
/**
 * @file Substitute for the DOM CustomEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const EventService_1 = require('./EventService')
/**
 * Simulate the behaviour of the CustomEvent Class when there is no DOM available: an event which carries data.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments EventService
 * @property {*} detail
 */
class CustomEventService extends EventService_1.EventService {
  /**
   * @param {string} [typeArg=''] The type of the event
   * @param {CustomEventInit} [init={}] The options for the event
   * @constructor
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

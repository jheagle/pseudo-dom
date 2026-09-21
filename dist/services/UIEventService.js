'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.UIEventService = void 0
/**
 * @file Substitute for the DOM UIEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const EventService_1 = require('./EventService')
/**
 * Simulate the behaviour of the UIEvent Class when there is no DOM available: the events which come from a user
 * interface (the mouse, the keyboard, focus and input).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments EventService
 * @property {number} detail
 * @property {*} view
 */
class UIEventService extends EventService_1.EventService {
  /**
   * @param {string} [typeArg=''] The type of the event
   * @param {UIEventInit} [init={}] The options for the event
   * @constructor
   */
  constructor (typeArg = '', init = {}) {
    super(typeArg, init)
    this.uiDetail = init.detail || 0
    this.uiView = init.view || null
  }

  get detail () {
    return this.uiDetail
  }

  get view () {
    return this.uiView
  }
}
exports.UIEventService = UIEventService

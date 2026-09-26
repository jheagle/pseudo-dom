'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.UIEventService = void 0
/**
 * Substitute for the DOM UIEvent Class.
 */
const EventService_1 = require('./EventService')
/**
 * Simulate the behaviour of the UIEvent Class when there is no DOM available: the events which come from a user
 * interface (the mouse, the keyboard, focus and input).
 */
class UIEventService extends EventService_1.EventService {
  /**
   * @param typeArg The type of the event
   * @param init The options for the event
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

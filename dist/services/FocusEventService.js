'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.FocusEventService = void 0
/**
 * Substitute for the DOM FocusEvent Class.
 */
const UIEventService_1 = require('./UIEventService')
/**
 * Simulate the behaviour of the FocusEvent Class when there is no DOM available.
 */
class FocusEventService extends UIEventService_1.UIEventService {
  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg = '', init = {}) {
    super(typeArg, init)
    this.related = init.relatedTarget || null
  }

  get relatedTarget () {
    return this.related
  }
}
exports.FocusEventService = FocusEventService

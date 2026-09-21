'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.FocusEventService = void 0
/**
 * @file Substitute for the DOM FocusEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const UIEventService_1 = require('./UIEventService')
/**
 * Simulate the behaviour of the FocusEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {PseudoEventTarget|null} relatedTarget
 */
class FocusEventService extends UIEventService_1.UIEventService {
  /**
   * @param {string} [typeArg=''] The type of the event
   * @param {FocusEventInit} [init={}] The options for the event
   * @constructor
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

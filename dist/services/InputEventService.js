'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.InputEventService = void 0
/**
 * @file Substitute for the DOM InputEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const UIEventService_1 = require('./UIEventService')
/**
 * Simulate the behaviour of the InputEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {string|null} data
 * @property {string} inputType
 * @property {boolean} isComposing
 */
class InputEventService extends UIEventService_1.UIEventService {
  /**
   * @param {string} [typeArg=''] The type of the event
   * @param {InputEventInit} [init={}] The options for the event
   * @constructor
   */
  constructor (typeArg = '', init = {}) {
    super(typeArg, init)
    this.inputData = typeof init.data === 'string' ? init.data : null
    this.kind = init.inputType || ''
    this.composing = !!init.isComposing
  }

  get data () {
    return this.inputData
  }

  get inputType () {
    return this.kind
  }

  get isComposing () {
    return this.composing
  }
}
exports.InputEventService = InputEventService

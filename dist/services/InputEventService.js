'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.InputEventService = void 0
/**
 * Substitute for the DOM InputEvent Class.
 */
const UIEventService_1 = require('./UIEventService')
/**
 * Simulate the behaviour of the InputEvent Class when there is no DOM available.
 */
class InputEventService extends UIEventService_1.UIEventService {
  /**
   * @param typeArg The type of the event
   * @param init The options for the event
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

'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.PointerEventService = void 0
/**
 * Substitute for the DOM PointerEvent Class.
 */
const MouseEventService_1 = require('./MouseEventService')
/**
 * Simulate the behaviour of the PointerEvent Class when there is no DOM available.
 */
class PointerEventService extends MouseEventService_1.MouseEventService {
  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg = '', init = {}) {
    super(typeArg, init)
    this.pointer = {
      pointerId: init.pointerId || 0,
      width: typeof init.width === 'number' ? init.width : 1,
      height: typeof init.height === 'number' ? init.height : 1,
      pressure: init.pressure || 0,
      pointerType: init.pointerType || '',
      isPrimary: !!init.isPrimary
    }
  }

  get pointerId () {
    return this.pointer.pointerId
  }

  get width () {
    return this.pointer.width
  }

  get height () {
    return this.pointer.height
  }

  get pressure () {
    return this.pointer.pressure
  }

  get pointerType () {
    return this.pointer.pointerType
  }

  get isPrimary () {
    return this.pointer.isPrimary
  }
}
exports.PointerEventService = PointerEventService

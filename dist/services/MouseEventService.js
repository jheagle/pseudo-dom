'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.MouseEventService = void 0
/**
 * Substitute for the DOM MouseEvent Class.
 */
const UIEventService_1 = require('./UIEventService')
const modifierState_1 = require('../functions/modifierState')
/**
 * Simulate the behaviour of the MouseEvent Class when there is no DOM available.
 */
class MouseEventService extends UIEventService_1.UIEventService {
  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg = '', init = {}) {
    super(typeArg, init)
    this.position = {
      screenX: init.screenX || 0,
      screenY: init.screenY || 0,
      clientX: init.clientX || 0,
      clientY: init.clientY || 0
    }
    this.modifiers = (0, modifierState_1.modifierKeys)(init)
    this.buttonPressed = init.button || 0
    this.buttonsDown = init.buttons || 0
    this.related = init.relatedTarget || null
  }

  get screenX () {
    return this.position.screenX
  }

  get screenY () {
    return this.position.screenY
  }

  get clientX () {
    return this.position.clientX
  }

  get clientY () {
    return this.position.clientY
  }

  get x () {
    return this.position.clientX
  }

  get y () {
    return this.position.clientY
  }

  get ctrlKey () {
    return this.modifiers.ctrlKey
  }

  get shiftKey () {
    return this.modifiers.shiftKey
  }

  get altKey () {
    return this.modifiers.altKey
  }

  get metaKey () {
    return this.modifiers.metaKey
  }

  get button () {
    return this.buttonPressed
  }

  get buttons () {
    return this.buttonsDown
  }

  get relatedTarget () {
    return this.related
  }

  /**
   * Whether a modifier key was held down when the event happened.
   * @param key Control, Shift, Alt or Meta
   */
  getModifierState (key) {
    return (0, modifierState_1.modifierState)(this.modifiers, key)
  }
}
exports.MouseEventService = MouseEventService

'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.KeyboardEventService = void 0
/**
 * Substitute for the DOM KeyboardEvent Class.
 */
const UIEventService_1 = require('./UIEventService')
const modifierState_1 = require('../functions/modifierState')
/**
 * Simulate the behaviour of the KeyboardEvent Class when there is no DOM available.
 */
class KeyboardEventService extends UIEventService_1.UIEventService {
  /**
   * @param typeArg The type of the event
   * @param init The options for the event
   */
  constructor (typeArg = '', init = {}) {
    super(typeArg, init)
    this.keyValue = init.key || ''
    this.keyCode = init.code || ''
    this.keyLocation = init.location || 0
    this.held = !!init.repeat
    this.composing = !!init.isComposing
    this.modifiers = (0, modifierState_1.modifierKeys)(init)
  }

  get key () {
    return this.keyValue
  }

  get code () {
    return this.keyCode
  }

  get location () {
    return this.keyLocation
  }

  get repeat () {
    return this.held
  }

  get isComposing () {
    return this.composing
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

  /**
   * Whether a modifier key was held down when the event happened.
   * @param key Control, Shift, Alt or Meta
   */
  getModifierState (key) {
    return (0, modifierState_1.modifierState)(this.modifiers, key)
  }
}
exports.KeyboardEventService = KeyboardEventService

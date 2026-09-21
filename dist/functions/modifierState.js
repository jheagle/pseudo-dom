'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.modifierState = exports.modifierKeys = void 0
/**
 * Pick the modifier keys out of the init object of an event.
 * @function modifierKeys
 * @param {Object} [init={}] The init of an event
 * @returns {ModifierKeys}
 */
const modifierKeys = (init = {}) => ({
  ctrlKey: !!init.ctrlKey,
  shiftKey: !!init.shiftKey,
  altKey: !!init.altKey,
  metaKey: !!init.metaKey
})
exports.modifierKeys = modifierKeys
/**
 * Answer getModifierState for a set of held modifier keys.
 * @function modifierState
 * @param {ModifierKeys} keys The modifier keys which were held down
 * @param {string} key The name of the modifier (Control, Shift, Alt or Meta)
 * @returns {boolean}
 */
const modifierState = (keys, key) => {
  switch (key) {
    case 'Control':
      return keys.ctrlKey
    case 'Shift':
      return keys.shiftKey
    case 'Alt':
      return keys.altKey
    case 'Meta':
      return keys.metaKey
    default:
      return false
  }
}
exports.modifierState = modifierState

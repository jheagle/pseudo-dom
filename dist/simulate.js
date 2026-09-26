'use strict'

const __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule
    ? mod
    : {
        default: mod
      }
}
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.keyPress = exports.click = void 0
/**
 * Simulate what a user does, with the events the browser sends for it.
 */
const createEvent_1 = __importDefault(require('./factories/createEvent'))
const activeElement_1 = require('./functions/activeElement')
const send = (target, type, init) => target.dispatchEvent((0, createEvent_1.default)(type, init, {
  browser: true,
  trusted: true
}))
/**
 * The nearest element (starting with the element itself) which can have the focus.
 * @param element Where to start
 */
const focusableFrom = element => {
  let current = element
  while (current) {
    if (current.canFocus) {
      return current
    }
    current = current.parentNode
  }
  return null
}
/**
 * Click an element the way a user does: pointerdown and mousedown, then the focus moves to the nearest element which
 * can have it (or is taken away from the one which had it) unless mousedown was cancelled, then pointerup, mouseup
 * and finally click. Every event is trusted and has the options the browser gives it. A disabled element gets nothing.
 * @param element The element to click
 * @param init Options for the events (for example clientX, clientY, shiftKey)
 * @returns False when the click was cancelled (or the element is disabled), so its default action did not happen
 */
const click = (element, init = {}) => {
  if (element.hasAttribute && element.hasAttribute('disabled')) {
    return false
  }
  const pointer = Object.assign({
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
    button: 0
  }, init)
  send(element, 'pointerdown', Object.assign({
    buttons: 1
  }, pointer))
  if (send(element, 'mousedown', Object.assign({
    buttons: 1,
    detail: 1
  }, init, {
    button: 0
  }))) {
    const focusable = focusableFrom(element)
    if (focusable) {
      focusable.focus()
    } else {
      const active = (0, activeElement_1.getActiveElement)(element.getRootNode())
      if (active) {
        active.blur()
      }
    }
  }
  send(element, 'pointerup', Object.assign({
    buttons: 0
  }, pointer))
  send(element, 'mouseup', Object.assign({
    buttons: 0,
    detail: 1
  }, init, {
    button: 0
  }))
  return send(element, 'click', Object.assign({
    detail: 1
  }, init, {
    button: 0
  }))
}
exports.click = click
/**
 * Press and release a key on an element (the element which has the focus, or one given): keydown and then keyup.
 * @param element The element which gets the key
 * @param key The value of the key, such as a or Enter
 * @param init Options for the events (for example code, shiftKey)
 * @returns False when keydown was cancelled, so its default action did not happen
 */
const keyPress = (element, key, init = {}) => {
  const options = Object.assign({
    key
  }, init)
  const proceeded = send(element, 'keydown', options)
  send(element, 'keyup', options)
  return proceeded
}
exports.keyPress = keyPress
exports.default = {
  click: exports.click,
  keyPress: exports.keyPress
}

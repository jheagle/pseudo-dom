/**
 * @file Simulate what a user does, with the events the browser sends for it.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module pseudoDom/simulate
 */
import createEvent from './factories/createEvent'
import { getActiveElement } from './functions/activeElement'

const send = (target: any, type: string, init: { [option: string]: any }): boolean =>
  target.dispatchEvent(createEvent(type, init, { browser: true, trusted: true }))

/**
 * The nearest element (starting with the element itself) which can have the focus.
 * @param {*} element Where to start
 * @returns {*|null}
 */
const focusableFrom = (element: any): any | null => {
  let current: any = element
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
 * @function click
 * @param {*} element The element to click
 * @param {Object} [init={}] Options for the events (for example clientX, clientY, shiftKey)
 * @returns {boolean} False when the click was cancelled (or the element is disabled), so its default action did not happen
 */
export const click = (element: any, init: { [option: string]: any } = {}): boolean => {
  if (element.hasAttribute && element.hasAttribute('disabled')) {
    return false
  }
  const pointer = Object.assign({ pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0 }, init)
  send(element, 'pointerdown', Object.assign({ buttons: 1 }, pointer))
  if (send(element, 'mousedown', Object.assign({ buttons: 1, detail: 1 }, init, { button: 0 }))) {
    const focusable = focusableFrom(element)
    if (focusable) {
      focusable.focus()
    } else {
      const active = getActiveElement(element.getRootNode())
      if (active) {
        active.blur()
      }
    }
  }
  send(element, 'pointerup', Object.assign({ buttons: 0 }, pointer))
  send(element, 'mouseup', Object.assign({ buttons: 0, detail: 1 }, init, { button: 0 }))
  return send(element, 'click', Object.assign({ detail: 1 }, init, { button: 0 }))
}

/**
 * Press and release a key on an element (the element which has the focus, or one given): keydown and then keyup.
 * @function keyPress
 * @param {*} element The element which gets the key
 * @param {string} key The value of the key, such as a or Enter
 * @param {Object} [init={}] Options for the events (for example code, shiftKey)
 * @returns {boolean} False when keydown was cancelled, so its default action did not happen
 */
export const keyPress = (element: any, key: string, init: { [option: string]: any } = {}): boolean => {
  const options = Object.assign({ key }, init)
  const proceeded = send(element, 'keydown', options)
  send(element, 'keyup', options)
  return proceeded
}

export default { click, keyPress }

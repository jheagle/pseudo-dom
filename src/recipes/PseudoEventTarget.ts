/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoEvent from '../classes/PseudoEvent'

export type listenerOptions = { capture: boolean, once: boolean, passive: boolean }

/**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {Object.<string, Array.<PseudoEventListener>>} listeners
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */
interface PseudoEventTarget {
  /**
   *
   * @param {string} type
   * @param {function|Object} callback
   * @param {boolean|Object} [useCapture=false]
   */
  addEventListener (type: string, callback: Function | {
    handleEvent: Function
  } | any, useCapture: listenerOptions | boolean): undefined

  /**
   *
   * @param {string} type
   * @param {function} callback
   */
  removeEventListener (type: string, callback: Function): undefined

  /**
   *
   * @param {Event|PseudoEvent} event
   * @param {EventTarget|PseudoEventTarget} target
   * @returns {boolean}
   */
  dispatchEvent (event: PseudoEvent, target: PseudoEventTarget): boolean
}

export default PseudoEventTarget

/**
 * Substitute for the DOM EventTarget Class.
 */
import { PseudoEvent } from './PseudoEvent'

export type listenerOptions = { capture: boolean, once: boolean, passive: boolean }

/**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 */
export interface PseudoEventTarget {
  /**
   * Creates a new EventTarget object instance.
   */
  /**
   * Registers an event handler of a specific event type on the EventTarget.
   * @param type
   * @param callback
   * @param useCapture
   */
  addEventListener (type: string, callback: Function | { handleEvent: Function } | any, useCapture: listenerOptions | boolean): void

  /**
   * Removes an event listener from the EventTarget.
   * @param type
   * @param callback
   */
  removeEventListener (type: string, callback: Function, options?: listenerOptions | boolean): void

  /**
   * Dispatches an event to this EventTarget.
   * @param event
   */
  dispatchEvent (event: PseudoEvent): boolean
}

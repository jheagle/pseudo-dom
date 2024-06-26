/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoEvent } from './PseudoEvent';
export type listenerOptions = {
    capture: boolean;
    once: boolean;
    passive: boolean;
};
/**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @interface
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */
export interface PseudoEventTarget {
    /**
     * Creates a new EventTarget object instance.
     */
    constructor(): any;
    /**
     * Registers an event handler of a specific event type on the EventTarget.
     * @param {string} type
     * @param {function|Object} callback
     * @param {boolean|Object} [useCapture=false]
     */
    addEventListener(type: string, callback: Function | {
        handleEvent: Function;
    } | any, useCapture: listenerOptions | boolean): void;
    /**
     * Removes an event listener from the EventTarget.
     * @param {string} type
     * @param {function} callback
     */
    removeEventListener(type: string, callback: Function): void;
    /**
     * Dispatches an event to this EventTarget.
     * @param {Event|PseudoEvent} event
     * @param {EventTarget|PseudoEventTarget} target
     * @returns {boolean}
     */
    dispatchEvent(event: PseudoEvent, target: PseudoEventTarget): boolean;
}

/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoEvent } from '../interfaces/PseudoEvent';
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget';
export type listenerOptions = {
    capture: boolean;
    once: boolean;
    passive: boolean;
};
/**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {Object.<string, Array.<PseudoEventListener>>} listeners
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */
declare class EventTargetService implements PseudoEventTarget {
    private readonly listeners;
    private readonly defaultEvent;
    /**
     * @constructor
     */
    constructor();
    /**
     *
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    private runEvents;
    /**
     *
     * @param {string} type
     * @param {Function} callback
     */
    protected setDefaultEvent(type: string, callback: Function): void;
    /**
     *
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    private runDefaultEvent;
    /**
     *
     * @param {PseudoEvent} eventType
     * @returns {boolean}
     */
    private startEvents;
    /**
     *
     * @param {string} type
     * @param {function|Object} callback
     * @param {boolean|Object} [useCapture=false]
     */
    addEventListener(type: string, callback: Function | {
        handleEvent: Function;
    } | any, useCapture?: listenerOptions | boolean): void;
    /**
     *
     * @param {string} type
     * @param {function} callback
     */
    removeEventListener(type: string, callback: Function): void;
    /**
     *
     * @param {Event|PseudoEvent} event
     * @param {EventTarget|EventTargetService} target
     * @returns {boolean}
     */
    dispatchEvent(event: PseudoEvent, target?: EventTargetService): boolean;
}
export default EventTargetService;

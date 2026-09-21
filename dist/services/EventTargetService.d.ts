/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { EventService } from './EventService';
import { listenerOptions, PseudoEventTarget } from '../interfaces/PseudoEventTarget';
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
     * The listeners registered for a type of event, creating the (empty) list of them when there are none yet.
     * @param {string} type
     * @returns {LinkedList}
     */
    private listenersFor;
    /**
     * Run each of the listeners registered on this target for the type of the event.
     * Listeners which do not apply to the event's phase are skipped, running stops once immediate propagation is stopped,
     * and listeners added or removed while running do not change which ones run for this event.
     * @param {EventService} event
     * @returns {*} true when there was nothing registered, otherwise the last value returned from a handler (null when none ran)
     */
    private runEvents;
    /**
     * Register the function to run when nothing else has prevented the default for this type of event.
     * @param {string} type
     * @param {Function} callback
     */
    protected setDefaultEvent(type: string, callback: Function): void;
    private runDefaultEvent;
    private startEvents;
    addEventListener(type: string, callback: Function | {
        handleEvent: Function;
    } | any, useCapture?: listenerOptions | boolean): void;
    removeEventListener(type: string, callback: Function): void;
    dispatchEvent(event: EventService, target?: EventTargetService): boolean;
}
export default EventTargetService;

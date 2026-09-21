/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { EventService } from './EventService';
import { listenerOptions, PseudoEventTarget } from '../interfaces/PseudoEventTarget';
/**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * Dispatching an event sends it through the tree the way the DOM does: down from the root to the target (capture
 * listeners), to the target itself, then back up to the root (the listeners which are not capture listeners, when the
 * event bubbles).
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
     * Run the listeners registered on this target for the type of the event which apply to the phase the event is in
     * (at the target, the capture listeners run before the others). Listeners which are added while this runs do not run
     * for this event, and listeners which are removed while it runs no longer do. Running stops as soon as immediate
     * propagation is stopped. A listener which throws does not stop the others.
     * @param {EventService} event The event, which is at a phase and has a current target
     * @returns {Array<*>} The errors which the listeners threw
     */
    private runEvents;
    /**
     * Take a listener out of the registered listeners, so that it does not run again.
     * @param {string} type
     * @param {PseudoEventListener} listener
     */
    private removeListener;
    /**
     * Register the function to run when nothing else has prevented the default for this type of event.
     * @param {string} type
     * @param {Function} callback
     */
    protected setDefaultEvent(type: string, callback: Function): void;
    /**
     * Registers an event handler of a specific event type. Adding the same handler again for the same type and phase does
     * nothing, like the DOM.
     * @param {string} type The type of event to listen for
     * @param {Function|Object} callback The function to call (or an object with a handleEvent function)
     * @param {Object|boolean} [useCapture=false] Listen while the event travels down to the target (true), or an object with capture, once and passive
     */
    addEventListener(type: string, callback: Function | {
        handleEvent: Function;
    } | any, useCapture?: listenerOptions | boolean): void;
    /**
     * Removes an event listener, the one which was added with the same type, handler and phase.
     * @param {string} type The type of event
     * @param {Function|Object} callback The handler which was added
     * @param {Object|boolean} [options=false] Whether the listener was a capture listener (true), or an object with capture
     */
    removeEventListener(type: string, callback: Function, options?: listenerOptions | boolean): void;
    /**
     * Dispatches an event to this target and through the tree: capture listeners of the ancestors from the root down,
     * then the listeners of this target, then (when the event bubbles) the other listeners of the ancestors from the
     * parent up to the root. stopPropagation() stops it reaching further targets, stopImmediatePropagation() also stops
     * the remaining listeners of the current target. Afterwards, unless the default was prevented, the default action
     * of this target (see setDefaultEvent) runs. The event can be dispatched again afterwards.
     * @param {EventService} event The event to dispatch
     * @returns {boolean} False when the event was cancelable and a listener prevented the default, otherwise true
     * @throws {Error} When the event is already being dispatched, or (after the whole dispatch has finished) the error
     * which a listener threw (an error with all of them in its errors property when several did)
     */
    dispatchEvent(event: EventService): boolean;
}
export default EventTargetService;

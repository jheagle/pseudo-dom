/**
 * @file Substitute for the DOM Event Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget';
import { PseudoEvent } from '../interfaces/PseudoEvent';
export type EventInner = {
    currentTarget: PseudoEventTarget;
    eventPhase: number;
    target: PseudoEventTarget;
    immediatePropagationStopped: boolean;
    propagationStopped: boolean;
};
/**
 * Simulate the behaviour of the Event Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {number} NONE
 * @property {number} CAPTURING_PHASE
 * @property {number} AT_TARGET
 * @property {number} BUBBLING_PHASE
 * @property {boolean} bubbles - A Boolean indicating whether the event bubbles up through the Dom or not.
 * @property {boolean} cancelable - A Boolean indicating whether the event is cancelable.
 * @property {boolean} composed - A Boolean value indicating whether the event can bubble across the boundary
 * between the shadow Dom and the regular Dom.
 * @property {function|PseudoEventTarget} currentTarget - A reference to the currently registered target for the event. This
 * is the object to which the event is currently slated to be sent; it's possible this has been changed along the way
 * through re-targeting.
 * @property {boolean} defaultPrevented - Indicates whether event.preventDefault() has been called on the event.
 * @property {boolean} immediatePropagationStopped - Flag that no further propagation should occur, including on current
 * target.
 * @property {boolean} propagationStopped - Flag that no further propagation should occur.
 * @property {int} eventPhase - Indicates which phase of the event flow is being processed. Uses EventService constants.
 * @property {EventTarget|PseudoEventTarget} target - A reference to the target to which the event was originally
 * dispatched.
 * @property {int} timeStamp - The time at which the event was created (in milliseconds). By specification, this
 * value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this
 * to be a DomHighResTimeStamp instead.
 * @property {string} type - The name of the event (case-insensitive).
 * @property {boolean} isTrusted - Indicates whether the event was initiated by the browser (after a user
 * click for instance) or by a script (using an event creation method, like event.initEvent)
 */
export declare class EventService implements PseudoEvent {
    static readonly NONE = 0;
    static readonly CAPTURING_PHASE = 1;
    static readonly AT_TARGET = 2;
    static readonly BUBBLING_PHASE = 3;
    private properties;
    /**
     *
     * @param {string} typeArg
     * @param {Object} [eventOptions={}]
     * @param {boolean} [eventOptions.bubbles=true]
     * @param {boolean} [eventOptions.cancelable=true]
     * @param {boolean} [eventOptions.composed=true]
     * @constructor
     */
    constructor(typeArg?: string, { bubbles, cancelable, composed }?: {
        bubbles?: boolean;
        cancelable?: boolean;
        composed?: boolean;
    });
    get bubbles(): boolean;
    get cancelable(): boolean;
    get composed(): boolean;
    get currentTarget(): PseudoEventTarget;
    get defaultPrevented(): boolean;
    get eventPhase(): number;
    get isTrusted(): boolean;
    get target(): PseudoEventTarget;
    get timeStamp(): number;
    get type(): string;
    /**
     * Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.
     * @returns {EventInner}
     */
    get inner(): EventInner;
    /**
     * Return an array of targets that will have the event executed open them. The order is based on the eventPhase
     * @method
     * @returns {Array.<PseudoEventTarget>}
     */
    composedPath(): Array<PseudoEventTarget>;
    /**
     * Cancels the event (if it is cancelable).
     * @method
     * @returns {null}
     */
    preventDefault(): null;
    /**
     * For this particular event, no other listener will be called.
     * Neither those attached on the same element, nor those attached on elements which will be traversed later (in
     * capture phase, for instance)
     * @method
     * @returns {null}
     */
    stopImmediatePropagation(): null;
    /**
     * Stops the propagation of events further along in the Dom.
     * @method
     * @returns {null}
     */
    stopPropagation(): null;
    private setReadOnlyProperties;
}

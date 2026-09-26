/**
 * Substitute for the DOM Event Class.
 */
import { PseudoEventTarget } from './PseudoEventTarget';
/**
 * Simulate the behaviour of the Event Class when there is no DOM available.
 */
export interface PseudoEvent {
    /** A Boolean indicating whether the event bubbles up through the Dom or not. */
    get bubbles(): boolean;
    /** A Boolean indicating whether the event is cancelable. */
    get cancelable(): boolean;
    /** A Boolean value indicating whether the event can bubble across the boundary between the shadow Dom and the regular Dom. */
    get composed(): boolean;
    /** A reference to the currently registered target for the event. This is the object to which the event is currently slated to be sent; it's possible this has been changed along the way through re-targeting. */
    get currentTarget(): PseudoEventTarget;
    /** Indicates whether event.preventDefault() has been called on the event. */
    get defaultPrevented(): boolean;
    /** Indicates which phase of the event flow is being processed. Uses PseudoEvent constants. */
    get eventPhase(): number;
    /** Indicates whether the event was initiated by the browser (after a user click for instance) or by a script (using an event creation method, like event.initEvent) */
    get isTrusted(): boolean;
    /** A reference to the target to which the event was originally dispatched. */
    get target(): PseudoEventTarget;
    /** The time at which the event was created (in milliseconds). By specification, this value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this to be a DomHighResTimeStamp instead. */
    get timeStamp(): number;
    /** The name of the event (case-insensitive). */
    get type(): string;
    /**
     * Return an array of targets that will have the event executed open them. The order is based on the eventPhase
     */
    composedPath(): Array<PseudoEventTarget>;
    /**
     * Cancels the event (if it is cancelable).
     */
    preventDefault(): null;
    /**
     * For this particular event, no other listener will be called.
     * Neither those attached on the same element, nor those attached on elements which will be traversed later (in
     * capture phase, for instance)
     */
    stopImmediatePropagation(): null;
    /**
     * Stops the propagation of events further along in the Dom.
     */
    stopPropagation(): null;
}

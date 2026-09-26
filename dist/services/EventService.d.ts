/**
 * Substitute for the DOM Event Class.
 */
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget';
import { PseudoEvent } from '../interfaces/PseudoEvent';
/**
 * The parts of an event which the dispatching of it (EventTargetService) needs to change or read. Not part of the DOM's
 * Event, which is why they are kept apart from the event's own properties.
 */
export type EventInner = {
    currentTarget: PseudoEventTarget | null;
    eventPhase: number;
    target: PseudoEventTarget;
    immediatePropagationStopped: boolean;
    propagationStopped: boolean;
    /** True for an event which the browser created for a user action, an event which a script created is not trusted. */
    trusted: boolean;
    /** True while the event is being dispatched. */
    dispatching: boolean;
    /** True while a passive listener is running, in which preventDefault does nothing. */
    inPassiveListener: boolean;
    /** The targets the event travels through, the target first and the root last, set while dispatching. */
    path: Array<PseudoEventTarget>;
    /** Finish the dispatch: no phase, no current target, no path and the stop flags are cleared so the event can be dispatched again. */
    finishDispatch: () => void;
};
/**
 * Simulate the behaviour of the Event Class when there is no DOM available.
 */
export declare class EventService implements PseudoEvent {
    static readonly NONE = 0;
    static readonly CAPTURING_PHASE = 1;
    static readonly AT_TARGET = 2;
    static readonly BUBBLING_PHASE = 3;
    private properties;
    /**
     *
     * @param typeArg
     * @param eventOptions
     * @param eventOptions.bubbles
     * @param eventOptions.cancelable
     * @param eventOptions.composed
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
     */
    get inner(): EventInner;
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
    private setReadOnlyProperties;
}

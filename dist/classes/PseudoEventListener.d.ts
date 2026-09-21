/**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { EventService } from '../services/EventService';
/**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventType
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
declare class PseudoEventListener {
    private eventOptions;
    private eventType;
    private handler;
    private readonly originalCallback;
    private readonly defaultListener;
    private isRemoved;
    /**
     * @param {string} eventType The type of event this listens for
     * @param {Object} [options] The capture, once and passive options
     * @param {Function} handleEvent The function which is called with the event, already bound to what it should run as
     * @param {Function} [originalCallback=handleEvent] The function (or object) which was given when registering, used to find this listener again
     * @constructor
     */
    constructor(eventType: string, { capture, once, passive }: {
        capture?: boolean;
        once?: boolean;
        passive?: boolean;
    }, handleEvent: Function, originalCallback?: Function);
    /**
     * The function (or object with handleEvent) which was originally given when registering, used to find this listener again for removal.
     */
    get callback(): Function;
    /** Whether this listener listens in the capture phase (and at the target) rather than in the bubble phase. */
    get capture(): boolean;
    get isDefault(): boolean;
    get once(): boolean;
    /** Whether the listener promises not to prevent the default (preventDefault does nothing while it runs). */
    get passive(): boolean;
    /** Whether this listener has been removed, a removed listener does not run even if the event already started. */
    get removed(): boolean;
    set removed(removed: boolean);
    /**
     * @method
     * @name PseudoEventListener#handleEvent
     * @param {PseudoEvent} event
     * @returns {*}
     */
    handleEvent(event: EventService): any;
    /**
     * A capture listener runs while the event travels down to the target.
     * @method
     * @name PseudoEventListener#doCapturePhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    doCapturePhase(event: EventService): boolean;
    /**
     * Every listener of the target itself runs, capture listeners first.
     * @method
     * @name PseudoEventListener#doTargetPhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    doTargetPhase(event: EventService): boolean;
    /**
     * A listener which is not a capture listener runs while the event travels back up (when it bubbles).
     * @method
     * @name PseudoEventListener#doBubblePhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    doBubblePhase(event: EventService): boolean;
    /**
     * @method
     * @name PseudoEventListener#skipPhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    skipPhase(event: EventService): boolean;
    /**
     * Whether this listener should not run for the event as it is now (it was removed, or it is for another phase).
     * Stopping propagation is handled by the dispatching, since it stops other targets and not the listeners of the
     * current one.
     * @method
     * @name PseudoEventListener#rejectEvent
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    rejectEvent(event: EventService): boolean;
}
export default PseudoEventListener;

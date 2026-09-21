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
    constructor(eventType: string, { capture, once, passive }: {
        capture?: boolean;
        once?: boolean;
        passive?: boolean;
    }, handleEvent: Function, originalCallback?: Function);
    /**
     * The function (or object with handleEvent) which was originally given when registering, used to find this listener again for removal.
     */
    get callback(): Function;
    get isDefault(): boolean;
    get once(): boolean;
    /**
     * @method
     * @name PseudoEventListener#handleEvent
     * @param {PseudoEvent} event
     * @returns {*}
     */
    handleEvent(event: EventService): any;
    /**
     * @method
     * @name PseudoEventListener#doCapturePhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    doCapturePhase(event: EventService): boolean;
    /**
     * @method
     * @name PseudoEventListener#doTargetPhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    doTargetPhase(event: EventService): boolean;
    /**
     * @method
     * @name PseudoEventListener#doBubblePhase
     * @param {PseudoEvent} event
     * @returns {boolean|*}
     */
    doBubblePhase(event: EventService): boolean | any;
    /**
     * @method
     * @name PseudoEventListener#skipPhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    skipPhase(event: EventService): boolean;
    /**
     * @method
     * @name PseudoEventListener#skipDefault
     * @param {PseudoEvent} event
     * @returns {boolean|*}
     */
    skipDefault(event: EventService): boolean | any;
    /**
     * @method
     * @name PseudoEventListener#stopPropagation
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    stopPropagation(event: EventService): boolean;
    /**
     * @method
     * @name PseudoEventListener#nonPassiveHalt
     * @param {PseudoEvent} event
     * @returns {boolean|*}
     */
    nonPassiveHalt(event: EventService): boolean | any;
    /**
     * @method
     * @name PseudoEventListener#rejectEvent
     * @param {PseudoEvent} event
     * @returns {*|boolean}
     */
    rejectEvent(event: EventService): any | boolean;
}
export default PseudoEventListener;

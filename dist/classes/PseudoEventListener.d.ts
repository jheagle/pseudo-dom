/**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoEvent from '../interfaces/PseudoEvent';
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
    private isDefault;
    constructor(eventType: string, { capture, once, passive }: {
        capture?: boolean;
        once?: boolean;
        passive?: boolean;
    }, handleEvent: Function);
    get once(): boolean;
    /**
     * @method
     * @name PseudoEventListener#handleEvent
     * @param {PseudoEvent} event
     * @returns {*}
     */
    handleEvent(event: PseudoEvent): any;
    /**
     * @method
     * @name PseudoEventListener#doCapturePhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    doCapturePhase(event: PseudoEvent): boolean;
    /**
     * @method
     * @name PseudoEventListener#doTargetPhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    doTargetPhase(event: PseudoEvent): boolean;
    /**
     * @method
     * @name PseudoEventListener#doBubblePhase
     * @param {PseudoEvent} event
     * @returns {boolean|*}
     */
    doBubblePhase(event: PseudoEvent): boolean | any;
    /**
     * @method
     * @name PseudoEventListener#skipPhase
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    skipPhase(event: PseudoEvent): boolean;
    /**
     * @method
     * @name PseudoEventListener#skipDefault
     * @param {PseudoEvent} event
     * @returns {boolean|*}
     */
    skipDefault(event: PseudoEvent): boolean | any;
    /**
     * @method
     * @name PseudoEventListener#stopPropagation
     * @param {PseudoEvent} event
     * @returns {boolean}
     */
    stopPropagation(event: PseudoEvent): boolean;
    /**
     * @method
     * @name PseudoEventListener#nonPassiveHalt
     * @param {PseudoEvent} event
     * @returns {boolean|*}
     */
    nonPassiveHalt(event: PseudoEvent): boolean | any;
    /**
     * @method
     * @name PseudoEventListener#rejectEvent
     * @param {PseudoEvent} event
     * @returns {*|boolean}
     */
    rejectEvent(event: PseudoEvent): any | boolean;
}
export default PseudoEventListener;

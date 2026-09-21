/**
 * @file Substitute for the DOM FocusEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { UIEventInit, UIEventService } from './UIEventService';
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget';
/**
 * The options for creating a focus event, on top of the ones every UI event has.
 * @typedef {Object} FocusEventInit
 * @property {PseudoEventTarget|null} [relatedTarget=null] The other target involved (the one losing or gaining the focus)
 */
export type FocusEventInit = UIEventInit & {
    relatedTarget?: PseudoEventTarget | null;
};
/**
 * Simulate the behaviour of the FocusEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {PseudoEventTarget|null} relatedTarget
 */
export declare class FocusEventService extends UIEventService {
    private readonly related;
    /**
     * @param {string} [typeArg=''] The type of the event
     * @param {FocusEventInit} [init={}] The options for the event
     * @constructor
     */
    constructor(typeArg?: string, init?: FocusEventInit);
    get relatedTarget(): PseudoEventTarget | null;
}

/**
 * @file Substitute for the DOM InputEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { UIEventInit, UIEventService } from './UIEventService';
/**
 * The options for creating an input event, on top of the ones every UI event has.
 * @typedef {Object} InputEventInit
 * @property {string|null} [data=null] The characters which were entered
 * @property {string} [inputType=''] What kind of change it was, such as insertText
 * @property {boolean} [isComposing=false]
 */
export type InputEventInit = UIEventInit & {
    data?: string | null;
    inputType?: string;
    isComposing?: boolean;
};
/**
 * Simulate the behaviour of the InputEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {string|null} data
 * @property {string} inputType
 * @property {boolean} isComposing
 */
export declare class InputEventService extends UIEventService {
    private readonly inputData;
    private readonly kind;
    private readonly composing;
    /**
     * @param {string} [typeArg=''] The type of the event
     * @param {InputEventInit} [init={}] The options for the event
     * @constructor
     */
    constructor(typeArg?: string, init?: InputEventInit);
    get data(): string | null;
    get inputType(): string;
    get isComposing(): boolean;
}

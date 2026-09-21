/**
 * @file Substitute for the DOM KeyboardEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { UIEventInit, UIEventService } from './UIEventService';
/**
 * The options for creating a keyboard event, on top of the ones every UI event has.
 * @typedef {Object} KeyboardEventInit
 * @property {string} [key=''] The value of the key, such as a or Enter
 * @property {string} [code=''] The physical key, such as KeyA or Enter
 * @property {number} [location=0] Where on the keyboard the key is (0 standard, 1 left, 2 right, 3 numeric pad)
 * @property {boolean} [repeat=false] The key is being held down
 * @property {boolean} [isComposing=false]
 * @property {boolean} [ctrlKey=false]
 * @property {boolean} [shiftKey=false]
 * @property {boolean} [altKey=false]
 * @property {boolean} [metaKey=false]
 */
export type KeyboardEventInit = UIEventInit & {
    key?: string;
    code?: string;
    location?: number;
    repeat?: boolean;
    isComposing?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
};
/**
 * Simulate the behaviour of the KeyboardEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {string} key
 * @property {string} code
 * @property {number} location
 * @property {boolean} repeat
 * @property {boolean} isComposing
 */
export declare class KeyboardEventService extends UIEventService {
    private readonly keyValue;
    private readonly keyCode;
    private readonly keyLocation;
    private readonly held;
    private readonly composing;
    private readonly modifiers;
    /**
     * @param {string} [typeArg=''] The type of the event
     * @param {KeyboardEventInit} [init={}] The options for the event
     * @constructor
     */
    constructor(typeArg?: string, init?: KeyboardEventInit);
    get key(): string;
    get code(): string;
    get location(): number;
    get repeat(): boolean;
    get isComposing(): boolean;
    get ctrlKey(): boolean;
    get shiftKey(): boolean;
    get altKey(): boolean;
    get metaKey(): boolean;
    /**
     * Whether a modifier key was held down when the event happened.
     * @param {string} key Control, Shift, Alt or Meta
     * @returns {boolean}
     */
    getModifierState(key: string): boolean;
}

/**
 * @file Substitute for the DOM MouseEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { UIEventInit, UIEventService } from './UIEventService';
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget';
/**
 * The options for creating a mouse event, on top of the ones every UI event has.
 * @typedef {Object} MouseEventInit
 * @property {number} [screenX=0]
 * @property {number} [screenY=0]
 * @property {number} [clientX=0]
 * @property {number} [clientY=0]
 * @property {boolean} [ctrlKey=false]
 * @property {boolean} [shiftKey=false]
 * @property {boolean} [altKey=false]
 * @property {boolean} [metaKey=false]
 * @property {number} [button=0] The button which changed (0 is the main button)
 * @property {number} [buttons=0] The buttons which are down
 * @property {PseudoEventTarget|null} [relatedTarget=null] The other target involved (the one the mouse came from or went to)
 */
export type MouseEventInit = UIEventInit & {
    screenX?: number;
    screenY?: number;
    clientX?: number;
    clientY?: number;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    button?: number;
    buttons?: number;
    relatedTarget?: PseudoEventTarget | null;
};
/**
 * Simulate the behaviour of the MouseEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {number} screenX
 * @property {number} screenY
 * @property {number} clientX
 * @property {number} clientY
 * @property {number} button
 * @property {number} buttons
 * @property {PseudoEventTarget|null} relatedTarget
 */
export declare class MouseEventService extends UIEventService {
    private readonly position;
    private readonly modifiers;
    private readonly buttonPressed;
    private readonly buttonsDown;
    private readonly related;
    /**
     * @param {string} [typeArg=''] The type of the event
     * @param {MouseEventInit} [init={}] The options for the event
     * @constructor
     */
    constructor(typeArg?: string, init?: MouseEventInit);
    get screenX(): number;
    get screenY(): number;
    get clientX(): number;
    get clientY(): number;
    get x(): number;
    get y(): number;
    get ctrlKey(): boolean;
    get shiftKey(): boolean;
    get altKey(): boolean;
    get metaKey(): boolean;
    get button(): number;
    get buttons(): number;
    get relatedTarget(): PseudoEventTarget | null;
    /**
     * Whether a modifier key was held down when the event happened.
     * @param {string} key Control, Shift, Alt or Meta
     * @returns {boolean}
     */
    getModifierState(key: string): boolean;
}

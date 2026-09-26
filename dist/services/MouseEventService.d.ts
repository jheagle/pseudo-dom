/**
 * Substitute for the DOM MouseEvent Class.
 */
import { UIEventInit, UIEventService } from './UIEventService';
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget';
/**
 * The options for creating a mouse event, on top of the ones every UI event has.
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
    /** The button which changed (0 is the main button) (default 0) */
    button?: number;
    /** The buttons which are down (default 0) */
    buttons?: number;
    /** The other target involved (the one the mouse came from or went to) (default null) */
    relatedTarget?: PseudoEventTarget | null;
};
/**
 * Simulate the behaviour of the MouseEvent Class when there is no DOM available.
 */
export declare class MouseEventService extends UIEventService {
    private readonly position;
    private readonly modifiers;
    private readonly buttonPressed;
    private readonly buttonsDown;
    private readonly related;
    /**
     * @param typeArg The type of the event
     * @param init The options for the event
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
     * @param key Control, Shift, Alt or Meta
     */
    getModifierState(key: string): boolean;
}

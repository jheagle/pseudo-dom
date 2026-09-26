/**
 * Substitute for the DOM KeyboardEvent Class.
 */
import { UIEventInit, UIEventService } from './UIEventService';
/**
 * The options for creating a keyboard event, on top of the ones every UI event has.
 */
export type KeyboardEventInit = UIEventInit & {
    /** The value of the key, such as a or Enter (default '') */
    key?: string;
    /** The physical key, such as KeyA or Enter (default '') */
    code?: string;
    /** Where on the keyboard the key is (0 standard, 1 left, 2 right, 3 numeric pad) (default 0) */
    location?: number;
    /** The key is being held down (default false) */
    repeat?: boolean;
    isComposing?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
};
/**
 * Simulate the behaviour of the KeyboardEvent Class when there is no DOM available.
 */
export declare class KeyboardEventService extends UIEventService {
    private readonly keyValue;
    private readonly keyCode;
    private readonly keyLocation;
    private readonly held;
    private readonly composing;
    private readonly modifiers;
    /**
     * @param typeArg The type of the event
     * @param init The options for the event
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
     * @param key Control, Shift, Alt or Meta
     */
    getModifierState(key: string): boolean;
}

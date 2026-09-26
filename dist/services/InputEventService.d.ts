/**
 * Substitute for the DOM InputEvent Class.
 */
import { UIEventInit, UIEventService } from './UIEventService';
/**
 * The options for creating an input event, on top of the ones every UI event has.
 */
export type InputEventInit = UIEventInit & {
    /** The characters which were entered (default null) */
    data?: string | null;
    /** What kind of change it was, such as insertText (default '') */
    inputType?: string;
    isComposing?: boolean;
};
/**
 * Simulate the behaviour of the InputEvent Class when there is no DOM available.
 */
export declare class InputEventService extends UIEventService {
    private readonly inputData;
    private readonly kind;
    private readonly composing;
    /**
     * @param typeArg The type of the event
     * @param init The options for the event
     */
    constructor(typeArg?: string, init?: InputEventInit);
    get data(): string | null;
    get inputType(): string;
    get isComposing(): boolean;
}

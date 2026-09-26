/**
 * Substitute for the DOM PointerEvent Class.
 */
import { MouseEventInit, MouseEventService } from './MouseEventService';
/**
 * The options for creating a pointer event, on top of the ones every mouse event has.
 */
export type PointerEventInit = MouseEventInit & {
    pointerId?: number;
    width?: number;
    height?: number;
    pressure?: number;
    /** mouse, pen or touch (default '') */
    pointerType?: string;
    isPrimary?: boolean;
};
/**
 * Simulate the behaviour of the PointerEvent Class when there is no DOM available.
 */
export declare class PointerEventService extends MouseEventService {
    private readonly pointer;
    /**
     * @param typeArg The type of the event
     * @param init The options for the event
     */
    constructor(typeArg?: string, init?: PointerEventInit);
    get pointerId(): number;
    get width(): number;
    get height(): number;
    get pressure(): number;
    get pointerType(): string;
    get isPrimary(): boolean;
}

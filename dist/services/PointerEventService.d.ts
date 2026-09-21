/**
 * @file Substitute for the DOM PointerEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { MouseEventInit, MouseEventService } from './MouseEventService';
/**
 * The options for creating a pointer event, on top of the ones every mouse event has.
 * @typedef {Object} PointerEventInit
 * @property {number} [pointerId=0]
 * @property {number} [width=1]
 * @property {number} [height=1]
 * @property {number} [pressure=0]
 * @property {string} [pointerType=''] mouse, pen or touch
 * @property {boolean} [isPrimary=false]
 */
export type PointerEventInit = MouseEventInit & {
    pointerId?: number;
    width?: number;
    height?: number;
    pressure?: number;
    pointerType?: string;
    isPrimary?: boolean;
};
/**
 * Simulate the behaviour of the PointerEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments MouseEventService
 * @property {number} pointerId
 * @property {number} width
 * @property {number} height
 * @property {number} pressure
 * @property {string} pointerType
 * @property {boolean} isPrimary
 */
export declare class PointerEventService extends MouseEventService {
    private readonly pointer;
    /**
     * @param {string} [typeArg=''] The type of the event
     * @param {PointerEventInit} [init={}] The options for the event
     * @constructor
     */
    constructor(typeArg?: string, init?: PointerEventInit);
    get pointerId(): number;
    get width(): number;
    get height(): number;
    get pressure(): number;
    get pointerType(): string;
    get isPrimary(): boolean;
}

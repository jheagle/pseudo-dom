/**
 * @file Substitute for the DOM HTMLCollection Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { NodeService } from './NodeService';
import { PseudoHTMLCollection } from '../interfaces/PseudoHTMLCollection';
/**
 * Simulate the behaviour of the HTMLCollection Class when there is no DOM available: a live view of some of a node's
 * element descendants, recomputed each time it is used rather than kept in sync as they change.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
export declare class HTMLCollectionService implements PseudoHTMLCollection {
    private readonly owner;
    private readonly predicate;
    private readonly deep;
    /**
     * @param {NodeService} owner The node this is a live view of a part of
     * @param {function(*): boolean} [predicate] Only elements which pass this are included (every element by default)
     * @param {boolean} [deep=false] Include every matching descendant (true, like getElementsByTagName), not just the
     * direct element children (false, like Element.children)
     * @constructor
     */
    constructor(owner: NodeService, predicate?: (element: any) => boolean, deep?: boolean);
    /**
     * The current elements the collection holds, in tree order.
     * @returns {Array<PseudoNode>}
     */
    private elements;
    /**
     * How many elements are in the collection right now.
     * @returns {number}
     */
    get length(): number;
    /**
     * The element at the given index, or null when there is none.
     * @param {number} index
     * @returns {*}
     */
    item(index: number): any | null;
    /**
     * The element whose id, or (failing that) whose name attribute, is the given value, or null when there is none.
     * @param {string} name
     * @returns {*}
     */
    namedItem(name: string): any | null;
    /**
     * Iterate over the current elements.
     * @returns {Iterator}
     */
    [Symbol.iterator](): Iterator<any>;
}
export default HTMLCollectionService;

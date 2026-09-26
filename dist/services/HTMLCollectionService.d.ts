/**
 * Substitute for the DOM HTMLCollection Class.
 */
import { NodeService } from './NodeService';
import { PseudoHTMLCollection } from '../interfaces/PseudoHTMLCollection';
/**
 * Simulate the behaviour of the HTMLCollection Class when there is no DOM available: a live view of some of a node's
 * element descendants, recomputed each time it is used rather than kept in sync as they change.
 */
export declare class HTMLCollectionService implements PseudoHTMLCollection {
    private readonly owner;
    private readonly predicate;
    private readonly deep;
    /**
     * @param owner The node this is a live view of a part of
     * @param predicate Only elements which pass this are included (every element by default)
     * @param deep Include every matching descendant (true, like getElementsByTagName), not just the
     * direct element children (false, like Element.children)
     */
    constructor(owner: NodeService, predicate?: (element: any) => boolean, deep?: boolean);
    /**
     * The current elements the collection holds, in tree order.
     */
    private elements;
    /**
     * How many elements are in the collection right now.
     */
    get length(): number;
    /**
     * The element at the given index, or null when there is none.
     * @param index
     */
    item(index: number): any | null;
    /**
     * The element whose id, or (failing that) whose name attribute, is the given value, or null when there is none.
     * @param name
     */
    namedItem(name: string): any | null;
    /**
     * Iterate over the current elements.
     */
    [Symbol.iterator](): Iterator<any>;
}
export default HTMLCollectionService;

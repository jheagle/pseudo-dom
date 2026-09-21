/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { LinkedTreeList } from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList';
/**
 * A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
 * the linkers that hold them.
 * @class
 * @augments LinkedTreeList
 */
export declare class PseudoNodeList extends LinkedTreeList {
    /**
     * Iterate over the nodes in this list.
     * @returns {Iterator}
     */
    [Symbol.iterator](): Iterator<any>;
    /**
     * Iterate over [index, node] pairs.
     * @returns {Iterator}
     */
    entries(): Iterator<[number, any]>;
    /**
     * Iterate over the indexes.
     * @returns {Iterator}
     */
    keys(): Iterator<number>;
    /**
     * Iterate over the nodes.
     * @returns {Iterator}
     */
    values(): Iterator<any>;
}

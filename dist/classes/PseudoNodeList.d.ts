/**
 * Substitute for the NodeList interface.
 */
import { LinkedTreeList } from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList';
/**
 * A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
 * the linkers that hold them.
 */
export declare class PseudoNodeList extends LinkedTreeList {
    /**
     * Iterate over the nodes in this list.
     */
    [Symbol.iterator](): Iterator<any>;
    /**
     * Iterate over [index, node] pairs.
     */
    entries(): Iterator<[number, any]>;
    /**
     * Iterate over the indexes.
     */
    keys(): Iterator<number>;
    /**
     * Iterate over the nodes.
     */
    values(): Iterator<any>;
}

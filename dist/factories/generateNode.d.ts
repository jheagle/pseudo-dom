import { TreeLinker } from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker';
import { NodeService } from '../services/NodeService';
import { PseudoNode } from '../interfaces/PseudoNode';
import { PseudoElement } from '../interfaces/PseudoElement';
/**
 * A node which is stored in a TreeLinker (for example by a list built from an array of values). It finds its siblings
 * from that linker, and its parent from the linker's parent when it has not been given one by appendChild.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export declare class LinkedNode extends NodeService {
    /**
     * @param {TreeLinker} linker The linker holding this node
     * @param {string|null} value The value of the node
     * @constructor
     */
    constructor(linker: TreeLinker, value?: string | null);
    get isConnected(): boolean;
    get parentNode(): PseudoNode | null;
    get parentElement(): PseudoElement | null;
}
export declare class NodeFactory extends TreeLinker {
}
/**
 * Create a TreeLinker class whose linkers each store a node (a LinkedNode) as their data, this can be used to build a
 * tree (or list) of nodes from plain values.
 * @function generateNode
 * @returns {Function} The NodeFactory class (a TreeLinker) to use as the linker class
 */
declare const generateNode: () => typeof NodeFactory;
export default generateNode;

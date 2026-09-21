import { TreeLinker } from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker';
import { NodeService } from '../services/NodeService';
import { PseudoNode } from '../interfaces/PseudoNode';
import { PseudoElement } from '../interfaces/PseudoElement';
/**
 * A node which is stored in a TreeLinker and answers questions about its position in the tree by asking that linker.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export declare class LinkedNode extends NodeService {
    private readonly linker;
    /**
     * @param {TreeLinker} linker The linker holding this node
     * @param {string|null} value The value of the node
     * @constructor
     */
    constructor(linker: TreeLinker, value?: string | null);
    get childNodes(): any;
    get firstChild(): PseudoNode | null;
    get isConnected(): boolean;
    get lastChild(): PseudoNode | null;
    get nextSibling(): PseudoNode | null;
    get ownerDocument(): any;
    get parentNode(): PseudoNode | null;
    get parentElement(): PseudoElement | null;
    get previousSibling(): PseudoNode | null;
    appendChild(childNode: PseudoNode): PseudoNode;
    getRootNode(): PseudoNode;
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

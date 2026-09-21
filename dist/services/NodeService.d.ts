import { PseudoNodeList } from '../classes/PseudoNodeList';
import { LinkedTreeList } from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList';
import { TreeLinker } from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker';
import { PseudoNode } from '../interfaces/PseudoNode';
import EventTargetService from './EventTargetService';
import { PseudoElement } from '../interfaces/PseudoElement';
import { PseudoDocument } from '../interfaces/PseudoDocument';
import { PseudoDocumentFragment } from '../interfaces/PseudoDocumentFragment';
/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
export declare class NodeService extends EventTargetService implements PseudoNode {
    static readonly DEFAULT_NODE = 0;
    static readonly ELEMENT_NODE = 1;
    static readonly ATTRIBUTE_NODE = 2;
    static readonly TEXT_NODE = 3;
    static readonly CDATA_SECTION_NODE = 4;
    static readonly ENTITY_REFERENCE_NODE = 5;
    static readonly ENTITY_NODE = 6;
    static readonly PROCESSING_INSTRUCTION_NODE = 7;
    static readonly COMMENT_NODE = 8;
    static readonly DOCUMENT_NODE = 9;
    static readonly DOCUMENT_TYPE_NODE = 10;
    static readonly DOCUMENT_FRAGMENT_NODE = 11;
    static readonly NOTATION_NODE = 12;
    children: PseudoNodeList | LinkedTreeList;
    parent: PseudoNode | null;
    protected nodeNameValue: string;
    private nodeValueStore;
    private textContentStore;
    /** The linker which holds this node in the children list of its parent, from which its siblings are found (null while it has no parent). */
    protected listLinker: TreeLinker | null;
    /**
     *
     * @constructor
     */
    constructor();
    get baseURI(): Location | string;
    get childNodes(): PseudoNodeList | LinkedTreeList;
    get firstChild(): PseudoNode | null;
    get isConnected(): boolean;
    get lastChild(): PseudoNode | null;
    get nextSibling(): PseudoNode | null;
    get nodeName(): string;
    get nodeType(): number;
    get nodeValue(): string | null;
    set nodeValue(value: string | null);
    get ownerDocument(): PseudoDocument | null;
    get parentNode(): PseudoNode | null;
    get parentElement(): PseudoElement | null;
    get previousSibling(): PseudoNode | null;
    get textContent(): string | null;
    set textContent(text: string | null);
    /**
     * Add a node as the last child of this node (a node which is already in a tree is moved).
     * @param {PseudoNode} childNode The node to add
     * @returns {PseudoNode} The added node
     */
    appendChild(childNode: PseudoNode): PseudoNode;
    /**
     * Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
     * (for example elements applying default events) can do so.
     * @param {NodeService} child The node which was inserted
     */
    protected childInserted(child: NodeService): void;
    /**
     * Not implemented yet.
     * @throws {Error}
     */
    cloneNode(deep?: boolean): PseudoNode;
    /**
     * Not implemented yet.
     * @throws {Error}
     */
    compareDocumentPosition(otherNode: PseudoNode): number;
    /**
     * Check whether a node is this node or one of its descendants.
     * @param {PseudoNode|null} otherNode The node to look for
     * @returns {boolean}
     */
    contains(otherNode: PseudoNode | null): boolean;
    getRootNode(options?: {
        composed: boolean;
    }): PseudoNode;
    hasChildNodes(): boolean;
    /**
     * Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
     * already in a tree is moved, and the children of a document fragment are moved in order.
     * @param {PseudoNode} newNode The node to insert
     * @param {PseudoNode|null} [referenceNode=null] The child of this node to insert before, or null to insert at the end
     * @returns {PseudoNode} The inserted node
     * @throws {Error} When the reference node is not a child of this node, or the new node is this node or contains it
     */
    insertBefore(newNode: PseudoNode, referenceNode?: PseudoNode | null): PseudoNode | PseudoDocumentFragment;
    isDefaultNamespace(namespaceURI: string | null): boolean;
    /**
     * Not implemented yet.
     * @throws {Error}
     */
    isEqualNode(otherNode: PseudoNode): boolean;
    isSameNode(otherNode: PseudoNode): boolean;
    lookupPrefix(namespace: string): string | null;
    lookupNamespaceURI(prefix: string): string | null;
    normalize(): void;
    /**
     * Remove a child from this node, it no longer has a parent or siblings afterwards.
     * @param {PseudoNode} childElement The child node to remove
     * @returns {PseudoNode} The removed node
     * @throws {Error} When the node is not a child of this node
     */
    removeChild(childElement: PseudoNode): PseudoNode;
    /**
     * Replace a child of this node with another node (which is moved if it is already in a tree).
     * @param {PseudoNode} newChild The node which takes the place
     * @param {PseudoNode} oldChild The child of this node to replace
     * @returns {PseudoNode} The replaced node
     * @throws {Error} When the old node is not a child of this node
     */
    replaceChild(newChild: PseudoNode, oldChild: PseudoNode): PseudoNode;
}

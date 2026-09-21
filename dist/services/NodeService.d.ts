import { PseudoNodeList } from '../classes/PseudoNodeList';
import { LinkedTreeList } from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList';
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
    private next;
    private prev;
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
     *
     * @param {PseudoNode} childNode
     * @returns {PseudoNode}
     */
    appendChild(childNode: PseudoNode): PseudoNode;
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
     * Not implemented yet.
     * @throws {Error}
     */
    contains(otherNode: PseudoNode): boolean;
    getRootNode(options?: {
        composed: boolean;
    }): PseudoNode;
    hasChildNodes(): boolean;
    /**
     * Not implemented yet.
     * @throws {Error}
     */
    insertBefore(newNode: PseudoNode, referenceNode: PseudoNode | null): PseudoNode | PseudoDocumentFragment;
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
     * Remove the given child from this node.
     * @param {PseudoNode} childElement The child node, or its TreeLinker from the children list
     * @returns {PseudoNode}
     * @throws {Error} When the node is not a child of this node
     */
    removeChild(childElement: PseudoNode): PseudoNode;
    /**
     * Not implemented yet.
     * @throws {Error}
     */
    replaceChild(newChild: PseudoNode, oldChild: PseudoNode): PseudoNode;
}

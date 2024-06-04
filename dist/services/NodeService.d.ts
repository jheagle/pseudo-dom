import PseudoNodeList from '../classes/PseudoNodeList';
import LinkedTreeList from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList';
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker';
import { PseudoNode } from '../interfaces/PseudoNode';
import EventTargetService from './EventTargetService';
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
    parent: NodeService | undefined;
    protected nodeValue: string;
    protected textContext: string;
    protected name: string;
    private next;
    private prev;
    /**
     *
     * @constructor
     */
    constructor();
    get baseURI(): Location | string;
    get childNodes(): PseudoNodeList | LinkedTreeList;
    get firstChild(): any;
    get isConnected(): boolean;
    get lastChild(): any;
    get nextSibling(): NodeService;
    get nodeName(): string;
    get nodeType(): number;
    get ownerDocument(): any | undefined;
    get parentNode(): NodeService;
    get parentElement(): NodeService;
    get previousSibling(): NodeService;
    /**
     *
     * @param {NodeService} childNode
     * @returns {NodeService}
     */
    appendChild(childNode: NodeService): NodeService;
    cloneNode(): void;
    compareDocumentPosition(): void;
    contains(): void;
    getRootNode(): NodeService;
    hasChildNodes(): boolean;
    insertBefore(): void;
    isDefaultNamespace(): void;
    isEqualNode(): void;
    isSameNode(): void;
    lookupPrefix(): void;
    lookupNamespaceURI(): void;
    normalize(): void;
    /**
     *
     * @param {NodeService} childElement
     * @returns {NodeService}
     */
    removeChild(childElement: TreeLinker): TreeLinker;
    replaceChild(): void;
}

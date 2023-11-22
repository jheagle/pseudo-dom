/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoEventTarget from './PseudoEventTarget';
import PseudoNodeList from './PseudoNodeList';
import LinkedTreeList from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList';
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker';
/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
declare class PseudoNode extends PseudoEventTarget {
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
    parent: PseudoNode | undefined;
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
    get firstChild(): TreeLinker;
    get isConnected(): boolean;
    get lastChild(): TreeLinker;
    get nextSibling(): PseudoNode;
    get nodeName(): string;
    get nodeType(): number;
    get ownerDocument(): any | undefined;
    get parentNode(): PseudoNode;
    get parentElement(): PseudoNode;
    get previousSibling(): PseudoNode;
    /**
     *
     * @param {PseudoNode} childNode
     * @returns {PseudoNode}
     */
    appendChild(childNode: PseudoNode): PseudoNode;
    cloneNode(): void;
    compareDocumentPosition(): void;
    contains(): void;
    getRootNode(): PseudoNode;
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
     * @param {PseudoNode} childElement
     * @returns {PseudoNode}
     */
    removeChild(childElement: TreeLinker): TreeLinker;
    replaceChild(): void;
}
export default PseudoNode;

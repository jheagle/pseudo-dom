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
    static readonly DOCUMENT_POSITION_DISCONNECTED = 1;
    static readonly DOCUMENT_POSITION_PRECEDING = 2;
    static readonly DOCUMENT_POSITION_FOLLOWING = 4;
    static readonly DOCUMENT_POSITION_CONTAINS = 8;
    static readonly DOCUMENT_POSITION_CONTAINED_BY = 16;
    static readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
    private static nextNodeId;
    /** The raw list of every child node (all types), used to implement childNodes/firstChild/lastChild/insertBefore/removeChild. Not the same thing as Element.children (an HTMLCollection of just the element children). */
    protected childList: PseudoNodeList | LinkedTreeList;
    parent: PseudoNode | null;
    protected nodeNameValue: string;
    private nodeValueStore;
    /** The document which made this node (createElement and the like), for when it is not in a tree yet. */
    protected ownerDocumentStore: PseudoDocument | null;
    /** A number for each node in the order they were made, used to give nodes which are in different trees a consistent order. */
    private readonly nodeId;
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
     * Whether this kind of node can have children (text, comments and attributes cannot).
     * @returns {boolean}
     */
    protected get acceptsChildren(): boolean;
    /**
     * Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
     * Kinds of node which are made with arguments override this to give them.
     * @returns {NodeService}
     */
    protected cloneShallow(): NodeService;
    /**
     * Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
     * afterwards. Kinds of node with more to compare (an element has attributes) override this.
     * @param {NodeService} other The node to compare with
     * @returns {boolean}
     */
    protected equalsShallow(other: NodeService): boolean;
    /**
     * Add nodes (strings become text nodes) as the last children of this node, in the order given.
     * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
     * @throws {Error} When this kind of node cannot have children
     */
    append(...nodes: Array<PseudoNode | string>): void;
    /**
     * Add nodes (strings become text nodes) as the first children of this node, in the order given.
     * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
     * @throws {Error} When this kind of node cannot have children
     */
    prepend(...nodes: Array<PseudoNode | string>): void;
    /**
     * Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.
     * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
     * @throws {Error} When this kind of node cannot have children
     */
    replaceChildren(...nodes: Array<PseudoNode | string>): void;
    /**
     * Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
     * no parent.
     * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
     */
    before(...nodes: Array<PseudoNode | string>): void;
    /**
     * Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
     * parent.
     * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
     */
    after(...nodes: Array<PseudoNode | string>): void;
    /**
     * Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
     * when this node has no parent.
     * @param {...(PseudoNode|string)} nodes The nodes (or text) to put in this node's place
     */
    replaceWith(...nodes: Array<PseudoNode | string>): void;
    /**
     * Remove this node from its parent. Does nothing when it has no parent.
     */
    remove(): void;
    /**
     * Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
     * becomes a text node belonging to this node's document, anything else is returned as it is.
     * @param {PseudoNode|string} value The value to add
     * @returns {PseudoNode}
     */
    private toChildNode;
    /**
     * Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
     * (for example elements applying default events) can do so.
     * @param {NodeService} child The node which was inserted
     */
    protected childInserted(child: NodeService): void;
    /**
     * Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
     * too, all the way down.
     * @param {boolean} [deep=false] Copy the children as well
     * @returns {PseudoNode}
     */
    cloneNode(deep?: boolean): PseudoNode;
    /**
     * Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
     * itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
     * CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
     * otherwise PRECEDING or FOLLOWING by their order in the tree.
     * @param {PseudoNode} otherNode The node to locate
     * @returns {number}
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
     * Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
     * needs the same attributes), and children which are equal in the same order.
     * @param {PseudoNode|null} otherNode The node to compare with
     * @returns {boolean}
     */
    isEqualNode(otherNode: PseudoNode | null): boolean;
    isSameNode(otherNode: PseudoNode): boolean;
    lookupPrefix(namespace: string): string | null;
    lookupNamespaceURI(prefix: string): string | null;
    /**
     * Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.
     */
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
/**
 * Simulate the behaviour of the Text Class when there is no DOM available: the text in an element.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 * @property {string} data - The text
 * @property {number} length - How many characters there are
 * @property {string} wholeText - The text of this node and of the text nodes next to it
 */
export declare class TextService extends NodeService {
    /**
     * @param {string} [data=''] The text
     * @constructor
     */
    constructor(data?: string);
    protected get acceptsChildren(): boolean;
    get nodeName(): string;
    get nodeType(): number;
    get data(): string;
    set data(data: string);
    get length(): number;
    get textContent(): string | null;
    set textContent(text: string | null);
    get wholeText(): string;
    /**
     * Break this text node in two at a position: this node keeps the text before it and a new node with the rest is put
     * after this one.
     * @param {number} offset How many characters stay in this node
     * @returns {TextService} The new node
     * @throws {Error} When the offset is beyond the end of the text
     */
    splitText(offset: number): TextService;
    protected cloneShallow(): NodeService;
}
/**
 * Simulate the behaviour of the Comment Class when there is no DOM available: a note in the markup which is not shown.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 * @property {string} data - The comment
 * @property {number} length - How many characters there are
 */
export declare class CommentService extends NodeService {
    /**
     * @param {string} [data=''] The comment
     * @constructor
     */
    constructor(data?: string);
    protected get acceptsChildren(): boolean;
    get nodeName(): string;
    get nodeType(): number;
    get data(): string;
    set data(data: string);
    get length(): number;
    get textContent(): string | null;
    set textContent(text: string | null);
    protected cloneShallow(): NodeService;
}

/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import generateNodeList from '../factories/generateNodeList'
import { PseudoNodeList } from '../classes/PseudoNodeList'
import { LinkedTreeList } from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'
import { TreeLinker } from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'
import { PseudoNode } from '../interfaces/PseudoNode'
import EventTargetService from './EventTargetService'
import { PseudoElement } from '../interfaces/PseudoElement'
import { PseudoDocument } from '../interfaces/PseudoDocument'
import { PseudoDocumentFragment } from '../interfaces/PseudoDocumentFragment'

/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
export class NodeService extends EventTargetService implements PseudoNode {
  public static readonly DEFAULT_NODE = 0
  public static readonly ELEMENT_NODE = 1
  public static readonly ATTRIBUTE_NODE = 2
  public static readonly TEXT_NODE = 3
  public static readonly CDATA_SECTION_NODE = 4
  public static readonly ENTITY_REFERENCE_NODE = 5
  public static readonly ENTITY_NODE = 6
  public static readonly PROCESSING_INSTRUCTION_NODE = 7
  public static readonly COMMENT_NODE = 8
  public static readonly DOCUMENT_NODE = 9
  public static readonly DOCUMENT_TYPE_NODE = 10
  public static readonly DOCUMENT_FRAGMENT_NODE = 11
  public static readonly NOTATION_NODE = 12
  public static readonly DOCUMENT_POSITION_DISCONNECTED = 1
  public static readonly DOCUMENT_POSITION_PRECEDING = 2
  public static readonly DOCUMENT_POSITION_FOLLOWING = 4
  public static readonly DOCUMENT_POSITION_CONTAINS = 8
  public static readonly DOCUMENT_POSITION_CONTAINED_BY = 16
  public static readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32
  private static nextNodeId: number = 1
  /** The raw list of every child node (all types), used to implement childNodes/firstChild/lastChild/insertBefore/removeChild. Not the same thing as Element.children (an HTMLCollection of just the element children). */
  protected childList: PseudoNodeList | LinkedTreeList
  public parent: PseudoNode | null
  protected nodeNameValue: string
  private nodeValueStore: string | null
  /** The document which made this node (createElement and the like), for when it is not in a tree yet. */
  protected ownerDocumentStore: PseudoDocument | null
  /** A number for each node in the order they were made, used to give nodes which are in different trees a consistent order. */
  private readonly nodeId: number
  /** The linker which holds this node in the children list of its parent, from which its siblings are found (null while it has no parent). */
  protected listLinker: TreeLinker | null

  /**
   *
   * @constructor
   */
  constructor () {
    super()
    this.nodeValueStore = null
    this.ownerDocumentStore = null
    this.nodeId = NodeService.nextNodeId++
    this.nodeNameValue = ''
    this.childList = generateNodeList()
    this.parent = null
    this.listLinker = null
  }

  get baseURI (): Location | string {
    return window.location || '/'
  }

  get childNodes (): PseudoNodeList | LinkedTreeList {
    return this.childList
  }

  get firstChild (): PseudoNode | null {
    return this.childList.first ? this.childList.first.data : null
  }

  get isConnected (): boolean {
    // Connected means the tree the node is in has a document at the top
    return this.getRootNode().nodeType === NodeService.DOCUMENT_NODE
  }

  get lastChild (): PseudoNode | null {
    return this.childList.last ? this.childList.last.data : null
  }

  get nextSibling (): PseudoNode | null {
    return this.listLinker && this.listLinker.next ? this.listLinker.next.data : null
  }

  get nodeName (): string {
    return this.nodeNameValue || ''
  }

  get nodeType (): number {
    return NodeService.DEFAULT_NODE
  }

  get nodeValue (): string | null {
    return this.nodeValueStore
  }

  set nodeValue (value: string | null) {
    this.nodeValueStore = value
  }

  get ownerDocument (): PseudoDocument | null {
    if (this.nodeType === NodeService.DOCUMENT_NODE) {
      return null
    }
    const root: PseudoNode = this.getRootNode()
    return root.nodeType === NodeService.DOCUMENT_NODE ? root as unknown as PseudoDocument : this.ownerDocumentStore
  }

  get parentNode (): PseudoNode | null {
    return this.parent
  }

  get parentElement (): PseudoElement | null {
    return this.parent && this.parent.nodeType === NodeService.ELEMENT_NODE ? this.parent as PseudoElement : null
  }

  get previousSibling (): PseudoNode | null {
    return this.listLinker && this.listLinker.prev ? this.listLinker.prev.data : null
  }

  get textContent (): string | null {
    if (this.nodeType === NodeService.DOCUMENT_NODE || this.nodeType === NodeService.DOCUMENT_TYPE_NODE) {
      return null
    }
    // The text of everything below, in order (comments and the like do not count)
    let text: string = ''
    Array.from(this.childNodes).forEach((child: PseudoNode) => {
      if (child.nodeType === NodeService.TEXT_NODE) {
        text += child.nodeValue
      } else if (child.nodeType !== NodeService.COMMENT_NODE) {
        text += child.textContent
      }
    })
    return text
  }

  set textContent (text: string | null) {
    if (this.nodeType === NodeService.DOCUMENT_NODE || this.nodeType === NodeService.DOCUMENT_TYPE_NODE) {
      return
    }
    // All the children are replaced by a single text node (or none for an empty text)
    while (this.firstChild) {
      this.removeChild(this.firstChild)
    }
    if (text !== null && typeof text !== 'undefined' && String(text) !== '') {
      const textNode: TextService = new TextService(String(text))
      textNode.ownerDocumentStore = this.ownerDocument
      this.appendChild(textNode)
    }
  }

  /**
   * Add a node as the last child of this node (a node which is already in a tree is moved).
   * @param {PseudoNode} childNode The node to add
   * @returns {PseudoNode} The added node
   */
  appendChild (childNode: PseudoNode): PseudoNode {
    return this.insertBefore(childNode, null)
  }

  /**
   * Whether this kind of node can have children (text, comments and attributes cannot).
   * @returns {boolean}
   */
  protected get acceptsChildren (): boolean {
    return true
  }

  /**
   * Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
   * Kinds of node which are made with arguments override this to give them.
   * @returns {NodeService}
   */
  protected cloneShallow (): NodeService {
    const copy: NodeService = new (this.constructor as any)()
    copy.nodeValue = this.nodeValue
    copy.ownerDocumentStore = this.ownerDocumentStore
    return copy
  }

  /**
   * Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
   * afterwards. Kinds of node with more to compare (an element has attributes) override this.
   * @param {NodeService} other The node to compare with
   * @returns {boolean}
   */
  protected equalsShallow (other: NodeService): boolean {
    return this.nodeName === other.nodeName && this.nodeValue === other.nodeValue
  }

  /**
   * Add nodes (strings become text nodes) as the last children of this node, in the order given.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   * @throws {Error} When this kind of node cannot have children
   */
  public append (...nodes: Array<PseudoNode | string>): void {
    nodes.forEach(node => this.appendChild(this.toChildNode(node)))
  }

  /**
   * Add nodes (strings become text nodes) as the first children of this node, in the order given.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   * @throws {Error} When this kind of node cannot have children
   */
  public prepend (...nodes: Array<PseudoNode | string>): void {
    const reference: PseudoNode | null = this.firstChild
    nodes.forEach(node => this.insertBefore(this.toChildNode(node), reference))
  }

  /**
   * Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   * @throws {Error} When this kind of node cannot have children
   */
  public replaceChildren (...nodes: Array<PseudoNode | string>): void {
    while (this.firstChild) {
      this.removeChild(this.firstChild)
    }
    this.append(...nodes)
  }

  /**
   * Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
   * no parent.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   */
  public before (...nodes: Array<PseudoNode | string>): void {
    const parent: PseudoNode | null = this.parentNode
    if (!parent) {
      return
    }
    nodes.forEach(node => parent.insertBefore(this.toChildNode(node), this))
  }

  /**
   * Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
   * parent.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   */
  public after (...nodes: Array<PseudoNode | string>): void {
    const parent: PseudoNode | null = this.parentNode
    if (!parent) {
      return
    }
    const reference: PseudoNode | null = this.nextSibling
    nodes.forEach(node => parent.insertBefore(this.toChildNode(node), reference))
  }

  /**
   * Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
   * when this node has no parent.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to put in this node's place
   */
  public replaceWith (...nodes: Array<PseudoNode | string>): void {
    const parent: PseudoNode | null = this.parentNode
    if (!parent) {
      return
    }
    nodes.forEach(node => parent.insertBefore(this.toChildNode(node), this))
    parent.removeChild(this)
  }

  /**
   * Remove this node from its parent. Does nothing when it has no parent.
   */
  public remove (): void {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }

  /**
   * Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
   * becomes a text node belonging to this node's document, anything else is returned as it is.
   * @param {PseudoNode|string} value The value to add
   * @returns {PseudoNode}
   */
  private toChildNode (value: PseudoNode | string): PseudoNode {
    if (typeof value !== 'string') {
      return value
    }
    const text: TextService = new TextService(value)
    text.ownerDocumentStore = this.ownerDocument
    return text
  }

  /**
   * Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
   * (for example elements applying default events) can do so.
   * @param {NodeService} child The node which was inserted
   */
  protected childInserted (child: NodeService): void {}

  /**
   * Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
   * too, all the way down.
   * @param {boolean} [deep=false] Copy the children as well
   * @returns {PseudoNode}
   */
  cloneNode (deep: boolean = false): PseudoNode {
    const copy: NodeService = this.cloneShallow()
    if (deep) {
      Array.from(this.childNodes).forEach((child: PseudoNode) => copy.appendChild(child.cloneNode(true)))
    }
    return copy
  }

  /**
   * Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
   * itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
   * CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
   * otherwise PRECEDING or FOLLOWING by their order in the tree.
   * @param {PseudoNode} otherNode The node to locate
   * @returns {number}
   */
  compareDocumentPosition (otherNode: PseudoNode): number {
    if (otherNode === this) {
      return 0
    }
    const pathFromRoot = (node: PseudoNode): Array<PseudoNode> => {
      const path: Array<PseudoNode> = []
      for (let current: PseudoNode | null = node; current; current = current.parentNode) {
        path.unshift(current)
      }
      return path
    }
    const mine: Array<PseudoNode> = pathFromRoot(this)
    const theirs: Array<PseudoNode> = pathFromRoot(otherNode)
    if (mine[0] !== theirs[0]) {
      // Not in the same tree, so there is no real order: use a consistent one (the order the nodes were made in)
      const before: number = (otherNode as NodeService).nodeId < this.nodeId
        ? NodeService.DOCUMENT_POSITION_PRECEDING
        : NodeService.DOCUMENT_POSITION_FOLLOWING
      return NodeService.DOCUMENT_POSITION_DISCONNECTED | NodeService.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC | before
    }
    if (theirs.length < mine.length && theirs.every((node, index) => mine[index] === node)) {
      return NodeService.DOCUMENT_POSITION_CONTAINS | NodeService.DOCUMENT_POSITION_PRECEDING
    }
    if (mine.length < theirs.length && mine.every((node, index) => theirs[index] === node)) {
      return NodeService.DOCUMENT_POSITION_CONTAINED_BY | NodeService.DOCUMENT_POSITION_FOLLOWING
    }
    // The paths part ways at siblings: whichever comes first among them is first in the tree
    let depth: number = 0
    while (mine[depth] === theirs[depth]) {
      ++depth
    }
    for (let sibling: PseudoNode | null = mine[depth].nextSibling; sibling; sibling = sibling.nextSibling) {
      if (sibling === theirs[depth]) {
        return NodeService.DOCUMENT_POSITION_FOLLOWING
      }
    }
    return NodeService.DOCUMENT_POSITION_PRECEDING
  }

  /**
   * Check whether a node is this node or one of its descendants.
   * @param {PseudoNode|null} otherNode The node to look for
   * @returns {boolean}
   */
  contains (otherNode: PseudoNode | null): boolean {
    let current: PseudoNode | null = otherNode
    while (current) {
      if (current === this) {
        return true
      }
      current = current.parentNode
    }
    return false
  }

  getRootNode (options: { composed: boolean } = { composed: false }): PseudoNode {
    return this.parent ? this.parent.getRootNode(options) : this
  }

  hasChildNodes (): boolean {
    return this.childList.length > 0
  }

  /**
   * Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
   * already in a tree is moved, and the children of a document fragment are moved in order.
   * @param {PseudoNode} newNode The node to insert
   * @param {PseudoNode|null} [referenceNode=null] The child of this node to insert before, or null to insert at the end
   * @returns {PseudoNode} The inserted node
   * @throws {Error} When the reference node is not a child of this node, or the new node is this node or contains it
   */
  insertBefore (newNode: PseudoNode, referenceNode: PseudoNode | null = null): PseudoNode | PseudoDocumentFragment {
    if (!this.acceptsChildren) {
      throw new Error('This kind of node cannot have children.')
    }
    if (referenceNode !== null && referenceNode.parentNode !== this) {
      throw new Error('The node before which the new node is to be inserted is not a child of this node.')
    }
    if (newNode === referenceNode) {
      // Inserting a node before itself leaves it where it is
      return newNode
    }
    if (typeof newNode.contains === 'function' && newNode.contains(this)) {
      throw new Error('The new node cannot be inserted into itself or one of its own descendants.')
    }
    if (newNode.nodeType === NodeService.DOCUMENT_FRAGMENT_NODE) {
      // The children of a fragment are inserted (moved) in order, and the fragment is left empty
      while (newNode.firstChild) {
        this.insertBefore(newNode.firstChild, referenceNode)
      }
      return newNode
    }
    if (newNode.parentNode) {
      // A node can only be in one place, so it is moved from where it was
      newNode.parentNode.removeChild(newNode)
    }
    const linker: TreeLinker = new TreeLinker({ data: newNode })
    this.childList.insertBefore(referenceNode ? (referenceNode as NodeService).listLinker : null, linker)
    const inserted: NodeService = newNode as NodeService
    inserted.parent = this
    inserted.listLinker = linker
    this.childInserted(inserted)
    return newNode
  }

  isDefaultNamespace (namespaceURI: string | null): boolean {
    return namespaceURI === null
  }

  /**
   * Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
   * needs the same attributes), and children which are equal in the same order.
   * @param {PseudoNode|null} otherNode The node to compare with
   * @returns {boolean}
   */
  isEqualNode (otherNode: PseudoNode | null): boolean {
    if (!otherNode || otherNode.nodeType !== this.nodeType || !this.equalsShallow(otherNode as NodeService)) {
      return false
    }
    const mine: Array<PseudoNode> = Array.from(this.childNodes)
    const theirs: Array<PseudoNode> = Array.from(otherNode.childNodes)
    return mine.length === theirs.length && mine.every((child, index) => child.isEqualNode(theirs[index]))
  }

  isSameNode (otherNode: PseudoNode): boolean {
    return this === otherNode
  }

  lookupPrefix (namespace: string): string | null {
    return null
  }

  lookupNamespaceURI (prefix: string): string | null {
    return null
  }

  /**
   * Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.
   */
  normalize (): void {
    let child: PseudoNode | null = this.firstChild
    while (child) {
      if (child.nodeType === NodeService.TEXT_NODE) {
        // Join the text nodes which follow into this one, and drop it when it is empty
        let text: string = child.nodeValue as string
        let following: PseudoNode | null = child.nextSibling
        while (following && following.nodeType === NodeService.TEXT_NODE) {
          text += following.nodeValue
          const after: PseudoNode | null = following.nextSibling
          this.removeChild(following)
          following = after
        }
        child.nodeValue = text
        if (text === '') {
          this.removeChild(child)
        }
        child = following
      } else {
        child.normalize()
        child = child.nextSibling
      }
    }
  }

  /**
   * Remove a child from this node, it no longer has a parent or siblings afterwards.
   * @param {PseudoNode} childElement The child node to remove
   * @returns {PseudoNode} The removed node
   * @throws {Error} When the node is not a child of this node
   */
  removeChild (childElement: PseudoNode): PseudoNode {
    if (!childElement || childElement.parentNode !== this) {
      throw new Error('The node to be removed is not a child of this node.')
    }
    const removed: NodeService = childElement as NodeService
    this.childList.remove(removed.listLinker as TreeLinker)
    removed.parent = null
    removed.listLinker = null
    return childElement
  }

  /**
   * Replace a child of this node with another node (which is moved if it is already in a tree).
   * @param {PseudoNode} newChild The node which takes the place
   * @param {PseudoNode} oldChild The child of this node to replace
   * @returns {PseudoNode} The replaced node
   * @throws {Error} When the old node is not a child of this node
   */
  replaceChild (newChild: PseudoNode, oldChild: PseudoNode): PseudoNode {
    if (!oldChild || oldChild.parentNode !== this) {
      throw new Error('The node to be replaced is not a child of this node.')
    }
    if (newChild === oldChild) {
      return oldChild
    }
    // The new node goes where the old one was, which is before the old node's next sibling (unless that is the new node)
    let reference: PseudoNode | null = oldChild.nextSibling
    if (reference === newChild) {
      reference = newChild.nextSibling
    }
    this.removeChild(oldChild)
    this.insertBefore(newChild, reference)
    return oldChild
  }
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
export class TextService extends NodeService {
  /**
   * @param {string} [data=''] The text
   * @constructor
   */
  constructor (data: string = '') {
    super()
    this.nodeValue = String(data)
  }

  protected get acceptsChildren (): boolean {
    return false
  }

  get nodeName (): string {
    return '#text'
  }

  get nodeType (): number {
    return NodeService.TEXT_NODE
  }

  get data (): string {
    return this.nodeValue as string
  }

  set data (data: string) {
    this.nodeValue = String(data)
  }

  get length (): number {
    return this.data.length
  }

  get textContent (): string | null {
    return this.data
  }

  set textContent (text: string | null) {
    this.data = text === null ? '' : String(text)
  }

  get wholeText (): string {
    let first: PseudoNode = this
    while (first.previousSibling && first.previousSibling.nodeType === NodeService.TEXT_NODE) {
      first = first.previousSibling
    }
    let text: string = ''
    for (let current: PseudoNode | null = first; current && current.nodeType === NodeService.TEXT_NODE; current = current.nextSibling) {
      text += current.nodeValue
    }
    return text
  }

  /**
   * Break this text node in two at a position: this node keeps the text before it and a new node with the rest is put
   * after this one.
   * @param {number} offset How many characters stay in this node
   * @returns {TextService} The new node
   * @throws {Error} When the offset is beyond the end of the text
   */
  public splitText (offset: number): TextService {
    if (offset < 0 || offset > this.length) {
      throw new Error('The offset is beyond the end of the text.')
    }
    const rest: TextService = new TextService(this.data.slice(offset))
    rest.ownerDocumentStore = this.ownerDocumentStore
    this.data = this.data.slice(0, offset)
    if (this.parentNode) {
      this.parentNode.insertBefore(rest, this.nextSibling)
    }
    return rest
  }

  protected cloneShallow (): NodeService {
    const copy: TextService = new TextService(this.data)
    copy.ownerDocumentStore = this.ownerDocumentStore
    return copy
  }
}

/**
 * Simulate the behaviour of the Comment Class when there is no DOM available: a note in the markup which is not shown.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 * @property {string} data - The comment
 * @property {number} length - How many characters there are
 */
export class CommentService extends NodeService {
  /**
   * @param {string} [data=''] The comment
   * @constructor
   */
  constructor (data: string = '') {
    super()
    this.nodeValue = String(data)
  }

  protected get acceptsChildren (): boolean {
    return false
  }

  get nodeName (): string {
    return '#comment'
  }

  get nodeType (): number {
    return NodeService.COMMENT_NODE
  }

  get data (): string {
    return this.nodeValue as string
  }

  set data (data: string) {
    this.nodeValue = String(data)
  }

  get length (): number {
    return this.data.length
  }

  get textContent (): string | null {
    return this.data
  }

  set textContent (text: string | null) {
    this.data = text === null ? '' : String(text)
  }

  protected cloneShallow (): NodeService {
    const copy: CommentService = new CommentService(this.data)
    copy.ownerDocumentStore = this.ownerDocumentStore
    return copy
  }
}

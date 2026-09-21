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
  public children: PseudoNodeList | LinkedTreeList
  public parent: PseudoNode | null
  protected nodeNameValue: string
  private nodeValueStore: string | null
  private textContentStore: string | null
  /** The linker which holds this node in the children list of its parent, from which its siblings are found (null while it has no parent). */
  protected listLinker: TreeLinker | null

  /**
   *
   * @constructor
   */
  constructor () {
    super()
    this.nodeValueStore = ''
    this.textContentStore = ''
    this.nodeNameValue = ''
    this.children = generateNodeList()
    this.parent = null
    this.listLinker = null
  }

  get baseURI (): Location | string {
    return window.location || '/'
  }

  get childNodes (): PseudoNodeList | LinkedTreeList {
    return this.children
  }

  get firstChild (): PseudoNode | null {
    return this.children.first ? this.children.first.data : null
  }

  get isConnected (): boolean {
    return !!this.parent
  }

  get lastChild (): PseudoNode | null {
    return this.children.last ? this.children.last.data : null
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
    return null
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
    return this.textContentStore
  }

  set textContent (text: string | null) {
    this.textContentStore = text
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
   * Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
   * (for example elements applying default events) can do so.
   * @param {NodeService} child The node which was inserted
   */
  protected childInserted (child: NodeService): void {}

  /**
   * Not implemented yet.
   * @throws {Error}
   */
  cloneNode (deep: boolean = false): PseudoNode {
    throw new Error(`NodeService.cloneNode(${deep}) is not implemented yet.`)
  }

  /**
   * Not implemented yet.
   * @throws {Error}
   */
  compareDocumentPosition (otherNode: PseudoNode): number {
    throw new Error('NodeService.compareDocumentPosition() is not implemented yet.')
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
    return this.children.length > 0
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
    this.children.insertBefore(referenceNode ? (referenceNode as NodeService).listLinker : null, linker)
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
   * Not implemented yet.
   * @throws {Error}
   */
  isEqualNode (otherNode: PseudoNode): boolean {
    throw new Error('NodeService.isEqualNode() is not implemented yet.')
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

  normalize (): void {}

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
    this.children.remove(removed.listLinker as TreeLinker)
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

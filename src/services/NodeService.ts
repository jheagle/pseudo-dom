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
  private next: PseudoNode | null
  private prev: PseudoNode | null

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
    this.next = null
    this.prev = null
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
    return this.isConnected
      ? this.next
      : null
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
    return this.isConnected
      ? this.prev
      : null
  }

  get textContent (): string | null {
    return this.textContentStore
  }

  set textContent (text: string | null) {
    this.textContentStore = text
  }

  /**
   *
   * @param {PseudoNode} childNode
   * @returns {PseudoNode}
   */
  appendChild (childNode: PseudoNode): PseudoNode {
    this.children.append(childNode)
    return childNode
  }

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
   * Not implemented yet.
   * @throws {Error}
   */
  contains (otherNode: PseudoNode): boolean {
    throw new Error('NodeService.contains() is not implemented yet.')
  }

  getRootNode (options: { composed: boolean } = { composed: false }): PseudoNode {
    return this.parent ? this.parent.getRootNode(options) : this
  }

  hasChildNodes (): boolean {
    return this.children.length > 0
  }

  /**
   * Not implemented yet.
   * @throws {Error}
   */
  insertBefore (newNode: PseudoNode, referenceNode: PseudoNode | null): PseudoNode | PseudoDocumentFragment {
    throw new Error('NodeService.insertBefore() is not implemented yet.')
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
   * Remove the given child from this node.
   * @param {PseudoNode} childElement The child node, or its TreeLinker from the children list
   * @returns {PseudoNode}
   * @throws {Error} When the node is not a child of this node
   */
  removeChild (childElement: PseudoNode): PseudoNode {
    let found: any = null
    this.children.forEach((linker: any) => {
      if (found === null && (linker === childElement || linker.data === childElement)) {
        found = linker
      }
    })
    if (found === null) {
      throw new Error('The node to be removed is not a child of this node.')
    }
    this.children.remove(found)
    return found.data
  }

  /**
   * Not implemented yet.
   * @throws {Error}
   */
  replaceChild (newChild: PseudoNode, oldChild: PseudoNode): PseudoNode {
    throw new Error('NodeService.replaceChild() is not implemented yet.')
  }
}

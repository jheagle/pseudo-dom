/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoEventTarget from './PseudoEventTarget'
import generateNodeList from '../factories/generateNodeList'
import PseudoNodeList from './PseudoNodeList'
import LinkedTreeList from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'

/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
class PseudoNode extends PseudoEventTarget {
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
  public parent: PseudoNode | undefined
  protected nodeValue: string
  protected textContext: string
  protected name: string
  private next: PseudoNode | null
  private prev: PseudoNode | null

  /**
   *
   * @constructor
   */
  constructor () {
    super()
    this.nodeValue = ''
    this.textContext = ''
    this.children = generateNodeList()
    this.parent = undefined
  }

  get baseURI (): Location | string {
    return window.location || '/'
  }

  get childNodes (): PseudoNodeList | LinkedTreeList {
    return this.children
  }

  get firstChild () {
    return this.children.first
  }

  get isConnected () {
    return !!this.parent
  }

  get lastChild () {
    return this.children.last
  }

  get nextSibling () {
    return this.isConnected
      ? this.next
      : null
  }

  get nodeName () {
    return this.name || ''
  }

  get nodeType () {
    return PseudoNode.DEFAULT_NODE
  }

  get ownerDocument (): any | undefined {
    return undefined
  }

  get parentNode () {
    return this.parent
  }

  get parentElement () {
    return this.parent.nodeType === PseudoNode.ELEMENT_NODE ? this.parent : null
  }

  get previousSibling () {
    return this.isConnected
      ? this.prev
      : null
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

  cloneNode () {}

  compareDocumentPosition () {}

  contains () {}

  getRootNode (): PseudoNode {
    return this.parent.getRootNode() || this.parent
  }

  hasChildNodes () {
    return this.children.length > 0
  }

  insertBefore () {}

  isDefaultNamespace () {}

  isEqualNode () {}

  isSameNode () {}

  lookupPrefix () {}

  lookupNamespaceURI () {}

  normalize () {}

  /**
   *
   * @param {PseudoNode} childElement
   * @returns {PseudoNode}
   */
  removeChild (childElement: TreeLinker): TreeLinker {
    return this.children.remove(childElement)
  }

  replaceChild () {}
}

export default PseudoNode

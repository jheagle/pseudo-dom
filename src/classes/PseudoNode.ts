/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoEventTarget, { listenerOptions } from '../recipes/PseudoEventTarget'
import PseudoNodeList from './PseudoNodeList'
import LinkedTreeList from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'
import generateNodeList from '../factories/generateNodeList'
import PseudoElement from './PseudoElement'
import PseudoEvent from './PseudoEvent'
import generateListenerList, { ListenerListInstance } from '../factories/generateListenerList'

/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
abstract class PseudoNode implements PseudoEventTarget {
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

  public readonly baseURI: Location | string
  public readonly childNodes: PseudoNodeList | LinkedTreeList
  public readonly firstChild: PseudoNode
  public readonly isConnected: boolean
  public readonly lastChild: PseudoNode
  public readonly nextSibling: PseudoNode
  public readonly nodeName: string
  public readonly nodeType: number
  public nodeValue: string
  public ownerDocument: Document | null
  public parentNode: PseudoNode
  public parentElement: PseudoElement
  public previousSibling: PseudoNode
  protected textContent: string

  private listenerList: ListenerListInstance

  /**
   *
   * @constructor
   */
  constructor () {
    this.baseURI = typeof window !== 'undefined' ? window.location : '/'
    this.childNodes = generateNodeList()
    this.firstChild = this.childNodes.first ? this.childNodes.first.data : null
    this.isConnected = false
    this.lastChild = this.childNodes.last ? this.childNodes.last.data : null
    this.nextSibling = this.next ? this.next.data : null
    this.nodeName = ''
    this.nodeType = PseudoNode.DEFAULT_NODE
    this.nodeValue = ''
    this.ownerDocument = null
    this.parentNode = this.childNodes.parent ? this.childNodes.parent.data : null
    this.parentElement = this.nodeType === PseudoNode.ELEMENT_NODE && this.childNodes.parent ? this.childNodes.parent.data : null
    this.previousSibling = this.prev ? this.prev.data : null
    this.textContent = ''

    this.listenerList = generateListenerList()
  }

  /**
   *
   * @param {PseudoNode} childNode
   * @returns {PseudoNode}
   */
  appendChild (childNode: PseudoNode): PseudoNode {
    this.childNodes.append(childNode)
    return childNode
  }

  cloneNode () {}

  compareDocumentPosition () {}

  contains () {}

  getRootNode (): PseudoNode {
    return this.parentNode.getRootNode() || this.parentNode
  }

  hasChildNodes () {
    return this.childNodes.length > 0
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
    return this.childNodes.remove(childElement)
  }

  replaceChild () {}

  addEventListener (type: string, callback: any, useCapture: listenerOptions | boolean): undefined {
    return this.listenerList.addEventListener(type, callback, useCapture)
  }

  removeEventListener (type: string, callback: Function): undefined {
    return this.listenerList.removeEventListener(type, callback)
  }

  dispatchEvent (event: PseudoEvent, target: PseudoEventTarget): boolean {
    return this.listenerList.dispatchEvent(event, target)
  }
}

export default PseudoNode

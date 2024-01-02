import IsTreeNode from 'collect-your-stuff/dist/recipes/IsTreeNode'
import PseudoNode from '../classes/PseudoNode'
import PseudoNodeList from '../classes/PseudoNodeList'
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'
import generateNodeList from './generateNodeList'

/**
 * Create an instance of a PseudoNode which is attached (attached to the DOM tree, though in this case it is just a tree)
 * @param {NodeFactory} linkedNode
 * @returns {PseudoNode}
 */
const buildAttached = (linkedNode: NodeFactory): PseudoNode => {
  /**
   * Simulate the behaviour of the Node Class when there is no DOM available.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @augments PseudoEventTarget
   */
  class PseudoNodeAttached extends PseudoNode {
    /**
     *
     * @constructor
     */
    constructor () {
      super()
      this.baseURI = typeof window !== 'undefined' ? window.location : '/'
      this.childNodes = linkedNode.children
      this.firstChild = linkedNode.first ? linkedNode.first.data : null
      this.isConnected = true
      this.lastChild = linkedNode.last ? linkedNode.last.data : null
      this.nextSibling = linkedNode.next ? linkedNode.next.data : null
      this.nodeName = ''
      this.nodeType = PseudoNode.DEFAULT_NODE
      this.nodeValue = typeof linkedNode.data === 'string' ? linkedNode.data : ''
      this.ownerDocument = linkedNode.children.length ? linkedNode.children.rootParent : null
      this.parentNode = linkedNode.parent ? linkedNode.parent.data : null
      this.parentElement = this.nodeType === PseudoNode.ELEMENT_NODE && linkedNode.parent ? linkedNode.parent.data : null
      this.previousSibling = linkedNode.prev ? linkedNode.prev.data : null
      this.textContent = ''
      if (typeof linkedNode.data === 'object') {
        NodeFactory.validProperties.forEach(property => {
          if (!linkedNode.data.hasOwnProperty(property)) {
            return
          }
          this[property] = linkedNode.data[property]
        })
      }
      if (!this.nodeName && this.nodeType !== PseudoNode.DEFAULT_NODE) {
        switch (this.nodeType) {
          case PseudoNode.ELEMENT_NODE:
            break
          case PseudoNode.ATTRIBUTE_NODE:
            break
          case PseudoNode.TEXT_NODE:
            this.nodeName = '#text'
            this.textContent = this.nodeValue
            break
          case PseudoNode.CDATA_SECTION_NODE:
            break
          case PseudoNode.ENTITY_REFERENCE_NODE:
            break
          case PseudoNode.ENTITY_NODE:
            break
          case PseudoNode.PROCESSING_INSTRUCTION_NODE:
            break
          case PseudoNode.COMMENT_NODE:
            break
          case PseudoNode.DOCUMENT_NODE:
            break
          case PseudoNode.DOCUMENT_TYPE_NODE:
            break
          case PseudoNode.DOCUMENT_FRAGMENT_NODE:
            break
          case PseudoNode.NOTATION_NODE:
            break
        }
      }
    }

    /**
     *
     * @param {PseudoNode} childNode
     * @returns {PseudoNode}
     */
    appendChild (childNode: PseudoNode): PseudoNode {
      linkedNode.next = childNode
      childNode.prev = newElement
      return childNode
    }

    cloneNode () {}

    compareDocumentPosition () {}

    contains () {}

    getRootNode () {
      return linkedNode.rootParent
    }

    hasChildNodes (): boolean { return false }

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
      // @ts-ignore
      return this.children.remove(childElement)
    }

    replaceChild () {}
  }

  return new PseudoNodeAttached()
}

/**
 * NodeFactory keeps a PseudoNode attached to the DOM tree.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 */
export class NodeFactory extends TreeLinker {
  public static readonly NODE_NAME = 'nodeName'
  public static readonly NODE_TYPE = 'nodeType'
  public static readonly NODE_VALUE = 'nodeValue'
  public static readonly TEXT_CONTENT = 'textContent'
  public static readonly validProperties = [
    NodeFactory.NODE_NAME,
    NodeFactory.NODE_TYPE,
    NodeFactory.NODE_VALUE,
    NodeFactory.TEXT_CONTENT,
  ]

  public readonly classType: typeof NodeFactory = NodeFactory

  /**
   * Create the new TreeLinker instance, provide the data and optionally set references for next, prev, parent, or children.
   * @param {Object} [settings={}]
   * @param {*} [settings.data=null] The data to be stored in this tree node
   * @param {TreeLinker} [settings.next=null] The reference to the next linker if any
   * @param {TreeLinker} [settings.prev=null] The reference to the previous linker if any
   * @param {LinkedTreeList} [settings.children=null] The references to child linkers if any
   * @param {TreeLinker} [settings.parent=null] The reference to a parent linker if any
   * @param {IsArrayable<IsTreeNode>} [settings.listClass=PseudoNodeList] Give the type of list to use for storing the children
   */
  public constructor ({
    data = null,
    next = null,
    prev = null,
    children = null,
    parent = null,
    listClass = PseudoNodeList
  }:
    {
      data?: any;
      next?: IsTreeNode;
      prev?: IsTreeNode;
      children?: Array<any>;
      parent?: IsTreeNode;
      listClass?: any
    } = {}) {
    super({ data: data, next: next, prev: prev, parent: parent })
    this.children = this.childrenFromArray(children, listClass) ?? generateNodeList()
    this.data = buildAttached(this)
  }

  public static fromArray = (values = [], linkerClass = NodeFactory) => values.reduce(
    (list, element) => {
      const newElement = linkerClass.make(element, linkerClass)
      if (list.head === null) {
        return { head: newElement, tail: newElement }
      }
      list.tail.next = newElement
      newElement.prev = list.tail
      return { head: list.head, tail: newElement }
    },
    { head: null, tail: null }
  )
}

/**
 *
 */
const generateNode = () => {
  return NodeFactory
}

export default generateNode

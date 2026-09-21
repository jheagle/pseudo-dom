'use strict'

const __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule
    ? mod
    : {
        default: mod
      }
}
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.NodeService = void 0
/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const generateNodeList_1 = __importDefault(require('../factories/generateNodeList'))
const TreeLinker_1 = require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker')
const EventTargetService_1 = __importDefault(require('./EventTargetService'))
/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
class NodeService extends EventTargetService_1.default {
  /**
   *
   * @constructor
   */
  constructor () {
    super()
    this.nodeValueStore = ''
    this.textContentStore = ''
    this.nodeNameValue = ''
    this.children = (0, generateNodeList_1.default)()
    this.parent = null
    this.listLinker = null
  }

  get baseURI () {
    return window.location || '/'
  }

  get childNodes () {
    return this.children
  }

  get firstChild () {
    return this.children.first ? this.children.first.data : null
  }

  get isConnected () {
    return !!this.parent
  }

  get lastChild () {
    return this.children.last ? this.children.last.data : null
  }

  get nextSibling () {
    return this.listLinker && this.listLinker.next ? this.listLinker.next.data : null
  }

  get nodeName () {
    return this.nodeNameValue || ''
  }

  get nodeType () {
    return NodeService.DEFAULT_NODE
  }

  get nodeValue () {
    return this.nodeValueStore
  }

  set nodeValue (value) {
    this.nodeValueStore = value
  }

  get ownerDocument () {
    return null
  }

  get parentNode () {
    return this.parent
  }

  get parentElement () {
    return this.parent && this.parent.nodeType === NodeService.ELEMENT_NODE ? this.parent : null
  }

  get previousSibling () {
    return this.listLinker && this.listLinker.prev ? this.listLinker.prev.data : null
  }

  get textContent () {
    return this.textContentStore
  }

  set textContent (text) {
    this.textContentStore = text
  }

  /**
   * Add a node as the last child of this node (a node which is already in a tree is moved).
   * @param {PseudoNode} childNode The node to add
   * @returns {PseudoNode} The added node
   */
  appendChild (childNode) {
    return this.insertBefore(childNode, null)
  }

  /**
   * Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
   * (for example elements applying default events) can do so.
   * @param {NodeService} child The node which was inserted
   */
  childInserted (child) {}
  /**
   * Not implemented yet.
   * @throws {Error}
   */
  cloneNode (deep = false) {
    throw new Error(`NodeService.cloneNode(${deep}) is not implemented yet.`)
  }

  /**
   * Not implemented yet.
   * @throws {Error}
   */
  compareDocumentPosition (otherNode) {
    throw new Error('NodeService.compareDocumentPosition() is not implemented yet.')
  }

  /**
   * Check whether a node is this node or one of its descendants.
   * @param {PseudoNode|null} otherNode The node to look for
   * @returns {boolean}
   */
  contains (otherNode) {
    let current = otherNode
    while (current) {
      if (current === this) {
        return true
      }
      current = current.parentNode
    }
    return false
  }

  getRootNode (options = {
    composed: false
  }) {
    return this.parent ? this.parent.getRootNode(options) : this
  }

  hasChildNodes () {
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
  insertBefore (newNode, referenceNode = null) {
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
    const linker = new TreeLinker_1.TreeLinker({
      data: newNode
    })
    this.children.insertBefore(referenceNode ? referenceNode.listLinker : null, linker)
    const inserted = newNode
    inserted.parent = this
    inserted.listLinker = linker
    this.childInserted(inserted)
    return newNode
  }

  isDefaultNamespace (namespaceURI) {
    return namespaceURI === null
  }

  /**
   * Not implemented yet.
   * @throws {Error}
   */
  isEqualNode (otherNode) {
    throw new Error('NodeService.isEqualNode() is not implemented yet.')
  }

  isSameNode (otherNode) {
    return this === otherNode
  }

  lookupPrefix (namespace) {
    return null
  }

  lookupNamespaceURI (prefix) {
    return null
  }

  normalize () {}
  /**
   * Remove a child from this node, it no longer has a parent or siblings afterwards.
   * @param {PseudoNode} childElement The child node to remove
   * @returns {PseudoNode} The removed node
   * @throws {Error} When the node is not a child of this node
   */
  removeChild (childElement) {
    if (!childElement || childElement.parentNode !== this) {
      throw new Error('The node to be removed is not a child of this node.')
    }
    const removed = childElement
    this.children.remove(removed.listLinker)
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
  replaceChild (newChild, oldChild) {
    if (!oldChild || oldChild.parentNode !== this) {
      throw new Error('The node to be replaced is not a child of this node.')
    }
    if (newChild === oldChild) {
      return oldChild
    }
    // The new node goes where the old one was, which is before the old node's next sibling (unless that is the new node)
    let reference = oldChild.nextSibling
    if (reference === newChild) {
      reference = newChild.nextSibling
    }
    this.removeChild(oldChild)
    this.insertBefore(newChild, reference)
    return oldChild
  }
}
exports.NodeService = NodeService
NodeService.DEFAULT_NODE = 0
NodeService.ELEMENT_NODE = 1
NodeService.ATTRIBUTE_NODE = 2
NodeService.TEXT_NODE = 3
NodeService.CDATA_SECTION_NODE = 4
NodeService.ENTITY_REFERENCE_NODE = 5
NodeService.ENTITY_NODE = 6
NodeService.PROCESSING_INSTRUCTION_NODE = 7
NodeService.COMMENT_NODE = 8
NodeService.DOCUMENT_NODE = 9
NodeService.DOCUMENT_TYPE_NODE = 10
NodeService.DOCUMENT_FRAGMENT_NODE = 11
NodeService.NOTATION_NODE = 12

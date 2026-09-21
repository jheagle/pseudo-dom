'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.for-each.js')
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
    this.next = null
    this.prev = null
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
    return this.isConnected ? this.next : null
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
    return this.isConnected ? this.prev : null
  }

  get textContent () {
    return this.textContentStore
  }

  set textContent (text) {
    this.textContentStore = text
  }

  /**
   *
   * @param {PseudoNode} childNode
   * @returns {PseudoNode}
   */
  appendChild (childNode) {
    this.children.append(childNode)
    return childNode
  }

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
   * Not implemented yet.
   * @throws {Error}
   */
  contains (otherNode) {
    throw new Error('NodeService.contains() is not implemented yet.')
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
   * Not implemented yet.
   * @throws {Error}
   */
  insertBefore (newNode, referenceNode) {
    throw new Error('NodeService.insertBefore() is not implemented yet.')
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
   * Remove the given child from this node.
   * @param {PseudoNode} childElement The child node, or its TreeLinker from the children list
   * @returns {PseudoNode}
   * @throws {Error} When the node is not a child of this node
   */
  removeChild (childElement) {
    let found = null
    this.children.forEach(linker => {
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
  replaceChild (newChild, oldChild) {
    throw new Error('NodeService.replaceChild() is not implemented yet.')
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

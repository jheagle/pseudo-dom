'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.NodeService = void 0
var _generateNodeList = _interopRequireDefault(require('../factories/generateNodeList'))
var _EventTargetService = _interopRequireDefault(require('./EventTargetService'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
class NodeService extends _EventTargetService.default {
  /**
   *
   * @constructor
   */
  constructor () {
    super()
    this.nodeValue = ''
    this.textContext = ''
    this.children = (0, _generateNodeList.default)()
    this.parent = undefined
  }

  get baseURI () {
    return window.location || '/'
  }

  get childNodes () {
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
    return this.isConnected ? this.next : null
  }

  get nodeName () {
    return this.name || ''
  }

  get nodeType () {
    return NodeService.DEFAULT_NODE
  }

  get ownerDocument () {
    return undefined
  }

  get parentNode () {
    return this.parent
  }

  get parentElement () {
    return this.parent.nodeType === NodeService.ELEMENT_NODE ? this.parent : null
  }

  get previousSibling () {
    return this.isConnected ? this.prev : null
  }

  /**
   *
   * @param {NodeService} childNode
   * @returns {NodeService}
   */
  appendChild (childNode) {
    this.children.append(childNode)
    return childNode
  }

  cloneNode () {}
  compareDocumentPosition () {}
  contains () {}
  getRootNode () {
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
   * @param {NodeService} childElement
   * @returns {NodeService}
   */
  removeChild (childElement) {
    return this.children.remove(childElement)
  }

  replaceChild () {}
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

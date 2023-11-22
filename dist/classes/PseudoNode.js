'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _PseudoEventTarget = _interopRequireDefault(require('./PseudoEventTarget'))
var _generateNodeList = _interopRequireDefault(require('../factories/generateNodeList'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
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
class PseudoNode extends _PseudoEventTarget.default {
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
    return PseudoNode.DEFAULT_NODE
  }

  get ownerDocument () {
    return undefined
  }

  get parentNode () {
    return this.parent
  }

  get parentElement () {
    return this.parent.nodeType === PseudoNode.ELEMENT_NODE ? this.parent : null
  }

  get previousSibling () {
    return this.isConnected ? this.prev : null
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
   * @param {PseudoNode} childElement
   * @returns {PseudoNode}
   */
  removeChild (childElement) {
    return this.children.remove(childElement)
  }

  replaceChild () {}
}
PseudoNode.DEFAULT_NODE = 0
PseudoNode.ELEMENT_NODE = 1
PseudoNode.ATTRIBUTE_NODE = 2
PseudoNode.TEXT_NODE = 3
PseudoNode.CDATA_SECTION_NODE = 4
PseudoNode.ENTITY_REFERENCE_NODE = 5
PseudoNode.ENTITY_NODE = 6
PseudoNode.PROCESSING_INSTRUCTION_NODE = 7
PseudoNode.COMMENT_NODE = 8
PseudoNode.DOCUMENT_NODE = 9
PseudoNode.DOCUMENT_TYPE_NODE = 10
PseudoNode.DOCUMENT_FRAGMENT_NODE = 11
PseudoNode.NOTATION_NODE = 12
var _default = exports.default = PseudoNode

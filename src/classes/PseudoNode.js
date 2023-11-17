/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoEventTarget from './PseudoEventTarget'

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
  /**
   *
   * @constructor
   */
  constructor () {
    super()
    this.nodeValue = ''
    this.textContext = ''
    this.children = []
    this.parent = undefined
  }

  get baseURI () {
    return window.location || '/'
  }

  get childNodes () {
    return this.children
  }

  get firstChild () {
    return this.children[0]
  }

  get isConnected () {
    return !!this.parent
  }

  get lastChild () {
    return this.children[this.children.length - 1]
  }

  get nextSibling () {
    return this.isConnected
      ? this.parent.children[this.parent.children.indexOf(this) + 1]
      : null
  }

  get nodeName () {
    return this.name || ''
  }

  get nodeType () {
    const typeName = 'DEFAULT_NODE'
    const nodeTypes = [
      'DEFAULT_NODE',
      'ELEMENT_NODE',
      'ATTRIBUTE_NODE',
      'TEXT_NODE',
      'CDATA_SECTION_NODE',
      'ENTITY_REFERENCE_NODE',
      'ENTITY_NODE',
      'PROCESSING_INSTRUCTION_NODE',
      'COMMENT_NODE',
      'DOCUMENT_NODE',
      'DOCUMENT_TYPE_NODE',
      'DOCUMENT_FRAGMENT_NODE',
      'NOTATION_NODE'
    ]
    return nodeTypes.indexOf(typeName)
  }

  get ownerDocument () {
    return undefined
  }

  get parentNode () {
    return this.parent
  }

  get parentElement () {
    return this.parent.nodeType === 1 ? this.parent : null
  }

  get previousSibling () {
    return this.isConnected
      ? this.parent.children[this.parent.children.indexOf(this) - 1]
      : null
  }

  /**
   *
   * @param {PseudoNode} childNode
   * @returns {PseudoNode}
   */
  appendChild (childNode) {
    this.children.push(childNode)
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
    return this.children.splice(this.children.indexOf(childElement), 1)[0]
  }

  replaceChild () {}
}

export default PseudoNode

'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.find.js')
require('core-js/modules/esnext.iterator.for-each.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
/**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
/**
 *
 * @type {PseudoHTMLElement}
 */
const HTMLElementService_1 = require('../services/HTMLElementService')
const NodeService_1 = require('../services/NodeService')
const DocumentFragmentService_1 = require('../services/DocumentFragmentService')
/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement (which is not in the document until it is appended)
 */
class PseudoHTMLDocument extends HTMLElementService_1.HTMLElementService {
  /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @constructor
   */
  constructor () {
    super()
    const html = new HTMLElementService_1.HTMLElementService({
      tagName: 'html'
    })
    this.appendChild(html)
    /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */
    this.head = new HTMLElementService_1.HTMLElementService({
      tagName: 'head'
    })
    html.appendChild(this.head)
    /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */
    this.body = new HTMLElementService_1.HTMLElementService({
      tagName: 'body'
    })
    html.appendChild(this.body)
  }

  get nodeName () {
    return '#document'
  }

  get nodeType () {
    return NodeService_1.NodeService.DOCUMENT_NODE
  }

  // A document has no text of its own, and setting it does nothing
  get textContent () {
    return null
  }

  set textContent (text) {}
  /**
   * Make an element of the given type which belongs to this document but is not added anywhere until it is appended.
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */
  createElement (tagName = 'div') {
    // Like the DOM, the new element is not added anywhere: it has no parent until it is appended
    const element = new HTMLElementService_1.HTMLElementService({
      tagName
    })
    element.ownerDocumentStore = this
    return element
  }

  /**
   * Make a text node which belongs to this document.
   * @param {string} [data=''] The text
   * @returns {TextService}
   */
  createTextNode (data = '') {
    const text = new NodeService_1.TextService(data)
    text.ownerDocumentStore = this
    return text
  }

  /**
   * Make a comment which belongs to this document.
   * @param {string} [data=''] The comment
   * @returns {CommentService}
   */
  createComment (data = '') {
    const comment = new NodeService_1.CommentService(data)
    comment.ownerDocumentStore = this
    return comment
  }

  /**
   * Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
   * then inserted in one go.
   * @returns {DocumentFragmentService}
   */
  createDocumentFragment () {
    const fragment = new DocumentFragmentService_1.DocumentFragmentService()
    fragment.ownerDocumentStore = this
    return fragment
  }

  /**
   * Make a copy of this document. The copy has no parent or listeners, and a deep copy has copies of everything in the
   * document (a shallow one is an empty document).
   * @param {boolean} [deep=false] Copy everything in the document as well
   * @returns {PseudoNode}
   */
  cloneNode (deep = false) {
    const copy = new PseudoHTMLDocument()
    // The new document starts out with its own html, head and body, a copy has only what was copied from this one
    while (copy.firstChild) {
      copy.removeChild(copy.firstChild)
    }
    copy.head = null
    copy.body = null
    if (deep) {
      Array.from(this.childNodes).forEach(child => copy.appendChild(child.cloneNode(true)))
      const html = Array.from(copy.childNodes).find(child => child.tagName === 'html')
      const inHtml = tagName => html ? Array.from(html.childNodes).find(child => child.tagName === tagName) || null : null
      copy.head = inHtml('head')
      copy.body = inHtml('body')
    }
    return copy
  }
}
exports.default = PseudoHTMLDocument

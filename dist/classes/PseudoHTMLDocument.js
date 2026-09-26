'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.find.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
const DocumentService_1 = require('../services/DocumentService')
/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available. Like the real HTMLDocument, this
 * only adds the html/head/body structure on top of what Document already gives (createElement, createTextNode,
 * createComment, createDocumentFragment, getElementById, textContent always null).
 */
class PseudoHTMLDocument extends DocumentService_1.DocumentService {
  /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   */
  constructor () {
    super()
    const html = this.createElement('html')
    this.appendChild(html)
    /**
     * Create document head element
     */
    this.head = this.createElement('head')
    html.appendChild(this.head)
    /**
     * Create document body element
     */
    this.body = this.createElement('body')
    html.appendChild(this.body)
  }

  /**
   * A copy of this document with none of its html/head/body (cloneNode, from the inherited cloneShallow hook, fills
   * them back in, deep copies own document's, empty otherwise - see cloneNode).
   */
  cloneShallow () {
    const copy = new this.constructor()
    while (copy.firstChild) {
      copy.removeChild(copy.firstChild)
    }
    copy.head = null
    copy.body = null
    return copy
  }

  /**
   * Make a copy of this document. The copy has no parent or listeners, and a deep copy has copies of everything in
   * the document (a shallow one is an empty document).
   * @param deep Copy everything in the document as well
   */
  cloneNode (deep = false) {
    const copy = super.cloneNode(deep)
    if (deep) {
      const html = Array.from(copy.childNodes).find(child => child.tagName === 'html')
      const inHtml = tagName => html ? Array.from(html.childNodes).find(child => child.tagName === tagName) || null : null
      copy.head = inHtml('head')
      copy.body = inHtml('body')
    }
    return copy
  }
}
exports.default = PseudoHTMLDocument

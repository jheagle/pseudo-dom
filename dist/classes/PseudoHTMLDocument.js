'use strict'

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

  /**
   * Create and return a PseudoHTMLElement, which is not added to the document until it is appended somewhere
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */
  createElement (tagName = 'div') {
    // Like the DOM, the new element is not added anywhere: it has no parent until it is appended
    return new HTMLElementService_1.HTMLElementService({
      tagName
    })
  }
}
exports.default = PseudoHTMLDocument

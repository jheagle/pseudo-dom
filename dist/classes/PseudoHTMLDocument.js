'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _PseudoHTMLElement = _interopRequireDefault(require('./PseudoHTMLElement'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
/**
 *
 * @type {PseudoHTMLElement}
 */

/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
 */
class PseudoHTMLDocument extends _PseudoHTMLElement.default {
  /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @returns {PseudoHTMLDocument}
   * @constructor
   */
  constructor () {
    super()
    const html = new _PseudoHTMLElement.default({
      tagName: 'html',
      parent: this
    })
    /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */
    this.head = new _PseudoHTMLElement.default({
      tagName: 'head',
      parent: html
    })

    /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */
    this.body = new _PseudoHTMLElement.default({
      tagName: 'body',
      parent: html
    })
    html.children = [this.head, this.body]

    /**
     * Create document child element
     * @type {PseudoHTMLElement[]}
     */
    this.children = [html]
  }

  /**
   * Create and return a PseudoHTMLElement
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */
  createElement () {
    const tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div'
    const returnElement = new _PseudoHTMLElement.default({
      tagName
    })
    returnElement.parent = this
    return returnElement
  }
}
var _default = exports.default = PseudoHTMLDocument

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
const generateNodeList_1 = __importDefault(require('../factories/generateNodeList'))
const TreeLinker_1 = require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker')
/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
 */
class PseudoHTMLDocument extends HTMLElementService_1.HTMLElementService {
  /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @constructor
   */
  constructor () {
    super()
    const html = new HTMLElementService_1.HTMLElementService({
      tagName: 'html',
      parent: this
    })
    /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */
    this.head = new HTMLElementService_1.HTMLElementService({
      tagName: 'head',
      parent: html
    })
    /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */
    this.body = new HTMLElementService_1.HTMLElementService({
      tagName: 'body',
      parent: html
    })
    html.children = (0, generateNodeList_1.default)(TreeLinker_1.TreeLinker.fromArray([this.head, this.body]).head)
  }

  /**
   * Create and return a PseudoHTMLElement
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */
  createElement (tagName = 'div') {
    const returnElement = new HTMLElementService_1.HTMLElementService({
      tagName
    })
    returnElement.parent = this
    return returnElement
  }
}
exports.default = PseudoHTMLDocument

/**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
/**
 *
 * @type {PseudoHTMLElement}
 */
import PseudoHTMLElement from '../interfaces/PseudoHTMLElement'
import generateNodeList from '../factories/generateNodeList'
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'

/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
 */
class PseudoHTMLDocument extends PseudoHTMLElement {
  private head: PseudoHTMLElement
  private body: PseudoHTMLElement

  /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @constructor
   */
  constructor () {
    super()

    const html = new PseudoHTMLElement({ tagName: 'html', parent: this })
    /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */
    this.head = new PseudoHTMLElement({ tagName: 'head', parent: html })

    /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */
    this.body = new PseudoHTMLElement({ tagName: 'body', parent: html })

    html.children = generateNodeList(TreeLinker.fromArray([this.head, this.body]).head)

  }

  /**
   * Create and return a PseudoHTMLElement
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */
  createElement (tagName: string = 'div'): PseudoHTMLElement {
    const returnElement = new PseudoHTMLElement({ tagName })
    returnElement.parent = this
    return returnElement
  }
}

export default PseudoHTMLDocument

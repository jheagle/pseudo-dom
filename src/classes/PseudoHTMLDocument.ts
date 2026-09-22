/**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
/**
 *
 * @type {PseudoHTMLElement}
 */
import { HTMLElementService as PseudoHTMLElement } from '../services/HTMLElementService'
import { NodeService, TextService, CommentService } from '../services/NodeService'
import { DocumentFragmentService } from '../services/DocumentFragmentService'
import { PseudoNode } from '../interfaces/PseudoNode'

/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement (which is not in the document until it is appended)
 */
class PseudoHTMLDocument extends PseudoHTMLElement {
  private head: PseudoHTMLElement | null
  private body: PseudoHTMLElement | null

  /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @constructor
   */
  constructor () {
    super()

    const html = new PseudoHTMLElement({ tagName: 'html' })
    this.appendChild(html)
    /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */
    this.head = new PseudoHTMLElement({ tagName: 'head' })
    html.appendChild(this.head)

    /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */
    this.body = new PseudoHTMLElement({ tagName: 'body' })
    html.appendChild(this.body)
  }

  get nodeName (): string {
    return '#document'
  }

  get nodeType (): number {
    return NodeService.DOCUMENT_NODE
  }

  // A document has no text of its own, and setting it does nothing
  get textContent (): string | null {
    return null
  }

  set textContent (text: string | null) {}

  /**
   * Make an element of the given type which belongs to this document but is not added anywhere until it is appended.
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */
  createElement (tagName: string = 'div'): PseudoHTMLElement {
    // Like the DOM, the new element is not added anywhere: it has no parent until it is appended
    const element: PseudoHTMLElement = new PseudoHTMLElement({ tagName })
    ;(element as any).ownerDocumentStore = this
    return element
  }

  /**
   * Make a text node which belongs to this document.
   * @param {string} [data=''] The text
   * @returns {TextService}
   */
  createTextNode (data: string = ''): TextService {
    const text: TextService = new TextService(data)
    ;(text as any).ownerDocumentStore = this
    return text
  }

  /**
   * Make a comment which belongs to this document.
   * @param {string} [data=''] The comment
   * @returns {CommentService}
   */
  createComment (data: string = ''): CommentService {
    const comment: CommentService = new CommentService(data)
    ;(comment as any).ownerDocumentStore = this
    return comment
  }

  /**
   * Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
   * then inserted in one go.
   * @returns {DocumentFragmentService}
   */
  createDocumentFragment (): DocumentFragmentService {
    const fragment: DocumentFragmentService = new DocumentFragmentService()
    ;(fragment as any).ownerDocumentStore = this
    return fragment
  }

  /**
   * Make a copy of this document. The copy has no parent or listeners, and a deep copy has copies of everything in the
   * document (a shallow one is an empty document).
   * @param {boolean} [deep=false] Copy everything in the document as well
   * @returns {PseudoNode}
   */
  cloneNode (deep: boolean = false): PseudoNode {
    const copy: PseudoHTMLDocument = new PseudoHTMLDocument()
    // The new document starts out with its own html, head and body, a copy has only what was copied from this one
    while (copy.firstChild) {
      copy.removeChild(copy.firstChild)
    }
    copy.head = null
    copy.body = null
    if (deep) {
      Array.from(this.childNodes).forEach((child: PseudoNode) => copy.appendChild(child.cloneNode(true)))
      const html: any = Array.from(copy.childNodes).find((child: any) => child.tagName === 'html')
      const inHtml = (tagName: string): PseudoHTMLElement | null =>
        html ? Array.from(html.childNodes).find((child: any) => child.tagName === tagName) as PseudoHTMLElement || null : null
      copy.head = inHtml('head')
      copy.body = inHtml('body')
    }
    return copy
  }
}

export default PseudoHTMLDocument

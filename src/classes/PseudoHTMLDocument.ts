/**
 * Substitute for the DOM HTMLDocument Class.
 */
import { HTMLElementService as PseudoHTMLElement } from '../services/HTMLElementService'
import { DocumentService } from '../services/DocumentService'
import { NodeService } from '../services/NodeService'

/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available. Like the real HTMLDocument, this
 * only adds the html/head/body structure on top of what Document already gives (createElement, createTextNode,
 * createComment, createDocumentFragment, getElementById, textContent always null).
 */
class PseudoHTMLDocument extends DocumentService {
  /** A reference to the Head child element */
  public head: PseudoHTMLElement | null
  /** A reference to the Body child element */
  public body: PseudoHTMLElement | null

  /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   */
  constructor () {
    super()

    const html = this.createElement('html') as unknown as PseudoHTMLElement
    this.appendChild(html)
    /**
     * Create document head element
     */
    this.head = this.createElement('head') as unknown as PseudoHTMLElement
    html.appendChild(this.head)

    /**
     * Create document body element
     */
    this.body = this.createElement('body') as unknown as PseudoHTMLElement
    html.appendChild(this.body)
  }

  /**
   * A copy of this document with none of its html/head/body (cloneNode, from the inherited cloneShallow hook, fills
   * them back in, deep copies own document's, empty otherwise - see cloneNode).
   */
  protected cloneShallow (): NodeService {
    const copy: PseudoHTMLDocument = new (this.constructor as any)()
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
  cloneNode (deep: boolean = false): PseudoHTMLDocument {
    const copy: PseudoHTMLDocument = super.cloneNode(deep) as PseudoHTMLDocument
    if (deep) {
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

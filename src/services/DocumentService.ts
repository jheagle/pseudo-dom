import { NodeService, TextService, CommentService } from './NodeService'
import { PseudoDocument } from '../interfaces/PseudoDocument'
import { PseudoElement } from '../interfaces/PseudoElement'
import { HTMLElementService } from './HTMLElementService'
import { DocumentFragmentService } from './DocumentFragmentService'
import getElementById from '../functions/getElementById'

/**
 * Simulate the behaviour of the Document Class when there is no DOM available.
 */
export class DocumentService extends NodeService implements PseudoDocument {
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
   * The first element, in tree order, whose id matches the given value, or null when there is none.
   * @param id
   */
  getElementById (id: string): PseudoElement | null {
    return getElementById(this, id)
  }

  /**
   * Make an element of the given type which belongs to this document but is not added anywhere until it is appended.
   * @param tagName The type of element to create
   */
  createElement (tagName: string = 'div'): PseudoElement {
    // Like the DOM, the new element is not added anywhere: it has no parent until it is appended
    const element: any = new HTMLElementService({ tagName })
    element.ownerDocumentStore = this
    return element
  }

  /**
   * Make a text node which belongs to this document.
   * @param data The text
   */
  createTextNode (data: string = ''): TextService {
    const text: TextService = new TextService(data)
    ;(text as any).ownerDocumentStore = this
    return text
  }

  /**
   * Make a comment which belongs to this document.
   * @param data The comment
   */
  createComment (data: string = ''): CommentService {
    const comment: CommentService = new CommentService(data)
    ;(comment as any).ownerDocumentStore = this
    return comment
  }

  /**
   * Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
   * then inserted in one go.
   */
  createDocumentFragment (): DocumentFragmentService {
    const fragment: DocumentFragmentService = new DocumentFragmentService()
    ;(fragment as any).ownerDocumentStore = this
    return fragment
  }
}

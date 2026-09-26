import { PseudoNode } from './PseudoNode'
import { PseudoElement } from './PseudoElement'
import { PseudoDocumentFragment } from './PseudoDocumentFragment'

export interface PseudoDocument extends PseudoNode {
  /**
   * The first element, in tree order, whose id matches the given value, or null when there is none.
   * @param id
   */
  getElementById (id: string): PseudoElement | null

  /**
   * Make an element of the given type which belongs to this document but is not added anywhere until it is appended.
   * @param tagName The type of element to create
   */
  createElement (tagName: string): PseudoElement

  /**
   * Make a text node which belongs to this document.
   * @param data The text
   */
  createTextNode (data: string): PseudoNode

  /**
   * Make a comment which belongs to this document.
   * @param data The comment
   */
  createComment (data: string): PseudoNode

  /**
   * Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
   * then inserted in one go.
   */
  createDocumentFragment (): PseudoDocumentFragment
}

import { PseudoNode } from './PseudoNode'
import { PseudoElement } from './PseudoElement'
import { PseudoDocumentFragment } from './PseudoDocumentFragment'

export interface PseudoDocument extends PseudoNode {
  /**
   * The first element, in tree order, whose id matches the given value, or null when there is none.
   * @param {string} id
   * @returns {PseudoElement|null}
   */
  getElementById (id: string): PseudoElement | null

  /**
   * Make an element of the given type which belongs to this document but is not added anywhere until it is appended.
   * @param {string} [tagName='div'] The type of element to create
   * @returns {PseudoElement}
   */
  createElement (tagName: string): PseudoElement

  /**
   * Make a text node which belongs to this document.
   * @param {string} [data=''] The text
   * @returns {PseudoNode}
   */
  createTextNode (data: string): PseudoNode

  /**
   * Make a comment which belongs to this document.
   * @param {string} [data=''] The comment
   * @returns {PseudoNode}
   */
  createComment (data: string): PseudoNode

  /**
   * Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
   * then inserted in one go.
   * @returns {PseudoDocumentFragment}
   */
  createDocumentFragment (): PseudoDocumentFragment
}

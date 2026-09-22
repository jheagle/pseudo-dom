import { PseudoElement } from './PseudoElement'

/**
 * A live collection of an element's (or a document's / document fragment's) element children: it is not a snapshot,
 * reading it after the tree changes reflects the change.
 */
export interface PseudoHTMLCollection extends Iterable<PseudoElement> {
  /**
   * How many elements are in the collection.
   */
  get length (): number

  /**
   * The element at the given index, or null when there is none.
   * @param {number} index
   * @returns {PseudoElement|null}
   */
  item (index: number): PseudoElement | null

  /**
   * The element whose id, or whose name attribute, is the given value, or null when there is none.
   * @param {string} name
   * @returns {PseudoElement|null}
   */
  namedItem (name: string): PseudoElement | null
}

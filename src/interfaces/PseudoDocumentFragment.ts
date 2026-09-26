import { PseudoNode } from './PseudoNode'
import { PseudoElement } from './PseudoElement'

export interface PseudoDocumentFragment extends PseudoNode {
  /**
   * The first element, in tree order, whose id matches the given value, or null when there is none.
   * @param id
   */
  getElementById (id: string): PseudoElement | null
}

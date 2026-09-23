import { NodeService } from './NodeService'
import { PseudoDocumentFragment } from '../interfaces/PseudoDocumentFragment'
import { PseudoElement } from '../interfaces/PseudoElement'
import getElementById from '../functions/getElementById'

/**
 * Simulate the behaviour of the DocumentFragment Class when there is no DOM available: a container for nodes which is
 * not part of a tree, when it is inserted its children are moved into the tree instead.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export class DocumentFragmentService extends NodeService implements PseudoDocumentFragment {
  get nodeName (): string {
    return '#document-fragment'
  }

  get nodeType (): number {
    return NodeService.DOCUMENT_FRAGMENT_NODE
  }

  /**
   * The first element, in tree order, whose id matches the given value, or null when there is none (the DOM's
   * NonElementParentNode mixin, which Document and DocumentFragment both implement).
   * @param {string} id
   * @returns {PseudoElement|null}
   */
  getElementById (id: string): PseudoElement | null {
    return getElementById(this, id)
  }
}

import { NodeService } from './NodeService'
import { PseudoDocument } from '../interfaces/PseudoDocument'
import { PseudoElement } from '../interfaces/PseudoElement'

/**
 * Simulate the behaviour of the Document Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export class DocumentService extends NodeService implements PseudoDocument {
  get nodeName (): string {
    return '#document'
  }

  get nodeType (): number {
    return NodeService.DOCUMENT_NODE
  }

  /**
   * The first element, in tree order, whose id matches the given value, or null when there is none.
   * @param {string} id
   * @returns {PseudoElement|null}
   */
  getElementById (id: string): PseudoElement | null {
    const search = (node: NodeService): PseudoElement | null => {
      for (const child of Array.from(node.childNodes) as Array<any>) {
        if (child.nodeType === NodeService.ELEMENT_NODE) {
          if (child.id === id) {
            return child
          }
          const found = search(child)
          if (found) {
            return found
          }
        }
      }
      return null
    }
    return search(this)
  }
}

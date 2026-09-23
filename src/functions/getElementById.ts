import { NodeService } from '../services/NodeService'
import { PseudoElement } from '../interfaces/PseudoElement'

/**
 * The first element, in tree order, below (not including) the given node whose id matches the given value, or null
 * when there is none. Shared by Document and DocumentFragment, which both implement the DOM's NonElementParentNode
 * mixin (so ShadowRoot, a DocumentFragment, gets it too).
 * @memberOf module:functions
 * @param {NodeService} root The node to search below
 * @param {string} id
 * @returns {PseudoElement|null}
 */
const getElementById = (root: NodeService, id: string): PseudoElement | null => {
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
  return search(root)
}

export default getElementById

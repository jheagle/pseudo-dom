import { PseudoNode } from '../interfaces/PseudoNode'
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget'

/**
 * Get all of the ancestors of a node, starting with the root of the tree and ending with the node's own parent (the
 * order in which an event travels down through them). A node which has no parent has no ancestors.
 * @param node The node to find the ancestors of
 */
const getParentNodes = (node: PseudoEventTarget | PseudoNode | any): Array<PseudoNode> => {
  const parents: Array<PseudoNode> = []
  let current: PseudoNode | null = node && node.parentNode ? node.parentNode : null
  while (current) {
    parents.unshift(current)
    current = current.parentNode
  }
  return parents
}

export default getParentNodes

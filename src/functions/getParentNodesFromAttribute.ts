import { PseudoNode } from '../interfaces/PseudoNode'
import { PseudoEventTarget } from '../interfaces/PseudoEventTarget'
import getParentNodes from './getParentNodes'

/**
 * A selector function for retrieving existing parent PseudoNode from the given child item.
 * This function will check all the parents starting from node, and scan the attributes
 * property for matches. The return array contains all matching parent ancestors, starting with the root of the tree.
 * @param attr The property to compare on each ancestor (a missing property counts as false)
 * @param value The value the property must have
 * @param node The node to find the matching ancestors of
 */
const getParentNodesFromAttribute = (attr: string, value: boolean | number | string, node: PseudoEventTarget | PseudoNode | any): Array<PseudoNode> => {
  return getParentNodes(node).filter((parent: any) => (parent[attr] || false) === value)
}

export default getParentNodesFromAttribute

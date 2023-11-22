/**
 * A helper selector function for retrieving all parent PseudoNode for the given child node.
 * @param {PseudoNode} node
 * @returns {Array.<PseudoNode>}
 */
import PseudoNode from '../classes/PseudoNode'
import getParentNodesFromAttribute from './getParentNodesFromAttribute'
import PseudoEventTarget from '../classes/PseudoEventTarget'

const getParentNodes = (node: PseudoEventTarget): Array<PseudoNode> => getParentNodesFromAttribute('', false, node)

export default getParentNodes
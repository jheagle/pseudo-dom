/**
 * A helper selector function for retrieving all parent PseudoNode for the given child node.
 * @param {PseudoNode} node
 * @returns {Array.<PseudoNode>}
 */
import PseudoNode from '../classes/PseudoNode';
import PseudoEventTarget from '../classes/PseudoEventTarget';
declare const getParentNodes: (node: PseudoEventTarget) => Array<PseudoNode>;
export default getParentNodes;

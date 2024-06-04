/**
 * A selector function for retrieving existing parent PseudoNode from the given child item.
 * This function will check all the parents starting from node, and scan the attributes
 * property for matches. The return array contains all matching parent ancestors.
 * WARNING: This is a recursive function.
 * @param {string} attr
 * @param {number|string} value
 * @param {PseudoNode} node
 * @returns {Array.<PseudoNode>}
 */
import PseudoNode from '../interfaces/PseudoNode';
import PseudoEventTarget from '../interfaces/PseudoEventTarget';
declare const getParentNodesFromAttribute: (attr: string, value: boolean | number | string, node: PseudoEventTarget | PseudoNode | any) => Array<PseudoNode>;
export default getParentNodesFromAttribute;

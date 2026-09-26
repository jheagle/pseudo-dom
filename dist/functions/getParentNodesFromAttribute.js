'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
const __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule
    ? mod
    : {
        default: mod
      }
}
Object.defineProperty(exports, '__esModule', {
  value: true
})
const getParentNodes_1 = __importDefault(require('./getParentNodes'))
/**
 * A selector function for retrieving existing parent PseudoNode from the given child item.
 * This function will check all the parents starting from node, and scan the attributes
 * property for matches. The return array contains all matching parent ancestors, starting with the root of the tree.
 * @param attr The property to compare on each ancestor (a missing property counts as false)
 * @param value The value the property must have
 * @param node The node to find the matching ancestors of
 */
const getParentNodesFromAttribute = (attr, value, node) => {
  return (0, getParentNodes_1.default)(node).filter(parent => (parent[attr] || false) === value)
}
exports.default = getParentNodesFromAttribute

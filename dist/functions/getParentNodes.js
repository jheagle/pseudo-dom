'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
/**
 * Get all of the ancestors of a node, starting with the root of the tree and ending with the node's own parent (the
 * order in which an event travels down through them). A node which has no parent has no ancestors.
 * @function getParentNodes
 * @param {PseudoEventTarget|PseudoNode|*} node The node to find the ancestors of
 * @returns {Array<PseudoNode>}
 */
const getParentNodes = node => {
  const parents = []
  let current = node && node.parentNode ? node.parentNode : null
  while (current) {
    parents.unshift(current)
    current = current.parentNode
  }
  return parents
}
exports.default = getParentNodes

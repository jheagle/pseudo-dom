'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
const getParentNodesFromAttribute = (attr, value, node) => {
  return Object.keys(node.parentNode).length ? (node.parentNode[attr] || false) === value ? getParentNodesFromAttribute(attr, value, node.parentNode).concat([node.parentNode]) : getParentNodesFromAttribute(attr, value, node.parentNode) : []
}
exports.default = getParentNodesFromAttribute

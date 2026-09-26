'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
const NodeService_1 = require('../services/NodeService')
/**
 * The first element, in tree order, below (not including) the given node whose id matches the given value, or null
 * when there is none. Shared by Document and DocumentFragment, which both implement the DOM's NonElementParentNode
 * mixin (so ShadowRoot, a DocumentFragment, gets it too).
 * @param root The node to search below
 * @param id
 */
const getElementById = (root, id) => {
  const search = node => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === NodeService_1.NodeService.ELEMENT_NODE) {
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
exports.default = getElementById

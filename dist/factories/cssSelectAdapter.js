'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
require('core-js/modules/esnext.iterator.for-each.js')
require('core-js/modules/esnext.iterator.some.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.cssSelectAdapter = void 0
/**
 * @file The css-select Adapter which lets it query pseudo-dom's own tree, instead of the domutils-based tree it
 * defaults to.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const NodeService_1 = require('../services/NodeService')
/**
 * Walk up from a node (not including it) to find the nearest element, in the given direction.
 * @param {*} node The node to start from
 * @param {'nextSibling'|'previousSibling'} direction Which sibling reference to follow
 * @returns {*|null}
 */
const nearestElementSibling = (node, direction) => {
  let current = node ? node[direction] : null
  while (current && current.nodeType !== NodeService_1.NodeService.ELEMENT_NODE) {
    current = current[direction]
  }
  return current || null
}
/**
 * Maps pseudo-dom's own Node / Element API onto the Adapter interface css-select needs to query a tree which is not
 * domutils' own (css-select's own Adapter<Node, ElementNode> type). Every method here is one pseudo-dom already has
 * under a different name; nothing here reimplements DOM behaviour.
 * @memberOf module:factories
 * @type {Object}
 */
exports.cssSelectAdapter = {
  isTag: node => !!node && node.nodeType === NodeService_1.NodeService.ELEMENT_NODE,
  existsOne: (test, elems) => elems.some(elem => exports.cssSelectAdapter.isTag(elem) && (test(elem) || exports.cssSelectAdapter.existsOne(test, exports.cssSelectAdapter.getChildren(elem)))),
  // pseudo-dom's className / classList are kept in sync with each other, but not with a literal 'class' attribute
  // (there is no such special-cased attribute here, unlike a real DOM) - so the 'class' css-select needs for class
  // selectors is read from className instead.
  getAttributeValue: (elem, name) => {
    const value = name === 'class' ? elem.className : elem.getAttribute(name)
    return value === null || value === undefined ? undefined : value
  },
  getChildren: node => Array.from(node.childNodes),
  getName: elem => elem.tagName,
  getParent: node => node.parentNode,
  // Unlike jQuery's siblings(), this is expected to include the node itself
  getSiblings: node => node.parentNode ? Array.from(node.parentNode.childNodes) : [node],
  prevElementSibling: node => nearestElementSibling(node, 'previousSibling'),
  getText: node => node.textContent || '',
  hasAttrib: (elem, name) => elem.hasAttribute(name),
  removeSubsets: nodes => nodes.filter((node, index) => !nodes.some((other, otherIndex) => otherIndex !== index && typeof other.contains === 'function' && other !== node && other.contains(node))),
  findAll: (test, nodes) => {
    const found = []
    const visit = list => list.forEach(node => {
      if (!exports.cssSelectAdapter.isTag(node)) {
        return
      }
      if (test(node)) {
        found.push(node)
      }
      visit(exports.cssSelectAdapter.getChildren(node))
    })
    visit(nodes)
    return found
  },
  findOne: (test, nodes) => {
    for (const node of nodes) {
      if (!exports.cssSelectAdapter.isTag(node)) {
        continue
      }
      if (test(node)) {
        return node
      }
      const inChildren = exports.cssSelectAdapter.findOne(test, exports.cssSelectAdapter.getChildren(node))
      if (inChildren) {
        return inChildren
      }
    }
    return null
  }
}
exports.default = exports.cssSelectAdapter

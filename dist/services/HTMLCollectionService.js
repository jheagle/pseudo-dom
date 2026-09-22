'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.find.js')
require('core-js/modules/esnext.iterator.for-each.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.HTMLCollectionService = void 0
/**
 * @file Substitute for the DOM HTMLCollection Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const NodeService_1 = require('./NodeService')
/**
 * Simulate the behaviour of the HTMLCollection Class when there is no DOM available: a live view of some of a node's
 * element descendants, recomputed each time it is used rather than kept in sync as they change.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
class HTMLCollectionService {
  /**
   * @param {NodeService} owner The node this is a live view of a part of
   * @param {function(*): boolean} [predicate] Only elements which pass this are included (every element by default)
   * @param {boolean} [deep=false] Include every matching descendant (true, like getElementsByTagName), not just the
   * direct element children (false, like Element.children)
   * @constructor
   */
  constructor (owner, predicate = () => true, deep = false) {
    this.owner = owner
    this.predicate = predicate
    this.deep = deep
  }

  /**
   * The current elements the collection holds, in tree order.
   * @returns {Array<PseudoNode>}
   */
  elements () {
    const results = []
    const visit = node => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === NodeService_1.NodeService.ELEMENT_NODE && this.predicate(child)) {
          results.push(child)
        }
        if (this.deep && child.nodeType === NodeService_1.NodeService.ELEMENT_NODE) {
          visit(child)
        }
      })
    }
    visit(this.owner)
    return results
  }

  /**
   * How many elements are in the collection right now.
   * @returns {number}
   */
  get length () {
    return this.elements().length
  }

  /**
   * The element at the given index, or null when there is none.
   * @param {number} index
   * @returns {*}
   */
  item (index) {
    return this.elements()[index] || null
  }

  /**
   * The element whose id, or (failing that) whose name attribute, is the given value, or null when there is none.
   * @param {string} name
   * @returns {*}
   */
  namedItem (name) {
    const elements = this.elements()
    return elements.find(element => element.id === name) || elements.find(element => element.getAttribute('name') === name) || null
  }

  /**
   * Iterate over the current elements.
   * @returns {Iterator}
   */
  [Symbol.iterator] () {
    return this.elements()[Symbol.iterator]()
  }
}
exports.HTMLCollectionService = HTMLCollectionService
exports.default = HTMLCollectionService

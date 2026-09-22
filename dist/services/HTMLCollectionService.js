'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
require('core-js/modules/esnext.iterator.find.js')
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
 * Simulate the behaviour of the HTMLCollection Class when there is no DOM available: a live view of the element
 * children of a node, recomputed from its childNodes each time it is used rather than kept in sync as they change.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
class HTMLCollectionService {
  /**
   * @param {NodeService} owner The node whose element children this is a live view of
   * @constructor
   */
  constructor (owner) {
    this.owner = owner
  }

  /**
   * The current element children of the owner, in order.
   * @returns {Array<PseudoNode>}
   */
  elements () {
    return Array.from(this.owner.childNodes).filter(node => node.nodeType === NodeService_1.NodeService.ELEMENT_NODE)
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
   * Iterate over the current element children.
   * @returns {Iterator}
   */
  [Symbol.iterator] () {
    return this.elements()[Symbol.iterator]()
  }
}
exports.HTMLCollectionService = HTMLCollectionService
exports.default = HTMLCollectionService

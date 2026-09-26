'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.map.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.PseudoNodeList = void 0
/**
 * Substitute for the NodeList interface.
 */
const LinkedTreeList_1 = require('collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList')
/**
 * A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
 * the linkers that hold them.
 */
class PseudoNodeList extends LinkedTreeList_1.LinkedTreeList {
  /**
   * Iterate over the nodes in this list.
   */
  [Symbol.iterator] () {
    // Walk the nodes of this list only (the linkers of a child list have no children of their own)
    let current = this.first
    return {
      next: () => {
        if (current === null) {
          return {
            done: true,
            value: undefined
          }
        }
        const result = {
          done: false,
          value: current.data
        }
        current = current.next
        return result
      }
    }
  }

  /**
   * Iterate over [index, node] pairs.
   */
  entries () {
    return Array.from(this).map((node, index) => [index, node])[Symbol.iterator]()
  }

  /**
   * Iterate over the indexes.
   */
  keys () {
    return Array.from(this).map((node, index) => index)[Symbol.iterator]()
  }

  /**
   * Iterate over the nodes.
   */
  values () {
    return Array.from(this)[Symbol.iterator]()
  }
}
exports.PseudoNodeList = PseudoNodeList

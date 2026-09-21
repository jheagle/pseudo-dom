'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.map.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.PseudoNodeList = void 0
/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const LinkedTreeList_1 = require('collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList')
/**
 * A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
 * the linkers that hold them.
 * @class
 * @augments LinkedTreeList
 */
class PseudoNodeList extends LinkedTreeList_1.LinkedTreeList {
  /**
   * Iterate over the nodes in this list.
   * @returns {Iterator}
   */
  [Symbol.iterator] () {
    const linkers = super[Symbol.iterator]()
    return {
      next: () => {
        const result = linkers.next()
        return result.done
          ? result
          : {
              done: false,
              value: result.value.data
            }
      }
    }
  }

  /**
   * Iterate over [index, node] pairs.
   * @returns {Iterator}
   */
  entries () {
    return Array.from(this).map((node, index) => [index, node])[Symbol.iterator]()
  }

  /**
   * Iterate over the indexes.
   * @returns {Iterator}
   */
  keys () {
    return Array.from(this).map((node, index) => index)[Symbol.iterator]()
  }

  /**
   * Iterate over the nodes.
   * @returns {Iterator}
   */
  values () {
    return Array.from(this)[Symbol.iterator]()
  }
}
exports.PseudoNodeList = PseudoNodeList

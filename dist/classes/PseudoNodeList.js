'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.PseudoNodeList = void 0
require('core-js/modules/esnext.async-iterator.map.js')
require('core-js/modules/esnext.iterator.map.js')
var _LinkedTreeList = require('collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList')
/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

class PseudoNodeList extends _LinkedTreeList.LinkedTreeList {
  get entries () {
    return Array.from(this)
  }

  get keys () {
    return Array.from(this.innerList).keys
  }

  get values () {
    return Array.from(this.innerList).map(item => item.data).values
  }
}
exports.PseudoNodeList = PseudoNodeList

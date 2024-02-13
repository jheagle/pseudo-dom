'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
require('core-js/modules/esnext.async-iterator.map.js')
require('core-js/modules/esnext.iterator.map.js')
require('core-js/modules/web.dom-collections.iterator.js')
var _LinkedTreeList = _interopRequireDefault(require('collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

class PseudoNodeList extends _LinkedTreeList.default {
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
var _default = exports.default = PseudoNodeList

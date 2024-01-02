'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _LinkedTreeList = _interopRequireDefault(require('collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'))
var _generateNode = _interopRequireDefault(require('../factories/generateNode'))
var _AttachedNodeIterator = _interopRequireDefault(require('../recipes/AttachedNodeIterator'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
class PseudoNodeList extends _LinkedTreeList.default {
  constructor () {
    super(...arguments)
    this.classType = PseudoNodeList
  }

  entries () {
    let count = 0
    return {
      [Symbol.iterator]: () => new _AttachedNodeIterator.default(this.first, node => {
        if (node === null) {
          return node
        }
        return [count++, node.data]
      })
    }
  }

  keys () {
    let count = 0
    return {
      [Symbol.iterator]: () => new _AttachedNodeIterator.default(this.first, node => count++)
    }
  }

  values () {
    return {
      [Symbol.iterator]: () => new _AttachedNodeIterator.default(this.first, node => {
        if (node === null) {
          return node
        }
        return node.data
      })
    }
  }

  /**
   * Be able to iterate over this class.
   * @returns {Iterator}
   */
  [Symbol.iterator] () {
    return new _AttachedNodeIterator.default(this.first)
  }

  /**
   * Convert an array into a LinkedTreeList instance, return the new instance.
   * @param {Array} [values=[]] An array of values which will be converted to nodes in this tree-list
   * @param {NodeFactory} [nodeClass=NodeFactory] The class to use for each node
   * @param {IsArrayable<NodeFactory>} [classType=PseudoNodeList] Provide the type of IsArrayable to use.
   * @returns {PseudoNodeList}
   */
  static fromArray () {
    const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
    const nodeClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _generateNode.default)()
    const classType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PseudoNodeList
    return _LinkedTreeList.default.fromArray(values, nodeClass, classType)
  }
}
var _default = exports.default = PseudoNodeList

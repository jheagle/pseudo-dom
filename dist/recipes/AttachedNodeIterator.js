'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
/**
 * Class TreeLinkerIterator returns the next value taking a left-first approach down a tree.
 */
class AttachedNodeIterator {
  constructor (current) {
    const valueRule = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
    this.current = current
    this.valueRule = valueRule
  }

  next () {
    let currentNode = this.current
    if (this.valueRule === null && currentNode !== null) {
      currentNode = currentNode.data
    }
    if (this.valueRule !== null) {
      currentNode = this.valueRule(currentNode)
    }
    const result = {
      value: currentNode,
      done: !this.current
    }
    this.current = this.current ? this.current.next : null
    return result
  }
}
var _default = exports.default = AttachedNodeIterator

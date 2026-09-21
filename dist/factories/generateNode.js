'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.NodeFactory = exports.LinkedNode = void 0
const TreeLinker_1 = require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker')
const NodeService_1 = require('../services/NodeService')
/**
 * A node which is stored in a TreeLinker and answers questions about its position in the tree by asking that linker.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
class LinkedNode extends NodeService_1.NodeService {
  /**
   * @param {TreeLinker} linker The linker holding this node
   * @param {string|null} value The value of the node
   * @constructor
   */
  constructor (linker, value = '') {
    super()
    this.linker = linker
    this.nodeValue = value
  }

  get childNodes () {
    return this.linker.children
  }

  get firstChild () {
    const children = this.linker.children
    return children && children.first ? children.first.data : null
  }

  get isConnected () {
    return !!this.linker.parent
  }

  get lastChild () {
    const children = this.linker.children
    return children && children.last ? children.last.data : null
  }

  get nextSibling () {
    return this.linker.next ? this.linker.next.data : null
  }

  get ownerDocument () {
    const root = this.linker.parent ? this.linker.rootParent : null
    return root ? root.data : null
  }

  get parentNode () {
    return this.linker.parent ? this.linker.parent.data : null
  }

  get parentElement () {
    const parent = this.parentNode
    return parent && parent.nodeType === NodeService_1.NodeService.ELEMENT_NODE ? parent : null
  }

  get previousSibling () {
    return this.linker.prev ? this.linker.prev.data : null
  }

  appendChild (childNode) {
    this.linker.next = childNode
    childNode.prev = this.linker
    return childNode
  }

  getRootNode () {
    const root = this.linker.rootParent
    return root ? root.data : this
  }
}
exports.LinkedNode = LinkedNode
class NodeFactory extends TreeLinker_1.TreeLinker {}
exports.NodeFactory = NodeFactory
/**
 * Create a TreeLinker class whose linkers each store a node (a LinkedNode) as their data, this can be used to build a
 * tree (or list) of nodes from plain values.
 * @function generateNode
 * @returns {Function} The NodeFactory class (a TreeLinker) to use as the linker class
 */
const generateNode = () => {
  NodeFactory.fromArray = (values = [], LinkerClass = NodeFactory) => values.reduce((list, element) => {
    if (typeof element !== 'object') {
      element = {
        data: element
      }
    }
    const newElement = new LinkerClass(Object.assign({}, element, {
      prev: list.tail
    }))
    newElement.data = new LinkedNode(newElement, element.data)
    if (list.head === null) {
      return {
        head: newElement,
        tail: newElement
      }
    }
    list.tail.next = newElement
    newElement.prev = list.tail
    return {
      head: list.head,
      tail: newElement
    }
  }, {
    head: null,
    tail: null
  })
  return NodeFactory
}
exports.default = generateNode

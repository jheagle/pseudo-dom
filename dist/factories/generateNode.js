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
 * A node which is stored in a TreeLinker (for example by a list built from an array of values). It finds its siblings
 * from that linker, and its parent from the linker's parent when it has not been given one by appendChild.
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
    this.listLinker = linker
    this.nodeValue = value
  }

  get isConnected () {
    return !!this.parentNode
  }

  get parentNode () {
    if (this.parent) {
      return this.parent
    }
    const parentLinker = this.listLinker ? this.listLinker.parent : null
    return parentLinker ? parentLinker.data : null
  }

  get parentElement () {
    const parent = this.parentNode
    return parent && parent.nodeType === NodeService_1.NodeService.ELEMENT_NODE ? parent : null
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

'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.DocumentService = void 0
const NodeService_1 = require('./NodeService')
/**
 * Simulate the behaviour of the Document Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
class DocumentService extends NodeService_1.NodeService {
  get nodeName () {
    return '#document'
  }

  get nodeType () {
    return NodeService_1.NodeService.DOCUMENT_NODE
  }

  /**
   * The first element, in tree order, whose id matches the given value, or null when there is none.
   * @param {string} id
   * @returns {PseudoElement|null}
   */
  getElementById (id) {
    const search = node => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === NodeService_1.NodeService.ELEMENT_NODE) {
          if (child.id === id) {
            return child
          }
          const found = search(child)
          if (found) {
            return found
          }
        }
      }
      return null
    }
    return search(this)
  }
}
exports.DocumentService = DocumentService

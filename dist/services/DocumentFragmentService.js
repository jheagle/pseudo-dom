'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.DocumentFragmentService = void 0
const NodeService_1 = require('./NodeService')
/**
 * Simulate the behaviour of the DocumentFragment Class when there is no DOM available: a container for nodes which is
 * not part of a tree, when it is inserted its children are moved into the tree instead.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
class DocumentFragmentService extends NodeService_1.NodeService {
  get nodeName () {
    return '#document-fragment'
  }

  get nodeType () {
    return NodeService_1.NodeService.DOCUMENT_FRAGMENT_NODE
  }
}
exports.DocumentFragmentService = DocumentFragmentService

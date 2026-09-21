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
}
exports.DocumentService = DocumentService

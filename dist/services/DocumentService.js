'use strict'

const __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule
    ? mod
    : {
        default: mod
      }
}
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.DocumentService = void 0
const NodeService_1 = require('./NodeService')
const HTMLElementService_1 = require('./HTMLElementService')
const DocumentFragmentService_1 = require('./DocumentFragmentService')
const getElementById_1 = __importDefault(require('../functions/getElementById'))
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

  // A document has no text of its own, and setting it does nothing
  get textContent () {
    return null
  }

  set textContent (text) {}
  /**
   * The first element, in tree order, whose id matches the given value, or null when there is none.
   * @param {string} id
   * @returns {PseudoElement|null}
   */
  getElementById (id) {
    return (0, getElementById_1.default)(this, id)
  }

  /**
   * Make an element of the given type which belongs to this document but is not added anywhere until it is appended.
   * @param {string} [tagName='div'] The type of element to create
   * @returns {PseudoElement}
   */
  createElement (tagName = 'div') {
    // Like the DOM, the new element is not added anywhere: it has no parent until it is appended
    const element = new HTMLElementService_1.HTMLElementService({
      tagName
    })
    element.ownerDocumentStore = this
    return element
  }

  /**
   * Make a text node which belongs to this document.
   * @param {string} [data=''] The text
   * @returns {TextService}
   */
  createTextNode (data = '') {
    const text = new NodeService_1.TextService(data)
    text.ownerDocumentStore = this
    return text
  }

  /**
   * Make a comment which belongs to this document.
   * @param {string} [data=''] The comment
   * @returns {CommentService}
   */
  createComment (data = '') {
    const comment = new NodeService_1.CommentService(data)
    comment.ownerDocumentStore = this
    return comment
  }

  /**
   * Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
   * then inserted in one go.
   * @returns {DocumentFragmentService}
   */
  createDocumentFragment () {
    const fragment = new DocumentFragmentService_1.DocumentFragmentService()
    fragment.ownerDocumentStore = this
    return fragment
  }
}
exports.DocumentService = DocumentService

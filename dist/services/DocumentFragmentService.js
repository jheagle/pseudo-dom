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
exports.DocumentFragmentService = void 0
const NodeService_1 = require('./NodeService')
const getElementById_1 = __importDefault(require('../functions/getElementById'))
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

  /**
   * The first element, in tree order, whose id matches the given value, or null when there is none (the DOM's
   * NonElementParentNode mixin, which Document and DocumentFragment both implement).
   * @param {string} id
   * @returns {PseudoElement|null}
   */
  getElementById (id) {
    return (0, getElementById_1.default)(this, id)
  }
}
exports.DocumentFragmentService = DocumentFragmentService

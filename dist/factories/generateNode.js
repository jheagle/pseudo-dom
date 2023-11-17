'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = exports.NodeFactory = void 0
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
var _TreeLinker = _interopRequireDefault(require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'))
var _PseudoNode = _interopRequireDefault(require('../classes/PseudoNode'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
class NodeFactory extends _TreeLinker.default {}
exports.NodeFactory = NodeFactory
const generateNode = () => {
  NodeFactory.fromArray = function () {
    const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
    const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NodeFactory
    return values.reduce((list, element) => {
      if (typeof element !== 'object') {
        element = {
          data: element
        }
      }
      const newElement = new LinkerClass(Object.assign({}, element, {
        prev: list.tail
      }))

      /**
       * Simulate the behaviour of the Node Class when there is no DOM available.
       * @author Joshua Heagle <joshuaheagle@gmail.com>
       * @class
       * @augments PseudoEventTarget
       * @property {string} name
       * @property {function} appendChild
       * @property {function} removeChild
       */
      class PseudoNodeAttached extends _PseudoNode.default {
        /**
         *
         * @constructor
         */
        constructor () {
          super()
          this.nodeValue = element.data
          this.textContext = ''
        }

        get baseURI () {
          return window.location || '/'
        }

        get childNodes () {
          return newElement.children
        }

        get firstChild () {
          return newElement.children.first.data
        }

        get isConnected () {
          return newElement.parent !== null
        }

        get lastChild () {
          return newElement.children.last.data
        }

        get nextSibling () {
          return newElement.next.data
        }

        get nodeName () {
          return this.name || ''
        }

        get nodeType () {
          const typeName = 'DEFAULT_NODE'
          const nodeTypes = ['DEFAULT_NODE', 'ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE', 'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE', 'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE', 'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE']
          return nodeTypes.indexOf(typeName)
        }

        get ownerDocument () {
          return newElement.rootParent
        }

        get parentNode () {
          return newElement.parent
        }

        get parentElement () {
          return newElement.parent.nodeType === 1 ? newElement.parent : null
        }

        get previousSibling () {
          return newElement.prev
        }

        /**
         *
         * @param {PseudoNode} childNode
         * @returns {PseudoNode}
         */
        appendChild (childNode) {
          newElement.next = childNode
          childNode.prev = newElement
          return childNode
        }

        cloneNode () {}
        compareDocumentPosition () {}
        contains () {}
        getRootNode () {
          return newElement.rootParent
        }

        hasChildNodes () {}
        insertBefore () {}
        isDefaultNamespace () {}
        isEqualNode () {}
        isSameNode () {}
        lookupPrefix () {}
        lookupNamespaceURI () {}
        normalize () {}

        /**
         *
         * @param {PseudoNode} childElement
         * @returns {PseudoNode}
         */
        removeChild (childElement) {
          return this.children.splice(this.children.indexOf(childElement), 1)[0]
        }

        replaceChild () {}
      }
      newElement.data = new PseudoNodeAttached()
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
  }
  return NodeFactory
}
var _default = exports.default = generateNode

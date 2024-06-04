import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'
import PseudoNode from '../interfaces/PseudoNode'

export class NodeFactory extends TreeLinker {}

const generateNode = () => {
  NodeFactory.fromArray = (values = [], LinkerClass = NodeFactory) => values.reduce(
    (list, element) => {
      if (typeof element !== 'object') {
        element = { data: element }
      }
      const newElement = new LinkerClass(Object.assign({}, element, { prev: list.tail }))

      /**
       * Simulate the behaviour of the Node Class when there is no DOM available.
       * @author Joshua Heagle <joshuaheagle@gmail.com>
       * @class
       * @augments PseudoEventTarget
       * @property {string} name
       * @property {function} appendChild
       * @property {function} removeChild
       */
      class PseudoNodeAttached extends PseudoNode {
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
          const nodeTypes = [
            'DEFAULT_NODE',
            'ELEMENT_NODE',
            'ATTRIBUTE_NODE',
            'TEXT_NODE',
            'CDATA_SECTION_NODE',
            'ENTITY_REFERENCE_NODE',
            'ENTITY_NODE',
            'PROCESSING_INSTRUCTION_NODE',
            'COMMENT_NODE',
            'DOCUMENT_NODE',
            'DOCUMENT_TYPE_NODE',
            'DOCUMENT_FRAGMENT_NODE',
            'NOTATION_NODE'
          ]
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
        appendChild (childNode: PseudoNode ): PseudoNode {
          newElement.next = childNode
          // @ts-ignore
          childNode.prev = newElement
          return childNode
        }

        cloneNode () {}

        compareDocumentPosition () {}

        contains () {}

        getRootNode () {
          return newElement.rootParent
        }

        hasChildNodes (): boolean { return false }

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
        removeChild (childElement: TreeLinker): TreeLinker {
          // @ts-ignore
          return this.children.remove(childElement)
        }

        replaceChild () {}
      }

      newElement.data = new PseudoNodeAttached()
      if (list.head === null) {
        return { head: newElement, tail: newElement }
      }
      list.tail.next = newElement
      newElement.prev = list.tail
      return { head: list.head, tail: newElement }
    },
    { head: null, tail: null }
  )
  return NodeFactory
}

export default generateNode

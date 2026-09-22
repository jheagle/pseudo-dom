'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.every.js')
require('core-js/modules/esnext.iterator.for-each.js')
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
exports.CommentService = exports.TextService = exports.NodeService = void 0
/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const generateNodeList_1 = __importDefault(require('../factories/generateNodeList'))
const TreeLinker_1 = require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker')
const EventTargetService_1 = __importDefault(require('./EventTargetService'))
/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
class NodeService extends EventTargetService_1.default {
  /**
   *
   * @constructor
   */
  constructor () {
    super()
    this.nodeValueStore = null
    this.ownerDocumentStore = null
    this.nodeId = NodeService.nextNodeId++
    this.nodeNameValue = ''
    this.children = (0, generateNodeList_1.default)()
    this.parent = null
    this.listLinker = null
  }

  get baseURI () {
    return window.location || '/'
  }

  get childNodes () {
    return this.children
  }

  get firstChild () {
    return this.children.first ? this.children.first.data : null
  }

  get isConnected () {
    // Connected means the tree the node is in has a document at the top
    return this.getRootNode().nodeType === NodeService.DOCUMENT_NODE
  }

  get lastChild () {
    return this.children.last ? this.children.last.data : null
  }

  get nextSibling () {
    return this.listLinker && this.listLinker.next ? this.listLinker.next.data : null
  }

  get nodeName () {
    return this.nodeNameValue || ''
  }

  get nodeType () {
    return NodeService.DEFAULT_NODE
  }

  get nodeValue () {
    return this.nodeValueStore
  }

  set nodeValue (value) {
    this.nodeValueStore = value
  }

  get ownerDocument () {
    if (this.nodeType === NodeService.DOCUMENT_NODE) {
      return null
    }
    const root = this.getRootNode()
    return root.nodeType === NodeService.DOCUMENT_NODE ? root : this.ownerDocumentStore
  }

  get parentNode () {
    return this.parent
  }

  get parentElement () {
    return this.parent && this.parent.nodeType === NodeService.ELEMENT_NODE ? this.parent : null
  }

  get previousSibling () {
    return this.listLinker && this.listLinker.prev ? this.listLinker.prev.data : null
  }

  get textContent () {
    if (this.nodeType === NodeService.DOCUMENT_NODE || this.nodeType === NodeService.DOCUMENT_TYPE_NODE) {
      return null
    }
    // The text of everything below, in order (comments and the like do not count)
    let text = ''
    Array.from(this.childNodes).forEach(child => {
      if (child.nodeType === NodeService.TEXT_NODE) {
        text += child.nodeValue
      } else if (child.nodeType !== NodeService.COMMENT_NODE) {
        text += child.textContent
      }
    })
    return text
  }

  set textContent (text) {
    if (this.nodeType === NodeService.DOCUMENT_NODE || this.nodeType === NodeService.DOCUMENT_TYPE_NODE) {
      return
    }
    // All the children are replaced by a single text node (or none for an empty text)
    while (this.firstChild) {
      this.removeChild(this.firstChild)
    }
    if (text !== null && typeof text !== 'undefined' && String(text) !== '') {
      const textNode = new TextService(String(text))
      textNode.ownerDocumentStore = this.ownerDocument
      this.appendChild(textNode)
    }
  }

  /**
   * Add a node as the last child of this node (a node which is already in a tree is moved).
   * @param {PseudoNode} childNode The node to add
   * @returns {PseudoNode} The added node
   */
  appendChild (childNode) {
    return this.insertBefore(childNode, null)
  }

  /**
   * Whether this kind of node can have children (text, comments and attributes cannot).
   * @returns {boolean}
   */
  get acceptsChildren () {
    return true
  }

  /**
   * Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
   * Kinds of node which are made with arguments override this to give them.
   * @returns {NodeService}
   */
  cloneShallow () {
    const copy = new this.constructor()
    copy.nodeValue = this.nodeValue
    copy.ownerDocumentStore = this.ownerDocumentStore
    return copy
  }

  /**
   * Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
   * afterwards. Kinds of node with more to compare (an element has attributes) override this.
   * @param {NodeService} other The node to compare with
   * @returns {boolean}
   */
  equalsShallow (other) {
    return this.nodeName === other.nodeName && this.nodeValue === other.nodeValue
  }

  /**
   * Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
   * (for example elements applying default events) can do so.
   * @param {NodeService} child The node which was inserted
   */
  childInserted (child) {}
  /**
   * Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
   * too, all the way down.
   * @param {boolean} [deep=false] Copy the children as well
   * @returns {PseudoNode}
   */
  cloneNode (deep = false) {
    const copy = this.cloneShallow()
    if (deep) {
      Array.from(this.childNodes).forEach(child => copy.appendChild(child.cloneNode(true)))
    }
    return copy
  }

  /**
   * Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
   * itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
   * CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
   * otherwise PRECEDING or FOLLOWING by their order in the tree.
   * @param {PseudoNode} otherNode The node to locate
   * @returns {number}
   */
  compareDocumentPosition (otherNode) {
    if (otherNode === this) {
      return 0
    }
    const pathFromRoot = node => {
      const path = []
      for (let current = node; current; current = current.parentNode) {
        path.unshift(current)
      }
      return path
    }
    const mine = pathFromRoot(this)
    const theirs = pathFromRoot(otherNode)
    if (mine[0] !== theirs[0]) {
      // Not in the same tree, so there is no real order: use a consistent one (the order the nodes were made in)
      const before = otherNode.nodeId < this.nodeId ? NodeService.DOCUMENT_POSITION_PRECEDING : NodeService.DOCUMENT_POSITION_FOLLOWING
      return NodeService.DOCUMENT_POSITION_DISCONNECTED | NodeService.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC | before
    }
    if (theirs.length < mine.length && theirs.every((node, index) => mine[index] === node)) {
      return NodeService.DOCUMENT_POSITION_CONTAINS | NodeService.DOCUMENT_POSITION_PRECEDING
    }
    if (mine.length < theirs.length && mine.every((node, index) => theirs[index] === node)) {
      return NodeService.DOCUMENT_POSITION_CONTAINED_BY | NodeService.DOCUMENT_POSITION_FOLLOWING
    }
    // The paths part ways at siblings: whichever comes first among them is first in the tree
    let depth = 0
    while (mine[depth] === theirs[depth]) {
      ++depth
    }
    for (let sibling = mine[depth].nextSibling; sibling; sibling = sibling.nextSibling) {
      if (sibling === theirs[depth]) {
        return NodeService.DOCUMENT_POSITION_FOLLOWING
      }
    }
    return NodeService.DOCUMENT_POSITION_PRECEDING
  }

  /**
   * Check whether a node is this node or one of its descendants.
   * @param {PseudoNode|null} otherNode The node to look for
   * @returns {boolean}
   */
  contains (otherNode) {
    let current = otherNode
    while (current) {
      if (current === this) {
        return true
      }
      current = current.parentNode
    }
    return false
  }

  getRootNode (options = {
    composed: false
  }) {
    return this.parent ? this.parent.getRootNode(options) : this
  }

  hasChildNodes () {
    return this.children.length > 0
  }

  /**
   * Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
   * already in a tree is moved, and the children of a document fragment are moved in order.
   * @param {PseudoNode} newNode The node to insert
   * @param {PseudoNode|null} [referenceNode=null] The child of this node to insert before, or null to insert at the end
   * @returns {PseudoNode} The inserted node
   * @throws {Error} When the reference node is not a child of this node, or the new node is this node or contains it
   */
  insertBefore (newNode, referenceNode = null) {
    if (!this.acceptsChildren) {
      throw new Error('This kind of node cannot have children.')
    }
    if (referenceNode !== null && referenceNode.parentNode !== this) {
      throw new Error('The node before which the new node is to be inserted is not a child of this node.')
    }
    if (newNode === referenceNode) {
      // Inserting a node before itself leaves it where it is
      return newNode
    }
    if (typeof newNode.contains === 'function' && newNode.contains(this)) {
      throw new Error('The new node cannot be inserted into itself or one of its own descendants.')
    }
    if (newNode.nodeType === NodeService.DOCUMENT_FRAGMENT_NODE) {
      // The children of a fragment are inserted (moved) in order, and the fragment is left empty
      while (newNode.firstChild) {
        this.insertBefore(newNode.firstChild, referenceNode)
      }
      return newNode
    }
    if (newNode.parentNode) {
      // A node can only be in one place, so it is moved from where it was
      newNode.parentNode.removeChild(newNode)
    }
    const linker = new TreeLinker_1.TreeLinker({
      data: newNode
    })
    this.children.insertBefore(referenceNode ? referenceNode.listLinker : null, linker)
    const inserted = newNode
    inserted.parent = this
    inserted.listLinker = linker
    this.childInserted(inserted)
    return newNode
  }

  isDefaultNamespace (namespaceURI) {
    return namespaceURI === null
  }

  /**
   * Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
   * needs the same attributes), and children which are equal in the same order.
   * @param {PseudoNode|null} otherNode The node to compare with
   * @returns {boolean}
   */
  isEqualNode (otherNode) {
    if (!otherNode || otherNode.nodeType !== this.nodeType || !this.equalsShallow(otherNode)) {
      return false
    }
    const mine = Array.from(this.childNodes)
    const theirs = Array.from(otherNode.childNodes)
    return mine.length === theirs.length && mine.every((child, index) => child.isEqualNode(theirs[index]))
  }

  isSameNode (otherNode) {
    return this === otherNode
  }

  lookupPrefix (namespace) {
    return null
  }

  lookupNamespaceURI (prefix) {
    return null
  }

  /**
   * Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.
   */
  normalize () {
    let child = this.firstChild
    while (child) {
      if (child.nodeType === NodeService.TEXT_NODE) {
        // Join the text nodes which follow into this one, and drop it when it is empty
        let text = child.nodeValue
        let following = child.nextSibling
        while (following && following.nodeType === NodeService.TEXT_NODE) {
          text += following.nodeValue
          const after = following.nextSibling
          this.removeChild(following)
          following = after
        }
        child.nodeValue = text
        if (text === '') {
          this.removeChild(child)
        }
        child = following
      } else {
        child.normalize()
        child = child.nextSibling
      }
    }
  }

  /**
   * Remove a child from this node, it no longer has a parent or siblings afterwards.
   * @param {PseudoNode} childElement The child node to remove
   * @returns {PseudoNode} The removed node
   * @throws {Error} When the node is not a child of this node
   */
  removeChild (childElement) {
    if (!childElement || childElement.parentNode !== this) {
      throw new Error('The node to be removed is not a child of this node.')
    }
    const removed = childElement
    this.children.remove(removed.listLinker)
    removed.parent = null
    removed.listLinker = null
    return childElement
  }

  /**
   * Replace a child of this node with another node (which is moved if it is already in a tree).
   * @param {PseudoNode} newChild The node which takes the place
   * @param {PseudoNode} oldChild The child of this node to replace
   * @returns {PseudoNode} The replaced node
   * @throws {Error} When the old node is not a child of this node
   */
  replaceChild (newChild, oldChild) {
    if (!oldChild || oldChild.parentNode !== this) {
      throw new Error('The node to be replaced is not a child of this node.')
    }
    if (newChild === oldChild) {
      return oldChild
    }
    // The new node goes where the old one was, which is before the old node's next sibling (unless that is the new node)
    let reference = oldChild.nextSibling
    if (reference === newChild) {
      reference = newChild.nextSibling
    }
    this.removeChild(oldChild)
    this.insertBefore(newChild, reference)
    return oldChild
  }
}
exports.NodeService = NodeService
NodeService.DEFAULT_NODE = 0
NodeService.ELEMENT_NODE = 1
NodeService.ATTRIBUTE_NODE = 2
NodeService.TEXT_NODE = 3
NodeService.CDATA_SECTION_NODE = 4
NodeService.ENTITY_REFERENCE_NODE = 5
NodeService.ENTITY_NODE = 6
NodeService.PROCESSING_INSTRUCTION_NODE = 7
NodeService.COMMENT_NODE = 8
NodeService.DOCUMENT_NODE = 9
NodeService.DOCUMENT_TYPE_NODE = 10
NodeService.DOCUMENT_FRAGMENT_NODE = 11
NodeService.NOTATION_NODE = 12
NodeService.DOCUMENT_POSITION_DISCONNECTED = 1
NodeService.DOCUMENT_POSITION_PRECEDING = 2
NodeService.DOCUMENT_POSITION_FOLLOWING = 4
NodeService.DOCUMENT_POSITION_CONTAINS = 8
NodeService.DOCUMENT_POSITION_CONTAINED_BY = 16
NodeService.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32
NodeService.nextNodeId = 1
/**
 * Simulate the behaviour of the Text Class when there is no DOM available: the text in an element.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 * @property {string} data - The text
 * @property {number} length - How many characters there are
 * @property {string} wholeText - The text of this node and of the text nodes next to it
 */
class TextService extends NodeService {
  /**
   * @param {string} [data=''] The text
   * @constructor
   */
  constructor (data = '') {
    super()
    this.nodeValue = String(data)
  }

  get acceptsChildren () {
    return false
  }

  get nodeName () {
    return '#text'
  }

  get nodeType () {
    return NodeService.TEXT_NODE
  }

  get data () {
    return this.nodeValue
  }

  set data (data) {
    this.nodeValue = String(data)
  }

  get length () {
    return this.data.length
  }

  get textContent () {
    return this.data
  }

  set textContent (text) {
    this.data = text === null ? '' : String(text)
  }

  get wholeText () {
    let first = this
    while (first.previousSibling && first.previousSibling.nodeType === NodeService.TEXT_NODE) {
      first = first.previousSibling
    }
    let text = ''
    for (let current = first; current && current.nodeType === NodeService.TEXT_NODE; current = current.nextSibling) {
      text += current.nodeValue
    }
    return text
  }

  /**
   * Break this text node in two at a position: this node keeps the text before it and a new node with the rest is put
   * after this one.
   * @param {number} offset How many characters stay in this node
   * @returns {TextService} The new node
   * @throws {Error} When the offset is beyond the end of the text
   */
  splitText (offset) {
    if (offset < 0 || offset > this.length) {
      throw new Error('The offset is beyond the end of the text.')
    }
    const rest = new TextService(this.data.slice(offset))
    rest.ownerDocumentStore = this.ownerDocumentStore
    this.data = this.data.slice(0, offset)
    if (this.parentNode) {
      this.parentNode.insertBefore(rest, this.nextSibling)
    }
    return rest
  }

  cloneShallow () {
    const copy = new TextService(this.data)
    copy.ownerDocumentStore = this.ownerDocumentStore
    return copy
  }
}
exports.TextService = TextService
/**
 * Simulate the behaviour of the Comment Class when there is no DOM available: a note in the markup which is not shown.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 * @property {string} data - The comment
 * @property {number} length - How many characters there are
 */
class CommentService extends NodeService {
  /**
   * @param {string} [data=''] The comment
   * @constructor
   */
  constructor (data = '') {
    super()
    this.nodeValue = String(data)
  }

  get acceptsChildren () {
    return false
  }

  get nodeName () {
    return '#comment'
  }

  get nodeType () {
    return NodeService.COMMENT_NODE
  }

  get data () {
    return this.nodeValue
  }

  set data (data) {
    this.nodeValue = String(data)
  }

  get length () {
    return this.data.length
  }

  get textContent () {
    return this.data
  }

  set textContent (text) {
    this.data = text === null ? '' : String(text)
  }

  cloneShallow () {
    const copy = new CommentService(this.data)
    copy.ownerDocumentStore = this.ownerDocumentStore
    return copy
  }
}
exports.CommentService = CommentService

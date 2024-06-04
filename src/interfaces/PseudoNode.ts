/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoEventTarget } from './PseudoEventTarget'
import { PseudoNodeList } from '../classes/PseudoNodeList'
import { LinkedTreeList } from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'
import { PseudoDocument } from './PseudoDocument'
import { PseudoElement } from './PseudoElement'
import { PseudoDocumentFragment } from './PseudoDocumentFragment'

/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
export interface PseudoNode extends PseudoEventTarget {
  /**
   * Returns a string representing the base URL of the document containing the Node.
   */
  get baseURI (): Location | string

  /**
   * Returns a live NodeList containing all the children of this node (including elements, text and comments). NodeList being live means that if the children of the Node change, the NodeList object is automatically updated.
   */
  get childNodes (): PseudoNodeList | LinkedTreeList

  /**
   * Returns a Node representing the first direct child node of the node, or null if the node has no child.
   */
  get firstChild (): PseudoNode | null

  /**
   * A boolean indicating whether or not the Node is connected (directly or indirectly) to the context object, e.g. the Document object in the case of the normal DOM, or the ShadowRoot in the case of a shadow DOM.
   */
  get isConnected (): boolean

  /**
   * Returns a Node representing the last direct child node of the node, or null if the node has no child.
   */
  get lastChild (): PseudoNode | null

  /**
   * Returns a Node representing the next node in the tree, or null if there isn't such node.
   */
  get nextSibling (): PseudoNode | null

  /**
   * Returns a string containing the name of the Node. The structure of the name will differ with the node type. E.g. An HTMLElement will contain the name of the corresponding tag, like 'audio' for an HTMLAudioElement, a Text node will have the '#text' string, or a Document node will have the '#document' string.
   */
  get nodeName (): string

  /**
   *  Returns an unsigned short representing the type of the node. Possible values are:
   *  ________________________________________
   * |  Name                         | Value |
   * |----------------------------------------
   * |  ELEMENT_NODE                 |   1   |
   * |  ATTRIBUTE_NODE               |   2   |
   * |  TEXT_NODE                    |   3   |
   * |  CDATA_SECTION_NODE           |   4   |
   * |  PROCESSING_INSTRUCTION_NODE  |   7   |
   * |  COMMENT_NODE                 |   8   |
   * |  DOCUMENT_NODE                |   9   |
   * |  DOCUMENT_TYPE_NODE           |  10   |
   * |  DOCUMENT_FRAGMENT_NODE       |  11   |
   */
  get nodeType (): number

  /**
   * Returns the value of the current node.
   */
  get nodeValue (): string | null

  /**
   * Sets the value of the current node.
   * @param value
   */
  set nodeValue (value: string | null)

  /**
   * Returns the Document that this node belongs to. If the node is itself a document, returns null.
   */
  get ownerDocument (): PseudoDocument | null

  /**
   * Returns a Node that is the parent of this node. If there is no such node, like if this node is the top of the tree or if doesn't participate in a tree, this property returns null.
   */
  get parentNode (): PseudoNode | null

  /**
   * Returns an Element that is the parent of this node. If the node has no parent, or if that parent is not an Element, this property returns null.
   */
  get parentElement (): PseudoElement | null

  /**
   * Returns a Node representing the previous node in the tree, or null if there isn't such node.
   */
  get previousSibling (): PseudoNode | null

  /**
   * Returns the textual content of an element and all its descendants.
   */
  get textContent (): string | null

  /**
   * Sets the textual content of an element and all its descendants.
   * @param text
   */
  set textContent (text: string | null)

  /**
   * Adds the specified childNode argument as the last child to the current node. If the argument referenced an existing node on the DOM tree, the node will be detached from its current position and attached at the new position.
   * @param {PseudoNode} childNode
   * @returns {PseudoNode}
   */
  appendChild (childNode: PseudoNode): PseudoNode

  /**
   * Clone a Node, and optionally, all of its contents. By default, it clones the content of the node.
   * @param deep
   */
  cloneNode (deep: boolean): PseudoNode

  /**
   * Compares the position of the current node against another node in any other document.
   * @param otherNode
   */
  compareDocumentPosition (otherNode: PseudoNode): number

  /**
   * Returns true or false value indicating whether or not a node is a descendant of the calling node.
   * @param otherNode
   */
  contains (otherNode: PseudoNode): boolean

  /**
   * Returns the context object's root which optionally includes the shadow root if it is available.
   * @param options
   */
  getRootNode (options: { composed: boolean }): PseudoNode

  /**
   * Returns a boolean value indicating whether the element has any child nodes.
   */
  hasChildNodes (): boolean

  /**
   * Inserts a Node before the reference node as a child of a specified parent node.
   * @param newNode
   * @param referenceNode
   */
  insertBefore (newNode: PseudoNode, referenceNode: PseudoNode | null): PseudoNode | PseudoDocumentFragment

  /**
   * Accepts a namespace URI as an argument and returns a boolean value with a value of true if the namespace is the default namespace on the given node or false if not.
   * @param namespaceURI
   */
  isDefaultNamespace (namespaceURI): boolean

  /**
   * Returns a boolean value which indicates whether two nodes are of the same type and all their defining data points match.
   * @param otherNode
   */
  isEqualNode (otherNode: PseudoNode): boolean

  /**
   * Returns a boolean value indicating whether the two nodes are the same (that is, they reference the same object).
   * @param otherNode
   */
  isSameNode (otherNode: PseudoNode): boolean

  /**
   * Returns a string containing the prefix for a given namespace URI, if present, and null if not. When multiple prefixes are possible, the result is implementation-dependent.
   * @param namespace
   */
  lookupPrefix (namespace: string): string | null

  /**
   * Accepts a prefix and returns the namespace URI associated with it on the given node if found (and null if not). Supplying null for the prefix will return the default namespace.
   * @param prefix
   */
  lookupNamespaceURI (prefix: string): string | null

  /**
   * Clean up all the text nodes under this element (merge adjacent, remove empty).
   */
  normalize (): void

  /**
   * Removes a child node from the current element, which must be a child of the current node.
   * @param {PseudoNode} child
   * @returns {PseudoNode}
   */
  removeChild (child: PseudoNode): PseudoNode

  /**
   * Replaces one child Node of the current one with the second one given in parameter.
   * @param newChild
   * @param oldChild
   */
  replaceChild (newChild: PseudoNode, oldChild: PseudoNode): PseudoNode
}

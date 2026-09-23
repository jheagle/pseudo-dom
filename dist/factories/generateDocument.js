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
const EventTargetService_1 = __importDefault(require('../services/EventTargetService'))
const NodeService_1 = require('../services/NodeService')
const ElementService_1 = require('../services/ElementService')
const HTMLElementService_1 = require('../services/HTMLElementService')
const PseudoHTMLDocument_1 = __importDefault(require('../classes/PseudoHTMLDocument'))
/**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
 * context.
 * @function generateDocument
 * @param {Object} root
 * @param {Object} context
 * @returns {Window|PseudoEventTarget}
 */
const generateDocument = (root, context = {}) => {
  /**
   *
   * @type {Window|PseudoEventTarget}
   */
  const newWindow = typeof root.document === 'undefined' ? root : new EventTargetService_1.default()
  /**
   * @type {Node|PseudoNode}
   */
  const Node = root.Node || new NodeService_1.NodeService()
  if (typeof newWindow.Node === 'undefined') {
    newWindow.Node = Node
  }
  /**
   *
   * @type {Element|PseudoElement}
   */
  const Element = root.Element || new ElementService_1.ElementService()
  if (typeof newWindow.Element === 'undefined') {
    newWindow.Element = Element
  }
  /**
   * Create an instance of HTMLElement if not available
   * @type {HTMLElement|PseudoHTMLElement}
   */
  const HTMLElement = root.HTMLElement || new HTMLElementService_1.HTMLElementService()
  if (typeof newWindow.HTMLElement === 'undefined') {
    newWindow.HTMLElement = HTMLElement
  }
  /**
   * Define document when not available
   * @type {Document|PseudoHTMLDocument}
   */
  const document = root.document || new PseudoHTMLDocument_1.default()
  if (typeof newWindow.document === 'undefined') {
    newWindow.document = document
  }
  // When there was no real document, newWindow is root itself (see above), so every assignment above already
  // mutated it directly. If context is also that same object (root and context given as one and the same, as
  // installGlobal does) merging is already done - doing it again would be Object.assign(target, target), which
  // throws on any getter-only own property target already has (globalThis.crypto, in Node).
  const mergeInto = context || root
  return newWindow === mergeInto ? newWindow : Object.assign(mergeInto, newWindow)
}
exports.default = generateDocument

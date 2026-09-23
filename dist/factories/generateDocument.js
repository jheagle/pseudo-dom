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
   * The Node class itself (matching the DOM's window.Node), not an instance - the right-hand side of `instanceof`
   * must be a constructor, so `x instanceof Node` needs this, not `new PseudoNode()`.
   * @type {Function}
   */
  const Node = root.Node || NodeService_1.NodeService
  if (typeof newWindow.Node === 'undefined') {
    newWindow.Node = Node
  }
  /**
   * The Element class itself, for the same reason as Node.
   * @type {Function}
   */
  const Element = root.Element || ElementService_1.ElementService
  if (typeof newWindow.Element === 'undefined') {
    newWindow.Element = Element
  }
  /**
   * The HTMLElement class itself, for the same reason as Node.
   * @type {Function}
   */
  const HTMLElement = root.HTMLElement || HTMLElementService_1.HTMLElementService
  if (typeof newWindow.HTMLElement === 'undefined') {
    newWindow.HTMLElement = HTMLElement
  }
  /**
   * The HTMLDocument class itself, for the same reason as Node (so `document instanceof HTMLDocument`, a common
   * real-DOM-detection check, works).
   * @type {Function}
   */
  const HTMLDocument = root.HTMLDocument || PseudoHTMLDocument_1.default
  if (typeof newWindow.HTMLDocument === 'undefined') {
    newWindow.HTMLDocument = HTMLDocument
  }
  /**
   * Define document when not available - a real instance, unlike the classes above (window.document IS an object,
   * not a constructor).
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

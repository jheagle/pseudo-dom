'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _PseudoEventTarget = _interopRequireDefault(require('../interfaces/PseudoEventTarget'))
var _PseudoNode = _interopRequireDefault(require('../interfaces/PseudoNode'))
var _PseudoElement = _interopRequireDefault(require('../interfaces/PseudoElement'))
var _PseudoHTMLElement = _interopRequireDefault(require('../interfaces/PseudoHTMLElement'))
var _PseudoHTMLDocument = _interopRequireDefault(require('../classes/PseudoHTMLDocument'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
 * context.
 * @function generateDocument
 * @param {Object} root
 * @param {Object} context
 * @returns {Window|PseudoEventTarget}
 */
const generateDocument = function (root) {
  const context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  /**
   *
   * @type {Window|PseudoEventTarget}
   */
  const newWindow = typeof root.document === 'undefined' ? root : new _PseudoEventTarget.default()
  /**
   * @type {Node|PseudoNode}
   */
  const Node = root.Node || new _PseudoNode.default()
  if (typeof newWindow.Node === 'undefined') {
    newWindow.Node = Node
  }
  /**
   *
   * @type {Element|PseudoElement}
   */
  const Element = root.Element || new _PseudoElement.default()
  if (typeof newWindow.Element === 'undefined') {
    newWindow.Element = Element
  }
  /**
   * Create an instance of HTMLElement if not available
   * @type {HTMLElement|PseudoHTMLElement}
   */
  const HTMLElement = root.HTMLElement || new _PseudoHTMLElement.default()
  if (typeof newWindow.HTMLElement === 'undefined') {
    newWindow.HTMLElement = HTMLElement
  }
  /**
   * Define document when not available
   * @type {Document|PseudoHTMLDocument}
   */
  const document = root.document || new _PseudoHTMLDocument.default()
  if (typeof newWindow.document === 'undefined') {
    newWindow.document = document
  }
  return context ? Object.assign(context, newWindow) : Object.assign(root, newWindow)
}
var _default = exports.default = generateDocument

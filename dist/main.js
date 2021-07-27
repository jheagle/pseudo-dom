'use strict'

function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

require('core-js/modules/es.array.iterator.js')

require('core-js/modules/es.object.to-string.js')

require('core-js/modules/es.string.iterator.js')

require('core-js/modules/es.weak-map.js')

require('core-js/modules/esnext.weak-map.delete-all.js')

require('core-js/modules/web.dom-collections.iterator.js')

require('core-js/modules/es.object.get-own-property-descriptor.js')

require('core-js/modules/es.symbol.js')

require('core-js/modules/es.symbol.description.js')

require('core-js/modules/es.symbol.iterator.js')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

require('core-js/modules/es.object.assign.js')

const PseudoEvent = _interopRequireWildcard(require('./class/PseudoEvent'))

const PseudoEventTarget = _interopRequireWildcard(require('./class/PseudoEventTarget'))

const PseudoNode = _interopRequireWildcard(require('./class/PseudoNode'))

const PseudoElement = _interopRequireWildcard(require('./class/PseudoElement'))

const PseudoHTMLElement = _interopRequireWildcard(require('./class/PseudoHTMLElement'))

const PseudoHTMLDocument = _interopRequireWildcard(require('./class/PseudoHTMLDocument'))

function _getRequireWildcardCache (nodeInterop) { if (typeof WeakMap !== 'function') return null; const cacheBabelInterop = new WeakMap(); const cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop })(nodeInterop) }

function _interopRequireWildcard (obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { default: obj } } const cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj) } const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) { if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) { const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj.default = obj; if (cache) { cache.set(obj, newObj) } return newObj }

/**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

/**
 * Store a reference to this scope which will be Window if rendered via browser
 */
const root = void 0 || window || global || {}
/**
 * Store reference to any pre-existing module of the same name
 * @type {module|*}
 */

const previousPseudoDom = root.pseudoDom || {}
/**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */

const pseudoDom = {}
root.pseudoDom = pseudoDom
/**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside of the browser
 * context.
 * @function generate
 * @param {Object} root
 * @param {Object} context
 * @returns {Window|PseudoEventTarget}
 */

pseudoDom.generate = function (root) {
  const context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

  /**
   *
   * @type {Window|PseudoEventTarget}
   */
  const newWindow = typeof root.document === 'undefined' ? root : new pseudoDom.PseudoEventTarget()
  /**
   * @type {Node|PseudoNode}
   */

  const Node = root.Node || new pseudoDom.PseudoNode()

  if (typeof newWindow.Node === 'undefined') {
    newWindow.Node = Node
  }
  /**
   *
   * @type {Element|PseudoElement}
   */

  const Element = root.Element || new pseudoDom.PseudoElement()

  if (typeof newWindow.Element === 'undefined') {
    newWindow.Element = Element
  }
  /**
   * Create an instance of HTMLElement if not available
   * @type {HTMLElement|PseudoHTMLElement}
   */

  const HTMLElement = root.HTMLElement || new pseudoDom.PseudoHTMLElement()

  if (typeof newWindow.HTMLElement === 'undefined') {
    newWindow.HTMLElement = HTMLElement
  }
  /**
   * Define document when not available
   * @type {Document|PseudoHTMLDocument}
   */

  const document = root.document || new pseudoDom.PseudoHTMLDocument()

  if (typeof newWindow.document === 'undefined') {
    newWindow.document = document
  }

  return context ? Object.assign(context, pseudoDom, newWindow) : Object.assign(root, newWindow)
}
/**
 * Return a reference to this library while preserving the original same-named library
 * @function noConflict
 * @returns {pseudoDom}
 */

pseudoDom.noConflict = function () {
  root.pseudoDom = previousPseudoDom
  return pseudoDom
}

const _default = Object.assign(pseudoDom, PseudoEvent, PseudoEventTarget, PseudoNode, PseudoElement, PseudoHTMLElement, PseudoHTMLDocument)

exports.default = _default

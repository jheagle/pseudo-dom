'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _PseudoEvent = _interopRequireDefault(require('./classes/PseudoEvent'))
var _PseudoEventTarget = _interopRequireDefault(require('./classes/PseudoEventTarget'))
var _PseudoNode = _interopRequireDefault(require('./classes/PseudoNode'))
var _PseudoElement = _interopRequireDefault(require('./classes/PseudoElement'))
var _PseudoHTMLElement = _interopRequireDefault(require('./classes/PseudoHTMLElement'))
var _PseudoHTMLDocument = _interopRequireDefault(require('./classes/PseudoHTMLDocument'))
var _generateDocument = _interopRequireDefault(require('./factories/generateDocument'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

/**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
const pseudoDom = Object.assign({
  generateDocument: _generateDocument.default
}, _PseudoEvent.default, _PseudoEventTarget.default, _PseudoNode.default, _PseudoElement.default, _PseudoHTMLElement.default, _PseudoHTMLDocument.default)
var _default = exports.default = pseudoDom
if (void 0) {
  // @ts-ignore
  (void 0).pseudoDom = pseudoDom
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.pseudoDom = pseudoDom
}

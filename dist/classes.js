'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _PseudoEvent = _interopRequireDefault(require('././classes/PseudoEvent'))
var _PseudoEventTarget = _interopRequireDefault(require('././classes/PseudoEventTarget'))
var _PseudoNode = _interopRequireDefault(require('././classes/PseudoNode'))
var _PseudoElement = _interopRequireDefault(require('././classes/PseudoElement'))
var _PseudoHTMLElement = _interopRequireDefault(require('././classes/PseudoHTMLElement'))
var _PseudoHTMLDocument = _interopRequireDefault(require('././classes/PseudoHTMLDocument'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * @file All of the Pseudo Dom classes for replicating DOM structure.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
var _default = exports.default = {
  PseudoEvent: _PseudoEvent.default,
  PseudoEventTarget: _PseudoEventTarget.default,
  PseudoNode: _PseudoNode.default,
  PseudoElement: _PseudoElement.default,
  PseudoHTMLElement: _PseudoHTMLElement.default,
  PseudoHTMLDocument: _PseudoHTMLDocument.default
}

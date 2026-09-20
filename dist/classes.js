'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
const _PseudoEvent = _interopRequireDefault(require('./interfaces/PseudoEvent'))
const _PseudoEventTarget = _interopRequireDefault(require('./interfaces/PseudoEventTarget'))
const _PseudoNode = _interopRequireDefault(require('./interfaces/PseudoNode'))
const _PseudoElement = _interopRequireDefault(require('./interfaces/PseudoElement'))
const _PseudoHTMLElement = _interopRequireDefault(require('./interfaces/PseudoHTMLElement'))
const _PseudoHTMLDocument = _interopRequireDefault(require('././classes/PseudoHTMLDocument'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * @file All of the Pseudo Dom classes for replicating DOM structure.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const _default = exports.default = {
  PseudoEvent: _PseudoEvent.default,
  PseudoEventTarget: _PseudoEventTarget.default,
  PseudoNode: _PseudoNode.default,
  PseudoElement: _PseudoElement.default,
  PseudoHTMLElement: _PseudoHTMLElement.default,
  PseudoHTMLDocument: _PseudoHTMLDocument.default
}

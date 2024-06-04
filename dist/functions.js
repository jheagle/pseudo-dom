'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _getParentNodes = _interopRequireDefault(require('./functions/getParentNodes'))
var _getParentNodesFromAttribute = _interopRequireDefault(require('./functions/getParentNodesFromAttribute'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * @file Helper functions for managing interactions with DOM classes
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
var _default = exports.default = {
  getParentNodes: _getParentNodes.default,
  getParentNodesFromAttribute: _getParentNodesFromAttribute.default
}

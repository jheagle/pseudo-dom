'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _generateNode = _interopRequireDefault(require('./factories/generateNode'))
var _generateNodeList = _interopRequireDefault(require('./factories/generateNodeList'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * @file All of the Pseudo Dom Helper functions for generating DOM objects.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
var _default = exports.default = {
  generateNode: _generateNode.default,
  nodeListFactory: _generateNodeList.default
}

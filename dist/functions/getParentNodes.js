'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _getParentNodesFromAttribute = _interopRequireDefault(require('./getParentNodesFromAttribute'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
const getParentNodes = node => (0, _getParentNodesFromAttribute.default)('', false, node)
var _default = exports.default = getParentNodes

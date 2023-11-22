'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _getParentNodesFromAttribute = _interopRequireDefault(require('./getParentNodesFromAttribute'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
const getParentNodes = node => (0, _getParentNodesFromAttribute.default)('', false, node)
var _default = exports.default = getParentNodes

'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
const _getParentNodesFromAttribute = _interopRequireDefault(require('./getParentNodesFromAttribute'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
const getParentNodes = node => (0, _getParentNodesFromAttribute.default)('', false, node)
const _default = exports.default = getParentNodes

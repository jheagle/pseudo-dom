'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
const _PseudoNodeList = _interopRequireDefault(require('../classes/PseudoNodeList'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
const generateNodeList = (innerList = null) => new _PseudoNodeList.default().initialize(innerList)
const _default = exports.default = generateNodeList

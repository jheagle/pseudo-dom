'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
var _PseudoNodeList = _interopRequireDefault(require('../classes/PseudoNodeList'))
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
const generateNodeList = function () {
  const innerList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
  return new _PseudoNodeList.default().initialize(innerList)
}
var _default = exports.default = generateNodeList

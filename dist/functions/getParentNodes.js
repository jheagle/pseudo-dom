'use strict'

const __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule
    ? mod
    : {
        default: mod
      }
}
Object.defineProperty(exports, '__esModule', {
  value: true
})
const getParentNodesFromAttribute_1 = __importDefault(require('./getParentNodesFromAttribute'))
const getParentNodes = node => (0, getParentNodesFromAttribute_1.default)('', false, node)
exports.default = getParentNodes

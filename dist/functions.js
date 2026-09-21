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
/**
 * @file Helper functions for managing interactions with DOM classes
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const getParentNodes_1 = __importDefault(require('./functions/getParentNodes'))
const getParentNodesFromAttribute_1 = __importDefault(require('./functions/getParentNodesFromAttribute'))
exports.default = {
  getParentNodes: getParentNodes_1.default,
  getParentNodesFromAttribute: getParentNodesFromAttribute_1.default
}

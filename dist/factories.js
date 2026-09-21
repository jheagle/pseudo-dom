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
 * @file All of the Pseudo Dom Helper functions for generating DOM objects.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const generateNode_1 = __importDefault(require('./factories/generateNode'))
const generateNodeList_1 = __importDefault(require('./factories/generateNodeList'))
const createEvent_1 = __importDefault(require('./factories/createEvent'))
const eventDefaults_1 = __importDefault(require('./factories/eventDefaults'))
exports.default = {
  generateNode: generateNode_1.default,
  nodeListFactory: generateNodeList_1.default,
  createEvent: createEvent_1.default,
  eventDefaults: eventDefaults_1.default
}

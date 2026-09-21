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
exports.AnimationService = void 0
const EventTargetService_1 = __importDefault(require('./EventTargetService'))
class AnimationService extends EventTargetService_1.default {}
exports.AnimationService = AnimationService

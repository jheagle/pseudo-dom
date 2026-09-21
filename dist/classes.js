'use strict'

/**
 * @file All of the Pseudo Dom classes for replicating DOM structure.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
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
const EventService_1 = require('./services/EventService')
const EventTargetService_1 = __importDefault(require('./services/EventTargetService'))
const NodeService_1 = require('./services/NodeService')
const ElementService_1 = require('./services/ElementService')
const HTMLElementService_1 = require('./services/HTMLElementService')
const PseudoHTMLDocument_1 = __importDefault(require('./classes/PseudoHTMLDocument'))
exports.default = {
  PseudoEvent: EventService_1.EventService,
  PseudoEventTarget: EventTargetService_1.default,
  PseudoNode: NodeService_1.NodeService,
  PseudoElement: ElementService_1.ElementService,
  PseudoHTMLElement: HTMLElementService_1.HTMLElementService,
  PseudoHTMLDocument: PseudoHTMLDocument_1.default
}

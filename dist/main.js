'use strict'

/**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
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
exports.PseudoHTMLDocument = exports.PseudoHTMLElement = exports.PseudoElement = exports.PseudoNode = exports.PseudoEventTarget = exports.PseudoEvent = exports.generateDocument = void 0
const EventService_1 = require('./services/EventService')
Object.defineProperty(exports, 'PseudoEvent', {
  enumerable: true,
  get: function () {
    return EventService_1.EventService
  }
})
const EventTargetService_1 = __importDefault(require('./services/EventTargetService'))
exports.PseudoEventTarget = EventTargetService_1.default
const NodeService_1 = require('./services/NodeService')
Object.defineProperty(exports, 'PseudoNode', {
  enumerable: true,
  get: function () {
    return NodeService_1.NodeService
  }
})
const ElementService_1 = require('./services/ElementService')
Object.defineProperty(exports, 'PseudoElement', {
  enumerable: true,
  get: function () {
    return ElementService_1.ElementService
  }
})
const HTMLElementService_1 = require('./services/HTMLElementService')
Object.defineProperty(exports, 'PseudoHTMLElement', {
  enumerable: true,
  get: function () {
    return HTMLElementService_1.HTMLElementService
  }
})
const PseudoHTMLDocument_1 = __importDefault(require('./classes/PseudoHTMLDocument'))
exports.PseudoHTMLDocument = PseudoHTMLDocument_1.default
const generateDocument_1 = __importDefault(require('./factories/generateDocument'))
exports.generateDocument = generateDocument_1.default
/**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
const pseudoDom = {
  generateDocument: generateDocument_1.default,
  PseudoEvent: EventService_1.EventService,
  PseudoEventTarget: EventTargetService_1.default,
  PseudoNode: NodeService_1.NodeService,
  PseudoElement: ElementService_1.ElementService,
  PseudoHTMLElement: HTMLElementService_1.HTMLElementService,
  PseudoHTMLDocument: PseudoHTMLDocument_1.default
}
exports.default = pseudoDom
if (void 0) {
  // @ts-ignore
  (void 0).pseudoDom = pseudoDom
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.pseudoDom = pseudoDom
}

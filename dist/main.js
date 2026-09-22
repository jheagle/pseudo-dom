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
exports.PseudoHTMLDocument = exports.PseudoHTMLElement = exports.PseudoElement = exports.PseudoComment = exports.PseudoText = exports.PseudoNode = exports.PseudoEventTarget = exports.PseudoCustomEvent = exports.PseudoInputEvent = exports.PseudoFocusEvent = exports.PseudoKeyboardEvent = exports.PseudoPointerEvent = exports.PseudoMouseEvent = exports.PseudoUIEvent = exports.PseudoEvent = exports.simulate = exports.eventDefaults = exports.createEvent = exports.generateDocument = void 0
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
const createEvent_1 = __importDefault(require('./factories/createEvent'))
exports.createEvent = createEvent_1.default
const eventDefaults_1 = __importDefault(require('./factories/eventDefaults'))
exports.eventDefaults = eventDefaults_1.default
const UIEventService_1 = require('./services/UIEventService')
Object.defineProperty(exports, 'PseudoUIEvent', {
  enumerable: true,
  get: function () {
    return UIEventService_1.UIEventService
  }
})
const MouseEventService_1 = require('./services/MouseEventService')
Object.defineProperty(exports, 'PseudoMouseEvent', {
  enumerable: true,
  get: function () {
    return MouseEventService_1.MouseEventService
  }
})
const PointerEventService_1 = require('./services/PointerEventService')
Object.defineProperty(exports, 'PseudoPointerEvent', {
  enumerable: true,
  get: function () {
    return PointerEventService_1.PointerEventService
  }
})
const KeyboardEventService_1 = require('./services/KeyboardEventService')
Object.defineProperty(exports, 'PseudoKeyboardEvent', {
  enumerable: true,
  get: function () {
    return KeyboardEventService_1.KeyboardEventService
  }
})
const FocusEventService_1 = require('./services/FocusEventService')
Object.defineProperty(exports, 'PseudoFocusEvent', {
  enumerable: true,
  get: function () {
    return FocusEventService_1.FocusEventService
  }
})
const InputEventService_1 = require('./services/InputEventService')
Object.defineProperty(exports, 'PseudoInputEvent', {
  enumerable: true,
  get: function () {
    return InputEventService_1.InputEventService
  }
})
const CustomEventService_1 = require('./services/CustomEventService')
Object.defineProperty(exports, 'PseudoCustomEvent', {
  enumerable: true,
  get: function () {
    return CustomEventService_1.CustomEventService
  }
})
const simulate_1 = __importDefault(require('./simulate'))
exports.simulate = simulate_1.default
const NodeService_2 = require('./services/NodeService')
Object.defineProperty(exports, 'PseudoText', {
  enumerable: true,
  get: function () {
    return NodeService_2.TextService
  }
})
Object.defineProperty(exports, 'PseudoComment', {
  enumerable: true,
  get: function () {
    return NodeService_2.CommentService
  }
})
/**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
const pseudoDom = {
  generateDocument: generateDocument_1.default,
  createEvent: createEvent_1.default,
  eventDefaults: eventDefaults_1.default,
  simulate: simulate_1.default,
  PseudoEvent: EventService_1.EventService,
  PseudoUIEvent: UIEventService_1.UIEventService,
  PseudoMouseEvent: MouseEventService_1.MouseEventService,
  PseudoPointerEvent: PointerEventService_1.PointerEventService,
  PseudoKeyboardEvent: KeyboardEventService_1.KeyboardEventService,
  PseudoFocusEvent: FocusEventService_1.FocusEventService,
  PseudoInputEvent: InputEventService_1.InputEventService,
  PseudoCustomEvent: CustomEventService_1.CustomEventService,
  PseudoEventTarget: EventTargetService_1.default,
  PseudoNode: NodeService_1.NodeService,
  PseudoText: NodeService_2.TextService,
  PseudoComment: NodeService_2.CommentService,
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

/**
 * All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 */

import { EventService as PseudoEvent } from './services/EventService'
import PseudoEventTarget from './services/EventTargetService'
import { NodeService as PseudoNode } from './services/NodeService'
import { ElementService as PseudoElement } from './services/ElementService'
import { HTMLElementService as PseudoHTMLElement } from './services/HTMLElementService'
import PseudoHTMLDocument from './classes/PseudoHTMLDocument'
import generateDocument from './factories/generateDocument'
import installGlobal from './factories/installGlobal'
import logElement from './factories/logElement'
import { prettyPrint } from './factories/serializeHTML'
import createEvent from './factories/createEvent'
import eventDefaults from './factories/eventDefaults'
import { UIEventService as PseudoUIEvent } from './services/UIEventService'
import { MouseEventService as PseudoMouseEvent } from './services/MouseEventService'
import { PointerEventService as PseudoPointerEvent } from './services/PointerEventService'
import { KeyboardEventService as PseudoKeyboardEvent } from './services/KeyboardEventService'
import { FocusEventService as PseudoFocusEvent } from './services/FocusEventService'
import { InputEventService as PseudoInputEvent } from './services/InputEventService'
import { CustomEventService as PseudoCustomEvent } from './services/CustomEventService'
import simulate from './simulate'
import { TextService as PseudoText, CommentService as PseudoComment } from './services/NodeService'

/**
 * All methods exported from this module are encapsulated within pseudoDom.
 */
const pseudoDom = {
  generateDocument,
  installGlobal,
  logElement,
  prettyPrint,
  createEvent,
  eventDefaults,
  simulate,
  PseudoEvent,
  PseudoUIEvent,
  PseudoMouseEvent,
  PseudoPointerEvent,
  PseudoKeyboardEvent,
  PseudoFocusEvent,
  PseudoInputEvent,
  PseudoCustomEvent,
  PseudoEventTarget,
  PseudoNode,
  PseudoText,
  PseudoComment,
  PseudoElement,
  PseudoHTMLElement,
  PseudoHTMLDocument
}

export {
  generateDocument,
  installGlobal,
  logElement,
  prettyPrint,
  createEvent,
  eventDefaults,
  simulate,
  PseudoEvent,
  PseudoUIEvent,
  PseudoMouseEvent,
  PseudoPointerEvent,
  PseudoKeyboardEvent,
  PseudoFocusEvent,
  PseudoInputEvent,
  PseudoCustomEvent,
  PseudoEventTarget,
  PseudoNode,
  PseudoText,
  PseudoComment,
  PseudoElement,
  PseudoHTMLElement,
  PseudoHTMLDocument
}

export default pseudoDom

if (this) {
  // @ts-ignore
  this.pseudoDom = pseudoDom
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.pseudoDom = pseudoDom
}

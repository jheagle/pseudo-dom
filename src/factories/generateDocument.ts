import PseudoEventTarget from '../services/EventTargetService'
import { NodeService as PseudoNode } from '../services/NodeService'
import { ElementService as PseudoElement } from '../services/ElementService'
import { HTMLElementService as PseudoHTMLElement } from '../services/HTMLElementService'
import { EventService as PseudoEvent } from '../services/EventService'
import PseudoHTMLDocument from '../classes/PseudoHTMLDocument'

/**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
 * context.
 * @param root
 * @param context
 */
const generateDocument = (root: Window | any, context: object = {}): Window | PseudoEventTarget => {
  const newWindow: Window | PseudoEventTarget | any = typeof root.document === 'undefined' ? root : new PseudoEventTarget()

  /**
   * The Node class itself (matching the DOM's window.Node), not an instance - the right-hand side of `instanceof`
   * must be a constructor, so `x instanceof Node` needs this, not `new PseudoNode()`.
   */
  const Node = root.Node || PseudoNode
  if (typeof newWindow.Node === 'undefined') {
    newWindow.Node = Node
  }

  /**
   * The Element class itself, for the same reason as Node.
   */
  const Element = root.Element || PseudoElement
  if (typeof newWindow.Element === 'undefined') {
    newWindow.Element = Element
  }

  /**
   * The HTMLElement class itself, for the same reason as Node.
   */
  const HTMLElement = root.HTMLElement || PseudoHTMLElement
  if (typeof newWindow.HTMLElement === 'undefined') {
    newWindow.HTMLElement = HTMLElement
  }

  /**
   * The HTMLDocument class itself, for the same reason as Node (so `document instanceof HTMLDocument`, a common
   * real-DOM-detection check, works).
   */
  const HTMLDocument = root.HTMLDocument || PseudoHTMLDocument
  if (typeof newWindow.HTMLDocument === 'undefined') {
    newWindow.HTMLDocument = HTMLDocument
  }

  /**
   * The Event class itself, so code which does `new Event(type)` then `target.dispatchEvent(...)` - the standard,
   * environment-agnostic way to synthesize and dispatch an event - works the same as it would against a real DOM.
   * Without this, a bare `new Event(...)` falls through to whatever Event the real JS engine provides (Node's own
   * built-in one, unrelated to this module), which EventTargetService's dispatchEvent cannot read (it expects the
   * inner/dispatching bookkeeping this class's instances carry).
   */
  const Event = root.Event || PseudoEvent
  if (typeof newWindow.Event === 'undefined') {
    newWindow.Event = Event
  }

  /**
   * Define document when not available - a real instance, unlike the classes above (window.document IS an object,
   * not a constructor).
   */
  const document = root.document || new PseudoHTMLDocument()
  if (typeof newWindow.document === 'undefined') {
    newWindow.document = document
  }

  // When there was no real document, newWindow is root itself (see above), so every assignment above already
  // mutated it directly. If context is also that same object (root and context given as one and the same, as
  // installGlobal does) merging is already done - doing it again would be Object.assign(target, target), which
  // throws on any getter-only own property target already has (globalThis.crypto, in Node).
  const mergeInto: any = context || root
  return newWindow === mergeInto ? newWindow : Object.assign(mergeInto, newWindow)
}

export default generateDocument

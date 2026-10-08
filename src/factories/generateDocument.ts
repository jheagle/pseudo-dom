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
   * Unlike Node/Element/HTMLElement/HTMLDocument above, this is NOT `root.Event || PseudoEvent`: Node.js itself has
   * had a global Event/EventTarget since v15, unrelated to this module and incompatible with it (dispatchEvent
   * below expects the inner/dispatching bookkeeping only this module's own instances carry) - so by the time this
   * function is reached (no real document, meaning no real browser or jsdom either), any Event already on root can
   * only be that unrelated native one, or this module's own from an earlier install (functionally identical to
   * reinstalling it) - never a real browser's. Preferring root.Event the way the others do would keep Node's
   * incompatible one every time, since it is never actually undefined.
   */
  if (newWindow.Event !== PseudoEvent) {
    newWindow.Event = PseudoEvent
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

/**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

import * as PseudoEvent from './class/PseudoEvent'
import * as PseudoEventTarget from './class/PseudoEventTarget'
import * as PseudoNode from './class/PseudoNode'
import * as PseudoElement from './class/PseudoElement'
import * as PseudoHTMLElement from './class/PseudoHTMLElement'
import * as PseudoHTMLDocument from './class/PseudoHTMLDocument'

/**
 * Store a reference to this scope which will be Window if rendered via browser
 */
const root = this || window || global || {}

/**
 * Store reference to any pre-existing module of the same name
 * @type {module|*}
 */
const previousPseudoDom = root.pseudoDom || {}

/**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
const pseudoDom = {}
root.pseudoDom = pseudoDom

/**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside of the browser
 * context.
 * @function generate
 * @param {Object} root
 * @param {Object} context
 * @returns {Window|PseudoEventTarget}
 */
pseudoDom.generate = (root, context = {}) => {
  /**
   *
   * @type {Window|PseudoEventTarget}
   */
  const newWindow = typeof root.document === 'undefined' ? root : new pseudoDom.PseudoEventTarget()

  /**
   * @type {Node|PseudoNode}
   */
  const Node = root.Node || new pseudoDom.PseudoNode()
  if (typeof newWindow.Node === 'undefined') {
    newWindow.Node = Node
  }

  /**
   *
   * @type {Element|PseudoElement}
   */
  const Element = root.Element || new pseudoDom.PseudoElement()
  if (typeof newWindow.Element === 'undefined') {
    newWindow.Element = Element
  }

  /**
   * Create an instance of HTMLElement if not available
   * @type {HTMLElement|PseudoHTMLElement}
   */
  const HTMLElement = root.HTMLElement || new pseudoDom.PseudoHTMLElement()
  if (typeof newWindow.HTMLElement === 'undefined') {
    newWindow.HTMLElement = HTMLElement
  }

  /**
   * Define document when not available
   * @type {Document|PseudoHTMLDocument}
   */
  const document = root.document || new pseudoDom.PseudoHTMLDocument()
  if (typeof newWindow.document === 'undefined') {
    newWindow.document = document
  }

  return context ? Object.assign(context, pseudoDom, newWindow) : Object.assign(root, newWindow)
}

/**
 * Return a reference to this library while preserving the original same-named library
 * @function noConflict
 * @returns {pseudoDom}
 */
pseudoDom.noConflict = () => {
  root.pseudoDom = previousPseudoDom
  return pseudoDom
}

export default Object.assign(
  pseudoDom,
  PseudoEvent,
  PseudoEventTarget,
  PseudoNode,
  PseudoElement,
  PseudoHTMLElement,
  PseudoHTMLDocument
)

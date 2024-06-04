/**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

import PseudoEvent from './interfaces/PseudoEvent'
import PseudoEventTarget from './interfaces/PseudoEventTarget'
import PseudoNode from './interfaces/PseudoNode'
import PseudoElement from './interfaces/PseudoElement'
import PseudoHTMLElement from './interfaces/PseudoHTMLElement'
import PseudoHTMLDocument from './classes/PseudoHTMLDocument'
import generateDocument from './factories/generateDocument'

/**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
const pseudoDom = Object.assign(
  {
    generateDocument
  },
  PseudoEvent,
  PseudoEventTarget,
  PseudoNode,
  PseudoElement,
  PseudoHTMLElement,
  PseudoHTMLDocument
)

export default pseudoDom

if (this) {
  // @ts-ignore
  this.pseudoDom = pseudoDom
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.pseudoDom = pseudoDom
}

/**
 * @file All of the Pseudo Dom classes for replicating DOM structure.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

import { EventService as PseudoEvent } from './services/EventService'
import PseudoEventTarget from './services/EventTargetService'
import { NodeService as PseudoNode } from './services/NodeService'
import { ElementService as PseudoElement } from './services/ElementService'
import { HTMLElementService as PseudoHTMLElement } from './services/HTMLElementService'
import PseudoHTMLDocument from './classes/PseudoHTMLDocument'

export default {
  PseudoEvent,
  PseudoEventTarget,
  PseudoNode,
  PseudoElement,
  PseudoHTMLElement,
  PseudoHTMLDocument
}

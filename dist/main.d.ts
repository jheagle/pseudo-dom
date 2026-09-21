/**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { EventService as PseudoEvent } from './services/EventService';
import PseudoEventTarget from './services/EventTargetService';
import { NodeService as PseudoNode } from './services/NodeService';
import { ElementService as PseudoElement } from './services/ElementService';
import { HTMLElementService as PseudoHTMLElement } from './services/HTMLElementService';
import PseudoHTMLDocument from './classes/PseudoHTMLDocument';
import generateDocument from './factories/generateDocument';
/**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
declare const pseudoDom: {
    generateDocument: (root: Window | any, context?: object) => Window | PseudoEventTarget;
    PseudoEvent: typeof PseudoEvent;
    PseudoEventTarget: typeof PseudoEventTarget;
    PseudoNode: typeof PseudoNode;
    PseudoElement: typeof PseudoElement;
    PseudoHTMLElement: typeof PseudoHTMLElement;
    PseudoHTMLDocument: typeof PseudoHTMLDocument;
};
export { generateDocument, PseudoEvent, PseudoEventTarget, PseudoNode, PseudoElement, PseudoHTMLElement, PseudoHTMLDocument };
export default pseudoDom;

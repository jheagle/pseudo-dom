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
import createEvent from './factories/createEvent';
import eventDefaults from './factories/eventDefaults';
import { UIEventService as PseudoUIEvent } from './services/UIEventService';
import { MouseEventService as PseudoMouseEvent } from './services/MouseEventService';
import { PointerEventService as PseudoPointerEvent } from './services/PointerEventService';
import { KeyboardEventService as PseudoKeyboardEvent } from './services/KeyboardEventService';
import { FocusEventService as PseudoFocusEvent } from './services/FocusEventService';
import { InputEventService as PseudoInputEvent } from './services/InputEventService';
import { CustomEventService as PseudoCustomEvent } from './services/CustomEventService';
import simulate from './simulate';
/**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
declare const pseudoDom: {
    generateDocument: (root: Window | any, context?: object) => Window | PseudoEventTarget;
    createEvent: (type: string, init?: {
        [option: string]: any;
    }, { browser, trusted }?: import("./factories/createEvent").CreateEventOptions) => PseudoEvent;
    eventDefaults: {
        [type: string]: import("./factories/eventDefaults").EventDefinition;
    };
    simulate: {
        click: (element: any, init?: {
            [option: string]: any;
        }) => boolean;
        keyPress: (element: any, key: string, init?: {
            [option: string]: any;
        }) => boolean;
    };
    PseudoEvent: typeof PseudoEvent;
    PseudoUIEvent: typeof PseudoUIEvent;
    PseudoMouseEvent: typeof PseudoMouseEvent;
    PseudoPointerEvent: typeof PseudoPointerEvent;
    PseudoKeyboardEvent: typeof PseudoKeyboardEvent;
    PseudoFocusEvent: typeof PseudoFocusEvent;
    PseudoInputEvent: typeof PseudoInputEvent;
    PseudoCustomEvent: typeof PseudoCustomEvent;
    PseudoEventTarget: typeof PseudoEventTarget;
    PseudoNode: typeof PseudoNode;
    PseudoElement: typeof PseudoElement;
    PseudoHTMLElement: typeof PseudoHTMLElement;
    PseudoHTMLDocument: typeof PseudoHTMLDocument;
};
export { generateDocument, createEvent, eventDefaults, simulate, PseudoEvent, PseudoUIEvent, PseudoMouseEvent, PseudoPointerEvent, PseudoKeyboardEvent, PseudoFocusEvent, PseudoInputEvent, PseudoCustomEvent, PseudoEventTarget, PseudoNode, PseudoElement, PseudoHTMLElement, PseudoHTMLDocument };
export default pseudoDom;

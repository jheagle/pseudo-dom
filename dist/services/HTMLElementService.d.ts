/**
 * @file Substitute for the DOM HTMLElement Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoHTMLElement } from '../interfaces/PseudoHTMLElement';
import { PseudoNode } from '../interfaces/PseudoNode';
import { ElementService } from './ElementService';
/**
 * Simulate the behaviour of the HTMLElement Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoElement
 * @property {boolean} hidden - State of whether element is visible
 * @property {number} offsetHeight - The height of the element as offset by the parent element
 * @property {number} offsetLeft - The position of the left side of the element based on the parent element
 * @property {PseudoHTMLElement} offsetParent - A reference to the closest positioned parent element
 * @property {number} offsetTop - The position of the top side of the element based on the parent element
 * @property {number} offsetWidth - The width of the element as offset by the parent element
 * @property {Object} style - A container to define all applied inline-styles
 * @property {string} title - The title attribute which affects the text visible on hover
 */
export declare class HTMLElementService extends ElementService implements Partial<PseudoHTMLElement> {
    /**
     * Simulate the HTMLElement object when the Dom is not available
     * @param {Object} [elementOptions={}]
     * @param {string} [elementOptions.tagName='']
     * @param {PseudoNode|Object} [elementOptions.parent={}]
     * @param {Array} [elementOptions.children=[]]
     * @constructor
     */
    constructor({ tagName, parent, children }?: {
        tagName?: string;
        parent?: PseudoNode | null;
        children?: Array<any>;
    });
    /**
     * Whether this element can have the focus: form controls and links which are not disabled, and anything with a tabindex.
     * @returns {boolean}
     */
    get canFocus(): boolean;
    /**
     * Click the element: a click event is sent to it, which bubbles and can be cancelled, like one from a user but a
     * script made it (so it is not trusted). A disabled element does nothing.
     */
    click(): void;
    /**
     * Give the element the focus. The element which had it gets blur then focusout, and this one gets focus then
     * focusin (blur and focus do not bubble, focusin and focusout do). Nothing happens when the element cannot have the
     * focus or already has it.
     */
    focus(): void;
    /**
     * Take the focus away from the element, when it has it: it gets blur then focusout.
     */
    blur(): void;
}

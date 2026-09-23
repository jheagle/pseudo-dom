/**
 * @file Substitute for the DOM HTMLElement Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoElement } from './PseudoElement';
import { PseudoCSSStyleDeclaration } from './PseudoCSSStyleDeclaration';
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
 * @property {string} title - The title attribute which affects the text visible on hover
 */
export interface PseudoHTMLElement extends PseudoElement {
    /**
     * The element's inline styles, live and settable per property (style.color = 'red') as well as through the real
     * CSSStyleDeclaration methods (getPropertyValue, setProperty, removeProperty, cssText).
     */
    get style(): PseudoCSSStyleDeclaration;
    /**
     * The element's data-* attributes, live, under their camelCase names (data-foo-bar <-> dataset.fooBar).
     */
    get dataset(): {
        [key: string]: string;
    };
}

/**
 * Substitute for the DOM HTMLElement Class.
 */
import { PseudoElement } from './PseudoElement';
import { PseudoCSSStyleDeclaration } from './PseudoCSSStyleDeclaration';
/**
 * Simulate the behaviour of the HTMLElement Class when there is no DOM available.
 *
 * It also has these simple properties, which are stored as attributes:
 * - `hidden`: state of whether the element is visible
 * - `title`: the title attribute, which affects the text visible on hover
 * - `offsetHeight`, `offsetWidth`: the height and width of the element as offset by the parent element
 * - `offsetLeft`, `offsetTop`: the position of the left and top sides of the element based on the parent element
 * - `offsetParent`: a reference to the closest positioned parent element
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

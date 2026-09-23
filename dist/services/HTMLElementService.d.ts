/**
 * @file Substitute for the DOM HTMLElement Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoHTMLElement } from '../interfaces/PseudoHTMLElement';
import { PseudoNode } from '../interfaces/PseudoNode';
import { NodeService } from './NodeService';
import { ElementService } from './ElementService';
import { CSSStyleDeclarationService } from './CSSStyleDeclarationService';
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
 * @property {CSSStyleDeclarationService} style - The element's inline styles, live and settable per property
 * @property {Object.<string, string>} dataset - The element's data-* attributes, live, under their camelCase names
 * @property {string} title - The title attribute which affects the text visible on hover
 */
export declare class HTMLElementService extends ElementService implements Partial<PseudoHTMLElement> {
    private readonly styleDeclaration;
    private readonly datasetProxy;
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
     * The element's inline styles: a live CSSStyleDeclaration-like object, so both style.setProperty('color', 'red')
     * and style.color = 'red' work.
     * @returns {CSSStyleDeclarationService}
     */
    get style(): CSSStyleDeclarationService;
    /**
     * The element's data-* attributes, live, under their camelCase names (data-foo-bar <-> dataset.fooBar). Backed
     * directly by getAttribute / setAttribute, so it is never out of sync with the attributes themselves.
     * @returns {Object.<string, string>}
     */
    get dataset(): {
        [key: string]: string;
    };
    /**
     * Style is not attribute-backed like most properties (see the constructor), so cloneNode needs its own copy of it.
     * @returns {NodeService}
     */
    protected cloneShallow(): NodeService;
    /**
     * Style is not attribute-backed like most properties, so isEqualNode needs to compare it separately too.
     * @param {NodeService} other The node to compare with
     * @returns {boolean}
     */
    protected equalsShallow(other: NodeService): boolean;
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

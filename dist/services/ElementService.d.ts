/**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoNode } from '../interfaces/PseudoNode';
import { PseudoElement } from '../interfaces/PseudoElement';
import { NodeService } from './NodeService';
import { PseudoNamedNodeMap } from '../interfaces/PseudoNamedNodeMap';
import { PseudoDOMTokenList } from '../interfaces/PseudoDOMTokenList';
import { PseudoHTMLCollection } from '../interfaces/PseudoHTMLCollection';
type attribute = {
    name: string;
    value: any;
};
/**
 * Simulate the behaviour of the Element Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoNode
 * @property {string} tagName
 * @property {string} className
 * @property {string} id
 * @property {string} innerHtml
 * @property {Array} attributes
 * @property {function} hasAttribute
 * @property {function} setAttribute
 * @property {function} getAttribute
 * @property {function} removeAttribute
 */
export declare class ElementService extends NodeService implements Partial<PseudoElement> {
    id: string;
    innerHTML: string;
    type: string;
    private readonly tag;
    private readonly attributeList;
    private readonly propertyAttributes;
    private readonly tokenList;
    private defaultEventApplied;
    /**
     * @param {Object} [settings={}]
     * @param {string} [settings.tagName=''] The name of the tag this element represents
     * @param {Array<{name: string, value: *}>} [settings.attributes=[]] The attributes (also assigned as properties) to start with
     * @param {PseudoNode|null} [settings.parent=null] The node to add this element to as its last child
     * @param {Array<PseudoNode>} [settings.children=[]] The nodes to start as children
     * @constructor
     */
    constructor({ tagName, attributes, parent, children }?: {
        tagName?: string;
        attributes?: Array<attribute>;
        parent?: PseudoNode | null;
        children?: Array<any>;
    });
    /**
     * The attributes with the values they have now: the ones which are also properties (className, id, style, ...) can
     * have been changed through the property, which does not change the stored list.
     * @returns {Array<{name: string, value: *}>}
     */
    private currentAttributes;
    get nodeName(): string;
    /**
     * A copy of this element without its children: the same tag and attributes (the values which are objects, such as
     * style, are copied too rather than shared), but not its parent or listeners.
     * @returns {ElementService}
     */
    protected cloneShallow(): NodeService;
    /**
     * Elements are equal when they have the same tag and the same attributes (in any order), which is what isEqualNode
     * checks before it compares the children.
     * @param {NodeService} other The element to compare with
     * @returns {boolean}
     */
    protected equalsShallow(other: NodeService): boolean;
    get tagName(): string;
    get nodeType(): number;
    get attributes(): PseudoNamedNodeMap;
    get classList(): PseudoDOMTokenList;
    get className(): string;
    set className(className: string);
    /**
     * Some elements have default behaviour, this registers it when the element is added.
     * @returns {Function}
     */
    /**
     * A live view of this element's element children (text, comments and the like are not included).
     * @returns {PseudoHTMLCollection}
     */
    get children(): PseudoHTMLCollection;
    /**
     * How many element children this element has.
     * @returns {number}
     */
    get childElementCount(): number;
    /**
     * The first child of this element which is an element, or null when there is none.
     * @returns {PseudoElement|null}
     */
    get firstElementChild(): PseudoElement | null;
    /**
     * The last child of this element which is an element, or null when there is none.
     * @returns {PseudoElement|null}
     */
    get lastElementChild(): PseudoElement | null;
    /**
     * The sibling after this one which is an element, or null when there is none.
     * @returns {PseudoElement|null}
     */
    get nextElementSibling(): PseudoElement | null;
    /**
     * The sibling before this one which is an element, or null when there is none.
     * @returns {PseudoElement|null}
     */
    get previousElementSibling(): PseudoElement | null;
    /**
     * Put an element at a position relative to this one: beforebegin (before this element, as its previous sibling),
     * afterbegin (as this element's first child), beforeend (as this element's last child) or afterend (after this
     * element, as its next sibling).
     * @param {string} position beforebegin, afterbegin, beforeend or afterend
     * @param {ElementService} element The element to insert
     * @returns {ElementService|null} The inserted element, or null when the position needed a parent this element does not have
     * @throws {Error} When the position is not one of the four above
     */
    insertAdjacentElement(position: string, element: PseudoElement): PseudoElement | null;
    /**
     * Put text at a position relative to this element, the same as insertAdjacentElement but the text becomes a text node.
     * @param {string} position beforebegin, afterbegin, beforeend or afterend
     * @param {string} text The text to insert
     * @throws {Error} When the position is not one of the four above
     */
    insertAdjacentText(position: string, text: string): void;
    /**
     * Shared implementation for insertAdjacentElement / insertAdjacentText.
     * @param {string} position beforebegin, afterbegin, beforeend or afterend
     * @param {PseudoNode|string} node The node (or text) to insert
     * @returns {PseudoNode|null} The inserted node, or null when the position needed a parent this element does not have
     * @throws {Error} When the position is not one of the four above
     */
    private insertAdjacent;
    /**
     * Not implemented yet (HTML parsing is out of scope for now).
     * @param {string} position beforebegin, afterbegin, beforeend or afterend
     * @param {string} text The markup which would be parsed
     * @throws {Error}
     */
    insertAdjacentHTML(position: string, text: string): void;
    /**
     * Whether this element itself (not its descendants) matches the given CSS selector.
     * @param {string} selectors A CSS selector
     * @returns {boolean}
     */
    matches(selectors: string): boolean;
    /**
     * The nearest ancestor of this element (starting with this element itself) which matches the CSS selector, or
     * null when none of them do.
     * @param {string} selectors A CSS selector
     * @returns {PseudoElement|null}
     */
    closest(selectors: string): PseudoElement | null;
    applyDefaultEvent(): Function;
    /**
     * An element which is added as a child gets its default events (for example a submit button submits its form).
     * @param {NodeService} child The node which was inserted
     */
    protected childInserted(child: NodeService): void;
    /**
     * Check whether the element has an attribute by that name.
     * @param {string} attributeName
     * @returns {boolean}
     */
    hasAttribute(attributeName: string): boolean;
    /**
     * Set the value of an attribute, adding the attribute if it did not exist.
     * @param {string} attributeName
     * @param {string} attributeValue
     * @returns {undefined}
     */
    setAttribute(attributeName: string, attributeValue: string): void;
    /**
     * Retrieve the value of an attribute.
     * @param {string} attributeName
     * @returns {string|null} The value, or null when there is no such attribute
     */
    getAttribute(attributeName: string): string | null;
    /**
     * Remove an attribute from the element.
     * @param {string} attributeName
     * @returns {undefined}
     */
    removeAttribute(attributeName: string): void;
}
export {};

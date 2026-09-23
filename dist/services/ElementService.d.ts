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
import { PseudoShadowRoot } from '../interfaces/PseudoShadowRoot';
type attribute = {
    name: string;
    value: any;
};
type DOMRect = {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
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
    clientHeight: number;
    clientLeft: number;
    clientTop: number;
    clientWidth: number;
    scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    /** What getBoundingClientRect() returns - not really computed (there is no layout engine), set this directly. */
    boundingClientRect: DOMRect;
    /** What getClientRects() returns - set this directly. */
    clientRects: Array<DOMRect>;
    /** What getAnimations() returns - set this directly. */
    animations: Array<any>;
    /** What checkVisibility() returns - set this directly. */
    isVisible: boolean;
    private readonly tag;
    private readonly attributeList;
    private readonly propertyAttributes;
    private readonly tokenList;
    private readonly capturedPointers;
    private shadowRootInstance;
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
    /**
     * The local part of the element's qualified name. There is no real namespace parsing here, so this is always the
     * same as tagName.
     * @returns {string}
     */
    get localName(): string;
    /**
     * The element's namespace prefix, or null when it has none. There is no real namespace parsing here, so this is
     * always null.
     * @returns {string|null}
     */
    get prefix(): string | null;
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
    /**
     * The name of every attribute on the element, in the order they were set.
     * @returns {Array<string>}
     */
    getAttributeNames(): Array<string>;
    /**
     * Whether the element has any attributes at all.
     * @returns {boolean}
     */
    hasAttributes(): boolean;
    /**
     * Add the attribute (with an empty value) when it is not present, or remove it when it is - unless force says
     * which of those to do instead. Returns whether the attribute is present after the call.
     * @param {string} attributeName
     * @param {boolean} [force]
     * @returns {boolean}
     */
    toggleAttribute(attributeName: string, force?: boolean): boolean;
    /**
     * The size of the element and its position, settable directly - there is no layout engine here to compute it.
     * @returns {DOMRect}
     */
    getBoundingClientRect(): DOMRect;
    /**
     * The bounding rectangles for each line of text in the element, settable directly - there is no layout engine
     * here to compute it.
     * @returns {Array<DOMRect>}
     */
    getClientRects(): Array<DOMRect>;
    /**
     * The Animation objects currently active on the element, settable directly - there is no animation engine here.
     * @returns {Array<*>}
     */
    getAnimations(): Array<any>;
    /**
     * Whether the element is expected to be visible, settable directly - there is no rendering here to check it.
     * @returns {boolean}
     */
    checkVisibility(): boolean;
    /**
     * A read-only view of the element's own inline style declarations (there is no CSS cascade here, so this is not a
     * real computed style - just what the element's own style object holds).
     * @returns {{get: function(string): (string|undefined)}}
     */
    computedStyleMap(): {
        get: (property: string) => string | undefined;
    };
    /**
     * Whether this element currently has capture of the given pointer.
     * @param {number} pointerId
     * @returns {boolean}
     */
    hasPointerCapture(pointerId: number): boolean;
    /**
     * Give this element capture of the given pointer.
     * @param {number} pointerId
     * @returns {undefined}
     */
    setPointerCapture(pointerId: number): void;
    /**
     * Release this element's capture of the given pointer, if it had it.
     * @param {number} pointerId
     * @returns {undefined}
     */
    releasePointerCapture(pointerId: number): void;
    /**
     * Scroll to the given position (or, given an options object, the position(s) it has). There is no real scrollable
     * viewport here: this just sets scrollLeft / scrollTop.
     * @param {number|{left: number, top: number}} [x=0]
     * @param {number} [y=0]
     * @returns {undefined}
     */
    scroll(x?: number | {
        left?: number;
        top?: number;
    }, y?: number): void;
    /**
     * Scroll to the given position. An alias for scroll.
     * @param {number|{left: number, top: number}} [x=0]
     * @param {number} [y=0]
     * @returns {undefined}
     */
    scrollTo(x?: number | {
        left?: number;
        top?: number;
    }, y?: number): void;
    /**
     * Scroll by the given amount, relative to the current position.
     * @param {number|{left: number, top: number}} [x=0]
     * @param {number} [y=0]
     * @returns {undefined}
     */
    scrollBy(x?: number | {
        left?: number;
        top?: number;
    }, y?: number): void;
    /**
     * Scroll an ancestor until this element is in view. There is no real viewport here for that to mean anything, so
     * this does nothing (override it on an instance in a test which needs to observe the call).
     * @returns {undefined}
     */
    scrollIntoView(): void;
    /**
     * Asynchronously ask for the element to be shown fullscreen. There is no real fullscreen here, so this just
     * resolves, like a browser granting the request would.
     * @returns {Promise<void>}
     */
    requestFullscreen(): Promise<void>;
    /**
     * Asynchronously ask for the pointer to be locked to this element. There is no real pointer lock here, so this
     * just resolves, like a browser granting the request would.
     * @returns {Promise<void>}
     */
    requestPointerLock(): Promise<void>;
    /**
     * Attach a shadow tree to this element and return its ShadowRoot. Throws when it already hosts one.
     * @param {{mode: string}} options
     * @returns {PseudoShadowRoot}
     * @throws {Error}
     */
    attachShadow(options: {
        mode: string;
    }): PseudoShadowRoot;
    /**
     * This element's shadow root, when it has one attached in 'open' mode, or null (including when the mode is
     * 'closed' - it still exists, but is not reachable this way, like the DOM's).
     * @returns {PseudoShadowRoot|null}
     */
    get shadowRoot(): PseudoShadowRoot | null;
}
export {};

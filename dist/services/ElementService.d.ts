/**
 * Substitute for the DOM Element Class.
 */
import { PseudoNode } from '../interfaces/PseudoNode';
import { PseudoElement } from '../interfaces/PseudoElement';
import { NodeService } from './NodeService';
import { PseudoNamedNodeMap } from '../interfaces/PseudoNamedNodeMap';
import { PseudoDOMTokenList } from '../interfaces/PseudoDOMTokenList';
import { AttrService } from './AttrService';
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
 */
export declare class ElementService extends NodeService implements Partial<PseudoElement> {
    id: string;
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
     * @param settings
     * @param settings.tagName The name of the tag this element represents
     * @param settings.attributes The attributes (also assigned as properties) to start with
     * @param settings.parent The node to add this element to as its last child
     * @param settings.children The nodes to start as children
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
     */
    private currentAttributes;
    get nodeName(): string;
    /**
     * A copy of this element without its children: the same tag and attributes (the values which are objects, such as
     * style, are copied too rather than shared), but not its parent or listeners.
     */
    protected cloneShallow(): NodeService;
    /**
     * Elements are equal when they have the same tag and the same attributes (in any order), which is what isEqualNode
     * checks before it compares the children.
     * @param other The element to compare with
     */
    protected equalsShallow(other: NodeService): boolean;
    get tagName(): string;
    /**
     * The local part of the element's qualified name. There is no real namespace parsing here, so this is always the
     * same as tagName.
     */
    get localName(): string;
    /**
     * The element's namespace prefix, or null when it has none. There is no real namespace parsing here, so this is
     * always null.
     */
    get prefix(): string | null;
    /**
     * The HTML markup of this element's children. Only the getter is here (the setter, which needs to build new
     * elements from parsed HTML, is on HTMLElementService - see its class comment).
     */
    get innerHTML(): string;
    /**
     * The HTML markup of this element itself, including its children. Only the getter is here (see innerHTML).
     */
    get outerHTML(): string;
    get nodeType(): number;
    get attributes(): PseudoNamedNodeMap;
    get classList(): PseudoDOMTokenList;
    get className(): string;
    set className(className: string);
    /**
     * Some elements have default behaviour, this registers it when the element is added.
     */
    /**
     * A live view of this element's element children (text, comments and the like are not included).
     */
    get children(): PseudoHTMLCollection;
    /**
     * How many element children this element has.
     */
    get childElementCount(): number;
    /**
     * The first child of this element which is an element, or null when there is none.
     */
    get firstElementChild(): PseudoElement | null;
    /**
     * The last child of this element which is an element, or null when there is none.
     */
    get lastElementChild(): PseudoElement | null;
    /**
     * The sibling after this one which is an element, or null when there is none.
     */
    get nextElementSibling(): PseudoElement | null;
    /**
     * The sibling before this one which is an element, or null when there is none.
     */
    get previousElementSibling(): PseudoElement | null;
    /**
     * Put an element at a position relative to this one: beforebegin (before this element, as its previous sibling),
     * afterbegin (as this element's first child), beforeend (as this element's last child) or afterend (after this
     * element, as its next sibling).
     * @param position beforebegin, afterbegin, beforeend or afterend
     * @param element The element to insert
     * @returns The inserted element, or null when the position needed a parent this element does not have
     * @throws {Error} When the position is not one of the four above
     */
    insertAdjacentElement(position: string, element: PseudoElement): PseudoElement | null;
    /**
     * Put text at a position relative to this element, the same as insertAdjacentElement but the text becomes a text node.
     * @param position beforebegin, afterbegin, beforeend or afterend
     * @param text The text to insert
     * @throws {Error} When the position is not one of the four above
     */
    insertAdjacentText(position: string, text: string): void;
    /**
     * Shared implementation for insertAdjacentElement / insertAdjacentText.
     * @param position beforebegin, afterbegin, beforeend or afterend
     * @param node The node (or text) to insert
     * @returns The inserted node, or null when the position needed a parent this element does not have
     * @throws {Error} When the position is not one of the four above
     */
    private insertAdjacent;
    /**
     * Not implemented yet (HTML parsing is out of scope for now).
     * @param position beforebegin, afterbegin, beforeend or afterend
     * @param text The markup which would be parsed
     * @throws {Error}
     */
    insertAdjacentHTML(position: string, text: string): void;
    /**
     * Whether this element itself (not its descendants) matches the given CSS selector.
     * @param selectors A CSS selector
     */
    matches(selectors: string): boolean;
    /**
     * The nearest ancestor of this element (starting with this element itself) which matches the CSS selector, or
     * null when none of them do.
     * @param selectors A CSS selector
     */
    closest(selectors: string): PseudoElement | null;
    applyDefaultEvent(): Function;
    /**
     * An element which is added as a child gets its default events (for example a submit button submits its form).
     * @param child The node which was inserted
     */
    protected childInserted(child: NodeService): void;
    /**
     * Check whether the element has an attribute by that name.
     * @param attributeName
     */
    hasAttribute(attributeName: string): boolean;
    /**
     * Set the value of an attribute, adding the attribute if it did not exist.
     * @param attributeName
     * @param attributeValue
     */
    setAttribute(attributeName: string, attributeValue: string): void;
    /**
     * Retrieve the value of an attribute.
     * @param attributeName
     * @returns The value, or null when there is no such attribute
     */
    getAttribute(attributeName: string): string | null;
    /**
     * Remove an attribute from the element.
     * @param attributeName
     */
    removeAttribute(attributeName: string): void;
    /**
     * The name of every attribute on the element, in the order they were set.
     */
    getAttributeNames(): Array<string>;
    /**
     * Whether the element has any attributes at all.
     */
    hasAttributes(): boolean;
    /**
     * Retrieve the node representation of an attribute.
     * @param attributeName
     * @returns An Attr for the attribute, or null when there is no such attribute
     */
    getAttributeNode(attributeName: string): AttrService | null;
    /**
     * Retrieve the node representation of an attribute. There is no real namespace parsing here, so this ignores
     * the namespace and behaves exactly like getAttributeNode.
     * @param namespace Ignored
     * @param attributeName
     * @returns An Attr for the attribute, or null when there is no such attribute
     */
    getAttributeNodeNS(namespace: string, attributeName: string): AttrService | null;
    /**
     * Retrieve the value of an attribute. There is no real namespace parsing here, so this ignores the namespace
     * and behaves exactly like getAttribute.
     * @param namespace Ignored
     * @param attributeName
     * @returns The value, or null when there is no such attribute
     */
    getAttributeNS(namespace: string, attributeName: string): string | null;
    /**
     * Check whether the element has an attribute by that name. There is no real namespace parsing here, so this
     * ignores the namespace and behaves exactly like hasAttribute.
     * @param namespace Ignored
     * @param attributeName
     */
    hasAttributeNS(namespace: string, attributeName: string): boolean;
    /**
     * Remove the node representation of an attribute from the element, and return it.
     * @param attr
     * @returns The removed Attr
     * @throws {Error} When the element has no attribute matching attr.name
     */
    removeAttributeNode(attr: AttrService): AttrService;
    /**
     * Remove an attribute from the element. There is no real namespace parsing here, so this ignores the namespace
     * and behaves exactly like removeAttribute.
     * @param namespace Ignored
     * @param attributeName
     */
    removeAttributeNS(namespace: string, attributeName: string): void;
    /**
     * Set the node representation of an attribute, adding the attribute if it did not exist. Returns any previous
     * Attr that had the same name, or null when there was none.
     * @param attr
     * @returns The replaced Attr, or null when the attribute was new
     */
    setAttributeNode(attr: AttrService): AttrService | null;
    /**
     * Set the node representation of an attribute. There is no real namespace parsing here, so this behaves
     * exactly like setAttributeNode (Attr.name already carries any prefix).
     * @param attr
     * @returns The replaced Attr, or null when the attribute was new
     */
    setAttributeNodeNS(attr: AttrService): AttrService | null;
    /**
     * Set the value of an attribute, adding the attribute if it did not exist. There is no real namespace parsing
     * here, so this ignores the namespace and behaves exactly like setAttribute.
     * @param namespace Ignored
     * @param attributeName
     * @param attributeValue
     */
    setAttributeNS(namespace: string, attributeName: string, attributeValue: string): void;
    /**
     * Add the attribute (with an empty value) when it is not present, or remove it when it is - unless force says
     * which of those to do instead. Returns whether the attribute is present after the call.
     * @param attributeName
     * @param force
     */
    toggleAttribute(attributeName: string, force?: boolean): boolean;
    /**
     * The size of the element and its position, settable directly - there is no layout engine here to compute it.
     */
    getBoundingClientRect(): DOMRect;
    /**
     * The bounding rectangles for each line of text in the element, settable directly - there is no layout engine
     * here to compute it.
     */
    getClientRects(): Array<DOMRect>;
    /**
     * The Animation objects currently active on the element, settable directly - there is no animation engine here.
     */
    getAnimations(): Array<any>;
    /**
     * Whether the element is expected to be visible, settable directly - there is no rendering here to check it.
     */
    checkVisibility(): boolean;
    /**
     * A read-only view of the element's own inline style declarations (there is no CSS cascade here, so this is not a
     * real computed style - just what the element's own style object holds).
     */
    computedStyleMap(): {
        get: (property: string) => string | undefined;
    };
    /**
     * Whether this element currently has capture of the given pointer.
     * @param pointerId
     */
    hasPointerCapture(pointerId: number): boolean;
    /**
     * Give this element capture of the given pointer.
     * @param pointerId
     */
    setPointerCapture(pointerId: number): void;
    /**
     * Release this element's capture of the given pointer, if it had it.
     * @param pointerId
     */
    releasePointerCapture(pointerId: number): void;
    /**
     * Scroll to the given position (or, given an options object, the position(s) it has). There is no real scrollable
     * viewport here: this just sets scrollLeft / scrollTop.
     * @param x
     * @param y
     */
    scroll(x?: number | {
        left?: number;
        top?: number;
    }, y?: number): void;
    /**
     * Scroll to the given position. An alias for scroll.
     * @param x
     * @param y
     */
    scrollTo(x?: number | {
        left?: number;
        top?: number;
    }, y?: number): void;
    /**
     * Scroll by the given amount, relative to the current position.
     * @param x
     * @param y
     */
    scrollBy(x?: number | {
        left?: number;
        top?: number;
    }, y?: number): void;
    /**
     * Scroll an ancestor until this element is in view. There is no real viewport here for that to mean anything, so
     * this does nothing (override it on an instance in a test which needs to observe the call).
     */
    scrollIntoView(): void;
    /**
     * Asynchronously ask for the element to be shown fullscreen. There is no real fullscreen here, so this just
     * resolves, like a browser granting the request would.
     */
    requestFullscreen(): Promise<void>;
    /**
     * Asynchronously ask for the pointer to be locked to this element. There is no real pointer lock here, so this
     * just resolves, like a browser granting the request would.
     */
    requestPointerLock(): Promise<void>;
    /**
     * Attach a shadow tree to this element and return its ShadowRoot. Throws when it already hosts one.
     * @param options
     * @throws {Error}
     */
    attachShadow(options: {
        mode: string;
    }): PseudoShadowRoot;
    /**
     * This element's shadow root, when it has one attached in 'open' mode, or null (including when the mode is
     * 'closed' - it still exists, but is not reachable this way, like the DOM's).
     */
    get shadowRoot(): PseudoShadowRoot | null;
    /**
     * Read one of the aria-* reflected properties (see the individual aria* getters/setters below).
     * @param attributeName A real aria-* attribute name (aria-label, ...)
     */
    private getAriaAttribute;
    /**
     * Write one of the aria-* reflected properties.
     * @param attributeName A real aria-* attribute name (aria-label, ...)
     * @param value
     */
    private setAriaAttribute;
    get ariaAtomic(): string;
    set ariaAtomic(value: string);
    get ariaAutoComplete(): string;
    set ariaAutoComplete(value: string);
    get ariaBusy(): string;
    set ariaBusy(value: string);
    get ariaChecked(): string;
    set ariaChecked(value: string);
    get ariaColCount(): string;
    set ariaColCount(value: string);
    get ariaColIndex(): string;
    set ariaColIndex(value: string);
    get ariaColSpan(): string;
    set ariaColSpan(value: string);
    get ariaCurrent(): string;
    set ariaCurrent(value: string);
    get ariaDescription(): string;
    set ariaDescription(value: string);
    get ariaDisabled(): string;
    set ariaDisabled(value: string);
    get ariaExpanded(): string;
    set ariaExpanded(value: string);
    get ariaHasPopup(): string;
    set ariaHasPopup(value: string);
    get ariaHidden(): string;
    set ariaHidden(value: string);
    get ariaKeyShortcuts(): string;
    set ariaKeyShortcuts(value: string);
    get ariaLabel(): string;
    set ariaLabel(value: string);
    get ariaLevel(): string;
    set ariaLevel(value: string);
    get ariaLive(): string;
    set ariaLive(value: string);
    get ariaModal(): string;
    set ariaModal(value: string);
    get ariaMultiline(): string;
    set ariaMultiline(value: string);
    get ariaMultiSelectable(): string;
    set ariaMultiSelectable(value: string);
    get ariaOrientation(): string;
    set ariaOrientation(value: string);
    get ariaPlaceholder(): string;
    set ariaPlaceholder(value: string);
    get ariaPosInSet(): string;
    set ariaPosInSet(value: string);
    get ariaPressed(): string;
    set ariaPressed(value: string);
    get ariaReadOnly(): string;
    set ariaReadOnly(value: string);
    get ariaRequired(): string;
    set ariaRequired(value: string);
    get ariaRoleDescription(): string;
    set ariaRoleDescription(value: string);
    get ariaRowCount(): string;
    set ariaRowCount(value: string);
    get ariaRowIndex(): string;
    set ariaRowIndex(value: string);
    get ariaRowSpan(): string;
    set ariaRowSpan(value: string);
    get ariaSelected(): string;
    set ariaSelected(value: string);
    get ariaSetSize(): string;
    set ariaSetSize(value: string);
    get ariaSort(): string;
    set ariaSort(value: string);
    get ariaValueMax(): string;
    set ariaValueMax(value: string);
    get ariaValueMin(): string;
    set ariaValueMin(value: string);
    get ariaValueNow(): string;
    set ariaValueNow(value: string);
    get ariaValueText(): string;
    set ariaValueText(value: string);
}
export {};

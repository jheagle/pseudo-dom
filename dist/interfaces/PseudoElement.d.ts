/**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoNode } from './PseudoNode';
import { PseudoHTMLSlotElement } from './PseudoHTMLSlotElement';
import { PseudoNamedNodeMap } from './PseudoNamedNodeMap';
import { PseudoDOMTokenList } from './PseudoDOMTokenList';
import { PseudoShadowRoot } from './PseudoShadowRoot';
import { PseudoHTMLCollection } from './PseudoHTMLCollection';
import { PseudoAnimation } from './PseudoAnimation';
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
export interface PseudoElement extends PseudoNode {
    /**
     * Returns a HTMLSlotElement representing the <slot> the node is inserted in.
     */
    get assignedSlot(): PseudoHTMLSlotElement | null;
    /**
     * Returns a NamedNodeMap object containing the assigned attributes of the corresponding HTML element.
     */
    get attributes(): PseudoNamedNodeMap;
    /**
     * Returns the number of child elements of this element.
     */
    get childElementCount(): number;
    /**
     * Returns the child elements of this element.
     */
    get children(): PseudoHTMLCollection;
    /**
     * Returns a DOMTokenList containing the list of class attributes.
     */
    get classList(): PseudoDOMTokenList;
    /**
     * A string representing the class of the element.
     */
    get className(): string;
    /**
     * A string representing the class of the element.
     * @param className
     */
    set className(className: string);
    /**
     * Returns a number representing the inner height of the element.
     */
    get clientHeight(): number;
    /**
     * Returns a number representing the width of the left border of the element.
     */
    get clientLeft(): number;
    /**
     * Returns a number representing the width of the top border of the element.
     */
    get clientTop(): number;
    /**
     * Returns a number representing the inner width of the element.
     */
    get clientWidth(): number;
    /**
     * Returns the first child element of this element.
     */
    get firstElementChild(): PseudoElement | null;
    /**
     * A string representing the id of the element.
     */
    get id(): string;
    /**
     * A string representing the markup of the element's content.
     */
    get innerHTML(): string;
    /**
     * A string representing the markup of the element's content.
     * @param html
     */
    set innerHTML(html: string);
    /**
     * Returns the last child element of this element.
     */
    get lastElementChild(): PseudoElement | null;
    /**
     * A string representing the local part of the qualified name of the element.
     */
    get localName(): string;
    /**
     * The namespace URI of the element, or null if it is no namespace.
     */
    get namespaceURI(): string | null;
    /**
     * An Element, the element immediately following the given one in the tree, or null if there's no sibling node.
     */
    get nextElementSibling(): PseudoElement | null;
    /**
     * A string representing the markup of the element including its content. When used as a setter, replaces the element with nodes parsed from the given string.
     */
    get outerHTML(): string;
    /**
     * A string representing the markup of the element including its content. When used as a setter, replaces the element with nodes parsed from the given string.
     * @param html
     */
    set outerHTML(html: string);
    /**
     * Represents the part identifier(s) of the element (i.e. set using the part attribute), returned as a DOMTokenList.
     */
    get part(): PseudoDOMTokenList;
    /**
     * Represents the part identifier(s) of the element (i.e. set using the part attribute), returned as a DOMTokenList.
     * @param part
     */
    set part(part: PseudoDOMTokenList);
    /**
     * A string representing the namespace prefix of the element, or null if no prefix is specified.
     */
    get prefix(): string;
    /**
     * An Element, the element immediately preceding the given one in the tree, or null if there is no sibling element.
     */
    get previousElementSibling(): PseudoElement | null;
    /**
     * Returns a number representing the scroll view height of an element.
     */
    get scrollHeight(): number;
    /**
     * A number representing the left scroll offset of the element.
     */
    get scrollLeft(): number;
    /**
     * A number representing the left scroll offset of the element.
     * @param left
     */
    set scrollLeft(left: number);
    /**
     * A number representing number of pixels the top of the element is scrolled vertically.
     */
    get scrollTop(): number;
    /**
     * A number representing number of pixels the top of the element is scrolled vertically.
     * @param top
     */
    set scrollTop(top: number);
    /**
     * Returns a number representing the scroll view width of the element.
     */
    get scrollWidth(): number;
    /**
     * Returns the open shadow root that is hosted by the element, or null if no open shadow root is present.
     */
    get shadowRoot(): PseudoShadowRoot | null;
    /**
     * Returns the name of the shadow DOM slot the element is inserted in.
     */
    get slot(): string;
    /**
     * Returns the name of the shadow DOM slot the element is inserted in.
     * @param slot
     */
    set slot(slot: string);
    /**
     * Returns a string with the name of the tag for the given element.
     */
    get tagName(): string;
    /**
     * A string reflecting the aria-atomic attribute, which indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute.
     */
    get ariaAtomic(): string;
    /**
     * A string reflecting the aria-atomic attribute, which indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute.
     */
    set ariaAtomic(value: string);
    /**
     * A string reflecting the aria-autocomplete attribute, which indicates whether inputting text could trigger display of one or more predictions of the user's intended value for a combobox, searchbox, or textbox and specifies how predictions would be presented if they were made.
     */
    get ariaAutoComplete(): string;
    /**
     * A string reflecting the aria-autocomplete attribute, which indicates whether inputting text could trigger display of one or more predictions of the user's intended value for a combobox, searchbox, or textbox and specifies how predictions would be presented if they were made.
     */
    set ariaAutoComplete(value: string);
    /**
     * A string reflecting the aria-busy attribute, which indicates whether an element is being modified, as assistive technologies may want to wait until the modifications are complete before exposing them to the user.
     */
    get ariaBusy(): string;
    /**
     * A string reflecting the aria-busy attribute, which indicates whether an element is being modified, as assistive technologies may want to wait until the modifications are complete before exposing them to the user.
     */
    set ariaBusy(value: string);
    /**
     * A string reflecting the aria-checked attribute, which indicates the current "checked" state of checkboxes, radio buttons, and other widgets that have a checked state.
     */
    get ariaChecked(): string;
    /**
     * A string reflecting the aria-checked attribute, which indicates the current "checked" state of checkboxes, radio buttons, and other widgets that have a checked state.
     */
    set ariaChecked(value: string);
    /**
     * A string reflecting the aria-colcount attribute, which defines the number of columns in a table, grid, or treegrid.
     */
    get ariaColCount(): string;
    /**
     * A string reflecting the aria-colcount attribute, which defines the number of columns in a table, grid, or treegrid.
     */
    set ariaColCount(value: string);
    /**
     * A string reflecting the aria-colindex attribute, which defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     */
    get ariaColIndex(): string;
    /**
     * A string reflecting the aria-colindex attribute, which defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     */
    set ariaColIndex(value: string);
    /**
     * A string reflecting the aria-colspan attribute, which defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     */
    get ariaColSpan(): string;
    /**
     * A string reflecting the aria-colspan attribute, which defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     */
    set ariaColSpan(value: string);
    /**
     * A string reflecting the aria-current attribute, which indicates the element that represents the current item within a container or set of related elements.
     */
    get ariaCurrent(): string;
    /**
     * A string reflecting the aria-current attribute, which indicates the element that represents the current item within a container or set of related elements.
     */
    set ariaCurrent(value: string);
    /**
     * A string reflecting the aria-description attribute, which defines a string value that describes or annotates the current element.
     */
    get ariaDescription(): string;
    /**
     * A string reflecting the aria-description attribute, which defines a string value that describes or annotates the current element.
     */
    set ariaDescription(value: string);
    /**
     * A string reflecting the aria-disabled attribute, which indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     */
    get ariaDisabled(): string;
    /**
     * A string reflecting the aria-disabled attribute, which indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     */
    set ariaDisabled(value: string);
    /**
     * A string reflecting the aria-expanded attribute, which indicates whether a grouping element owned or controlled by this element is expanded or collapsed.
     */
    get ariaExpanded(): string;
    /**
     * A string reflecting the aria-expanded attribute, which indicates whether a grouping element owned or controlled by this element is expanded or collapsed.
     */
    set ariaExpanded(value: string);
    /**
     * A string reflecting the aria-haspopup attribute, which indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
     */
    get ariaHasPopup(): string;
    /**
     * A string reflecting the aria-haspopup attribute, which indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
     */
    set ariaHasPopup(value: string);
    /**
     * A string reflecting the aria-hidden attribute, which indicates whether the element is exposed to an accessibility API.
     */
    get ariaHidden(): string;
    /**
     * A string reflecting the aria-hidden attribute, which indicates whether the element is exposed to an accessibility API.
     */
    set ariaHidden(value: string);
    /**
     * A string reflecting the aria-keyshortcuts attribute, which indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
     */
    get ariaKeyShortcuts(): string;
    /**
     * A string reflecting the aria-keyshortcuts attribute, which indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
     */
    set ariaKeyShortcuts(value: string);
    /**
     * A string reflecting the aria-label attribute, which defines a string value that labels the current element.
     */
    get ariaLabel(): string;
    /**
     * A string reflecting the aria-label attribute, which defines a string value that labels the current element.
     */
    set ariaLabel(value: string);
    /**
     * A string reflecting the aria-level attribute, which defines the hierarchical level of an element within a structure.
     */
    get ariaLevel(): string;
    /**
     * A string reflecting the aria-level attribute, which defines the hierarchical level of an element within a structure.
     */
    set ariaLevel(value: string);
    /**
     * A string reflecting the aria-live attribute, which indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
     */
    get ariaLive(): string;
    /**
     * A string reflecting the aria-live attribute, which indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
     */
    set ariaLive(value: string);
    /**
     * A string reflecting the aria-modal attribute, which indicates whether an element is modal when displayed.
     */
    get ariaModal(): string;
    /**
     * A string reflecting the aria-modal attribute, which indicates whether an element is modal when displayed.
     */
    set ariaModal(value: string);
    /**
     * A string reflecting the aria-multiline attribute, which indicates whether a text box accepts multiple lines of input or only a single line.
     */
    get ariaMultiline(): string;
    /**
     * A string reflecting the aria-multiline attribute, which indicates whether a text box accepts multiple lines of input or only a single line.
     */
    set ariaMultiline(value: string);
    /**
     * A string reflecting the aria-multiselectable attribute, which indicates that the user may select more than one item from the current selectable descendants.
     */
    get ariaMultiSelectable(): string;
    /**
     * A string reflecting the aria-multiselectable attribute, which indicates that the user may select more than one item from the current selectable descendants.
     */
    set ariaMultiSelectable(value: string);
    /**
     * A string reflecting the aria-orientation attribute, which indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous.
     */
    get ariaOrientation(): string;
    /**
     * A string reflecting the aria-orientation attribute, which indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous.
     */
    set ariaOrientation(value: string);
    /**
     * A string reflecting the aria-placeholder attribute, which defines a short hint intended to aid the user with data entry when the control has no value.
     */
    get ariaPlaceholder(): string;
    /**
     * A string reflecting the aria-placeholder attribute, which defines a short hint intended to aid the user with data entry when the control has no value.
     */
    set ariaPlaceholder(value: string);
    /**
     * A string reflecting the aria-posinset attribute, which defines an element's number or position in the current set of listitems or treeitems.
     */
    get ariaPosInSet(): string;
    /**
     * A string reflecting the aria-posinset attribute, which defines an element's number or position in the current set of listitems or treeitems.
     */
    set ariaPosInSet(value: string);
    /**
     * A string reflecting the aria-pressed attribute, which indicates the current "pressed" state of toggle buttons.
     */
    get ariaPressed(): string;
    /**
     * A string reflecting the aria-pressed attribute, which indicates the current "pressed" state of toggle buttons.
     */
    set ariaPressed(value: string);
    /**
     * A string reflecting the aria-readonly attribute, which indicates that the element is not editable, but is otherwise operable.
     */
    get ariaReadOnly(): string;
    /**
     * A string reflecting the aria-readonly attribute, which indicates that the element is not editable, but is otherwise operable.
     */
    set ariaReadOnly(value: string);
    /**
     * A string reflecting the aria-required attribute, which indicates that user input is required on the element before a form may be submitted.
     */
    get ariaRequired(): string;
    /**
     * A string reflecting the aria-required attribute, which indicates that user input is required on the element before a form may be submitted.
     */
    set ariaRequired(value: string);
    /**
     * A string reflecting the aria-roledescription attribute, which defines a human-readable, author-localized description for the role of an element.
     */
    get ariaRoleDescription(): string;
    /**
     * A string reflecting the aria-roledescription attribute, which defines a human-readable, author-localized description for the role of an element.
     */
    set ariaRoleDescription(value: string);
    /**
     * A string reflecting the aria-rowcount attribute, which defines the total number of rows in a table, grid, or treegrid.
     */
    get ariaRowCount(): string;
    /**
     * A string reflecting the aria-rowcount attribute, which defines the total number of rows in a table, grid, or treegrid.
     */
    set ariaRowCount(value: string);
    /**
     * A string reflecting the aria-rowindex attribute, which defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     */
    get ariaRowIndex(): string;
    /**
     * A string reflecting the aria-rowindex attribute, which defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     */
    set ariaRowIndex(value: string);
    /**
     * A string reflecting the aria-rowspan attribute, which defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     */
    get ariaRowSpan(): string;
    /**
     * A string reflecting the aria-rowspan attribute, which defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     */
    set ariaRowSpan(value: string);
    /**
     * A string reflecting the aria-selected attribute, which indicates the current "selected" state of elements that have a selected state.
     */
    get ariaSelected(): string;
    /**
     * A string reflecting the aria-selected attribute, which indicates the current "selected" state of elements that have a selected state.
     */
    set ariaSelected(value: string);
    /**
     * A string reflecting the aria-setsize attribute, which defines the number of items in the current set of listitems or treeitems.
     */
    get ariaSetSize(): string;
    /**
     * A string reflecting the aria-setsize attribute, which defines the number of items in the current set of listitems or treeitems.
     */
    set ariaSetSize(value: string);
    /**
     * A string reflecting the aria-sort attribute, which indicates if items in a table or grid are sorted in ascending or descending order.
     */
    get ariaSort(): string;
    /**
     * A string reflecting the aria-sort attribute, which indicates if items in a table or grid are sorted in ascending or descending order.
     */
    set ariaSort(value: string);
    /**
     * A string reflecting the aria-valueMax attribute, which defines the maximum allowed value for a range widget.
     */
    get ariaValueMax(): string;
    /**
     * A string reflecting the aria-valueMax attribute, which defines the maximum allowed value for a range widget.
     */
    set ariaValueMax(value: string);
    /**
     * A string reflecting the aria-valueMin attribute, which defines the minimum allowed value for a range widget.
     */
    get ariaValueMin(): string;
    /**
     * A string reflecting the aria-valueMin attribute, which defines the minimum allowed value for a range widget.
     */
    set ariaValueMin(value: string);
    /**
     * A string reflecting the aria-valueNow attribute, which defines the current value for a range widget.
     */
    get ariaValueNow(): string;
    /**
     * A string reflecting the aria-valueNow attribute, which defines the current value for a range widget.
     */
    set ariaValueNow(value: string);
    /**
     * A string reflecting the aria-valuetext attribute, which defines the human-readable text alternative of aria-valuenow for a range widget.
     */
    get ariaValueText(): string;
    /**
     * A string reflecting the aria-valuetext attribute, which defines the human-readable text alternative of aria-valuenow for a range widget.
     */
    set ariaValueText(value: string);
    /**
     * Inserts a set of Node objects or strings in the children list of the Element's parent, just after the Element.
     */
    after(...nodes: PseudoNode[]): void;
    /**
     * A shortcut method to create and run an animation on an element. Returns the created Animation object instance.
     */
    animate(keyframes: object[], options: {
        id: string;
        rangeEnd: string;
        rangeStart: string;
        timeline: string;
    }): PseudoAnimation;
    /**
     * Inserts a set of Node objects or strings after the last child of the element.
     */
    append(...params: PseudoNode[]): void;
    /**
     * Attaches a shadow DOM tree to the specified element and returns a reference to its ShadowRoot.
     */
    attachShadow(options: {
        mode: string;
        cloneable: boolean;
        delegatesFocus: boolean;
        slotAssignment: string;
    }): PseudoShadowRoot;
    /**
     * Inserts a set of Node objects or strings in the children list of the Element's parent, just before the Element.
     */
    before(...params: PseudoNode[]): void;
    /**
     * Returns whether an element is  expected to be visible or not based on configurable checks.
     */
    checkVisibility(): string;
    /**
     * Returns the Element which is the closest ancestor of the current element (or the current element itself) which matches the selectors given in parameter.
     */
    closest(): string;
    /**
     * Returns a StylePropertyMapReadOnly interface which provides a read-only representation of a CSS declaration block that is an alternative to CSSStyleDeclaration.
     */
    computedStyleMap(): string;
    /**
     * Returns an array of Animation objects currently active on the element.
     */
    getAnimations(): string;
    /**
     * Retrieves the value of the named attribute from the current node and returns it as a string.
     */
    getAttribute(): string;
    /**
     * Returns an array of attribute names from the current element.
     */
    getAttributeNames(): string;
    /**
     * Retrieves the node representation of the named attribute from the current node and returns it as an Attr.
     */
    getAttributeNode(): string;
    /**
     * Retrieves the node representation of the attribute with the specified name and namespace, from the current node and returns it as an Attr.
     */
    getAttributeNodeNS(): string;
    /**
     * Retrieves the value of the attribute with the specified namespace and name from the current node and returns it as a string.
     */
    getAttributeNS(): string;
    /**
     * Returns the size of an element and its position relative to the viewport.
     */
    getBoundingClientRect(): string;
    /**
     * Returns a collection of rectangles that indicate the bounding rectangles for each line of text in a client.
     */
    getClientRects(): string;
    /**
     * Returns a live HTMLCollection that contains all descendants of the current element that possess the list of classes given in the parameter.
     */
    getElementsByClassName(): string;
    /**
     * Returns a live HTMLCollection containing all descendant elements, of a particular tag name, from the current element.
     */
    getElementsByTagName(): string;
    /**
     * Returns a live HTMLCollection containing all descendant elements, of a particular tag name and namespace, from the current element.
     */
    getElementsByTagNameNS(): string;
    /**
     * Returns a boolean value indicating if the element has the specified attribute or not.
     */
    hasAttribute(): string;
    /**
     * Returns a boolean value indicating if the element has the specified attribute, in the specified namespace, or not.
     */
    hasAttributeNS(): string;
    /**
     * Returns a boolean value indicating if the element has one or more HTML attributes present.
     */
    hasAttributes(): string;
    /**
     * Indicates whether the element on which it is invoked has pointer capture for the pointer identified by the given pointer ID.
     */
    hasPointerCapture(): string;
    /**
     * Inserts a given element node at a given position relative to the element it is invoked upon.
     */
    insertAdjacentElement(): string;
    /**
     * Parses the text as HTML or XML and inserts the resulting nodes into the tree in the position given.
     */
    insertAdjacentHTML(): string;
    /**
     * Inserts a given text node at a given position relative to the element it is invoked upon.
     */
    insertAdjacentText(): string;
    /**
     * Returns a boolean value indicating whether or not the element would be selected by the specified selector string.
     */
    matches(): string;
    /**
     * Inserts a set of Node objects or strings before the first child of the element.
     */
    prepend(): string;
    /**
     * Returns the first Node which matches the specified selector string relative to the element.
     */
    querySelector(): string;
    /**
     * Returns a NodeList of nodes which match the specified selector string relative to the element.
     */
    querySelectorAll(): string;
    /**
     * Releases (stops) pointer capture that was previously set for a specific pointer event.
     */
    releasePointerCapture(): string;
    /**
     * Removes the element from the children list of its parent.
     */
    remove(): string;
    /**
     * Removes the named attribute from the current node.
     */
    removeAttribute(): string;
    /**
     * Removes the node representation of the named attribute from the current node.
     */
    removeAttributeNode(): string;
    /**
     * Removes the attribute with the specified name and namespace, from the current node.
     */
    removeAttributeNS(): string;
    /**
     * Replaces the existing children of a Node with a specified new set of children.
     */
    replaceChildren(): string;
    /**
     * Replaces the element in the children list of its parent with a set of Node objects or strings.
     */
    replaceWith(): string;
    /**
     * Asynchronously asks the browser to make the element fullscreen.
     */
    requestFullscreen(): string;
    /**
     * Allows to asynchronously ask for the pointer to be locked on the given element.
     */
    requestPointerLock(): string;
    /**
     * Scrolls to a particular set of coordinates inside a given element.
     */
    scroll(): string;
    /**
     * Scrolls an element by the given amount.
     */
    scrollBy(): string;
    /**
     * Scrolls the page until the element gets into the view.
     */
    scrollIntoView(): string;
    /**
     * Scrolls to a particular set of coordinates inside a given element.
     */
    scrollTo(): string;
    /**
     * Sets the value of a named attribute of the current node.
     */
    setAttribute(): string;
    /**
     * Sets the node representation of the named attribute from the current node.
     */
    setAttributeNode(): string;
    /**
     * Sets the node representation of the attribute with the specified name and namespace, from the current node.
     */
    setAttributeNodeNS(): string;
    /**
     * Sets the value of the attribute with the specified name and namespace, from the current node.
     */
    setAttributeNS(): string;
    /**
     * Designates a specific element as the capture target of future pointer events.
     */
    setPointerCapture(): string;
    /**
     * Toggles a boolean attribute, removing it if it is present and adding it if it is not present, on the specified element.
     */
    toggleAttribute(): string;
}

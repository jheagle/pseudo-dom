/**
 * Substitute for the DOM HTMLElement Class.
 */
import { PseudoHTMLElement } from '../interfaces/PseudoHTMLElement';
import { PseudoNode } from '../interfaces/PseudoNode';
import { NodeService } from './NodeService';
import { ElementService } from './ElementService';
import { CSSStyleDeclarationService } from './CSSStyleDeclarationService';
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
export declare class HTMLElementService extends ElementService implements Partial<PseudoHTMLElement> {
    private readonly styleDeclaration;
    private readonly datasetProxy;
    private dirtyValue;
    private dirtyChecked;
    /**
     * Simulate the HTMLElement object when the Dom is not available
     * @param elementOptions
     * @param elementOptions.tagName
     * @param elementOptions.parent
     * @param elementOptions.children
     */
    constructor({ tagName, parent, children }?: {
        tagName?: string;
        parent?: PseudoNode | null;
        children?: Array<any>;
    });
    /**
     * The element's inline styles: a live CSSStyleDeclaration-like object, so both style.setProperty('color', 'red')
     * and style.color = 'red' work.
     */
    get style(): CSSStyleDeclarationService;
    /**
     * The element's data-* attributes, live, under their camelCase names (data-foo-bar <-> dataset.fooBar). Backed
     * directly by getAttribute / setAttribute, so it is never out of sync with the attributes themselves.
     */
    get dataset(): {
        [key: string]: string;
    };
    /**
     * Whether this tag has a `value` (the form controls which do).
     */
    private hasValueProperty;
    /**
     * Whether this tag has a `checked` (only input does).
     */
    private hasCheckedProperty;
    /**
     * Put a plain own property on the element, as assigning a property this element does not have does in the DOM.
     * @param name
     * @param value
     */
    private setExpando;
    /**
     * The current value of a form control. Until it is set (or edited), it is the value attribute (the default value),
     * or '' when there is none ('on' for a checkbox or radio); setting it never changes the attribute, like the DOM's.
     * Only form controls (input, textarea, select, button, option, output) have one.
     */
    get value(): string | undefined;
    set value(value: string | undefined);
    /**
     * Whether a checkbox or radio input is checked. Until it is set, it follows the checked attribute (which sets the
     * default); setting it never changes the attribute, like the DOM's. Only input has one.
     */
    get checked(): boolean | undefined;
    set checked(checked: boolean | undefined);
    /**
     * Style is not attribute-backed like most properties (see the constructor), so cloneNode needs its own copy of it,
     * and a form control keeps its current value and checkedness (as the DOM's cloneNode does).
     */
    protected cloneShallow(): NodeService;
    /**
     * Style is not attribute-backed like most properties, so isEqualNode needs to compare it separately too.
     * @param other The node to compare with
     */
    protected equalsShallow(other: NodeService): boolean;
    /**
     * Parses html with this class building each new element (matches HTML: parsed elements behave like plain
     * HTMLElements, not whatever specialized class happens to be setting innerHTML / outerHTML).
     * @param html
     */
    private parse;
    /**
     * Replace this element's children by parsing html. innerHTML's setter is here rather than on ElementService (which
     * only has the getter) because building the new elements needs a concrete element class - see parse().
     * @param html
     */
    set innerHTML(html: string);
    get innerHTML(): string;
    /**
     * Replace this element itself, in its parent, by parsing html. Does nothing when it has no parent, like
     * replaceWith. outerHTML's setter is here rather than on ElementService for the same reason as innerHTML's.
     * @param html
     */
    set outerHTML(html: string);
    get outerHTML(): string;
    /**
     * Parse html and insert the resulting nodes at the given position, like insertAdjacentElement /
     * insertAdjacentText.
     * @param position beforebegin, afterbegin, beforeend or afterend
     * @param html The markup to parse
     * @throws {Error} When the position is not one of the four above
     */
    insertAdjacentHTML(position: string, html: string): void;
    /**
     * Whether this element can have the focus: form controls and links which are not disabled, and anything with a tabindex.
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

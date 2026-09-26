/**
 * Substitute for the DOM HTMLElement Class.
 */
import { PseudoHTMLElement } from '../interfaces/PseudoHTMLElement'
import { PseudoNode } from '../interfaces/PseudoNode'
import { NodeService } from './NodeService'
import { ElementService } from './ElementService'
import createEvent from '../factories/createEvent'
import { getActiveElement, setActiveElement } from '../functions/activeElement'
import { CSSStyleDeclarationService } from './CSSStyleDeclarationService'
import createStyleDeclaration from '../factories/createStyleDeclaration'
import createDataset from '../factories/createDataset'
import parseHTML from '../factories/parseHTML'

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
export class HTMLElementService extends ElementService implements Partial<PseudoHTMLElement> {
  private readonly styleDeclaration: CSSStyleDeclarationService
  private readonly datasetProxy: { [key: string]: string }
  private dirtyValue: string | null = null
  private dirtyChecked: boolean | null = null

  /**
   * Simulate the HTMLElement object when the Dom is not available
   * @param elementOptions
   * @param elementOptions.tagName
   * @param elementOptions.parent
   * @param elementOptions.children
   */
  constructor ({ tagName = '', parent = null, children = [] }: {
    tagName?: string;
    parent?: PseudoNode | null;
    children?: Array<any>
  } = {}) {
    super({
      tagName,
      attributes: [
        { name: 'hidden', value: false },
        { name: 'offsetHeight', value: 0 },
        { name: 'offsetLeft', value: 0 },
        { name: 'offsetParent', value: null },
        { name: 'offsetTop', value: 0 },
        { name: 'offsetWidth', value: 0 },
        { name: 'title', value: '' }
      ],
      parent,
      children
    })
    this.styleDeclaration = createStyleDeclaration()
    this.datasetProxy = createDataset(this)
  }

  /**
   * The element's inline styles: a live CSSStyleDeclaration-like object, so both style.setProperty('color', 'red')
   * and style.color = 'red' work.
   */
  get style (): CSSStyleDeclarationService {
    return this.styleDeclaration
  }

  /**
   * The element's data-* attributes, live, under their camelCase names (data-foo-bar <-> dataset.fooBar). Backed
   * directly by getAttribute / setAttribute, so it is never out of sync with the attributes themselves.
   */
  get dataset (): { [key: string]: string } {
    return this.datasetProxy
  }

  /**
   * Whether this tag has a `value` (the form controls which do).
   */
  private hasValueProperty (): boolean {
    return ['input', 'textarea', 'select', 'button', 'option', 'output'].indexOf(this.tagName.toLowerCase()) >= 0
  }

  /**
   * Whether this tag has a `checked` (only input does).
   */
  private hasCheckedProperty (): boolean {
    return this.tagName.toLowerCase() === 'input'
  }

  /**
   * Put a plain own property on the element, as assigning a property this element does not have does in the DOM.
   * @param name
   * @param value
   */
  private setExpando (name: string, value: any): void {
    Object.defineProperty(this, name, { value, writable: true, configurable: true, enumerable: true })
  }

  /**
   * The current value of a form control. Until it is set (or edited), it is the value attribute (the default value),
   * or '' when there is none ('on' for a checkbox or radio); setting it never changes the attribute, like the DOM's.
   * Only form controls (input, textarea, select, button, option, output) have one.
   */
  get value (): string | undefined {
    if (!this.hasValueProperty()) {
      return undefined
    }
    if (this.dirtyValue !== null) {
      return this.dirtyValue
    }
    const attribute: any = this.getAttribute('value')
    if (attribute !== null) {
      return String(attribute)
    }
    return this.tagName.toLowerCase() === 'input' && /^(checkbox|radio)$/i.test(String(this.getAttribute('type'))) ? 'on' : ''
  }

  set value (value: string | undefined) {
    if (this.hasValueProperty()) {
      this.dirtyValue = String(value)
    } else {
      this.setExpando('value', value)
    }
  }

  /**
   * Whether a checkbox or radio input is checked. Until it is set, it follows the checked attribute (which sets the
   * default); setting it never changes the attribute, like the DOM's. Only input has one.
   */
  get checked (): boolean | undefined {
    if (!this.hasCheckedProperty()) {
      return undefined
    }
    return this.dirtyChecked !== null ? this.dirtyChecked : this.hasAttribute('checked')
  }

  set checked (checked: boolean | undefined) {
    if (this.hasCheckedProperty()) {
      this.dirtyChecked = Boolean(checked)
    } else {
      this.setExpando('checked', checked)
    }
  }

  /**
   * Style is not attribute-backed like most properties (see the constructor), so cloneNode needs its own copy of it,
   * and a form control keeps its current value and checkedness (as the DOM's cloneNode does).
   */
  protected cloneShallow (): NodeService {
    const copy: HTMLElementService = super.cloneShallow() as HTMLElementService
    copy.style.cssText = this.style.cssText
    copy.dirtyValue = this.dirtyValue
    copy.dirtyChecked = this.dirtyChecked
    return copy
  }

  /**
   * Style is not attribute-backed like most properties, so isEqualNode needs to compare it separately too.
   * @param other The node to compare with
   */
  protected equalsShallow (other: NodeService): boolean {
    return super.equalsShallow(other) && this.style.cssText === (other as HTMLElementService).style.cssText
  }

  /**
   * Parses html with this class building each new element (matches HTML: parsed elements behave like plain
   * HTMLElements, not whatever specialized class happens to be setting innerHTML / outerHTML).
   * @param html
   */
  private parse (html: string): Array<any> {
    return parseHTML(html, this.ownerDocument, HTMLElementService)
  }

  /**
   * Replace this element's children by parsing html. innerHTML's setter is here rather than on ElementService (which
   * only has the getter) because building the new elements needs a concrete element class - see parse().
   * @param html
   */
  set innerHTML (html: string) {
    this.replaceChildren(...this.parse(html))
  }

  get innerHTML (): string {
    return super.innerHTML
  }

  /**
   * Replace this element itself, in its parent, by parsing html. Does nothing when it has no parent, like
   * replaceWith. outerHTML's setter is here rather than on ElementService for the same reason as innerHTML's.
   * @param html
   */
  set outerHTML (html: string) {
    this.replaceWith(...this.parse(html))
  }

  get outerHTML (): string {
    return super.outerHTML
  }

  /**
   * Parse html and insert the resulting nodes at the given position, like insertAdjacentElement /
   * insertAdjacentText.
   * @param position beforebegin, afterbegin, beforeend or afterend
   * @param html The markup to parse
   * @throws {Error} When the position is not one of the four above
   */
  insertAdjacentHTML (position: string, html: string): void {
    const nodes: Array<any> = this.parse(html)
    switch (position) {
      case 'beforebegin':
        this.before(...nodes)
        return
      case 'afterbegin':
        this.prepend(...nodes)
        return
      case 'beforeend':
        this.append(...nodes)
        return
      case 'afterend':
        this.after(...nodes)
        return
      default:
        throw new Error(`insertAdjacentHTML: "${position}" is not one of beforebegin, afterbegin, beforeend, afterend.`)
    }
  }

  /**
   * Whether this element can have the focus: form controls and links which are not disabled, and anything with a tabindex.
   */
  public get canFocus (): boolean {
    if (this.hasAttribute('disabled')) {
      return false
    }
    switch (this.tagName) {
      case 'button':
      case 'select':
      case 'textarea':
        return true
      case 'input':
        return String(this.getAttribute('type') || '').toLowerCase() !== 'hidden'
      case 'a':
        return this.hasAttribute('href') || this.hasAttribute('tabindex')
      default:
        return this.hasAttribute('tabindex')
    }
  }

  /**
   * Click the element: a click event is sent to it, which bubbles and can be cancelled, like one from a user but a
   * script made it (so it is not trusted). A disabled element does nothing.
   */
  public click (): void {
    if (this.hasAttribute('disabled')) {
      return
    }
    this.dispatchEvent(createEvent('click', {}, { browser: true }))
  }

  /**
   * Give the element the focus. The element which had it gets blur then focusout, and this one gets focus then
   * focusin (blur and focus do not bubble, focusin and focusout do). Nothing happens when the element cannot have the
   * focus or already has it.
   */
  public focus (): void {
    const root = this.getRootNode()
    const previous = getActiveElement(root)
    if (!this.canFocus || previous === this) {
      return
    }
    const send = (target: any, type: string, relatedTarget: any): void => {
      target.dispatchEvent(createEvent(type, { relatedTarget }, { browser: true, trusted: true }))
    }
    if (previous) {
      send(previous, 'blur', this)
      send(previous, 'focusout', this)
    }
    setActiveElement(root, this)
    send(this, 'focus', previous)
    send(this, 'focusin', previous)
  }

  /**
   * Take the focus away from the element, when it has it: it gets blur then focusout.
   */
  public blur (): void {
    const root = this.getRootNode()
    if (getActiveElement(root) !== this) {
      return
    }
    setActiveElement(root, null)
    this.dispatchEvent(createEvent('blur', { relatedTarget: null }, { browser: true, trusted: true }))
    this.dispatchEvent(createEvent('focusout', { relatedTarget: null }, { browser: true, trusted: true }))
  }
}

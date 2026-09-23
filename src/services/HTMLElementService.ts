/**
 * @file Substitute for the DOM HTMLElement Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
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
export class HTMLElementService extends ElementService implements Partial<PseudoHTMLElement> {
  private readonly styleDeclaration: CSSStyleDeclarationService
  private readonly datasetProxy: { [key: string]: string }

  /**
   * Simulate the HTMLElement object when the Dom is not available
   * @param {Object} [elementOptions={}]
   * @param {string} [elementOptions.tagName='']
   * @param {PseudoNode|Object} [elementOptions.parent={}]
   * @param {Array} [elementOptions.children=[]]
   * @constructor
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
   * @returns {CSSStyleDeclarationService}
   */
  get style (): CSSStyleDeclarationService {
    return this.styleDeclaration
  }

  /**
   * The element's data-* attributes, live, under their camelCase names (data-foo-bar <-> dataset.fooBar). Backed
   * directly by getAttribute / setAttribute, so it is never out of sync with the attributes themselves.
   * @returns {Object.<string, string>}
   */
  get dataset (): { [key: string]: string } {
    return this.datasetProxy
  }

  /**
   * Style is not attribute-backed like most properties (see the constructor), so cloneNode needs its own copy of it.
   * @returns {NodeService}
   */
  protected cloneShallow (): NodeService {
    const copy: HTMLElementService = super.cloneShallow() as HTMLElementService
    copy.style.cssText = this.style.cssText
    return copy
  }

  /**
   * Style is not attribute-backed like most properties, so isEqualNode needs to compare it separately too.
   * @param {NodeService} other The node to compare with
   * @returns {boolean}
   */
  protected equalsShallow (other: NodeService): boolean {
    return super.equalsShallow(other) && this.style.cssText === (other as HTMLElementService).style.cssText
  }

  /**
   * Whether this element can have the focus: form controls and links which are not disabled, and anything with a tabindex.
   * @returns {boolean}
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

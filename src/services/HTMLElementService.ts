/**
 * @file Substitute for the DOM HTMLElement Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoHTMLElement } from '../interfaces/PseudoHTMLElement'
import { PseudoNode } from '../interfaces/PseudoNode'
import { ElementService } from './ElementService'
import createEvent from '../factories/createEvent'
import { getActiveElement, setActiveElement } from '../functions/activeElement'

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
 * @property {Object} style - A container to define all applied inline-styles
 * @property {string} title - The title attribute which affects the text visible on hover
 */
export class HTMLElementService extends ElementService implements Partial<PseudoHTMLElement> {
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
        { name: 'style', value: {} },
        { name: 'title', value: '' }
      ],
      parent,
      children
    })
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

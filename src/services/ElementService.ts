/**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoNode } from '../interfaces/PseudoNode'
import { PseudoElement } from '../interfaces/PseudoElement'
import { EventService } from './EventService'
import createEvent from '../factories/createEvent'
import { NodeService } from './NodeService'
import { PseudoNamedNodeMap } from '../interfaces/PseudoNamedNodeMap'
import { PseudoDOMTokenList } from '../interfaces/PseudoDOMTokenList'
import { AttrService } from './AttrService'
import { DOMTokenListService } from './DOMTokenListService'
import { NamedNodeMapService } from './NamedNodeMapService'
import getParentNodesFromAttribute from '../functions/getParentNodesFromAttribute'
import { HTMLCollectionService } from './HTMLCollectionService'
import { PseudoHTMLCollection } from '../interfaces/PseudoHTMLCollection'
import cloneObject from 'si-funciona/dist/helpers/objects/cloneObject'
import isEqual from 'si-funciona/dist/helpers/objects/isEqual'
import { matches, closest } from '../factories/query'
import { ShadowRootService } from './ShadowRootService'
import { PseudoShadowRoot } from '../interfaces/PseudoShadowRoot'
import { serializeChildren, serializeOuter } from '../factories/serializeHTML'

type attribute = { name: string, value: any }
type DOMRect = { x: number, y: number, width: number, height: number, top: number, right: number, bottom: number, left: number }
const zeroRect = (): DOMRect => ({ x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 })

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
export class ElementService extends NodeService implements Partial<PseudoElement> {
  public id: string
  public type: string
  public clientHeight: number
  public clientLeft: number
  public clientTop: number
  public clientWidth: number
  public scrollHeight: number
  public scrollLeft: number
  public scrollTop: number
  public scrollWidth: number
  /** What getBoundingClientRect() returns - not really computed (there is no layout engine), set this directly. */
  public boundingClientRect: DOMRect = zeroRect()
  /** What getClientRects() returns - set this directly. */
  public clientRects: Array<DOMRect> = []
  /** What getAnimations() returns - set this directly. */
  public animations: Array<any> = []
  /** What checkVisibility() returns - set this directly. */
  public isVisible: boolean = true
  private readonly tag: string
  private readonly attributeList: Array<attribute>
  private readonly propertyAttributes: Array<string>
  private readonly tokenList: DOMTokenListService
  private readonly capturedPointers: Set<number> = new Set()
  private shadowRootInstance: ShadowRootService | null = null
  private defaultEventApplied: boolean = false

  /**
   * @param {Object} [settings={}]
   * @param {string} [settings.tagName=''] The name of the tag this element represents
   * @param {Array<{name: string, value: *}>} [settings.attributes=[]] The attributes (also assigned as properties) to start with
   * @param {PseudoNode|null} [settings.parent=null] The node to add this element to as its last child
   * @param {Array<PseudoNode>} [settings.children=[]] The nodes to start as children
   * @constructor
   */
  constructor ({ tagName = '', attributes = [], parent = null, children = [] }: {
    tagName?: string;
    attributes?: Array<attribute>;
    parent?: PseudoNode | null;
    children?: Array<any>
  } = {}) {
    super()
    this.tokenList = new DOMTokenListService()
    this.tag = tagName
    this.attributeList = attributes.concat([
      { name: 'className', value: '' },
      { name: 'id', value: '' },
      // Layout is not really computed (there is no rendering engine here): these start at 0, like an unrendered
      // element's would, but can be set directly to whatever a test needs code under test to see.
      { name: 'clientHeight', value: 0 },
      { name: 'clientLeft', value: 0 },
      { name: 'clientTop', value: 0 },
      { name: 'clientWidth', value: 0 },
      { name: 'scrollHeight', value: 0 },
      { name: 'scrollLeft', value: 0 },
      { name: 'scrollTop', value: 0 },
      { name: 'scrollWidth', value: 0 }
    ])
    this.propertyAttributes = this.attributeList.map(({ name }) => name)
    this.attributeList.forEach(({ name, value }) => {
      (this as any)[name] = value
    })
    children.forEach(child => {
      if (!child || typeof child.nodeType !== 'number') {
        throw new TypeError('The children of an element must be nodes.')
      }
      this.appendChild(child)
    })
    if (parent) {
      parent.appendChild(this)
    }
  }

  /**
   * The attributes with the values they have now: the ones which are also properties (className, id, style, ...) can
   * have been changed through the property, which does not change the stored list.
   * @returns {Array<{name: string, value: *}>}
   */
  private currentAttributes (): Array<attribute> {
    return this.attributeList.map(({ name, value }) => ({
      name,
      value: this.propertyAttributes.indexOf(name) >= 0 ? (this as any)[name] : value
    }))
  }

  get nodeName (): string {
    return this.tag
  }

  /**
   * A copy of this element without its children: the same tag and attributes (the values which are objects, such as
   * style, are copied too rather than shared), but not its parent or listeners.
   * @returns {ElementService}
   */
  protected cloneShallow (): NodeService {
    const copy: ElementService = new (this.constructor as any)({ tagName: this.tag })
    copy.attributeList.length = 0
    this.currentAttributes().forEach(({ name, value }) => {
      const copied: any = typeof value === 'object' && value !== null ? cloneObject(value) : value
      copy.attributeList.push({ name, value: copied })
      if (copy.propertyAttributes.indexOf(name) >= 0) {
        (copy as any)[name] = copied
      }
    })
    copy.ownerDocumentStore = this.ownerDocumentStore
    return copy
  }

  /**
   * Elements are equal when they have the same tag and the same attributes (in any order), which is what isEqualNode
   * checks before it compares the children.
   * @param {NodeService} other The element to compare with
   * @returns {boolean}
   */
  protected equalsShallow (other: NodeService): boolean {
    const mine: Array<attribute> = this.currentAttributes()
    const theirs: Array<attribute> = (other as ElementService).currentAttributes()
    return this.nodeName === other.nodeName &&
      mine.length === theirs.length &&
      mine.every(({ name, value }) => {
        const match: attribute | undefined = theirs.find(attributeOfOther => attributeOfOther.name === name)
        return typeof match !== 'undefined' && isEqual(value, match.value)
      })
  }

  get tagName (): string {
    return this.tag
  }

  /**
   * The local part of the element's qualified name. There is no real namespace parsing here, so this is always the
   * same as tagName.
   * @returns {string}
   */
  get localName (): string {
    return this.tag
  }

  /**
   * The element's namespace prefix, or null when it has none. There is no real namespace parsing here, so this is
   * always null.
   * @returns {string|null}
   */
  get prefix (): string | null {
    return null
  }

  /**
   * The HTML markup of this element's children. Only the getter is here (the setter, which needs to build new
   * elements from parsed HTML, is on HTMLElementService - see its class comment).
   * @returns {string}
   */
  get innerHTML (): string {
    return serializeChildren(this)
  }

  /**
   * The HTML markup of this element itself, including its children. Only the getter is here (see innerHTML).
   * @returns {string}
   */
  get outerHTML (): string {
    return serializeOuter(this)
  }

  get nodeType (): number {
    return NodeService.ELEMENT_NODE
  }

  get attributes (): PseudoNamedNodeMap {
    return new NamedNodeMapService(this.currentAttributes().map(({ name, value }) => new AttrService(name, String(value), this as unknown as PseudoElement)))
  }

  get classList (): PseudoDOMTokenList {
    return this.tokenList
  }

  get className (): string {
    return this.tokenList.value
  }

  set className (className: string) {
    this.tokenList.value = className
  }

  /**
   * Some elements have default behaviour, this registers it when the element is added.
   * @returns {Function}
   */
  /**
   * A live view of this element's element children (text, comments and the like are not included).
   * @returns {PseudoHTMLCollection}
   */
  get children (): PseudoHTMLCollection {
    return new HTMLCollectionService(this)
  }

  /**
   * How many element children this element has.
   * @returns {number}
   */
  get childElementCount (): number {
    return this.children.length
  }

  /**
   * The first child of this element which is an element, or null when there is none.
   * @returns {PseudoElement|null}
   */
  get firstElementChild (): PseudoElement | null {
    return this.children.item(0)
  }

  /**
   * The last child of this element which is an element, or null when there is none.
   * @returns {PseudoElement|null}
   */
  get lastElementChild (): PseudoElement | null {
    const elementChildren: PseudoHTMLCollection = this.children
    return elementChildren.item(elementChildren.length - 1)
  }

  /**
   * The sibling after this one which is an element, or null when there is none.
   * @returns {PseudoElement|null}
   */
  get nextElementSibling (): PseudoElement | null {
    let sibling: PseudoNode | null = this.nextSibling
    while (sibling && sibling.nodeType !== NodeService.ELEMENT_NODE) {
      sibling = sibling.nextSibling
    }
    return sibling as PseudoElement | null
  }

  /**
   * The sibling before this one which is an element, or null when there is none.
   * @returns {PseudoElement|null}
   */
  get previousElementSibling (): PseudoElement | null {
    let sibling: PseudoNode | null = this.previousSibling
    while (sibling && sibling.nodeType !== NodeService.ELEMENT_NODE) {
      sibling = sibling.previousSibling
    }
    return sibling as PseudoElement | null
  }

  /**
   * Put an element at a position relative to this one: beforebegin (before this element, as its previous sibling),
   * afterbegin (as this element's first child), beforeend (as this element's last child) or afterend (after this
   * element, as its next sibling).
   * @param {string} position beforebegin, afterbegin, beforeend or afterend
   * @param {ElementService} element The element to insert
   * @returns {ElementService|null} The inserted element, or null when the position needed a parent this element does not have
   * @throws {Error} When the position is not one of the four above
   */
  insertAdjacentElement (position: string, element: PseudoElement): PseudoElement | null {
    return this.insertAdjacent(position, element as unknown as PseudoNode) as PseudoElement | null
  }

  /**
   * Put text at a position relative to this element, the same as insertAdjacentElement but the text becomes a text node.
   * @param {string} position beforebegin, afterbegin, beforeend or afterend
   * @param {string} text The text to insert
   * @throws {Error} When the position is not one of the four above
   */
  insertAdjacentText (position: string, text: string): void {
    this.insertAdjacent(position, text)
  }

  /**
   * Shared implementation for insertAdjacentElement / insertAdjacentText.
   * @param {string} position beforebegin, afterbegin, beforeend or afterend
   * @param {PseudoNode|string} node The node (or text) to insert
   * @returns {PseudoNode|null} The inserted node, or null when the position needed a parent this element does not have
   * @throws {Error} When the position is not one of the four above
   */
  private insertAdjacent (position: string, node: PseudoNode | string): PseudoNode | null {
    switch (position) {
      case 'beforebegin':
        if (!this.parentNode) {
          return null
        }
        this.before(node)
        return node as PseudoNode
      case 'afterbegin':
        this.prepend(node)
        return node as PseudoNode
      case 'beforeend':
        this.append(node)
        return node as PseudoNode
      case 'afterend':
        if (!this.parentNode) {
          return null
        }
        this.after(node)
        return node as PseudoNode
      default:
        throw new Error(`"${position}" is not one of beforebegin, afterbegin, beforeend or afterend.`)
    }
  }

  /**
   * Not implemented yet (HTML parsing is out of scope for now).
   * @param {string} position beforebegin, afterbegin, beforeend or afterend
   * @param {string} text The markup which would be parsed
   * @throws {Error}
   */
  insertAdjacentHTML (position: string, text: string): void {
    throw new Error('ElementService.insertAdjacentHTML() is not implemented yet.')
  }

  /**
   * Whether this element itself (not its descendants) matches the given CSS selector.
   * @param {string} selectors A CSS selector
   * @returns {boolean}
   */
  matches (selectors: string): boolean {
    return matches(this, selectors)
  }

  /**
   * The nearest ancestor of this element (starting with this element itself) which matches the CSS selector, or
   * null when none of them do.
   * @param {string} selectors A CSS selector
   * @returns {PseudoElement|null}
   */
  closest (selectors: string): PseudoElement | null {
    return closest(this, selectors)
  }

  applyDefaultEvent (): Function {
    let callback: (event: EventService) => void = (event: EventService): undefined => undefined
    if (this.defaultEventApplied) {
      return callback
    }
    switch (this.tagName) {
      case 'button':
      case 'input':
        // Clicking a submit button submits the form it is in: the form gets a submit event, which can be cancelled
        callback = (event: EventService): void => {
          const type: string = String(this.getAttribute('type') || this.type || '').toLowerCase()
          const submits: boolean = this.tagName === 'button' ? type !== 'button' && type !== 'reset' : /^(submit|image)$/.test(type)
          const forms: Array<any> = getParentNodesFromAttribute('tagName', 'form', this)
          if (submits && forms.length && !this.hasAttribute('disabled')) {
            forms[forms.length - 1].dispatchEvent(createEvent('submit', {}, { browser: true, trusted: event.isTrusted }))
          }
        }
        super.setDefaultEvent('click', callback)
        this.defaultEventApplied = true
    }
    return callback
  }

  /**
   * An element which is added as a child gets its default events (for example a submit button submits its form).
   * @param {NodeService} child The node which was inserted
   */
  protected childInserted (child: NodeService): void {
    if (typeof (child as any).applyDefaultEvent === 'function') {
      (child as ElementService).applyDefaultEvent()
    }
  }

  /**
   * Check whether the element has an attribute by that name.
   * @param {string} attributeName
   * @returns {boolean}
   */
  hasAttribute (attributeName: string): boolean {
    return this.attributeList.some(({ name }) => name === attributeName)
  }

  /**
   * Set the value of an attribute, adding the attribute if it did not exist.
   * @param {string} attributeName
   * @param {string} attributeValue
   * @returns {undefined}
   */
  setAttribute (attributeName: string, attributeValue: string): void {
    const existing = this.attributeList.find(({ name }) => name === attributeName)
    if (existing) {
      existing.value = attributeValue
    } else {
      this.attributeList.push({ name: attributeName, value: attributeValue })
    }
    if (this.propertyAttributes.indexOf(attributeName) >= 0) {
      (this as any)[attributeName] = attributeValue
    }
  }

  /**
   * Retrieve the value of an attribute.
   * @param {string} attributeName
   * @returns {string|null} The value, or null when there is no such attribute
   */
  getAttribute (attributeName: string): string | null {
    const found = this.currentAttributes().find(({ name }) => name === attributeName)
    return found ? found.value : null
  }

  /**
   * Remove an attribute from the element.
   * @param {string} attributeName
   * @returns {undefined}
   */
  removeAttribute (attributeName: string): void {
    const index = this.attributeList.findIndex(({ name }) => name === attributeName)
    if (index >= 0) {
      this.attributeList.splice(index, 1)
    }
  }

  /**
   * The name of every attribute on the element, in the order they were set.
   * @returns {Array<string>}
   */
  getAttributeNames (): Array<string> {
    return this.currentAttributes().map(({ name }) => name)
  }

  /**
   * Whether the element has any attributes at all.
   * @returns {boolean}
   */
  hasAttributes (): boolean {
    return this.attributeList.length > 0
  }

  /**
   * Retrieve the node representation of an attribute.
   * @param {string} attributeName
   * @returns {AttrService|null} An Attr for the attribute, or null when there is no such attribute
   */
  getAttributeNode (attributeName: string): AttrService | null {
    return this.hasAttribute(attributeName)
      ? new AttrService(attributeName, this.getAttribute(attributeName) || '', this as unknown as PseudoElement)
      : null
  }

  /**
   * Retrieve the node representation of an attribute. There is no real namespace parsing here, so this ignores
   * the namespace and behaves exactly like getAttributeNode.
   * @param {string} namespace Ignored
   * @param {string} attributeName
   * @returns {AttrService|null} An Attr for the attribute, or null when there is no such attribute
   */
  getAttributeNodeNS (namespace: string, attributeName: string): AttrService | null {
    return this.getAttributeNode(attributeName)
  }

  /**
   * Retrieve the value of an attribute. There is no real namespace parsing here, so this ignores the namespace
   * and behaves exactly like getAttribute.
   * @param {string} namespace Ignored
   * @param {string} attributeName
   * @returns {string|null} The value, or null when there is no such attribute
   */
  getAttributeNS (namespace: string, attributeName: string): string | null {
    return this.getAttribute(attributeName)
  }

  /**
   * Check whether the element has an attribute by that name. There is no real namespace parsing here, so this
   * ignores the namespace and behaves exactly like hasAttribute.
   * @param {string} namespace Ignored
   * @param {string} attributeName
   * @returns {boolean}
   */
  hasAttributeNS (namespace: string, attributeName: string): boolean {
    return this.hasAttribute(attributeName)
  }

  /**
   * Remove the node representation of an attribute from the element, and return it.
   * @param {AttrService} attr
   * @returns {AttrService} The removed Attr
   * @throws {Error} When the element has no attribute matching attr.name
   */
  removeAttributeNode (attr: AttrService): AttrService {
    if (!this.hasAttribute(attr.name)) {
      throw new Error(`Failed to execute 'removeAttributeNode': The node provided is owned by another element (no attribute named '${attr.name}')`)
    }
    const removed = this.getAttributeNode(attr.name) as AttrService
    this.removeAttribute(attr.name)
    return removed
  }

  /**
   * Remove an attribute from the element. There is no real namespace parsing here, so this ignores the namespace
   * and behaves exactly like removeAttribute.
   * @param {string} namespace Ignored
   * @param {string} attributeName
   * @returns {undefined}
   */
  removeAttributeNS (namespace: string, attributeName: string): void {
    this.removeAttribute(attributeName)
  }

  /**
   * Set the node representation of an attribute, adding the attribute if it did not exist. Returns any previous
   * Attr that had the same name, or null when there was none.
   * @param {AttrService} attr
   * @returns {AttrService|null} The replaced Attr, or null when the attribute was new
   */
  setAttributeNode (attr: AttrService): AttrService | null {
    const existing = this.getAttributeNode(attr.name)
    this.setAttribute(attr.name, attr.value)
    return existing
  }

  /**
   * Set the node representation of an attribute. There is no real namespace parsing here, so this behaves
   * exactly like setAttributeNode (Attr.name already carries any prefix).
   * @param {AttrService} attr
   * @returns {AttrService|null} The replaced Attr, or null when the attribute was new
   */
  setAttributeNodeNS (attr: AttrService): AttrService | null {
    return this.setAttributeNode(attr)
  }

  /**
   * Set the value of an attribute, adding the attribute if it did not exist. There is no real namespace parsing
   * here, so this ignores the namespace and behaves exactly like setAttribute.
   * @param {string} namespace Ignored
   * @param {string} attributeName
   * @param {string} attributeValue
   * @returns {undefined}
   */
  setAttributeNS (namespace: string, attributeName: string, attributeValue: string): void {
    this.setAttribute(attributeName, attributeValue)
  }

  /**
   * Add the attribute (with an empty value) when it is not present, or remove it when it is - unless force says
   * which of those to do instead. Returns whether the attribute is present after the call.
   * @param {string} attributeName
   * @param {boolean} [force]
   * @returns {boolean}
   */
  toggleAttribute (attributeName: string, force?: boolean): boolean {
    const present: boolean = this.hasAttribute(attributeName)
    const shouldHave: boolean = typeof force === 'boolean' ? force : !present
    if (shouldHave && !present) {
      this.setAttribute(attributeName, '')
    } else if (!shouldHave && present) {
      this.removeAttribute(attributeName)
    }
    return shouldHave
  }

  /**
   * The size of the element and its position, settable directly - there is no layout engine here to compute it.
   * @returns {DOMRect}
   */
  getBoundingClientRect (): DOMRect {
    return this.boundingClientRect
  }

  /**
   * The bounding rectangles for each line of text in the element, settable directly - there is no layout engine
   * here to compute it.
   * @returns {Array<DOMRect>}
   */
  getClientRects (): Array<DOMRect> {
    return this.clientRects
  }

  /**
   * The Animation objects currently active on the element, settable directly - there is no animation engine here.
   * @returns {Array<*>}
   */
  getAnimations (): Array<any> {
    return this.animations
  }

  /**
   * Whether the element is expected to be visible, settable directly - there is no rendering here to check it.
   * @returns {boolean}
   */
  checkVisibility (): boolean {
    return this.isVisible
  }

  /**
   * A read-only view of the element's own inline style declarations (there is no CSS cascade here, so this is not a
   * real computed style - just what the element's own style object holds).
   * @returns {{get: function(string): (string|undefined)}}
   */
  computedStyleMap (): { get: (property: string) => string | undefined } {
    const style: any = (this as any).style
    return {
      get: (property: string): string | undefined => {
        const value: string = style ? style.getPropertyValue(property) : ''
        return value === '' ? undefined : value
      }
    }
  }

  /**
   * Whether this element currently has capture of the given pointer.
   * @param {number} pointerId
   * @returns {boolean}
   */
  hasPointerCapture (pointerId: number): boolean {
    return this.capturedPointers.has(pointerId)
  }

  /**
   * Give this element capture of the given pointer.
   * @param {number} pointerId
   * @returns {undefined}
   */
  setPointerCapture (pointerId: number): void {
    this.capturedPointers.add(pointerId)
  }

  /**
   * Release this element's capture of the given pointer, if it had it.
   * @param {number} pointerId
   * @returns {undefined}
   */
  releasePointerCapture (pointerId: number): void {
    this.capturedPointers.delete(pointerId)
  }

  /**
   * Scroll to the given position (or, given an options object, the position(s) it has). There is no real scrollable
   * viewport here: this just sets scrollLeft / scrollTop.
   * @param {number|{left: number, top: number}} [x=0]
   * @param {number} [y=0]
   * @returns {undefined}
   */
  scroll (x: number | { left?: number, top?: number } = 0, y: number = 0): void {
    if (typeof x === 'number') {
      this.scrollLeft = x
      this.scrollTop = y
      return
    }
    if (typeof x.left === 'number') {
      this.scrollLeft = x.left
    }
    if (typeof x.top === 'number') {
      this.scrollTop = x.top
    }
  }

  /**
   * Scroll to the given position. An alias for scroll.
   * @param {number|{left: number, top: number}} [x=0]
   * @param {number} [y=0]
   * @returns {undefined}
   */
  scrollTo (x: number | { left?: number, top?: number } = 0, y: number = 0): void {
    this.scroll(x, y)
  }

  /**
   * Scroll by the given amount, relative to the current position.
   * @param {number|{left: number, top: number}} [x=0]
   * @param {number} [y=0]
   * @returns {undefined}
   */
  scrollBy (x: number | { left?: number, top?: number } = 0, y: number = 0): void {
    if (typeof x === 'number') {
      this.scroll(this.scrollLeft + x, this.scrollTop + y)
      return
    }
    this.scroll({
      left: this.scrollLeft + (x.left || 0),
      top: this.scrollTop + (x.top || 0)
    })
  }

  /**
   * Scroll an ancestor until this element is in view. There is no real viewport here for that to mean anything, so
   * this does nothing (override it on an instance in a test which needs to observe the call).
   * @returns {undefined}
   */
  scrollIntoView (): void {}

  /**
   * Asynchronously ask for the element to be shown fullscreen. There is no real fullscreen here, so this just
   * resolves, like a browser granting the request would.
   * @returns {Promise<void>}
   */
  requestFullscreen (): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Asynchronously ask for the pointer to be locked to this element. There is no real pointer lock here, so this
   * just resolves, like a browser granting the request would.
   * @returns {Promise<void>}
   */
  requestPointerLock (): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Attach a shadow tree to this element and return its ShadowRoot. Throws when it already hosts one.
   * @param {{mode: string}} options
   * @returns {PseudoShadowRoot}
   * @throws {Error}
   */
  attachShadow (options: { mode: string }): PseudoShadowRoot {
    if (this.shadowRootInstance) {
      throw new Error('Shadow root cannot be created on a host which already hosts a shadow tree.')
    }
    const root: ShadowRootService = new ShadowRootService()
    ;(root as any).host = this
    ;(root as any).mode = options.mode
    this.shadowRootInstance = root
    return root
  }

  /**
   * This element's shadow root, when it has one attached in 'open' mode, or null (including when the mode is
   * 'closed' - it still exists, but is not reachable this way, like the DOM's).
   * @returns {PseudoShadowRoot|null}
   */
  get shadowRoot (): PseudoShadowRoot | null {
    return this.shadowRootInstance && this.shadowRootInstance.mode === 'open' ? this.shadowRootInstance : null
  }

  /**
   * Read one of the aria-* reflected properties (see the individual aria* getters/setters below).
   * @param {string} attributeName A real aria-* attribute name (aria-label, ...)
   * @returns {string}
   */
  private getAriaAttribute (attributeName: string): string {
    return this.getAttribute(attributeName) || ''
  }

  /**
   * Write one of the aria-* reflected properties.
   * @param {string} attributeName A real aria-* attribute name (aria-label, ...)
   * @param {string} value
   * @returns {undefined}
   */
  private setAriaAttribute (attributeName: string, value: string): void {
    this.setAttribute(attributeName, value)
  }

  get ariaAtomic (): string {
    return this.getAriaAttribute('aria-atomic')
  }

  set ariaAtomic (value: string) {
    this.setAriaAttribute('aria-atomic', value)
  }

  get ariaAutoComplete (): string {
    return this.getAriaAttribute('aria-autocomplete')
  }

  set ariaAutoComplete (value: string) {
    this.setAriaAttribute('aria-autocomplete', value)
  }

  get ariaBusy (): string {
    return this.getAriaAttribute('aria-busy')
  }

  set ariaBusy (value: string) {
    this.setAriaAttribute('aria-busy', value)
  }

  get ariaChecked (): string {
    return this.getAriaAttribute('aria-checked')
  }

  set ariaChecked (value: string) {
    this.setAriaAttribute('aria-checked', value)
  }

  get ariaColCount (): string {
    return this.getAriaAttribute('aria-colcount')
  }

  set ariaColCount (value: string) {
    this.setAriaAttribute('aria-colcount', value)
  }

  get ariaColIndex (): string {
    return this.getAriaAttribute('aria-colindex')
  }

  set ariaColIndex (value: string) {
    this.setAriaAttribute('aria-colindex', value)
  }

  get ariaColSpan (): string {
    return this.getAriaAttribute('aria-colspan')
  }

  set ariaColSpan (value: string) {
    this.setAriaAttribute('aria-colspan', value)
  }

  get ariaCurrent (): string {
    return this.getAriaAttribute('aria-current')
  }

  set ariaCurrent (value: string) {
    this.setAriaAttribute('aria-current', value)
  }

  get ariaDescription (): string {
    return this.getAriaAttribute('aria-description')
  }

  set ariaDescription (value: string) {
    this.setAriaAttribute('aria-description', value)
  }

  get ariaDisabled (): string {
    return this.getAriaAttribute('aria-disabled')
  }

  set ariaDisabled (value: string) {
    this.setAriaAttribute('aria-disabled', value)
  }

  get ariaExpanded (): string {
    return this.getAriaAttribute('aria-expanded')
  }

  set ariaExpanded (value: string) {
    this.setAriaAttribute('aria-expanded', value)
  }

  get ariaHasPopup (): string {
    return this.getAriaAttribute('aria-haspopup')
  }

  set ariaHasPopup (value: string) {
    this.setAriaAttribute('aria-haspopup', value)
  }

  get ariaHidden (): string {
    return this.getAriaAttribute('aria-hidden')
  }

  set ariaHidden (value: string) {
    this.setAriaAttribute('aria-hidden', value)
  }

  get ariaKeyShortcuts (): string {
    return this.getAriaAttribute('aria-keyshortcuts')
  }

  set ariaKeyShortcuts (value: string) {
    this.setAriaAttribute('aria-keyshortcuts', value)
  }

  get ariaLabel (): string {
    return this.getAriaAttribute('aria-label')
  }

  set ariaLabel (value: string) {
    this.setAriaAttribute('aria-label', value)
  }

  get ariaLevel (): string {
    return this.getAriaAttribute('aria-level')
  }

  set ariaLevel (value: string) {
    this.setAriaAttribute('aria-level', value)
  }

  get ariaLive (): string {
    return this.getAriaAttribute('aria-live')
  }

  set ariaLive (value: string) {
    this.setAriaAttribute('aria-live', value)
  }

  get ariaModal (): string {
    return this.getAriaAttribute('aria-modal')
  }

  set ariaModal (value: string) {
    this.setAriaAttribute('aria-modal', value)
  }

  get ariaMultiline (): string {
    return this.getAriaAttribute('aria-multiline')
  }

  set ariaMultiline (value: string) {
    this.setAriaAttribute('aria-multiline', value)
  }

  get ariaMultiSelectable (): string {
    return this.getAriaAttribute('aria-multiselectable')
  }

  set ariaMultiSelectable (value: string) {
    this.setAriaAttribute('aria-multiselectable', value)
  }

  get ariaOrientation (): string {
    return this.getAriaAttribute('aria-orientation')
  }

  set ariaOrientation (value: string) {
    this.setAriaAttribute('aria-orientation', value)
  }

  get ariaPlaceholder (): string {
    return this.getAriaAttribute('aria-placeholder')
  }

  set ariaPlaceholder (value: string) {
    this.setAriaAttribute('aria-placeholder', value)
  }

  get ariaPosInSet (): string {
    return this.getAriaAttribute('aria-posinset')
  }

  set ariaPosInSet (value: string) {
    this.setAriaAttribute('aria-posinset', value)
  }

  get ariaPressed (): string {
    return this.getAriaAttribute('aria-pressed')
  }

  set ariaPressed (value: string) {
    this.setAriaAttribute('aria-pressed', value)
  }

  get ariaReadOnly (): string {
    return this.getAriaAttribute('aria-readonly')
  }

  set ariaReadOnly (value: string) {
    this.setAriaAttribute('aria-readonly', value)
  }

  get ariaRequired (): string {
    return this.getAriaAttribute('aria-required')
  }

  set ariaRequired (value: string) {
    this.setAriaAttribute('aria-required', value)
  }

  get ariaRoleDescription (): string {
    return this.getAriaAttribute('aria-roledescription')
  }

  set ariaRoleDescription (value: string) {
    this.setAriaAttribute('aria-roledescription', value)
  }

  get ariaRowCount (): string {
    return this.getAriaAttribute('aria-rowcount')
  }

  set ariaRowCount (value: string) {
    this.setAriaAttribute('aria-rowcount', value)
  }

  get ariaRowIndex (): string {
    return this.getAriaAttribute('aria-rowindex')
  }

  set ariaRowIndex (value: string) {
    this.setAriaAttribute('aria-rowindex', value)
  }

  get ariaRowSpan (): string {
    return this.getAriaAttribute('aria-rowspan')
  }

  set ariaRowSpan (value: string) {
    this.setAriaAttribute('aria-rowspan', value)
  }

  get ariaSelected (): string {
    return this.getAriaAttribute('aria-selected')
  }

  set ariaSelected (value: string) {
    this.setAriaAttribute('aria-selected', value)
  }

  get ariaSetSize (): string {
    return this.getAriaAttribute('aria-setsize')
  }

  set ariaSetSize (value: string) {
    this.setAriaAttribute('aria-setsize', value)
  }

  get ariaSort (): string {
    return this.getAriaAttribute('aria-sort')
  }

  set ariaSort (value: string) {
    this.setAriaAttribute('aria-sort', value)
  }

  get ariaValueMax (): string {
    return this.getAriaAttribute('aria-valuemax')
  }

  set ariaValueMax (value: string) {
    this.setAriaAttribute('aria-valuemax', value)
  }

  get ariaValueMin (): string {
    return this.getAriaAttribute('aria-valuemin')
  }

  set ariaValueMin (value: string) {
    this.setAriaAttribute('aria-valuemin', value)
  }

  get ariaValueNow (): string {
    return this.getAriaAttribute('aria-valuenow')
  }

  set ariaValueNow (value: string) {
    this.setAriaAttribute('aria-valuenow', value)
  }

  get ariaValueText (): string {
    return this.getAriaAttribute('aria-valuetext')
  }

  set ariaValueText (value: string) {
    this.setAriaAttribute('aria-valuetext', value)
  }
}

'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.every.js')
require('core-js/modules/esnext.iterator.find.js')
require('core-js/modules/esnext.iterator.for-each.js')
require('core-js/modules/esnext.iterator.map.js')
require('core-js/modules/esnext.iterator.some.js')
require('core-js/modules/esnext.set.add-all.js')
require('core-js/modules/esnext.set.delete-all.js')
require('core-js/modules/esnext.set.difference.js')
require('core-js/modules/esnext.set.every.js')
require('core-js/modules/esnext.set.filter.js')
require('core-js/modules/esnext.set.find.js')
require('core-js/modules/esnext.set.intersection.js')
require('core-js/modules/esnext.set.is-disjoint-from.js')
require('core-js/modules/esnext.set.is-subset-of.js')
require('core-js/modules/esnext.set.is-superset-of.js')
require('core-js/modules/esnext.set.join.js')
require('core-js/modules/esnext.set.map.js')
require('core-js/modules/esnext.set.reduce.js')
require('core-js/modules/esnext.set.some.js')
require('core-js/modules/esnext.set.symmetric-difference.js')
require('core-js/modules/esnext.set.union.js')
const __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule
    ? mod
    : {
        default: mod
      }
}
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.ElementService = void 0
const createEvent_1 = __importDefault(require('../factories/createEvent'))
const NodeService_1 = require('./NodeService')
const AttrService_1 = require('./AttrService')
const DOMTokenListService_1 = require('./DOMTokenListService')
const NamedNodeMapService_1 = require('./NamedNodeMapService')
const getParentNodesFromAttribute_1 = __importDefault(require('../functions/getParentNodesFromAttribute'))
const HTMLCollectionService_1 = require('./HTMLCollectionService')
const cloneObject_1 = __importDefault(require('si-funciona/dist/helpers/objects/cloneObject'))
const isEqual_1 = __importDefault(require('si-funciona/dist/helpers/objects/isEqual'))
const query_1 = require('../factories/query')
const ShadowRootService_1 = require('./ShadowRootService')
const serializeHTML_1 = require('../factories/serializeHTML')
const zeroRect = () => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
})
/**
 * Simulate the behaviour of the Element Class when there is no DOM available.
 */
class ElementService extends NodeService_1.NodeService {
  /**
   * @param settings
   * @param settings.tagName The name of the tag this element represents
   * @param settings.attributes The attributes (also assigned as properties) to start with
   * @param settings.parent The node to add this element to as its last child
   * @param settings.children The nodes to start as children
   */
  constructor ({
    tagName = '',
    attributes = [],
    parent = null,
    children = []
  } = {}) {
    super()
    /** What getBoundingClientRect() returns - not really computed (there is no layout engine), set this directly. */
    this.boundingClientRect = zeroRect()
    /** What getClientRects() returns - set this directly. */
    this.clientRects = []
    /** What getAnimations() returns - set this directly. */
    this.animations = []
    /** What checkVisibility() returns - set this directly. */
    this.isVisible = true
    this.capturedPointers = new Set()
    this.shadowRootInstance = null
    this.defaultEventApplied = false
    this.tokenList = new DOMTokenListService_1.DOMTokenListService()
    this.tag = tagName
    this.attributeList = attributes.concat([{
      name: 'className',
      value: ''
    }, {
      name: 'id',
      value: ''
    },
    // Layout is not really computed (there is no rendering engine here): these start at 0, like an unrendered
    // element's would, but can be set directly to whatever a test needs code under test to see.
    {
      name: 'clientHeight',
      value: 0
    }, {
      name: 'clientLeft',
      value: 0
    }, {
      name: 'clientTop',
      value: 0
    }, {
      name: 'clientWidth',
      value: 0
    }, {
      name: 'scrollHeight',
      value: 0
    }, {
      name: 'scrollLeft',
      value: 0
    }, {
      name: 'scrollTop',
      value: 0
    }, {
      name: 'scrollWidth',
      value: 0
    }])
    this.propertyAttributes = this.attributeList.map(({
      name
    }) => name)
    this.attributeList.forEach(({
      name,
      value
    }) => {
      this[name] = value
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
   */
  currentAttributes () {
    return this.attributeList.map(({
      name,
      value
    }) => ({
      name,
      value: this.propertyAttributes.indexOf(name) >= 0 ? this[name] : value
    }))
  }

  get nodeName () {
    return this.tag
  }

  /**
   * A copy of this element without its children: the same tag and attributes (the values which are objects, such as
   * style, are copied too rather than shared), but not its parent or listeners.
   */
  cloneShallow () {
    const copy = new this.constructor({
      tagName: this.tag
    })
    copy.attributeList.length = 0
    this.currentAttributes().forEach(({
      name,
      value
    }) => {
      const copied = typeof value === 'object' && value !== null ? (0, cloneObject_1.default)(value) : value
      copy.attributeList.push({
        name,
        value: copied
      })
      if (copy.propertyAttributes.indexOf(name) >= 0) {
        copy[name] = copied
      }
    })
    copy.ownerDocumentStore = this.ownerDocumentStore
    return copy
  }

  /**
   * Elements are equal when they have the same tag and the same attributes (in any order), which is what isEqualNode
   * checks before it compares the children.
   * @param other The element to compare with
   */
  equalsShallow (other) {
    const mine = this.currentAttributes()
    const theirs = other.currentAttributes()
    return this.nodeName === other.nodeName && mine.length === theirs.length && mine.every(({
      name,
      value
    }) => {
      const match = theirs.find(attributeOfOther => attributeOfOther.name === name)
      return typeof match !== 'undefined' && (0, isEqual_1.default)(value, match.value)
    })
  }

  get tagName () {
    return this.tag
  }

  /**
   * The local part of the element's qualified name. There is no real namespace parsing here, so this is always the
   * same as tagName.
   */
  get localName () {
    return this.tag
  }

  /**
   * The element's namespace prefix, or null when it has none. There is no real namespace parsing here, so this is
   * always null.
   */
  get prefix () {
    return null
  }

  /**
   * The HTML markup of this element's children. Only the getter is here (the setter, which needs to build new
   * elements from parsed HTML, is on HTMLElementService - see its class comment).
   */
  get innerHTML () {
    return (0, serializeHTML_1.serializeChildren)(this)
  }

  /**
   * The HTML markup of this element itself, including its children. Only the getter is here (see innerHTML).
   */
  get outerHTML () {
    return (0, serializeHTML_1.serializeOuter)(this)
  }

  get nodeType () {
    return NodeService_1.NodeService.ELEMENT_NODE
  }

  get attributes () {
    return new NamedNodeMapService_1.NamedNodeMapService(this.currentAttributes().map(({
      name,
      value
    }) => new AttrService_1.AttrService(name, String(value), this)))
  }

  get classList () {
    return this.tokenList
  }

  get className () {
    return this.tokenList.value
  }

  set className (className) {
    this.tokenList.value = className
  }

  /**
   * Some elements have default behaviour, this registers it when the element is added.
   */
  /**
   * A live view of this element's element children (text, comments and the like are not included).
   */
  get children () {
    return new HTMLCollectionService_1.HTMLCollectionService(this)
  }

  /**
   * How many element children this element has.
   */
  get childElementCount () {
    return this.children.length
  }

  /**
   * The first child of this element which is an element, or null when there is none.
   */
  get firstElementChild () {
    return this.children.item(0)
  }

  /**
   * The last child of this element which is an element, or null when there is none.
   */
  get lastElementChild () {
    const elementChildren = this.children
    return elementChildren.item(elementChildren.length - 1)
  }

  /**
   * The sibling after this one which is an element, or null when there is none.
   */
  get nextElementSibling () {
    let sibling = this.nextSibling
    while (sibling && sibling.nodeType !== NodeService_1.NodeService.ELEMENT_NODE) {
      sibling = sibling.nextSibling
    }
    return sibling
  }

  /**
   * The sibling before this one which is an element, or null when there is none.
   */
  get previousElementSibling () {
    let sibling = this.previousSibling
    while (sibling && sibling.nodeType !== NodeService_1.NodeService.ELEMENT_NODE) {
      sibling = sibling.previousSibling
    }
    return sibling
  }

  /**
   * Put an element at a position relative to this one: beforebegin (before this element, as its previous sibling),
   * afterbegin (as this element's first child), beforeend (as this element's last child) or afterend (after this
   * element, as its next sibling).
   * @param position beforebegin, afterbegin, beforeend or afterend
   * @param element The element to insert
   * @returns The inserted element, or null when the position needed a parent this element does not have
   * @throws {Error} When the position is not one of the four above
   */
  insertAdjacentElement (position, element) {
    return this.insertAdjacent(position, element)
  }

  /**
   * Put text at a position relative to this element, the same as insertAdjacentElement but the text becomes a text node.
   * @param position beforebegin, afterbegin, beforeend or afterend
   * @param text The text to insert
   * @throws {Error} When the position is not one of the four above
   */
  insertAdjacentText (position, text) {
    this.insertAdjacent(position, text)
  }

  /**
   * Shared implementation for insertAdjacentElement / insertAdjacentText.
   * @param position beforebegin, afterbegin, beforeend or afterend
   * @param node The node (or text) to insert
   * @returns The inserted node, or null when the position needed a parent this element does not have
   * @throws {Error} When the position is not one of the four above
   */
  insertAdjacent (position, node) {
    switch (position) {
      case 'beforebegin':
        if (!this.parentNode) {
          return null
        }
        this.before(node)
        return node
      case 'afterbegin':
        this.prepend(node)
        return node
      case 'beforeend':
        this.append(node)
        return node
      case 'afterend':
        if (!this.parentNode) {
          return null
        }
        this.after(node)
        return node
      default:
        throw new Error(`"${position}" is not one of beforebegin, afterbegin, beforeend or afterend.`)
    }
  }

  /**
   * Not implemented yet (HTML parsing is out of scope for now).
   * @param position beforebegin, afterbegin, beforeend or afterend
   * @param text The markup which would be parsed
   * @throws {Error}
   */
  insertAdjacentHTML (position, text) {
    throw new Error('ElementService.insertAdjacentHTML() is not implemented yet.')
  }

  /**
   * Whether this element itself (not its descendants) matches the given CSS selector.
   * @param selectors A CSS selector
   */
  matches (selectors) {
    return (0, query_1.matches)(this, selectors)
  }

  /**
   * The nearest ancestor of this element (starting with this element itself) which matches the CSS selector, or
   * null when none of them do.
   * @param selectors A CSS selector
   */
  closest (selectors) {
    return (0, query_1.closest)(this, selectors)
  }

  applyDefaultEvent () {
    let callback = event => undefined
    if (this.defaultEventApplied) {
      return callback
    }
    switch (this.tagName) {
      case 'button':
      case 'input':
        // Clicking a submit button submits the form it is in: the form gets a submit event, which can be cancelled
        callback = event => {
          const type = String(this.getAttribute('type') || this.type || '').toLowerCase()
          const submits = this.tagName === 'button' ? type !== 'button' && type !== 'reset' : /^(submit|image)$/.test(type)
          const forms = (0, getParentNodesFromAttribute_1.default)('tagName', 'form', this)
          if (submits && forms.length && !this.hasAttribute('disabled')) {
            forms[forms.length - 1].dispatchEvent((0, createEvent_1.default)('submit', {}, {
              browser: true,
              trusted: event.isTrusted
            }))
          }
        }
        super.setDefaultEvent('click', callback)
        this.defaultEventApplied = true
    }
    return callback
  }

  /**
   * An element which is added as a child gets its default events (for example a submit button submits its form).
   * @param child The node which was inserted
   */
  childInserted (child) {
    if (typeof child.applyDefaultEvent === 'function') {
      child.applyDefaultEvent()
    }
  }

  /**
   * Check whether the element has an attribute by that name.
   * @param attributeName
   */
  hasAttribute (attributeName) {
    return this.attributeList.some(({
      name
    }) => name === attributeName)
  }

  /**
   * Set the value of an attribute, adding the attribute if it did not exist.
   * @param attributeName
   * @param attributeValue
   */
  setAttribute (attributeName, attributeValue) {
    const existing = this.attributeList.find(({
      name
    }) => name === attributeName)
    if (existing) {
      existing.value = attributeValue
    } else {
      this.attributeList.push({
        name: attributeName,
        value: attributeValue
      })
    }
    if (this.propertyAttributes.indexOf(attributeName) >= 0) {
      this[attributeName] = attributeValue
    }
  }

  /**
   * Retrieve the value of an attribute.
   * @param attributeName
   * @returns The value, or null when there is no such attribute
   */
  getAttribute (attributeName) {
    const found = this.currentAttributes().find(({
      name
    }) => name === attributeName)
    return found ? found.value : null
  }

  /**
   * Remove an attribute from the element.
   * @param attributeName
   */
  removeAttribute (attributeName) {
    const index = this.attributeList.findIndex(({
      name
    }) => name === attributeName)
    if (index >= 0) {
      this.attributeList.splice(index, 1)
    }
  }

  /**
   * The name of every attribute on the element, in the order they were set.
   */
  getAttributeNames () {
    return this.currentAttributes().map(({
      name
    }) => name)
  }

  /**
   * Whether the element has any attributes at all.
   */
  hasAttributes () {
    return this.attributeList.length > 0
  }

  /**
   * Retrieve the node representation of an attribute.
   * @param attributeName
   * @returns An Attr for the attribute, or null when there is no such attribute
   */
  getAttributeNode (attributeName) {
    return this.hasAttribute(attributeName) ? new AttrService_1.AttrService(attributeName, this.getAttribute(attributeName) || '', this) : null
  }

  /**
   * Retrieve the node representation of an attribute. There is no real namespace parsing here, so this ignores
   * the namespace and behaves exactly like getAttributeNode.
   * @param namespace Ignored
   * @param attributeName
   * @returns An Attr for the attribute, or null when there is no such attribute
   */
  getAttributeNodeNS (namespace, attributeName) {
    return this.getAttributeNode(attributeName)
  }

  /**
   * Retrieve the value of an attribute. There is no real namespace parsing here, so this ignores the namespace
   * and behaves exactly like getAttribute.
   * @param namespace Ignored
   * @param attributeName
   * @returns The value, or null when there is no such attribute
   */
  getAttributeNS (namespace, attributeName) {
    return this.getAttribute(attributeName)
  }

  /**
   * Check whether the element has an attribute by that name. There is no real namespace parsing here, so this
   * ignores the namespace and behaves exactly like hasAttribute.
   * @param namespace Ignored
   * @param attributeName
   */
  hasAttributeNS (namespace, attributeName) {
    return this.hasAttribute(attributeName)
  }

  /**
   * Remove the node representation of an attribute from the element, and return it.
   * @param attr
   * @returns The removed Attr
   * @throws {Error} When the element has no attribute matching attr.name
   */
  removeAttributeNode (attr) {
    if (!this.hasAttribute(attr.name)) {
      throw new Error(`Failed to execute 'removeAttributeNode': The node provided is owned by another element (no attribute named '${attr.name}')`)
    }
    const removed = this.getAttributeNode(attr.name)
    this.removeAttribute(attr.name)
    return removed
  }

  /**
   * Remove an attribute from the element. There is no real namespace parsing here, so this ignores the namespace
   * and behaves exactly like removeAttribute.
   * @param namespace Ignored
   * @param attributeName
   */
  removeAttributeNS (namespace, attributeName) {
    this.removeAttribute(attributeName)
  }

  /**
   * Set the node representation of an attribute, adding the attribute if it did not exist. Returns any previous
   * Attr that had the same name, or null when there was none.
   * @param attr
   * @returns The replaced Attr, or null when the attribute was new
   */
  setAttributeNode (attr) {
    const existing = this.getAttributeNode(attr.name)
    this.setAttribute(attr.name, attr.value)
    return existing
  }

  /**
   * Set the node representation of an attribute. There is no real namespace parsing here, so this behaves
   * exactly like setAttributeNode (Attr.name already carries any prefix).
   * @param attr
   * @returns The replaced Attr, or null when the attribute was new
   */
  setAttributeNodeNS (attr) {
    return this.setAttributeNode(attr)
  }

  /**
   * Set the value of an attribute, adding the attribute if it did not exist. There is no real namespace parsing
   * here, so this ignores the namespace and behaves exactly like setAttribute.
   * @param namespace Ignored
   * @param attributeName
   * @param attributeValue
   */
  setAttributeNS (namespace, attributeName, attributeValue) {
    this.setAttribute(attributeName, attributeValue)
  }

  /**
   * Add the attribute (with an empty value) when it is not present, or remove it when it is - unless force says
   * which of those to do instead. Returns whether the attribute is present after the call.
   * @param attributeName
   * @param force
   */
  toggleAttribute (attributeName, force) {
    const present = this.hasAttribute(attributeName)
    const shouldHave = typeof force === 'boolean' ? force : !present
    if (shouldHave && !present) {
      this.setAttribute(attributeName, '')
    } else if (!shouldHave && present) {
      this.removeAttribute(attributeName)
    }
    return shouldHave
  }

  /**
   * The size of the element and its position, settable directly - there is no layout engine here to compute it.
   */
  getBoundingClientRect () {
    return this.boundingClientRect
  }

  /**
   * The bounding rectangles for each line of text in the element, settable directly - there is no layout engine
   * here to compute it.
   */
  getClientRects () {
    return this.clientRects
  }

  /**
   * The Animation objects currently active on the element, settable directly - there is no animation engine here.
   */
  getAnimations () {
    return this.animations
  }

  /**
   * Whether the element is expected to be visible, settable directly - there is no rendering here to check it.
   */
  checkVisibility () {
    return this.isVisible
  }

  /**
   * A read-only view of the element's own inline style declarations (there is no CSS cascade here, so this is not a
   * real computed style - just what the element's own style object holds).
   */
  computedStyleMap () {
    const style = this.style
    return {
      get: property => {
        const value = style ? style.getPropertyValue(property) : ''
        return value === '' ? undefined : value
      }
    }
  }

  /**
   * Whether this element currently has capture of the given pointer.
   * @param pointerId
   */
  hasPointerCapture (pointerId) {
    return this.capturedPointers.has(pointerId)
  }

  /**
   * Give this element capture of the given pointer.
   * @param pointerId
   */
  setPointerCapture (pointerId) {
    this.capturedPointers.add(pointerId)
  }

  /**
   * Release this element's capture of the given pointer, if it had it.
   * @param pointerId
   */
  releasePointerCapture (pointerId) {
    this.capturedPointers.delete(pointerId)
  }

  /**
   * Scroll to the given position (or, given an options object, the position(s) it has). There is no real scrollable
   * viewport here: this just sets scrollLeft / scrollTop.
   * @param x
   * @param y
   */
  scroll (x = 0, y = 0) {
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
   * @param x
   * @param y
   */
  scrollTo (x = 0, y = 0) {
    this.scroll(x, y)
  }

  /**
   * Scroll by the given amount, relative to the current position.
   * @param x
   * @param y
   */
  scrollBy (x = 0, y = 0) {
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
   */
  scrollIntoView () {}
  /**
   * Asynchronously ask for the element to be shown fullscreen. There is no real fullscreen here, so this just
   * resolves, like a browser granting the request would.
   */
  requestFullscreen () {
    return Promise.resolve()
  }

  /**
   * Asynchronously ask for the pointer to be locked to this element. There is no real pointer lock here, so this
   * just resolves, like a browser granting the request would.
   */
  requestPointerLock () {
    return Promise.resolve()
  }

  /**
   * Attach a shadow tree to this element and return its ShadowRoot. Throws when it already hosts one.
   * @param options
   * @throws {Error}
   */
  attachShadow (options) {
    if (this.shadowRootInstance) {
      throw new Error('Shadow root cannot be created on a host which already hosts a shadow tree.')
    }
    const root = new ShadowRootService_1.ShadowRootService()
    root.host = this
    root.mode = options.mode
    this.shadowRootInstance = root
    return root
  }

  /**
   * This element's shadow root, when it has one attached in 'open' mode, or null (including when the mode is
   * 'closed' - it still exists, but is not reachable this way, like the DOM's).
   */
  get shadowRoot () {
    return this.shadowRootInstance && this.shadowRootInstance.mode === 'open' ? this.shadowRootInstance : null
  }

  /**
   * Read one of the aria-* reflected properties (see the individual aria* getters/setters below).
   * @param attributeName A real aria-* attribute name (aria-label, ...)
   */
  getAriaAttribute (attributeName) {
    return this.getAttribute(attributeName) || ''
  }

  /**
   * Write one of the aria-* reflected properties.
   * @param attributeName A real aria-* attribute name (aria-label, ...)
   * @param value
   */
  setAriaAttribute (attributeName, value) {
    this.setAttribute(attributeName, value)
  }

  get ariaAtomic () {
    return this.getAriaAttribute('aria-atomic')
  }

  set ariaAtomic (value) {
    this.setAriaAttribute('aria-atomic', value)
  }

  get ariaAutoComplete () {
    return this.getAriaAttribute('aria-autocomplete')
  }

  set ariaAutoComplete (value) {
    this.setAriaAttribute('aria-autocomplete', value)
  }

  get ariaBusy () {
    return this.getAriaAttribute('aria-busy')
  }

  set ariaBusy (value) {
    this.setAriaAttribute('aria-busy', value)
  }

  get ariaChecked () {
    return this.getAriaAttribute('aria-checked')
  }

  set ariaChecked (value) {
    this.setAriaAttribute('aria-checked', value)
  }

  get ariaColCount () {
    return this.getAriaAttribute('aria-colcount')
  }

  set ariaColCount (value) {
    this.setAriaAttribute('aria-colcount', value)
  }

  get ariaColIndex () {
    return this.getAriaAttribute('aria-colindex')
  }

  set ariaColIndex (value) {
    this.setAriaAttribute('aria-colindex', value)
  }

  get ariaColSpan () {
    return this.getAriaAttribute('aria-colspan')
  }

  set ariaColSpan (value) {
    this.setAriaAttribute('aria-colspan', value)
  }

  get ariaCurrent () {
    return this.getAriaAttribute('aria-current')
  }

  set ariaCurrent (value) {
    this.setAriaAttribute('aria-current', value)
  }

  get ariaDescription () {
    return this.getAriaAttribute('aria-description')
  }

  set ariaDescription (value) {
    this.setAriaAttribute('aria-description', value)
  }

  get ariaDisabled () {
    return this.getAriaAttribute('aria-disabled')
  }

  set ariaDisabled (value) {
    this.setAriaAttribute('aria-disabled', value)
  }

  get ariaExpanded () {
    return this.getAriaAttribute('aria-expanded')
  }

  set ariaExpanded (value) {
    this.setAriaAttribute('aria-expanded', value)
  }

  get ariaHasPopup () {
    return this.getAriaAttribute('aria-haspopup')
  }

  set ariaHasPopup (value) {
    this.setAriaAttribute('aria-haspopup', value)
  }

  get ariaHidden () {
    return this.getAriaAttribute('aria-hidden')
  }

  set ariaHidden (value) {
    this.setAriaAttribute('aria-hidden', value)
  }

  get ariaKeyShortcuts () {
    return this.getAriaAttribute('aria-keyshortcuts')
  }

  set ariaKeyShortcuts (value) {
    this.setAriaAttribute('aria-keyshortcuts', value)
  }

  get ariaLabel () {
    return this.getAriaAttribute('aria-label')
  }

  set ariaLabel (value) {
    this.setAriaAttribute('aria-label', value)
  }

  get ariaLevel () {
    return this.getAriaAttribute('aria-level')
  }

  set ariaLevel (value) {
    this.setAriaAttribute('aria-level', value)
  }

  get ariaLive () {
    return this.getAriaAttribute('aria-live')
  }

  set ariaLive (value) {
    this.setAriaAttribute('aria-live', value)
  }

  get ariaModal () {
    return this.getAriaAttribute('aria-modal')
  }

  set ariaModal (value) {
    this.setAriaAttribute('aria-modal', value)
  }

  get ariaMultiline () {
    return this.getAriaAttribute('aria-multiline')
  }

  set ariaMultiline (value) {
    this.setAriaAttribute('aria-multiline', value)
  }

  get ariaMultiSelectable () {
    return this.getAriaAttribute('aria-multiselectable')
  }

  set ariaMultiSelectable (value) {
    this.setAriaAttribute('aria-multiselectable', value)
  }

  get ariaOrientation () {
    return this.getAriaAttribute('aria-orientation')
  }

  set ariaOrientation (value) {
    this.setAriaAttribute('aria-orientation', value)
  }

  get ariaPlaceholder () {
    return this.getAriaAttribute('aria-placeholder')
  }

  set ariaPlaceholder (value) {
    this.setAriaAttribute('aria-placeholder', value)
  }

  get ariaPosInSet () {
    return this.getAriaAttribute('aria-posinset')
  }

  set ariaPosInSet (value) {
    this.setAriaAttribute('aria-posinset', value)
  }

  get ariaPressed () {
    return this.getAriaAttribute('aria-pressed')
  }

  set ariaPressed (value) {
    this.setAriaAttribute('aria-pressed', value)
  }

  get ariaReadOnly () {
    return this.getAriaAttribute('aria-readonly')
  }

  set ariaReadOnly (value) {
    this.setAriaAttribute('aria-readonly', value)
  }

  get ariaRequired () {
    return this.getAriaAttribute('aria-required')
  }

  set ariaRequired (value) {
    this.setAriaAttribute('aria-required', value)
  }

  get ariaRoleDescription () {
    return this.getAriaAttribute('aria-roledescription')
  }

  set ariaRoleDescription (value) {
    this.setAriaAttribute('aria-roledescription', value)
  }

  get ariaRowCount () {
    return this.getAriaAttribute('aria-rowcount')
  }

  set ariaRowCount (value) {
    this.setAriaAttribute('aria-rowcount', value)
  }

  get ariaRowIndex () {
    return this.getAriaAttribute('aria-rowindex')
  }

  set ariaRowIndex (value) {
    this.setAriaAttribute('aria-rowindex', value)
  }

  get ariaRowSpan () {
    return this.getAriaAttribute('aria-rowspan')
  }

  set ariaRowSpan (value) {
    this.setAriaAttribute('aria-rowspan', value)
  }

  get ariaSelected () {
    return this.getAriaAttribute('aria-selected')
  }

  set ariaSelected (value) {
    this.setAriaAttribute('aria-selected', value)
  }

  get ariaSetSize () {
    return this.getAriaAttribute('aria-setsize')
  }

  set ariaSetSize (value) {
    this.setAriaAttribute('aria-setsize', value)
  }

  get ariaSort () {
    return this.getAriaAttribute('aria-sort')
  }

  set ariaSort (value) {
    this.setAriaAttribute('aria-sort', value)
  }

  get ariaValueMax () {
    return this.getAriaAttribute('aria-valuemax')
  }

  set ariaValueMax (value) {
    this.setAriaAttribute('aria-valuemax', value)
  }

  get ariaValueMin () {
    return this.getAriaAttribute('aria-valuemin')
  }

  set ariaValueMin (value) {
    this.setAriaAttribute('aria-valuemin', value)
  }

  get ariaValueNow () {
    return this.getAriaAttribute('aria-valuenow')
  }

  set ariaValueNow (value) {
    this.setAriaAttribute('aria-valuenow', value)
  }

  get ariaValueText () {
    return this.getAriaAttribute('aria-valuetext')
  }

  set ariaValueText (value) {
    this.setAriaAttribute('aria-valuetext', value)
  }
}
exports.ElementService = ElementService

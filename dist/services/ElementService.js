'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.every.js')
require('core-js/modules/esnext.iterator.find.js')
require('core-js/modules/esnext.iterator.for-each.js')
require('core-js/modules/esnext.iterator.map.js')
require('core-js/modules/esnext.iterator.some.js')
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
const cloneObject_1 = __importDefault(require('si-funciona/dist/helpers/objects/cloneObject'))
const isEqual_1 = __importDefault(require('si-funciona/dist/helpers/objects/isEqual'))
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
class ElementService extends NodeService_1.NodeService {
  /**
   * @param {Object} [settings={}]
   * @param {string} [settings.tagName=''] The name of the tag this element represents
   * @param {Array<{name: string, value: *}>} [settings.attributes=[]] The attributes (also assigned as properties) to start with
   * @param {PseudoNode|null} [settings.parent=null] The node to add this element to as its last child
   * @param {Array<PseudoNode>} [settings.children=[]] The nodes to start as children
   * @constructor
   */
  constructor ({
    tagName = '',
    attributes = [],
    parent = null,
    children = []
  } = {}) {
    super()
    this.defaultEventApplied = false
    this.tokenList = new DOMTokenListService_1.DOMTokenListService()
    this.tag = tagName
    this.attributeList = attributes.concat([{
      name: 'className',
      value: ''
    }, {
      name: 'id',
      value: ''
    }, {
      name: 'innerHTML',
      value: ''
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
   * @returns {Array<{name: string, value: *}>}
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
   * @returns {ElementService}
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
   * @param {NodeService} other The element to compare with
   * @returns {boolean}
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
   * @returns {Function}
   */
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
   * @param {NodeService} child The node which was inserted
   */
  childInserted (child) {
    if (typeof child.applyDefaultEvent === 'function') {
      child.applyDefaultEvent()
    }
  }

  /**
   * Check whether the element has an attribute by that name.
   * @param {string} attributeName
   * @returns {boolean}
   */
  hasAttribute (attributeName) {
    return this.attributeList.some(({
      name
    }) => name === attributeName)
  }

  /**
   * Set the value of an attribute, adding the attribute if it did not exist.
   * @param {string} attributeName
   * @param {string} attributeValue
   * @returns {undefined}
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
   * @param {string} attributeName
   * @returns {string|null} The value, or null when there is no such attribute
   */
  getAttribute (attributeName) {
    const found = this.currentAttributes().find(({
      name
    }) => name === attributeName)
    return found ? found.value : null
  }

  /**
   * Remove an attribute from the element.
   * @param {string} attributeName
   * @returns {undefined}
   */
  removeAttribute (attributeName) {
    const index = this.attributeList.findIndex(({
      name
    }) => name === attributeName)
    if (index >= 0) {
      this.attributeList.splice(index, 1)
    }
  }
}
exports.ElementService = ElementService

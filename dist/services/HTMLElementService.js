'use strict'

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
exports.HTMLElementService = void 0
const ElementService_1 = require('./ElementService')
const createEvent_1 = __importDefault(require('../factories/createEvent'))
const activeElement_1 = require('../functions/activeElement')
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
class HTMLElementService extends ElementService_1.ElementService {
  /**
   * Simulate the HTMLElement object when the Dom is not available
   * @param {Object} [elementOptions={}]
   * @param {string} [elementOptions.tagName='']
   * @param {PseudoNode|Object} [elementOptions.parent={}]
   * @param {Array} [elementOptions.children=[]]
   * @constructor
   */
  constructor ({
    tagName = '',
    parent = null,
    children = []
  } = {}) {
    super({
      tagName,
      attributes: [{
        name: 'hidden',
        value: false
      }, {
        name: 'offsetHeight',
        value: 0
      }, {
        name: 'offsetLeft',
        value: 0
      }, {
        name: 'offsetParent',
        value: null
      }, {
        name: 'offsetTop',
        value: 0
      }, {
        name: 'offsetWidth',
        value: 0
      }, {
        name: 'style',
        value: {}
      }, {
        name: 'title',
        value: ''
      }],
      parent,
      children
    })
  }

  /**
   * Whether this element can have the focus: form controls and links which are not disabled, and anything with a tabindex.
   * @returns {boolean}
   */
  get canFocus () {
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
  click () {
    if (this.hasAttribute('disabled')) {
      return
    }
    this.dispatchEvent((0, createEvent_1.default)('click', {}, {
      browser: true
    }))
  }

  /**
   * Give the element the focus. The element which had it gets blur then focusout, and this one gets focus then
   * focusin (blur and focus do not bubble, focusin and focusout do). Nothing happens when the element cannot have the
   * focus or already has it.
   */
  focus () {
    const root = this.getRootNode()
    const previous = (0, activeElement_1.getActiveElement)(root)
    if (!this.canFocus || previous === this) {
      return
    }
    const send = (target, type, relatedTarget) => {
      target.dispatchEvent((0, createEvent_1.default)(type, {
        relatedTarget
      }, {
        browser: true,
        trusted: true
      }))
    }
    if (previous) {
      send(previous, 'blur', this)
      send(previous, 'focusout', this)
    }
    (0, activeElement_1.setActiveElement)(root, this)
    send(this, 'focus', previous)
    send(this, 'focusin', previous)
  }

  /**
   * Take the focus away from the element, when it has it: it gets blur then focusout.
   */
  blur () {
    const root = this.getRootNode()
    if ((0, activeElement_1.getActiveElement)(root) !== this) {
      return
    }
    (0, activeElement_1.setActiveElement)(root, null)
    this.dispatchEvent((0, createEvent_1.default)('blur', {
      relatedTarget: null
    }, {
      browser: true,
      trusted: true
    }))
    this.dispatchEvent((0, createEvent_1.default)('focusout', {
      relatedTarget: null
    }, {
      browser: true,
      trusted: true
    }))
  }
}
exports.HTMLElementService = HTMLElementService

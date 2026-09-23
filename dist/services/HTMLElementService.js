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
const createStyleDeclaration_1 = __importDefault(require('../factories/createStyleDeclaration'))
const createDataset_1 = __importDefault(require('../factories/createDataset'))
const parseHTML_1 = __importDefault(require('../factories/parseHTML'))
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
        name: 'title',
        value: ''
      }],
      parent,
      children
    })
    this.styleDeclaration = (0, createStyleDeclaration_1.default)()
    this.datasetProxy = (0, createDataset_1.default)(this)
  }

  /**
   * The element's inline styles: a live CSSStyleDeclaration-like object, so both style.setProperty('color', 'red')
   * and style.color = 'red' work.
   * @returns {CSSStyleDeclarationService}
   */
  get style () {
    return this.styleDeclaration
  }

  /**
   * The element's data-* attributes, live, under their camelCase names (data-foo-bar <-> dataset.fooBar). Backed
   * directly by getAttribute / setAttribute, so it is never out of sync with the attributes themselves.
   * @returns {Object.<string, string>}
   */
  get dataset () {
    return this.datasetProxy
  }

  /**
   * Style is not attribute-backed like most properties (see the constructor), so cloneNode needs its own copy of it.
   * @returns {NodeService}
   */
  cloneShallow () {
    const copy = super.cloneShallow()
    copy.style.cssText = this.style.cssText
    return copy
  }

  /**
   * Style is not attribute-backed like most properties, so isEqualNode needs to compare it separately too.
   * @param {NodeService} other The node to compare with
   * @returns {boolean}
   */
  equalsShallow (other) {
    return super.equalsShallow(other) && this.style.cssText === other.style.cssText
  }

  /**
   * Parses html with this class building each new element (matches HTML: parsed elements behave like plain
   * HTMLElements, not whatever specialized class happens to be setting innerHTML / outerHTML).
   * @param {string} html
   * @returns {Array<*>}
   */
  parse (html) {
    return (0, parseHTML_1.default)(html, this.ownerDocument, HTMLElementService)
  }

  /**
   * Replace this element's children by parsing html. innerHTML's setter is here rather than on ElementService (which
   * only has the getter) because building the new elements needs a concrete element class - see parse().
   * @param {string} html
   * @returns {undefined}
   */
  set innerHTML (html) {
    this.replaceChildren(...this.parse(html))
  }

  get innerHTML () {
    return super.innerHTML
  }

  /**
   * Replace this element itself, in its parent, by parsing html. Does nothing when it has no parent, like
   * replaceWith. outerHTML's setter is here rather than on ElementService for the same reason as innerHTML's.
   * @param {string} html
   * @returns {undefined}
   */
  set outerHTML (html) {
    this.replaceWith(...this.parse(html))
  }

  get outerHTML () {
    return super.outerHTML
  }

  /**
   * Parse html and insert the resulting nodes at the given position, like insertAdjacentElement /
   * insertAdjacentText.
   * @param {string} position beforebegin, afterbegin, beforeend or afterend
   * @param {string} html The markup to parse
   * @returns {undefined}
   * @throws {Error} When the position is not one of the four above
   */
  insertAdjacentHTML (position, html) {
    const nodes = this.parse(html)
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

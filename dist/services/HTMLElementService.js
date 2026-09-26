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
 *
 * It also has these simple properties, which are stored as attributes:
 * - `hidden`: state of whether the element is visible
 * - `title`: the title attribute, which affects the text visible on hover
 * - `offsetHeight`, `offsetWidth`: the height and width of the element as offset by the parent element
 * - `offsetLeft`, `offsetTop`: the position of the left and top sides of the element based on the parent element
 * - `offsetParent`: a reference to the closest positioned parent element
 */
class HTMLElementService extends ElementService_1.ElementService {
  /**
   * Simulate the HTMLElement object when the Dom is not available
   * @param elementOptions
   * @param elementOptions.tagName
   * @param elementOptions.parent
   * @param elementOptions.children
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
    this.dirtyValue = null
    this.dirtyChecked = null
    this.styleDeclaration = (0, createStyleDeclaration_1.default)()
    this.datasetProxy = (0, createDataset_1.default)(this)
  }

  /**
   * The element's inline styles: a live CSSStyleDeclaration-like object, so both style.setProperty('color', 'red')
   * and style.color = 'red' work.
   */
  get style () {
    return this.styleDeclaration
  }

  /**
   * The element's data-* attributes, live, under their camelCase names (data-foo-bar <-> dataset.fooBar). Backed
   * directly by getAttribute / setAttribute, so it is never out of sync with the attributes themselves.
   */
  get dataset () {
    return this.datasetProxy
  }

  /**
   * Whether this tag has a `value` (the form controls which do).
   */
  hasValueProperty () {
    return ['input', 'textarea', 'select', 'button', 'option', 'output'].indexOf(this.tagName.toLowerCase()) >= 0
  }

  /**
   * Whether this tag has a `checked` (only input does).
   */
  hasCheckedProperty () {
    return this.tagName.toLowerCase() === 'input'
  }

  /**
   * Put a plain own property on the element, as assigning a property this element does not have does in the DOM.
   * @param name
   * @param value
   */
  setExpando (name, value) {
    Object.defineProperty(this, name, {
      value,
      writable: true,
      configurable: true,
      enumerable: true
    })
  }

  /**
   * The current value of a form control. Until it is set (or edited), it is the value attribute (the default value),
   * or '' when there is none ('on' for a checkbox or radio); setting it never changes the attribute, like the DOM's.
   * Only form controls (input, textarea, select, button, option, output) have one.
   */
  get value () {
    if (!this.hasValueProperty()) {
      return undefined
    }
    if (this.dirtyValue !== null) {
      return this.dirtyValue
    }
    const attribute = this.getAttribute('value')
    if (attribute !== null) {
      return String(attribute)
    }
    return this.tagName.toLowerCase() === 'input' && /^(checkbox|radio)$/i.test(String(this.getAttribute('type'))) ? 'on' : ''
  }

  set value (value) {
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
  get checked () {
    if (!this.hasCheckedProperty()) {
      return undefined
    }
    return this.dirtyChecked !== null ? this.dirtyChecked : this.hasAttribute('checked')
  }

  set checked (checked) {
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
  cloneShallow () {
    const copy = super.cloneShallow()
    copy.style.cssText = this.style.cssText
    copy.dirtyValue = this.dirtyValue
    copy.dirtyChecked = this.dirtyChecked
    return copy
  }

  /**
   * Style is not attribute-backed like most properties, so isEqualNode needs to compare it separately too.
   * @param other The node to compare with
   */
  equalsShallow (other) {
    return super.equalsShallow(other) && this.style.cssText === other.style.cssText
  }

  /**
   * Parses html with this class building each new element (matches HTML: parsed elements behave like plain
   * HTMLElements, not whatever specialized class happens to be setting innerHTML / outerHTML).
   * @param html
   */
  parse (html) {
    return (0, parseHTML_1.default)(html, this.ownerDocument, HTMLElementService)
  }

  /**
   * Replace this element's children by parsing html. innerHTML's setter is here rather than on ElementService (which
   * only has the getter) because building the new elements needs a concrete element class - see parse().
   * @param html
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
   * @param html
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
   * @param position beforebegin, afterbegin, beforeend or afterend
   * @param html The markup to parse
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

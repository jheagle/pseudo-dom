(function () { function r (e, n, t) { function o (i, f) { if (!n[i]) { if (!e[i]) { const c = typeof require === 'function' && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); const a = new Error("Cannot find module '" + i + "'"); throw a.code = 'MODULE_NOT_FOUND', a } const p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { const n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = typeof require === 'function' && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    /**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const EventService_1 = require('../services/EventService')
    /**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventType
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
    class PseudoEventListener {
      /**
   * @param {string} eventType The type of event this listens for
   * @param {Object} [options] The capture, once and passive options
   * @param {Function} handleEvent The function which is called with the event, already bound to what it should run as
   * @param {Function} [originalCallback=handleEvent] The function (or object) which was given when registering, used to find this listener again
   * @constructor
   */
      constructor (eventType, {
        capture = false,
        once = false,
        passive = false
      } = {}, handleEvent, originalCallback = handleEvent) {
        this.eventOptions = {
          capture: false,
          once: false,
          passive: false
        }
        this.eventType = ''
        this.defaultListener = false
        this.isRemoved = false
        this.eventOptions = {
          capture,
          once,
          passive
        }
        this.eventType = eventType
        this.handler = handleEvent
        this.originalCallback = originalCallback
      }

      /**
   * The function (or object with handleEvent) which was originally given when registering, used to find this listener again for removal.
   */
      get callback () {
        return this.originalCallback
      }

      /** Whether this listener listens in the capture phase (and at the target) rather than in the bubble phase. */
      get capture () {
        return this.eventOptions.capture
      }

      get isDefault () {
        return this.defaultListener
      }

      get once () {
        return this.eventOptions.once
      }

      /** Whether the listener promises not to prevent the default (preventDefault does nothing while it runs). */
      get passive () {
        return this.eventOptions.passive
      }

      /** Whether this listener has been removed, a removed listener does not run even if the event already started. */
      get removed () {
        return this.isRemoved
      }

      set removed (removed) {
        this.isRemoved = removed
      }

      /**
   * @method
   * @name PseudoEventListener#handleEvent
   * @param {PseudoEvent} event
   * @returns {*}
   */
      handleEvent (event) {
        return this.handler(event)
      }

      /**
   * A capture listener runs while the event travels down to the target.
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doCapturePhase (event) {
        return event.eventPhase === EventService_1.EventService.CAPTURING_PHASE && this.eventOptions.capture
      }

      /**
   * Every listener of the target itself runs, capture listeners first.
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doTargetPhase (event) {
        return event.eventPhase === EventService_1.EventService.AT_TARGET
      }

      /**
   * A listener which is not a capture listener runs while the event travels back up (when it bubbles).
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doBubblePhase (event) {
        return event.eventPhase === EventService_1.EventService.BUBBLING_PHASE && !this.eventOptions.capture
      }

      /**
   * @method
   * @name PseudoEventListener#skipPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      skipPhase (event) {
        return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
      }

      /**
   * Whether this listener should not run for the event as it is now (it was removed, or it is for another phase).
   * Stopping propagation is handled by the dispatching, since it stops other targets and not the listeners of the
   * current one.
   * @method
   * @name PseudoEventListener#rejectEvent
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      rejectEvent (event) {
        return this.isRemoved || this.skipPhase(event)
      }
    }
    exports.default = PseudoEventListener
  }, { '../services/EventService': 29 }],
  2: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.find.js')
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    const DocumentService_1 = require('../services/DocumentService')
    /**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available. Like the real HTMLDocument, this
 * only adds the html/head/body structure on top of what Document already gives (createElement, createTextNode,
 * createComment, createDocumentFragment, getElementById, textContent always null).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments DocumentService
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 */
    class PseudoHTMLDocument extends DocumentService_1.DocumentService {
      /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @constructor
   */
      constructor () {
        super()
        const html = this.createElement('html')
        this.appendChild(html)
        /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */
        this.head = this.createElement('head')
        html.appendChild(this.head)
        /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */
        this.body = this.createElement('body')
        html.appendChild(this.body)
      }

      /**
   * A copy of this document with none of its html/head/body (cloneNode, from the inherited cloneShallow hook, fills
   * them back in, deep copies own document's, empty otherwise - see cloneNode).
   * @returns {PseudoHTMLDocument}
   */
      cloneShallow () {
        const copy = new this.constructor()
        while (copy.firstChild) {
          copy.removeChild(copy.firstChild)
        }
        copy.head = null
        copy.body = null
        return copy
      }

      /**
   * Make a copy of this document. The copy has no parent or listeners, and a deep copy has copies of everything in
   * the document (a shallow one is an empty document).
   * @param {boolean} [deep=false] Copy everything in the document as well
   * @returns {PseudoHTMLDocument}
   */
      cloneNode (deep = false) {
        const copy = super.cloneNode(deep)
        if (deep) {
          const html = Array.from(copy.childNodes).find(child => child.tagName === 'html')
          const inHtml = tagName => html ? Array.from(html.childNodes).find(child => child.tagName === tagName) || null : null
          copy.head = inHtml('head')
          copy.body = inHtml('body')
        }
        return copy
      }
    }
    exports.default = PseudoHTMLDocument
  }, { '../services/DocumentService': 27, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.find.js': 196 }],
  3: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.map.js')
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.PseudoNodeList = void 0
    /**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const LinkedTreeList_1 = require('collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList')
    /**
 * A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
 * the linkers that hold them.
 * @class
 * @augments LinkedTreeList
 */
    class PseudoNodeList extends LinkedTreeList_1.LinkedTreeList {
      /**
   * Iterate over the nodes in this list.
   * @returns {Iterator}
   */
      [Symbol.iterator] () {
        // Walk the nodes of this list only (the linkers of a child list have no children of their own)
        let current = this.first
        return {
          next: () => {
            if (current === null) {
              return {
                done: true,
                value: undefined
              }
            }
            const result = {
              done: false,
              value: current.data
            }
            current = current.next
            return result
          }
        }
      }

      /**
   * Iterate over [index, node] pairs.
   * @returns {Iterator}
   */
      entries () {
        return Array.from(this).map((node, index) => [index, node])[Symbol.iterator]()
      }

      /**
   * Iterate over the indexes.
   * @returns {Iterator}
   */
      keys () {
        return Array.from(this).map((node, index) => index)[Symbol.iterator]()
      }

      /**
   * Iterate over the nodes.
   * @returns {Iterator}
   */
      values () {
        return Array.from(this)[Symbol.iterator]()
      }
    }
    exports.PseudoNodeList = PseudoNodeList
  }, { 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList': 52, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.map.js': 198 }],
  4: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.map.js')
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    /**
 * @file Wraps an element in a Proxy which behaves like the DOM's DOMStringMap (element.dataset): a live view of its
 * data-* attributes, under their camelCase names, backed by the element's own getAttribute / setAttribute /
 * hasAttribute / removeAttribute (nothing is stored separately, so it can never fall out of sync with the
 * attributes).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const createStyleDeclaration_1 = require('./createStyleDeclaration')
    const DATA_PREFIX = 'data-'
    const attributeName = property => `${DATA_PREFIX}${(0, createStyleDeclaration_1.camelToKebab)(property)}`
    /**
 * Every data-* attribute name currently on the element, as [attributeName, camelCaseName] pairs.
 * @param {*} element
 * @returns {Array<Array<string>>}
 */
    const dataAttributes = element => {
      const names = []
      for (let index = 0; index < element.attributes.length; index++) {
        const name = element.attributes.item(index).name
        if (name.indexOf(DATA_PREFIX) === 0 && name.length > DATA_PREFIX.length) {
          names.push([name, (0, createStyleDeclaration_1.kebabToCamel)(name.slice(DATA_PREFIX.length))])
        }
      }
      return names
    }
    /**
 * A live DOMStringMap-like object for an element's data-* attributes.
 * @memberOf module:factories
 * @param {*} element The element whose data-* attributes this reflects
 * @returns {Object.<string, string>}
 */
    const createDataset = element => new Proxy({}, {
      get (_target, property) {
        if (typeof property !== 'string') {
          return undefined
        }
        const value = element.getAttribute(attributeName(property))
        return value === null ? undefined : value
      },
      set (_target, property, value) {
        if (typeof property !== 'string') {
          return false
        }
        element.setAttribute(attributeName(property), String(value))
        return true
      },
      deleteProperty (_target, property) {
        if (typeof property === 'string') {
          element.removeAttribute(attributeName(property))
        }
        return true
      },
      has (_target, property) {
        return typeof property === 'string' && element.hasAttribute(attributeName(property))
      },
      ownKeys () {
        return dataAttributes(element).map(([, camelCaseName]) => camelCaseName)
      },
      getOwnPropertyDescriptor (_target, property) {
        if (typeof property !== 'string' || !element.hasAttribute(attributeName(property))) {
          return undefined
        }
        return {
          enumerable: true,
          configurable: true,
          value: element.getAttribute(attributeName(property))
        }
      }
    })
    exports.default = createDataset
  }, { './createStyleDeclaration': 6, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.map.js': 198 }],
  5: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.createEvent = void 0
    const EventService_1 = require('../services/EventService')
    const UIEventService_1 = require('../services/UIEventService')
    const MouseEventService_1 = require('../services/MouseEventService')
    const PointerEventService_1 = require('../services/PointerEventService')
    const KeyboardEventService_1 = require('../services/KeyboardEventService')
    const FocusEventService_1 = require('../services/FocusEventService')
    const InputEventService_1 = require('../services/InputEventService')
    const CustomEventService_1 = require('../services/CustomEventService')
    const eventDefaults_1 = require('./eventDefaults')
    const eventClasses = {
      Event: EventService_1.EventService,
      UIEvent: UIEventService_1.UIEventService,
      MouseEvent: MouseEventService_1.MouseEventService,
      PointerEvent: PointerEventService_1.PointerEventService,
      KeyboardEvent: KeyboardEventService_1.KeyboardEventService,
      FocusEvent: FocusEventService_1.FocusEventService,
      InputEvent: InputEventService_1.InputEventService,
      CustomEvent: CustomEventService_1.CustomEventService
    }
    /**
 * Create an event of the kind which suits its type (a click is a MouseEvent, a keydown a KeyboardEvent, ...).
 * By default this is like using the constructor of the event in a script: nothing bubbles or can be cancelled unless
 * the init says so, and the event is not trusted. With browser: true the event is created the way the browser creates
 * it, using the standard options for its type (see eventDefaults), and trusted: true makes it look like it came from a
 * real user action (isTrusted).
 * @function createEvent
 * @param {string} type The type of the event, such as click
 * @param {Object} [init={}] The options for the event (bubbles, cancelable, composed and those of its kind of event)
 * @param {CreateEventOptions} [options={}] Whether the browser is creating the event, and whether it is trusted
 * @returns {EventService}
 */
    const createEvent = (type, init = {}, {
      browser = false,
      trusted = false
    } = {}) => {
      const definition = eventDefaults_1.eventDefaults[type]
      const options = browser && definition
        ? Object.assign({
          bubbles: definition.bubbles,
          cancelable: definition.cancelable,
          composed: definition.composed
        }, init)
        : init
      const EventClass = eventClasses[definition ? definition.interface : 'Event']
      const event = new EventClass(type, options)
      event.inner.trusted = trusted
      return event
    }
    exports.createEvent = createEvent
    exports.default = exports.createEvent
  }, { '../services/CustomEventService': 24, '../services/EventService': 29, '../services/FocusEventService': 31, '../services/InputEventService': 34, '../services/KeyboardEventService': 35, '../services/MouseEventService': 36, '../services/PointerEventService': 39, '../services/UIEventService': 41, './eventDefaults': 8 }],
  6: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.camelToKebab = exports.kebabToCamel = void 0
    /**
 * @file Wraps a CSSStyleDeclarationService in a Proxy so arbitrary camelCase CSS properties (element.style.
 * backgroundColor) work like the DOM's, on top of its real methods (getPropertyValue, setProperty, cssText, ...).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const CSSStyleDeclarationService_1 = require('../services/CSSStyleDeclarationService')
    const isIndex = property => /^\d+$/.test(property)
    /**
 * kebab-case -> camelCase ("background-color" -> "backgroundColor").
 * @param {string} name
 * @returns {string}
 */
    const kebabToCamel = name => name.replace(/-([a-z0-9])/gi, (_match, letter) => letter.toUpperCase())
    exports.kebabToCamel = kebabToCamel
    /**
 * camelCase -> kebab-case ("backgroundColor" -> "background-color").
 * @param {string} name
 * @returns {string}
 */
    const camelToKebab = name => name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    exports.camelToKebab = camelToKebab
    /**
 * A live CSSStyleDeclaration-like object: its real methods (cssText, getPropertyValue, setProperty, ...) work as
 * declared, and any other property name is treated as a camelCase CSS property (declaration.backgroundColor reads /
 * writes the "background-color" declaration), matching what a real element.style supports.
 * @memberOf module:factories
 * @param {string} [cssText=''] Initial declarations
 * @returns {CSSStyleDeclarationService}
 */
    const createStyleDeclaration = (cssText = '') => {
      const target = new CSSStyleDeclarationService_1.CSSStyleDeclarationService(cssText)
      return new Proxy(target, {
        get (declaration, property, receiver) {
          if (typeof property !== 'string') {
            return Reflect.get(declaration, property, receiver)
          }
          if (isIndex(property)) {
            return declaration.item(Number(property))
          }
          if (property in declaration) {
            return Reflect.get(declaration, property, receiver)
          }
          return declaration.getPropertyValue(camelToKebab(property))
        },
        set (declaration, property, value) {
          if (typeof property !== 'string' || property === 'cssText') {
            return Reflect.set(declaration, property, value)
          }
          declaration.setProperty(camelToKebab(property), value === null || typeof value === 'undefined' ? '' : String(value))
          return true
        },
        has (declaration, property) {
          return typeof property === 'string' && (property in declaration || declaration.getPropertyValue(camelToKebab(property)) !== '')
        }
      })
    }
    exports.default = createStyleDeclaration
  }, { '../services/CSSStyleDeclarationService': 23 }],
  7: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.filter.js')
    require('core-js/modules/esnext.iterator.for-each.js')
    require('core-js/modules/esnext.iterator.some.js')
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.cssSelectAdapter = void 0
    /**
 * @file The css-select Adapter which lets it query pseudo-dom's own tree, instead of the domutils-based tree it
 * defaults to.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const NodeService_1 = require('../services/NodeService')
    /**
 * Walk up from a node (not including it) to find the nearest element, in the given direction.
 * @param {*} node The node to start from
 * @param {'nextSibling'|'previousSibling'} direction Which sibling reference to follow
 * @returns {*|null}
 */
    const nearestElementSibling = (node, direction) => {
      let current = node ? node[direction] : null
      while (current && current.nodeType !== NodeService_1.NodeService.ELEMENT_NODE) {
        current = current[direction]
      }
      return current || null
    }
    /**
 * Maps pseudo-dom's own Node / Element API onto the Adapter interface css-select needs to query a tree which is not
 * domutils' own (css-select's own Adapter<Node, ElementNode> type). Every method here is one pseudo-dom already has
 * under a different name; nothing here reimplements DOM behaviour.
 * @memberOf module:factories
 * @type {Object}
 */
    exports.cssSelectAdapter = {
      isTag: node => !!node && node.nodeType === NodeService_1.NodeService.ELEMENT_NODE,
      existsOne: (test, elems) => elems.some(elem => exports.cssSelectAdapter.isTag(elem) && (test(elem) || exports.cssSelectAdapter.existsOne(test, exports.cssSelectAdapter.getChildren(elem)))),
      // pseudo-dom's className / classList are kept in sync with each other, but not with a literal 'class' attribute
      // (there is no such special-cased attribute here, unlike a real DOM) - so the 'class' css-select needs for class
      // selectors is read from className instead.
      getAttributeValue: (elem, name) => {
        const value = name === 'class' ? elem.className : elem.getAttribute(name)
        return value === null || value === undefined ? undefined : value
      },
      getChildren: node => Array.from(node.childNodes),
      getName: elem => elem.tagName,
      getParent: node => node.parentNode,
      // Unlike jQuery's siblings(), this is expected to include the node itself
      getSiblings: node => node.parentNode ? Array.from(node.parentNode.childNodes) : [node],
      prevElementSibling: node => nearestElementSibling(node, 'previousSibling'),
      getText: node => node.textContent || '',
      hasAttrib: (elem, name) => elem.hasAttribute(name),
      removeSubsets: nodes => nodes.filter((node, index) => !nodes.some((other, otherIndex) => otherIndex !== index && typeof other.contains === 'function' && other !== node && other.contains(node))),
      findAll: (test, nodes) => {
        const found = []
        const visit = list => list.forEach(node => {
          if (!exports.cssSelectAdapter.isTag(node)) {
            return
          }
          if (test(node)) {
            found.push(node)
          }
          visit(exports.cssSelectAdapter.getChildren(node))
        })
        visit(nodes)
        return found
      },
      findOne: (test, nodes) => {
        for (const node of nodes) {
          if (!exports.cssSelectAdapter.isTag(node)) {
            continue
          }
          if (test(node)) {
            return node
          }
          const inChildren = exports.cssSelectAdapter.findOne(test, exports.cssSelectAdapter.getChildren(node))
          if (inChildren) {
            return inChildren
          }
        }
        return null
      }
    }
    exports.default = exports.cssSelectAdapter
  }, { '../services/NodeService': 38, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.filter.js': 195, 'core-js/modules/esnext.iterator.for-each.js': 197, 'core-js/modules/esnext.iterator.some.js': 200 }],
  8: [function (require, module, exports) {
    'use strict'

    /**
 * @file The standard event types of the browser, and how the browser creates them.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.eventDefaults = void 0
    const define = (bubbles, cancelable, composed, eventInterface = 'Event') => ({
      bubbles,
      cancelable,
      composed,
      interface: eventInterface
    })
    /**
 * The events which the browser itself creates (for a user action, or for something like element.click()) have these
 * options. A script which creates an event with the constructor gets none of them (everything is false) unless it asks
 * for them, which is why createEvent only uses this table when it is told the browser is creating the event.
 * The values follow the UI Events, HTML, Pointer Events, Clipboard, Drag and Drop, Touch and CSS specifications.
 * @type {Object.<string, EventDefinition>}
 */
    exports.eventDefaults = {
      // Mouse (UI Events)
      click: define(true, true, true, 'MouseEvent'),
      auxclick: define(true, true, true, 'MouseEvent'),
      dblclick: define(true, true, true, 'MouseEvent'),
      contextmenu: define(true, true, true, 'MouseEvent'),
      mousedown: define(true, true, true, 'MouseEvent'),
      mouseup: define(true, true, true, 'MouseEvent'),
      mousemove: define(true, true, true, 'MouseEvent'),
      mouseover: define(true, true, true, 'MouseEvent'),
      mouseout: define(true, true, true, 'MouseEvent'),
      mouseenter: define(false, false, true, 'MouseEvent'),
      mouseleave: define(false, false, true, 'MouseEvent'),
      wheel: define(true, true, true, 'MouseEvent'),
      // Pointer (Pointer Events)
      pointerdown: define(true, true, true, 'PointerEvent'),
      pointerup: define(true, true, true, 'PointerEvent'),
      pointermove: define(true, true, true, 'PointerEvent'),
      pointerover: define(true, true, true, 'PointerEvent'),
      pointerout: define(true, true, true, 'PointerEvent'),
      pointerenter: define(false, false, true, 'PointerEvent'),
      pointerleave: define(false, false, true, 'PointerEvent'),
      pointercancel: define(true, false, true, 'PointerEvent'),
      gotpointercapture: define(true, false, true, 'PointerEvent'),
      lostpointercapture: define(true, false, true, 'PointerEvent'),
      // Keyboard (UI Events)
      keydown: define(true, true, true, 'KeyboardEvent'),
      keypress: define(true, true, true, 'KeyboardEvent'),
      keyup: define(true, true, true, 'KeyboardEvent'),
      // Focus (UI Events): focus and blur do not bubble, focusin and focusout do
      focus: define(false, false, true, 'FocusEvent'),
      blur: define(false, false, true, 'FocusEvent'),
      focusin: define(true, false, true, 'FocusEvent'),
      focusout: define(true, false, true, 'FocusEvent'),
      // Forms (HTML, Input Events)
      beforeinput: define(true, true, true, 'InputEvent'),
      input: define(true, false, true, 'InputEvent'),
      change: define(true, false, false),
      select: define(true, false, false),
      submit: define(true, true, false),
      reset: define(true, true, false),
      invalid: define(false, true, false),
      toggle: define(false, false, false),
      // Loading and the page (HTML)
      load: define(false, false, false),
      error: define(false, false, false),
      abort: define(false, false, false),
      scroll: define(false, false, false),
      scrollend: define(false, false, false),
      resize: define(false, false, false),
      DOMContentLoaded: define(true, false, false),
      readystatechange: define(false, false, false),
      visibilitychange: define(true, false, false),
      // Clipboard
      copy: define(true, true, true),
      cut: define(true, true, true),
      paste: define(true, true, true),
      // Drag and drop
      drag: define(true, true, true, 'MouseEvent'),
      dragstart: define(true, true, true, 'MouseEvent'),
      dragend: define(true, false, true, 'MouseEvent'),
      dragenter: define(true, true, true, 'MouseEvent'),
      dragover: define(true, true, true, 'MouseEvent'),
      dragleave: define(true, false, true, 'MouseEvent'),
      drop: define(true, true, true, 'MouseEvent'),
      // Touch
      touchstart: define(true, true, true, 'UIEvent'),
      touchmove: define(true, true, true, 'UIEvent'),
      touchend: define(true, true, true, 'UIEvent'),
      touchcancel: define(true, false, true, 'UIEvent'),
      // Animations and transitions (CSS)
      animationstart: define(true, false, false),
      animationiteration: define(true, false, false),
      animationend: define(true, false, false),
      animationcancel: define(true, false, false),
      transitionrun: define(true, false, false),
      transitionstart: define(true, false, false),
      transitionend: define(true, false, false),
      transitioncancel: define(true, false, false)
    }
    exports.default = exports.eventDefaults
  }, {}],
  9: [function (require, module, exports) {
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
    const EventTargetService_1 = __importDefault(require('../services/EventTargetService'))
    const NodeService_1 = require('../services/NodeService')
    const ElementService_1 = require('../services/ElementService')
    const HTMLElementService_1 = require('../services/HTMLElementService')
    const PseudoHTMLDocument_1 = __importDefault(require('../classes/PseudoHTMLDocument'))
    /**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
 * context.
 * @function generateDocument
 * @param {Object} root
 * @param {Object} context
 * @returns {Window|PseudoEventTarget}
 */
    const generateDocument = (root, context = {}) => {
      /**
   *
   * @type {Window|PseudoEventTarget}
   */
      const newWindow = typeof root.document === 'undefined' ? root : new EventTargetService_1.default()
      /**
   * The Node class itself (matching the DOM's window.Node), not an instance - the right-hand side of `instanceof`
   * must be a constructor, so `x instanceof Node` needs this, not `new PseudoNode()`.
   * @type {Function}
   */
      const Node = root.Node || NodeService_1.NodeService
      if (typeof newWindow.Node === 'undefined') {
        newWindow.Node = Node
      }
      /**
   * The Element class itself, for the same reason as Node.
   * @type {Function}
   */
      const Element = root.Element || ElementService_1.ElementService
      if (typeof newWindow.Element === 'undefined') {
        newWindow.Element = Element
      }
      /**
   * The HTMLElement class itself, for the same reason as Node.
   * @type {Function}
   */
      const HTMLElement = root.HTMLElement || HTMLElementService_1.HTMLElementService
      if (typeof newWindow.HTMLElement === 'undefined') {
        newWindow.HTMLElement = HTMLElement
      }
      /**
   * The HTMLDocument class itself, for the same reason as Node (so `document instanceof HTMLDocument`, a common
   * real-DOM-detection check, works).
   * @type {Function}
   */
      const HTMLDocument = root.HTMLDocument || PseudoHTMLDocument_1.default
      if (typeof newWindow.HTMLDocument === 'undefined') {
        newWindow.HTMLDocument = HTMLDocument
      }
      /**
   * Define document when not available - a real instance, unlike the classes above (window.document IS an object,
   * not a constructor).
   * @type {Document|PseudoHTMLDocument}
   */
      const document = root.document || new PseudoHTMLDocument_1.default()
      if (typeof newWindow.document === 'undefined') {
        newWindow.document = document
      }
      // When there was no real document, newWindow is root itself (see above), so every assignment above already
      // mutated it directly. If context is also that same object (root and context given as one and the same, as
      // installGlobal does) merging is already done - doing it again would be Object.assign(target, target), which
      // throws on any getter-only own property target already has (globalThis.crypto, in Node).
      const mergeInto = context || root
      return newWindow === mergeInto ? newWindow : Object.assign(mergeInto, newWindow)
    }
    exports.default = generateDocument
  }, { '../classes/PseudoHTMLDocument': 2, '../services/ElementService': 28, '../services/EventTargetService': 30, '../services/HTMLElementService': 33, '../services/NodeService': 38 }],
  10: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    const PseudoNodeList_1 = require('../classes/PseudoNodeList')
    /**
 * Create a PseudoNodeList, optionally starting from an existing chain of linkers.
 * @param {TreeLinker|null} [innerList=null]
 * @returns {PseudoNodeList}
 */
    const generateNodeList = (innerList = null) => new PseudoNodeList_1.PseudoNodeList().initialize(innerList)
    exports.default = generateNodeList
  }, { '../classes/PseudoNodeList': 3 }],
  11: [function (require, module, exports) {
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
    /**
 * @file Makes pseudo-dom a drop-in swap for a real DOM: code written against bare globals (document.createElement,
 * new Node(), ...) works unmodified, in the browser or in Node, without an if (typeof document === 'undefined')
 * check at every call site.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const browser_or_node_1 = require('browser-or-node')
    const generateDocument_1 = __importDefault(require('./generateDocument'))
    /**
 * When there is no real DOM already available (a real browser, or a jsdom-based test environment - isBrowser is
 * true for both, since jsdom's window has a document too, and a jsdom document should never be overwritten, real
 * DOM behaviour is always closer to the real thing), populate the given global-like target with document / Node /
 * Element / HTMLElement / HTMLDocument, generated by generateDocument, plus window (a self-reference, matching a
 * real browser's global scope - some code checks for a bare `window` before falling back to `global`), so code
 * written against a real DOM's globals works as-is. Does nothing when a real DOM is already there, matching
 * generateDocument's own only-fill-what-is-missing behaviour - calling this is always safe, in any environment.
 * @memberOf module:factories
 * @param {*} [target] The object to add document / Node / Element / HTMLElement / window onto - defaults to
 * globalThis, so bare `document`, `Node`, `window`, etc. resolve from anywhere once this has run
 * @returns {*} The same target, for convenience
 */
    const installGlobal = (target = typeof globalThis !== 'undefined' ? globalThis : {}) => {
      if (!browser_or_node_1.isBrowser) {
        (0, generateDocument_1.default)(target, target)
        if (typeof target.window === 'undefined') {
          target.window = target
        }
      }
      return target
    }
    exports.default = installGlobal
  }, { './generateDocument': 9, 'browser-or-node': 44 }],
  12: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    /**
 * @file Prints an element (or any node) to the console, readably - the point of pseudo-dom running headlessly is
 * usually to watch what code does to a tree without a real browser to look at.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const serializeHTML_1 = require('./serializeHTML')
    /**
 * Print a node's markup to the console, indented for readability (see prettyPrint).
 * @memberOf module:factories
 * @param {*} node
 * @param {string} [label=''] A label printed above the markup, to identify this log call
 * @returns {undefined}
 */
    const logElement = (node, label = '') => {
      console.log(`${label ? `${label}\n` : ''}${(0, serializeHTML_1.prettyPrint)(node)}`)
    }
    exports.default = logElement
  }, { './serializeHTML': 15 }],
  13: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    /**
 * @file Parses an HTML string into pseudo-dom nodes, for innerHTML / outerHTML / insertAdjacentHTML. Built on
 * htmlparser2's Parser (a SAX-style tokenizer) with a custom handler which builds pseudo-dom nodes directly -
 * htmlparser2's own default DomHandler / domutils tree (which this never uses) is stubbed out of the browser bundle
 * by the browser.ignore config, the same way css-select's unused default adapter already is.
 *
 * The class to build parsed elements with is given by the caller (rather than imported here) so this has no
 * dependency on ElementService / HTMLElementService - importing either here, from a factory ElementService itself
 * would need to call, would create an import cycle.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const htmlparser2_1 = require('htmlparser2')
    const NodeService_1 = require('../services/NodeService')
    /**
 * Parse an HTML string into the nodes it describes (siblings at the top level, exactly like the DOM's own HTML
 * parsing does for innerHTML / insertAdjacentHTML - there is no single root unless the markup itself has one).
 * @memberOf module:factories
 * @param {string} html
 * @param {*} ownerDocument The document the new nodes belong to (matches what innerHTML etc. would set), or null
 * @param {function(new: *, {tagName: string})} ElementClass The class to build each parsed element with
 * @returns {Array<*>}
 */
    const parseHTML = (html, ownerDocument, ElementClass) => {
      const roots = []
      const stack = []
      const appendNode = node => {
        node.ownerDocumentStore = ownerDocument
        if (stack.length) {
          stack[stack.length - 1].appendChild(node)
        } else {
          roots.push(node)
        }
      }
      const parser = new htmlparser2_1.Parser({
        onopentagname (name) {
          const element = new ElementClass({
            tagName: name
          })
          appendNode(element)
          stack.push(element)
        },
        onattribute (name, value) {
          if (!stack.length) {
            return
          }
          const element = stack[stack.length - 1]
          // pseudo-dom's className / classList and style are not kept in sync with a literal 'class' / 'style'
          // attribute the way setAttribute usually is (there is no such special-casing here, unlike a real DOM) - route
          // them to the real objects directly, the same way cssSelectAdapter does for reading 'class' when matching a
          // CSS selector, so parsed markup's class="..." / style="..." actually populates className/classList and style.
          if (name === 'class') {
            element.className = value
            return
          }
          if (name === 'style' && element.style) {
            element.style.cssText = value
            return
          }
          element.setAttribute(name, value)
        },
        ontext (text) {
          appendNode(new NodeService_1.TextService(text))
        },
        oncomment (data) {
          appendNode(new NodeService_1.CommentService(data))
        },
        onclosetag () {
          stack.pop()
        }
      }, {
        lowerCaseTags: true,
        lowerCaseAttributeNames: true
      })
      parser.write(String(html || ''))
      parser.end()
      return roots
    }
    exports.default = parseHTML
  }, { '../services/NodeService': 38, htmlparser2: 256 }],
  14: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.closest = exports.matches = exports.querySelector = exports.querySelectorAll = void 0
    /**
 * @file Selector queries (querySelector, querySelectorAll, matches, closest), built on css-select and the
 * cssSelectAdapter which lets it query pseudo-dom's own tree.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const css_select_1 = require('css-select')
    const cssSelectAdapter_1 = require('./cssSelectAdapter')
    /**
 * All of the elements below (not including) scope which match the selector, in tree order.
 * @memberOf module:factories
 * @param {string} selector A CSS selector
 * @param {*} scope The node to search below
 * @returns {Array<*>}
 */
    const querySelectorAll = (selector, scope) => (0, css_select_1.selectAll)(selector, scope, {
      adapter: cssSelectAdapter_1.cssSelectAdapter
    })
    exports.querySelectorAll = querySelectorAll
    /**
 * The first element below (not including) scope which matches the selector, in tree order, or null when there is none.
 * @memberOf module:factories
 * @param {string} selector A CSS selector
 * @param {*} scope The node to search below
 * @returns {*|null}
 */
    const querySelector = (selector, scope) => (0, css_select_1.selectOne)(selector, scope, {
      adapter: cssSelectAdapter_1.cssSelectAdapter
    })
    exports.querySelector = querySelector
    /**
 * Whether an element itself (not its descendants) matches the selector.
 * @memberOf module:factories
 * @param {*} element The element to test
 * @param {string} selector A CSS selector
 * @returns {boolean}
 */
    const matches = (element, selector) => (0, css_select_1.is)(element, selector, {
      adapter: cssSelectAdapter_1.cssSelectAdapter
    })
    exports.matches = matches
    /**
 * The nearest ancestor of an element (starting with the element itself) which matches the selector, or null when
 * none of them do.
 * @memberOf module:factories
 * @param {*} element The element to start from
 * @param {string} selector A CSS selector
 * @returns {*|null}
 */
    const closest = (element, selector) => {
      let current = element
      while (current && cssSelectAdapter_1.cssSelectAdapter.isTag(current)) {
        if ((0, exports.matches)(current, selector)) {
          return current
        }
        current = current.parentNode
      }
      return null
    }
    exports.closest = closest
  }, { './cssSelectAdapter': 7, 'css-select': 239 }],
  15: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.filter.js')
    require('core-js/modules/esnext.iterator.map.js')
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
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.prettyPrint = exports.serializeOuter = exports.serializeChildren = void 0
    /**
 * @file Serializes pseudo-dom nodes back into an HTML string, for innerHTML / outerHTML.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const NodeService_1 = require('../services/NodeService')
    // Void elements are self-closing and never serialize a closing tag or children (there is no HTML parsing of their
    // content either - the DOM never lets them have children in the first place).
    const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
    // These property-backed names (see ElementService / HTMLElementService's constructors) are not real HTML content
    // attributes - offsetWidth and friends describe layout, which does not exist here, and innerHTML is JS-only - so
    // they must never appear in serialized markup, however getAttributeNames() may report them.
    const NEVER_SERIALIZE = new Set(['innerHTML', 'clientHeight', 'clientLeft', 'clientTop', 'clientWidth', 'scrollHeight', 'scrollLeft', 'scrollTop', 'scrollWidth', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth'])
    // The attribute name to serialize a property-backed name as, when it differs from the property name
    const ATTRIBUTE_NAME = {
      className: 'class'
    }
    // Boolean HTML attributes: present (with no value) when true, absent entirely when false
    const BOOLEAN_ATTRIBUTES = new Set(['hidden'])
    /**
 * Escape text so it is safe inside HTML text content. Coerces to a string first - unlike a real DOM, pseudo-dom's
 * setAttribute does not itself coerce (see the same note on escapeAttributeValue), and nodeValue is not guaranteed
 * to be a string either.
 * @param {*} text
 * @returns {string}
 */
    const escapeText = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    /**
 * Escape a value so it is safe inside a double-quoted HTML attribute. Coerces to a string first: a real DOM's
 * setAttribute always stores a string, however pseudo-dom's does not coerce what it is given, so a value set via
 * setAttribute(name, 5) is stored (and read back by getAttribute) as the number 5, not the string '5'.
 * @param {*} value
 * @returns {string}
 */
    const escapeAttributeValue = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    /**
 * Every attribute of the element, serialized (class instead of className, boolean attributes bare, the never-real
 * mock properties left out, style added from the live CSSStyleDeclaration when it is not empty).
 * @param {*} element
 * @returns {string}
 */
    const serializeAttributes = element => {
      let result = (element.getAttributeNames ? element.getAttributeNames() : []).filter(name => !NEVER_SERIALIZE.has(name)).map(name => {
        if (BOOLEAN_ATTRIBUTES.has(name)) {
          return element[name] ? ` ${name}` : ''
        }
        const value = element.getAttribute(name)
        return value === '' ? '' : ` ${ATTRIBUTE_NAME[name] || name}="${escapeAttributeValue(value)}"`
      }).join('')
      const style = element.style
      if (style && style.cssText) {
        result += ` style="${escapeAttributeValue(style.cssText)}"`
      }
      return result
    }
    /**
 * One node, serialized (its own markup only - see serializeChildren for its descendants too).
 * @param {*} node
 * @returns {string}
 */
    const serializeNode = node => {
      if (node.nodeType === NodeService_1.NodeService.TEXT_NODE) {
        return escapeText(node.nodeValue || '')
      }
      if (node.nodeType === NodeService_1.NodeService.COMMENT_NODE) {
        return `<!--${node.nodeValue || ''}-->`
      }
      if (node.nodeType !== NodeService_1.NodeService.ELEMENT_NODE) {
        return ''
      }
      const tagName = node.tagName
      const attributes = serializeAttributes(node)
      if (VOID_ELEMENTS.has(tagName)) {
        return `<${tagName}${attributes}>`
      }
      return `<${tagName}${attributes}>${serializeChildren(node)}</${tagName}>`
    }
    /**
 * A node's children, serialized in order (this is what innerHTML returns).
 * @memberOf module:factories
 * @param {*} node
 * @returns {string}
 */
    const serializeChildren = node => Array.from(node.childNodes).map(serializeNode).join('')
    exports.serializeChildren = serializeChildren
    /**
 * An element itself, serialized with its children (this is what outerHTML returns).
 * @memberOf module:factories
 * @param {*} element
 * @returns {string}
 */
    const serializeOuter = element => serializeNode(element)
    exports.serializeOuter = serializeOuter
    /**
 * One node, indented for readability (see prettyPrint) - unlike serializeNode, every non-empty node is its own
 * line, so the structure of a whole tree is easy to read at a glance.
 * @param {*} node
 * @param {number} depth
 * @param {string} indent
 * @returns {string}
 */
    const prettyPrintNode = (node, depth, indent) => {
      const pad = indent.repeat(depth)
      if (node.nodeType === NodeService_1.NodeService.TEXT_NODE) {
        const text = escapeText((node.nodeValue || '').trim())
        return text ? `${pad}${text}` : ''
      }
      if (node.nodeType === NodeService_1.NodeService.COMMENT_NODE) {
        return `${pad}<!--${node.nodeValue || ''}-->`
      }
      if (node.nodeType !== NodeService_1.NodeService.ELEMENT_NODE) {
        return ''
      }
      const tagName = node.tagName
      const attributes = serializeAttributes(node)
      if (VOID_ELEMENTS.has(tagName)) {
        return `${pad}<${tagName}${attributes}>`
      }
      const children = Array.from(node.childNodes).map(child => prettyPrintNode(child, depth + 1, indent)).filter(line => line !== '')
      if (children.length === 0) {
        return `${pad}<${tagName}${attributes}></${tagName}>`
      }
      return `${pad}<${tagName}${attributes}>\n${children.join('\n')}\n${pad}</${tagName}>`
    }
    /**
 * A node's markup, indented one level per level of nesting - a real DOM's outerHTML / innerHTML has no line breaks
 * at all, which does not read well for a whole tree (a board full of cells, say). Useful for watching pseudo-dom-
 * driven code run headlessly, printed to a terminal - see also logElement, which does the printing too.
 * @memberOf module:factories
 * @param {*} node
 * @param {string} [indent='  '] The indentation used per level of nesting
 * @returns {string}
 */
    const prettyPrint = (node, indent = '  ') => prettyPrintNode(node, 0, indent)
    exports.prettyPrint = prettyPrint
  }, { '../services/NodeService': 38, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.filter.js': 195, 'core-js/modules/esnext.iterator.map.js': 198, 'core-js/modules/esnext.set.add-all.js': 214, 'core-js/modules/esnext.set.delete-all.js': 215, 'core-js/modules/esnext.set.difference.js': 216, 'core-js/modules/esnext.set.every.js': 217, 'core-js/modules/esnext.set.filter.js': 218, 'core-js/modules/esnext.set.find.js': 219, 'core-js/modules/esnext.set.intersection.js': 220, 'core-js/modules/esnext.set.is-disjoint-from.js': 221, 'core-js/modules/esnext.set.is-subset-of.js': 222, 'core-js/modules/esnext.set.is-superset-of.js': 223, 'core-js/modules/esnext.set.join.js': 224, 'core-js/modules/esnext.set.map.js': 225, 'core-js/modules/esnext.set.reduce.js': 226, 'core-js/modules/esnext.set.some.js': 227, 'core-js/modules/esnext.set.symmetric-difference.js': 228, 'core-js/modules/esnext.set.union.js': 229 }],
  16: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.weak-map.delete-all.js')
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.setActiveElement = exports.getActiveElement = void 0
    /**
 * The element which has the focus, kept for each tree (the root node of the tree it is in), like document.activeElement.
 */
    const focused = new WeakMap()
    /**
 * Find the element which has the focus in a tree.
 * @function getActiveElement
 * @param {Object} root The root node of the tree
 * @returns {Object|null}
 */
    const getActiveElement = root => focused.get(root) || null
    exports.getActiveElement = getActiveElement
    /**
 * Remember the element which has the focus in a tree.
 * @function setActiveElement
 * @param {Object} root The root node of the tree
 * @param {Object|null} element The element which now has the focus, or null when nothing has it
 */
    const setActiveElement = (root, element) => {
      if (element === null) {
        focused.delete(root)
      } else {
        focused.set(root, element)
      }
    }
    exports.setActiveElement = setActiveElement
  }, { 'core-js/modules/esnext.weak-map.delete-all.js': 230 }],
  17: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    const NodeService_1 = require('../services/NodeService')
    /**
 * The first element, in tree order, below (not including) the given node whose id matches the given value, or null
 * when there is none. Shared by Document and DocumentFragment, which both implement the DOM's NonElementParentNode
 * mixin (so ShadowRoot, a DocumentFragment, gets it too).
 * @memberOf module:functions
 * @param {NodeService} root The node to search below
 * @param {string} id
 * @returns {PseudoElement|null}
 */
    const getElementById = (root, id) => {
      const search = node => {
        for (const child of Array.from(node.childNodes)) {
          if (child.nodeType === NodeService_1.NodeService.ELEMENT_NODE) {
            if (child.id === id) {
              return child
            }
            const found = search(child)
            if (found) {
              return found
            }
          }
        }
        return null
      }
      return search(root)
    }
    exports.default = getElementById
  }, { '../services/NodeService': 38 }],
  18: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    /**
 * Get all of the ancestors of a node, starting with the root of the tree and ending with the node's own parent (the
 * order in which an event travels down through them). A node which has no parent has no ancestors.
 * @function getParentNodes
 * @param {PseudoEventTarget|PseudoNode|*} node The node to find the ancestors of
 * @returns {Array<PseudoNode>}
 */
    const getParentNodes = node => {
      const parents = []
      let current = node && node.parentNode ? node.parentNode : null
      while (current) {
        parents.unshift(current)
        current = current.parentNode
      }
      return parents
    }
    exports.default = getParentNodes
  }, {}],
  19: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.filter.js')
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
    const getParentNodes_1 = __importDefault(require('./getParentNodes'))
    /**
 * A selector function for retrieving existing parent PseudoNode from the given child item.
 * This function will check all the parents starting from node, and scan the attributes
 * property for matches. The return array contains all matching parent ancestors, starting with the root of the tree.
 * @function getParentNodesFromAttribute
 * @param {string} attr The property to compare on each ancestor (a missing property counts as false)
 * @param {boolean|number|string} value The value the property must have
 * @param {PseudoEventTarget|PseudoNode|*} node The node to find the matching ancestors of
 * @returns {Array.<PseudoNode>}
 */
    const getParentNodesFromAttribute = (attr, value, node) => {
      return (0, getParentNodes_1.default)(node).filter(parent => (parent[attr] || false) === value)
    }
    exports.default = getParentNodesFromAttribute
  }, { './getParentNodes': 18, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.filter.js': 195 }],
  20: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.modifierState = exports.modifierKeys = void 0
    /**
 * Pick the modifier keys out of the init object of an event.
 * @function modifierKeys
 * @param {Object} [init={}] The init of an event
 * @returns {ModifierKeys}
 */
    const modifierKeys = (init = {}) => ({
      ctrlKey: !!init.ctrlKey,
      shiftKey: !!init.shiftKey,
      altKey: !!init.altKey,
      metaKey: !!init.metaKey
    })
    exports.modifierKeys = modifierKeys
    /**
 * Answer getModifierState for a set of held modifier keys.
 * @function modifierState
 * @param {ModifierKeys} keys The modifier keys which were held down
 * @param {string} key The name of the modifier (Control, Shift, Alt or Meta)
 * @returns {boolean}
 */
    const modifierState = (keys, key) => {
      switch (key) {
        case 'Control':
          return keys.ctrlKey
        case 'Shift':
          return keys.shiftKey
        case 'Alt':
          return keys.altKey
        case 'Meta':
          return keys.metaKey
        default:
          return false
      }
    }
    exports.modifierState = modifierState
  }, {}],
  21: [function (require, module, exports) {
    'use strict'

    /**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
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
    exports.PseudoHTMLDocument = exports.PseudoHTMLElement = exports.PseudoElement = exports.PseudoComment = exports.PseudoText = exports.PseudoNode = exports.PseudoEventTarget = exports.PseudoCustomEvent = exports.PseudoInputEvent = exports.PseudoFocusEvent = exports.PseudoKeyboardEvent = exports.PseudoPointerEvent = exports.PseudoMouseEvent = exports.PseudoUIEvent = exports.PseudoEvent = exports.simulate = exports.eventDefaults = exports.createEvent = exports.prettyPrint = exports.logElement = exports.installGlobal = exports.generateDocument = void 0
    const EventService_1 = require('./services/EventService')
    Object.defineProperty(exports, 'PseudoEvent', {
      enumerable: true,
      get: function () {
        return EventService_1.EventService
      }
    })
    const EventTargetService_1 = __importDefault(require('./services/EventTargetService'))
    exports.PseudoEventTarget = EventTargetService_1.default
    const NodeService_1 = require('./services/NodeService')
    Object.defineProperty(exports, 'PseudoNode', {
      enumerable: true,
      get: function () {
        return NodeService_1.NodeService
      }
    })
    const ElementService_1 = require('./services/ElementService')
    Object.defineProperty(exports, 'PseudoElement', {
      enumerable: true,
      get: function () {
        return ElementService_1.ElementService
      }
    })
    const HTMLElementService_1 = require('./services/HTMLElementService')
    Object.defineProperty(exports, 'PseudoHTMLElement', {
      enumerable: true,
      get: function () {
        return HTMLElementService_1.HTMLElementService
      }
    })
    const PseudoHTMLDocument_1 = __importDefault(require('./classes/PseudoHTMLDocument'))
    exports.PseudoHTMLDocument = PseudoHTMLDocument_1.default
    const generateDocument_1 = __importDefault(require('./factories/generateDocument'))
    exports.generateDocument = generateDocument_1.default
    const installGlobal_1 = __importDefault(require('./factories/installGlobal'))
    exports.installGlobal = installGlobal_1.default
    const logElement_1 = __importDefault(require('./factories/logElement'))
    exports.logElement = logElement_1.default
    const serializeHTML_1 = require('./factories/serializeHTML')
    Object.defineProperty(exports, 'prettyPrint', {
      enumerable: true,
      get: function () {
        return serializeHTML_1.prettyPrint
      }
    })
    const createEvent_1 = __importDefault(require('./factories/createEvent'))
    exports.createEvent = createEvent_1.default
    const eventDefaults_1 = __importDefault(require('./factories/eventDefaults'))
    exports.eventDefaults = eventDefaults_1.default
    const UIEventService_1 = require('./services/UIEventService')
    Object.defineProperty(exports, 'PseudoUIEvent', {
      enumerable: true,
      get: function () {
        return UIEventService_1.UIEventService
      }
    })
    const MouseEventService_1 = require('./services/MouseEventService')
    Object.defineProperty(exports, 'PseudoMouseEvent', {
      enumerable: true,
      get: function () {
        return MouseEventService_1.MouseEventService
      }
    })
    const PointerEventService_1 = require('./services/PointerEventService')
    Object.defineProperty(exports, 'PseudoPointerEvent', {
      enumerable: true,
      get: function () {
        return PointerEventService_1.PointerEventService
      }
    })
    const KeyboardEventService_1 = require('./services/KeyboardEventService')
    Object.defineProperty(exports, 'PseudoKeyboardEvent', {
      enumerable: true,
      get: function () {
        return KeyboardEventService_1.KeyboardEventService
      }
    })
    const FocusEventService_1 = require('./services/FocusEventService')
    Object.defineProperty(exports, 'PseudoFocusEvent', {
      enumerable: true,
      get: function () {
        return FocusEventService_1.FocusEventService
      }
    })
    const InputEventService_1 = require('./services/InputEventService')
    Object.defineProperty(exports, 'PseudoInputEvent', {
      enumerable: true,
      get: function () {
        return InputEventService_1.InputEventService
      }
    })
    const CustomEventService_1 = require('./services/CustomEventService')
    Object.defineProperty(exports, 'PseudoCustomEvent', {
      enumerable: true,
      get: function () {
        return CustomEventService_1.CustomEventService
      }
    })
    const simulate_1 = __importDefault(require('./simulate'))
    exports.simulate = simulate_1.default
    const NodeService_2 = require('./services/NodeService')
    Object.defineProperty(exports, 'PseudoText', {
      enumerable: true,
      get: function () {
        return NodeService_2.TextService
      }
    })
    Object.defineProperty(exports, 'PseudoComment', {
      enumerable: true,
      get: function () {
        return NodeService_2.CommentService
      }
    })
    /**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
    const pseudoDom = {
      generateDocument: generateDocument_1.default,
      installGlobal: installGlobal_1.default,
      logElement: logElement_1.default,
      prettyPrint: serializeHTML_1.prettyPrint,
      createEvent: createEvent_1.default,
      eventDefaults: eventDefaults_1.default,
      simulate: simulate_1.default,
      PseudoEvent: EventService_1.EventService,
      PseudoUIEvent: UIEventService_1.UIEventService,
      PseudoMouseEvent: MouseEventService_1.MouseEventService,
      PseudoPointerEvent: PointerEventService_1.PointerEventService,
      PseudoKeyboardEvent: KeyboardEventService_1.KeyboardEventService,
      PseudoFocusEvent: FocusEventService_1.FocusEventService,
      PseudoInputEvent: InputEventService_1.InputEventService,
      PseudoCustomEvent: CustomEventService_1.CustomEventService,
      PseudoEventTarget: EventTargetService_1.default,
      PseudoNode: NodeService_1.NodeService,
      PseudoText: NodeService_2.TextService,
      PseudoComment: NodeService_2.CommentService,
      PseudoElement: ElementService_1.ElementService,
      PseudoHTMLElement: HTMLElementService_1.HTMLElementService,
      PseudoHTMLDocument: PseudoHTMLDocument_1.default
    }
    exports.default = pseudoDom
    if (void 0) {
      // @ts-ignore
      (void 0).pseudoDom = pseudoDom
    } else if (typeof window !== 'undefined') {
      // @ts-ignore
      window.pseudoDom = pseudoDom
    }
  }, { './classes/PseudoHTMLDocument': 2, './factories/createEvent': 5, './factories/eventDefaults': 8, './factories/generateDocument': 9, './factories/installGlobal': 11, './factories/logElement': 12, './factories/serializeHTML': 15, './services/CustomEventService': 24, './services/ElementService': 28, './services/EventService': 29, './services/EventTargetService': 30, './services/FocusEventService': 31, './services/HTMLElementService': 33, './services/InputEventService': 34, './services/KeyboardEventService': 35, './services/MouseEventService': 36, './services/NodeService': 38, './services/PointerEventService': 39, './services/UIEventService': 41, './simulate': 42 }],
  22: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.AttrService = void 0
    const NodeService_1 = require('./NodeService')
    /**
 * Simulate the behaviour of the Attr Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
    class AttrService extends NodeService_1.NodeService {
      /**
   * @param {string} name The name of the attribute
   * @param {string} [value=''] The value of the attribute
   * @param {PseudoElement|null} [ownerElement=null] The element which has this attribute
   * @param {string} [namespaceURI=''] The namespace of the attribute
   * @param {string|null} [prefix=null] The namespace prefix of the attribute
   * @constructor
   */
      constructor (name = '', value = '', ownerElement = null, namespaceURI = '', prefix = null) {
        super()
        this.attributeName = name
        this.value = value
        this.element = ownerElement
        this.namespace = namespaceURI
        this.namespacePrefix = prefix
        this.nodeNameValue = name
      }

      get acceptsChildren () {
        return false
      }

      get nodeValue () {
        return this.value
      }

      set nodeValue (value) {
        this.value = value === null ? '' : String(value)
      }

      get textContent () {
        return this.value
      }

      set textContent (text) {
        this.value = text === null ? '' : String(text)
      }

      cloneShallow () {
        return new AttrService(this.localName, this.value, null, this.namespaceURI, this.prefix)
      }

      get nodeType () {
        return NodeService_1.NodeService.ATTRIBUTE_NODE
      }

      get localName () {
        return this.attributeName
      }

      get name () {
        return this.namespacePrefix ? `${this.namespacePrefix}:${this.attributeName}` : this.attributeName
      }

      get namespaceURI () {
        return this.namespace
      }

      get ownerElement () {
        return this.element
      }

      get prefix () {
        return this.namespacePrefix
      }
    }
    exports.AttrService = AttrService
  }, { './NodeService': 38 }],
  23: [function (require, module, exports) {
    'use strict'

    /**
 * @file Substitute for the DOM CSSStyleDeclaration Class (the object behind Element.style).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.for-each.js')
    require('core-js/modules/esnext.iterator.map.js')
    require('core-js/modules/esnext.map.delete-all.js')
    require('core-js/modules/esnext.map.every.js')
    require('core-js/modules/esnext.map.filter.js')
    require('core-js/modules/esnext.map.find.js')
    require('core-js/modules/esnext.map.find-key.js')
    require('core-js/modules/esnext.map.includes.js')
    require('core-js/modules/esnext.map.key-of.js')
    require('core-js/modules/esnext.map.map-keys.js')
    require('core-js/modules/esnext.map.map-values.js')
    require('core-js/modules/esnext.map.merge.js')
    require('core-js/modules/esnext.map.reduce.js')
    require('core-js/modules/esnext.map.some.js')
    require('core-js/modules/esnext.map.update.js')
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.CSSStyleDeclarationService = void 0
    /**
 * Simulate the behaviour of the CSSStyleDeclaration Class when there is no DOM available: an ordered map of CSS
 * property/value pairs, parsed from and serialized back to a cssText string. Values are stored and returned as
 * given, with no unit conversion, shorthand expansion or validation - this is a data structure, not a real CSS
 * engine. Named property access (declaration.backgroundColor, camelCase) is added on top of this by
 * createStyleDeclaration, which wraps an instance of this class in a Proxy.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
    class CSSStyleDeclarationService {
      /**
   * @param {string} [cssText=''] Initial declarations, as CSS text ("color: red; font-size: 12px;")
   * @constructor
   */
      constructor (cssText = '') {
        this.properties = new Map()
        this.cssText = cssText
      }

      /**
   * How many properties are currently set.
   * @returns {number}
   */
      get length () {
        return this.properties.size
      }

      /**
   * The name of the property at the given index, in the order it was set, or '' when there is none (matches the
   * DOM's CSSStyleDeclaration, which is array-like).
   * @param {number} index
   * @returns {string}
   */
      item (index) {
        return Array.from(this.properties.keys())[index] || ''
      }

      /**
   * The value of the given property, or '' when it is not set.
   * @param {string} property A CSS property name (kebab-case, e.g. "background-color")
   * @returns {string}
   */
      getPropertyValue (property) {
        const entry = this.properties.get(property)
        return entry ? entry.value : ''
      }

      /**
   * "important" when the property was set with !important, otherwise ''.
   * @param {string} property A CSS property name (kebab-case)
   * @returns {string}
   */
      getPropertyPriority (property) {
        const entry = this.properties.get(property)
        return entry ? entry.priority : ''
      }

      /**
   * Set a property's value (and optionally its priority). An empty, null or undefined value removes the property
   * instead, like the DOM.
   * @param {string} property A CSS property name (kebab-case)
   * @param {string} value The value, or '' to remove the property
   * @param {string} [priority=''] "important" to mark it !important
   * @returns {undefined}
   */
      setProperty (property, value, priority = '') {
        if (value === '' || value === null || typeof value === 'undefined') {
          this.removeProperty(property)
          return
        }
        this.properties.set(property, {
          value: String(value),
          priority
        })
      }

      /**
   * Remove a property, returning the value it had (or '' when it was not set).
   * @param {string} property A CSS property name (kebab-case)
   * @returns {string}
   */
      removeProperty (property) {
        const value = this.getPropertyValue(property)
        this.properties.delete(property)
        return value
      }

      /**
   * All the declarations as one CSS text string.
   * @returns {string}
   */
      get cssText () {
        return Array.from(this.properties.entries()).map(([property, {
          value,
          priority
        }]) => `${property}: ${value}${priority ? ` !${priority}` : ''};`).join(' ')
      }

      /**
   * Replace every declaration by parsing a CSS text string ("color: red; font-size: 12px !important;").
   * @param {string} cssText
   * @returns {undefined}
   */
      set cssText (cssText) {
        this.properties.clear()
        String(cssText || '').split(';').forEach(declaration => {
          const colon = declaration.indexOf(':')
          if (colon < 0) {
            return
          }
          const property = declaration.slice(0, colon).trim()
          let value = declaration.slice(colon + 1).trim()
          let priority = ''
          const important = value.match(/!\s*important\s*$/i)
          if (important && typeof important.index === 'number') {
            priority = 'important'
            value = value.slice(0, important.index).trim()
          }
          if (property && value) {
            this.properties.set(property, {
              value,
              priority
            })
          }
        })
      }
    }
    exports.CSSStyleDeclarationService = CSSStyleDeclarationService
    exports.default = CSSStyleDeclarationService
  }, { 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.for-each.js': 197, 'core-js/modules/esnext.iterator.map.js': 198, 'core-js/modules/esnext.map.delete-all.js': 201, 'core-js/modules/esnext.map.every.js': 202, 'core-js/modules/esnext.map.filter.js': 203, 'core-js/modules/esnext.map.find-key.js': 204, 'core-js/modules/esnext.map.find.js': 205, 'core-js/modules/esnext.map.includes.js': 206, 'core-js/modules/esnext.map.key-of.js': 207, 'core-js/modules/esnext.map.map-keys.js': 208, 'core-js/modules/esnext.map.map-values.js': 209, 'core-js/modules/esnext.map.merge.js': 210, 'core-js/modules/esnext.map.reduce.js': 211, 'core-js/modules/esnext.map.some.js': 212, 'core-js/modules/esnext.map.update.js': 213 }],
  24: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.CustomEventService = void 0
    /**
 * @file Substitute for the DOM CustomEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const EventService_1 = require('./EventService')
    /**
 * Simulate the behaviour of the CustomEvent Class when there is no DOM available: an event which carries data.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments EventService
 * @property {*} detail
 */
    class CustomEventService extends EventService_1.EventService {
      /**
   * @param {string} [typeArg=''] The type of the event
   * @param {CustomEventInit} [init={}] The options for the event
   * @constructor
   */
      constructor (typeArg = '', init = {}) {
        super(typeArg, init)
        this.eventDetail = typeof init.detail === 'undefined' ? null : init.detail
      }

      get detail () {
        return this.eventDetail
      }
    }
    exports.CustomEventService = CustomEventService
  }, { './EventService': 29 }],
  25: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.filter.js')
    require('core-js/modules/esnext.iterator.for-each.js')
    require('core-js/modules/esnext.iterator.map.js')
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.DOMTokenListService = void 0
    /**
 * Simulate the behaviour of the DOMTokenList Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
    class DOMTokenListService {
      /**
   * @param {string} [value=''] The space separated tokens to start with
   * @param {function(string): void} [onChange] Called with the new value whenever the tokens change
   * @constructor
   */
      constructor (value = '', onChange = () => undefined) {
        this.tokens = DOMTokenListService.parse(value)
        this.onChange = onChange
      }

      static parse (value) {
        return (value || '').split(/\s+/).filter((token, index, tokens) => token !== '' && tokens.indexOf(token) === index)
      }

      update (tokens) {
        this.tokens = tokens
        this.onChange(this.value)
      }

      static validate (token) {
        if (token === '') {
          throw new SyntaxError('The token provided must not be empty.')
        }
        if (/\s/.test(token)) {
          throw new Error('The token provided contains whitespace.')
        }
      }

      get length () {
        return this.tokens.length
      }

      get value () {
        return this.tokens.join(' ')
      }

      set value (value) {
        this.update(DOMTokenListService.parse(value))
      }

      item (index) {
        return index >= 0 && index < this.tokens.length ? this.tokens[index] : null
      }

      contains (token) {
        return this.tokens.indexOf(token) >= 0
      }

      add (...tokens) {
        tokens.forEach(DOMTokenListService.validate)
        this.update(this.tokens.concat(tokens).filter((token, index, all) => all.indexOf(token) === index))
      }

      remove (...tokens) {
        tokens.forEach(DOMTokenListService.validate)
        this.update(this.tokens.filter(token => tokens.indexOf(token) < 0))
      }

      replace (oldToken, newToken) {
        DOMTokenListService.validate(oldToken)
        DOMTokenListService.validate(newToken)
        if (!this.contains(oldToken)) {
          return false
        }
        this.update(this.tokens.map(token => token === oldToken ? newToken : token).filter((token, index, all) => all.indexOf(token) === index))
        return true
      }

      supports (token) {
        // There is no list of supported tokens for arbitrary attributes, so like the DOM (for those) this is unsupported
        throw new TypeError(`Failed to execute 'supports' on 'DOMTokenList': DOMTokenList has no supported tokens (${token}).`)
      }

      toggle (token, force) {
        DOMTokenListService.validate(token)
        const shouldHave = typeof force === 'boolean' ? force : !this.contains(token)
        if (shouldHave) {
          this.add(token)
        } else {
          this.remove(token)
        }
        return shouldHave
      }

      entries () {
        return this.tokens.map((token, index) => [index, token])[Symbol.iterator]()
      }

      forEach (callback, thisArg) {
        this.tokens.forEach((token, index) => callback.call(thisArg, token, index, this))
      }

      keys () {
        return this.tokens.map((token, index) => index)[Symbol.iterator]()
      }

      values () {
        return this.tokens.slice()[Symbol.iterator]()
      }
    }
    exports.DOMTokenListService = DOMTokenListService
  }, { 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.filter.js': 195, 'core-js/modules/esnext.iterator.for-each.js': 197, 'core-js/modules/esnext.iterator.map.js': 198 }],
  26: [function (require, module, exports) {
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
    exports.DocumentFragmentService = void 0
    const NodeService_1 = require('./NodeService')
    const getElementById_1 = __importDefault(require('../functions/getElementById'))
    /**
 * Simulate the behaviour of the DocumentFragment Class when there is no DOM available: a container for nodes which is
 * not part of a tree, when it is inserted its children are moved into the tree instead.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
    class DocumentFragmentService extends NodeService_1.NodeService {
      get nodeName () {
        return '#document-fragment'
      }

      get nodeType () {
        return NodeService_1.NodeService.DOCUMENT_FRAGMENT_NODE
      }

      /**
   * The first element, in tree order, whose id matches the given value, or null when there is none (the DOM's
   * NonElementParentNode mixin, which Document and DocumentFragment both implement).
   * @param {string} id
   * @returns {PseudoElement|null}
   */
      getElementById (id) {
        return (0, getElementById_1.default)(this, id)
      }
    }
    exports.DocumentFragmentService = DocumentFragmentService
  }, { '../functions/getElementById': 17, './NodeService': 38 }],
  27: [function (require, module, exports) {
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
    exports.DocumentService = void 0
    const NodeService_1 = require('./NodeService')
    const HTMLElementService_1 = require('./HTMLElementService')
    const DocumentFragmentService_1 = require('./DocumentFragmentService')
    const getElementById_1 = __importDefault(require('../functions/getElementById'))
    /**
 * Simulate the behaviour of the Document Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
    class DocumentService extends NodeService_1.NodeService {
      get nodeName () {
        return '#document'
      }

      get nodeType () {
        return NodeService_1.NodeService.DOCUMENT_NODE
      }

      // A document has no text of its own, and setting it does nothing
      get textContent () {
        return null
      }

      set textContent (text) {}
      /**
   * The first element, in tree order, whose id matches the given value, or null when there is none.
   * @param {string} id
   * @returns {PseudoElement|null}
   */
      getElementById (id) {
        return (0, getElementById_1.default)(this, id)
      }

      /**
   * Make an element of the given type which belongs to this document but is not added anywhere until it is appended.
   * @param {string} [tagName='div'] The type of element to create
   * @returns {PseudoElement}
   */
      createElement (tagName = 'div') {
        // Like the DOM, the new element is not added anywhere: it has no parent until it is appended
        const element = new HTMLElementService_1.HTMLElementService({
          tagName
        })
        element.ownerDocumentStore = this
        return element
      }

      /**
   * Make a text node which belongs to this document.
   * @param {string} [data=''] The text
   * @returns {TextService}
   */
      createTextNode (data = '') {
        const text = new NodeService_1.TextService(data)
        text.ownerDocumentStore = this
        return text
      }

      /**
   * Make a comment which belongs to this document.
   * @param {string} [data=''] The comment
   * @returns {CommentService}
   */
      createComment (data = '') {
        const comment = new NodeService_1.CommentService(data)
        comment.ownerDocumentStore = this
        return comment
      }

      /**
   * Make an empty document fragment which belongs to this document, a container for nodes which can be built up and
   * then inserted in one go.
   * @returns {DocumentFragmentService}
   */
      createDocumentFragment () {
        const fragment = new DocumentFragmentService_1.DocumentFragmentService()
        fragment.ownerDocumentStore = this
        return fragment
      }
    }
    exports.DocumentService = DocumentService
  }, { '../functions/getElementById': 17, './DocumentFragmentService': 26, './HTMLElementService': 33, './NodeService': 38 }],
  28: [function (require, module, exports) {
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

      /**
   * The local part of the element's qualified name. There is no real namespace parsing here, so this is always the
   * same as tagName.
   * @returns {string}
   */
      get localName () {
        return this.tag
      }

      /**
   * The element's namespace prefix, or null when it has none. There is no real namespace parsing here, so this is
   * always null.
   * @returns {string|null}
   */
      get prefix () {
        return null
      }

      /**
   * The HTML markup of this element's children. Only the getter is here (the setter, which needs to build new
   * elements from parsed HTML, is on HTMLElementService - see its class comment).
   * @returns {string}
   */
      get innerHTML () {
        return (0, serializeHTML_1.serializeChildren)(this)
      }

      /**
   * The HTML markup of this element itself, including its children. Only the getter is here (see innerHTML).
   * @returns {string}
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
   * @returns {Function}
   */
      /**
   * A live view of this element's element children (text, comments and the like are not included).
   * @returns {PseudoHTMLCollection}
   */
      get children () {
        return new HTMLCollectionService_1.HTMLCollectionService(this)
      }

      /**
   * How many element children this element has.
   * @returns {number}
   */
      get childElementCount () {
        return this.children.length
      }

      /**
   * The first child of this element which is an element, or null when there is none.
   * @returns {PseudoElement|null}
   */
      get firstElementChild () {
        return this.children.item(0)
      }

      /**
   * The last child of this element which is an element, or null when there is none.
   * @returns {PseudoElement|null}
   */
      get lastElementChild () {
        const elementChildren = this.children
        return elementChildren.item(elementChildren.length - 1)
      }

      /**
   * The sibling after this one which is an element, or null when there is none.
   * @returns {PseudoElement|null}
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
   * @returns {PseudoElement|null}
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
   * @param {string} position beforebegin, afterbegin, beforeend or afterend
   * @param {ElementService} element The element to insert
   * @returns {ElementService|null} The inserted element, or null when the position needed a parent this element does not have
   * @throws {Error} When the position is not one of the four above
   */
      insertAdjacentElement (position, element) {
        return this.insertAdjacent(position, element)
      }

      /**
   * Put text at a position relative to this element, the same as insertAdjacentElement but the text becomes a text node.
   * @param {string} position beforebegin, afterbegin, beforeend or afterend
   * @param {string} text The text to insert
   * @throws {Error} When the position is not one of the four above
   */
      insertAdjacentText (position, text) {
        this.insertAdjacent(position, text)
      }

      /**
   * Shared implementation for insertAdjacentElement / insertAdjacentText.
   * @param {string} position beforebegin, afterbegin, beforeend or afterend
   * @param {PseudoNode|string} node The node (or text) to insert
   * @returns {PseudoNode|null} The inserted node, or null when the position needed a parent this element does not have
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
   * @param {string} position beforebegin, afterbegin, beforeend or afterend
   * @param {string} text The markup which would be parsed
   * @throws {Error}
   */
      insertAdjacentHTML (position, text) {
        throw new Error('ElementService.insertAdjacentHTML() is not implemented yet.')
      }

      /**
   * Whether this element itself (not its descendants) matches the given CSS selector.
   * @param {string} selectors A CSS selector
   * @returns {boolean}
   */
      matches (selectors) {
        return (0, query_1.matches)(this, selectors)
      }

      /**
   * The nearest ancestor of this element (starting with this element itself) which matches the CSS selector, or
   * null when none of them do.
   * @param {string} selectors A CSS selector
   * @returns {PseudoElement|null}
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

      /**
   * The name of every attribute on the element, in the order they were set.
   * @returns {Array<string>}
   */
      getAttributeNames () {
        return this.currentAttributes().map(({
          name
        }) => name)
      }

      /**
   * Whether the element has any attributes at all.
   * @returns {boolean}
   */
      hasAttributes () {
        return this.attributeList.length > 0
      }

      /**
   * Add the attribute (with an empty value) when it is not present, or remove it when it is - unless force says
   * which of those to do instead. Returns whether the attribute is present after the call.
   * @param {string} attributeName
   * @param {boolean} [force]
   * @returns {boolean}
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
   * @returns {DOMRect}
   */
      getBoundingClientRect () {
        return this.boundingClientRect
      }

      /**
   * The bounding rectangles for each line of text in the element, settable directly - there is no layout engine
   * here to compute it.
   * @returns {Array<DOMRect>}
   */
      getClientRects () {
        return this.clientRects
      }

      /**
   * The Animation objects currently active on the element, settable directly - there is no animation engine here.
   * @returns {Array<*>}
   */
      getAnimations () {
        return this.animations
      }

      /**
   * Whether the element is expected to be visible, settable directly - there is no rendering here to check it.
   * @returns {boolean}
   */
      checkVisibility () {
        return this.isVisible
      }

      /**
   * A read-only view of the element's own inline style declarations (there is no CSS cascade here, so this is not a
   * real computed style - just what the element's own style object holds).
   * @returns {{get: function(string): (string|undefined)}}
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
   * @param {number} pointerId
   * @returns {boolean}
   */
      hasPointerCapture (pointerId) {
        return this.capturedPointers.has(pointerId)
      }

      /**
   * Give this element capture of the given pointer.
   * @param {number} pointerId
   * @returns {undefined}
   */
      setPointerCapture (pointerId) {
        this.capturedPointers.add(pointerId)
      }

      /**
   * Release this element's capture of the given pointer, if it had it.
   * @param {number} pointerId
   * @returns {undefined}
   */
      releasePointerCapture (pointerId) {
        this.capturedPointers.delete(pointerId)
      }

      /**
   * Scroll to the given position (or, given an options object, the position(s) it has). There is no real scrollable
   * viewport here: this just sets scrollLeft / scrollTop.
   * @param {number|{left: number, top: number}} [x=0]
   * @param {number} [y=0]
   * @returns {undefined}
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
   * @param {number|{left: number, top: number}} [x=0]
   * @param {number} [y=0]
   * @returns {undefined}
   */
      scrollTo (x = 0, y = 0) {
        this.scroll(x, y)
      }

      /**
   * Scroll by the given amount, relative to the current position.
   * @param {number|{left: number, top: number}} [x=0]
   * @param {number} [y=0]
   * @returns {undefined}
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
   * @returns {undefined}
   */
      scrollIntoView () {}
      /**
   * Asynchronously ask for the element to be shown fullscreen. There is no real fullscreen here, so this just
   * resolves, like a browser granting the request would.
   * @returns {Promise<void>}
   */
      requestFullscreen () {
        return Promise.resolve()
      }

      /**
   * Asynchronously ask for the pointer to be locked to this element. There is no real pointer lock here, so this
   * just resolves, like a browser granting the request would.
   * @returns {Promise<void>}
   */
      requestPointerLock () {
        return Promise.resolve()
      }

      /**
   * Attach a shadow tree to this element and return its ShadowRoot. Throws when it already hosts one.
   * @param {{mode: string}} options
   * @returns {PseudoShadowRoot}
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
   * @returns {PseudoShadowRoot|null}
   */
      get shadowRoot () {
        return this.shadowRootInstance && this.shadowRootInstance.mode === 'open' ? this.shadowRootInstance : null
      }

      /**
   * Read one of the aria-* reflected properties (see the individual aria* getters/setters below).
   * @param {string} attributeName A real aria-* attribute name (aria-label, ...)
   * @returns {string}
   */
      getAriaAttribute (attributeName) {
        return this.getAttribute(attributeName) || ''
      }

      /**
   * Write one of the aria-* reflected properties.
   * @param {string} attributeName A real aria-* attribute name (aria-label, ...)
   * @param {string} value
   * @returns {undefined}
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
  }, { '../factories/createEvent': 5, '../factories/query': 14, '../factories/serializeHTML': 15, '../functions/getParentNodesFromAttribute': 19, './AttrService': 22, './DOMTokenListService': 25, './HTMLCollectionService': 32, './NamedNodeMapService': 37, './NodeService': 38, './ShadowRootService': 40, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.every.js': 194, 'core-js/modules/esnext.iterator.find.js': 196, 'core-js/modules/esnext.iterator.for-each.js': 197, 'core-js/modules/esnext.iterator.map.js': 198, 'core-js/modules/esnext.iterator.some.js': 200, 'core-js/modules/esnext.set.add-all.js': 214, 'core-js/modules/esnext.set.delete-all.js': 215, 'core-js/modules/esnext.set.difference.js': 216, 'core-js/modules/esnext.set.every.js': 217, 'core-js/modules/esnext.set.filter.js': 218, 'core-js/modules/esnext.set.find.js': 219, 'core-js/modules/esnext.set.intersection.js': 220, 'core-js/modules/esnext.set.is-disjoint-from.js': 221, 'core-js/modules/esnext.set.is-subset-of.js': 222, 'core-js/modules/esnext.set.is-superset-of.js': 223, 'core-js/modules/esnext.set.join.js': 224, 'core-js/modules/esnext.set.map.js': 225, 'core-js/modules/esnext.set.reduce.js': 226, 'core-js/modules/esnext.set.some.js': 227, 'core-js/modules/esnext.set.symmetric-difference.js': 228, 'core-js/modules/esnext.set.union.js': 229, 'si-funciona/dist/helpers/objects/cloneObject': 263, 'si-funciona/dist/helpers/objects/isEqual': 265 }],
  29: [function (require, module, exports) {
    'use strict'

    /**
 * @file Substitute for the DOM Event Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.EventService = void 0
    /**
 * Simulate the behaviour of the Event Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {number} NONE
 * @property {number} CAPTURING_PHASE
 * @property {number} AT_TARGET
 * @property {number} BUBBLING_PHASE
 * @property {boolean} bubbles - A Boolean indicating whether the event bubbles up through the Dom or not.
 * @property {boolean} cancelable - A Boolean indicating whether the event is cancelable.
 * @property {boolean} composed - A Boolean value indicating whether the event can bubble across the boundary
 * between the shadow Dom and the regular Dom.
 * @property {function|PseudoEventTarget} currentTarget - A reference to the currently registered target for the event. This
 * is the object to which the event is currently slated to be sent; it's possible this has been changed along the way
 * through re-targeting.
 * @property {boolean} defaultPrevented - Indicates whether event.preventDefault() has been called on the event.
 * @property {boolean} immediatePropagationStopped - Flag that no further propagation should occur, including on current
 * target.
 * @property {boolean} propagationStopped - Flag that no further propagation should occur.
 * @property {int} eventPhase - Indicates which phase of the event flow is being processed. Uses EventService constants.
 * @property {EventTarget|PseudoEventTarget} target - A reference to the target to which the event was originally
 * dispatched.
 * @property {int} timeStamp - The time at which the event was created (in milliseconds). By specification, this
 * value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this
 * to be a DomHighResTimeStamp instead.
 * @property {string} type - The name of the event (case-insensitive).
 * @property {boolean} isTrusted - Indicates whether the event was initiated by the browser (after a user
 * click for instance) or by a script (using an event creation method, like event.initEvent)
 */
    class EventService {
      /**
   *
   * @param {string} typeArg
   * @param {Object} [eventOptions={}]
   * @param {boolean} [eventOptions.bubbles=false]
   * @param {boolean} [eventOptions.cancelable=false]
   * @param {boolean} [eventOptions.composed=false]
   * @constructor
   */
      constructor (typeArg = '', {
        bubbles = false,
        cancelable = false,
        composed = false
      } = {}) {
        this.properties = {
          bubbles: false,
          cancelable: false,
          composed: false,
          currentTarget: null,
          defaultPrevented: false,
          immediatePropagationStopped: false,
          propagationStopped: false,
          eventPhase: 0,
          target: null,
          timeStamp: Math.floor(Date.now() / 1000),
          type: '',
          isTrusted: false,
          dispatching: false,
          inPassiveListener: false,
          path: []
        }
        this.setReadOnlyProperties({
          type: typeArg,
          bubbles,
          cancelable,
          composed
        })
      }

      get bubbles () {
        return this.properties.bubbles
      }

      get cancelable () {
        return this.properties.cancelable
      }

      get composed () {
        return this.properties.composed
      }

      get currentTarget () {
        return this.properties.currentTarget
      }

      get defaultPrevented () {
        return this.properties.defaultPrevented
      }

      get eventPhase () {
        return this.properties.eventPhase
      }

      get isTrusted () {
        return this.properties.isTrusted
      }

      get target () {
        return this.properties.target
      }

      get timeStamp () {
        return this.properties.timeStamp
      }

      get type () {
        return this.properties.type
      }

      /**
   * Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.
   * @returns {EventInner}
   */
      get inner () {
        const self = this
        return {
          get currentTarget () {
            return self.properties.currentTarget
          },
          set currentTarget (target) {
            self.properties.currentTarget = target
          },
          get eventPhase () {
            return self.properties.eventPhase
          },
          set eventPhase (phase) {
            self.properties.eventPhase = phase
          },
          get target () {
            return self.properties.target
          },
          set target (target) {
            self.properties.target = target
          },
          get immediatePropagationStopped () {
            return self.properties.immediatePropagationStopped
          },
          get propagationStopped () {
            return self.properties.propagationStopped
          },
          get trusted () {
            return self.properties.isTrusted
          },
          set trusted (trusted) {
            self.properties.isTrusted = trusted
          },
          get dispatching () {
            return self.properties.dispatching
          },
          set dispatching (dispatching) {
            self.properties.dispatching = dispatching
          },
          get inPassiveListener () {
            return self.properties.inPassiveListener
          },
          set inPassiveListener (passive) {
            self.properties.inPassiveListener = passive
          },
          get path () {
            return self.properties.path
          },
          set path (path) {
            self.properties.path = path
          },
          finishDispatch () {
            self.setReadOnlyProperties({
              currentTarget: null,
              eventPhase: EventService.NONE,
              path: [],
              dispatching: false,
              inPassiveListener: false,
              propagationStopped: false,
              immediatePropagationStopped: false
            })
          }
        }
      }

      /**
   * Return an array of targets that will have the event executed open them. The order is based on the eventPhase
   * @method
   * @returns {Array.<PseudoEventTarget>}
   */
      composedPath () {
        // While the event is being dispatched this is every target it travels through, the target first and the root last
        return this.properties.dispatching ? this.properties.path.slice() : []
      }

      /**
   * Cancels the event (if it is cancelable).
   * @method
   * @returns {null}
   */
      preventDefault () {
        // Only an event which can be cancelled can be prevented, and a passive listener cannot prevent the default
        if (this.cancelable && !this.properties.inPassiveListener) {
          this.setReadOnlyProperties({
            defaultPrevented: true
          })
        }
        return null
      }

      /**
   * For this particular event, no other listener will be called.
   * Neither those attached on the same element, nor those attached on elements which will be traversed later (in
   * capture phase, for instance)
   * @method
   * @returns {null}
   */
      stopImmediatePropagation () {
        this.setReadOnlyProperties({
          immediatePropagationStopped: true
        })
        return null
      }

      /**
   * Stops the propagation of events further along in the Dom.
   * @method
   * @returns {null}
   */
      stopPropagation () {
        this.setReadOnlyProperties({
          propagationStopped: true
        })
        return null
      }

      setReadOnlyProperties (updateProps = {}) {
        this.properties = Object.assign({}, this.properties, updateProps)
        return this
      }
    }
    exports.EventService = EventService
    EventService.NONE = 0
    EventService.CAPTURING_PHASE = 1
    EventService.AT_TARGET = 2
    EventService.BUBBLING_PHASE = 3
  }, {}],
  30: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.filter.js')
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
    /**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const EventService_1 = require('./EventService')
    const PseudoEventListener_1 = __importDefault(require('../classes/PseudoEventListener'))
    const getParentNodes_1 = __importDefault(require('../functions/getParentNodes'))
    const LinkedList_1 = require('collect-your-stuff/dist/collections/linked-list/LinkedList')
    /**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * Dispatching an event sends it through the tree the way the DOM does: down from the root to the target (capture
 * listeners), to the target itself, then back up to the root (the listeners which are not capture listeners, when the
 * event bubbles).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {Object.<string, Array.<PseudoEventListener>>} listeners
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */
    class EventTargetService {
      /**
   * @constructor
   */
      constructor () {
        this.listeners = {}
        this.defaultEvent = {}
      }

      /**
   * The listeners registered for a type of event, creating the (empty) list of them when there are none yet.
   * @param {string} type
   * @returns {LinkedList}
   */
      listenersFor (type) {
        if (!(type in this.listeners)) {
          this.listeners[type] = new LinkedList_1.LinkedList()
        }
        return this.listeners[type]
      }

      /**
   * Run the listeners registered on this target for the type of the event which apply to the phase the event is in
   * (at the target, the capture listeners run before the others). Listeners which are added while this runs do not run
   * for this event, and listeners which are removed while it runs no longer do. Running stops as soon as immediate
   * propagation is stopped. A listener which throws does not stop the others.
   * @param {EventService} event The event, which is at a phase and has a current target
   * @returns {Array<*>} The errors which the listeners threw
   */
      runEvents (event) {
        const errors = []
        if (!(event.type in this.listeners)) {
          return errors
        }
        const listeners = Array.from(this.listeners[event.type]).map(linker => linker.data)
        // At the target the capture listeners come first, otherwise the order is the order they were added
        const ordered = event.eventPhase === EventService_1.EventService.AT_TARGET ? listeners.filter(listener => listener.capture).concat(listeners.filter(listener => !listener.capture)) : listeners
        for (const listener of ordered) {
          if (event.inner.immediatePropagationStopped) {
            break
          }
          if (listener.rejectEvent(event)) {
            continue
          }
          if (listener.once) {
            this.removeListener(event.type, listener)
          }
          event.inner.inPassiveListener = listener.passive
          try {
            listener.handleEvent(event)
          } catch (error) {
            errors.push(error)
          }
          event.inner.inPassiveListener = false
        }
        return errors
      }

      /**
   * Take a listener out of the registered listeners, so that it does not run again.
   * @param {string} type
   * @param {PseudoEventListener} listener
   */
      removeListener (type, listener) {
        listener.removed = true
        const registered = this.listeners[type]
        Array.from(registered).filter(linker => linker.data === listener).forEach(linker => registered.remove(linker))
      }

      /**
   * Register the function to run when nothing else has prevented the default for this type of event.
   * @param {string} type
   * @param {Function} callback
   */
      setDefaultEvent (type, callback) {
        this.listenersFor(type)
        this.defaultEvent[type] = callback
      }

      /**
   * Registers an event handler of a specific event type. Adding the same handler again for the same type and phase does
   * nothing, like the DOM.
   * @param {string} type The type of event to listen for
   * @param {Function|Object} callback The function to call (or an object with a handleEvent function)
   * @param {Object|boolean} [useCapture=false] Listen while the event travels down to the target (true), or an object with capture, once and passive
   */
      addEventListener (type, callback, useCapture = false) {
        let options = {
          capture: false,
          once: false,
          passive: false
        }
        if (typeof useCapture === 'object' && useCapture !== null) {
          // Originally useCapture was a single boolean flag, later optional other flags can be used
          // Here we take all the given flags from the object and assign them as the options
          options = Object.assign(options, useCapture)
        } else {
          options.capture = !!useCapture
        }
        const listeners = this.listenersFor(type)
        const alreadyAdded = Array.from(listeners).some(linker => linker.data.callback === callback && linker.data.capture === options.capture)
        if (alreadyAdded) {
          return
        }
        // A function runs with this target as this, an object runs its handleEvent as itself
        const handler = typeof callback === 'function' ? callback.bind(this) : callback.handleEvent.bind(callback)
        const listener = new PseudoEventListener_1.default(type, options, handler, callback)
        // Listeners run in the order they were added, except that listeners which are not defaults always come before the defaults
        const firstDefault = Array.from(listeners).find(linker => linker.data.isDefault)
        if (firstDefault && !listener.isDefault) {
          listeners.insertBefore(firstDefault, listener)
        } else {
          listeners.append(listener)
        }
      }

      /**
   * Removes an event listener, the one which was added with the same type, handler and phase.
   * @param {string} type The type of event
   * @param {Function|Object} callback The handler which was added
   * @param {Object|boolean} [options=false] Whether the listener was a capture listener (true), or an object with capture
   */
      removeEventListener (type, callback, options = false) {
        if (!(type in this.listeners)) {
          return
        }
        const capture = typeof options === 'object' && options !== null ? !!options.capture : !!options
        Array.from(this.listeners[type]).map(linker => linker.data).filter(listener => !listener.isDefault && listener.callback === callback && listener.capture === capture).forEach(listener => this.removeListener(type, listener))
      }

      /**
   * Dispatches an event to this target and through the tree: capture listeners of the ancestors from the root down,
   * then the listeners of this target, then (when the event bubbles) the other listeners of the ancestors from the
   * parent up to the root. stopPropagation() stops it reaching further targets, stopImmediatePropagation() also stops
   * the remaining listeners of the current target. Afterwards, unless the default was prevented, the default action
   * of this target (see setDefaultEvent) runs. The event can be dispatched again afterwards.
   * @param {EventService} event The event to dispatch
   * @returns {boolean} False when the event was cancelable and a listener prevented the default, otherwise true
   * @throws {Error} When the event is already being dispatched, or (after the whole dispatch has finished) the error
   * which a listener threw (an error with all of them in its errors property when several did)
   */
      dispatchEvent (event) {
        if (event.inner.dispatching) {
          throw new Error('The event is already being dispatched.')
        }
        event.inner.dispatching = true
        event.inner.target = this
        // The ancestors, the root first, which can have listeners
        const ancestors = (0, getParentNodes_1.default)(this).filter(node => node instanceof EventTargetService)
        event.inner.path = [this].concat(ancestors.slice().reverse())
        const errors = []
        const visit = (target, phase) => {
          event.inner.eventPhase = phase
          event.inner.currentTarget = target
          errors.push(...target.runEvents(event))
        }
        for (const ancestor of ancestors) {
          if (event.inner.propagationStopped) {
            break
          }
          visit(ancestor, EventService_1.EventService.CAPTURING_PHASE)
        }
        if (!event.inner.propagationStopped) {
          visit(this, EventService_1.EventService.AT_TARGET)
        }
        if (event.bubbles) {
          for (const ancestor of ancestors.slice().reverse()) {
            if (event.inner.propagationStopped) {
              break
            }
            visit(ancestor, EventService_1.EventService.BUBBLING_PHASE)
          }
        }
        event.inner.finishDispatch()
        if (!event.defaultPrevented && typeof this.defaultEvent[event.type] === 'function') {
          try {
            this.defaultEvent[event.type](event)
          } catch (error) {
            errors.push(error)
          }
        }
        if (errors.length === 1) {
          throw errors[0]
        }
        if (errors.length > 1) {
          throw Object.assign(new Error(`${errors.length} listeners threw an error while dispatching the ${event.type} event.`), {
            errors
          })
        }
        return !event.defaultPrevented
      }
    }
    exports.default = EventTargetService
  }, { '../classes/PseudoEventListener': 1, '../functions/getParentNodes': 18, './EventService': 29, 'collect-your-stuff/dist/collections/linked-list/LinkedList': 50, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.filter.js': 195, 'core-js/modules/esnext.iterator.find.js': 196, 'core-js/modules/esnext.iterator.for-each.js': 197, 'core-js/modules/esnext.iterator.map.js': 198, 'core-js/modules/esnext.iterator.some.js': 200 }],
  31: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.FocusEventService = void 0
    /**
 * @file Substitute for the DOM FocusEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const UIEventService_1 = require('./UIEventService')
    /**
 * Simulate the behaviour of the FocusEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {PseudoEventTarget|null} relatedTarget
 */
    class FocusEventService extends UIEventService_1.UIEventService {
      /**
   * @param {string} [typeArg=''] The type of the event
   * @param {FocusEventInit} [init={}] The options for the event
   * @constructor
   */
      constructor (typeArg = '', init = {}) {
        super(typeArg, init)
        this.related = init.relatedTarget || null
      }

      get relatedTarget () {
        return this.related
      }
    }
    exports.FocusEventService = FocusEventService
  }, { './UIEventService': 41 }],
  32: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.find.js')
    require('core-js/modules/esnext.iterator.for-each.js')
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.HTMLCollectionService = void 0
    /**
 * @file Substitute for the DOM HTMLCollection Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const NodeService_1 = require('./NodeService')
    /**
 * Simulate the behaviour of the HTMLCollection Class when there is no DOM available: a live view of some of a node's
 * element descendants, recomputed each time it is used rather than kept in sync as they change.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
    class HTMLCollectionService {
      /**
   * @param {NodeService} owner The node this is a live view of a part of
   * @param {function(*): boolean} [predicate] Only elements which pass this are included (every element by default)
   * @param {boolean} [deep=false] Include every matching descendant (true, like getElementsByTagName), not just the
   * direct element children (false, like Element.children)
   * @constructor
   */
      constructor (owner, predicate = () => true, deep = false) {
        this.owner = owner
        this.predicate = predicate
        this.deep = deep
      }

      /**
   * The current elements the collection holds, in tree order.
   * @returns {Array<PseudoNode>}
   */
      elements () {
        const results = []
        const visit = node => {
          Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === NodeService_1.NodeService.ELEMENT_NODE && this.predicate(child)) {
              results.push(child)
            }
            if (this.deep && child.nodeType === NodeService_1.NodeService.ELEMENT_NODE) {
              visit(child)
            }
          })
        }
        visit(this.owner)
        return results
      }

      /**
   * How many elements are in the collection right now.
   * @returns {number}
   */
      get length () {
        return this.elements().length
      }

      /**
   * The element at the given index, or null when there is none.
   * @param {number} index
   * @returns {*}
   */
      item (index) {
        return this.elements()[index] || null
      }

      /**
   * The element whose id, or (failing that) whose name attribute, is the given value, or null when there is none.
   * @param {string} name
   * @returns {*}
   */
      namedItem (name) {
        const elements = this.elements()
        return elements.find(element => element.id === name) || elements.find(element => element.getAttribute('name') === name) || null
      }

      /**
   * Iterate over the current elements.
   * @returns {Iterator}
   */
      [Symbol.iterator] () {
        return this.elements()[Symbol.iterator]()
      }
    }
    exports.HTMLCollectionService = HTMLCollectionService
    exports.default = HTMLCollectionService
  }, { './NodeService': 38, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.find.js': 196, 'core-js/modules/esnext.iterator.for-each.js': 197 }],
  33: [function (require, module, exports) {
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
  }, { '../factories/createDataset': 4, '../factories/createEvent': 5, '../factories/createStyleDeclaration': 6, '../factories/parseHTML': 13, '../functions/activeElement': 16, './ElementService': 28 }],
  34: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.InputEventService = void 0
    /**
 * @file Substitute for the DOM InputEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const UIEventService_1 = require('./UIEventService')
    /**
 * Simulate the behaviour of the InputEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {string|null} data
 * @property {string} inputType
 * @property {boolean} isComposing
 */
    class InputEventService extends UIEventService_1.UIEventService {
      /**
   * @param {string} [typeArg=''] The type of the event
   * @param {InputEventInit} [init={}] The options for the event
   * @constructor
   */
      constructor (typeArg = '', init = {}) {
        super(typeArg, init)
        this.inputData = typeof init.data === 'string' ? init.data : null
        this.kind = init.inputType || ''
        this.composing = !!init.isComposing
      }

      get data () {
        return this.inputData
      }

      get inputType () {
        return this.kind
      }

      get isComposing () {
        return this.composing
      }
    }
    exports.InputEventService = InputEventService
  }, { './UIEventService': 41 }],
  35: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.KeyboardEventService = void 0
    /**
 * @file Substitute for the DOM KeyboardEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const UIEventService_1 = require('./UIEventService')
    const modifierState_1 = require('../functions/modifierState')
    /**
 * Simulate the behaviour of the KeyboardEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {string} key
 * @property {string} code
 * @property {number} location
 * @property {boolean} repeat
 * @property {boolean} isComposing
 */
    class KeyboardEventService extends UIEventService_1.UIEventService {
      /**
   * @param {string} [typeArg=''] The type of the event
   * @param {KeyboardEventInit} [init={}] The options for the event
   * @constructor
   */
      constructor (typeArg = '', init = {}) {
        super(typeArg, init)
        this.keyValue = init.key || ''
        this.keyCode = init.code || ''
        this.keyLocation = init.location || 0
        this.held = !!init.repeat
        this.composing = !!init.isComposing
        this.modifiers = (0, modifierState_1.modifierKeys)(init)
      }

      get key () {
        return this.keyValue
      }

      get code () {
        return this.keyCode
      }

      get location () {
        return this.keyLocation
      }

      get repeat () {
        return this.held
      }

      get isComposing () {
        return this.composing
      }

      get ctrlKey () {
        return this.modifiers.ctrlKey
      }

      get shiftKey () {
        return this.modifiers.shiftKey
      }

      get altKey () {
        return this.modifiers.altKey
      }

      get metaKey () {
        return this.modifiers.metaKey
      }

      /**
   * Whether a modifier key was held down when the event happened.
   * @param {string} key Control, Shift, Alt or Meta
   * @returns {boolean}
   */
      getModifierState (key) {
        return (0, modifierState_1.modifierState)(this.modifiers, key)
      }
    }
    exports.KeyboardEventService = KeyboardEventService
  }, { '../functions/modifierState': 20, './UIEventService': 41 }],
  36: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.MouseEventService = void 0
    /**
 * @file Substitute for the DOM MouseEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const UIEventService_1 = require('./UIEventService')
    const modifierState_1 = require('../functions/modifierState')
    /**
 * Simulate the behaviour of the MouseEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments UIEventService
 * @property {number} screenX
 * @property {number} screenY
 * @property {number} clientX
 * @property {number} clientY
 * @property {number} button
 * @property {number} buttons
 * @property {PseudoEventTarget|null} relatedTarget
 */
    class MouseEventService extends UIEventService_1.UIEventService {
      /**
   * @param {string} [typeArg=''] The type of the event
   * @param {MouseEventInit} [init={}] The options for the event
   * @constructor
   */
      constructor (typeArg = '', init = {}) {
        super(typeArg, init)
        this.position = {
          screenX: init.screenX || 0,
          screenY: init.screenY || 0,
          clientX: init.clientX || 0,
          clientY: init.clientY || 0
        }
        this.modifiers = (0, modifierState_1.modifierKeys)(init)
        this.buttonPressed = init.button || 0
        this.buttonsDown = init.buttons || 0
        this.related = init.relatedTarget || null
      }

      get screenX () {
        return this.position.screenX
      }

      get screenY () {
        return this.position.screenY
      }

      get clientX () {
        return this.position.clientX
      }

      get clientY () {
        return this.position.clientY
      }

      get x () {
        return this.position.clientX
      }

      get y () {
        return this.position.clientY
      }

      get ctrlKey () {
        return this.modifiers.ctrlKey
      }

      get shiftKey () {
        return this.modifiers.shiftKey
      }

      get altKey () {
        return this.modifiers.altKey
      }

      get metaKey () {
        return this.modifiers.metaKey
      }

      get button () {
        return this.buttonPressed
      }

      get buttons () {
        return this.buttonsDown
      }

      get relatedTarget () {
        return this.related
      }

      /**
   * Whether a modifier key was held down when the event happened.
   * @param {string} key Control, Shift, Alt or Meta
   * @returns {boolean}
   */
      getModifierState (key) {
        return (0, modifierState_1.modifierState)(this.modifiers, key)
      }
    }
    exports.MouseEventService = MouseEventService
  }, { '../functions/modifierState': 20, './UIEventService': 41 }],
  37: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.find.js')
    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.NamedNodeMapService = void 0
    /**
 * Simulate the behaviour of the NamedNodeMap Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
    class NamedNodeMapService {
      /**
   * @param {Array<PseudoAttr>} [attributes=[]] The attributes to start with
   * @constructor
   */
      constructor (attributes = []) {
        this.attributes = attributes.slice()
      }

      get length () {
        return this.attributes.length
      }

      getNamedItem (name) {
        return this.attributes.find(attr => attr.name === name) || null
      }

      setNamedItem (attr) {
        const index = this.attributes.findIndex(existing => existing.name === attr.name)
        if (index < 0) {
          this.attributes.push(attr)
          return null
        }
        const replaced = this.attributes[index]
        this.attributes[index] = attr
        return replaced
      }

      removeNamedItem (attrName) {
        const index = this.attributes.findIndex(attr => attr.name === attrName)
        if (index < 0) {
          throw new Error(`The attribute "${attrName}" was not found.`)
        }
        return this.attributes.splice(index, 1)[0]
      }

      item (index) {
        return this.attributes[index] || null
      }

      getNamedItemNS (namespace, localName) {
        return this.attributes.find(attr => attr.namespaceURI === namespace && attr.localName === localName) || null
      }

      setNamedItemNS (attr) {
        const index = this.attributes.findIndex(existing => existing.namespaceURI === attr.namespaceURI && existing.localName === attr.localName)
        if (index < 0) {
          this.attributes.push(attr)
          return null
        }
        const replaced = this.attributes[index]
        this.attributes[index] = attr
        return replaced
      }

      removeNamedItemNS (namespace, localName) {
        const index = this.attributes.findIndex(attr => attr.namespaceURI === namespace && attr.localName === localName)
        if (index < 0) {
          throw new Error(`The attribute "${localName}" in the namespace "${namespace}" was not found.`)
        }
        return this.attributes.splice(index, 1)[0]
      }
    }
    exports.NamedNodeMapService = NamedNodeMapService
  }, { 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.find.js': 196 }],
  38: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.every.js')
    require('core-js/modules/esnext.iterator.filter.js')
    require('core-js/modules/esnext.iterator.for-each.js')
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
    exports.CommentService = exports.TextService = exports.NodeService = void 0
    /**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const generateNodeList_1 = __importDefault(require('../factories/generateNodeList'))
    const TreeLinker_1 = require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker')
    const EventTargetService_1 = __importDefault(require('./EventTargetService'))
    const HTMLCollectionService_1 = require('./HTMLCollectionService')
    const query_1 = require('../factories/query')
    /**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
    class NodeService extends EventTargetService_1.default {
      /**
   *
   * @constructor
   */
      constructor () {
        super()
        this.nodeValueStore = null
        this.ownerDocumentStore = null
        this.nodeId = NodeService.nextNodeId++
        this.nodeNameValue = ''
        this.childList = (0, generateNodeList_1.default)()
        this.parent = null
        this.listLinker = null
      }

      get baseURI () {
        return window.location || '/'
      }

      get childNodes () {
        return this.childList
      }

      get firstChild () {
        return this.childList.first ? this.childList.first.data : null
      }

      get isConnected () {
        // Connected means the tree the node is in has a document at the top
        return this.getRootNode().nodeType === NodeService.DOCUMENT_NODE
      }

      get lastChild () {
        return this.childList.last ? this.childList.last.data : null
      }

      get nextSibling () {
        return this.listLinker && this.listLinker.next ? this.listLinker.next.data : null
      }

      get nodeName () {
        return this.nodeNameValue || ''
      }

      get nodeType () {
        return NodeService.DEFAULT_NODE
      }

      get nodeValue () {
        return this.nodeValueStore
      }

      set nodeValue (value) {
        this.nodeValueStore = value
      }

      get ownerDocument () {
        if (this.nodeType === NodeService.DOCUMENT_NODE) {
          return null
        }
        const root = this.getRootNode()
        return root.nodeType === NodeService.DOCUMENT_NODE ? root : this.ownerDocumentStore
      }

      get parentNode () {
        return this.parent
      }

      get parentElement () {
        return this.parent && this.parent.nodeType === NodeService.ELEMENT_NODE ? this.parent : null
      }

      get previousSibling () {
        return this.listLinker && this.listLinker.prev ? this.listLinker.prev.data : null
      }

      get textContent () {
        if (this.nodeType === NodeService.DOCUMENT_NODE || this.nodeType === NodeService.DOCUMENT_TYPE_NODE) {
          return null
        }
        // The text of everything below, in order (comments and the like do not count)
        let text = ''
        Array.from(this.childNodes).forEach(child => {
          if (child.nodeType === NodeService.TEXT_NODE) {
            text += child.nodeValue
          } else if (child.nodeType !== NodeService.COMMENT_NODE) {
            text += child.textContent
          }
        })
        return text
      }

      set textContent (text) {
        if (this.nodeType === NodeService.DOCUMENT_NODE || this.nodeType === NodeService.DOCUMENT_TYPE_NODE) {
          return
        }
        // All the children are replaced by a single text node (or none for an empty text)
        while (this.firstChild) {
          this.removeChild(this.firstChild)
        }
        if (text !== null && typeof text !== 'undefined' && String(text) !== '') {
          const textNode = new TextService(String(text))
          textNode.ownerDocumentStore = this.ownerDocument
          this.appendChild(textNode)
        }
      }

      /**
   * Add a node as the last child of this node (a node which is already in a tree is moved).
   * @param {PseudoNode} childNode The node to add
   * @returns {PseudoNode} The added node
   */
      appendChild (childNode) {
        return this.insertBefore(childNode, null)
      }

      /**
   * Whether this kind of node can have children (text, comments and attributes cannot).
   * @returns {boolean}
   */
      get acceptsChildren () {
        return true
      }

      /**
   * Make a copy of this node without its children, its parent or its listeners, which is what cloneNode starts from.
   * Kinds of node which are made with arguments override this to give them.
   * @returns {NodeService}
   */
      cloneShallow () {
        const copy = new this.constructor()
        copy.nodeValue = this.nodeValue
        copy.ownerDocumentStore = this.ownerDocumentStore
        return copy
      }

      /**
   * Whether another node of the same type is equal to this one apart from its children, which isEqualNode compares
   * afterwards. Kinds of node with more to compare (an element has attributes) override this.
   * @param {NodeService} other The node to compare with
   * @returns {boolean}
   */
      equalsShallow (other) {
        return this.nodeName === other.nodeName && this.nodeValue === other.nodeValue
      }

      /**
   * Add nodes (strings become text nodes) as the last children of this node, in the order given.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   * @throws {Error} When this kind of node cannot have children
   */
      append (...nodes) {
        nodes.forEach(node => this.appendChild(this.toChildNode(node)))
      }

      /**
   * Add nodes (strings become text nodes) as the first children of this node, in the order given.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   * @throws {Error} When this kind of node cannot have children
   */
      prepend (...nodes) {
        const reference = this.firstChild
        nodes.forEach(node => this.insertBefore(this.toChildNode(node), reference))
      }

      /**
   * Remove every child of this node and put the given nodes (strings become text nodes) in their place, in order.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   * @throws {Error} When this kind of node cannot have children
   */
      replaceChildren (...nodes) {
        while (this.firstChild) {
          this.removeChild(this.firstChild)
        }
        this.append(...nodes)
      }

      /**
   * Add nodes (strings become text nodes) as this node's previous siblings, in order. Does nothing when this node has
   * no parent.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   */
      before (...nodes) {
        const parent = this.parentNode
        if (!parent) {
          return
        }
        nodes.forEach(node => parent.insertBefore(this.toChildNode(node), this))
      }

      /**
   * Add nodes (strings become text nodes) as this node's next siblings, in order. Does nothing when this node has no
   * parent.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to add
   */
      after (...nodes) {
        const parent = this.parentNode
        if (!parent) {
          return
        }
        const reference = this.nextSibling
        nodes.forEach(node => parent.insertBefore(this.toChildNode(node), reference))
      }

      /**
   * Put the given nodes (strings become text nodes) where this node is, in order, then remove this node. Does nothing
   * when this node has no parent.
   * @param {...(PseudoNode|string)} nodes The nodes (or text) to put in this node's place
   */
      replaceWith (...nodes) {
        const parent = this.parentNode
        if (!parent) {
          return
        }
        nodes.forEach(node => parent.insertBefore(this.toChildNode(node), this))
        parent.removeChild(this)
      }

      /**
   * Remove this node from its parent. Does nothing when it has no parent.
   */
      remove () {
        if (this.parentNode) {
          this.parentNode.removeChild(this)
        }
      }

      /**
   * Turn a value given to append / prepend / before / after / replaceWith / replaceChildren into a node: a string
   * becomes a text node belonging to this node's document, anything else is returned as it is.
   * @param {PseudoNode|string} value The value to add
   * @returns {PseudoNode}
   */
      toChildNode (value) {
        if (typeof value !== 'string') {
          return value
        }
        const text = new TextService(value)
        text.ownerDocumentStore = this.ownerDocument
        return text
      }

      /**
   * Every element below this node with the given tag name (or every element when tagName is *), live.
   * @param {string} tagName
   * @returns {PseudoHTMLCollection}
   */
      getElementsByTagName (tagName) {
        const matchesTag = tagName === '*' ? () => true : element => element.tagName === tagName
        return new HTMLCollectionService_1.HTMLCollectionService(this, matchesTag, true)
      }

      /**
   * Every element below this node which has all of the given (space separated) classes, live.
   * @param {string} className
   * @returns {PseudoHTMLCollection}
   */
      getElementsByClassName (className) {
        const names = className.trim().split(/\s+/).filter(Boolean)
        return new HTMLCollectionService_1.HTMLCollectionService(this, element => names.every(name => element.classList.contains(name)), true)
      }

      /**
   * Every element below this node with the given tag name, live. There is no real namespace parsing here, so this
   * ignores the namespace and behaves exactly like getElementsByTagName.
   * @param {string} namespace Ignored
   * @param {string} tagName
   * @returns {PseudoHTMLCollection}
   */
      getElementsByTagNameNS (namespace, tagName) {
        return this.getElementsByTagName(tagName)
      }

      /**
   * The first element below this node which matches the CSS selector, in tree order, or null when there is none.
   * @param {string} selectors A CSS selector
   * @returns {PseudoElement|null}
   */
      querySelector (selectors) {
        return (0, query_1.querySelector)(selectors, this)
      }

      /**
   * Every element below this node which matches the CSS selector, in tree order. A plain array (not a live
   * collection): like the DOM's querySelectorAll, it is a snapshot taken when it is called.
   * @param {string} selectors A CSS selector
   * @returns {Array<PseudoElement>}
   */
      querySelectorAll (selectors) {
        return (0, query_1.querySelectorAll)(selectors, this)
      }

      /**
   * Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
   * (for example elements applying default events) can do so.
   * @param {NodeService} child The node which was inserted
   */
      childInserted (child) {}
      /**
   * Make a copy of this node (without its parent, and without its event listeners). With deep the children are copied
   * too, all the way down.
   * @param {boolean} [deep=false] Copy the children as well
   * @returns {PseudoNode}
   */
      cloneNode (deep = false) {
        const copy = this.cloneShallow()
        if (deep) {
          Array.from(this.childNodes).forEach(child => copy.appendChild(child.cloneNode(true)))
        }
        return copy
      }

      /**
   * Say where another node is in relation to this one, as the bits of NodeService.DOCUMENT_POSITION_*: 0 for this node
   * itself, DISCONNECTED (with IMPLEMENTATION_SPECIFIC and a consistent PRECEDING or FOLLOWING) for a node in another tree,
   * CONTAINS + PRECEDING when the other node is an ancestor, CONTAINED_BY + FOLLOWING when it is a descendant,
   * otherwise PRECEDING or FOLLOWING by their order in the tree.
   * @param {PseudoNode} otherNode The node to locate
   * @returns {number}
   */
      compareDocumentPosition (otherNode) {
        if (otherNode === this) {
          return 0
        }
        const pathFromRoot = node => {
          const path = []
          for (let current = node; current; current = current.parentNode) {
            path.unshift(current)
          }
          return path
        }
        const mine = pathFromRoot(this)
        const theirs = pathFromRoot(otherNode)
        if (mine[0] !== theirs[0]) {
          // Not in the same tree, so there is no real order: use a consistent one (the order the nodes were made in)
          const before = otherNode.nodeId < this.nodeId ? NodeService.DOCUMENT_POSITION_PRECEDING : NodeService.DOCUMENT_POSITION_FOLLOWING
          return NodeService.DOCUMENT_POSITION_DISCONNECTED | NodeService.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC | before
        }
        if (theirs.length < mine.length && theirs.every((node, index) => mine[index] === node)) {
          return NodeService.DOCUMENT_POSITION_CONTAINS | NodeService.DOCUMENT_POSITION_PRECEDING
        }
        if (mine.length < theirs.length && mine.every((node, index) => theirs[index] === node)) {
          return NodeService.DOCUMENT_POSITION_CONTAINED_BY | NodeService.DOCUMENT_POSITION_FOLLOWING
        }
        // The paths part ways at siblings: whichever comes first among them is first in the tree
        let depth = 0
        while (mine[depth] === theirs[depth]) {
          ++depth
        }
        for (let sibling = mine[depth].nextSibling; sibling; sibling = sibling.nextSibling) {
          if (sibling === theirs[depth]) {
            return NodeService.DOCUMENT_POSITION_FOLLOWING
          }
        }
        return NodeService.DOCUMENT_POSITION_PRECEDING
      }

      /**
   * Check whether a node is this node or one of its descendants.
   * @param {PseudoNode|null} otherNode The node to look for
   * @returns {boolean}
   */
      contains (otherNode) {
        let current = otherNode
        while (current) {
          if (current === this) {
            return true
          }
          current = current.parentNode
        }
        return false
      }

      getRootNode (options = {
        composed: false
      }) {
        return this.parent ? this.parent.getRootNode(options) : this
      }

      hasChildNodes () {
        return this.childList.length > 0
      }

      /**
   * Insert a node as a child of this node, before the given child (or at the end when there is none). A node which is
   * already in a tree is moved, and the children of a document fragment are moved in order.
   * @param {PseudoNode} newNode The node to insert
   * @param {PseudoNode|null} [referenceNode=null] The child of this node to insert before, or null to insert at the end
   * @returns {PseudoNode} The inserted node
   * @throws {Error} When the reference node is not a child of this node, or the new node is this node or contains it
   */
      insertBefore (newNode, referenceNode = null) {
        if (!this.acceptsChildren) {
          throw new Error('This kind of node cannot have children.')
        }
        if (referenceNode !== null && referenceNode.parentNode !== this) {
          throw new Error('The node before which the new node is to be inserted is not a child of this node.')
        }
        if (newNode === referenceNode) {
          // Inserting a node before itself leaves it where it is
          return newNode
        }
        if (typeof newNode.contains === 'function' && newNode.contains(this)) {
          throw new Error('The new node cannot be inserted into itself or one of its own descendants.')
        }
        if (newNode.nodeType === NodeService.DOCUMENT_FRAGMENT_NODE) {
          // The children of a fragment are inserted (moved) in order, and the fragment is left empty
          while (newNode.firstChild) {
            this.insertBefore(newNode.firstChild, referenceNode)
          }
          return newNode
        }
        if (newNode.parentNode) {
          // A node can only be in one place, so it is moved from where it was
          newNode.parentNode.removeChild(newNode)
        }
        const linker = new TreeLinker_1.TreeLinker({
          data: newNode
        })
        this.childList.insertBefore(referenceNode ? referenceNode.listLinker : null, linker)
        const inserted = newNode
        inserted.parent = this
        inserted.listLinker = linker
        this.childInserted(inserted)
        return newNode
      }

      isDefaultNamespace (namespaceURI) {
        return namespaceURI === null
      }

      /**
   * Whether another node is the same as this one, by what they hold: the same type, name and value (an element also
   * needs the same attributes), and children which are equal in the same order.
   * @param {PseudoNode|null} otherNode The node to compare with
   * @returns {boolean}
   */
      isEqualNode (otherNode) {
        if (!otherNode || otherNode.nodeType !== this.nodeType || !this.equalsShallow(otherNode)) {
          return false
        }
        const mine = Array.from(this.childNodes)
        const theirs = Array.from(otherNode.childNodes)
        return mine.length === theirs.length && mine.every((child, index) => child.isEqualNode(theirs[index]))
      }

      isSameNode (otherNode) {
        return this === otherNode
      }

      lookupPrefix (namespace) {
        return null
      }

      lookupNamespaceURI (prefix) {
        return null
      }

      /**
   * Tidy the text below this node: neighbouring text nodes are joined into one and empty text nodes are removed.
   */
      normalize () {
        let child = this.firstChild
        while (child) {
          if (child.nodeType === NodeService.TEXT_NODE) {
            // Join the text nodes which follow into this one, and drop it when it is empty
            let text = child.nodeValue
            let following = child.nextSibling
            while (following && following.nodeType === NodeService.TEXT_NODE) {
              text += following.nodeValue
              const after = following.nextSibling
              this.removeChild(following)
              following = after
            }
            child.nodeValue = text
            if (text === '') {
              this.removeChild(child)
            }
            child = following
          } else {
            child.normalize()
            child = child.nextSibling
          }
        }
      }

      /**
   * Remove a child from this node, it no longer has a parent or siblings afterwards.
   * @param {PseudoNode} childElement The child node to remove
   * @returns {PseudoNode} The removed node
   * @throws {Error} When the node is not a child of this node
   */
      removeChild (childElement) {
        if (!childElement || childElement.parentNode !== this) {
          throw new Error('The node to be removed is not a child of this node.')
        }
        const removed = childElement
        this.childList.remove(removed.listLinker)
        removed.parent = null
        removed.listLinker = null
        return childElement
      }

      /**
   * Replace a child of this node with another node (which is moved if it is already in a tree).
   * @param {PseudoNode} newChild The node which takes the place
   * @param {PseudoNode} oldChild The child of this node to replace
   * @returns {PseudoNode} The replaced node
   * @throws {Error} When the old node is not a child of this node
   */
      replaceChild (newChild, oldChild) {
        if (!oldChild || oldChild.parentNode !== this) {
          throw new Error('The node to be replaced is not a child of this node.')
        }
        if (newChild === oldChild) {
          return oldChild
        }
        // The new node goes where the old one was, which is before the old node's next sibling (unless that is the new node)
        let reference = oldChild.nextSibling
        if (reference === newChild) {
          reference = newChild.nextSibling
        }
        this.removeChild(oldChild)
        this.insertBefore(newChild, reference)
        return oldChild
      }
    }
    exports.NodeService = NodeService
    NodeService.DEFAULT_NODE = 0
    NodeService.ELEMENT_NODE = 1
    NodeService.ATTRIBUTE_NODE = 2
    NodeService.TEXT_NODE = 3
    NodeService.CDATA_SECTION_NODE = 4
    NodeService.ENTITY_REFERENCE_NODE = 5
    NodeService.ENTITY_NODE = 6
    NodeService.PROCESSING_INSTRUCTION_NODE = 7
    NodeService.COMMENT_NODE = 8
    NodeService.DOCUMENT_NODE = 9
    NodeService.DOCUMENT_TYPE_NODE = 10
    NodeService.DOCUMENT_FRAGMENT_NODE = 11
    NodeService.NOTATION_NODE = 12
    NodeService.DOCUMENT_POSITION_DISCONNECTED = 1
    NodeService.DOCUMENT_POSITION_PRECEDING = 2
    NodeService.DOCUMENT_POSITION_FOLLOWING = 4
    NodeService.DOCUMENT_POSITION_CONTAINS = 8
    NodeService.DOCUMENT_POSITION_CONTAINED_BY = 16
    NodeService.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32
    NodeService.nextNodeId = 1
    /**
 * Simulate the behaviour of the Text Class when there is no DOM available: the text in an element.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 * @property {string} data - The text
 * @property {number} length - How many characters there are
 * @property {string} wholeText - The text of this node and of the text nodes next to it
 */
    class TextService extends NodeService {
      /**
   * @param {string} [data=''] The text
   * @constructor
   */
      constructor (data = '') {
        super()
        this.nodeValue = String(data)
      }

      get acceptsChildren () {
        return false
      }

      get nodeName () {
        return '#text'
      }

      get nodeType () {
        return NodeService.TEXT_NODE
      }

      get data () {
        return this.nodeValue
      }

      set data (data) {
        this.nodeValue = String(data)
      }

      get length () {
        return this.data.length
      }

      get textContent () {
        return this.data
      }

      set textContent (text) {
        this.data = text === null ? '' : String(text)
      }

      get wholeText () {
        let first = this
        while (first.previousSibling && first.previousSibling.nodeType === NodeService.TEXT_NODE) {
          first = first.previousSibling
        }
        let text = ''
        for (let current = first; current && current.nodeType === NodeService.TEXT_NODE; current = current.nextSibling) {
          text += current.nodeValue
        }
        return text
      }

      /**
   * Break this text node in two at a position: this node keeps the text before it and a new node with the rest is put
   * after this one.
   * @param {number} offset How many characters stay in this node
   * @returns {TextService} The new node
   * @throws {Error} When the offset is beyond the end of the text
   */
      splitText (offset) {
        if (offset < 0 || offset > this.length) {
          throw new Error('The offset is beyond the end of the text.')
        }
        const rest = new TextService(this.data.slice(offset))
        rest.ownerDocumentStore = this.ownerDocumentStore
        this.data = this.data.slice(0, offset)
        if (this.parentNode) {
          this.parentNode.insertBefore(rest, this.nextSibling)
        }
        return rest
      }

      cloneShallow () {
        const copy = new TextService(this.data)
        copy.ownerDocumentStore = this.ownerDocumentStore
        return copy
      }
    }
    exports.TextService = TextService
    /**
 * Simulate the behaviour of the Comment Class when there is no DOM available: a note in the markup which is not shown.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 * @property {string} data - The comment
 * @property {number} length - How many characters there are
 */
    class CommentService extends NodeService {
      /**
   * @param {string} [data=''] The comment
   * @constructor
   */
      constructor (data = '') {
        super()
        this.nodeValue = String(data)
      }

      get acceptsChildren () {
        return false
      }

      get nodeName () {
        return '#comment'
      }

      get nodeType () {
        return NodeService.COMMENT_NODE
      }

      get data () {
        return this.nodeValue
      }

      set data (data) {
        this.nodeValue = String(data)
      }

      get length () {
        return this.data.length
      }

      get textContent () {
        return this.data
      }

      set textContent (text) {
        this.data = text === null ? '' : String(text)
      }

      cloneShallow () {
        const copy = new CommentService(this.data)
        copy.ownerDocumentStore = this.ownerDocumentStore
        return copy
      }
    }
    exports.CommentService = CommentService
  }, { '../factories/generateNodeList': 10, '../factories/query': 14, './EventTargetService': 30, './HTMLCollectionService': 32, 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker': 53, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.every.js': 194, 'core-js/modules/esnext.iterator.filter.js': 195, 'core-js/modules/esnext.iterator.for-each.js': 197 }],
  39: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.PointerEventService = void 0
    /**
 * @file Substitute for the DOM PointerEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const MouseEventService_1 = require('./MouseEventService')
    /**
 * Simulate the behaviour of the PointerEvent Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments MouseEventService
 * @property {number} pointerId
 * @property {number} width
 * @property {number} height
 * @property {number} pressure
 * @property {string} pointerType
 * @property {boolean} isPrimary
 */
    class PointerEventService extends MouseEventService_1.MouseEventService {
      /**
   * @param {string} [typeArg=''] The type of the event
   * @param {PointerEventInit} [init={}] The options for the event
   * @constructor
   */
      constructor (typeArg = '', init = {}) {
        super(typeArg, init)
        this.pointer = {
          pointerId: init.pointerId || 0,
          width: typeof init.width === 'number' ? init.width : 1,
          height: typeof init.height === 'number' ? init.height : 1,
          pressure: init.pressure || 0,
          pointerType: init.pointerType || '',
          isPrimary: !!init.isPrimary
        }
      }

      get pointerId () {
        return this.pointer.pointerId
      }

      get width () {
        return this.pointer.width
      }

      get height () {
        return this.pointer.height
      }

      get pressure () {
        return this.pointer.pressure
      }

      get pointerType () {
        return this.pointer.pointerType
      }

      get isPrimary () {
        return this.pointer.isPrimary
      }
    }
    exports.PointerEventService = PointerEventService
  }, { './MouseEventService': 36 }],
  40: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.ShadowRootService = void 0
    const DocumentFragmentService_1 = require('./DocumentFragmentService')
    /**
 * Simulate the behaviour of the ShadowRoot Class when there is no DOM available: a DocumentFragment attached to an
 * element via attachShadow, which sets host and mode.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments DocumentFragmentService
 */
    class ShadowRootService extends DocumentFragmentService_1.DocumentFragmentService {
      constructor () {
        super(...arguments)
        /** The element this shadow root is attached to. Set by attachShadow. */
        this.host = null
        /** 'open' (reachable via element.shadowRoot) or 'closed' (not). Set by attachShadow. */
        this.mode = 'open'
      }
    }
    exports.ShadowRootService = ShadowRootService
  }, { './DocumentFragmentService': 26 }],
  41: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.UIEventService = void 0
    /**
 * @file Substitute for the DOM UIEvent Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const EventService_1 = require('./EventService')
    /**
 * Simulate the behaviour of the UIEvent Class when there is no DOM available: the events which come from a user
 * interface (the mouse, the keyboard, focus and input).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments EventService
 * @property {number} detail
 * @property {*} view
 */
    class UIEventService extends EventService_1.EventService {
      /**
   * @param {string} [typeArg=''] The type of the event
   * @param {UIEventInit} [init={}] The options for the event
   * @constructor
   */
      constructor (typeArg = '', init = {}) {
        super(typeArg, init)
        this.uiDetail = init.detail || 0
        this.uiView = init.view || null
      }

      get detail () {
        return this.uiDetail
      }

      get view () {
        return this.uiView
      }
    }
    exports.UIEventService = UIEventService
  }, { './EventService': 29 }],
  42: [function (require, module, exports) {
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
    exports.keyPress = exports.click = void 0
    /**
 * @file Simulate what a user does, with the events the browser sends for it.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module pseudoDom/simulate
 */
    const createEvent_1 = __importDefault(require('./factories/createEvent'))
    const activeElement_1 = require('./functions/activeElement')
    const send = (target, type, init) => target.dispatchEvent((0, createEvent_1.default)(type, init, {
      browser: true,
      trusted: true
    }))
    /**
 * The nearest element (starting with the element itself) which can have the focus.
 * @param {*} element Where to start
 * @returns {*|null}
 */
    const focusableFrom = element => {
      let current = element
      while (current) {
        if (current.canFocus) {
          return current
        }
        current = current.parentNode
      }
      return null
    }
    /**
 * Click an element the way a user does: pointerdown and mousedown, then the focus moves to the nearest element which
 * can have it (or is taken away from the one which had it) unless mousedown was cancelled, then pointerup, mouseup
 * and finally click. Every event is trusted and has the options the browser gives it. A disabled element gets nothing.
 * @function click
 * @param {*} element The element to click
 * @param {Object} [init={}] Options for the events (for example clientX, clientY, shiftKey)
 * @returns {boolean} False when the click was cancelled (or the element is disabled), so its default action did not happen
 */
    const click = (element, init = {}) => {
      if (element.hasAttribute && element.hasAttribute('disabled')) {
        return false
      }
      const pointer = Object.assign({
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        button: 0
      }, init)
      send(element, 'pointerdown', Object.assign({
        buttons: 1
      }, pointer))
      if (send(element, 'mousedown', Object.assign({
        buttons: 1,
        detail: 1
      }, init, {
        button: 0
      }))) {
        const focusable = focusableFrom(element)
        if (focusable) {
          focusable.focus()
        } else {
          const active = (0, activeElement_1.getActiveElement)(element.getRootNode())
          if (active) {
            active.blur()
          }
        }
      }
      send(element, 'pointerup', Object.assign({
        buttons: 0
      }, pointer))
      send(element, 'mouseup', Object.assign({
        buttons: 0,
        detail: 1
      }, init, {
        button: 0
      }))
      return send(element, 'click', Object.assign({
        detail: 1
      }, init, {
        button: 0
      }))
    }
    exports.click = click
    /**
 * Press and release a key on an element (the element which has the focus, or one given): keydown and then keyup.
 * @function keyPress
 * @param {*} element The element which gets the key
 * @param {string} key The value of the key, such as a or Enter
 * @param {Object} [init={}] Options for the events (for example code, shiftKey)
 * @returns {boolean} False when keydown was cancelled, so its default action did not happen
 */
    const keyPress = (element, key, init = {}) => {
      const options = Object.assign({
        key
      }, init)
      const proceeded = send(element, 'keydown', options)
      send(element, 'keyup', options)
      return proceeded
    }
    exports.keyPress = keyPress
    exports.default = {
      click: exports.click,
      keyPress: exports.keyPress
    }
  }, { './factories/createEvent': 5, './functions/activeElement': 16 }],
  43: [function (require, module, exports) {
    module.exports = {
      trueFunc: function trueFunc () {
        return true
      },
      falseFunc: function falseFunc () {
        return false
      }
    }
  }, {}],
  44: [function (require, module, exports) {
    (function (process) {
      (function () {
        const __defProp = Object.defineProperty
        const __getOwnPropDesc = Object.getOwnPropertyDescriptor
        const __getOwnPropNames = Object.getOwnPropertyNames
        const __hasOwnProp = Object.prototype.hasOwnProperty
        const __export = (target, all) => {
          for (const name in all) { __defProp(target, name, { get: all[name], enumerable: true }) }
        }
        const __copyProps = (to, from, except, desc) => {
          if (from && typeof from === 'object' || typeof from === 'function') {
            for (const key of __getOwnPropNames(from)) {
              if (!__hasOwnProp.call(to, key) && key !== except) { __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable }) }
            }
          }
          return to
        }
        const __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod)

        // src/index.ts
        const src_exports = {}
        __export(src_exports, {
          isBrowser: () => isBrowser,
          isBun: () => isBun,
          isDeno: () => isDeno,
          isJsDom: () => isJsDom,
          isNode: () => isNode,
          isWebWorker: () => isWebWorker
        })
        module.exports = __toCommonJS(src_exports)
        var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'
        var isNode = (
          // @ts-expect-error
          typeof process !== 'undefined' && // @ts-expect-error
  process.versions != null && // @ts-expect-error
  process.versions.node != null
        )
        var isWebWorker = typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope'
        var isJsDom = typeof window !== 'undefined' && window.name === 'nodejs' || typeof navigator !== 'undefined' && 'userAgent' in navigator && typeof navigator.userAgent === 'string' && (navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom'))
        var isDeno = (
          // @ts-expect-error
          typeof Deno !== 'undefined' && // @ts-expect-error
  typeof Deno.version !== 'undefined' && // @ts-expect-error
  typeof Deno.version.deno !== 'undefined'
        )
        var isBun = typeof process !== 'undefined' && process.versions != null && process.versions.bun != null
        // Annotate the CommonJS export names for ESM import in node:
        0 && (module.exports = {
          isBrowser,
          isBun,
          isDeno,
          isJsDom,
          isNode,
          isWebWorker
        })
      }).call(this)
    }).call(this, require('_process'))
  }, { _process: 260 }],
  45: [function (require, module, exports) {

  }, {}],
  46: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.ArrayElement = void 0
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    /**
 * Element represents a node in an Arrayable.
 */
    class ArrayElement {
      /**
   * Create the new Element instance, provide the data and optionally configure the type of Element.
   * @param {*} [data=null] The data to be stored in this element.
   */
      constructor (data = null) {
        /** The class used to create this instance, so that it can be recognized as valid without an instanceof check. */
        this.classType = ArrayElement
        /** The data stored in this element. */
        this.data = null
        this.data = data
      }
    }
    /**
 * Make a new Element from the data given if it is not already a valid Element.
 * @param {ArrayElement|*} element Return a valid ArrayElement instance from given data, or even an already valid one.
 * @param {IsElement} [classType=ArrayElement] Provide the type of IsElement to use.
 * @return {ArrayElement}
 */
    exports.ArrayElement = ArrayElement
    ArrayElement.make = (element, classType = ArrayElement) => {
      if (element === null || typeof element !== 'object') {
        // It is not an object (or it is null), so instantiate the Element with element as the data
        return new classType(element)
      }
      if (element.classType) {
        // Already valid Element, return as-is
        return element
      }
      // Create the new node as the configured #classType
      return new classType(element)
    }
    /**
 * Convert an array into Element instances, return the head and tail Elements.
 * @param {Array<IsElement>} [values=[]] Provide an array of data that will be converted to array of elements.
 * @param {IsElement} [classType=ArrayElement] Provide the type of IsElement to use.
 * @returns {{head: ArrayElement[], tail: ArrayElement}}
 */
    ArrayElement.fromArray = (values = [], classType = ArrayElement) => values.reduce((references, element) => {
      const newElement = classType.make(element, classType)
      if (!references.head.length) {
        // Initialize the head and tail with the new node
        return {
          head: [newElement],
          tail: newElement
        }
      }
      // Only update the tail once head has been set, tail is always the most recent node
      references.head.push(newElement)
      references.tail = newElement
      return references
    }, {
      head: [],
      tail: null
    })
  }, { 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.reduce.js': 199 }],
  47: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.Arrayable = void 0
    const _ArrayElement = require('./ArrayElement')
    const _ArrayIterator = require('../../recipes/ArrayIterator')
    /**
 * @file arrayable list.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.1.0
 * @memberOf module:collect-your-stuff
 */

    /**
 * Arrayable represents a collection stored as an array.
 */
    class Arrayable {
      /**
   * Create the new Arrayable instance, configure the Arrayable class.
   * @param {ArrayElement} [elementClass=ArrayElement] The class used to wrap given data as elements.
   */
      constructor (elementClass = _ArrayElement.ArrayElement) {
        /** The class used to create this instance, so that it can be recognized as valid without an instanceof check. */
        this.classType = Arrayable
        /** The array which stores the elements of this Arrayable. */
        this.innerList = []
        /** Whether the inner list has been initialized (it can only be initialized once). */
        this.initialized = false
        this.elementClass = elementClass
      }

      /**
   * Find the position of an element which must be in this list.
   * @param {ArrayElement} node The element to find
   * @returns {number}
   * @throws {Error} When the element is not in this list
   */
      indexOfElement (node) {
        const index = this.innerList.indexOf(node)
        if (index < 0) {
          throw new Error('The reference element is not in this list.')
        }
        return index
      }

      /**
   * Initialize the inner list, should only run once.
   * @param {Array<ArrayElement>} initialList Give the array of elements to start in this Arrayable.
   * @return {Arrayable}
   */
      initialize (initialList) {
        if (this.initialized) {
          console.warn('Attempt to initialize non-empty list.')
          return this
        }
        this.initialized = true
        this.innerList = initialList
        return this
      }

      /**
   * Retrieve the innerList used (the list itself, not a copy).
   * @returns {Array<ArrayElement>}
   */
      get list () {
        return this.innerList
      }

      /**
   * Retrieve the first Element from the Arrayable
   * @returns {ArrayElement|null} The first element, or null when the Arrayable is empty
   */
      get first () {
        return this.length ? this.innerList[0] : null
      }

      /**
   * Retrieve the last Element from the Arrayable
   * @returns {ArrayElement|null} The last element, or null when the Arrayable is empty
   */
      get last () {
        return this.length ? this.innerList[this.length - 1] : null
      }

      /**
   * Return the length of the list.
   * @returns {number}
   */
      get length () {
        return this.innerList.length
      }

      /**
   * Insert a new node (or data) after a node.
   * @param {ArrayElement|null} node The existing node as reference, or null to insert at the start of the list
   * @param {ArrayElement|*} newNode The new node to go after the existing node
   * @returns {Arrayable}
   * @throws {Error} When the reference node is not in this list
   */
      insertAfter (node, newNode) {
        // With no reference element, the new one goes after nothing: at the start of the list
        const insertAt = node === null || typeof node === 'undefined' ? -1 : this.indexOfElement(node)
        this.innerList.splice(insertAt + 1, 0, this.elementClass.make(newNode, this.elementClass))
        return this
      }

      /**
   * Insert a new node (or data) before a node.
   * @param {ArrayElement|null} node The existing node as reference, or null to insert at the end of the list
   * @param {ArrayElement|*} newNode The new node to go before the existing node
   * @returns {Arrayable}
   * @throws {Error} When the reference node is not in this list
   */
      insertBefore (node, newNode) {
        // With no reference element, the new one goes before nothing: at the end of the list
        const insertAt = node === null || typeof node === 'undefined' ? this.length : this.indexOfElement(node)
        this.innerList.splice(insertAt, 0, this.elementClass.make(newNode, this.elementClass))
        return this
      }

      /**
   * Add a node (or data) after the given (or last) node in the list.
   * @param {ArrayElement|*} node The new node to add to the end of the list
   * @param {ArrayElement} after The existing last node
   * @returns {Arrayable}
   */
      append (node, after = this.last) {
        if (after === this.last) {
          // Adding to the end does not need to search for where that is
          this.innerList.push(this.elementClass.make(node, this.elementClass))
          return this
        }
        return this.insertAfter(after, node)
      }

      /**
   * Add a node (or data) before the given (or first) node in the list.
   * @param {ArrayElement|*} node The new node to add to the start of the list
   * @param {ArrayElement} before The existing first node
   * @returns {Arrayable}
   */
      prepend (node, before = this.first) {
        if (before === this.first) {
          // Adding to the start does not need to search for where that is
          this.innerList.unshift(this.elementClass.make(node, this.elementClass))
          return this
        }
        return this.insertBefore(before, node)
      }

      /**
   * Remove an element from this arrayable.
   * @param {ArrayElement} node The node we wish to remove (and it will be returned after removal)
   * @return {ArrayElement|null} The removed node, or null when it was not in this list (nothing is removed)
   */
      remove (node) {
        const deleteAt = this.innerList.indexOf(node)
        if (deleteAt < 0) {
          return null
        }
        this.innerList.splice(deleteAt, 1)
        return node
      }

      /**
   * Retrieve an ArrayElement item from this list by numeric index, otherwise return null.
   * @param {number} index The integer number for retrieving a node by position.
   * @return {ArrayElement|null}
   */
      item (index) {
        if (index >= this.length) {
          // index is beyond array limit
          return null
        }
        if (index >= 0) {
          // use the positive index at nth position from the beginning of the array
          return this.innerList[index]
        }
        const calculatedIndex = this.length + index
        if (calculatedIndex < 0) {
          // negative index is beyond array limit (minus direction)
          return null
        }
        // Return the item at nth position from the end of the array
        return this.innerList[calculatedIndex]
      }

      /**
   * Be able to run forEach on this Arrayable to iterate over the elements.
   * @param {forEachCallback} callback The function to call for-each element
   * @param {Arrayable} thisArg Optional, 'this' reference
   * @returns {Arrayable}
   */
      forEach (callback, thisArg = this) {
        for (let i = 0; i < thisArg.length; ++i) {
          callback(thisArg.item(i), i, thisArg)
        }
        return thisArg
      }

      /**
   * Be able to iterate over this class.
   * @returns {Iterator}
   */
      [Symbol.iterator] () {
        const index = 0
        return new _ArrayIterator.ArrayIterator(this.innerList, index)
      }
    }
    /**
 * Convert an array to an Arrayable.
 * @param {Array} values An array of values which will be converted to elements in this arrayable
 * @param {IsElement} [elementClass=ArrayElement] The class to use for each element
 * @param {IsArrayable<ArrayElement>} [classType=Arrayable] Provide the type of IsArrayable to use.
 * @returns {Arrayable}
 */
    exports.Arrayable = Arrayable
    Arrayable.fromArray = (values = [], elementClass = _ArrayElement.ArrayElement, classType = Arrayable) => {
      const list = new classType(elementClass)
      return list.initialize(elementClass.fromArray(values).head)
    }
  }, { '../../recipes/ArrayIterator': 54, './ArrayElement': 46 }],
  48: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.DoubleLinker = void 0
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    const _Linker = require('../linked-list/Linker')
    /**
 * DoubleLinker represents a node in a DoublyLinkedList which is chained by next and prev.
 * @extends Linker
 */
    class DoubleLinker {
      /**
   * Create the new DoubleLinker instance, provide the data and optionally the next and prev references.
   * @param {Object} [nodeData={}] The settings for the new linker.
   * @param {*} [nodeData.data=null] The data to be stored in this linker
   * @param {DoubleLinker|null} [nodeData.next=null] The reference to the next linker if any
   * @param {DoubleLinker|null} [nodeData.prev=null] The reference to the previous linker if any
   */
      constructor ({
        data = null,
        next = null,
        prev = null
      } = {}) {
        /** The class used to create this instance, so that it can be recognized as valid without an instanceof check. */
        this.classType = DoubleLinker
        /** The data stored in this linker. */
        this.data = null
        /** The linker after this one, or null when this is the last. */
        this.next = null
        /** The linker before this one, or null when this is the first. */
        this.prev = null
        this.data = data
        this.next = next
        this.prev = prev
      }
    }
    /**
 * Make a new DoubleLinker from the data given if it is not already a valid Linker.
 * @param {DoubleLinker|*} linker Return a valid Linker instance from given data, or even an already valid one.
 * @param {IsDoubleLinker} [classType=DoubleLinker] Provide the type of IsDoubleLinker to use.
 * @return {DoubleLinker}
 */
    exports.DoubleLinker = DoubleLinker
    DoubleLinker.make = (linker, classType = DoubleLinker) => {
      return _Linker.Linker.make(linker, classType)
    }
    /**
 * Convert an array into DoubleLinker instances, return the head and tail DoubleLinkers.
 * @param {Array} [values=[]] Provide an array of data that will be converted to a chain of linkers.
 * @param {IsDoubleLinker} [classType=DoubleLinker] Provide the type of IsDoubleLinker to use.
 * @returns {{head: DoubleLinker, tail: DoubleLinker}}
 */
    DoubleLinker.fromArray = (values = [], classType = DoubleLinker) => values.reduce((references, linker) => {
      const newLinker = classType.make(linker, classType)
      if (references.head === null) {
        // Initialize the head and tail with the new node
        return {
          head: newLinker,
          tail: newLinker
        }
      }
      newLinker.prev = references.tail
      // Only update the tail once head has been set, tail is always the most recent node
      references.tail.next = newLinker
      references.tail = newLinker
      return references
    }, {
      head: null,
      tail: null
    })
  }, { '../linked-list/Linker': 51, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.reduce.js': 199 }],
  49: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.DoublyLinkedList = void 0
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.for-each.js')
    const _DoubleLinker = require('./DoubleLinker')
    const _DoubleLinkerIterator = require('../../recipes/DoubleLinkerIterator')
    const _LinkedList = require('../linked-list/LinkedList')
    /**
 * @file doubly linked list.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.1.0
 * @memberOf module:collect-your-stuff
 */

    /**
 * DoublyLinkedList represents a collection stored as a LinkedList with prev and next references.
 * @extends LinkedList
 */
    class DoublyLinkedList {
      /**
   * Create the new DoublyLinkedList instance.
   * @param {DoubleLinker} [linkerClass=DoubleLinker] The class used to wrap given data as linkers.
   */
      constructor (linkerClass = _DoubleLinker.DoubleLinker) {
        /** The class used to create this instance, so that it can be recognized as valid without an instanceof check. */
        this.classType = DoublyLinkedList
        /** A linker of the list (null when the list is empty); the head is found by walking back from it. */
        this.innerList = null
        /** Whether the inner list has been initialized (it can only be initialized once). */
        this.initialized = false
        /** The last linker, remembered so that adding to the end does not need to walk the whole list (null when not known yet). */
        this.tailCache = null
        /** The number of linkers, kept up to date by the list's own methods so that the length does not need to walk the whole list (null when not known yet). */
        this.countCache = null
        this.linkerClass = linkerClass
      }

      /**
   * Initialize the inner list, should only run once.
   * @param {DoubleLinker} initialList Give the list of double-linkers to start in this doubly linked-list.
   * @return {DoublyLinkedList}
   */
      initialize (initialList) {
        // Borrowed from LinkedList, which types its return as a LinkedList although it returns whatever list called it
        return _LinkedList.LinkedList.prototype.initialize.call(this, initialList)
      }

      /**
   * Retrieve the innerList used (the list itself, not a copy).
   * @returns {DoubleLinker}
   */
      get list () {
        return this.innerList
      }

      /**
   * Retrieve the first DoubleLinker in the list.
   * @returns {DoubleLinker}
   */
      get first () {
        let head = this.innerList
        if (head === null) {
          return null
        }
        // innerList is normally the head already, walking back also finds anything linked on before it outside of this list
        while (head.prev !== null) {
          head = head.prev
        }
        this.innerList = head
        return head
      }

      /**
   * Retrieve the last DoubleLinker in the list. The end is remembered, so this does not walk the list.
   * @returns {DoubleLinker}
   */
      get last () {
        if (this.innerList === null) {
          return null
        }
        let tail = this.tailCache !== null ? this.tailCache : this.innerList
        // The remembered tail is normally the end already, walking on from it also finds anything linked on outside of this list
        while (tail.next !== null) {
          tail = tail.next
        }
        this.tailCache = tail
        return tail
      }

      /**
   * Return the length of the list. It is kept up to date by the list's own methods, so this does not walk the list
   * (call reset() after linkers were changed directly).
   * @returns {number}
   */
      get length () {
        if (this.countCache === null) {
          this.reset()
        }
        return this.countCache
      }

      /**
   * Insert a new node (or data) after a node.
   * @param {DoubleLinker|*} node The existing node as reference (which must be in this list, this is not checked), or null to insert at the start of the list
   * @param {DoubleLinker|*} newNode The new node to go after the existing node
   * @returns {DoublyLinkedList}
   */
      insertAfter (node, newNode) {
        newNode = this.linkerClass.make(newNode, this.linkerClass)
        if (node === null || typeof node === 'undefined') {
          // After nothing means at the start of the list
          const head = this.first
          newNode.prev = null
          newNode.next = head
          if (head) {
            head.prev = newNode
          } else {
            this.tailCache = newNode
          }
          this.innerList = newNode
        } else {
          // Ensure the next reference of this node is assigned to the new node
          newNode.next = node.next
          // Ensure this node is assigned as the prev reference of the new node
          newNode.prev = node
          // Then set this node's next reference to the new node
          node.next = newNode
          if (newNode.next) {
            // Update the next reference to ensure circular reference for prev points to the new node
            newNode.next.prev = newNode
          } else {
            this.tailCache = newNode
          }
        }
        if (this.countCache !== null) {
          ++this.countCache
        }
        return this
      }

      /**
   * Insert a new node (or data) before a node.
   * @param {DoubleLinker|*} node The existing node as reference (which must be in this list, this is not checked), or null to insert at the end of the list
   * @param {DoubleLinker|*} newNode The new node to go before the existing node
   * @returns {DoublyLinkedList}
   */
      insertBefore (node, newNode) {
        newNode = this.linkerClass.make(newNode, this.linkerClass)
        if (node === null || typeof node === 'undefined') {
          // Before nothing means at the end of the list
          const tail = this.last
          newNode.next = null
          newNode.prev = tail
          if (tail === null) {
            this.innerList = newNode
          } else {
            tail.next = newNode
          }
          this.tailCache = newNode
        } else {
          // The new node will reference this prev node as prev
          newNode.prev = node.prev
          // The new node will reference this node as next
          newNode.next = node
          // This prev will reference the new node
          node.prev = newNode
          if (newNode.prev) {
            // Update the prev reference to ensure circular reference for next points to the new node
            newNode.prev.next = newNode
          } else {
            this.innerList = newNode
          }
        }
        if (this.countCache !== null) {
          ++this.countCache
        }
        return this
      }

      /**
   * Add a node (or data) after the given (or last) node in the list.
   * @param {DoubleLinker|*} node The new node to add to the end of the list
   * @param {DoubleLinker} after The existing last node
   * @returns {DoubleLinker}
   */
      append (node, after = this.last) {
        return this.insertAfter(after, node)
      }

      /**
   * Add a node (or data) before the given (or first) node in the list.
   * @param {DoubleLinker|*} node The new node to add to the start of the list
   * @param {DoubleLinker} before The existing first node
   * @returns {DoubleLinker}
   */
      prepend (node, before = this.first) {
        return this.insertBefore(before, node)
      }

      /**
   * Remove a linker from this linked list.
   * @param {DoubleLinker} node The node we wish to remove (and it will be returned after removal)
   * @return {DoubleLinker}
   */
      remove (node) {
        if (node === null || typeof node === 'undefined') {
          return null
        }
        if (node.prev) {
          // The previous node will reference this next node
          node.prev.next = node.next
        }
        if (node.next) {
          // The next node will reference this previous node
          node.next.prev = node.prev
        }
        // The list finds its head by walking from innerList, so it must not keep pointing at the node being removed. For the
        // last remaining node there is nothing to walk to, which would otherwise leave the removed node in the list.
        if (this.innerList === node) {
          this.innerList = node.next || node.prev || null
        }
        if (this.tailCache === node) {
          this.tailCache = node.prev
        }
        if (this.innerList === null) {
          this.tailCache = null
        }
        if (this.countCache !== null) {
          --this.countCache
        }
        return node
      }

      /**
   * Refresh all references (the head, the end and the length) by walking the list once, and return the head. The list's
   * own methods keep these up to date, so this is only needed after linkers were changed directly.
   * @return {DoubleLinker|null}
   */
      reset () {
        // Start at the pointer for the list
        let pointer = this.innerList
        if (pointer === null) {
          this.countCache = 0
          this.tailCache = null
          return null
        }
        // Follow references back to the beginning
        while (pointer.prev !== null) {
          pointer = pointer.prev
        }
        // We are pointing to the true head, now count along to the end to find the tail and the length
        this.innerList = pointer
        let count = 0
        let tail = pointer
        let current = pointer
        while (current !== null) {
          ++count
          tail = current
          current = current.next
        }
        this.countCache = count
        this.tailCache = tail
        return pointer
      }

      /**
   * Retrieve a DoubleLinker item from this list by numeric index, otherwise return null.
   * @param {number} index The integer number for retrieving a node by position.
   * @returns {DoubleLinker|null}
   */
      item (index) {
        if (index >= 0) {
          // For a positive index, start from the beginning of the list until the current item counter equals our index
          let current = this.first
          let currentIndex = -1
          while (++currentIndex < index && current !== null) {
            current = current.next
          }
          return currentIndex === index ? current : null
        }
        // For a negative index, get the delta of index and length, then go backwards until we reach that delta
        let current = this.last
        let currentIndex = this.length
        const calculatedIndex = this.length + index
        if (calculatedIndex < 0) {
          return null
        }
        while (--currentIndex > calculatedIndex && current !== null) {
          current = current.prev
        }
        return currentIndex === calculatedIndex ? current : null
      }

      /**
   * Be able to run forEach on this DoublyLinkedList to iterate over the DoubleLinker Items.
   * @param {forEachCallback} callback The function to call for-each double linker
   * @param {DoublyLinkedList} thisArg Optional, 'this' reference
   * @return {DoublyLinkedList} The list which was iterated.
   */
      forEach (callback, thisArg = this) {
        return _LinkedList.LinkedList.prototype.forEach.call(this, callback, thisArg)
      }

      /**
   * Be able to iterate over this class.
   * @returns {Iterator}
   */
      [Symbol.iterator] () {
        const current = this.first
        return new _DoubleLinkerIterator.DoubleLinkerIterator(current)
      }
    }
    /**
 * Convert an array into a DoublyLinkedList instance, return the new instance.
 * @param {Array} [values=[]] An array of values which will be converted to linkers in this doubly-linked-list
 * @param {IsDoubleLinker} [linkerClass=DoubleLinker] The class to use for each linker
 * @param {IsArrayable<IsDoubleLinker>} [classType=LinkedList] Provide the type of IsArrayable to use.
 * @returns {DoublyLinkedList}
 */
    exports.DoublyLinkedList = DoublyLinkedList
    DoublyLinkedList.fromArray = (values = [], linkerClass = _DoubleLinker.DoubleLinker, classType = DoublyLinkedList) => {
      return _LinkedList.LinkedList.fromArray(values, linkerClass, classType)
    }
  }, { '../../recipes/DoubleLinkerIterator': 55, '../linked-list/LinkedList': 50, './DoubleLinker': 48, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.for-each.js': 197 }],
  50: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.LinkedList = void 0
    const _Linker = require('./Linker')
    const _LinkerIterator = require('../../recipes/LinkerIterator')
    const _Arrayable = require('../arrayable/Arrayable')
    /**
 * LinkedList represents a collection stored as a LinkedList with next references.
 * @extends Arrayable
 */
    class LinkedList {
      /**
   * Create the new LinkedList instance.
   * @param {Linker} [linkerClass=Linker] The class used to wrap given data as linkers.
   */
      constructor (linkerClass = _Linker.Linker) {
        /** The class used to create this instance, so that it can be recognized as valid without an instanceof check. */
        this.classType = LinkedList
        /** The first linker of the list (null when the list is empty), from which the whole list is reached. */
        this.innerList = null
        /** Whether the inner list has been initialized (it can only be initialized once). */
        this.initialized = false
        /** The last linker, remembered so that adding to the end does not need to walk the whole list (null when not known yet). */
        this.tailCache = null
        /** The number of linkers, kept up to date by the list's own methods so that the length does not need to walk the whole list (null when not known yet). */
        this.countCache = null
        this.linkerClass = linkerClass
      }

      /**
   * Initialize the inner list, should only run once.
   * @param {Linker|Array} initialList Give the list of linkers to start in this linked-list.
   * @return {LinkedList}
   */
      initialize (initialList) {
        // Borrowed from Arrayable, which types its return as an Arrayable although it returns whatever list called it
        return _Arrayable.Arrayable.prototype.initialize.call(this, initialList)
      }

      /**
   * Retrieve the innerList used (the list itself, not a copy).
   * @returns {Linker}
   */
      get list () {
        return this.innerList
      }

      /**
   * Retrieve the first Linker in the list.
   * @returns {Linker}
   */
      get first () {
        return this.innerList
      }

      /**
   * Retrieve the last Linker in the list. The end is remembered, so this does not walk the list.
   * @returns {Linker}
   */
      get last () {
        if (this.innerList === null) {
          return null
        }
        let tail = this.tailCache !== null ? this.tailCache : this.innerList
        // The remembered tail is normally the end already, walking on from it also finds anything linked on outside of this list
        while (tail.next !== null) {
          tail = tail.next
        }
        this.tailCache = tail
        return tail
      }

      /**
   * Return the length of the list. It is kept up to date by the list's own methods, so this does not walk the list
   * (call reset() after linkers were changed directly).
   * @returns {number}
   */
      get length () {
        if (this.countCache === null) {
          this.reset()
        }
        return this.countCache
      }

      /**
   * Insert a new node (or data) after a node.
   * @param {Linker|*} node The existing node as reference, or null to insert at the start of the list
   * @param {Linker|*} newNode The new node to go after the existing node
   * @returns {LinkedList}
   */
      insertAfter (node, newNode) {
        newNode = this.linkerClass.make(newNode, this.linkerClass)
        if (node === null || typeof node === 'undefined') {
          // After nothing means at the start of the list
          newNode.next = this.innerList
          if (this.innerList === null) {
            this.tailCache = newNode
          }
          this.innerList = newNode
        } else {
          newNode.next = node.next
          node.next = newNode
          if (newNode.next === null) {
            this.tailCache = newNode
          }
        }
        if (this.countCache !== null) {
          ++this.countCache
        }
        return this
      }

      /**
   * Insert a new node (or data) before a node.
   * @param {Linker|*} node The existing node as reference, or null to insert at the end of the list
   * @param {Linker|*} newNode The new node to go before the existing node
   * @returns {LinkedList}
   * @throws {Error} When the reference node is not in this list
   */
      insertBefore (node, newNode) {
        newNode = this.linkerClass.make(newNode, this.linkerClass)
        if (node === null || typeof node === 'undefined') {
          // Before nothing means at the end of the list
          const tail = this.last
          newNode.next = null
          if (tail === null) {
            this.innerList = newNode
          } else {
            tail.next = newNode
          }
          this.tailCache = newNode
        } else {
          let prevNode = null
          let currentNode = this.first
          while (currentNode !== null && currentNode !== node) {
            prevNode = currentNode
            currentNode = currentNode.next
          }
          if (currentNode === null) {
            throw new Error('The reference node is not in this list.')
          }
          newNode.next = node
          if (prevNode) {
            prevNode.next = newNode
          } else {
            this.innerList = newNode
          }
        }
        if (this.countCache !== null) {
          ++this.countCache
        }
        return this
      }

      /**
   * Add a node (or data) after the given (or last) node in the list.
   * @param {Linker|*} node The new node to add to the end of the list
   * @param {Linker} after The existing last node
   * @returns {Linker}
   */
      append (node, after = this.last) {
        return this.insertAfter(after, node)
      }

      /**
   * Add a node (or data) before the given (or first) node in the list.
   * @param {Linker|*} node The new node to add to the start of the list
   * @param {Linker} before The existing first node
   * @returns {Linker}
   */
      prepend (node, before = this.first) {
        return this.insertBefore(before, node)
      }

      /**
   * Remove a linker from this linked list.
   * @param {Linker} node The node we wish to remove (and it will be returned after removal)
   * @return {Linker|null} The removed node, or null when it was not in this list (nothing is removed)
   */
      remove (node) {
        if (node === null || typeof node === 'undefined') {
          return null
        }
        let prevNode = null
        let currentNode = this.first
        while (currentNode !== null && currentNode !== node) {
          prevNode = currentNode
          currentNode = currentNode.next
        }
        if (currentNode === null) {
          // The node is not in this list, so there is nothing to remove
          return null
        }
        if (prevNode) {
          prevNode.next = node.next
        } else {
          this.innerList = node.next
        }
        if (this.tailCache === node) {
          this.tailCache = prevNode
        }
        if (this.innerList === null) {
          this.tailCache = null
        }
        if (this.countCache !== null) {
          --this.countCache
        }
        return node
      }

      /**
   * Refresh the remembered end and length of the list by walking it once. The list's own methods keep these up to date,
   * so this is only needed after linkers were changed directly (for example by setting next on a linker).
   * @return {Linker|null} The first linker of the list
   */
      reset () {
        let count = 0
        let tail = null
        let current = this.innerList
        while (current !== null) {
          ++count
          tail = current
          current = current.next
        }
        this.countCache = count
        this.tailCache = tail
        return this.innerList
      }

      /**
   * Retrieve a Linker item from this list by numeric index, otherwise return null.
   * @param {number} index The integer number for retrieving a node by position.
   * @returns {Linker|null}
   */
      item (index) {
        if (index >= 0) {
          let current = this.first
          let currentIndex = -1
          while (++currentIndex < index && current !== null) {
            current = current.next
          }
          return currentIndex === index ? current : null
        }
        let current = this.first
        let currentIndex = 0
        const calculatedIndex = this.length + index
        if (calculatedIndex < 0) {
          return null
        }
        while (currentIndex < calculatedIndex && current !== null) {
          current = current.next
          ++currentIndex
        }
        return currentIndex === calculatedIndex ? current : null
      }

      /**
   * Be able to run forEach on this LinkedList to iterate over the linkers.
   * @param {forEachCallback} callback The function to call for-each linker
   * @param {LinkedList} thisArg Optional, 'this' reference
   * @returns {LinkedList}
   */
      forEach (callback, thisArg = this) {
        let index = 0
        let current = thisArg.first
        while (current !== null) {
          callback(current, index, thisArg)
          current = current.next
          ++index
        }
        return thisArg
      }

      /**
   * Be able to iterate over this class.
   * @returns {Iterator}
   */
      [Symbol.iterator] () {
        return new _LinkerIterator.LinkerIterator(this.first)
      }
    }
    /**
 * Convert an array to a LinkedList.
 * @param {Array} values An array of values which will be converted to linkers in this linked-list
 * @param {IsLinker} linkerClass The class to use for each linker
 * @param {IsArrayable<Linker>} [classType=LinkedList] Provide the type of IsArrayable to use.
 * @returns {LinkedList}
 */
    exports.LinkedList = LinkedList
    LinkedList.fromArray = (values = [], linkerClass = _Linker.Linker, classType = LinkedList) => {
      const list = new classType(linkerClass)
      return list.initialize(linkerClass.fromArray(values).head)
    }
  }, { '../../recipes/LinkerIterator': 56, '../arrayable/Arrayable': 47, './Linker': 51 }],
  51: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.Linker = void 0
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    const _ArrayElement = require('../arrayable/ArrayElement')
    /**
 * Linker represents a node in a LinkedList.
 * @extends ArrayElement
 */
    class Linker {
      /**
   * Create the new Linker instance, provide the data and optionally give the next Linker.
   * @param {Object} [nodeData={}] The settings for the new linker.
   * @param {*} [nodeData.data=null] The data to be stored in this linker
   * @param {Linker|null} [nodeData.next=null] The reference to the next linker if any
   */
      constructor ({
        data = null,
        next = null
      } = {}) {
        /** The class used to create this instance, so that it can be recognized as valid without an instanceof check. */
        this.classType = Linker
        /** The data stored in this linker. */
        this.data = null
        /** The linker after this one, or null when this is the last. */
        this.next = null
        this.data = data
        this.next = next
      }
    }
    /**
 * Make a new Linker from the data given if it is not already a valid Linker.
 * @param {Linker|*} linker Return a valid Linker instance from given data, or even an already valid one.
 * @param {IsLinker} [classType=Linker] Provide the type of IsLinker to use.
 * @return {Linker}
 */
    exports.Linker = Linker
    Linker.make = (linker, classType = Linker) => {
      if (linker === null || typeof linker !== 'object') {
        // It is not an object (or it is null), so instantiate the Linker with element as the data
        return new classType({
          data: linker
        })
      }
      if (linker.classType) {
        // Already valid Linker, return as-is
        return linker
      }
      if (!('data' in linker)) {
        // Not the settings for a linker (which would have data, even if it is falsy), so it is the data itself
        linker = {
          data: linker
        }
      }
      // Create the new node as the configured #classType
      return _ArrayElement.ArrayElement.make(linker, classType)
    }
    /**
 * Convert an array into Linker instances, return the head and tail Linkers.
 * @param {Array} [values=[]] Provide an array of data that will be converted to a chain of linkers.
 * @param {IsLinker} [classType=Linker] Provide the type of IsLinker to use.
 * @returns {{head: Linker, tail: Linker}}
 */
    Linker.fromArray = (values = [], classType = Linker) => values.reduce((references, linker) => {
      const newLinker = classType.make(linker, classType)
      if (references.head === null) {
        // Initialize the head and tail with the new node
        return {
          head: newLinker,
          tail: newLinker
        }
      }
      // Only update the tail once head has been set, tail is always the most recent node
      references.tail.next = newLinker
      references.tail = newLinker
      return references
    }, {
      head: null,
      tail: null
    })
  }, { '../arrayable/ArrayElement': 46, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.reduce.js': 199 }],
  52: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.LinkedTreeList = void 0
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.for-each.js')
    const _TreeLinker = require('./TreeLinker')
    const _TreeLinkerIterator = require('../../recipes/TreeLinkerIterator')
    const _DoublyLinkedList = require('../doubly-linked-list/DoublyLinkedList')
    /**
 * @file doubly linked tree list.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.1.0
 * @memberOf module:collect-your-stuff
 */

    /**
 * Use one of the accessors of DoublyLinkedList (which keeps track of the head, tail and length) for a LinkedTreeList.
 * @param {string} name The accessor to use
 * @param {LinkedTreeList} list The list to use it on
 * @returns {*}
 */
    const borrowedGetter = (name, list) => Object.getOwnPropertyDescriptor(_DoublyLinkedList.DoublyLinkedList.prototype, name).get.call(list)
    /**
 * LinkedTreeList represents a collection stored with a root and spreading in branching (tree) formation.
 * @extends DoublyLinkedList
 */
    class LinkedTreeList {
      /**
   * Create the new LinkedTreeList instance, configure the list class.
   * @param {TreeLinker} [linkerClass=TreeLinker] The class used to wrap given data as tree linkers.
   */
      constructor (linkerClass = _TreeLinker.TreeLinker) {
        /** The class used to create this instance, so that it can be recognized as valid without an instanceof check. */
        this.classType = LinkedTreeList
        /** A linker of the list (null when the list is empty); the head is found by walking back from it. */
        this.innerList = null
        /** Whether the inner list has been initialized (it can only be initialized once). */
        this.initialized = false
        /** The last linker, remembered so that adding to the end does not need to walk the whole list (null when not known yet). */
        this.tailCache = null
        /** The number of linkers, kept up to date by the list's own methods so that the length does not need to walk the whole list (null when not known yet). */
        this.countCache = null
        /** The node these linkers are the children of, remembered so that it is known even while the list is empty (undefined until it is known). */
        this.ownerNode = undefined
        this.linkerClass = linkerClass
      }

      /**
   * Initialize the inner list, should only run once.
   * @param {TreeLinker} initialList Give the list of tree-linkers to start in this linked-tree-list.
   * @return {LinkedTreeList}
   */
      initialize (initialList) {
        if (this.initialized) {
          console.warn('Attempt to initialize LinkedTreeList which is not empty.')
          return this
        }
        this.initialized = true
        this.innerList = initialList
        return this
      }

      /**
   * Retrieve the innerList used (the list itself, not a copy).
   * @returns {TreeLinker}
   */
      get list () {
        return this.innerList
      }

      /**
   * Retrieve the first TreeLinker in the list.
   * @returns {TreeLinker}
   */
      get first () {
        return borrowedGetter('first', this)
      }

      /**
   * Retrieve the last TreeLinker in the list. The end is remembered, so this does not walk the list.
   * @returns {TreeLinker}
   */
      get last () {
        return borrowedGetter('last', this)
      }

      /**
   * Return the length of the list. It is kept up to date by the list's own methods, so this does not walk the list
   * (call reset() after linkers were changed directly).
   * @returns {number}
   */
      get length () {
        return borrowedGetter('length', this)
      }

      /**
   * Get the parent of this tree list: the node these linkers are the children of (remembered even while the list is
   * empty), or null for the linkers at the top of a tree.
   * @return {TreeLinker|null}
   */
      get parent () {
        if (this.ownerNode !== undefined) {
          return this.ownerNode
        }
        const first = this.first
        return first === null ? null : first.parent
      }

      /**
   * Set the parent of this tree list: every linker in it gets the node as its parent, and the node gets this list as its
   * children. Linkers added to the list later get this parent too.
   * @param {TreeLinker|null} parent The new node to use as the parent for this group of children
   */
      set parent (parent) {
        this.ownerNode = parent
        let current = this.first
        while (current !== null) {
          current.parent = parent
          current = current.next
        }
        if (parent) {
          parent.children = this
        }
      }

      /**
   * Return the root parent of the entire tree.
   * @return {TreeLinker}
   */
      get rootParent () {
        let current = this.first
        if (!current) {
          return null
        }
        let parent = this.first.parent
        while (parent !== null) {
          current = parent
          parent = current.parent
        }
        return current
      }

      /**
   * Set the children on a parent item.
   * @param {TreeLinker} item The TreeLinker node (one of the linkers of this list) that will be the parent of the children
   * @param {LinkedTreeList|null} [children=null] The LinkedTreeList which has the child nodes to use, or null to remove the children of the item
   * @throws {Error} When the item is not one of the linkers of this list
   */
      setChildren (item, children = null) {
        // The item must be one of the linkers of this list (only the siblings are checked, not the whole tree)
        let isChild = false
        this.forEach(linker => {
          if (linker === item) {
            isChild = true
          }
        })
        if (!isChild) {
          throw new Error('The item is not one of the linkers of this list.')
        }
        if (children === null || typeof children === 'undefined') {
          item.children = null
          return
        }
        children.parent = item
      }

      /**
   * Make a linker of the given node (or data) and make this list's parent its parent.
   * @param {TreeLinker|*} newNode The node (or data) which is being added to this list
   * @returns {TreeLinker}
   */
      adopt (newNode) {
        const linker = this.linkerClass.make(newNode, this.linkerClass)
        linker.parent = this.parent
        return linker
      }

      /**
   * Insert a new node (or data) after a node. The new node gets the parent of this list.
   * @param {TreeLinker|*} node The existing node as reference, or null to insert at the start of the list
   * @param {TreeLinker|*} newNode The new node to go after the existing node
   * @returns {LinkedTreeList}
   */
      insertAfter (node, newNode) {
        return _DoublyLinkedList.DoublyLinkedList.prototype.insertAfter.call(this, node, this.adopt(newNode))
      }

      /**
   * Insert a new node (or data) before a node. The new node gets the parent of this list.
   * @param {TreeLinker|*} node The existing node as reference, or null to insert at the end of the list
   * @param {TreeLinker|*} newNode The new node to go before the existing node
   * @returns {LinkedTreeList}
   */
      insertBefore (node, newNode) {
        return _DoublyLinkedList.DoublyLinkedList.prototype.insertBefore.call(this, node, this.adopt(newNode))
      }

      /**
   * Add a node (or data) after the given (or last) node in the list.
   * @param {TreeLinker|*} node The new node to add to the end of the list
   * @param {TreeLinker} after The existing last node
   * @returns {TreeLinker}
   */
      append (node, after = this.last) {
        return _DoublyLinkedList.DoublyLinkedList.prototype.append.call(this, node, after)
      }

      /**
   * Add a node (or data) before the given (or first) node in the list.
   * @param {TreeLinker|*} node The new node to add to the start of the list
   * @param {TreeLinker} before The existing first node
   * @returns {TreeLinker}
   */
      prepend (node, before = this.first) {
        return _DoublyLinkedList.DoublyLinkedList.prototype.prepend.call(this, node, before)
      }

      /**
   * Remove a linker from this linked list. The removed node no longer has a parent.
   * @param {TreeLinker} node The node we wish to remove (and it will be returned after removal)
   * @return {TreeLinker|null} The removed node, or null when there was nothing to remove
   */
      remove (node) {
        const owner = this.parent
        const removed = _DoublyLinkedList.DoublyLinkedList.prototype.remove.call(this, node)
        if (removed && removed.parent === owner) {
          // Remember whose children these are (the list may now be empty), the removed node no longer has that parent
          this.ownerNode = owner
          removed.parent = null
        }
        return removed
      }

      /**
   * Refresh all references (the head, the end and the length) by walking the list once, and return the head. The
   * list's own methods keep these up to date, so this is only needed after linkers were changed directly.
   * @return {TreeLinker}
   */
      reset () {
        return _DoublyLinkedList.DoublyLinkedList.prototype.reset.call(this)
      }

      /**
   * Retrieve a TreeLinker item from this list by numeric index, otherwise return null.
   * @param {number} index The integer number for retrieving a node by position.
   * @returns {TreeLinker|null}
   */
      item (index) {
        return _DoublyLinkedList.DoublyLinkedList.prototype.item.call(this, index)
      }

      /**
   * Be able to run forEach on this LinkedTreeList to iterate over the TreeLinker Items.
   * @param {forEachCallback} callback The function to call for-each tree node
   * @param {LinkedTreeList} thisArg Optional, 'this' reference
   * @return {LinkedTreeList} The list which was iterated.
   */
      forEach (callback, thisArg = this) {
        let index = 0
        let current = thisArg.first
        while (current !== null) {
          callback(current, index, thisArg)
          current = current.next
          ++index
        }
        return thisArg
      }

      /**
   * Be able to iterate over this class: the linkers of this list and everything below them (left-first). It stays within
   * this list (it does not start at, or climb up to, the parents), use the parseTree service to parse a whole tree.
   * @returns {Iterator}
   */
      [Symbol.iterator] () {
        // The linkers of this list and everything below them, left-first. It stays within this list: it does not start at,
        // or climb up to, the parents (use the parseTree service to parse a whole tree)
        return new _TreeLinkerIterator.TreeLinkerIterator(this.first, this.parent)
      }
    }
    /**
 * Convert an array into a LinkedTreeList instance, return the new instance.
 * @param {Array} [values=[]] An array of values which will be converted to nodes in this tree-list
 * @param {TreeLinker} [linkerClass=TreeLinker] The class to use for each node
 * @param {IsArrayable<TreeLinker>} [classType=LinkedTreeList] Provide the type of IsArrayable to use.
 * @returns {LinkedTreeList}
 */
    exports.LinkedTreeList = LinkedTreeList
    LinkedTreeList.fromArray = (values = [], linkerClass = _TreeLinker.TreeLinker, classType = LinkedTreeList) => {
      const list = new classType(linkerClass)
      return list.initialize(linkerClass.fromArray(values).head)
    }
  }, { '../../recipes/TreeLinkerIterator': 57, '../doubly-linked-list/DoublyLinkedList': 49, './TreeLinker': 53, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.for-each.js': 197 }],
  53: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.TreeLinker = void 0
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.map.js')
    const _DoubleLinker = require('../doubly-linked-list/DoubleLinker')
    const _LinkedTreeList = require('./LinkedTreeList')
    /**
 * TreeLinker represents a node in a LinkedTreeList having a parent (or root) and child nodes.
 * @extends DoubleLinker
 */
    class TreeLinker {
      /**
   * Create the new TreeLinker instance, provide the data and optionally set references for next, prev, parent, or children.
   * @param {Object} [settings={}] The settings for the new tree node.
   * @param {*} [settings.data=null] The data to be stored in this tree node
   * @param {TreeLinker} [settings.next=null] The reference to the next linker if any
   * @param {TreeLinker} [settings.prev=null] The reference to the previous linker if any
   * @param {LinkedTreeList} [settings.children=null] The references to child linkers if any
   * @param {TreeLinker} [settings.parent=null] The reference to a parent linker if any
   * @param {IsArrayable<IsTreeNode>} listClass Give the type of list to use for storing the children
   */
      constructor ({
        data = null,
        next = null,
        prev = null,
        children = null,
        parent = null,
        listClass = _LinkedTreeList.LinkedTreeList
      } = {}) {
        /** The class used to create this instance, so that it can be recognized as valid without an instanceof check. */
        this.classType = TreeLinker
        /** The data stored in this tree node. */
        this.data = null
        /** The sibling after this node, or null when this is the last child. */
        this.next = null
        /** The sibling before this node, or null when this is the first child. */
        this.prev = null
        /** The node this node is a child of, or null for a root node. */
        this.parent = null
        /** The list of the children of this node, or null when it has none. */
        this.children = null
        this.data = data
        this.next = next
        this.prev = prev
        this.parent = parent
        this.children = this.childrenFromArray(children, listClass)
      }

      /**
   * Create the children for this tree from an array. Each child becomes a tree linker with this node as its parent: an
   * existing linker is kept as it is, an object with a data property gives the settings of the linker, and anything
   * else is the data of the linker.
   * @param {Array|null} children Provide an array of data / linker references to be children of this tree node.
   * @param {IsArrayable<IsTreeNode>} listClass Give the type of list to use for storing the children
   * @return {LinkedTreeList|null}
   */
      childrenFromArray (children = null, listClass = _LinkedTreeList.LinkedTreeList) {
        if (children === null) {
          return null
        }
        // Every child is made into a tree linker (an existing one is kept as it is, and a plain value is the data) and is
        // given this node as its parent
        const nodes = children.map(child => {
          const linker = this.classType.make(child, this.classType)
          linker.parent = this
          return linker
        })
        // Creates a linked-tree-list to store the children, which remembers this node as its parent even when it is empty
        const list = listClass.fromArray(nodes, this.classType)
        list.parent = this
        return list
      }
    }
    /**
 * Make a new DoubleLinker from the data given if it is not already a valid Linker.
 * @param {TreeLinker|*} linker Return a valid TreeLinker instance from given data, or even an already valid one.
 * @param {IsTreeNode} [classType=TreeLinker] Provide the type of IsTreeNode to use.
 * @return {TreeLinker}
 */
    exports.TreeLinker = TreeLinker
    TreeLinker.make = (linker, classType = TreeLinker) => {
      return _DoubleLinker.DoubleLinker.make(linker, classType)
    }
    /**
 * Convert an array into DoubleLinker instances, return the head and tail DoubleLinkers.
 * @param {Array} [values=[]] Provide an array of data that will be converted to a chain of tree-linkers.
 * @param {IsTreeNode} [classType=TreeLinker] Provide the type of IsTreeNode to use.
 * @returns {{head: TreeLinker, tail: TreeLinker}}
 */
    TreeLinker.fromArray = (values = [], classType = TreeLinker) => _DoubleLinker.DoubleLinker.fromArray(values, classType)
  }, { '../doubly-linked-list/DoubleLinker': 48, './LinkedTreeList': 52, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.map.js': 198 }],
  54: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.ArrayIterator = void 0
    /**
 * Class ArrayIterator returns the next value when using elements of array type list.
 */
    class ArrayIterator {
      /**
   * Create an iterator over the given array.
   * @param {Array<IsElement>} innerList The elements to iterate over.
   * @param {number} [index=0] The position to start from.
   */
      constructor (innerList, index = 0) {
        this.innerList = innerList
        this.index = index
      }

      /**
   * Get the next element, moving the iterator forward.
   * @param {*} [value] Not used, present to match the Iterator interface.
   * @return {IteratorResult<IsElement>} The next element, or done when there are no more.
   */
      next (value) {
        if (this.index < this.innerList.length) {
          return {
            value: this.innerList[this.index++],
            done: false
          }
        }
        return {
          value: undefined,
          done: true
        }
      }
    }
    exports.ArrayIterator = ArrayIterator
  }, {}],
  55: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.DoubleLinkerIterator = void 0
    /**
 * Class DoubleLinkerIterator returns the next value when using linkers of linked type lists.
 */
    class DoubleLinkerIterator {
      /**
   * Create an iterator starting at the given item.
   * @param {IsDoubleLinker} current The item to start from.
   */
      constructor (current) {
        this.current = current
      }

      /**
   * Get the current item and move on to the following one.
   * @param {*} [value] Not used, present to match the Iterator interface.
   * @return {IteratorResult<IsDoubleLinker>} The current item, or done when there are no more.
   */
      next (value) {
        const result = {
          value: this.current,
          done: !this.current
        }
        this.current = this.current ? this.current.next : null
        return result
      }
    }
    exports.DoubleLinkerIterator = DoubleLinkerIterator
  }, {}],
  56: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.LinkerIterator = void 0
    /**
 * Class LinkerIterator returns the next value when using linkers of linked type lists.
 */
    class LinkerIterator {
      /**
   * Create an iterator starting at the given item.
   * @param {IsLinker} current The item to start from.
   */
      constructor (current) {
        this.current = current
      }

      /**
   * Get the current item and move on to the following one.
   * @param {*} [value] Not used, present to match the Iterator interface.
   * @return {IteratorResult<IsLinker>} The current item, or done when there are no more.
   */
      next (value) {
        const result = {
          value: this.current,
          done: !this.current
        }
        this.current = this.current ? this.current.next : null
        return result
      }
    }
    exports.LinkerIterator = LinkerIterator
  }, {}],
  57: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.TreeLinkerIterator = void 0
    const _parseTreeNext = require('../services/parseTreeNext')
    /**
 * Class TreeLinkerIterator returns the next value taking a left-first approach down a tree.
 */
    class TreeLinkerIterator {
      /**
   * Create an iterator starting at the given item.
   * @param {IsTreeNode} current The item to start from.
   * @param {IsTreeNode|null} [boundaryParent] The parent of the nodes to stay within (null for the top of a tree), the whole tree when not given.
   */
      constructor (current, boundaryParent) {
        this.current = current
        this.boundaryParent = boundaryParent
      }

      /**
   * Get the current item and move on to the following one (left-first, down each branch).
   * @param {*} [value] Not used, present to match the Iterator interface.
   * @return {IteratorResult<IsTreeNode>} The current item, or done when there are no more.
   */
      next (value) {
        const result = {
          value: this.current,
          done: !this.current
        }
        this.current = (0, _parseTreeNext.parseTreeNext)(this.current, this.boundaryParent)
        return result
      }
    }
    exports.TreeLinkerIterator = TreeLinkerIterator
  }, { '../services/parseTreeNext': 58 }],
  58: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.parseTreeNext = void 0
    /**
 * Be able to parse over every node in a tree.
 * 1. Start at root (get root parent)
 * 2. Get first child (repeat until no children)
 * 3. Check next child
 * 4. Repeat 2
 * 5. Repeat 3
 * 6. If no next child, return to parent and repeat 3
 * 7. Stop at root (next is null and parent is null
 * A boundary can be given to parse only part of a tree: going back up to the parents stops at the boundary, so the
 * parsing stays within the nodes whose parent is the boundary (and everything below them).
 * @param {IsTreeNode} treeNode Provide a node in a tree and get the next node (left-first approach)
 * @param {IsTreeNode|null} [boundaryParent] The parent of the nodes to stay within, null for the nodes at the top of a tree. When it is not given the whole tree is parsed.
 * @returns {IsTreeNode|null}
 */
    const parseTreeNext = (treeNode, boundaryParent) => {
      if (!treeNode) {
        return null
      }
      if (treeNode.children && treeNode.children.length) {
        return treeNode.children.first
      }
      if (treeNode.next) {
        return treeNode.next
      }
      // Nothing more below or beside this node, so go back up until there is a node which has a next (or the boundary)
      let parent = treeNode.parent
      while (parent && parent !== boundaryParent) {
        if (parent.next) {
          return parent.next
        }
        parent = parent.parent
      }
      return null
    }
    exports.parseTreeNext = parseTreeNext
  }, {}],
  59: [function (require, module, exports) {
    'use strict'
    const isCallable = require('../internals/is-callable')
    const tryToString = require('../internals/try-to-string')

    const $TypeError = TypeError

    // `Assert: IsCallable(argument) is true`
    module.exports = function (argument) {
      if (isCallable(argument)) return argument
      throw new $TypeError(tryToString(argument) + ' is not a function')
    }
  }, { '../internals/is-callable': 111, '../internals/try-to-string': 175 }],
  60: [function (require, module, exports) {
    'use strict'
    const has = require('../internals/map-helpers').has

    // Perform ? RequireInternalSlot(M, [[MapData]])
    module.exports = function (it) {
      has(it)
      return it
    }
  }, { '../internals/map-helpers': 130 }],
  61: [function (require, module, exports) {
    'use strict'
    const has = require('../internals/set-helpers').has

    // Perform ? RequireInternalSlot(M, [[SetData]])
    module.exports = function (it) {
      has(it)
      return it
    }
  }, { '../internals/set-helpers': 152 }],
  62: [function (require, module, exports) {
    'use strict'
    const has = require('../internals/weak-map-helpers').has

    // Perform ? RequireInternalSlot(M, [[WeakMapData]])
    module.exports = function (it) {
      has(it)
      return it
    }
  }, { '../internals/weak-map-helpers': 180 }],
  63: [function (require, module, exports) {
    'use strict'
    const has = require('../internals/weak-set-helpers').has

    // Perform ? RequireInternalSlot(M, [[WeakSetData]])
    module.exports = function (it) {
      has(it)
      return it
    }
  }, { '../internals/weak-set-helpers': 181 }],
  64: [function (require, module, exports) {
    'use strict'
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const create = require('../internals/object-create')
    const defineProperty = require('../internals/object-define-property').f

    const UNSCOPABLES = wellKnownSymbol('unscopables')
    const ArrayPrototype = Array.prototype

    // Array.prototype[@@unscopables]
    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    if (ArrayPrototype[UNSCOPABLES] === undefined) {
      defineProperty(ArrayPrototype, UNSCOPABLES, {
        configurable: true,
        value: create(null)
      })
    }

    // add a key to Array.prototype[@@unscopables]
    module.exports = function (key) {
      ArrayPrototype[UNSCOPABLES][key] = true
    }
  }, { '../internals/object-create': 133, '../internals/object-define-property': 135, '../internals/well-known-symbol': 182 }],
  65: [function (require, module, exports) {
    'use strict'
    const isPrototypeOf = require('../internals/object-is-prototype-of')

    const $TypeError = TypeError

    module.exports = function (it, Prototype) {
      if (isPrototypeOf(Prototype, it)) return it
      throw new $TypeError('Incorrect invocation')
    }
  }, { '../internals/object-is-prototype-of': 140 }],
  66: [function (require, module, exports) {
    'use strict'
    const isObject = require('../internals/is-object')

    const $String = String
    const $TypeError = TypeError

    // `Assert: Type(argument) is Object`
    module.exports = function (argument) {
      if (isObject(argument)) return argument
      throw new $TypeError($String(argument) + ' is not an object')
    }
  }, { '../internals/is-object': 115 }],
  67: [function (require, module, exports) {
    'use strict'
    const toIndexedObject = require('../internals/to-indexed-object')
    const toAbsoluteIndex = require('../internals/to-absolute-index')
    const lengthOfArrayLike = require('../internals/length-of-array-like')

    // `Array.prototype.{ indexOf, includes }` methods implementation
    const createMethod = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        const O = toIndexedObject($this)
        const length = lengthOfArrayLike(O)
        if (length === 0) return !IS_INCLUDES && -1
        let index = toAbsoluteIndex(fromIndex, length)
        let value
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare -- NaN check
        if (IS_INCLUDES && el !== el) {
          while (length > index) {
            value = O[index++]
            // eslint-disable-next-line no-self-compare -- NaN check
            if (value !== value) return true
          // Array#indexOf ignores holes, Array#includes - not
          }
        } else {
          for (;length > index; index++) {
            if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0
          }
        } return !IS_INCLUDES && -1
      }
    }

    module.exports = {
      // `Array.prototype.includes` method
      // https://tc39.es/ecma262/#sec-array.prototype.includes
      includes: createMethod(true),
      // `Array.prototype.indexOf` method
      // https://tc39.es/ecma262/#sec-array.prototype.indexof
      indexOf: createMethod(false)
    }
  }, { '../internals/length-of-array-like': 128, '../internals/to-absolute-index': 165, '../internals/to-indexed-object': 166 }],
  68: [function (require, module, exports) {
    'use strict'
    const anObject = require('../internals/an-object')
    const iteratorClose = require('../internals/iterator-close')

    // call something on iterator step with safe closing on error
    module.exports = function (iterator, fn, value, ENTRIES) {
      try {
        return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value)
      } catch (error) {
        iteratorClose(iterator, 'throw', error)
      }
    }
  }, { '../internals/an-object': 66, '../internals/iterator-close': 122 }],
  69: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    const toString = uncurryThis({}.toString)
    const stringSlice = uncurryThis(''.slice)

    module.exports = function (it) {
      return stringSlice(toString(it), 8, -1)
    }
  }, { '../internals/function-uncurry-this': 95 }],
  70: [function (require, module, exports) {
    'use strict'
    const TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support')
    const isCallable = require('../internals/is-callable')
    const classofRaw = require('../internals/classof-raw')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const TO_STRING_TAG = wellKnownSymbol('toStringTag')
    const $Object = Object

    // ES3 wrong here
    const CORRECT_ARGUMENTS = classofRaw(function () { return arguments }()) === 'Arguments'

    // fallback for IE11 Script Access Denied error
    const tryGet = function (it, key) {
      try {
        return it[key]
      } catch (error) { /* empty */ }
    }

    // getting tag from ES6+ `Object.prototype.toString`
    module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
      let O, tag, result
      return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
        : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) === 'string' ? tag
        // builtinTag case
          : CORRECT_ARGUMENTS ? classofRaw(O)
          // ES3 arguments fallback
            : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result
    }
  }, { '../internals/classof-raw': 69, '../internals/is-callable': 111, '../internals/to-string-tag-support': 173, '../internals/well-known-symbol': 182 }],
  71: [function (require, module, exports) {
    'use strict'
    const hasOwn = require('../internals/has-own-property')
    const ownKeys = require('../internals/own-keys')
    const getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor')
    const definePropertyModule = require('../internals/object-define-property')

    module.exports = function (target, source, exceptions) {
      const keys = ownKeys(source)
      const defineProperty = definePropertyModule.f
      const getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
          defineProperty(target, key, getOwnPropertyDescriptor(source, key))
        }
      }
    }
  }, { '../internals/has-own-property': 103, '../internals/object-define-property': 135, '../internals/object-get-own-property-descriptor': 136, '../internals/own-keys': 145 }],
  72: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    module.exports = !fails(function () {
      function F () { /* empty */ }
      F.prototype.constructor = null
      // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
      return Object.getPrototypeOf(new F()) !== F.prototype
    })
  }, { '../internals/fails': 87 }],
  73: [function (require, module, exports) {
    'use strict'
    // `CreateIterResultObject` abstract operation
    // https://tc39.es/ecma262/#sec-createiterresultobject
    module.exports = function (value, done) {
      return { value, done }
    }
  }, {}],
  74: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const definePropertyModule = require('../internals/object-define-property')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')

    module.exports = DESCRIPTORS
      ? function (object, key, value) {
        return definePropertyModule.f(object, key, createPropertyDescriptor(1, value))
      }
      : function (object, key, value) {
        object[key] = value
        return object
      }
  }, { '../internals/create-property-descriptor': 75, '../internals/descriptors': 81, '../internals/object-define-property': 135 }],
  75: [function (require, module, exports) {
    'use strict'
    module.exports = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value
      }
    }
  }, {}],
  76: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const definePropertyModule = require('../internals/object-define-property')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')

    module.exports = function (object, key, value) {
      if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value))
      else object[key] = value
    }
  }, { '../internals/create-property-descriptor': 75, '../internals/descriptors': 81, '../internals/object-define-property': 135 }],
  77: [function (require, module, exports) {
    'use strict'
    const makeBuiltIn = require('../internals/make-built-in')
    const defineProperty = require('../internals/object-define-property')

    module.exports = function (target, name, descriptor) {
      if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true })
      if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true })
      return defineProperty.f(target, name, descriptor)
    }
  }, { '../internals/make-built-in': 129, '../internals/object-define-property': 135 }],
  78: [function (require, module, exports) {
    'use strict'
    const isCallable = require('../internals/is-callable')
    const definePropertyModule = require('../internals/object-define-property')
    const makeBuiltIn = require('../internals/make-built-in')
    const defineGlobalProperty = require('../internals/define-global-property')

    module.exports = function (O, key, value, options) {
      if (!options) options = {}
      let simple = options.enumerable
      const name = options.name !== undefined ? options.name : key
      if (isCallable(value)) makeBuiltIn(value, name, options)
      if (options.global) {
        if (simple) O[key] = value
        else defineGlobalProperty(key, value)
      } else {
        try {
          if (!options.unsafe) delete O[key]
          else if (O[key]) simple = true
        } catch (error) { /* empty */ }
        if (simple) O[key] = value
        else {
          definePropertyModule.f(O, key, {
            value,
            enumerable: false,
            configurable: !options.nonConfigurable,
            writable: !options.nonWritable
          })
        }
      } return O
    }
  }, { '../internals/define-global-property': 80, '../internals/is-callable': 111, '../internals/make-built-in': 129, '../internals/object-define-property': 135 }],
  79: [function (require, module, exports) {
    'use strict'
    const defineBuiltIn = require('../internals/define-built-in')

    module.exports = function (target, src, options) {
      for (const key in src) defineBuiltIn(target, key, src[key], options)
      return target
    }
  }, { '../internals/define-built-in': 78 }],
  80: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')

    // eslint-disable-next-line es/no-object-defineproperty -- safe
    const defineProperty = Object.defineProperty

    module.exports = function (key, value) {
      try {
        defineProperty(globalThis, key, { value, configurable: true, writable: true })
      } catch (error) {
        globalThis[key] = value
      } return value
    }
  }, { '../internals/global-this': 102 }],
  81: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    // Detect IE8's incomplete defineProperty implementation
    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty({}, 1, { get: function () { return 7 } })[1] !== 7
    })
  }, { '../internals/fails': 87 }],
  82: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const isObject = require('../internals/is-object')

    const document = globalThis.document
    // typeof document.createElement is 'object' in old IE
    const EXISTS = isObject(document) && isObject(document.createElement)

    module.exports = function (it) {
      return EXISTS ? document.createElement(it) : {}
    }
  }, { '../internals/global-this': 102, '../internals/is-object': 115 }],
  83: [function (require, module, exports) {
    'use strict'
    // IE8- don't enum bug keys
    module.exports = [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf'
    ]
  }, {}],
  84: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')

    const navigator = globalThis.navigator
    const userAgent = navigator && navigator.userAgent

    module.exports = userAgent ? String(userAgent) : ''
  }, { '../internals/global-this': 102 }],
  85: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const userAgent = require('../internals/environment-user-agent')

    const process = globalThis.process
    const Deno = globalThis.Deno
    const versions = process && process.versions || Deno && Deno.version
    const v8 = versions && versions.v8
    let match, version

    if (v8) {
      match = v8.split('.')
      // in old Chrome, versions of V8 isn't V8 = Chrome / 10
      // but their correct versions are not interesting for us
      version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1])
    }

    // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
    // so check `userAgent` even if `.v8` exists, but 0
    if (!version && userAgent) {
      match = userAgent.match(/Edge\/(\d+)/)
      if (!match || match[1] >= 74) {
        match = userAgent.match(/Chrome\/(\d+)/)
        if (match) version = +match[1]
      }
    }

    module.exports = version
  }, { '../internals/environment-user-agent': 84, '../internals/global-this': 102 }],
  86: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const defineBuiltIn = require('../internals/define-built-in')
    const defineGlobalProperty = require('../internals/define-global-property')
    const copyConstructorProperties = require('../internals/copy-constructor-properties')
    const isForced = require('../internals/is-forced')

    /*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
    module.exports = function (options, source) {
      const TARGET = options.target
      const GLOBAL = options.global
      const STATIC = options.stat
      let FORCED, target, key, targetProperty, sourceProperty, descriptor
      if (GLOBAL) {
        target = globalThis
      } else if (STATIC) {
        target = globalThis[TARGET] || defineGlobalProperty(TARGET, {})
      } else {
        target = globalThis[TARGET] && globalThis[TARGET].prototype
      }
      if (target) {
        for (key in source) {
          sourceProperty = source[key]
          if (options.dontCallGetSet) {
            descriptor = getOwnPropertyDescriptor(target, key)
            targetProperty = descriptor && descriptor.value
          } else targetProperty = target[key]
          FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced)
          // contained in target
          if (!FORCED && targetProperty !== undefined) {
            if (typeof sourceProperty === typeof targetProperty) continue
            copyConstructorProperties(sourceProperty, targetProperty)
          }
          // add a flag to not completely full polyfills
          if (options.sham || (targetProperty && targetProperty.sham)) {
            createNonEnumerableProperty(sourceProperty, 'sham', true)
          }
          defineBuiltIn(target, key, sourceProperty, options)
        }
      }
    }
  }, { '../internals/copy-constructor-properties': 71, '../internals/create-non-enumerable-property': 74, '../internals/define-built-in': 78, '../internals/define-global-property': 80, '../internals/global-this': 102, '../internals/is-forced': 112, '../internals/object-get-own-property-descriptor': 136 }],
  87: [function (require, module, exports) {
    'use strict'
    module.exports = function (exec) {
      try {
        return !!exec()
      } catch (error) {
        return true
      }
    }
  }, {}],
  88: [function (require, module, exports) {
    'use strict'
    const NATIVE_BIND = require('../internals/function-bind-native')

    const FunctionPrototype = Function.prototype
    const apply = FunctionPrototype.apply
    const call = FunctionPrototype.call

    // eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
    module.exports = typeof Reflect === 'object' && Reflect.apply || (NATIVE_BIND
      ? call.bind(apply)
      : function () {
        return call.apply(apply, arguments)
      })
  }, { '../internals/function-bind-native': 90 }],
  89: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this-clause')
    const aCallable = require('../internals/a-callable')
    const NATIVE_BIND = require('../internals/function-bind-native')

    const bind = uncurryThis(uncurryThis.bind)

    // optional / simple context binding
    module.exports = function (fn, that) {
      aCallable(fn)
      return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
        return fn.apply(that, arguments)
      }
    }
  }, { '../internals/a-callable': 59, '../internals/function-bind-native': 90, '../internals/function-uncurry-this-clause': 94 }],
  90: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-function-prototype-bind -- safe
      const test = function () { /* empty */ }.bind()
      // eslint-disable-next-line no-prototype-builtins -- safe
      return typeof test !== 'function' || test.hasOwnProperty('prototype')
    })
  }, { '../internals/fails': 87 }],
  91: [function (require, module, exports) {
    'use strict'
    const NATIVE_BIND = require('../internals/function-bind-native')

    const call = Function.prototype.call
    // eslint-disable-next-line es/no-function-prototype-bind -- safe
    module.exports = NATIVE_BIND
      ? call.bind(call)
      : function () {
        return call.apply(call, arguments)
      }
  }, { '../internals/function-bind-native': 90 }],
  92: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const hasOwn = require('../internals/has-own-property')

    const FunctionPrototype = Function.prototype
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    const getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor

    const EXISTS = hasOwn(FunctionPrototype, 'name')
    // additional protection from minified / mangled / dropped function names
    const PROPER = EXISTS && function something () { /* empty */ }.name === 'something'
    const CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable))

    module.exports = {
      EXISTS,
      PROPER,
      CONFIGURABLE
    }
  }, { '../internals/descriptors': 81, '../internals/has-own-property': 103 }],
  93: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')
    const aCallable = require('../internals/a-callable')

    module.exports = function (object, key, method) {
      try {
        // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
        return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]))
      } catch (error) { /* empty */ }
    }
  }, { '../internals/a-callable': 59, '../internals/function-uncurry-this': 95 }],
  94: [function (require, module, exports) {
    'use strict'
    const classofRaw = require('../internals/classof-raw')
    const uncurryThis = require('../internals/function-uncurry-this')

    module.exports = function (fn) {
      // Nashorn bug:
      //   https://github.com/zloirock/core-js/issues/1128
      //   https://github.com/zloirock/core-js/issues/1130
      if (classofRaw(fn) === 'Function') return uncurryThis(fn)
    }
  }, { '../internals/classof-raw': 69, '../internals/function-uncurry-this': 95 }],
  95: [function (require, module, exports) {
    'use strict'
    const NATIVE_BIND = require('../internals/function-bind-native')

    const FunctionPrototype = Function.prototype
    const call = FunctionPrototype.call
    // eslint-disable-next-line es/no-function-prototype-bind -- safe
    const uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call)

    module.exports = NATIVE_BIND
      ? uncurryThisWithBind
      : function (fn) {
        return function () {
          return call.apply(fn, arguments)
        }
      }
  }, { '../internals/function-bind-native': 90 }],
  96: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const isCallable = require('../internals/is-callable')

    const aFunction = function (argument) {
      return isCallable(argument) ? argument : undefined
    }

    module.exports = function (namespace, method) {
      return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method]
    }
  }, { '../internals/global-this': 102, '../internals/is-callable': 111 }],
  97: [function (require, module, exports) {
    'use strict'
    // `GetIteratorDirect(obj)` abstract operation
    // https://tc39.es/ecma262/#sec-getiteratordirect
    module.exports = function (obj) {
      return {
        iterator: obj,
        next: obj.next,
        done: false
      }
    }
  }, {}],
  98: [function (require, module, exports) {
    'use strict'
    const call = require('../internals/function-call')
    const isCallable = require('../internals/is-callable')
    const anObject = require('../internals/an-object')
    const tryToString = require('../internals/try-to-string')
    const getIteratorMethod = require('../internals/get-iterator-method-internal')

    const $TypeError = TypeError

    module.exports = function (argument, usingIterator) {
      const iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator
      if (isCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument))
      throw new $TypeError(tryToString(argument) + ' is not iterable')
    }
  }, { '../internals/an-object': 66, '../internals/function-call': 91, '../internals/get-iterator-method-internal': 99, '../internals/is-callable': 111, '../internals/try-to-string': 175 }],
  99: [function (require, module, exports) {
    'use strict'
    const classof = require('../internals/classof-raw')
    const isNullOrUndefined = require('../internals/is-null-or-undefined')
    const getMethod = require('../internals/get-method')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const ITERATOR = wellKnownSymbol('iterator')
    const ArrayPrototype = Array.prototype

    module.exports = function (it) {
      if (!isNullOrUndefined(it)) {
        return getMethod(it, ITERATOR) ||
    getMethod(it, '@@iterator') ||
    (classof(it) === 'Arguments' ? ArrayPrototype[ITERATOR] : undefined)
      }
    }
  }, { '../internals/classof-raw': 69, '../internals/get-method': 100, '../internals/is-null-or-undefined': 114, '../internals/well-known-symbol': 182 }],
  100: [function (require, module, exports) {
    'use strict'
    const aCallable = require('../internals/a-callable')
    const isNullOrUndefined = require('../internals/is-null-or-undefined')

    // `GetMethod` abstract operation
    // https://tc39.es/ecma262/#sec-getmethod
    module.exports = function (V, P) {
      const func = V[P]
      return isNullOrUndefined(func) ? undefined : aCallable(func)
    }
  }, { '../internals/a-callable': 59, '../internals/is-null-or-undefined': 114 }],
  101: [function (require, module, exports) {
    'use strict'
    const aCallable = require('../internals/a-callable')
    const anObject = require('../internals/an-object')
    const call = require('../internals/function-call')
    const toIntegerOrInfinity = require('../internals/to-integer-or-infinity')
    const getIteratorDirect = require('../internals/get-iterator-direct')

    const INVALID_SIZE = 'Invalid size'
    const $RangeError = RangeError
    const $TypeError = TypeError
    const max = Math.max

    const SetRecord = function (set, intSize) {
      this.set = set
      this.size = max(intSize, 0)
      this.has = aCallable(set.has)
      this.keys = aCallable(set.keys)
    }

    SetRecord.prototype = {
      getIterator: function () {
        return getIteratorDirect(anObject(call(this.keys, this.set)))
      },
      includes: function (it) {
        return call(this.has, this.set, it)
      }
    }

    // `GetSetRecord` abstract operation
    // https://tc39.es/proposal-set-methods/#sec-getsetrecord
    module.exports = function (obj) {
      anObject(obj)
      const numSize = +obj.size
      // NOTE: If size is undefined, then numSize will be NaN
      // eslint-disable-next-line no-self-compare -- NaN check
      if (numSize !== numSize) throw new $TypeError(INVALID_SIZE)
      const intSize = toIntegerOrInfinity(numSize)
      if (intSize < 0) throw new $RangeError(INVALID_SIZE)
      return new SetRecord(obj, intSize)
    }
  }, { '../internals/a-callable': 59, '../internals/an-object': 66, '../internals/function-call': 91, '../internals/get-iterator-direct': 97, '../internals/to-integer-or-infinity': 167 }],
  102: [function (require, module, exports) {
    (function (global) {
      (function () {
        'use strict'
        const check = function (it) {
          return it && it.Math === Math && it
        }

        // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
        module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis === 'object' && globalThis) ||
  check(typeof window === 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self === 'object' && self) ||
  check(typeof global === 'object' && global) ||
  check(typeof this === 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this })() || Function('return this')()
      }).call(this)
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, {}],
  103: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')
    const toObject = require('../internals/to-object')

    const hasOwnProperty = uncurryThis({}.hasOwnProperty)

    // `HasOwnProperty` abstract operation
    // https://tc39.es/ecma262/#sec-hasownproperty
    // eslint-disable-next-line es/no-object-hasown -- safe
    module.exports = Object.hasOwn || function hasOwn (it, key) {
      return hasOwnProperty(toObject(it), key)
    }
  }, { '../internals/function-uncurry-this': 95, '../internals/to-object': 169 }],
  104: [function (require, module, exports) {
    'use strict'
    module.exports = {}
  }, {}],
  105: [function (require, module, exports) {
    'use strict'
    const getBuiltIn = require('../internals/get-built-in')

    module.exports = getBuiltIn('document', 'documentElement')
  }, { '../internals/get-built-in': 96 }],
  106: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const fails = require('../internals/fails')
    const createElement = require('../internals/document-create-element')

    // Thanks to IE8 for its funny defineProperty
    module.exports = !DESCRIPTORS && !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty(createElement('div'), 'a', {
        get: function () { return 7 }
      }).a !== 7
    })
  }, { '../internals/descriptors': 81, '../internals/document-create-element': 82, '../internals/fails': 87 }],
  107: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')
    const fails = require('../internals/fails')
    const classof = require('../internals/classof-raw')

    const $Object = Object
    const split = uncurryThis(''.split)

    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    module.exports = fails(function () {
      // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
      // eslint-disable-next-line no-prototype-builtins -- safe
      return !$Object('z').propertyIsEnumerable(0)
    }) ? function (it) {
        return classof(it) === 'String' ? split(it, '') : $Object(it)
      } : $Object
  }, { '../internals/classof-raw': 69, '../internals/fails': 87, '../internals/function-uncurry-this': 95 }],
  108: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')
    const isCallable = require('../internals/is-callable')
    const store = require('../internals/shared-store')

    const functionToString = uncurryThis(Function.toString)

    // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
    if (!isCallable(store.inspectSource)) {
      store.inspectSource = function (it) {
        return functionToString(it)
      }
    }

    module.exports = store.inspectSource
  }, { '../internals/function-uncurry-this': 95, '../internals/is-callable': 111, '../internals/shared-store': 162 }],
  109: [function (require, module, exports) {
    'use strict'
    const NATIVE_WEAK_MAP = require('../internals/weak-map-basic-detection')
    const globalThis = require('../internals/global-this')
    const isObject = require('../internals/is-object')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const hasOwn = require('../internals/has-own-property')
    const shared = require('../internals/shared-store')
    const sharedKey = require('../internals/shared-key')
    const hiddenKeys = require('../internals/hidden-keys')

    const OBJECT_ALREADY_INITIALIZED = 'Object already initialized'
    const TypeError = globalThis.TypeError
    const WeakMap = globalThis.WeakMap
    let set, get, has

    const enforce = function (it) {
      return has(it) ? get(it) : set(it, {})
    }

    const getterFor = function (TYPE) {
      return function (it) {
        let state
        if (!isObject(it) || (state = get(it)).type !== TYPE) {
          throw new TypeError('Incompatible receiver, ' + TYPE + ' required')
        } return state
      }
    }

    if (NATIVE_WEAK_MAP || shared.state) {
      const store = shared.state || (shared.state = new WeakMap())
      /* eslint-disable no-self-assign -- prototype methods protection */
      store.get = store.get
      store.has = store.has
      store.set = store.set
      /* eslint-enable no-self-assign -- prototype methods protection */
      set = function (it, metadata) {
        if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED)
        metadata.facade = it
        store.set(it, metadata)
        return metadata
      }
      get = function (it) {
        return store.get(it) || {}
      }
      has = function (it) {
        return store.has(it)
      }
    } else {
      const STATE = sharedKey('state')
      hiddenKeys[STATE] = true
      set = function (it, metadata) {
        if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED)
        metadata.facade = it
        createNonEnumerableProperty(it, STATE, metadata)
        return metadata
      }
      get = function (it) {
        return hasOwn(it, STATE) ? it[STATE] : {}
      }
      has = function (it) {
        return hasOwn(it, STATE)
      }
    }

    module.exports = {
      set,
      get,
      has,
      enforce,
      getterFor
    }
  }, { '../internals/create-non-enumerable-property': 74, '../internals/global-this': 102, '../internals/has-own-property': 103, '../internals/hidden-keys': 104, '../internals/is-object': 115, '../internals/shared-key': 161, '../internals/shared-store': 162, '../internals/weak-map-basic-detection': 179 }],
  110: [function (require, module, exports) {
    'use strict'
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const Iterators = require('../internals/iterators')

    const ITERATOR = wellKnownSymbol('iterator')
    const ArrayPrototype = Array.prototype

    // check on default Array iterator
    module.exports = function (it) {
      return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it)
    }
  }, { '../internals/iterators': 127, '../internals/well-known-symbol': 182 }],
  111: [function (require, module, exports) {
    'use strict'
    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
    const documentAll = typeof document === 'object' && document.all

    // `IsCallable` abstract operation
    // https://tc39.es/ecma262/#sec-iscallable
    // eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
    module.exports = typeof documentAll === 'undefined' && documentAll !== undefined
      ? function (argument) {
        return typeof argument === 'function' || argument === documentAll
      }
      : function (argument) {
        return typeof argument === 'function'
      }
  }, {}],
  112: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')
    const isCallable = require('../internals/is-callable')

    const replacement = /#|\.prototype\./

    const isForced = function (feature, detection) {
      const value = data[normalize(feature)]
      return value === POLYFILL
        ? true
        : value === NATIVE
          ? false
          : isCallable(detection)
            ? fails(detection)
            : !!detection
    }

    var normalize = isForced.normalize = function (string) {
      return String(string).replace(replacement, '.').toLowerCase()
    }

    var data = isForced.data = {}
    var NATIVE = isForced.NATIVE = 'N'
    var POLYFILL = isForced.POLYFILL = 'P'

    module.exports = isForced
  }, { '../internals/fails': 87, '../internals/is-callable': 111 }],
  113: [function (require, module, exports) {
    'use strict'
    const classof = require('../internals/classof-raw')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const ITERATOR = wellKnownSymbol('iterator')

    module.exports = function (it) {
      return it[ITERATOR] !== undefined ||
    it['@@iterator'] !== undefined ||
    classof(it) === 'Arguments'
    }
  }, { '../internals/classof-raw': 69, '../internals/well-known-symbol': 182 }],
  114: [function (require, module, exports) {
    'use strict'
    // we can't use just `it == null` since of `document.all` special case
    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
    module.exports = function (it) {
      return it === null || it === undefined
    }
  }, {}],
  115: [function (require, module, exports) {
    'use strict'
    const isCallable = require('../internals/is-callable')

    module.exports = function (it) {
      return typeof it === 'object' ? it !== null : isCallable(it)
    }
  }, { '../internals/is-callable': 111 }],
  116: [function (require, module, exports) {
    'use strict'
    module.exports = false
  }, {}],
  117: [function (require, module, exports) {
    'use strict'
    const getBuiltIn = require('../internals/get-built-in')
    const isCallable = require('../internals/is-callable')
    const isPrototypeOf = require('../internals/object-is-prototype-of')
    const USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid')

    const $Object = Object

    module.exports = USE_SYMBOL_AS_UID
      ? function (it) {
        return typeof it === 'symbol'
      }
      : function (it) {
        const $Symbol = getBuiltIn('Symbol')
        return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it))
      }
  }, { '../internals/get-built-in': 96, '../internals/is-callable': 111, '../internals/object-is-prototype-of': 140, '../internals/use-symbol-as-uid': 177 }],
  118: [function (require, module, exports) {
    'use strict'
    const call = require('../internals/function-call')

    module.exports = function (record, fn, ITERATOR_INSTEAD_OF_RECORD) {
      const iterator = ITERATOR_INSTEAD_OF_RECORD ? record : record.iterator
      const next = record.next
      let step, result
      while (!(step = call(next, iterator)).done) {
        result = fn(step.value)
        if (result !== undefined) return result
      }
    }
  }, { '../internals/function-call': 91 }],
  119: [function (require, module, exports) {
    'use strict'
    const bind = require('../internals/function-bind-context')
    const call = require('../internals/function-call')
    const anObject = require('../internals/an-object')
    const tryToString = require('../internals/try-to-string')
    const isArrayIteratorMethod = require('../internals/is-array-iterator-method')
    const lengthOfArrayLike = require('../internals/length-of-array-like')
    const isPrototypeOf = require('../internals/object-is-prototype-of')
    const getIterator = require('../internals/get-iterator-internal')
    const getIteratorMethod = require('../internals/get-iterator-method-internal')
    const iteratorClose = require('../internals/iterator-close')

    const $TypeError = TypeError

    const Result = function (stopped, result) {
      this.stopped = stopped
      this.result = result
    }

    const ResultPrototype = Result.prototype

    module.exports = function (iterable, unboundFunction, options) {
      const that = options && options.that
      const AS_ENTRIES = !!(options && options.AS_ENTRIES)
      const IS_RECORD = !!(options && options.IS_RECORD)
      const IS_ITERATOR = !!(options && options.IS_ITERATOR)
      const INTERRUPTED = !!(options && options.INTERRUPTED)
      const fn = bind(unboundFunction, that)
      let iterator, iterFn, index, length, result, next, step

      const stop = function (condition) {
        const $iterator = iterator
        iterator = undefined
        if ($iterator) iteratorClose($iterator, 'normal')
        return new Result(true, condition)
      }

      const callFn = function (value) {
        if (AS_ENTRIES) {
          anObject(value)
          return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1])
        } return INTERRUPTED ? fn(value, stop) : fn(value)
      }

      if (IS_RECORD) {
        iterator = iterable.iterator
      } else if (IS_ITERATOR) {
        iterator = iterable
      } else {
        iterFn = getIteratorMethod(iterable)
        if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable')
        // optimisation for array iterators
        if (isArrayIteratorMethod(iterFn)) {
          for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
            result = callFn(iterable[index])
            if (result && isPrototypeOf(ResultPrototype, result)) return result
          } return new Result(false)
        }
        iterator = getIterator(iterable, iterFn)
      }

      next = IS_RECORD ? iterable.next : iterator.next
      while (!(step = call(next, iterator)).done) {
        // `IteratorValue` errors should propagate without closing the iterator
        const value = step.value
        try {
          result = callFn(value)
        } catch (error) {
          if (iterator) iteratorClose(iterator, 'throw', error)
          else throw error
        }
        if (typeof result === 'object' && result && isPrototypeOf(ResultPrototype, result)) return result
      } return new Result(false)
    }
  }, { '../internals/an-object': 66, '../internals/function-bind-context': 89, '../internals/function-call': 91, '../internals/get-iterator-internal': 98, '../internals/get-iterator-method-internal': 99, '../internals/is-array-iterator-method': 110, '../internals/iterator-close': 122, '../internals/length-of-array-like': 128, '../internals/object-is-prototype-of': 140, '../internals/try-to-string': 175 }],
  120: [function (require, module, exports) {
    'use strict'
    // release references held by exhausted / closed iterator helpers to allow GC of the source chain
    module.exports = function (state) {
      state.iterator = state.next = state.nextHandler = state.mapper = state.predicate = state.inner =
    state.iterables = state.iters = state.openIters = state.padding = state.finishResults = state.buffer = null
    }
  }, {}],
  121: [function (require, module, exports) {
    'use strict'
    const iteratorClose = require('../internals/iterator-close')

    module.exports = function (iters, kind, value) {
      for (let i = iters.length - 1; i >= 0; i--) {
        if (iters[i] === undefined) continue
        try {
          value = iteratorClose(iters[i].iterator, kind, value)
        } catch (error) {
          kind = 'throw'
          value = error
        }
      }
      if (kind === 'throw') throw value
      return value
    }
  }, { '../internals/iterator-close': 122 }],
  122: [function (require, module, exports) {
    'use strict'
    const call = require('../internals/function-call')
    const anObject = require('../internals/an-object')
    const getMethod = require('../internals/get-method')

    module.exports = function (iterator, kind, value) {
      let innerResult, innerError
      anObject(iterator)
      try {
        innerResult = getMethod(iterator, 'return')
        if (!innerResult) {
          if (kind === 'throw') throw value
          return value
        }
        innerResult = call(innerResult, iterator)
      } catch (error) {
        innerError = true
        innerResult = error
      }
      if (kind === 'throw') throw value
      if (innerError) throw innerResult
      anObject(innerResult)
      return value
    }
  }, { '../internals/an-object': 66, '../internals/function-call': 91, '../internals/get-method': 100 }],
  123: [function (require, module, exports) {
    'use strict'
    const call = require('../internals/function-call')
    const create = require('../internals/object-create')
    const createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    const defineBuiltIns = require('../internals/define-built-ins')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const InternalStateModule = require('../internals/internal-state')
    const getMethod = require('../internals/get-method')
    const IteratorPrototype = require('../internals/iterators-core').IteratorPrototype
    const createIterResultObject = require('../internals/create-iter-result-object')
    const iteratorClose = require('../internals/iterator-close')
    const iteratorCloseAll = require('../internals/iterator-close-all')
    const cleanupState = require('../internals/iterator-cleanup-state')

    const TO_STRING_TAG = wellKnownSymbol('toStringTag')
    const ITERATOR_HELPER = 'IteratorHelper'
    const WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator'
    const NORMAL = 'normal'
    const THROW = 'throw'
    const setInternalState = InternalStateModule.set

    const createIteratorProxyPrototype = function (IS_ITERATOR) {
      const getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER)

      return defineBuiltIns(create(IteratorPrototype), {
        next: function next () {
          const state = getInternalState(this)
          // for simplification:
          //   for `%WrapForValidIteratorPrototype%.next` or with `state.returnHandlerResult` our `nextHandler` returns `IterResultObject`
          //   for `%IteratorHelperPrototype%.next` - just a value
          if (IS_ITERATOR) return state.nextHandler()
          if (state.done) return createIterResultObject(undefined, true)
          try {
            const result = state.nextHandler()
            if (state.done) cleanupState(state)
            return state.returnHandlerResult ? result : createIterResultObject(result, state.done)
          } catch (error) {
            state.done = true
            cleanupState(state)
            throw error
          }
        },
        return: function () {
          const state = getInternalState(this)
          const iterator = state.iterator
          const inner = state.inner
          const openIters = state.openIters
          const done = state.done
          state.done = true
          if (IS_ITERATOR) {
            const returnMethod = getMethod(iterator, 'return')
            return returnMethod ? call(returnMethod, iterator) : createIterResultObject(undefined, true)
          }
          cleanupState(state)
          if (done) return createIterResultObject(undefined, true)
          if (inner) {
            try {
              iteratorClose(inner.iterator, NORMAL)
            } catch (error) {
              return iteratorClose(iterator, THROW, error)
            }
          }
          if (openIters) {
            try {
              iteratorCloseAll(openIters, NORMAL)
            } catch (error) {
              if (iterator) return iteratorClose(iterator, THROW, error)
              throw error
            }
          }
          if (iterator) iteratorClose(iterator, NORMAL)
          return createIterResultObject(undefined, true)
        }
      })
    }

    const WrapForValidIteratorPrototype = createIteratorProxyPrototype(true)
    const IteratorHelperPrototype = createIteratorProxyPrototype(false)

    createNonEnumerableProperty(IteratorHelperPrototype, TO_STRING_TAG, 'Iterator Helper')

    module.exports = function (nextHandler, IS_ITERATOR, RETURN_HANDLER_RESULT) {
      const IteratorProxy = function Iterator (record, state) {
        if (state) {
          state.iterator = record.iterator
          state.next = record.next
        } else state = record
        state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER
        state.returnHandlerResult = !!RETURN_HANDLER_RESULT
        state.nextHandler = nextHandler
        state.counter = 0
        state.done = false
        setInternalState(this, state)
      }

      IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype

      return IteratorProxy
    }
  }, { '../internals/create-iter-result-object': 73, '../internals/create-non-enumerable-property': 74, '../internals/define-built-ins': 79, '../internals/function-call': 91, '../internals/get-method': 100, '../internals/internal-state': 109, '../internals/iterator-cleanup-state': 120, '../internals/iterator-close': 122, '../internals/iterator-close-all': 121, '../internals/iterators-core': 126, '../internals/object-create': 133, '../internals/well-known-symbol': 182 }],
  124: [function (require, module, exports) {
    'use strict'
    // Should throw an error on invalid iterator
    // https://issues.chromium.org/issues/336839115
    module.exports = function (methodName, argument) {
      // eslint-disable-next-line es/no-iterator -- required for testing
      const method = typeof Iterator === 'function' && Iterator.prototype[methodName]
      if (method) {
        try {
          method.call({ next: null }, argument).next()
        } catch (error) {
          return true
        }
      }
    }
  }, {}],
  125: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')

    // https://github.com/tc39/ecma262/pull/3467
    module.exports = function (METHOD_NAME, ExpectedError) {
      const Iterator = globalThis.Iterator
      const IteratorPrototype = Iterator && Iterator.prototype
      const method = IteratorPrototype && IteratorPrototype[METHOD_NAME]

      let CLOSED = false

      if (method) {
        try {
          method.call({
            next: function () { return { done: true } },
            return: function () { CLOSED = true }
          }, -1)
        } catch (error) {
        // https://bugs.webkit.org/show_bug.cgi?id=291195
          if (!(error instanceof ExpectedError)) CLOSED = false
        }
      }

      if (!CLOSED) return method
    }
  }, { '../internals/global-this': 102 }],
  126: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')
    const isCallable = require('../internals/is-callable')
    const isObject = require('../internals/is-object')
    const create = require('../internals/object-create')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const defineBuiltIn = require('../internals/define-built-in')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const IS_PURE = require('../internals/is-pure')

    const ITERATOR = wellKnownSymbol('iterator')
    let BUGGY_SAFARI_ITERATORS = false

    // `%IteratorPrototype%` object
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
    let IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator

    /* eslint-disable es/no-array-prototype-keys -- safe */
    if ([].keys) {
      arrayIterator = [].keys()
      // Safari 8 has buggy iterators w/o `next`
      if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true
      else {
        PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator))
        if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype
      }
    }

    const NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
      const test = {}
      // FF44- legacy iterators case
      return IteratorPrototype[ITERATOR].call(test) !== test
    })

    if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {}
    else if (IS_PURE) IteratorPrototype = create(IteratorPrototype)

    // `%IteratorPrototype%[@@iterator]()` method
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
    if (!isCallable(IteratorPrototype[ITERATOR])) {
      defineBuiltIn(IteratorPrototype, ITERATOR, function () {
        return this
      })
    }

    module.exports = {
      IteratorPrototype,
      BUGGY_SAFARI_ITERATORS
    }
  }, { '../internals/define-built-in': 78, '../internals/fails': 87, '../internals/is-callable': 111, '../internals/is-object': 115, '../internals/is-pure': 116, '../internals/object-create': 133, '../internals/object-get-prototype-of': 139, '../internals/well-known-symbol': 182 }],
  127: [function (require, module, exports) {
    'use strict'
    module.exports = Object.create ? Object.create(null) : {}
  }, {}],
  128: [function (require, module, exports) {
    'use strict'
    const toLength = require('../internals/to-length')

    // `LengthOfArrayLike` abstract operation
    // https://tc39.es/ecma262/#sec-lengthofarraylike
    module.exports = function (obj) {
      return toLength(obj.length)
    }
  }, { '../internals/to-length': 168 }],
  129: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')
    const fails = require('../internals/fails')
    const isCallable = require('../internals/is-callable')
    const hasOwn = require('../internals/has-own-property')
    const DESCRIPTORS = require('../internals/descriptors')
    const CONFIGURABLE_FUNCTION_NAME = require('../internals/function-name').CONFIGURABLE
    const inspectSource = require('../internals/inspect-source')
    const InternalStateModule = require('../internals/internal-state')

    const enforceInternalState = InternalStateModule.enforce
    const getInternalState = InternalStateModule.get
    const $String = String
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    const defineProperty = Object.defineProperty
    const stringSlice = uncurryThis(''.slice)
    const replace = uncurryThis(''.replace)
    const join = uncurryThis([].join)

    const CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
      return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8
    })

    const TEMPLATE = String(String).split('String')

    const makeBuiltIn = module.exports = function (value, name, options) {
      if (stringSlice($String(name), 0, 7) === 'Symbol(') {
        name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']'
      }
      if (options && options.getter) name = 'get ' + name
      if (options && options.setter) name = 'set ' + name
      if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
        if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true })
        else value.name = name
      }
      if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
        defineProperty(value, 'length', { value: options.arity })
      }
      try {
        if (options && hasOwn(options, 'constructor') && options.constructor) {
          if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false })
          // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
        } else if (value.prototype) value.prototype = undefined
      } catch (error) { /* empty */ }
      const state = enforceInternalState(value)
      if (!hasOwn(state, 'source')) {
        state.source = join(TEMPLATE, typeof name === 'string' ? name : '')
      } return value
    }

    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    // eslint-disable-next-line no-extend-native -- required
    Function.prototype.toString = makeBuiltIn(function toString () {
      return isCallable(this) && getInternalState(this).source || inspectSource(this)
    }, 'toString')
  }, { '../internals/descriptors': 81, '../internals/fails': 87, '../internals/function-name': 92, '../internals/function-uncurry-this': 95, '../internals/has-own-property': 103, '../internals/inspect-source': 108, '../internals/internal-state': 109, '../internals/is-callable': 111 }],
  130: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    // eslint-disable-next-line es/no-map -- safe
    const MapPrototype = Map.prototype

    module.exports = {
      // eslint-disable-next-line es/no-map -- safe
      Map,
      set: uncurryThis(MapPrototype.set),
      get: uncurryThis(MapPrototype.get),
      has: uncurryThis(MapPrototype.has),
      remove: uncurryThis(MapPrototype.delete),
      proto: MapPrototype
    }
  }, { '../internals/function-uncurry-this': 95 }],
  131: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')
    const iterateSimple = require('../internals/iterate-simple')
    const MapHelpers = require('../internals/map-helpers')

    const Map = MapHelpers.Map
    const MapPrototype = MapHelpers.proto
    const forEach = uncurryThis(MapPrototype.forEach)
    const entries = uncurryThis(MapPrototype.entries)
    const next = entries(new Map()).next

    module.exports = function (map, fn, interruptible) {
      return interruptible
        ? iterateSimple({ iterator: entries(map), next }, function (entry) {
          return fn(entry[1], entry[0])
        })
        : forEach(map, fn)
    }
  }, { '../internals/function-uncurry-this': 95, '../internals/iterate-simple': 118, '../internals/map-helpers': 130 }],
  132: [function (require, module, exports) {
    'use strict'
    const ceil = Math.ceil
    const floor = Math.floor

    // `Math.trunc` method
    // https://tc39.es/ecma262/#sec-math.trunc
    // eslint-disable-next-line es/no-math-trunc -- safe
    module.exports = Math.trunc || function trunc (x) {
      const n = +x
      return (n > 0 ? floor : ceil)(n)
    }
  }, {}],
  133: [function (require, module, exports) {
    'use strict'
    /* global ActiveXObject -- old IE, WSH */
    const anObject = require('../internals/an-object')
    const definePropertiesModule = require('../internals/object-define-properties')
    const enumBugKeys = require('../internals/enum-bug-keys')
    const hiddenKeys = require('../internals/hidden-keys')
    const html = require('../internals/html')
    const documentCreateElement = require('../internals/document-create-element')
    const sharedKey = require('../internals/shared-key')

    const GT = '>'
    const LT = '<'
    const PROTOTYPE = 'prototype'
    const SCRIPT = 'script'
    const IE_PROTO = sharedKey('IE_PROTO')

    const EmptyConstructor = function () { /* empty */ }

    const scriptTag = function (content) {
      return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT
    }

    // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
    const NullProtoObjectViaActiveX = function (activeXDocument) {
      activeXDocument.write(scriptTag(''))
      activeXDocument.close()
      const temp = activeXDocument.parentWindow.Object
      // eslint-disable-next-line no-useless-assignment -- avoid memory leak
      activeXDocument = null
      return temp
    }

    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    const NullProtoObjectViaIFrame = function () {
      // Thrash, waste and sodomy: IE GC bug
      const iframe = documentCreateElement('iframe')
      const JS = 'java' + SCRIPT + ':'
      let iframeDocument
      iframe.style.display = 'none'
      html.appendChild(iframe)
      // https://github.com/zloirock/core-js/issues/475
      iframe.src = String(JS)
      iframeDocument = iframe.contentWindow.document
      iframeDocument.open()
      iframeDocument.write(scriptTag('document.F=Object'))
      iframeDocument.close()
      return iframeDocument.F
    }

    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    // avoid IE GC bug
    let activeXDocument
    let NullProtoObject = function () {
      try {
        activeXDocument = new ActiveXObject('htmlfile')
      } catch (error) { /* ignore */ }
      NullProtoObject = typeof document !== 'undefined'
        ? document.domain && activeXDocument
          ? NullProtoObjectViaActiveX(activeXDocument) // old IE
          : NullProtoObjectViaIFrame()
        : NullProtoObjectViaActiveX(activeXDocument) // WSH
      let length = enumBugKeys.length
      while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]]
      return NullProtoObject()
    }

    hiddenKeys[IE_PROTO] = true

    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    // eslint-disable-next-line es/no-object-create -- safe
    module.exports = Object.create || function create (O, Properties) {
      let result
      if (O !== null) {
        EmptyConstructor[PROTOTYPE] = anObject(O)
        result = new EmptyConstructor()
        EmptyConstructor[PROTOTYPE] = null
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO] = O
      } else result = NullProtoObject()
      return Properties === undefined ? result : definePropertiesModule.f(result, Properties)
    }
  }, { '../internals/an-object': 66, '../internals/document-create-element': 82, '../internals/enum-bug-keys': 83, '../internals/hidden-keys': 104, '../internals/html': 105, '../internals/object-define-properties': 134, '../internals/shared-key': 161 }],
  134: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug')
    const definePropertyModule = require('../internals/object-define-property')
    const anObject = require('../internals/an-object')
    const toIndexedObject = require('../internals/to-indexed-object')
    const objectKeys = require('../internals/object-keys')

    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    // eslint-disable-next-line es/no-object-defineproperties -- safe
    exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG
      ? Object.defineProperties
      : function defineProperties (O, Properties) {
        anObject(O)
        const props = toIndexedObject(Properties)
        const keys = objectKeys(Properties)
        const length = keys.length
        let index = 0
        let key
        while (length > index) definePropertyModule.f(O, key = keys[index++], props[key])
        return O
      }
  }, { '../internals/an-object': 66, '../internals/descriptors': 81, '../internals/object-define-property': 135, '../internals/object-keys': 142, '../internals/to-indexed-object': 166, '../internals/v8-prototype-define-bug': 178 }],
  135: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const IE8_DOM_DEFINE = require('../internals/ie8-dom-define')
    const V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug')
    const anObject = require('../internals/an-object')
    const toPropertyKey = require('../internals/to-property-key')

    const $TypeError = TypeError
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    const $defineProperty = Object.defineProperty
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    const $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
    const ENUMERABLE = 'enumerable'
    const CONFIGURABLE = 'configurable'
    const WRITABLE = 'writable'

    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG
      ? function defineProperty (O, P, Attributes) {
        anObject(O)
        P = toPropertyKey(P)
        anObject(Attributes)
        if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
          const current = $getOwnPropertyDescriptor(O, P)
          if (current && current[WRITABLE]) {
            O[P] = Attributes.value
            Attributes = {
              configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
              enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
              writable: false
            }
          }
        } return $defineProperty(O, P, Attributes)
      }
      : $defineProperty : function defineProperty (O, P, Attributes) {
      anObject(O)
      P = toPropertyKey(P)
      anObject(Attributes)
      if (IE8_DOM_DEFINE) {
        try {
          return $defineProperty(O, P, Attributes)
        } catch (error) { /* empty */ }
      }
      if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported')
      if ('value' in Attributes) O[P] = Attributes.value
      return O
    }
  }, { '../internals/an-object': 66, '../internals/descriptors': 81, '../internals/ie8-dom-define': 106, '../internals/to-property-key': 171, '../internals/v8-prototype-define-bug': 178 }],
  136: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const call = require('../internals/function-call')
    const propertyIsEnumerableModule = require('../internals/object-property-is-enumerable')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')
    const toIndexedObject = require('../internals/to-indexed-object')
    const toPropertyKey = require('../internals/to-property-key')
    const hasOwn = require('../internals/has-own-property')
    const IE8_DOM_DEFINE = require('../internals/ie8-dom-define')

    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    const $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor

    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
    exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor (O, P) {
      O = toIndexedObject(O)
      P = toPropertyKey(P)
      if (IE8_DOM_DEFINE) {
        try {
          return $getOwnPropertyDescriptor(O, P)
        } catch (error) { /* empty */ }
      }
      if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P])
    }
  }, { '../internals/create-property-descriptor': 75, '../internals/descriptors': 81, '../internals/function-call': 91, '../internals/has-own-property': 103, '../internals/ie8-dom-define': 106, '../internals/object-property-is-enumerable': 143, '../internals/to-indexed-object': 166, '../internals/to-property-key': 171 }],
  137: [function (require, module, exports) {
    'use strict'
    const internalObjectKeys = require('../internals/object-keys-internal')
    const enumBugKeys = require('../internals/enum-bug-keys')

    const hiddenKeys = enumBugKeys.concat('length', 'prototype')

    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    // eslint-disable-next-line es/no-object-getownpropertynames -- safe
    exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames (O) {
      return internalObjectKeys(O, hiddenKeys)
    }
  }, { '../internals/enum-bug-keys': 83, '../internals/object-keys-internal': 141 }],
  138: [function (require, module, exports) {
    'use strict'
    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    exports.f = Object.getOwnPropertySymbols
  }, {}],
  139: [function (require, module, exports) {
    'use strict'
    const hasOwn = require('../internals/has-own-property')
    const isCallable = require('../internals/is-callable')
    const toObject = require('../internals/to-object')
    const sharedKey = require('../internals/shared-key')
    const CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter')

    const IE_PROTO = sharedKey('IE_PROTO')
    const $Object = Object
    const ObjectPrototype = $Object.prototype

    // `Object.getPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.getprototypeof
    // eslint-disable-next-line es/no-object-getprototypeof -- safe
    module.exports = CORRECT_PROTOTYPE_GETTER
      ? $Object.getPrototypeOf
      : function (O) {
        const object = toObject(O)
        if (hasOwn(object, IE_PROTO)) return object[IE_PROTO]
        const constructor = object.constructor
        if (isCallable(constructor) && object instanceof constructor) {
          return constructor.prototype
        } return object instanceof $Object ? ObjectPrototype : null
      }
  }, { '../internals/correct-prototype-getter': 72, '../internals/has-own-property': 103, '../internals/is-callable': 111, '../internals/shared-key': 161, '../internals/to-object': 169 }],
  140: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    module.exports = uncurryThis({}.isPrototypeOf)
  }, { '../internals/function-uncurry-this': 95 }],
  141: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')
    const hasOwn = require('../internals/has-own-property')
    const toIndexedObject = require('../internals/to-indexed-object')
    const indexOf = require('../internals/array-includes').indexOf
    const hiddenKeys = require('../internals/hidden-keys')

    const push = uncurryThis([].push)

    module.exports = function (object, names) {
      const O = toIndexedObject(object)
      let i = 0
      const result = []
      let key
      for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key)
      // Don't enum bug & hidden keys
      while (names.length > i) {
        if (hasOwn(O, key = names[i++])) {
          ~indexOf(result, key) || push(result, key)
        }
      }
      return result
    }
  }, { '../internals/array-includes': 67, '../internals/function-uncurry-this': 95, '../internals/has-own-property': 103, '../internals/hidden-keys': 104, '../internals/to-indexed-object': 166 }],
  142: [function (require, module, exports) {
    'use strict'
    const internalObjectKeys = require('../internals/object-keys-internal')
    const enumBugKeys = require('../internals/enum-bug-keys')

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    module.exports = Object.keys || function keys (O) {
      return internalObjectKeys(O, enumBugKeys)
    }
  }, { '../internals/enum-bug-keys': 83, '../internals/object-keys-internal': 141 }],
  143: [function (require, module, exports) {
    'use strict'
    const $propertyIsEnumerable = {}.propertyIsEnumerable
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor

    // Nashorn ~ JDK8 bug
    const NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1)

    // `Object.prototype.propertyIsEnumerable` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
    exports.f = NASHORN_BUG
      ? function propertyIsEnumerable (V) {
        const descriptor = getOwnPropertyDescriptor(this, V)
        return !!descriptor && descriptor.enumerable
      }
      : $propertyIsEnumerable
  }, {}],
  144: [function (require, module, exports) {
    'use strict'
    const call = require('../internals/function-call')
    const isCallable = require('../internals/is-callable')
    const isObject = require('../internals/is-object')

    const $TypeError = TypeError

    // `OrdinaryToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-ordinarytoprimitive
    module.exports = function (input, pref) {
      let fn, val
      if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val
      if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val
      if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val
      throw new $TypeError("Can't convert object to primitive value")
    }
  }, { '../internals/function-call': 91, '../internals/is-callable': 111, '../internals/is-object': 115 }],
  145: [function (require, module, exports) {
    'use strict'
    const getBuiltIn = require('../internals/get-built-in')
    const uncurryThis = require('../internals/function-uncurry-this')
    const getOwnPropertyNamesModule = require('../internals/object-get-own-property-names')
    const getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols')
    const anObject = require('../internals/an-object')

    const concat = uncurryThis([].concat)

    // all object keys, includes non-enumerable and symbols
    module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys (it) {
      const keys = getOwnPropertyNamesModule.f(anObject(it))
      const getOwnPropertySymbols = getOwnPropertySymbolsModule.f
      return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys
    }
  }, { '../internals/an-object': 66, '../internals/function-uncurry-this': 95, '../internals/get-built-in': 96, '../internals/object-get-own-property-names': 137, '../internals/object-get-own-property-symbols': 138 }],
  146: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const fails = require('../internals/fails')

    // babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
    const RegExp = globalThis.RegExp

    const FLAGS_GETTER_IS_CORRECT = !fails(function () {
      let INDICES_SUPPORT = true
      try {
        RegExp('.', 'd')
      } catch (error) {
        INDICES_SUPPORT = false
      }

      const O = {}
      // modern V8 bug
      let calls = ''
      const expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy'

      const addGetter = function (key, chr) {
        // eslint-disable-next-line es/no-object-defineproperty -- safe
        Object.defineProperty(O, key, {
          get: function () {
            calls += chr
            return true
          }
        })
      }

      const pairs = {
        dotAll: 's',
        global: 'g',
        ignoreCase: 'i',
        multiline: 'm',
        sticky: 'y'
      }

      if (INDICES_SUPPORT) pairs.hasIndices = 'd'

      for (const key in pairs) addGetter(key, pairs[key])

      // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
      const result = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get.call(O)

      return result !== expected || calls !== expected
    })

    module.exports = { correct: FLAGS_GETTER_IS_CORRECT }
  }, { '../internals/fails': 87, '../internals/global-this': 102 }],
  147: [function (require, module, exports) {
    'use strict'
    const anObject = require('../internals/an-object')

    // `RegExp.prototype.flags` getter implementation
    // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
    module.exports = function () {
      const that = anObject(this)
      let result = ''
      if (that.hasIndices) result += 'd'
      if (that.global) result += 'g'
      if (that.ignoreCase) result += 'i'
      if (that.multiline) result += 'm'
      if (that.dotAll) result += 's'
      if (that.unicode) result += 'u'
      if (that.unicodeSets) result += 'v'
      if (that.sticky) result += 'y'
      return result
    }
  }, { '../internals/an-object': 66 }],
  148: [function (require, module, exports) {
    'use strict'
    const isNullOrUndefined = require('../internals/is-null-or-undefined')

    const $TypeError = TypeError

    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    module.exports = function (it) {
      if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it)
      return it
    }
  }, { '../internals/is-null-or-undefined': 114 }],
  149: [function (require, module, exports) {
    'use strict'
    // `SameValueZero` abstract operation
    // https://tc39.es/ecma262/#sec-samevaluezero
    module.exports = function (x, y) {
      // eslint-disable-next-line no-self-compare -- NaN check
      return x === y || x !== x && y !== y
    }
  }, {}],
  150: [function (require, module, exports) {
    'use strict'
    const SetHelpers = require('../internals/set-helpers')
    const iterate = require('../internals/set-iterate')

    const Set = SetHelpers.Set
    const add = SetHelpers.add

    module.exports = function (set) {
      const result = new Set()
      iterate(set, function (it) {
        add(result, it)
      })
      return result
    }
  }, { '../internals/set-helpers': 152, '../internals/set-iterate': 157 }],
  151: [function (require, module, exports) {
    'use strict'
    const aSet = require('../internals/a-set')
    const SetHelpers = require('../internals/set-helpers')
    const clone = require('../internals/set-clone')
    const size = require('../internals/set-size')
    const getSetRecord = require('../internals/get-set-record')
    const iterateSet = require('../internals/set-iterate')
    const iterateSimple = require('../internals/iterate-simple')

    const has = SetHelpers.has
    const remove = SetHelpers.remove

    // `Set.prototype.difference` method
    // https://tc39.es/ecma262/#sec-set.prototype.difference
    module.exports = function difference (other) {
      const O = aSet(this)
      const otherRec = getSetRecord(other)
      const result = clone(O)
      if (size(result) <= otherRec.size) {
        iterateSet(result, function (e) {
          if (otherRec.includes(e)) remove(result, e)
        })
      } else {
        iterateSimple(otherRec.getIterator(), function (e) {
          if (has(result, e)) remove(result, e)
        })
      }
      return result
    }
  }, { '../internals/a-set': 61, '../internals/get-set-record': 101, '../internals/iterate-simple': 118, '../internals/set-clone': 150, '../internals/set-helpers': 152, '../internals/set-iterate': 157, '../internals/set-size': 158 }],
  152: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    // eslint-disable-next-line es/no-set -- safe
    const SetPrototype = Set.prototype

    module.exports = {
      // eslint-disable-next-line es/no-set -- safe
      Set,
      add: uncurryThis(SetPrototype.add),
      has: uncurryThis(SetPrototype.has),
      remove: uncurryThis(SetPrototype.delete),
      proto: SetPrototype
    }
  }, { '../internals/function-uncurry-this': 95 }],
  153: [function (require, module, exports) {
    'use strict'
    const aSet = require('../internals/a-set')
    const SetHelpers = require('../internals/set-helpers')
    const size = require('../internals/set-size')
    const getSetRecord = require('../internals/get-set-record')
    const iterateSet = require('../internals/set-iterate')
    const iterateSimple = require('../internals/iterate-simple')

    const Set = SetHelpers.Set
    const add = SetHelpers.add
    const has = SetHelpers.has

    // `Set.prototype.intersection` method
    // https://tc39.es/ecma262/#sec-set.prototype.intersection
    module.exports = function intersection (other) {
      const O = aSet(this)
      const otherRec = getSetRecord(other)
      const result = new Set()

      if (size(O) > otherRec.size) {
        iterateSimple(otherRec.getIterator(), function (e) {
          if (has(O, e)) add(result, e)
        })
      } else {
        iterateSet(O, function (e) {
          if (otherRec.includes(e)) add(result, e)
        })
      }

      return result
    }
  }, { '../internals/a-set': 61, '../internals/get-set-record': 101, '../internals/iterate-simple': 118, '../internals/set-helpers': 152, '../internals/set-iterate': 157, '../internals/set-size': 158 }],
  154: [function (require, module, exports) {
    'use strict'
    const aSet = require('../internals/a-set')
    const has = require('../internals/set-helpers').has
    const size = require('../internals/set-size')
    const getSetRecord = require('../internals/get-set-record')
    const iterateSet = require('../internals/set-iterate')
    const iterateSimple = require('../internals/iterate-simple')
    const iteratorClose = require('../internals/iterator-close')

    // `Set.prototype.isDisjointFrom` method
    // https://tc39.es/ecma262/#sec-set.prototype.isdisjointfrom
    module.exports = function isDisjointFrom (other) {
      const O = aSet(this)
      const otherRec = getSetRecord(other)
      if (size(O) <= otherRec.size) {
        return iterateSet(O, function (e) {
          if (otherRec.includes(e)) return false
        }, true) !== false
      }
      const iterator = otherRec.getIterator()
      return iterateSimple(iterator, function (e) {
        if (has(O, e)) return iteratorClose(iterator.iterator, 'normal', false)
      }) !== false
    }
  }, { '../internals/a-set': 61, '../internals/get-set-record': 101, '../internals/iterate-simple': 118, '../internals/iterator-close': 122, '../internals/set-helpers': 152, '../internals/set-iterate': 157, '../internals/set-size': 158 }],
  155: [function (require, module, exports) {
    'use strict'
    const aSet = require('../internals/a-set')
    const size = require('../internals/set-size')
    const iterate = require('../internals/set-iterate')
    const getSetRecord = require('../internals/get-set-record')

    // `Set.prototype.isSubsetOf` method
    // https://tc39.es/ecma262/#sec-set.prototype.issubsetof
    module.exports = function isSubsetOf (other) {
      const O = aSet(this)
      const otherRec = getSetRecord(other)
      if (size(O) > otherRec.size) return false
      return iterate(O, function (e) {
        if (!otherRec.includes(e)) return false
      }, true) !== false
    }
  }, { '../internals/a-set': 61, '../internals/get-set-record': 101, '../internals/set-iterate': 157, '../internals/set-size': 158 }],
  156: [function (require, module, exports) {
    'use strict'
    const aSet = require('../internals/a-set')
    const has = require('../internals/set-helpers').has
    const size = require('../internals/set-size')
    const getSetRecord = require('../internals/get-set-record')
    const iterateSimple = require('../internals/iterate-simple')
    const iteratorClose = require('../internals/iterator-close')

    // `Set.prototype.isSupersetOf` method
    // https://tc39.es/ecma262/#sec-set.prototype.issupersetof
    module.exports = function isSupersetOf (other) {
      const O = aSet(this)
      const otherRec = getSetRecord(other)
      if (size(O) < otherRec.size) return false
      const iterator = otherRec.getIterator()
      return iterateSimple(iterator, function (e) {
        if (!has(O, e)) return iteratorClose(iterator.iterator, 'normal', false)
      }) !== false
    }
  }, { '../internals/a-set': 61, '../internals/get-set-record': 101, '../internals/iterate-simple': 118, '../internals/iterator-close': 122, '../internals/set-helpers': 152, '../internals/set-size': 158 }],
  157: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')
    const iterateSimple = require('../internals/iterate-simple')
    const SetHelpers = require('../internals/set-helpers')

    const Set = SetHelpers.Set
    const SetPrototype = SetHelpers.proto
    const forEach = uncurryThis(SetPrototype.forEach)
    const keys = uncurryThis(SetPrototype.keys)
    const next = keys(new Set()).next

    module.exports = function (set, fn, interruptible) {
      return interruptible ? iterateSimple({ iterator: keys(set), next }, fn) : forEach(set, fn)
    }
  }, { '../internals/function-uncurry-this': 95, '../internals/iterate-simple': 118, '../internals/set-helpers': 152 }],
  158: [function (require, module, exports) {
    'use strict'
    const uncurryThisAccessor = require('../internals/function-uncurry-this-accessor')
    const SetHelpers = require('../internals/set-helpers')

    module.exports = uncurryThisAccessor(SetHelpers.proto, 'size', 'get') || function (set) {
      return set.size
    }
  }, { '../internals/function-uncurry-this-accessor': 93, '../internals/set-helpers': 152 }],
  159: [function (require, module, exports) {
    'use strict'
    const aSet = require('../internals/a-set')
    const SetHelpers = require('../internals/set-helpers')
    const clone = require('../internals/set-clone')
    const getSetRecord = require('../internals/get-set-record')
    const iterateSimple = require('../internals/iterate-simple')

    const add = SetHelpers.add
    const has = SetHelpers.has
    const remove = SetHelpers.remove

    // `Set.prototype.symmetricDifference` method
    // https://tc39.es/ecma262/#sec-set.prototype.symmetricdifference
    module.exports = function symmetricDifference (other) {
      const O = aSet(this)
      const keysIter = getSetRecord(other).getIterator()
      const result = clone(O)
      iterateSimple(keysIter, function (e) {
        if (has(O, e)) remove(result, e)
        else add(result, e)
      })
      return result
    }
  }, { '../internals/a-set': 61, '../internals/get-set-record': 101, '../internals/iterate-simple': 118, '../internals/set-clone': 150, '../internals/set-helpers': 152 }],
  160: [function (require, module, exports) {
    'use strict'
    const aSet = require('../internals/a-set')
    const add = require('../internals/set-helpers').add
    const clone = require('../internals/set-clone')
    const getSetRecord = require('../internals/get-set-record')
    const iterateSimple = require('../internals/iterate-simple')

    // `Set.prototype.union` method
    // https://tc39.es/ecma262/#sec-set.prototype.union
    module.exports = function union (other) {
      const O = aSet(this)
      const keysIter = getSetRecord(other).getIterator()
      const result = clone(O)
      iterateSimple(keysIter, function (it) {
        add(result, it)
      })
      return result
    }
  }, { '../internals/a-set': 61, '../internals/get-set-record': 101, '../internals/iterate-simple': 118, '../internals/set-clone': 150, '../internals/set-helpers': 152 }],
  161: [function (require, module, exports) {
    'use strict'
    const shared = require('../internals/shared')
    const uid = require('../internals/uid')

    const keys = shared('keys')

    module.exports = function (key) {
      return keys[key] || (keys[key] = uid(key))
    }
  }, { '../internals/shared': 163, '../internals/uid': 176 }],
  162: [function (require, module, exports) {
    'use strict'
    const IS_PURE = require('../internals/is-pure')
    const globalThis = require('../internals/global-this')
    const defineGlobalProperty = require('../internals/define-global-property')

    const SHARED = '__core-js_shared__'
    const store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

    (store.versions || (store.versions = [])).push({
      version: '3.50.0',
      mode: IS_PURE ? 'pure' : 'global',
      copyright: '© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.',
      license: 'https://github.com/zloirock/core-js/blob/v3.50.0/LICENSE',
      source: 'https://github.com/zloirock/core-js'
    })
  }, { '../internals/define-global-property': 80, '../internals/global-this': 102, '../internals/is-pure': 116 }],
  163: [function (require, module, exports) {
    'use strict'
    const store = require('../internals/shared-store')
    // eslint-disable-next-line es/no-object-create -- safe
    const create = Object.create || Object

    module.exports = function (key, value) {
      return store[key] || (store[key] = value || create(null))
    }
  }, { '../internals/shared-store': 162 }],
  164: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-symbol -- required for testing */
    const V8_VERSION = require('../internals/environment-v8-version')
    const fails = require('../internals/fails')
    const globalThis = require('../internals/global-this')

    const $String = globalThis.String

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
    module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
      const symbol = Symbol('symbol detection')
      // Chrome 38 Symbol has incorrect toString conversion
      // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
      // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
      // of course, fail.
      return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41
    })
  }, { '../internals/environment-v8-version': 85, '../internals/fails': 87, '../internals/global-this': 102 }],
  165: [function (require, module, exports) {
    'use strict'
    const toIntegerOrInfinity = require('../internals/to-integer-or-infinity')

    const max = Math.max
    const min = Math.min

    // Helper for a popular repeating case of the spec:
    // Let integer be ? ToInteger(index).
    // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
    module.exports = function (index, length) {
      const integer = toIntegerOrInfinity(index)
      return integer < 0 ? max(integer + length, 0) : min(integer, length)
    }
  }, { '../internals/to-integer-or-infinity': 167 }],
  166: [function (require, module, exports) {
    'use strict'
    // toObject with fallback for non-array-like ES3 strings
    const IndexedObject = require('../internals/indexed-object')
    const requireObjectCoercible = require('../internals/require-object-coercible')

    module.exports = function (it) {
      return IndexedObject(requireObjectCoercible(it))
    }
  }, { '../internals/indexed-object': 107, '../internals/require-object-coercible': 148 }],
  167: [function (require, module, exports) {
    'use strict'
    const trunc = require('../internals/math-trunc')

    // `ToIntegerOrInfinity` abstract operation
    // https://tc39.es/ecma262/#sec-tointegerorinfinity
    module.exports = function (argument) {
      const number = +argument
      // eslint-disable-next-line no-self-compare -- NaN check
      return number !== number || number === 0 ? 0 : trunc(number)
    }
  }, { '../internals/math-trunc': 132 }],
  168: [function (require, module, exports) {
    'use strict'
    const toIntegerOrInfinity = require('../internals/to-integer-or-infinity')

    const min = Math.min

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    module.exports = function (argument) {
      const len = toIntegerOrInfinity(argument)
      return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0 // 2 ** 53 - 1 == 9007199254740991
    }
  }, { '../internals/to-integer-or-infinity': 167 }],
  169: [function (require, module, exports) {
    'use strict'
    const requireObjectCoercible = require('../internals/require-object-coercible')

    const $Object = Object

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    module.exports = function (argument) {
      return $Object(requireObjectCoercible(argument))
    }
  }, { '../internals/require-object-coercible': 148 }],
  170: [function (require, module, exports) {
    'use strict'
    const call = require('../internals/function-call')
    const isObject = require('../internals/is-object')
    const isSymbol = require('../internals/is-symbol')
    const getMethod = require('../internals/get-method')
    const ordinaryToPrimitive = require('../internals/ordinary-to-primitive')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const $TypeError = TypeError
    const TO_PRIMITIVE = wellKnownSymbol('toPrimitive')

    // `ToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-toprimitive
    module.exports = function (input, pref) {
      if (!isObject(input) || isSymbol(input)) return input
      const exoticToPrim = getMethod(input, TO_PRIMITIVE)
      let result
      if (exoticToPrim) {
        if (pref === undefined) pref = 'default'
        result = call(exoticToPrim, input, pref)
        if (!isObject(result) || isSymbol(result)) return result
        throw new $TypeError("Can't convert object to primitive value")
      }
      if (pref === undefined) pref = 'number'
      return ordinaryToPrimitive(input, pref)
    }
  }, { '../internals/function-call': 91, '../internals/get-method': 100, '../internals/is-object': 115, '../internals/is-symbol': 117, '../internals/ordinary-to-primitive': 144, '../internals/well-known-symbol': 182 }],
  171: [function (require, module, exports) {
    'use strict'
    const toPrimitive = require('../internals/to-primitive')
    const isSymbol = require('../internals/is-symbol')

    // `ToPropertyKey` abstract operation
    // https://tc39.es/ecma262/#sec-topropertykey
    module.exports = function (argument) {
      const key = toPrimitive(argument, 'string')
      return isSymbol(key) ? key : key + ''
    }
  }, { '../internals/is-symbol': 117, '../internals/to-primitive': 170 }],
  172: [function (require, module, exports) {
    'use strict'
    const getBuiltIn = require('../internals/get-built-in')
    const isCallable = require('../internals/is-callable')
    const isIterable = require('../internals/is-iterable')
    const isObject = require('../internals/is-object')

    const Set = getBuiltIn('Set')

    const isSetLike = function (it) {
      return isObject(it) &&
    typeof it.size === 'number' &&
    isCallable(it.has) &&
    isCallable(it.keys)
    }

    // fallback old -> new set methods proposal arguments
    module.exports = function (it) {
      if (isSetLike(it)) return it
      return isIterable(it) ? new Set(it) : it
    }
  }, { '../internals/get-built-in': 96, '../internals/is-callable': 111, '../internals/is-iterable': 113, '../internals/is-object': 115 }],
  173: [function (require, module, exports) {
    'use strict'
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const TO_STRING_TAG = wellKnownSymbol('toStringTag')
    const test = {}
    // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
    test[TO_STRING_TAG] = 'z'

    module.exports = String(test) === '[object z]'
  }, { '../internals/well-known-symbol': 182 }],
  174: [function (require, module, exports) {
    'use strict'
    const classof = require('../internals/classof')

    const $String = String

    module.exports = function (argument) {
      if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string')
      return $String(argument)
    }
  }, { '../internals/classof': 70 }],
  175: [function (require, module, exports) {
    'use strict'
    const $String = String

    module.exports = function (argument) {
      try {
        return $String(argument)
      } catch (error) {
        return 'Object'
      }
    }
  }, {}],
  176: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    let id = 0
    const postfix = Math.random()
    const toString = uncurryThis(1.1.toString)

    module.exports = function (key) {
      return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36)
    }
  }, { '../internals/function-uncurry-this': 95 }],
  177: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-symbol -- required for testing */
    const NATIVE_SYMBOL = require('../internals/symbol-constructor-detection')

    module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator === 'symbol'
  }, { '../internals/symbol-constructor-detection': 164 }],
  178: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const fails = require('../internals/fails')

    // V8 ~ Chrome 36-
    // https://bugs.chromium.org/p/v8/issues/detail?id=3334
    module.exports = DESCRIPTORS && fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty(function () { /* empty */ }, 'prototype', {
        value: 42,
        writable: false
      }).prototype !== 42
    })
  }, { '../internals/descriptors': 81, '../internals/fails': 87 }],
  179: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const isCallable = require('../internals/is-callable')

    const WeakMap = globalThis.WeakMap

    module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap))
  }, { '../internals/global-this': 102, '../internals/is-callable': 111 }],
  180: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    // eslint-disable-next-line es/no-weak-map -- safe
    const WeakMapPrototype = WeakMap.prototype

    module.exports = {
      // eslint-disable-next-line es/no-weak-map -- safe
      WeakMap,
      set: uncurryThis(WeakMapPrototype.set),
      get: uncurryThis(WeakMapPrototype.get),
      has: uncurryThis(WeakMapPrototype.has),
      remove: uncurryThis(WeakMapPrototype.delete)
    }
  }, { '../internals/function-uncurry-this': 95 }],
  181: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    // eslint-disable-next-line es/no-weak-set -- safe
    const WeakSetPrototype = WeakSet.prototype

    module.exports = {
      // eslint-disable-next-line es/no-weak-set -- safe
      WeakSet,
      add: uncurryThis(WeakSetPrototype.add),
      has: uncurryThis(WeakSetPrototype.has),
      remove: uncurryThis(WeakSetPrototype.delete)
    }
  }, { '../internals/function-uncurry-this': 95 }],
  182: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const shared = require('../internals/shared')
    const hasOwn = require('../internals/has-own-property')
    const uid = require('../internals/uid')
    const NATIVE_SYMBOL = require('../internals/symbol-constructor-detection')
    const USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid')

    const Symbol = globalThis.Symbol
    const WellKnownSymbolsStore = shared('wks')
    const createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol.for || Symbol : Symbol && Symbol.withoutSetter || uid

    module.exports = function (name) {
      if (!hasOwn(WellKnownSymbolsStore, name)) {
        WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
          ? Symbol[name]
          : createWellKnownSymbol('Symbol.' + name)
      } return WellKnownSymbolsStore[name]
    }
  }, { '../internals/global-this': 102, '../internals/has-own-property': 103, '../internals/shared': 163, '../internals/symbol-constructor-detection': 164, '../internals/uid': 176, '../internals/use-symbol-as-uid': 177 }],
  183: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const $includes = require('../internals/array-includes').includes
    const fails = require('../internals/fails')
    const addToUnscopables = require('../internals/add-to-unscopables')

    // FF99+ bug
    const BROKEN_ON_SPARSE = fails(function () {
      // eslint-disable-next-line es/no-array-prototype-includes -- detection
      return !Array(1).includes()
    })

    // Safari 26.4- bug
    const BROKEN_ON_SPARSE_WITH_FROM_INDEX = fails(function () {
      // eslint-disable-next-line no-sparse-arrays, es/no-array-prototype-includes -- detection
      return [, 1].includes(undefined, 1)
    })

    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    $({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE || BROKEN_ON_SPARSE_WITH_FROM_INDEX }, {
      includes: function includes (el /* , fromIndex = 0 */) {
        return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined)
      }
    })

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables('includes')
  }, { '../internals/add-to-unscopables': 64, '../internals/array-includes': 67, '../internals/export': 86, '../internals/fails': 87 }],
  184: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const globalThis = require('../internals/global-this')
    const anInstance = require('../internals/an-instance')
    const anObject = require('../internals/an-object')
    const isCallable = require('../internals/is-callable')
    const getPrototypeOf = require('../internals/object-get-prototype-of')
    const defineBuiltInAccessor = require('../internals/define-built-in-accessor')
    const createProperty = require('../internals/create-property')
    const fails = require('../internals/fails')
    const hasOwn = require('../internals/has-own-property')
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const IteratorPrototype = require('../internals/iterators-core').IteratorPrototype
    const DESCRIPTORS = require('../internals/descriptors')
    const IS_PURE = require('../internals/is-pure')

    const CONSTRUCTOR = 'constructor'
    const ITERATOR = 'Iterator'
    const TO_STRING_TAG = wellKnownSymbol('toStringTag')

    const $TypeError = TypeError
    const NativeIterator = globalThis[ITERATOR]

    // FF56- have non-standard global helper `Iterator`
    const FORCED = IS_PURE ||
  !isCallable(NativeIterator) ||
  NativeIterator.prototype !== IteratorPrototype ||
  // FF44- non-standard `Iterator` passes previous tests
  !fails(function () { NativeIterator({}) })

    const IteratorConstructor = function Iterator () {
      anInstance(this, IteratorPrototype)
      if (getPrototypeOf(this) === IteratorPrototype) throw new $TypeError('Abstract class Iterator not directly constructable')
    }

    const defineIteratorPrototypeAccessor = function (key, value) {
      if (DESCRIPTORS) {
        defineBuiltInAccessor(IteratorPrototype, key, {
          configurable: true,
          get: function () {
            return value
          },
          set: function (replacement) {
            anObject(this)
            if (this === IteratorPrototype) throw new $TypeError("You can't redefine this property")
            if (hasOwn(this, key)) this[key] = replacement
            else createProperty(this, key, replacement)
          }
        })
      } else IteratorPrototype[key] = value
    }

    if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) defineIteratorPrototypeAccessor(TO_STRING_TAG, ITERATOR)

    if (FORCED || !hasOwn(IteratorPrototype, CONSTRUCTOR) || IteratorPrototype[CONSTRUCTOR] === Object) {
      defineIteratorPrototypeAccessor(CONSTRUCTOR, IteratorConstructor)
    }

    IteratorConstructor.prototype = IteratorPrototype

    // `Iterator` constructor
    // https://tc39.es/ecma262/#sec-iterator
    $({ global: true, constructor: true, forced: FORCED }, {
      Iterator: IteratorConstructor
    })
  }, { '../internals/an-instance': 65, '../internals/an-object': 66, '../internals/create-property': 76, '../internals/define-built-in-accessor': 77, '../internals/descriptors': 81, '../internals/export': 86, '../internals/fails': 87, '../internals/global-this': 102, '../internals/has-own-property': 103, '../internals/is-callable': 111, '../internals/is-pure': 116, '../internals/iterators-core': 126, '../internals/object-get-prototype-of': 139, '../internals/well-known-symbol': 182 }],
  185: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const iterate = require('../internals/iterate')
    const aCallable = require('../internals/a-callable')
    const anObject = require('../internals/an-object')
    const getIteratorDirect = require('../internals/get-iterator-direct')
    const iteratorClose = require('../internals/iterator-close')
    const iteratorHelperWithoutClosingOnEarlyError = require('../internals/iterator-helper-without-closing-on-early-error')

    const everyWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError('every', TypeError)

    // `Iterator.prototype.every` method
    // https://tc39.es/ecma262/#sec-iterator.prototype.every
    $({ target: 'Iterator', proto: true, real: true, forced: everyWithoutClosingOnEarlyError }, {
      every: function every (predicate) {
        anObject(this)
        try {
          aCallable(predicate)
        } catch (error) {
          iteratorClose(this, 'throw', error)
        }

        if (everyWithoutClosingOnEarlyError) return call(everyWithoutClosingOnEarlyError, this, predicate)

        const record = getIteratorDirect(this)
        let counter = 0
        return !iterate(record, function (value, stop) {
          if (!predicate(value, counter++)) return stop()
        }, { IS_RECORD: true, INTERRUPTED: true }).stopped
      }
    })
  }, { '../internals/a-callable': 59, '../internals/an-object': 66, '../internals/export': 86, '../internals/function-call': 91, '../internals/get-iterator-direct': 97, '../internals/iterate': 119, '../internals/iterator-close': 122, '../internals/iterator-helper-without-closing-on-early-error': 125 }],
  186: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const aCallable = require('../internals/a-callable')
    const anObject = require('../internals/an-object')
    const getIteratorDirect = require('../internals/get-iterator-direct')
    const createIteratorProxy = require('../internals/iterator-create-proxy')
    const callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing')
    const IS_PURE = require('../internals/is-pure')
    const iteratorClose = require('../internals/iterator-close')
    const iteratorHelperThrowsOnInvalidIterator = require('../internals/iterator-helper-throws-on-invalid-iterator')
    const iteratorHelperWithoutClosingOnEarlyError = require('../internals/iterator-helper-without-closing-on-early-error')

    const FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR = !IS_PURE && !iteratorHelperThrowsOnInvalidIterator('filter', function () { /* empty */ })
    const filterWithoutClosingOnEarlyError = !IS_PURE && !FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR &&
  iteratorHelperWithoutClosingOnEarlyError('filter', TypeError)

    const FORCED = IS_PURE || FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR || filterWithoutClosingOnEarlyError

    const IteratorProxy = createIteratorProxy(function () {
      const iterator = this.iterator
      const predicate = this.predicate
      const next = this.next
      let result, done, value
      while (true) {
        result = anObject(call(next, iterator))
        done = this.done = !!result.done
        if (done) return
        value = result.value
        if (callWithSafeIterationClosing(iterator, predicate, [value, this.counter++], true)) return value
      }
    })

    // `Iterator.prototype.filter` method
    // https://tc39.es/ecma262/#sec-iterator.prototype.filter
    $({ target: 'Iterator', proto: true, real: true, forced: FORCED }, {
      filter: function filter (predicate) {
        anObject(this)
        try {
          aCallable(predicate)
        } catch (error) {
          iteratorClose(this, 'throw', error)
        }

        if (filterWithoutClosingOnEarlyError) return call(filterWithoutClosingOnEarlyError, this, predicate)

        return new IteratorProxy(getIteratorDirect(this), {
          predicate
        })
      }
    })
  }, { '../internals/a-callable': 59, '../internals/an-object': 66, '../internals/call-with-safe-iteration-closing': 68, '../internals/export': 86, '../internals/function-call': 91, '../internals/get-iterator-direct': 97, '../internals/is-pure': 116, '../internals/iterator-close': 122, '../internals/iterator-create-proxy': 123, '../internals/iterator-helper-throws-on-invalid-iterator': 124, '../internals/iterator-helper-without-closing-on-early-error': 125 }],
  187: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const iterate = require('../internals/iterate')
    const aCallable = require('../internals/a-callable')
    const anObject = require('../internals/an-object')
    const getIteratorDirect = require('../internals/get-iterator-direct')
    const iteratorClose = require('../internals/iterator-close')
    const iteratorHelperWithoutClosingOnEarlyError = require('../internals/iterator-helper-without-closing-on-early-error')

    const findWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError('find', TypeError)

    // `Iterator.prototype.find` method
    // https://tc39.es/ecma262/#sec-iterator.prototype.find
    $({ target: 'Iterator', proto: true, real: true, forced: findWithoutClosingOnEarlyError }, {
      find: function find (predicate) {
        anObject(this)
        try {
          aCallable(predicate)
        } catch (error) {
          iteratorClose(this, 'throw', error)
        }

        if (findWithoutClosingOnEarlyError) return call(findWithoutClosingOnEarlyError, this, predicate)

        const record = getIteratorDirect(this)
        let counter = 0
        return iterate(record, function (value, stop) {
          if (predicate(value, counter++)) return stop(value)
        }, { IS_RECORD: true, INTERRUPTED: true }).result
      }
    })
  }, { '../internals/a-callable': 59, '../internals/an-object': 66, '../internals/export': 86, '../internals/function-call': 91, '../internals/get-iterator-direct': 97, '../internals/iterate': 119, '../internals/iterator-close': 122, '../internals/iterator-helper-without-closing-on-early-error': 125 }],
  188: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const iterate = require('../internals/iterate')
    const aCallable = require('../internals/a-callable')
    const anObject = require('../internals/an-object')
    const getIteratorDirect = require('../internals/get-iterator-direct')
    const iteratorClose = require('../internals/iterator-close')
    const iteratorHelperWithoutClosingOnEarlyError = require('../internals/iterator-helper-without-closing-on-early-error')

    const forEachWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError('forEach', TypeError)

    // `Iterator.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-iterator.prototype.foreach
    $({ target: 'Iterator', proto: true, real: true, forced: forEachWithoutClosingOnEarlyError }, {
      forEach: function forEach (fn) {
        anObject(this)
        try {
          aCallable(fn)
        } catch (error) {
          iteratorClose(this, 'throw', error)
        }

        if (forEachWithoutClosingOnEarlyError) return call(forEachWithoutClosingOnEarlyError, this, fn)

        const record = getIteratorDirect(this)
        let counter = 0
        iterate(record, function (value) {
          fn(value, counter++)
        }, { IS_RECORD: true })
      }
    })
  }, { '../internals/a-callable': 59, '../internals/an-object': 66, '../internals/export': 86, '../internals/function-call': 91, '../internals/get-iterator-direct': 97, '../internals/iterate': 119, '../internals/iterator-close': 122, '../internals/iterator-helper-without-closing-on-early-error': 125 }],
  189: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const aCallable = require('../internals/a-callable')
    const anObject = require('../internals/an-object')
    const getIteratorDirect = require('../internals/get-iterator-direct')
    const createIteratorProxy = require('../internals/iterator-create-proxy')
    const callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing')
    const iteratorClose = require('../internals/iterator-close')
    const iteratorHelperThrowsOnInvalidIterator = require('../internals/iterator-helper-throws-on-invalid-iterator')
    const iteratorHelperWithoutClosingOnEarlyError = require('../internals/iterator-helper-without-closing-on-early-error')
    const IS_PURE = require('../internals/is-pure')

    const MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR = !IS_PURE && !iteratorHelperThrowsOnInvalidIterator('map', function () { /* empty */ })
    const mapWithoutClosingOnEarlyError = !IS_PURE && !MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR &&
  iteratorHelperWithoutClosingOnEarlyError('map', TypeError)

    const FORCED = IS_PURE || MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR || mapWithoutClosingOnEarlyError

    const IteratorProxy = createIteratorProxy(function () {
      const iterator = this.iterator
      const result = anObject(call(this.next, iterator))
      const done = this.done = !!result.done
      if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true)
    })

    // `Iterator.prototype.map` method
    // https://tc39.es/ecma262/#sec-iterator.prototype.map
    $({ target: 'Iterator', proto: true, real: true, forced: FORCED }, {
      map: function map (mapper) {
        anObject(this)
        try {
          aCallable(mapper)
        } catch (error) {
          iteratorClose(this, 'throw', error)
        }

        if (mapWithoutClosingOnEarlyError) return call(mapWithoutClosingOnEarlyError, this, mapper)

        return new IteratorProxy(getIteratorDirect(this), {
          mapper
        })
      }
    })
  }, { '../internals/a-callable': 59, '../internals/an-object': 66, '../internals/call-with-safe-iteration-closing': 68, '../internals/export': 86, '../internals/function-call': 91, '../internals/get-iterator-direct': 97, '../internals/is-pure': 116, '../internals/iterator-close': 122, '../internals/iterator-create-proxy': 123, '../internals/iterator-helper-throws-on-invalid-iterator': 124, '../internals/iterator-helper-without-closing-on-early-error': 125 }],
  190: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const iterate = require('../internals/iterate')
    const aCallable = require('../internals/a-callable')
    const anObject = require('../internals/an-object')
    const getIteratorDirect = require('../internals/get-iterator-direct')
    const iteratorClose = require('../internals/iterator-close')
    const iteratorHelperWithoutClosingOnEarlyError = require('../internals/iterator-helper-without-closing-on-early-error')
    const apply = require('../internals/function-apply')
    const fails = require('../internals/fails')

    const $TypeError = TypeError

    // https://bugs.webkit.org/show_bug.cgi?id=291651
    const FAILS_ON_INITIAL_UNDEFINED = fails(function () {
      // eslint-disable-next-line es/no-iterator-prototype-reduce, es/no-array-prototype-keys, array-callback-return -- required for testing
      [].keys().reduce(function () { /* empty */ }, undefined)
    })

    const reduceWithoutClosingOnEarlyError = !FAILS_ON_INITIAL_UNDEFINED && iteratorHelperWithoutClosingOnEarlyError('reduce', $TypeError)

    // `Iterator.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-iterator.prototype.reduce
    $({ target: 'Iterator', proto: true, real: true, forced: FAILS_ON_INITIAL_UNDEFINED || reduceWithoutClosingOnEarlyError }, {
      reduce: function reduce (reducer /* , initialValue */) {
        anObject(this)
        try {
          aCallable(reducer)
        } catch (error) {
          iteratorClose(this, 'throw', error)
        }

        let noInitial = arguments.length < 2
        let accumulator = noInitial ? undefined : arguments[1]
        if (reduceWithoutClosingOnEarlyError) {
          return apply(reduceWithoutClosingOnEarlyError, this, noInitial ? [reducer] : [reducer, accumulator])
        }
        const record = getIteratorDirect(this)
        let counter = 0
        iterate(record, function (value) {
          if (noInitial) {
            noInitial = false
            accumulator = value
          } else {
            accumulator = reducer(accumulator, value, counter)
          }
          counter++
        }, { IS_RECORD: true })
        if (noInitial) throw new $TypeError('Reduce of empty iterator with no initial value')
        return accumulator
      }
    })
  }, { '../internals/a-callable': 59, '../internals/an-object': 66, '../internals/export': 86, '../internals/fails': 87, '../internals/function-apply': 88, '../internals/get-iterator-direct': 97, '../internals/iterate': 119, '../internals/iterator-close': 122, '../internals/iterator-helper-without-closing-on-early-error': 125 }],
  191: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const iterate = require('../internals/iterate')
    const aCallable = require('../internals/a-callable')
    const anObject = require('../internals/an-object')
    const getIteratorDirect = require('../internals/get-iterator-direct')
    const iteratorClose = require('../internals/iterator-close')
    const iteratorHelperWithoutClosingOnEarlyError = require('../internals/iterator-helper-without-closing-on-early-error')

    const someWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError('some', TypeError)

    // `Iterator.prototype.some` method
    // https://tc39.es/ecma262/#sec-iterator.prototype.some
    $({ target: 'Iterator', proto: true, real: true, forced: someWithoutClosingOnEarlyError }, {
      some: function some (predicate) {
        anObject(this)
        try {
          aCallable(predicate)
        } catch (error) {
          iteratorClose(this, 'throw', error)
        }

        if (someWithoutClosingOnEarlyError) return call(someWithoutClosingOnEarlyError, this, predicate)

        const record = getIteratorDirect(this)
        let counter = 0
        return iterate(record, function (value, stop) {
          if (predicate(value, counter++)) return stop()
        }, { IS_RECORD: true, INTERRUPTED: true }).stopped
      }
    })
  }, { '../internals/a-callable': 59, '../internals/an-object': 66, '../internals/export': 86, '../internals/function-call': 91, '../internals/get-iterator-direct': 97, '../internals/iterate': 119, '../internals/iterator-close': 122, '../internals/iterator-helper-without-closing-on-early-error': 125 }],
  192: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const defineBuiltInAccessor = require('../internals/define-built-in-accessor')
    const regExpFlagsDetection = require('../internals/regexp-flags-detection')
    const regExpFlagsGetterImplementation = require('../internals/regexp-flags')

    // `RegExp.prototype.flags` getter
    // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
    if (DESCRIPTORS && !regExpFlagsDetection.correct) {
      defineBuiltInAccessor(RegExp.prototype, 'flags', {
        configurable: true,
        get: regExpFlagsGetterImplementation
      })

      regExpFlagsDetection.correct = true
    }
  }, { '../internals/define-built-in-accessor': 77, '../internals/descriptors': 81, '../internals/regexp-flags': 147, '../internals/regexp-flags-detection': 146 }],
  193: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.constructor')
  }, { '../modules/es.iterator.constructor': 184 }],
  194: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.every')
  }, { '../modules/es.iterator.every': 185 }],
  195: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.filter')
  }, { '../modules/es.iterator.filter': 186 }],
  196: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.find')
  }, { '../modules/es.iterator.find': 187 }],
  197: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.for-each')
  }, { '../modules/es.iterator.for-each': 188 }],
  198: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.map')
  }, { '../modules/es.iterator.map': 189 }],
  199: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.reduce')
  }, { '../modules/es.iterator.reduce': 190 }],
  200: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.some')
  }, { '../modules/es.iterator.some': 191 }],
  201: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aMap = require('../internals/a-map')
    const remove = require('../internals/map-helpers').remove

    // `Map.prototype.deleteAll` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      deleteAll: function deleteAll (/* ...elements */) {
        const collection = aMap(this)
        let allDeleted = true
        let wasDeleted
        for (let k = 0, len = arguments.length; k < len; k++) {
          wasDeleted = remove(collection, arguments[k])
          allDeleted = allDeleted && wasDeleted
        } return !!allDeleted
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/map-helpers': 130 }],
  202: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aMap = require('../internals/a-map')
    const iterate = require('../internals/map-iterate')

    // `Map.prototype.every` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      every: function every (callbackfn /* , thisArg */) {
        const map = aMap(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        return iterate(map, function (value, key) {
          if (!boundFunction(value, key, map)) return false
        }, true) !== false
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/map-iterate': 131 }],
  203: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aMap = require('../internals/a-map')
    const MapHelpers = require('../internals/map-helpers')
    const iterate = require('../internals/map-iterate')

    const Map = MapHelpers.Map
    const set = MapHelpers.set

    // `Map.prototype.filter` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      filter: function filter (callbackfn /* , thisArg */) {
        const map = aMap(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        const newMap = new Map()
        iterate(map, function (value, key) {
          if (boundFunction(value, key, map)) set(newMap, key, value)
        })
        return newMap
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/map-helpers': 130, '../internals/map-iterate': 131 }],
  204: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aMap = require('../internals/a-map')
    const iterate = require('../internals/map-iterate')

    // `Map.prototype.findKey` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      findKey: function findKey (callbackfn /* , thisArg */) {
        const map = aMap(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        const result = iterate(map, function (value, key) {
          if (boundFunction(value, key, map)) return { key }
        }, true)
        return result && result.key
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/map-iterate': 131 }],
  205: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aMap = require('../internals/a-map')
    const iterate = require('../internals/map-iterate')

    // `Map.prototype.find` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      find: function find (callbackfn /* , thisArg */) {
        const map = aMap(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        const result = iterate(map, function (value, key) {
          if (boundFunction(value, key, map)) return { value }
        }, true)
        return result && result.value
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/map-iterate': 131 }],
  206: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const sameValueZero = require('../internals/same-value-zero')
    const aMap = require('../internals/a-map')
    const iterate = require('../internals/map-iterate')

    // `Map.prototype.includes` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      includes: function includes (searchElement) {
        return iterate(aMap(this), function (value) {
          if (sameValueZero(value, searchElement)) return true
        }, true) === true
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/map-iterate': 131, '../internals/same-value-zero': 149 }],
  207: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aMap = require('../internals/a-map')
    const iterate = require('../internals/map-iterate')

    // `Map.prototype.keyOf` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      keyOf: function keyOf (searchElement) {
        const result = iterate(aMap(this), function (value, key) {
          if (value === searchElement) return { key }
        }, true)
        return result && result.key
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/map-iterate': 131 }],
  208: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aMap = require('../internals/a-map')
    const MapHelpers = require('../internals/map-helpers')
    const iterate = require('../internals/map-iterate')

    const Map = MapHelpers.Map
    const set = MapHelpers.set

    // `Map.prototype.mapKeys` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      mapKeys: function mapKeys (callbackfn /* , thisArg */) {
        const map = aMap(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        const newMap = new Map()
        iterate(map, function (value, key) {
          set(newMap, boundFunction(value, key, map), value)
        })
        return newMap
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/map-helpers': 130, '../internals/map-iterate': 131 }],
  209: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aMap = require('../internals/a-map')
    const MapHelpers = require('../internals/map-helpers')
    const iterate = require('../internals/map-iterate')

    const Map = MapHelpers.Map
    const set = MapHelpers.set

    // `Map.prototype.mapValues` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      mapValues: function mapValues (callbackfn /* , thisArg */) {
        const map = aMap(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        const newMap = new Map()
        iterate(map, function (value, key) {
          set(newMap, key, boundFunction(value, key, map))
        })
        return newMap
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/map-helpers': 130, '../internals/map-iterate': 131 }],
  210: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aMap = require('../internals/a-map')
    const iterate = require('../internals/iterate')
    const set = require('../internals/map-helpers').set

    // `Map.prototype.merge` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, arity: 1, forced: true }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      merge: function merge (iterable /* ...iterables */) {
        const map = aMap(this)
        const argumentsLength = arguments.length
        let i = 0
        while (i < argumentsLength) {
          iterate(arguments[i++], function (key, value) {
            set(map, key, value)
          }, { AS_ENTRIES: true })
        }
        return map
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/iterate': 119, '../internals/map-helpers': 130 }],
  211: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aCallable = require('../internals/a-callable')
    const aMap = require('../internals/a-map')
    const iterate = require('../internals/map-iterate')

    const $TypeError = TypeError

    // `Map.prototype.reduce` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      reduce: function reduce (callbackfn /* , initialValue */) {
        const map = aMap(this)
        let noInitial = arguments.length < 2
        let accumulator = noInitial ? undefined : arguments[1]
        aCallable(callbackfn)
        iterate(map, function (value, key) {
          if (noInitial) {
            noInitial = false
            accumulator = value
          } else {
            accumulator = callbackfn(accumulator, value, key, map)
          }
        })
        if (noInitial) throw new $TypeError('Reduce of empty map with no initial value')
        return accumulator
      }
    })
  }, { '../internals/a-callable': 59, '../internals/a-map': 60, '../internals/export': 86, '../internals/map-iterate': 131 }],
  212: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aMap = require('../internals/a-map')
    const iterate = require('../internals/map-iterate')

    // `Map.prototype.some` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      some: function some (callbackfn /* , thisArg */) {
        const map = aMap(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        return iterate(map, function (value, key) {
          if (boundFunction(value, key, map)) return true
        }, true) === true
      }
    })
  }, { '../internals/a-map': 60, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/map-iterate': 131 }],
  213: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aCallable = require('../internals/a-callable')
    const aMap = require('../internals/a-map')
    const MapHelpers = require('../internals/map-helpers')

    const $TypeError = TypeError
    const get = MapHelpers.get
    const has = MapHelpers.has
    const set = MapHelpers.set

    // `Map.prototype.update` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Map', proto: true, real: true, forced: true }, {
      update: function update (key, callback /* , thunk */) {
        const map = aMap(this)
        const length = arguments.length
        aCallable(callback)
        const isPresentInMap = has(map, key)
        if (!isPresentInMap && length < 3) {
          throw new $TypeError('Updating absent value')
        }
        const value = isPresentInMap ? get(map, key) : aCallable(length > 2 ? arguments[2] : undefined)(key, map)
        set(map, key, callback(value, key, map))
        return map
      }
    })
  }, { '../internals/a-callable': 59, '../internals/a-map': 60, '../internals/export': 86, '../internals/map-helpers': 130 }],
  214: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aSet = require('../internals/a-set')
    const add = require('../internals/set-helpers').add

    // `Set.prototype.addAll` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      addAll: function addAll (/* ...elements */) {
        const set = aSet(this)
        for (let k = 0, len = arguments.length; k < len; k++) {
          add(set, arguments[k])
        } return set
      }
    })
  }, { '../internals/a-set': 61, '../internals/export': 86, '../internals/set-helpers': 152 }],
  215: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aSet = require('../internals/a-set')
    const remove = require('../internals/set-helpers').remove

    // `Set.prototype.deleteAll` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      deleteAll: function deleteAll (/* ...elements */) {
        const collection = aSet(this)
        let allDeleted = true
        let wasDeleted
        for (let k = 0, len = arguments.length; k < len; k++) {
          wasDeleted = remove(collection, arguments[k])
          allDeleted = allDeleted && wasDeleted
        } return !!allDeleted
      }
    })
  }, { '../internals/a-set': 61, '../internals/export': 86, '../internals/set-helpers': 152 }],
  216: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const toSetLike = require('../internals/to-set-like')
    const $difference = require('../internals/set-difference')

    // `Set.prototype.difference` method
    // https://github.com/tc39/proposal-set-methods
    // TODO: Obsolete version, remove from `core-js@4`
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      difference: function difference (other) {
        return call($difference, this, toSetLike(other))
      }
    })
  }, { '../internals/export': 86, '../internals/function-call': 91, '../internals/set-difference': 151, '../internals/to-set-like': 172 }],
  217: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aSet = require('../internals/a-set')
    const iterate = require('../internals/set-iterate')

    // `Set.prototype.every` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      every: function every (callbackfn /* , thisArg */) {
        const set = aSet(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        return iterate(set, function (value) {
          if (!boundFunction(value, value, set)) return false
        }, true) !== false
      }
    })
  }, { '../internals/a-set': 61, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/set-iterate': 157 }],
  218: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aSet = require('../internals/a-set')
    const SetHelpers = require('../internals/set-helpers')
    const iterate = require('../internals/set-iterate')

    const Set = SetHelpers.Set
    const add = SetHelpers.add

    // `Set.prototype.filter` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      filter: function filter (callbackfn /* , thisArg */) {
        const set = aSet(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        const newSet = new Set()
        iterate(set, function (value) {
          if (boundFunction(value, value, set)) add(newSet, value)
        })
        return newSet
      }
    })
  }, { '../internals/a-set': 61, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/set-helpers': 152, '../internals/set-iterate': 157 }],
  219: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aSet = require('../internals/a-set')
    const iterate = require('../internals/set-iterate')

    // `Set.prototype.find` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      find: function find (callbackfn /* , thisArg */) {
        const set = aSet(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        const result = iterate(set, function (value) {
          if (boundFunction(value, value, set)) return { value }
        }, true)
        return result && result.value
      }
    })
  }, { '../internals/a-set': 61, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/set-iterate': 157 }],
  220: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const toSetLike = require('../internals/to-set-like')
    const $intersection = require('../internals/set-intersection')

    // `Set.prototype.intersection` method
    // https://github.com/tc39/proposal-set-methods
    // TODO: Obsolete version, remove from `core-js@4`
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      intersection: function intersection (other) {
        return call($intersection, this, toSetLike(other))
      }
    })
  }, { '../internals/export': 86, '../internals/function-call': 91, '../internals/set-intersection': 153, '../internals/to-set-like': 172 }],
  221: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const toSetLike = require('../internals/to-set-like')
    const $isDisjointFrom = require('../internals/set-is-disjoint-from')

    // `Set.prototype.isDisjointFrom` method
    // https://github.com/tc39/proposal-set-methods
    // TODO: Obsolete version, remove from `core-js@4`
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      isDisjointFrom: function isDisjointFrom (other) {
        return call($isDisjointFrom, this, toSetLike(other))
      }
    })
  }, { '../internals/export': 86, '../internals/function-call': 91, '../internals/set-is-disjoint-from': 154, '../internals/to-set-like': 172 }],
  222: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const toSetLike = require('../internals/to-set-like')
    const $isSubsetOf = require('../internals/set-is-subset-of')

    // `Set.prototype.isSubsetOf` method
    // https://github.com/tc39/proposal-set-methods
    // TODO: Obsolete version, remove from `core-js@4`
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      isSubsetOf: function isSubsetOf (other) {
        return call($isSubsetOf, this, toSetLike(other))
      }
    })
  }, { '../internals/export': 86, '../internals/function-call': 91, '../internals/set-is-subset-of': 155, '../internals/to-set-like': 172 }],
  223: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const toSetLike = require('../internals/to-set-like')
    const $isSupersetOf = require('../internals/set-is-superset-of')

    // `Set.prototype.isSupersetOf` method
    // https://github.com/tc39/proposal-set-methods
    // TODO: Obsolete version, remove from `core-js@4`
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      isSupersetOf: function isSupersetOf (other) {
        return call($isSupersetOf, this, toSetLike(other))
      }
    })
  }, { '../internals/export': 86, '../internals/function-call': 91, '../internals/set-is-superset-of': 156, '../internals/to-set-like': 172 }],
  224: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const uncurryThis = require('../internals/function-uncurry-this')
    const aSet = require('../internals/a-set')
    const iterate = require('../internals/set-iterate')
    const toString = require('../internals/to-string')

    const arrayJoin = uncurryThis([].join)
    const push = uncurryThis([].push)

    // `Set.prototype.join` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      join: function join (separator) {
        const set = aSet(this)
        const sep = separator === undefined ? ',' : toString(separator)
        const array = []
        iterate(set, function (value) {
          push(array, value)
        })
        return arrayJoin(array, sep)
      }
    })
  }, { '../internals/a-set': 61, '../internals/export': 86, '../internals/function-uncurry-this': 95, '../internals/set-iterate': 157, '../internals/to-string': 174 }],
  225: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aSet = require('../internals/a-set')
    const SetHelpers = require('../internals/set-helpers')
    const iterate = require('../internals/set-iterate')

    const Set = SetHelpers.Set
    const add = SetHelpers.add

    // `Set.prototype.map` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      map: function map (callbackfn /* , thisArg */) {
        const set = aSet(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        const newSet = new Set()
        iterate(set, function (value) {
          add(newSet, boundFunction(value, value, set))
        })
        return newSet
      }
    })
  }, { '../internals/a-set': 61, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/set-helpers': 152, '../internals/set-iterate': 157 }],
  226: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aCallable = require('../internals/a-callable')
    const aSet = require('../internals/a-set')
    const iterate = require('../internals/set-iterate')

    const $TypeError = TypeError

    // `Set.prototype.reduce` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      reduce: function reduce (callbackfn /* , initialValue */) {
        const set = aSet(this)
        let noInitial = arguments.length < 2
        let accumulator = noInitial ? undefined : arguments[1]
        aCallable(callbackfn)
        iterate(set, function (value) {
          if (noInitial) {
            noInitial = false
            accumulator = value
          } else {
            accumulator = callbackfn(accumulator, value, value, set)
          }
        })
        if (noInitial) throw new $TypeError('Reduce of empty set with no initial value')
        return accumulator
      }
    })
  }, { '../internals/a-callable': 59, '../internals/a-set': 61, '../internals/export': 86, '../internals/set-iterate': 157 }],
  227: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const bind = require('../internals/function-bind-context')
    const aSet = require('../internals/a-set')
    const iterate = require('../internals/set-iterate')

    // `Set.prototype.some` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      some: function some (callbackfn /* , thisArg */) {
        const set = aSet(this)
        const boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        return iterate(set, function (value) {
          if (boundFunction(value, value, set)) return true
        }, true) === true
      }
    })
  }, { '../internals/a-set': 61, '../internals/export': 86, '../internals/function-bind-context': 89, '../internals/set-iterate': 157 }],
  228: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const toSetLike = require('../internals/to-set-like')
    const $symmetricDifference = require('../internals/set-symmetric-difference')

    // `Set.prototype.symmetricDifference` method
    // https://github.com/tc39/proposal-set-methods
    // TODO: Obsolete version, remove from `core-js@4`
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      symmetricDifference: function symmetricDifference (other) {
        return call($symmetricDifference, this, toSetLike(other))
      }
    })
  }, { '../internals/export': 86, '../internals/function-call': 91, '../internals/set-symmetric-difference': 159, '../internals/to-set-like': 172 }],
  229: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const call = require('../internals/function-call')
    const toSetLike = require('../internals/to-set-like')
    const $union = require('../internals/set-union')

    // `Set.prototype.union` method
    // https://github.com/tc39/proposal-set-methods
    // TODO: Obsolete version, remove from `core-js@4`
    $({ target: 'Set', proto: true, real: true, forced: true }, {
      union: function union (other) {
        return call($union, this, toSetLike(other))
      }
    })
  }, { '../internals/export': 86, '../internals/function-call': 91, '../internals/set-union': 160, '../internals/to-set-like': 172 }],
  230: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aWeakMap = require('../internals/a-weak-map')
    const remove = require('../internals/weak-map-helpers').remove

    // `WeakMap.prototype.deleteAll` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'WeakMap', proto: true, real: true, forced: true }, {
      deleteAll: function deleteAll (/* ...elements */) {
        const collection = aWeakMap(this)
        let allDeleted = true
        let wasDeleted
        for (let k = 0, len = arguments.length; k < len; k++) {
          wasDeleted = remove(collection, arguments[k])
          allDeleted = allDeleted && wasDeleted
        } return !!allDeleted
      }
    })
  }, { '../internals/a-weak-map': 62, '../internals/export': 86, '../internals/weak-map-helpers': 180 }],
  231: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aWeakSet = require('../internals/a-weak-set')
    const add = require('../internals/weak-set-helpers').add

    // `WeakSet.prototype.addAll` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'WeakSet', proto: true, real: true, forced: true }, {
      addAll: function addAll (/* ...elements */) {
        const set = aWeakSet(this)
        for (let k = 0, len = arguments.length; k < len; k++) {
          add(set, arguments[k])
        } return set
      }
    })
  }, { '../internals/a-weak-set': 63, '../internals/export': 86, '../internals/weak-set-helpers': 181 }],
  232: [function (require, module, exports) {
    'use strict'
    const $ = require('../internals/export')
    const aWeakSet = require('../internals/a-weak-set')
    const remove = require('../internals/weak-set-helpers').remove

    // `WeakSet.prototype.deleteAll` method
    // https://github.com/tc39/proposal-collection-methods
    $({ target: 'WeakSet', proto: true, real: true, forced: true }, {
      deleteAll: function deleteAll (/* ...elements */) {
        const collection = aWeakSet(this)
        let allDeleted = true
        let wasDeleted
        for (let k = 0, len = arguments.length; k < len; k++) {
          wasDeleted = remove(collection, arguments[k])
          allDeleted = allDeleted && wasDeleted
        } return !!allDeleted
      }
    })
  }, { '../internals/a-weak-set': 63, '../internals/export': 86, '../internals/weak-set-helpers': 181 }],
  233: [function (require, module, exports) {
    'use strict'
    const __createBinding = (this && this.__createBinding) || (Object.create
      ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        let desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function () { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }
      : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
    const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create
      ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
      : function (o, v) {
        o.default = v
      })
    const __importStar = (this && this.__importStar) || (function () {
      let ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
          const ar = []
          for (const k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k
          return ar
        }
        return ownKeys(o)
      }
      return function (mod) {
        if (mod && mod.__esModule) return mod
        const result = {}
        if (mod != null) for (let k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== 'default') __createBinding(result, mod, k[i])
        __setModuleDefault(result, mod)
        return result
      }
    })()
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.attributeRules = void 0
    const boolbase = __importStar(require('boolbase'))
    /**
 * All reserved characters in a regex, used for escaping.
 *
 * Taken from XRegExp, (c) 2007-2020 Steven Levithan under the MIT license
 * https://github.com/slevithan/xregexp/blob/95eeebeb8fac8754d54eafe2b4743661ac1cf028/src/xregexp.js#L794
 */
    const reChars = /[-[\]{}()*+?.,\\^$|#\s]/g
    function escapeRegex (value) {
      return value.replace(reChars, '\\$&')
    }
    /**
 * Attributes that are case-insensitive in HTML.
 *
 * @private
 * @see https://html.spec.whatwg.org/multipage/semantics-other.html#case-sensitivity-of-selectors
 */
    const caseInsensitiveAttributes = new Set([
      'accept',
      'accept-charset',
      'align',
      'alink',
      'axis',
      'bgcolor',
      'charset',
      'checked',
      'clear',
      'codetype',
      'color',
      'compact',
      'declare',
      'defer',
      'dir',
      'direction',
      'disabled',
      'enctype',
      'face',
      'frame',
      'hreflang',
      'http-equiv',
      'lang',
      'language',
      'link',
      'media',
      'method',
      'multiple',
      'nohref',
      'noresize',
      'noshade',
      'nowrap',
      'readonly',
      'rel',
      'rev',
      'rules',
      'scope',
      'scrolling',
      'selected',
      'shape',
      'target',
      'text',
      'type',
      'valign',
      'valuetype',
      'vlink'
    ])
    function shouldIgnoreCase (selector, options) {
      return typeof selector.ignoreCase === 'boolean'
        ? selector.ignoreCase
        : selector.ignoreCase === 'quirks'
          ? !!options.quirksMode
          : !options.xmlMode && caseInsensitiveAttributes.has(selector.name)
    }
    /**
 * Attribute selectors
 */
    exports.attributeRules = {
      equals (next, data, options) {
        const { adapter } = options
        const { name } = data
        let { value } = data
        if (shouldIgnoreCase(data, options)) {
          value = value.toLowerCase()
          return (elem) => {
            const attr = adapter.getAttributeValue(elem, name)
            return (attr != null &&
                    attr.length === value.length &&
                    attr.toLowerCase() === value &&
                    next(elem))
          }
        }
        return (elem) => adapter.getAttributeValue(elem, name) === value && next(elem)
      },
      hyphen (next, data, options) {
        const { adapter } = options
        const { name } = data
        let { value } = data
        const len = value.length
        if (shouldIgnoreCase(data, options)) {
          value = value.toLowerCase()
          return function hyphenIC (elem) {
            const attr = adapter.getAttributeValue(elem, name)
            return (attr != null &&
                    (attr.length === len || attr.charAt(len) === '-') &&
                    attr.substr(0, len).toLowerCase() === value &&
                    next(elem))
          }
        }
        return function hyphen (elem) {
          const attr = adapter.getAttributeValue(elem, name)
          return (attr != null &&
                (attr.length === len || attr.charAt(len) === '-') &&
                attr.substr(0, len) === value &&
                next(elem))
        }
      },
      element (next, data, options) {
        const { adapter } = options
        const { name, value } = data
        if (/\s/.test(value)) {
          return boolbase.falseFunc
        }
        const regex = new RegExp(`(?:^|\\s)${escapeRegex(value)}(?:$|\\s)`, shouldIgnoreCase(data, options) ? 'i' : '')
        return function element (elem) {
          const attr = adapter.getAttributeValue(elem, name)
          return (attr != null &&
                attr.length >= value.length &&
                regex.test(attr) &&
                next(elem))
        }
      },
      exists (next, { name }, { adapter }) {
        return (elem) => adapter.hasAttrib(elem, name) && next(elem)
      },
      start (next, data, options) {
        const { adapter } = options
        const { name } = data
        let { value } = data
        const len = value.length
        if (len === 0) {
          return boolbase.falseFunc
        }
        if (shouldIgnoreCase(data, options)) {
          value = value.toLowerCase()
          return (elem) => {
            const attr = adapter.getAttributeValue(elem, name)
            return (attr != null &&
                    attr.length >= len &&
                    attr.substr(0, len).toLowerCase() === value &&
                    next(elem))
          }
        }
        return (elem) => !!adapter.getAttributeValue(elem, name)?.startsWith(value) &&
            next(elem)
      },
      end (next, data, options) {
        const { adapter } = options
        const { name } = data
        let { value } = data
        const len = -value.length
        if (len === 0) {
          return boolbase.falseFunc
        }
        if (shouldIgnoreCase(data, options)) {
          value = value.toLowerCase()
          return (elem) => adapter
            .getAttributeValue(elem, name)
            ?.substr(len)
            .toLowerCase() === value && next(elem)
        }
        return (elem) => !!adapter.getAttributeValue(elem, name)?.endsWith(value) &&
            next(elem)
      },
      any (next, data, options) {
        const { adapter } = options
        const { name, value } = data
        if (value === '') {
          return boolbase.falseFunc
        }
        if (shouldIgnoreCase(data, options)) {
          const regex = new RegExp(escapeRegex(value), 'i')
          return function anyIC (elem) {
            const attr = adapter.getAttributeValue(elem, name)
            return (attr != null &&
                    attr.length >= value.length &&
                    regex.test(attr) &&
                    next(elem))
          }
        }
        return (elem) => !!adapter.getAttributeValue(elem, name)?.includes(value) &&
            next(elem)
      },
      not (next, data, options) {
        const { adapter } = options
        const { name } = data
        let { value } = data
        if (value === '') {
          return (elem) => !!adapter.getAttributeValue(elem, name) && next(elem)
        }
        if (shouldIgnoreCase(data, options)) {
          value = value.toLowerCase()
          return (elem) => {
            const attr = adapter.getAttributeValue(elem, name)
            return ((attr == null ||
                    attr.length !== value.length ||
                    attr.toLowerCase() !== value) &&
                    next(elem))
          }
        }
        return (elem) => adapter.getAttributeValue(elem, name) !== value && next(elem)
      }
    }
  }, { boolbase: 43 }],
  234: [function (require, module, exports) {
    'use strict'
    const __createBinding = (this && this.__createBinding) || (Object.create
      ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        let desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function () { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }
      : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
    const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create
      ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
      : function (o, v) {
        o.default = v
      })
    const __importStar = (this && this.__importStar) || (function () {
      let ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
          const ar = []
          for (const k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k
          return ar
        }
        return ownKeys(o)
      }
      return function (mod) {
        if (mod && mod.__esModule) return mod
        const result = {}
        if (mod != null) for (let k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== 'default') __createBinding(result, mod, k[i])
        __setModuleDefault(result, mod)
        return result
      }
    })()
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.compileToken = compileToken
    const boolbase = __importStar(require('boolbase'))
    const css_what_1 = require('css-what')
    const general_js_1 = require('./general.js')
    const querying_js_1 = require('./helpers/querying.js')
    const selectors_js_1 = require('./helpers/selectors.js')
    const subselects_js_1 = require('./pseudo-selectors/subselects.js')
    const DESCENDANT_TOKEN = { type: css_what_1.SelectorType.Descendant }
    const FLEXIBLE_DESCENDANT_TOKEN = {
      type: '_flexibleDescendant'
    }
    const SCOPE_TOKEN = {
      type: css_what_1.SelectorType.Pseudo,
      name: 'scope',
      data: null
    }
    /*
 * CSS 4 Spec (Draft): 3.4.1. Absolutizing a Relative Selector
 * http://www.w3.org/TR/selectors4/#absolutizing
 */
    function absolutize (token, { adapter }, context) {
    // TODO Use better check if the context is a document
      const hasContext = !!context?.every((e) => e === subselects_js_1.PLACEHOLDER_ELEMENT ||
        (adapter.isTag(e) && (0, querying_js_1.getElementParent)(e, adapter) !== null))
      for (const t of token) {
        if (t.length > 0 &&
            (0, selectors_js_1.isTraversal)(t[0]) &&
            t[0].type !== css_what_1.SelectorType.Descendant) {
        // Don't continue in else branch
        } else if (hasContext && !t.some(selectors_js_1.includesScopePseudo)) {
          t.unshift(DESCENDANT_TOKEN)
        } else {
          continue
        }
        t.unshift(SCOPE_TOKEN)
      }
    }
    function compileToken (token, options, ctx) {
      token.forEach(selectors_js_1.sortRules)
      const { context = ctx, rootFunc = boolbase.trueFunc } = options
      const isArrayContext = Array.isArray(context)
      const finalContext = context && (Array.isArray(context) ? context : [context])
      // Check if the selector is relative
      if (options.relativeSelector !== false) {
        absolutize(token, options, finalContext)
      } else if (token.some((t) => t.length > 0 && (0, selectors_js_1.isTraversal)(t[0]))) {
        throw new Error('Relative selectors are not allowed when the `relativeSelector` option is disabled')
      }
      let shouldTestNextSiblings = false
      let query = boolbase.falseFunc
      combineLoop: for (const rules of token) {
        if (rules.length >= 2) {
          const [first, second] = rules
          if (first.type !== css_what_1.SelectorType.Pseudo || first.name !== 'scope') {
          // Ignore
          } else if (isArrayContext &&
                second.type === css_what_1.SelectorType.Descendant) {
            rules[1] = FLEXIBLE_DESCENDANT_TOKEN
          } else if (second.type === css_what_1.SelectorType.Adjacent ||
                second.type === css_what_1.SelectorType.Sibling) {
            shouldTestNextSiblings = true
          }
        }
        let next = rootFunc
        let hasExpensiveSubselector = false
        for (const rule of rules) {
          next = (0, general_js_1.compileGeneralSelector)(next, rule, options, finalContext, compileToken, hasExpensiveSubselector)
          const quality = (0, selectors_js_1.getQuality)(rule)
          if (quality === 0) {
            hasExpensiveSubselector = true
          }
          // If the sub-selector won't match any elements, skip it.
          if (next === boolbase.falseFunc) {
            continue combineLoop
          }
        }
        // If we have a function that always returns true, we can stop here.
        if (next === rootFunc) {
          return rootFunc
        }
        query = query === boolbase.falseFunc ? next : or(query, next)
      }
      query.shouldTestNextSiblings = shouldTestNextSiblings
      return query
    }
    function or (a, b) {
      return (elem) => a(elem) || b(elem)
    }
  }, { './general.js': 235, './helpers/querying.js': 237, './helpers/selectors.js': 238, './pseudo-selectors/subselects.js': 244, boolbase: 43, 'css-what': 245 }],
  235: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.compileGeneralSelector = compileGeneralSelector
    const css_what_1 = require('css-what')
    const attributes_js_1 = require('./attributes.js')
    const querying_js_1 = require('./helpers/querying.js')
    const index_js_1 = require('./pseudo-selectors/index.js')
    /*
 * All available rules
 */
    function compileGeneralSelector (next, selector, options, context, compileToken, hasExpensiveSubselector) {
      const { adapter, equals, cacheResults } = options
      switch (selector.type) {
        case css_what_1.SelectorType.PseudoElement: {
          throw new Error('Pseudo-elements are not supported by css-select')
        }
        case css_what_1.SelectorType.ColumnCombinator: {
          throw new Error('Column combinators are not yet supported by css-select')
        }
        case css_what_1.SelectorType.Attribute: {
          if (selector.namespace != null) {
            throw new Error('Namespaced attributes are not yet supported by css-select')
          }
          if (!options.xmlMode || options.lowerCaseAttributeNames) {
            selector.name = selector.name.toLowerCase()
          }
          return attributes_js_1.attributeRules[selector.action](next, selector, options)
        }
        case css_what_1.SelectorType.Pseudo: {
          return (0, index_js_1.compilePseudoSelector)(next, selector, options, context, compileToken)
        }
        // Tags
        case css_what_1.SelectorType.Tag: {
          if (selector.namespace != null) {
            throw new Error('Namespaced tag names are not yet supported by css-select')
          }
          let { name } = selector
          if (!options.xmlMode || options.lowerCaseTags) {
            name = name.toLowerCase()
          }
          return function tag (elem) {
            return adapter.getName(elem) === name && next(elem)
          }
        }
        // Traversal
        case css_what_1.SelectorType.Descendant: {
          if (!hasExpensiveSubselector ||
                cacheResults === false ||
                typeof WeakMap === 'undefined') {
            return function descendant (elem) {
              let current = elem
              // biome-ignore lint/suspicious/noAssignInExpressions: TODO
              while ((current = (0, querying_js_1.getElementParent)(current, adapter))) {
                if (next(current)) {
                  return true
                }
              }
              return false
            }
          }
          const resultCache = new WeakMap()
          return function cachedDescendant (elem) {
            let current = elem
            let result
            // biome-ignore lint/suspicious/noAssignInExpressions: TODO
            while ((current = (0, querying_js_1.getElementParent)(current, adapter))) {
              const cached = resultCache.get(current)
              if (cached === undefined) {
                result ?? (result = { matches: false })
                result.matches = next(current)
                resultCache.set(current, result)
                if (result.matches) {
                  return true
                }
              } else {
                if (result) {
                  result.matches = cached.matches
                }
                return cached.matches
              }
            }
            return false
          }
        }
        case '_flexibleDescendant': {
        // Include element itself, only used while querying an array
          return function flexibleDescendant (elem) {
            let current = elem
            do {
              if (next(current)) {
                return true
              }
              current = (0, querying_js_1.getElementParent)(current, adapter)
            } while (current)
            return false
          }
        }
        case css_what_1.SelectorType.Parent: {
          return function parent (elem) {
            return adapter
              .getChildren(elem)
              .some((elem) => adapter.isTag(elem) && next(elem))
          }
        }
        case css_what_1.SelectorType.Child: {
          return function child (elem) {
            const parent = (0, querying_js_1.getElementParent)(elem, adapter)
            return parent !== null && next(parent)
          }
        }
        case css_what_1.SelectorType.Sibling: {
          return function sibling (elem) {
            const siblings = adapter.getSiblings(elem)
            for (let i = 0; i < siblings.length; i++) {
              const currentSibling = siblings[i]
              if (equals(elem, currentSibling)) {
                break
              }
              if (adapter.isTag(currentSibling) && next(currentSibling)) {
                return true
              }
            }
            return false
          }
        }
        case css_what_1.SelectorType.Adjacent: {
          if (adapter.prevElementSibling) {
            return function adjacent (elem) {
              const previous = adapter.prevElementSibling(elem)
              return previous != null && next(previous)
            }
          }
          return function adjacent (elem) {
            const siblings = adapter.getSiblings(elem)
            let lastElement
            for (let i = 0; i < siblings.length; i++) {
              const currentSibling = siblings[i]
              if (equals(elem, currentSibling)) {
                break
              }
              if (adapter.isTag(currentSibling)) {
                lastElement = currentSibling
              }
            }
            return !!lastElement && next(lastElement)
          }
        }
        case css_what_1.SelectorType.Universal: {
          if (selector.namespace != null && selector.namespace !== '*') {
            throw new Error('Namespaced universal selectors are not yet supported by css-select')
          }
          return next
        }
      }
    }
  }, { './attributes.js': 233, './helpers/querying.js': 237, './pseudo-selectors/index.js': 242, 'css-what': 245 }],
  236: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.cacheParentResults = cacheParentResults
    const querying_js_1 = require('./querying.js')
    /**
 * Some selectors such as `:contains` and (non-relative) `:has` will only be
 * able to match elements if their parents match the selector (as they contain
 * a subset of the elements that the parent contains).
 *
 * This function wraps the given `matches` function in a function that caches
 * the results of the parent elements, so that the `matches` function only
 * needs to be called once for each subtree.
 */
    function cacheParentResults (next, { adapter, cacheResults }, matches) {
      if (cacheResults === false || typeof WeakMap === 'undefined') {
        return (elem) => next(elem) && matches(elem)
      }
      // Use a cache to avoid re-checking children of an element.
      // @ts-expect-error `Node` is not extending object
      const resultCache = new WeakMap()
      function addResultToCache (elem) {
        const result = matches(elem)
        resultCache.set(elem, result)
        return result
      }
      return function cachedMatcher (elem) {
        if (!next(elem)) {
          return false
        }
        if (resultCache.has(elem)) {
          return resultCache.get(elem)
        }
        // Check all of the element's parents.
        let node = elem
        do {
          const parent = (0, querying_js_1.getElementParent)(node, adapter)
          if (parent === null) {
            return addResultToCache(elem)
          }
          node = parent
        } while (!resultCache.has(node))
        return resultCache.get(node) && addResultToCache(elem)
      }
    }
  }, { './querying.js': 237 }],
  237: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.findAll = findAll
    exports.findOne = findOne
    exports.getNextSiblings = getNextSiblings
    exports.getElementParent = getElementParent
    /**
 * Find all elements matching the query. If not in XML mode, the query will ignore
 * the contents of `<template>` elements.
 *
 * @param query - Function that returns true if the element matches the query.
 * @param elems - Nodes to query. If a node is an element, its children will be queried.
 * @param options - Options for querying the document.
 * @returns All matching elements.
 */
    function findAll (query, elems, options) {
      const { adapter, xmlMode = false } = options
      const result = []
      /** Stack of the arrays we are looking at. */
      const nodeStack = [elems]
      /** Stack of the indices within the arrays. */
      const indexStack = [0]
      for (;;) {
      // First, check if the current array has any more elements to look at.
        if (indexStack[0] >= nodeStack[0].length) {
        // If we have no more arrays to look at, we are done.
          if (nodeStack.length === 1) {
            return result
          }
          nodeStack.shift()
          indexStack.shift()
          // Loop back to the start to continue with the next array.
          continue
        }
        const elem = nodeStack[0][indexStack[0]++]
        if (!adapter.isTag(elem)) {
          continue
        }
        if (query(elem)) {
          result.push(elem)
        }
        if (xmlMode || adapter.getName(elem) !== 'template') {
        /*
             * Add the children to the stack. We are depth-first, so this is
             * the next array we look at.
             */
          const children = adapter.getChildren(elem)
          if (children.length > 0) {
            nodeStack.unshift(children)
            indexStack.unshift(0)
          }
        }
      }
    }
    /**
 * Find the first element matching the query. If not in XML mode, the query will ignore
 * the contents of `<template>` elements.
 *
 * @param query - Function that returns true if the element matches the query.
 * @param elems - Nodes to query. If a node is an element, its children will be queried.
 * @param options - Options for querying the document.
 * @returns The first matching element, or null if there was no match.
 */
    function findOne (query, elems, options) {
      const { adapter, xmlMode = false } = options
      /** Stack of the arrays we are looking at. */
      const nodeStack = [elems]
      /** Stack of the indices within the arrays. */
      const indexStack = [0]
      for (;;) {
      // First, check if the current array has any more elements to look at.
        if (indexStack[0] >= nodeStack[0].length) {
        // If we have no more arrays to look at, we are done.
          if (nodeStack.length === 1) {
            return null
          }
          nodeStack.shift()
          indexStack.shift()
          // Loop back to the start to continue with the next array.
          continue
        }
        const elem = nodeStack[0][indexStack[0]++]
        if (!adapter.isTag(elem)) {
          continue
        }
        if (query(elem)) {
          return elem
        }
        if (xmlMode || adapter.getName(elem) !== 'template') {
        /*
             * Add the children to the stack. We are depth-first, so this is
             * the next array we look at.
             */
          const children = adapter.getChildren(elem)
          if (children.length > 0) {
            nodeStack.unshift(children)
            indexStack.unshift(0)
          }
        }
      }
    }
    function getNextSiblings (elem, adapter) {
      const siblings = adapter.getSiblings(elem)
      if (siblings.length <= 1) {
        return []
      }
      const elemIndex = siblings.indexOf(elem)
      if (elemIndex < 0 || elemIndex === siblings.length - 1) {
        return []
      }
      return siblings.slice(elemIndex + 1).filter(adapter.isTag)
    }
    function getElementParent (node, adapter) {
      const parent = adapter.getParent(node)
      return parent != null && adapter.isTag(parent) ? parent : null
    }
  }, {}],
  238: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.isTraversal = isTraversal
    exports.sortRules = sortRules
    exports.getQuality = getQuality
    exports.includesScopePseudo = includesScopePseudo
    const css_what_1 = require('css-what')
    function isTraversal (token) {
      return token.type === '_flexibleDescendant' || (0, css_what_1.isTraversal)(token)
    }
    /**
 * Sort the parts of the passed selector, as there is potential for
 * optimization (some types of selectors are faster than others).
 *
 * @param arr Selector to sort
 */
    function sortRules (arr) {
      const ratings = arr.map(getQuality)
      for (let i = 1; i < arr.length; i++) {
        const procNew = ratings[i]
        if (procNew < 0) {
          continue
        }
        // Use insertion sort to move the token to the correct position.
        for (let j = i; j > 0 && procNew < ratings[j - 1]; j--) {
          const token = arr[j]
          arr[j] = arr[j - 1]
          arr[j - 1] = token
          ratings[j] = ratings[j - 1]
          ratings[j - 1] = procNew
        }
      }
    }
    function getAttributeQuality (token) {
      switch (token.action) {
        case css_what_1.AttributeAction.Exists: {
          return 10
        }
        case css_what_1.AttributeAction.Equals: {
        // Prefer ID selectors (eg. #ID)
          return token.name === 'id' ? 9 : 8
        }
        case css_what_1.AttributeAction.Not: {
          return 7
        }
        case css_what_1.AttributeAction.Start: {
          return 6
        }
        case css_what_1.AttributeAction.End: {
          return 6
        }
        case css_what_1.AttributeAction.Any: {
          return 5
        }
        case css_what_1.AttributeAction.Hyphen: {
          return 4
        }
        case css_what_1.AttributeAction.Element: {
          return 3
        }
      }
    }
    /**
 * Determine the quality of the passed token. The higher the number, the
 * faster the token is to execute.
 *
 * @param token Token to get the quality of.
 * @returns The token's quality.
 */
    function getQuality (token) {
      switch (token.type) {
        case css_what_1.SelectorType.Universal: {
          return 50
        }
        case css_what_1.SelectorType.Tag: {
          return 30
        }
        case css_what_1.SelectorType.Attribute: {
          return Math.floor(getAttributeQuality(token) /
                // `ignoreCase` adds some overhead, half the result if applicable.
                (token.ignoreCase ? 2 : 1))
        }
        case css_what_1.SelectorType.Pseudo: {
          return !token.data
            ? 3
            : token.name === 'has' ||
                    token.name === 'contains' ||
                    token.name === 'icontains'
              ? // Expensive in any case — run as late as possible.
              0
              : Array.isArray(token.data)
                ? // Eg. `:is`, `:not`
                Math.max(
                // If we have traversals, try to avoid executing this selector
                  0, Math.min(...token.data.map((d) => Math.min(...d.map(getQuality)))))
                : 2
        }
        default: {
          return -1
        }
      }
    }
    function includesScopePseudo (t) {
      return (t.type === css_what_1.SelectorType.Pseudo &&
        (t.name === 'scope' ||
            (Array.isArray(t.data) &&
                t.data.some((data) => data.some(includesScopePseudo)))))
    }
  }, { 'css-what': 245 }],
  239: [function (require, module, exports) {
    'use strict'
    const __createBinding = (this && this.__createBinding) || (Object.create
      ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        let desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function () { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }
      : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
    const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create
      ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
      : function (o, v) {
        o.default = v
      })
    const __importStar = (this && this.__importStar) || (function () {
      let ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
          const ar = []
          for (const k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k
          return ar
        }
        return ownKeys(o)
      }
      return function (mod) {
        if (mod && mod.__esModule) return mod
        const result = {}
        if (mod != null) for (let k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== 'default') __createBinding(result, mod, k[i])
        __setModuleDefault(result, mod)
        return result
      }
    })()
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.pseudos = exports.filters = exports.aliases = exports.selectOne = exports.selectAll = void 0
    exports.compile = compile
    exports._compileUnsafe = _compileUnsafe
    exports._compileToken = _compileToken
    exports.prepareContext = prepareContext
    exports.is = is
    const boolbase = __importStar(require('boolbase'))
    const css_what_1 = require('css-what')
    const DomUtils = __importStar(require('domutils'))
    const compile_js_1 = require('./compile.js')
    const querying_js_1 = require('./helpers/querying.js')
    const defaultEquals = (a, b) => a === b
    const defaultOptions = {
      adapter: DomUtils,
      equals: defaultEquals
    }
    function convertOptionFormats (options) {
    /*
     * We force one format of options to the other one.
     */
      // @ts-expect-error Default options may have incompatible `Node` / `ElementNode`.
      const opts = options ?? defaultOptions
      // @ts-expect-error Same as above.
      opts.adapter ?? (opts.adapter = DomUtils)
      // @ts-expect-error `equals` does not exist on `Options`
      opts.equals ?? (opts.equals = opts.adapter?.equals ?? defaultEquals)
      return opts
    }
    /**
 * Compiles a selector to an executable function.
 *
 * The returned function checks if each passed node is an element. Use
 * `_compileUnsafe` to skip this check.
 *
 * @param selector Selector to compile.
 * @param options Compilation options.
 * @param context Optional context for the selector.
 */
    function compile (selector, options, context) {
      const opts = convertOptionFormats(options)
      const next = _compileUnsafe(selector, opts, context)
      return next === boolbase.falseFunc
        ? boolbase.falseFunc
        : (elem) => opts.adapter.isTag(elem) && next(elem)
    }
    /**
 * Like `compile`, but does not add a check if elements are tags.
 */
    function _compileUnsafe (selector, options, context) {
      return _compileToken(typeof selector === 'string' ? (0, css_what_1.parse)(selector) : selector, options, context)
    }
    /**
 * @deprecated Use `_compileUnsafe` instead.
 */
    function _compileToken (selector, options, context) {
      return (0, compile_js_1.compileToken)(selector, convertOptionFormats(options), context)
    }
    function getSelectorFunc (searchFunc) {
      return function select (query, elements, options) {
        const opts = convertOptionFormats(options)
        if (typeof query !== 'function') {
          query = _compileUnsafe(query, opts, elements)
        }
        const filteredElements = prepareContext(elements, opts.adapter, query.shouldTestNextSiblings)
        return searchFunc(query, filteredElements, opts)
      }
    }
    function prepareContext (elems, adapter, shouldTestNextSiblings = false) {
    /*
     * Add siblings if the query requires them.
     * See https://github.com/fb55/css-select/pull/43#issuecomment-225414692
     */
      if (shouldTestNextSiblings) {
        elems = appendNextSiblings(elems, adapter)
      }
      return Array.isArray(elems)
        ? adapter.removeSubsets(elems)
        : adapter.getChildren(elems)
    }
    function appendNextSiblings (elem, adapter) {
    // Order matters because jQuery seems to check the children before the siblings
      const elems = Array.isArray(elem) ? elem.slice(0) : [elem]
      const elemsLength = elems.length
      for (let i = 0; i < elemsLength; i++) {
        const nextSiblings = (0, querying_js_1.getNextSiblings)(elems[i], adapter)
        elems.push(...nextSiblings)
      }
      return elems
    }
    /**
 * @template Node The generic Node type for the DOM adapter being used.
 * @template ElementNode The Node type for elements for the DOM adapter being used.
 * @param elems Elements to query. If it is an element, its children will be queried.
 * @param query can be either a CSS selector string or a compiled query function.
 * @param [options] options for querying the document.
 * @see compile for supported selector queries.
 * @returns All matching elements.
 *
 */
    exports.selectAll = getSelectorFunc((query, elems, options) => query === boolbase.falseFunc || !elems || elems.length === 0
      ? []
      : (0, querying_js_1.findAll)(query, elems, options))
    /**
 * @template Node The generic Node type for the DOM adapter being used.
 * @template ElementNode The Node type for elements for the DOM adapter being used.
 * @param elems Elements to query. If it is an element, its children will be queried.
 * @param query can be either a CSS selector string or a compiled query function.
 * @param [options] options for querying the document.
 * @see compile for supported selector queries.
 * @returns the first match, or null if there was no match.
 */
    exports.selectOne = getSelectorFunc((query, elems, options) => query === boolbase.falseFunc || !elems || elems.length === 0
      ? null
      : (0, querying_js_1.findOne)(query, elems, options))
    /**
 * Tests whether or not an element is matched by query.
 *
 * @template Node The generic Node type for the DOM adapter being used.
 * @template ElementNode The Node type for elements for the DOM adapter being used.
 * @param elem The element to test if it matches the query.
 * @param query can be either a CSS selector string or a compiled query function.
 * @param [options] options for querying the document.
 * @see compile for supported selector queries.
 * @returns
 */
    function is (elem, query, options) {
      return (typeof query === 'function' ? query : compile(query, options))(elem)
    }
    /**
 * Alias for selectAll(query, elems, options).
 * @see [compile] for supported selector queries.
 */
    exports.default = exports.selectAll
    // Export filters, pseudos and aliases to allow users to supply their own.
    /** @deprecated Use the `pseudos` option instead. */
    const index_js_1 = require('./pseudo-selectors/index.js')
    Object.defineProperty(exports, 'aliases', { enumerable: true, get: function () { return index_js_1.aliases } })
    Object.defineProperty(exports, 'filters', { enumerable: true, get: function () { return index_js_1.filters } })
    Object.defineProperty(exports, 'pseudos', { enumerable: true, get: function () { return index_js_1.pseudos } })
  }, { './compile.js': 234, './helpers/querying.js': 237, './pseudo-selectors/index.js': 242, boolbase: 43, 'css-what': 245, domutils: 45 }],
  240: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.aliases = void 0
    /**
 * Only text controls can be made read-only, since for other controls (such
 * as checkboxes and buttons) there is no useful distinction between being
 * read-only and being disabled.
 *
 * @see {@link https://html.spec.whatwg.org/multipage/input.html#attr-input-readonly}
 */
    const textControl = 'input:is([type=text i],[type=search i],[type=url i],[type=tel i],[type=email i],[type=password i],[type=date i],[type=month i],[type=week i],[type=time i],[type=datetime-local i],[type=number i])'
    /**
 * Aliases are pseudos that are expressed as selectors.
 */
    exports.aliases = {
    // Links
      'any-link': ':is(a, area, link)[href]',
      link: ':any-link:not(:visited)',
      // Forms
      // https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
      disabled: `:is(
        :is(button, input, select, textarea, optgroup, option)[disabled],
        optgroup[disabled] > option,
        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)
    )`,
      enabled: ':not(:disabled)',
      checked: ':is(:is(input[type=radio], input[type=checkbox])[checked], :selected)',
      required: ':is(input, select, textarea)[required]',
      optional: ':is(input, select, textarea):not([required])',
      'read-only': `[readonly]:is(textarea, ${textControl})`,
      'read-write': `:not([readonly]):is(textarea, ${textControl})`,
      // JQuery extensions
      /**
     * `:selected` matches option elements that have the `selected` attribute,
     * or are the first option element in a select element that does not have
     * the `multiple` attribute and does not have any option elements with the
     * `selected` attribute.
     *
     * @see https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-selectedness
     */
      selected: 'option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)',
      checkbox: '[type=checkbox]',
      file: '[type=file]',
      password: '[type=password]',
      radio: '[type=radio]',
      reset: '[type=reset]',
      image: '[type=image]',
      submit: '[type=submit]',
      parent: ':not(:empty)',
      header: ':is(h1, h2, h3, h4, h5, h6)',
      button: ':is(button, input[type=button])',
      input: ':is(input, textarea, select, button)',
      text: "input:is(:not([type!='']), [type=text])"
    }
  }, {}],
  241: [function (require, module, exports) {
    'use strict'
    const __createBinding = (this && this.__createBinding) || (Object.create
      ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        let desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function () { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }
      : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
    const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create
      ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
      : function (o, v) {
        o.default = v
      })
    const __importStar = (this && this.__importStar) || (function () {
      let ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
          const ar = []
          for (const k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k
          return ar
        }
        return ownKeys(o)
      }
      return function (mod) {
        if (mod && mod.__esModule) return mod
        const result = {}
        if (mod != null) for (let k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== 'default') __createBinding(result, mod, k[i])
        __setModuleDefault(result, mod)
        return result
      }
    })()
    const __importDefault = (this && this.__importDefault) || function (mod) {
      return (mod && mod.__esModule) ? mod : { default: mod }
    }
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.filters = void 0
    const boolbase = __importStar(require('boolbase'))
    const nth_check_1 = __importDefault(require('nth-check'))
    const cache_js_1 = require('../helpers/cache.js')
    const querying_js_1 = require('../helpers/querying.js')
    exports.filters = {
      contains (next, text, options) {
        const { getText } = options.adapter
        return (0, cache_js_1.cacheParentResults)(next, options, (elem) => getText(elem).includes(text))
      },
      icontains (next, text, options) {
        const itext = text.toLowerCase()
        const { getText } = options.adapter
        return (0, cache_js_1.cacheParentResults)(next, options, (elem) => getText(elem).toLowerCase().includes(itext))
      },
      // Location specific methods
      'nth-child' (next, rule, { adapter, equals }) {
        const func = (0, nth_check_1.default)(rule)
        if (func === boolbase.falseFunc) {
          return boolbase.falseFunc
        }
        if (func === boolbase.trueFunc) {
          return (elem) => (0, querying_js_1.getElementParent)(elem, adapter) !== null && next(elem)
        }
        return function nthChild (elem) {
          const siblings = adapter.getSiblings(elem)
          let pos = 0
          for (let i = 0; i < siblings.length; i++) {
            if (equals(elem, siblings[i])) {
              break
            }
            if (adapter.isTag(siblings[i])) {
              pos++
            }
          }
          return func(pos) && next(elem)
        }
      },
      'nth-last-child' (next, rule, { adapter, equals }) {
        const func = (0, nth_check_1.default)(rule)
        if (func === boolbase.falseFunc) {
          return boolbase.falseFunc
        }
        if (func === boolbase.trueFunc) {
          return (elem) => (0, querying_js_1.getElementParent)(elem, adapter) !== null && next(elem)
        }
        return function nthLastChild (elem) {
          const siblings = adapter.getSiblings(elem)
          let pos = 0
          for (let i = siblings.length - 1; i >= 0; i--) {
            if (equals(elem, siblings[i])) {
              break
            }
            if (adapter.isTag(siblings[i])) {
              pos++
            }
          }
          return func(pos) && next(elem)
        }
      },
      'nth-of-type' (next, rule, { adapter, equals }) {
        const func = (0, nth_check_1.default)(rule)
        if (func === boolbase.falseFunc) {
          return boolbase.falseFunc
        }
        if (func === boolbase.trueFunc) {
          return (elem) => (0, querying_js_1.getElementParent)(elem, adapter) !== null && next(elem)
        }
        return function nthOfType (elem) {
          const siblings = adapter.getSiblings(elem)
          let pos = 0
          for (let i = 0; i < siblings.length; i++) {
            const currentSibling = siblings[i]
            if (equals(elem, currentSibling)) {
              break
            }
            if (adapter.isTag(currentSibling) &&
                    adapter.getName(currentSibling) === adapter.getName(elem)) {
              pos++
            }
          }
          return func(pos) && next(elem)
        }
      },
      'nth-last-of-type' (next, rule, { adapter, equals }) {
        const func = (0, nth_check_1.default)(rule)
        if (func === boolbase.falseFunc) {
          return boolbase.falseFunc
        }
        if (func === boolbase.trueFunc) {
          return (elem) => (0, querying_js_1.getElementParent)(elem, adapter) !== null && next(elem)
        }
        return function nthLastOfType (elem) {
          const siblings = adapter.getSiblings(elem)
          let pos = 0
          for (let i = siblings.length - 1; i >= 0; i--) {
            const currentSibling = siblings[i]
            if (equals(elem, currentSibling)) {
              break
            }
            if (adapter.isTag(currentSibling) &&
                    adapter.getName(currentSibling) === adapter.getName(elem)) {
              pos++
            }
          }
          return func(pos) && next(elem)
        }
      },
      // TODO determine the actual root element
      root (next, _rule, { adapter }) {
        return (elem) => (0, querying_js_1.getElementParent)(elem, adapter) === null && next(elem)
      },
      scope (next, rule, options, context) {
        const { equals } = options
        if (!context || context.length === 0) {
        // Equivalent to :root
          return exports.filters.root(next, rule, options)
        }
        if (context.length === 1) {
        // NOTE: can't be unpacked, as :has uses this for side-effects
          return (elem) => equals(context[0], elem) && next(elem)
        }
        return (elem) => context.includes(elem) && next(elem)
      },
      hover: dynamicStatePseudo('isHovered'),
      visited: dynamicStatePseudo('isVisited'),
      active: dynamicStatePseudo('isActive')
    }
    /**
 * Dynamic state pseudos. These depend on optional Adapter methods.
 *
 * @param name The name of the adapter method to call.
 * @returns Pseudo for the `filters` object.
 */
    function dynamicStatePseudo (name) {
      return function dynamicPseudo (next, _rule, { adapter }) {
        const func = adapter[name]
        if (typeof func !== 'function') {
          return boolbase.falseFunc
        }
        return function active (elem) {
          return func(elem) && next(elem)
        }
      }
    }
  }, { '../helpers/cache.js': 236, '../helpers/querying.js': 237, boolbase: 43, 'nth-check': 258 }],
  242: [function (require, module, exports) {
    'use strict'
    /*
 * Pseudo selectors
 *
 * Pseudo selectors are available in three forms:
 *
 * 1. Filters are called when the selector is compiled and return a function
 *  that has to return either false, or the results of `next()`.
 * 2. Pseudos are called on execution. They have to return a boolean.
 * 3. Subselects work like filters, but have an embedded selector that will be run separately.
 *
 * Filters are great if you want to do some pre-processing, or change the call order
 * of `next()` and your code.
 * Pseudos should be used to implement simple checks.
 */
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.aliases = exports.pseudos = exports.filters = void 0
    exports.compilePseudoSelector = compilePseudoSelector
    const css_what_1 = require('css-what')
    const aliases_js_1 = require('./aliases.js')
    Object.defineProperty(exports, 'aliases', { enumerable: true, get: function () { return aliases_js_1.aliases } })
    const filters_js_1 = require('./filters.js')
    Object.defineProperty(exports, 'filters', { enumerable: true, get: function () { return filters_js_1.filters } })
    const pseudos_js_1 = require('./pseudos.js')
    Object.defineProperty(exports, 'pseudos', { enumerable: true, get: function () { return pseudos_js_1.pseudos } })
    const subselects_js_1 = require('./subselects.js')
    function compilePseudoSelector (next, selector, options, context, compileToken) {
      const { name, data } = selector
      if (Array.isArray(data)) {
        if (!(name in subselects_js_1.subselects)) {
          throw new Error(`Unknown pseudo-class :${name}(${data})`)
        }
        return subselects_js_1.subselects[name](next, data, options, context, compileToken)
      }
      const userPseudo = options.pseudos?.[name]
      const stringPseudo = typeof userPseudo === 'string' ? userPseudo : aliases_js_1.aliases[name]
      if (typeof stringPseudo === 'string') {
        if (data != null) {
          throw new Error(`Pseudo ${name} doesn't have any arguments`)
        }
        // The alias has to be parsed here, to make sure options are respected.
        const alias = (0, css_what_1.parse)(stringPseudo)
        return subselects_js_1.subselects.is(next, alias, options, context, compileToken)
      }
      if (typeof userPseudo === 'function') {
        (0, pseudos_js_1.verifyPseudoArgs)(userPseudo, name, data, 1)
        return (elem) => userPseudo(elem, data) && next(elem)
      }
      if (name in filters_js_1.filters) {
        return filters_js_1.filters[name](next, data, options, context)
      }
      if (name in pseudos_js_1.pseudos) {
        const pseudo = pseudos_js_1.pseudos[name];
        (0, pseudos_js_1.verifyPseudoArgs)(pseudo, name, data, 2)
        return (elem) => pseudo(elem, options, data) && next(elem)
      }
      throw new Error(`Unknown pseudo-class :${name}`)
    }
  }, { './aliases.js': 240, './filters.js': 241, './pseudos.js': 243, './subselects.js': 244, 'css-what': 245 }],
  243: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.pseudos = void 0
    exports.verifyPseudoArgs = verifyPseudoArgs
    /**
 * CSS limits the characters considered as whitespace to space, tab & line
 * feed. We add carriage returns as htmlparser2 doesn't normalize them to
 * line feeds.
 *
 * @see {@link https://www.w3.org/TR/css-text-3/#white-space}
 */
    const isDocumentWhiteSpace = /^[ \t\r\n]*$/
    // While filters are precompiled, pseudos get called when they are needed
    exports.pseudos = {
      empty (elem, { adapter }) {
        const children = adapter.getChildren(elem)
        return (
        // First, make sure the tag does not have any element children.
          children.every((elem) => !adapter.isTag(elem)) &&
            // Then, check that the text content is only whitespace.
            children.every((elem) =>
            // FIXME: `getText` call is potentially expensive.
              isDocumentWhiteSpace.test(adapter.getText(elem))))
      },
      'first-child' (elem, { adapter, equals }) {
        if (adapter.prevElementSibling) {
          return adapter.prevElementSibling(elem) == null
        }
        const firstChild = adapter
          .getSiblings(elem)
          .find((elem) => adapter.isTag(elem))
        return firstChild != null && equals(elem, firstChild)
      },
      'last-child' (elem, { adapter, equals }) {
        const siblings = adapter.getSiblings(elem)
        for (let i = siblings.length - 1; i >= 0; i--) {
          if (equals(elem, siblings[i])) {
            return true
          }
          if (adapter.isTag(siblings[i])) {
            break
          }
        }
        return false
      },
      'first-of-type' (elem, { adapter, equals }) {
        const siblings = adapter.getSiblings(elem)
        const elemName = adapter.getName(elem)
        for (let i = 0; i < siblings.length; i++) {
          const currentSibling = siblings[i]
          if (equals(elem, currentSibling)) {
            return true
          }
          if (adapter.isTag(currentSibling) &&
                adapter.getName(currentSibling) === elemName) {
            break
          }
        }
        return false
      },
      'last-of-type' (elem, { adapter, equals }) {
        const siblings = adapter.getSiblings(elem)
        const elemName = adapter.getName(elem)
        for (let i = siblings.length - 1; i >= 0; i--) {
          const currentSibling = siblings[i]
          if (equals(elem, currentSibling)) {
            return true
          }
          if (adapter.isTag(currentSibling) &&
                adapter.getName(currentSibling) === elemName) {
            break
          }
        }
        return false
      },
      'only-of-type' (elem, { adapter, equals }) {
        const elemName = adapter.getName(elem)
        return adapter
          .getSiblings(elem)
          .every((sibling) => equals(elem, sibling) ||
            !adapter.isTag(sibling) ||
            adapter.getName(sibling) !== elemName)
      },
      'only-child' (elem, { adapter, equals }) {
        return adapter
          .getSiblings(elem)
          .every((sibling) => equals(elem, sibling) || !adapter.isTag(sibling))
      }
    }
    function verifyPseudoArgs (func, name, subselect, argIndex) {
      if (subselect === null) {
        if (func.length > argIndex) {
          throw new Error(`Pseudo-class :${name} requires an argument`)
        }
      } else if (func.length === argIndex) {
        throw new Error(`Pseudo-class :${name} doesn't have any arguments`)
      }
    }
  }, {}],
  244: [function (require, module, exports) {
    'use strict'
    const __createBinding = (this && this.__createBinding) || (Object.create
      ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        let desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function () { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }
      : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
    const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create
      ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
      : function (o, v) {
        o.default = v
      })
    const __importStar = (this && this.__importStar) || (function () {
      let ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
          const ar = []
          for (const k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k
          return ar
        }
        return ownKeys(o)
      }
      return function (mod) {
        if (mod && mod.__esModule) return mod
        const result = {}
        if (mod != null) for (let k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== 'default') __createBinding(result, mod, k[i])
        __setModuleDefault(result, mod)
        return result
      }
    })()
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.subselects = exports.PLACEHOLDER_ELEMENT = void 0
    const boolbase = __importStar(require('boolbase'))
    const cache_js_1 = require('../helpers/cache.js')
    const querying_js_1 = require('../helpers/querying.js')
    const selectors_js_1 = require('../helpers/selectors.js')
    /** Used as a placeholder for :has. Will be replaced with the actual element. */
    exports.PLACEHOLDER_ELEMENT = {}
    /**
 * Check if the selector has any properties that rely on the current element.
 * If not, we can cache the result of the selector.
 *
 * We can't cache selectors that start with a traversal (e.g. `>`, `+`, `~`),
 * or include a `:scope`.
 *
 * @param selector - The selector to check.
 * @returns Whether the selector has any properties that rely on the current element.
 */
    function hasDependsOnCurrentElement (selector) {
      return selector.some((sel) => sel.length > 0 &&
        ((0, selectors_js_1.isTraversal)(sel[0]) || sel.some(selectors_js_1.includesScopePseudo)))
    }
    function copyOptions (options) {
    // Not copied: context, rootFunc
      return {
        xmlMode: !!options.xmlMode,
        lowerCaseAttributeNames: !!options.lowerCaseAttributeNames,
        lowerCaseTags: !!options.lowerCaseTags,
        quirksMode: !!options.quirksMode,
        cacheResults: !!options.cacheResults,
        pseudos: options.pseudos,
        adapter: options.adapter,
        equals: options.equals
      }
    }
    const is = (next, token, options, context, compileToken) => {
      const func = compileToken(token, copyOptions(options), context)
      return func === boolbase.trueFunc
        ? next
        : func === boolbase.falseFunc
          ? boolbase.falseFunc
          : (elem) => func(elem) && next(elem)
    }
    /*
 * :not, :has, :is, :matches and :where have to compile selectors
 * doing this in src/pseudos.ts would lead to circular dependencies,
 * so we add them here
 */
    exports.subselects = {
      is,
      /**
     * `:matches` and `:where` are aliases for `:is`.
     */
      matches: is,
      where: is,
      not (next, token, options, context, compileToken) {
        const func = compileToken(token, copyOptions(options), context)
        return func === boolbase.falseFunc
          ? next
          : func === boolbase.trueFunc
            ? boolbase.falseFunc
            : (elem) => !func(elem) && next(elem)
      },
      has (next, subselect, options, _context, compileToken) {
        const { adapter } = options
        const opts = copyOptions(options)
        opts.relativeSelector = true
        const context = subselect.some((s) => s.some(selectors_js_1.isTraversal))
          ? // Used as a placeholder. Will be replaced with the actual element.
            [exports.PLACEHOLDER_ELEMENT]
          : undefined
        const skipCache = hasDependsOnCurrentElement(subselect)
        const compiled = compileToken(subselect, opts, context)
        if (compiled === boolbase.falseFunc) {
          return boolbase.falseFunc
        }
        // If `compiled` is `trueFunc`, we can skip this.
        if (context && compiled !== boolbase.trueFunc) {
          return skipCache
            ? (elem) => {
                if (!next(elem)) {
                  return false
                }
                context[0] = elem
                const childs = adapter.getChildren(elem)
                return ((0, querying_js_1.findOne)(compiled, compiled.shouldTestNextSiblings
                  ? [
                      ...childs,
                      ...(0, querying_js_1.getNextSiblings)(elem, adapter)
                    ]
                  : childs, options) !== null)
              }
            : (0, cache_js_1.cacheParentResults)(next, options, (elem) => {
                context[0] = elem
                return ((0, querying_js_1.findOne)(compiled, adapter.getChildren(elem), options) !== null)
              })
        }
        const hasOne = (elem) => (0, querying_js_1.findOne)(compiled, adapter.getChildren(elem), options) !== null
        return skipCache
          ? (elem) => next(elem) && hasOne(elem)
          : (0, cache_js_1.cacheParentResults)(next, options, hasOne)
      }
    }
  }, { '../helpers/cache.js': 236, '../helpers/querying.js': 237, '../helpers/selectors.js': 238, boolbase: 43 }],
  245: [function (require, module, exports) {
    'use strict'
    const __createBinding = (this && this.__createBinding) || (Object.create
      ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        let desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function () { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }
      : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
    const __exportStar = (this && this.__exportStar) || function (m, exports) {
      for (const p in m) if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p)
    }
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.stringify = exports.parse = exports.isTraversal = void 0
    __exportStar(require('./types.js'), exports)
    const parse_js_1 = require('./parse.js')
    Object.defineProperty(exports, 'isTraversal', { enumerable: true, get: function () { return parse_js_1.isTraversal } })
    Object.defineProperty(exports, 'parse', { enumerable: true, get: function () { return parse_js_1.parse } })
    const stringify_js_1 = require('./stringify.js')
    Object.defineProperty(exports, 'stringify', { enumerable: true, get: function () { return stringify_js_1.stringify } })
  }, { './parse.js': 246, './stringify.js': 247, './types.js': 248 }],
  246: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.isTraversal = isTraversal
    exports.parse = parse
    const types_js_1 = require('./types.js')
    const reName = /^[^#\\]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\u00B0-\uFFFF-])+/
    const reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi
    let CharCode;
    (function (CharCode) {
      CharCode[CharCode.LeftParenthesis = 40] = 'LeftParenthesis'
      CharCode[CharCode.RightParenthesis = 41] = 'RightParenthesis'
      CharCode[CharCode.LeftSquareBracket = 91] = 'LeftSquareBracket'
      CharCode[CharCode.RightSquareBracket = 93] = 'RightSquareBracket'
      CharCode[CharCode.Comma = 44] = 'Comma'
      CharCode[CharCode.Period = 46] = 'Period'
      CharCode[CharCode.Colon = 58] = 'Colon'
      CharCode[CharCode.SingleQuote = 39] = 'SingleQuote'
      CharCode[CharCode.DoubleQuote = 34] = 'DoubleQuote'
      CharCode[CharCode.Plus = 43] = 'Plus'
      CharCode[CharCode.Tilde = 126] = 'Tilde'
      CharCode[CharCode.QuestionMark = 63] = 'QuestionMark'
      CharCode[CharCode.ExclamationMark = 33] = 'ExclamationMark'
      CharCode[CharCode.Slash = 47] = 'Slash'
      CharCode[CharCode.Equal = 61] = 'Equal'
      CharCode[CharCode.Dollar = 36] = 'Dollar'
      CharCode[CharCode.Pipe = 124] = 'Pipe'
      CharCode[CharCode.Circumflex = 94] = 'Circumflex'
      CharCode[CharCode.Asterisk = 42] = 'Asterisk'
      CharCode[CharCode.GreaterThan = 62] = 'GreaterThan'
      CharCode[CharCode.LessThan = 60] = 'LessThan'
      CharCode[CharCode.Hash = 35] = 'Hash'
      CharCode[CharCode.LowerI = 105] = 'LowerI'
      CharCode[CharCode.LowerS = 115] = 'LowerS'
      CharCode[CharCode.BackSlash = 92] = 'BackSlash'
      // Whitespace
      CharCode[CharCode.Space = 32] = 'Space'
      CharCode[CharCode.Tab = 9] = 'Tab'
      CharCode[CharCode.NewLine = 10] = 'NewLine'
      CharCode[CharCode.FormFeed = 12] = 'FormFeed'
      CharCode[CharCode.CarriageReturn = 13] = 'CarriageReturn'
    })(CharCode || (CharCode = {}))
    const actionTypes = new Map([
      [CharCode.Tilde, types_js_1.AttributeAction.Element],
      [CharCode.Circumflex, types_js_1.AttributeAction.Start],
      [CharCode.Dollar, types_js_1.AttributeAction.End],
      [CharCode.Asterisk, types_js_1.AttributeAction.Any],
      [CharCode.ExclamationMark, types_js_1.AttributeAction.Not],
      [CharCode.Pipe, types_js_1.AttributeAction.Hyphen]
    ])
    // Pseudos, whose data property is parsed as well.
    const unpackPseudos = new Set([
      'has',
      'not',
      'matches',
      'is',
      'where',
      'host',
      'host-context'
    ])
    /**
 * Pseudo elements defined in CSS Level 1 and CSS Level 2 can be written with
 * a single colon; eg. :before will turn into ::before.
 *
 * @see {@link https://www.w3.org/TR/2018/WD-selectors-4-20181121/#pseudo-element-syntax}
 */
    const pseudosToPseudoElements = new Set([
      'before',
      'after',
      'first-line',
      'first-letter'
    ])
    /**
 * Checks whether a specific selector is a traversal.
 * This is useful eg. in swapping the order of elements that
 * are not traversals.
 *
 * @param selector Selector to check.
 */
    function isTraversal (selector) {
      switch (selector.type) {
        case types_js_1.SelectorType.Adjacent:
        case types_js_1.SelectorType.Child:
        case types_js_1.SelectorType.Descendant:
        case types_js_1.SelectorType.Parent:
        case types_js_1.SelectorType.Sibling:
        case types_js_1.SelectorType.ColumnCombinator: {
          return true
        }
        default: {
          return false
        }
      }
    }
    const stripQuotesFromPseudos = new Set(['contains', 'icontains'])
    // Unescape function taken from https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L152
    function funescape (_, escaped, escapedWhitespace) {
      const high = Number.parseInt(escaped, 16) - 65536
      // NaN means non-codepoint
      return high !== high || escapedWhitespace
        ? escaped
        : high < 0
          ? // BMP codepoint
          String.fromCharCode(high + 65536)
          : // Supplemental Plane codepoint (surrogate pair)
          String.fromCharCode((high >> 10) | 55296, (high & 1023) | 56320)
    }
    function unescapeCSS (cssString) {
      return cssString.replace(reEscape, funescape)
    }
    function isQuote (c) {
      return c === CharCode.SingleQuote || c === CharCode.DoubleQuote
    }
    function isWhitespace (c) {
      return (c === CharCode.Space ||
        c === CharCode.Tab ||
        c === CharCode.NewLine ||
        c === CharCode.FormFeed ||
        c === CharCode.CarriageReturn)
    }
    /**
 * Parses `selector`.
 *
 * @param selector Selector to parse.
 * @returns Returns a two-dimensional array.
 * The first dimension represents selectors separated by commas (eg. `sub1, sub2`),
 * the second contains the relevant tokens for that selector.
 */
    function parse (selector) {
      const subselects = []
      const endIndex = parseSelector(subselects, `${selector}`, 0)
      if (endIndex < selector.length) {
        throw new Error(`Unmatched selector: ${selector.slice(endIndex)}`)
      }
      return subselects
    }
    function parseSelector (subselects, selector, selectorIndex) {
      let tokens = []
      function getName (offset) {
        const match = selector.slice(selectorIndex + offset).match(reName)
        if (!match) {
          throw new Error(`Expected name, found ${selector.slice(selectorIndex)}`)
        }
        const [name] = match
        selectorIndex += offset + name.length
        return unescapeCSS(name)
      }
      function stripWhitespace (offset) {
        selectorIndex += offset
        while (selectorIndex < selector.length &&
            isWhitespace(selector.charCodeAt(selectorIndex))) {
          selectorIndex++
        }
      }
      function readValueWithParenthesis () {
        selectorIndex += 1
        const start = selectorIndex
        for (let counter = 1; selectorIndex < selector.length; selectorIndex++) {
          switch (selector.charCodeAt(selectorIndex)) {
            case CharCode.BackSlash: {
            // Skip next character
              selectorIndex += 1
              break
            }
            case CharCode.LeftParenthesis: {
              counter += 1
              break
            }
            case CharCode.RightParenthesis: {
              counter -= 1
              if (counter === 0) {
                return unescapeCSS(selector.slice(start, selectorIndex++))
              }
              break
            }
          }
        }
        throw new Error('Parenthesis not matched')
      }
      function ensureNotTraversal () {
        if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
          throw new Error('Did not expect successive traversals.')
        }
      }
      function addTraversal (type) {
        if (tokens.length > 0 &&
            tokens[tokens.length - 1].type === types_js_1.SelectorType.Descendant) {
          tokens[tokens.length - 1].type = type
          return
        }
        ensureNotTraversal()
        tokens.push({ type })
      }
      function addSpecialAttribute (name, action) {
        tokens.push({
          type: types_js_1.SelectorType.Attribute,
          name,
          action,
          value: getName(1),
          namespace: null,
          ignoreCase: 'quirks'
        })
      }
      /**
     * We have finished parsing the current part of the selector.
     *
     * Remove descendant tokens at the end if they exist,
     * and return the last index, so that parsing can be
     * picked up from here.
     */
      function finalizeSubselector () {
        if (tokens.length > 0 &&
            tokens[tokens.length - 1].type === types_js_1.SelectorType.Descendant) {
          tokens.pop()
        }
        if (tokens.length === 0) {
          throw new Error('Empty sub-selector')
        }
        subselects.push(tokens)
      }
      stripWhitespace(0)
      if (selector.length === selectorIndex) {
        return selectorIndex
      }
      loop: while (selectorIndex < selector.length) {
        const firstChar = selector.charCodeAt(selectorIndex)
        switch (firstChar) {
        // Whitespace
          case CharCode.Space:
          case CharCode.Tab:
          case CharCode.NewLine:
          case CharCode.FormFeed:
          case CharCode.CarriageReturn: {
            if (tokens.length === 0 ||
                    tokens[0].type !== types_js_1.SelectorType.Descendant) {
              ensureNotTraversal()
              tokens.push({ type: types_js_1.SelectorType.Descendant })
            }
            stripWhitespace(1)
            break
          }
          // Traversals
          case CharCode.GreaterThan: {
            addTraversal(types_js_1.SelectorType.Child)
            stripWhitespace(1)
            break
          }
          case CharCode.LessThan: {
            addTraversal(types_js_1.SelectorType.Parent)
            stripWhitespace(1)
            break
          }
          case CharCode.Tilde: {
            addTraversal(types_js_1.SelectorType.Sibling)
            stripWhitespace(1)
            break
          }
          case CharCode.Plus: {
            addTraversal(types_js_1.SelectorType.Adjacent)
            stripWhitespace(1)
            break
          }
          // Special attribute selectors: .class, #id
          case CharCode.Period: {
            addSpecialAttribute('class', types_js_1.AttributeAction.Element)
            break
          }
          case CharCode.Hash: {
            addSpecialAttribute('id', types_js_1.AttributeAction.Equals)
            break
          }
          case CharCode.LeftSquareBracket: {
            stripWhitespace(1)
            // Determine attribute name and namespace
            let name
            let namespace = null
            if (selector.charCodeAt(selectorIndex) === CharCode.Pipe) {
            // Equivalent to no namespace
              name = getName(1)
            } else if (selector.startsWith('*|', selectorIndex)) {
              namespace = '*'
              name = getName(2)
            } else {
              name = getName(0)
              if (selector.charCodeAt(selectorIndex) === CharCode.Pipe &&
                        selector.charCodeAt(selectorIndex + 1) !==
                            CharCode.Equal) {
                namespace = name
                name = getName(1)
              }
            }
            stripWhitespace(0)
            // Determine comparison operation
            let action = types_js_1.AttributeAction.Exists
            const possibleAction = actionTypes.get(selector.charCodeAt(selectorIndex))
            if (possibleAction) {
              action = possibleAction
              if (selector.charCodeAt(selectorIndex + 1) !==
                        CharCode.Equal) {
                throw new Error('Expected `=`')
              }
              stripWhitespace(2)
            } else if (selector.charCodeAt(selectorIndex) === CharCode.Equal) {
              action = types_js_1.AttributeAction.Equals
              stripWhitespace(1)
            }
            // Determine value
            let value = ''
            let ignoreCase = null
            if (action !== 'exists') {
              if (isQuote(selector.charCodeAt(selectorIndex))) {
                const quote = selector.charCodeAt(selectorIndex)
                selectorIndex += 1
                const sectionStart = selectorIndex
                while (selectorIndex < selector.length &&
                            selector.charCodeAt(selectorIndex) !== quote) {
                  selectorIndex +=
                                // Skip next character if it is escaped
                                selector.charCodeAt(selectorIndex) ===
                                    CharCode.BackSlash
                                  ? 2
                                  : 1
                }
                if (selector.charCodeAt(selectorIndex) !== quote) {
                  throw new Error("Attribute value didn't end")
                }
                value = unescapeCSS(selector.slice(sectionStart, selectorIndex))
                selectorIndex += 1
              } else {
                const valueStart = selectorIndex
                while (selectorIndex < selector.length &&
                            !isWhitespace(selector.charCodeAt(selectorIndex)) &&
                            selector.charCodeAt(selectorIndex) !==
                                CharCode.RightSquareBracket) {
                  selectorIndex +=
                                // Skip next character if it is escaped
                                selector.charCodeAt(selectorIndex) ===
                                    CharCode.BackSlash
                                  ? 2
                                  : 1
                }
                value = unescapeCSS(selector.slice(valueStart, selectorIndex))
              }
              stripWhitespace(0)
              // See if we have a force ignore flag
              switch (selector.charCodeAt(selectorIndex) | 0x20) {
              // If the forceIgnore flag is set (either `i` or `s`), use that value
                case CharCode.LowerI: {
                  ignoreCase = true
                  stripWhitespace(1)
                  break
                }
                case CharCode.LowerS: {
                  ignoreCase = false
                  stripWhitespace(1)
                  break
                }
              }
            }
            if (selector.charCodeAt(selectorIndex) !==
                    CharCode.RightSquareBracket) {
              throw new Error("Attribute selector didn't terminate")
            }
            selectorIndex += 1
            const attributeSelector = {
              type: types_js_1.SelectorType.Attribute,
              name,
              action,
              value,
              namespace,
              ignoreCase
            }
            tokens.push(attributeSelector)
            break
          }
          case CharCode.Colon: {
            if (selector.charCodeAt(selectorIndex + 1) === CharCode.Colon) {
              tokens.push({
                type: types_js_1.SelectorType.PseudoElement,
                name: getName(2).toLowerCase(),
                data: selector.charCodeAt(selectorIndex) ===
                            CharCode.LeftParenthesis
                  ? readValueWithParenthesis()
                  : null
              })
              break
            }
            const name = getName(1).toLowerCase()
            if (pseudosToPseudoElements.has(name)) {
              tokens.push({
                type: types_js_1.SelectorType.PseudoElement,
                name,
                data: null
              })
              break
            }
            let data = null
            if (selector.charCodeAt(selectorIndex) ===
                    CharCode.LeftParenthesis) {
              if (unpackPseudos.has(name)) {
                if (isQuote(selector.charCodeAt(selectorIndex + 1))) {
                  throw new Error(`Pseudo-selector ${name} cannot be quoted`)
                }
                data = []
                selectorIndex = parseSelector(data, selector, selectorIndex + 1)
                if (selector.charCodeAt(selectorIndex) !==
                            CharCode.RightParenthesis) {
                  throw new Error(`Missing closing parenthesis in :${name} (${selector})`)
                }
                selectorIndex += 1
              } else {
                data = readValueWithParenthesis()
                if (stripQuotesFromPseudos.has(name)) {
                  const quot = data.charCodeAt(0)
                  if (quot === data.charCodeAt(data.length - 1) &&
                                isQuote(quot)) {
                    data = data.slice(1, -1)
                  }
                }
                data = unescapeCSS(data)
              }
            }
            tokens.push({ type: types_js_1.SelectorType.Pseudo, name, data })
            break
          }
          case CharCode.Comma: {
            finalizeSubselector()
            tokens = []
            stripWhitespace(1)
            break
          }
          default: {
            if (selector.startsWith('/*', selectorIndex)) {
              const endIndex = selector.indexOf('*/', selectorIndex + 2)
              if (endIndex < 0) {
                throw new Error('Comment was not terminated')
              }
              selectorIndex = endIndex + 2
              // Remove leading whitespace
              if (tokens.length === 0) {
                stripWhitespace(0)
              }
              break
            }
            let namespace = null
            let name
            if (firstChar === CharCode.Asterisk) {
              selectorIndex += 1
              name = '*'
            } else if (firstChar === CharCode.Pipe) {
              name = ''
              if (selector.charCodeAt(selectorIndex + 1) === CharCode.Pipe) {
                addTraversal(types_js_1.SelectorType.ColumnCombinator)
                stripWhitespace(2)
                break
              }
            } else if (reName.test(selector.slice(selectorIndex))) {
              name = getName(0)
            } else {
              break loop
            }
            if (selector.charCodeAt(selectorIndex) === CharCode.Pipe &&
                    selector.charCodeAt(selectorIndex + 1) !== CharCode.Pipe) {
              namespace = name
              if (selector.charCodeAt(selectorIndex + 1) ===
                        CharCode.Asterisk) {
                name = '*'
                selectorIndex += 2
              } else {
                name = getName(1)
              }
            }
            tokens.push(name === '*'
              ? { type: types_js_1.SelectorType.Universal, namespace }
              : { type: types_js_1.SelectorType.Tag, name, namespace })
          }
        }
      }
      finalizeSubselector()
      return selectorIndex
    }
  }, { './types.js': 248 }],
  247: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.stringify = stringify
    const types_js_1 = require('./types.js')
    const attribValueChars = ['\\', '"']
    const pseudoValueChars = [...attribValueChars, '(', ')']
    const charsToEscapeInAttributeValue = new Set(attribValueChars.map((c) => c.charCodeAt(0)))
    const charsToEscapeInPseudoValue = new Set(pseudoValueChars.map((c) => c.charCodeAt(0)))
    const charsToEscapeInName = new Set([
      ...pseudoValueChars,
      '~',
      '^',
      '$',
      '*',
      '+',
      '!',
      '|',
      ':',
      '[',
      ']',
      ' ',
      '.',
      '%'
    ].map((c) => c.charCodeAt(0)))
    /**
 * Turns `selector` back into a string.
 *
 * @param selector Selector to stringify.
 */
    function stringify (selector) {
      return selector
        .map((token) => token
          .map((token, index, array) => stringifyToken(token, index, array))
          .join(''))
        .join(', ')
    }
    function stringifyToken (token, index, array) {
      switch (token.type) {
      // Simple types
        case types_js_1.SelectorType.Child: {
          return index === 0 ? '> ' : ' > '
        }
        case types_js_1.SelectorType.Parent: {
          return index === 0 ? '< ' : ' < '
        }
        case types_js_1.SelectorType.Sibling: {
          return index === 0 ? '~ ' : ' ~ '
        }
        case types_js_1.SelectorType.Adjacent: {
          return index === 0 ? '+ ' : ' + '
        }
        case types_js_1.SelectorType.Descendant: {
          return ' '
        }
        case types_js_1.SelectorType.ColumnCombinator: {
          return index === 0 ? '|| ' : ' || '
        }
        case types_js_1.SelectorType.Universal: {
        // Return an empty string if the selector isn't needed.
          return token.namespace === '*' &&
                index + 1 < array.length &&
                'name' in array[index + 1]
            ? ''
            : `${getNamespace(token.namespace)}*`
        }
        case types_js_1.SelectorType.Tag: {
          return getNamespacedName(token)
        }
        case types_js_1.SelectorType.PseudoElement: {
          return `::${escapeName(token.name, charsToEscapeInName)}${token.data === null
                ? ''
                : `(${escapeName(token.data, charsToEscapeInPseudoValue)})`}`
        }
        case types_js_1.SelectorType.Pseudo: {
          return `:${escapeName(token.name, charsToEscapeInName)}${token.data === null
                ? ''
                : `(${typeof token.data === 'string'
                    ? escapeName(token.data, charsToEscapeInPseudoValue)
                    : stringify(token.data)})`}`
        }
        case types_js_1.SelectorType.Attribute: {
          if (token.name === 'id' &&
                token.action === types_js_1.AttributeAction.Equals &&
                token.ignoreCase === 'quirks' &&
                !token.namespace) {
            return `#${escapeName(token.value, charsToEscapeInName)}`
          }
          if (token.name === 'class' &&
                token.action === types_js_1.AttributeAction.Element &&
                token.ignoreCase === 'quirks' &&
                !token.namespace) {
            return `.${escapeName(token.value, charsToEscapeInName)}`
          }
          const name = getNamespacedName(token)
          if (token.action === types_js_1.AttributeAction.Exists) {
            return `[${name}]`
          }
          return `[${name}${getActionValue(token.action)}="${escapeName(token.value, charsToEscapeInAttributeValue)}"${token.ignoreCase === null ? '' : token.ignoreCase ? ' i' : ' s'}]`
        }
      }
    }
    function getActionValue (action) {
      switch (action) {
        case types_js_1.AttributeAction.Equals: {
          return ''
        }
        case types_js_1.AttributeAction.Element: {
          return '~'
        }
        case types_js_1.AttributeAction.Start: {
          return '^'
        }
        case types_js_1.AttributeAction.End: {
          return '$'
        }
        case types_js_1.AttributeAction.Any: {
          return '*'
        }
        case types_js_1.AttributeAction.Not: {
          return '!'
        }
        case types_js_1.AttributeAction.Hyphen: {
          return '|'
        }
        default: {
          throw new Error("Shouldn't be here")
        }
      }
    }
    function getNamespacedName (token) {
      return `${getNamespace(token.namespace)}${escapeName(token.name, charsToEscapeInName)}`
    }
    function getNamespace (namespace) {
      return namespace === null
        ? ''
        : `${namespace === '*'
            ? '*'
            : escapeName(namespace, charsToEscapeInName)}|`
    }
    function escapeName (name, charsToEscape) {
      let lastIndex = 0
      let escapedName = ''
      for (let index = 0; index < name.length; index++) {
        if (charsToEscape.has(name.charCodeAt(index))) {
          escapedName += `${name.slice(lastIndex, index)}\\${name.charAt(index)}`
          lastIndex = index + 1
        }
      }
      return escapedName.length > 0 ? escapedName + name.slice(lastIndex) : name
    }
  }, { './types.js': 248 }],
  248: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.AttributeAction = exports.IgnoreCaseMode = exports.SelectorType = void 0
    let SelectorType;
    (function (SelectorType) {
      SelectorType.Attribute = 'attribute'
      SelectorType.Pseudo = 'pseudo'
      SelectorType.PseudoElement = 'pseudo-element'
      SelectorType.Tag = 'tag'
      SelectorType.Universal = 'universal'
      // Traversals
      SelectorType.Adjacent = 'adjacent'
      SelectorType.Child = 'child'
      SelectorType.Descendant = 'descendant'
      SelectorType.Parent = 'parent'
      SelectorType.Sibling = 'sibling'
      SelectorType.ColumnCombinator = 'column-combinator'
    })(SelectorType || (exports.SelectorType = SelectorType = {}))
    /**
 * Modes for ignore case.
 *
 * This could be updated to an enum, and the object is
 * the current stand-in that will allow code to be updated
 * without big changes.
 */
    exports.IgnoreCaseMode = {
      Unknown: null,
      QuirksMode: 'quirks',
      IgnoreCase: true,
      CaseSensitive: false
    }
    let AttributeAction;
    (function (AttributeAction) {
      AttributeAction.Any = 'any'
      AttributeAction.Element = 'element'
      AttributeAction.End = 'end'
      AttributeAction.Equals = 'equals'
      AttributeAction.Exists = 'exists'
      AttributeAction.Hyphen = 'hyphen'
      AttributeAction.Not = 'not'
      AttributeAction.Start = 'start'
    })(AttributeAction || (exports.AttributeAction = AttributeAction = {}))
  }, {}],
  249: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0
    /** Types of elements found in htmlparser2's DOM */
    let ElementType;
    (function (ElementType) {
    /** Type for the root element of a document */
      ElementType.Root = 'root'
      /** Type for Text */
      ElementType.Text = 'text'
      /** Type for <? ... ?> */
      ElementType.Directive = 'directive'
      /** Type for <!-- ... --> */
      ElementType.Comment = 'comment'
      /** Type for <script> tags */
      ElementType.Script = 'script'
      /** Type for <style> tags */
      ElementType.Style = 'style'
      /** Type for Any tag */
      ElementType.Tag = 'tag'
      /** Type for <![CDATA[ ... ]]> */
      ElementType.CDATA = 'cdata'
      /** Type for <!doctype ...> */
      ElementType.Doctype = 'doctype'
    })(ElementType = exports.ElementType || (exports.ElementType = {}))
    /**
 * Tests whether an element is a tag or not.
 *
 * @param elem Element to test
 */
    function isTag (elem) {
      return (elem.type === ElementType.Tag ||
        elem.type === ElementType.Script ||
        elem.type === ElementType.Style)
    }
    exports.isTag = isTag
    // Exports for backwards compatibility
    /** Type for the root element of a document */
    exports.Root = ElementType.Root
    /** Type for Text */
    exports.Text = ElementType.Text
    /** Type for <? ... ?> */
    exports.Directive = ElementType.Directive
    /** Type for <!-- ... --> */
    exports.Comment = ElementType.Comment
    /** Type for <script> tags */
    exports.Script = ElementType.Script
    /** Type for <style> tags */
    exports.Style = ElementType.Style
    /** Type for Any tag */
    exports.Tag = ElementType.Tag
    /** Type for <![CDATA[ ... ]]> */
    exports.CDATA = ElementType.CDATA
    /** Type for <!doctype ...> */
    exports.Doctype = ElementType.Doctype
  }, {}],
  250: [function (require, module, exports) {
    'use strict'
    const __createBinding = (this && this.__createBinding) || (Object.create
      ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        let desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function () { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }
      : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
    const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create
      ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
      : function (o, v) {
        o.default = v
      })
    const __importStar = (this && this.__importStar) || function (mod) {
      if (mod && mod.__esModule) return mod
      const result = {}
      if (mod != null) for (const k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k)
      __setModuleDefault(result, mod)
      return result
    }
    const __importDefault = (this && this.__importDefault) || function (mod) {
      return (mod && mod.__esModule) ? mod : { default: mod }
    }
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.decodeXML = exports.decodeHTMLStrict = exports.decodeHTMLAttribute = exports.decodeHTML = exports.determineBranch = exports.EntityDecoder = exports.DecodingMode = exports.BinTrieFlags = exports.fromCodePoint = exports.replaceCodePoint = exports.decodeCodePoint = exports.xmlDecodeTree = exports.htmlDecodeTree = void 0
    const decode_data_html_js_1 = __importDefault(require('./generated/decode-data-html.js'))
    exports.htmlDecodeTree = decode_data_html_js_1.default
    const decode_data_xml_js_1 = __importDefault(require('./generated/decode-data-xml.js'))
    exports.xmlDecodeTree = decode_data_xml_js_1.default
    const decode_codepoint_js_1 = __importStar(require('./decode_codepoint.js'))
    exports.decodeCodePoint = decode_codepoint_js_1.default
    const decode_codepoint_js_2 = require('./decode_codepoint.js')
    Object.defineProperty(exports, 'replaceCodePoint', { enumerable: true, get: function () { return decode_codepoint_js_2.replaceCodePoint } })
    Object.defineProperty(exports, 'fromCodePoint', { enumerable: true, get: function () { return decode_codepoint_js_2.fromCodePoint } })
    let CharCodes;
    (function (CharCodes) {
      CharCodes[CharCodes.NUM = 35] = 'NUM'
      CharCodes[CharCodes.SEMI = 59] = 'SEMI'
      CharCodes[CharCodes.EQUALS = 61] = 'EQUALS'
      CharCodes[CharCodes.ZERO = 48] = 'ZERO'
      CharCodes[CharCodes.NINE = 57] = 'NINE'
      CharCodes[CharCodes.LOWER_A = 97] = 'LOWER_A'
      CharCodes[CharCodes.LOWER_F = 102] = 'LOWER_F'
      CharCodes[CharCodes.LOWER_X = 120] = 'LOWER_X'
      CharCodes[CharCodes.LOWER_Z = 122] = 'LOWER_Z'
      CharCodes[CharCodes.UPPER_A = 65] = 'UPPER_A'
      CharCodes[CharCodes.UPPER_F = 70] = 'UPPER_F'
      CharCodes[CharCodes.UPPER_Z = 90] = 'UPPER_Z'
    })(CharCodes || (CharCodes = {}))
    /** Bit that needs to be set to convert an upper case ASCII character to lower case */
    const TO_LOWER_BIT = 32
    let BinTrieFlags;
    (function (BinTrieFlags) {
      BinTrieFlags[BinTrieFlags.VALUE_LENGTH = 49152] = 'VALUE_LENGTH'
      BinTrieFlags[BinTrieFlags.BRANCH_LENGTH = 16256] = 'BRANCH_LENGTH'
      BinTrieFlags[BinTrieFlags.JUMP_TABLE = 127] = 'JUMP_TABLE'
    })(BinTrieFlags = exports.BinTrieFlags || (exports.BinTrieFlags = {}))
    function isNumber (code) {
      return code >= CharCodes.ZERO && code <= CharCodes.NINE
    }
    function isHexadecimalCharacter (code) {
      return ((code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F) ||
        (code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F))
    }
    function isAsciiAlphaNumeric (code) {
      return ((code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z) ||
        (code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z) ||
        isNumber(code))
    }
    /**
 * Checks if the given character is a valid end character for an entity in an attribute.
 *
 * Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
 * See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
 */
    function isEntityInAttributeInvalidEnd (code) {
      return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code)
    }
    let EntityDecoderState;
    (function (EntityDecoderState) {
      EntityDecoderState[EntityDecoderState.EntityStart = 0] = 'EntityStart'
      EntityDecoderState[EntityDecoderState.NumericStart = 1] = 'NumericStart'
      EntityDecoderState[EntityDecoderState.NumericDecimal = 2] = 'NumericDecimal'
      EntityDecoderState[EntityDecoderState.NumericHex = 3] = 'NumericHex'
      EntityDecoderState[EntityDecoderState.NamedEntity = 4] = 'NamedEntity'
    })(EntityDecoderState || (EntityDecoderState = {}))
    let DecodingMode;
    (function (DecodingMode) {
    /** Entities in text nodes that can end with any character. */
      DecodingMode[DecodingMode.Legacy = 0] = 'Legacy'
      /** Only allow entities terminated with a semicolon. */
      DecodingMode[DecodingMode.Strict = 1] = 'Strict'
      /** Entities in attributes have limitations on ending characters. */
      DecodingMode[DecodingMode.Attribute = 2] = 'Attribute'
    })(DecodingMode = exports.DecodingMode || (exports.DecodingMode = {}))
    /**
 * Token decoder with support of writing partial entities.
 */
    const EntityDecoder = /** @class */ (function () {
      function EntityDecoder (
        /** The tree used to decode entities. */
        decodeTree,
        /**
     * The function that is called when a codepoint is decoded.
     *
     * For multi-byte named entities, this will be called multiple times,
     * with the second codepoint, and the same `consumed` value.
     *
     * @param codepoint The decoded codepoint.
     * @param consumed The number of bytes consumed by the decoder.
     */
        emitCodePoint,
        /** An object that is used to produce errors. */
        errors) {
        this.decodeTree = decodeTree
        this.emitCodePoint = emitCodePoint
        this.errors = errors
        /** The current state of the decoder. */
        this.state = EntityDecoderState.EntityStart
        /** Characters that were consumed while parsing an entity. */
        this.consumed = 1
        /**
         * The result of the entity.
         *
         * Either the result index of a numeric entity, or the codepoint of a
         * numeric entity.
         */
        this.result = 0
        /** The current index in the decode tree. */
        this.treeIndex = 0
        /** The number of characters that were consumed in excess. */
        this.excess = 1
        /** The mode in which the decoder is operating. */
        this.decodeMode = DecodingMode.Strict
      }
      /** Resets the instance to make it reusable. */
      EntityDecoder.prototype.startEntity = function (decodeMode) {
        this.decodeMode = decodeMode
        this.state = EntityDecoderState.EntityStart
        this.result = 0
        this.treeIndex = 0
        this.excess = 1
        this.consumed = 1
      }
      /**
     * Write an entity to the decoder. This can be called multiple times with partial entities.
     * If the entity is incomplete, the decoder will return -1.
     *
     * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
     * entity is incomplete, and resume when the next string is written.
     *
     * @param string The string containing the entity (or a continuation of the entity).
     * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */
      EntityDecoder.prototype.write = function (str, offset) {
        switch (this.state) {
          case EntityDecoderState.EntityStart: {
            if (str.charCodeAt(offset) === CharCodes.NUM) {
              this.state = EntityDecoderState.NumericStart
              this.consumed += 1
              return this.stateNumericStart(str, offset + 1)
            }
            this.state = EntityDecoderState.NamedEntity
            return this.stateNamedEntity(str, offset)
          }
          case EntityDecoderState.NumericStart: {
            return this.stateNumericStart(str, offset)
          }
          case EntityDecoderState.NumericDecimal: {
            return this.stateNumericDecimal(str, offset)
          }
          case EntityDecoderState.NumericHex: {
            return this.stateNumericHex(str, offset)
          }
          case EntityDecoderState.NamedEntity: {
            return this.stateNamedEntity(str, offset)
          }
        }
      }
      /**
     * Switches between the numeric decimal and hexadecimal states.
     *
     * Equivalent to the `Numeric character reference state` in the HTML spec.
     *
     * @param str The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */
      EntityDecoder.prototype.stateNumericStart = function (str, offset) {
        if (offset >= str.length) {
          return -1
        }
        if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
          this.state = EntityDecoderState.NumericHex
          this.consumed += 1
          return this.stateNumericHex(str, offset + 1)
        }
        this.state = EntityDecoderState.NumericDecimal
        return this.stateNumericDecimal(str, offset)
      }
      EntityDecoder.prototype.addToNumericResult = function (str, start, end, base) {
        if (start !== end) {
          const digitCount = end - start
          this.result =
                this.result * Math.pow(base, digitCount) +
                    parseInt(str.substr(start, digitCount), base)
          this.consumed += digitCount
        }
      }
      /**
     * Parses a hexadecimal numeric entity.
     *
     * Equivalent to the `Hexademical character reference state` in the HTML spec.
     *
     * @param str The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */
      EntityDecoder.prototype.stateNumericHex = function (str, offset) {
        const startIdx = offset
        while (offset < str.length) {
          const char = str.charCodeAt(offset)
          if (isNumber(char) || isHexadecimalCharacter(char)) {
            offset += 1
          } else {
            this.addToNumericResult(str, startIdx, offset, 16)
            return this.emitNumericEntity(char, 3)
          }
        }
        this.addToNumericResult(str, startIdx, offset, 16)
        return -1
      }
      /**
     * Parses a decimal numeric entity.
     *
     * Equivalent to the `Decimal character reference state` in the HTML spec.
     *
     * @param str The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */
      EntityDecoder.prototype.stateNumericDecimal = function (str, offset) {
        const startIdx = offset
        while (offset < str.length) {
          const char = str.charCodeAt(offset)
          if (isNumber(char)) {
            offset += 1
          } else {
            this.addToNumericResult(str, startIdx, offset, 10)
            return this.emitNumericEntity(char, 2)
          }
        }
        this.addToNumericResult(str, startIdx, offset, 10)
        return -1
      }
      /**
     * Validate and emit a numeric entity.
     *
     * Implements the logic from the `Hexademical character reference start
     * state` and `Numeric character reference end state` in the HTML spec.
     *
     * @param lastCp The last code point of the entity. Used to see if the
     *               entity was terminated with a semicolon.
     * @param expectedLength The minimum number of characters that should be
     *                       consumed. Used to validate that at least one digit
     *                       was consumed.
     * @returns The number of characters that were consumed.
     */
      EntityDecoder.prototype.emitNumericEntity = function (lastCp, expectedLength) {
        let _a
        // Ensure we consumed at least one digit.
        if (this.consumed <= expectedLength) {
          (_a = this.errors) === null || _a === void 0 ? void 0 : _a.absenceOfDigitsInNumericCharacterReference(this.consumed)
          return 0
        }
        // Figure out if this is a legit end of the entity
        if (lastCp === CharCodes.SEMI) {
          this.consumed += 1
        } else if (this.decodeMode === DecodingMode.Strict) {
          return 0
        }
        this.emitCodePoint((0, decode_codepoint_js_1.replaceCodePoint)(this.result), this.consumed)
        if (this.errors) {
          if (lastCp !== CharCodes.SEMI) {
            this.errors.missingSemicolonAfterCharacterReference()
          }
          this.errors.validateNumericCharacterReference(this.result)
        }
        return this.consumed
      }
      /**
     * Parses a named entity.
     *
     * Equivalent to the `Named character reference state` in the HTML spec.
     *
     * @param str The string containing the entity (or a continuation of the entity).
     * @param offset The current offset.
     * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
     */
      EntityDecoder.prototype.stateNamedEntity = function (str, offset) {
        const decodeTree = this.decodeTree
        let current = decodeTree[this.treeIndex]
        // The mask is the number of bytes of the value, including the current byte.
        let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14
        for (; offset < str.length; offset++, this.excess++) {
          const char = str.charCodeAt(offset)
          this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char)
          if (this.treeIndex < 0) {
            return this.result === 0 ||
                    // If we are parsing an attribute
                    (this.decodeMode === DecodingMode.Attribute &&
                        // We shouldn't have consumed any characters after the entity,
                        (valueLength === 0 ||
                            // And there should be no invalid characters.
                            isEntityInAttributeInvalidEnd(char)))
              ? 0
              : this.emitNotTerminatedNamedEntity()
          }
          current = decodeTree[this.treeIndex]
          valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14
          // If the branch is a value, store it and continue
          if (valueLength !== 0) {
          // If the entity is terminated by a semicolon, we are done.
            if (char === CharCodes.SEMI) {
              return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess)
            }
            // If we encounter a non-terminated (legacy) entity while parsing strictly, then ignore it.
            if (this.decodeMode !== DecodingMode.Strict) {
              this.result = this.treeIndex
              this.consumed += this.excess
              this.excess = 0
            }
          }
        }
        return -1
      }
      /**
     * Emit a named entity that was not terminated with a semicolon.
     *
     * @returns The number of characters consumed.
     */
      EntityDecoder.prototype.emitNotTerminatedNamedEntity = function () {
        let _a
        const _b = this; const result = _b.result; const decodeTree = _b.decodeTree
        const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14
        this.emitNamedEntityData(result, valueLength, this.consumed);
        (_a = this.errors) === null || _a === void 0 ? void 0 : _a.missingSemicolonAfterCharacterReference()
        return this.consumed
      }
      /**
     * Emit a named entity.
     *
     * @param result The index of the entity in the decode tree.
     * @param valueLength The number of bytes in the entity.
     * @param consumed The number of characters consumed.
     *
     * @returns The number of characters consumed.
     */
      EntityDecoder.prototype.emitNamedEntityData = function (result, valueLength, consumed) {
        const decodeTree = this.decodeTree
        this.emitCodePoint(valueLength === 1
          ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH
          : decodeTree[result + 1], consumed)
        if (valueLength === 3) {
        // For multi-byte values, we need to emit the second byte.
          this.emitCodePoint(decodeTree[result + 2], consumed)
        }
        return consumed
      }
      /**
     * Signal to the parser that the end of the input was reached.
     *
     * Remaining data will be emitted and relevant errors will be produced.
     *
     * @returns The number of characters consumed.
     */
      EntityDecoder.prototype.end = function () {
        let _a
        switch (this.state) {
          case EntityDecoderState.NamedEntity: {
          // Emit a named entity if we have one.
            return this.result !== 0 &&
                    (this.decodeMode !== DecodingMode.Attribute ||
                        this.result === this.treeIndex)
              ? this.emitNotTerminatedNamedEntity()
              : 0
          }
          // Otherwise, emit a numeric entity if we have one.
          case EntityDecoderState.NumericDecimal: {
            return this.emitNumericEntity(0, 2)
          }
          case EntityDecoderState.NumericHex: {
            return this.emitNumericEntity(0, 3)
          }
          case EntityDecoderState.NumericStart: {
            (_a = this.errors) === null || _a === void 0 ? void 0 : _a.absenceOfDigitsInNumericCharacterReference(this.consumed)
            return 0
          }
          case EntityDecoderState.EntityStart: {
          // Return 0 if we have no entity.
            return 0
          }
        }
      }
      return EntityDecoder
    }())
    exports.EntityDecoder = EntityDecoder
    /**
 * Creates a function that decodes entities in a string.
 *
 * @param decodeTree The decode tree.
 * @returns A function that decodes entities in a string.
 */
    function getDecoder (decodeTree) {
      let ret = ''
      const decoder = new EntityDecoder(decodeTree, function (str) { return (ret += (0, decode_codepoint_js_1.fromCodePoint)(str)) })
      return function decodeWithTrie (str, decodeMode) {
        let lastIndex = 0
        let offset = 0
        while ((offset = str.indexOf('&', offset)) >= 0) {
          ret += str.slice(lastIndex, offset)
          decoder.startEntity(decodeMode)
          const len = decoder.write(str,
          // Skip the "&"
            offset + 1)
          if (len < 0) {
            lastIndex = offset + decoder.end()
            break
          }
          lastIndex = offset + len
          // If `len` is 0, skip the current `&` and continue.
          offset = len === 0 ? lastIndex + 1 : lastIndex
        }
        const result = ret + str.slice(lastIndex)
        // Make sure we don't keep a reference to the final string.
        ret = ''
        return result
      }
    }
    /**
 * Determines the branch of the current node that is taken given the current
 * character. This function is used to traverse the trie.
 *
 * @param decodeTree The trie.
 * @param current The current node.
 * @param nodeIdx The index right after the current node and its value.
 * @param char The current character.
 * @returns The index of the next node, or -1 if no branch is taken.
 */
    function determineBranch (decodeTree, current, nodeIdx, char) {
      const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7
      const jumpOffset = current & BinTrieFlags.JUMP_TABLE
      // Case 1: Single branch encoded in jump offset
      if (branchCount === 0) {
        return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1
      }
      // Case 2: Multiple branches encoded in jump table
      if (jumpOffset) {
        const value = char - jumpOffset
        return value < 0 || value >= branchCount
          ? -1
          : decodeTree[nodeIdx + value] - 1
      }
      // Case 3: Multiple branches encoded in dictionary
      // Binary search for the character.
      let lo = nodeIdx
      let hi = lo + branchCount - 1
      while (lo <= hi) {
        const mid = (lo + hi) >>> 1
        const midVal = decodeTree[mid]
        if (midVal < char) {
          lo = mid + 1
        } else if (midVal > char) {
          hi = mid - 1
        } else {
          return decodeTree[mid + branchCount]
        }
      }
      return -1
    }
    exports.determineBranch = determineBranch
    const htmlDecoder = getDecoder(decode_data_html_js_1.default)
    const xmlDecoder = getDecoder(decode_data_xml_js_1.default)
    /**
 * Decodes an HTML string.
 *
 * @param str The string to decode.
 * @param mode The decoding mode.
 * @returns The decoded string.
 */
    function decodeHTML (str, mode) {
      if (mode === void 0) { mode = DecodingMode.Legacy }
      return htmlDecoder(str, mode)
    }
    exports.decodeHTML = decodeHTML
    /**
 * Decodes an HTML string in an attribute.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */
    function decodeHTMLAttribute (str) {
      return htmlDecoder(str, DecodingMode.Attribute)
    }
    exports.decodeHTMLAttribute = decodeHTMLAttribute
    /**
 * Decodes an HTML string, requiring all entities to be terminated by a semicolon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */
    function decodeHTMLStrict (str) {
      return htmlDecoder(str, DecodingMode.Strict)
    }
    exports.decodeHTMLStrict = decodeHTMLStrict
    /**
 * Decodes an XML string, requiring all entities to be terminated by a semicolon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */
    function decodeXML (str) {
      return xmlDecoder(str, DecodingMode.Strict)
    }
    exports.decodeXML = decodeXML
  }, { './decode_codepoint.js': 251, './generated/decode-data-html.js': 252, './generated/decode-data-xml.js': 253 }],
  251: [function (require, module, exports) {
    'use strict'
    // Adapted from https://github.com/mathiasbynens/he/blob/36afe179392226cf1b6ccdb16ebbb7a5a844d93a/src/he.js#L106-L134
    let _a
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.replaceCodePoint = exports.fromCodePoint = void 0
    const decodeMap = new Map([
      [0, 65533],
      // C1 Unicode control character reference replacements
      [128, 8364],
      [130, 8218],
      [131, 402],
      [132, 8222],
      [133, 8230],
      [134, 8224],
      [135, 8225],
      [136, 710],
      [137, 8240],
      [138, 352],
      [139, 8249],
      [140, 338],
      [142, 381],
      [145, 8216],
      [146, 8217],
      [147, 8220],
      [148, 8221],
      [149, 8226],
      [150, 8211],
      [151, 8212],
      [152, 732],
      [153, 8482],
      [154, 353],
      [155, 8250],
      [156, 339],
      [158, 382],
      [159, 376]
    ])
    /**
 * Polyfill for `String.fromCodePoint`. It is used to create a string from a Unicode code point.
 */
    exports.fromCodePoint =
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
(_a = String.fromCodePoint) !== null && _a !== void 0
  ? _a
  : function (codePoint) {
    let output = ''
    if (codePoint > 0xffff) {
      codePoint -= 0x10000
      output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800)
      codePoint = 0xdc00 | (codePoint & 0x3ff)
    }
    output += String.fromCharCode(codePoint)
    return output
  }
    /**
 * Replace the given code point with a replacement character if it is a
 * surrogate or is outside the valid range. Otherwise return the code
 * point unchanged.
 */
    function replaceCodePoint (codePoint) {
      let _a
      if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return 0xfffd
      }
      return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint
    }
    exports.replaceCodePoint = replaceCodePoint
    /**
 * Replace the code point if relevant, then convert it to a string.
 *
 * @deprecated Use `fromCodePoint(replaceCodePoint(codePoint))` instead.
 * @param codePoint The code point to decode.
 * @returns The decoded code point.
 */
    function decodeCodePoint (codePoint) {
      return (0, exports.fromCodePoint)(replaceCodePoint(codePoint))
    }
    exports.default = decodeCodePoint
  }, {}],
  252: [function (require, module, exports) {
    'use strict'
    // Generated using scripts/write-decode-map.ts
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.default = new Uint16Array(
    // prettier-ignore
      '\u1d41<\xd5\u0131\u028a\u049d\u057b\u05d0\u0675\u06de\u07a2\u07d6\u080f\u0a4a\u0a91\u0da1\u0e6d\u0f09\u0f26\u10ca\u1228\u12e1\u1415\u149d\u14c3\u14df\u1525\0\0\0\0\0\0\u156b\u16cd\u198d\u1c12\u1ddd\u1f7e\u2060\u21b0\u228d\u23c0\u23fb\u2442\u2824\u2912\u2d08\u2e48\u2fce\u3016\u32ba\u3639\u37ac\u38fe\u3a28\u3a71\u3ae0\u3b2e\u0800EMabcfglmnoprstu\\bfms\x7f\x84\x8b\x90\x95\x98\xa6\xb3\xb9\xc8\xcflig\u803b\xc6\u40c6P\u803b&\u4026cute\u803b\xc1\u40c1reve;\u4102\u0100iyx}rc\u803b\xc2\u40c2;\u4410r;\uc000\ud835\udd04rave\u803b\xc0\u40c0pha;\u4391acr;\u4100d;\u6a53\u0100gp\x9d\xa1on;\u4104f;\uc000\ud835\udd38plyFunction;\u6061ing\u803b\xc5\u40c5\u0100cs\xbe\xc3r;\uc000\ud835\udc9cign;\u6254ilde\u803b\xc3\u40c3ml\u803b\xc4\u40c4\u0400aceforsu\xe5\xfb\xfe\u0117\u011c\u0122\u0127\u012a\u0100cr\xea\xf2kslash;\u6216\u0176\xf6\xf8;\u6ae7ed;\u6306y;\u4411\u0180crt\u0105\u010b\u0114ause;\u6235noullis;\u612ca;\u4392r;\uc000\ud835\udd05pf;\uc000\ud835\udd39eve;\u42d8c\xf2\u0113mpeq;\u624e\u0700HOacdefhilorsu\u014d\u0151\u0156\u0180\u019e\u01a2\u01b5\u01b7\u01ba\u01dc\u0215\u0273\u0278\u027ecy;\u4427PY\u803b\xa9\u40a9\u0180cpy\u015d\u0162\u017aute;\u4106\u0100;i\u0167\u0168\u62d2talDifferentialD;\u6145leys;\u612d\u0200aeio\u0189\u018e\u0194\u0198ron;\u410cdil\u803b\xc7\u40c7rc;\u4108nint;\u6230ot;\u410a\u0100dn\u01a7\u01adilla;\u40b8terDot;\u40b7\xf2\u017fi;\u43a7rcle\u0200DMPT\u01c7\u01cb\u01d1\u01d6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01e2\u01f8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020foubleQuote;\u601duote;\u6019\u0200lnpu\u021e\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6a74\u0180git\u022f\u0236\u023aruent;\u6261nt;\u622fourIntegral;\u622e\u0100fr\u024c\u024e;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6a2fcr;\uc000\ud835\udc9ep\u0100;C\u0284\u0285\u62d3ap;\u624d\u0580DJSZacefios\u02a0\u02ac\u02b0\u02b4\u02b8\u02cb\u02d7\u02e1\u02e6\u0333\u048d\u0100;o\u0179\u02a5trahd;\u6911cy;\u4402cy;\u4405cy;\u440f\u0180grs\u02bf\u02c4\u02c7ger;\u6021r;\u61a1hv;\u6ae4\u0100ay\u02d0\u02d5ron;\u410e;\u4414l\u0100;t\u02dd\u02de\u6207a;\u4394r;\uc000\ud835\udd07\u0100af\u02eb\u0327\u0100cm\u02f0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031ccute;\u40b4o\u0174\u030b\u030d;\u42d9bleAcute;\u42ddrave;\u4060ilde;\u42dcond;\u62c4ferentialD;\u6146\u0470\u033d\0\0\0\u0342\u0354\0\u0405f;\uc000\ud835\udd3b\u0180;DE\u0348\u0349\u034d\u40a8ot;\u60dcqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03cf\u03e2\u03f8ontourIntegra\xec\u0239o\u0274\u0379\0\0\u037b\xbb\u0349nArrow;\u61d3\u0100eo\u0387\u03a4ft\u0180ART\u0390\u0396\u03a1rrow;\u61d0ightArrow;\u61d4e\xe5\u02cang\u0100LR\u03ab\u03c4eft\u0100AR\u03b3\u03b9rrow;\u67f8ightArrow;\u67faightArrow;\u67f9ight\u0100AT\u03d8\u03derrow;\u61d2ee;\u62a8p\u0241\u03e9\0\0\u03efrrow;\u61d1ownArrow;\u61d5erticalBar;\u6225n\u0300ABLRTa\u0412\u042a\u0430\u045e\u047f\u037crrow\u0180;BU\u041d\u041e\u0422\u6193ar;\u6913pArrow;\u61f5reve;\u4311eft\u02d2\u043a\0\u0446\0\u0450ightVector;\u6950eeVector;\u695eector\u0100;B\u0459\u045a\u61bdar;\u6956ight\u01d4\u0467\0\u0471eeVector;\u695fector\u0100;B\u047a\u047b\u61c1ar;\u6957ee\u0100;A\u0486\u0487\u62a4rrow;\u61a7\u0100ct\u0492\u0497r;\uc000\ud835\udc9frok;\u4110\u0800NTacdfglmopqstux\u04bd\u04c0\u04c4\u04cb\u04de\u04e2\u04e7\u04ee\u04f5\u0521\u052f\u0536\u0552\u055d\u0560\u0565G;\u414aH\u803b\xd0\u40d0cute\u803b\xc9\u40c9\u0180aiy\u04d2\u04d7\u04dcron;\u411arc\u803b\xca\u40ca;\u442dot;\u4116r;\uc000\ud835\udd08rave\u803b\xc8\u40c8ement;\u6208\u0100ap\u04fa\u04fecr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65fberySmallSquare;\u65ab\u0100gp\u0526\u052aon;\u4118f;\uc000\ud835\udd3csilon;\u4395u\u0100ai\u053c\u0549l\u0100;T\u0542\u0543\u6a75ilde;\u6242librium;\u61cc\u0100ci\u0557\u055ar;\u6130m;\u6a73a;\u4397ml\u803b\xcb\u40cb\u0100ip\u056a\u056fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058d\u05b2\u05ccy;\u4424r;\uc000\ud835\udd09lled\u0253\u0597\0\0\u05a3mallSquare;\u65fcerySmallSquare;\u65aa\u0370\u05ba\0\u05bf\0\0\u05c4f;\uc000\ud835\udd3dAll;\u6200riertrf;\u6131c\xf2\u05cb\u0600JTabcdfgorst\u05e8\u05ec\u05ef\u05fa\u0600\u0612\u0616\u061b\u061d\u0623\u066c\u0672cy;\u4403\u803b>\u403emma\u0100;d\u05f7\u05f8\u4393;\u43dcreve;\u411e\u0180eiy\u0607\u060c\u0610dil;\u4122rc;\u411c;\u4413ot;\u4120r;\uc000\ud835\udd0a;\u62d9pf;\uc000\ud835\udd3eeater\u0300EFGLST\u0635\u0644\u064e\u0656\u065b\u0666qual\u0100;L\u063e\u063f\u6265ess;\u62dbullEqual;\u6267reater;\u6aa2ess;\u6277lantEqual;\u6a7eilde;\u6273cr;\uc000\ud835\udca2;\u626b\u0400Aacfiosu\u0685\u068b\u0696\u069b\u069e\u06aa\u06be\u06caRDcy;\u442a\u0100ct\u0690\u0694ek;\u42c7;\u405eirc;\u4124r;\u610clbertSpace;\u610b\u01f0\u06af\0\u06b2f;\u610dizontalLine;\u6500\u0100ct\u06c3\u06c5\xf2\u06a9rok;\u4126mp\u0144\u06d0\u06d8ownHum\xf0\u012fqual;\u624f\u0700EJOacdfgmnostu\u06fa\u06fe\u0703\u0707\u070e\u071a\u071e\u0721\u0728\u0744\u0778\u078b\u078f\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803b\xcd\u40cd\u0100iy\u0713\u0718rc\u803b\xce\u40ce;\u4418ot;\u4130r;\u6111rave\u803b\xcc\u40cc\u0180;ap\u0720\u072f\u073f\u0100cg\u0734\u0737r;\u412ainaryI;\u6148lie\xf3\u03dd\u01f4\u0749\0\u0762\u0100;e\u074d\u074e\u622c\u0100gr\u0753\u0758ral;\u622bsection;\u62c2isible\u0100CT\u076c\u0772omma;\u6063imes;\u6062\u0180gpt\u077f\u0783\u0788on;\u412ef;\uc000\ud835\udd40a;\u4399cr;\u6110ilde;\u4128\u01eb\u079a\0\u079ecy;\u4406l\u803b\xcf\u40cf\u0280cfosu\u07ac\u07b7\u07bc\u07c2\u07d0\u0100iy\u07b1\u07b5rc;\u4134;\u4419r;\uc000\ud835\udd0dpf;\uc000\ud835\udd41\u01e3\u07c7\0\u07ccr;\uc000\ud835\udca5rcy;\u4408kcy;\u4404\u0380HJacfos\u07e4\u07e8\u07ec\u07f1\u07fd\u0802\u0808cy;\u4425cy;\u440cppa;\u439a\u0100ey\u07f6\u07fbdil;\u4136;\u441ar;\uc000\ud835\udd0epf;\uc000\ud835\udd42cr;\uc000\ud835\udca6\u0580JTaceflmost\u0825\u0829\u082c\u0850\u0863\u09b3\u09b8\u09c7\u09cd\u0a37\u0a47cy;\u4409\u803b<\u403c\u0280cmnpr\u0837\u083c\u0841\u0844\u084dute;\u4139bda;\u439bg;\u67ealacetrf;\u6112r;\u619e\u0180aey\u0857\u085c\u0861ron;\u413ddil;\u413b;\u441b\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087e\u08a9\u08b1\u08e0\u08e6\u08fc\u092f\u095b\u0390\u096a\u0100nr\u0883\u088fgleBracket;\u67e8row\u0180;BR\u0899\u089a\u089e\u6190ar;\u61e4ightArrow;\u61c6eiling;\u6308o\u01f5\u08b7\0\u08c3bleBracket;\u67e6n\u01d4\u08c8\0\u08d2eeVector;\u6961ector\u0100;B\u08db\u08dc\u61c3ar;\u6959loor;\u630aight\u0100AV\u08ef\u08f5rrow;\u6194ector;\u694e\u0100er\u0901\u0917e\u0180;AV\u0909\u090a\u0910\u62a3rrow;\u61a4ector;\u695aiangle\u0180;BE\u0924\u0925\u0929\u62b2ar;\u69cfqual;\u62b4p\u0180DTV\u0937\u0942\u094cownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61bfar;\u6958ector\u0100;B\u0965\u0966\u61bcar;\u6952ight\xe1\u039cs\u0300EFGLST\u097e\u098b\u0995\u099d\u09a2\u09adqualGreater;\u62daullEqual;\u6266reater;\u6276ess;\u6aa1lantEqual;\u6a7dilde;\u6272r;\uc000\ud835\udd0f\u0100;e\u09bd\u09be\u62d8ftarrow;\u61daidot;\u413f\u0180npw\u09d4\u0a16\u0a1bg\u0200LRlr\u09de\u09f7\u0a02\u0a10eft\u0100AR\u09e6\u09ecrrow;\u67f5ightArrow;\u67f7ightArrow;\u67f6eft\u0100ar\u03b3\u0a0aight\xe1\u03bfight\xe1\u03caf;\uc000\ud835\udd43er\u0100LR\u0a22\u0a2ceftArrow;\u6199ightArrow;\u6198\u0180cht\u0a3e\u0a40\u0a42\xf2\u084c;\u61b0rok;\u4141;\u626a\u0400acefiosu\u0a5a\u0a5d\u0a60\u0a77\u0a7c\u0a85\u0a8b\u0a8ep;\u6905y;\u441c\u0100dl\u0a65\u0a6fiumSpace;\u605flintrf;\u6133r;\uc000\ud835\udd10nusPlus;\u6213pf;\uc000\ud835\udd44c\xf2\u0a76;\u439c\u0480Jacefostu\u0aa3\u0aa7\u0aad\u0ac0\u0b14\u0b19\u0d91\u0d97\u0d9ecy;\u440acute;\u4143\u0180aey\u0ab4\u0ab9\u0aberon;\u4147dil;\u4145;\u441d\u0180gsw\u0ac7\u0af0\u0b0eative\u0180MTV\u0ad3\u0adf\u0ae8ediumSpace;\u600bhi\u0100cn\u0ae6\u0ad8\xeb\u0ad9eryThi\xee\u0ad9ted\u0100GL\u0af8\u0b06reaterGreate\xf2\u0673essLes\xf3\u0a48Line;\u400ar;\uc000\ud835\udd11\u0200Bnpt\u0b22\u0b28\u0b37\u0b3areak;\u6060BreakingSpace;\u40a0f;\u6115\u0680;CDEGHLNPRSTV\u0b55\u0b56\u0b6a\u0b7c\u0ba1\u0beb\u0c04\u0c5e\u0c84\u0ca6\u0cd8\u0d61\u0d85\u6aec\u0100ou\u0b5b\u0b64ngruent;\u6262pCap;\u626doubleVerticalBar;\u6226\u0180lqx\u0b83\u0b8a\u0b9bement;\u6209ual\u0100;T\u0b92\u0b93\u6260ilde;\uc000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0bb6\u0bb7\u0bbd\u0bc9\u0bd3\u0bd8\u0be5\u626fqual;\u6271ullEqual;\uc000\u2267\u0338reater;\uc000\u226b\u0338ess;\u6279lantEqual;\uc000\u2a7e\u0338ilde;\u6275ump\u0144\u0bf2\u0bfdownHump;\uc000\u224e\u0338qual;\uc000\u224f\u0338e\u0100fs\u0c0a\u0c27tTriangle\u0180;BE\u0c1a\u0c1b\u0c21\u62eaar;\uc000\u29cf\u0338qual;\u62ecs\u0300;EGLST\u0c35\u0c36\u0c3c\u0c44\u0c4b\u0c58\u626equal;\u6270reater;\u6278ess;\uc000\u226a\u0338lantEqual;\uc000\u2a7d\u0338ilde;\u6274ested\u0100GL\u0c68\u0c79reaterGreater;\uc000\u2aa2\u0338essLess;\uc000\u2aa1\u0338recedes\u0180;ES\u0c92\u0c93\u0c9b\u6280qual;\uc000\u2aaf\u0338lantEqual;\u62e0\u0100ei\u0cab\u0cb9verseElement;\u620cghtTriangle\u0180;BE\u0ccb\u0ccc\u0cd2\u62ebar;\uc000\u29d0\u0338qual;\u62ed\u0100qu\u0cdd\u0d0cuareSu\u0100bp\u0ce8\u0cf9set\u0100;E\u0cf0\u0cf3\uc000\u228f\u0338qual;\u62e2erset\u0100;E\u0d03\u0d06\uc000\u2290\u0338qual;\u62e3\u0180bcp\u0d13\u0d24\u0d4eset\u0100;E\u0d1b\u0d1e\uc000\u2282\u20d2qual;\u6288ceeds\u0200;EST\u0d32\u0d33\u0d3b\u0d46\u6281qual;\uc000\u2ab0\u0338lantEqual;\u62e1ilde;\uc000\u227f\u0338erset\u0100;E\u0d58\u0d5b\uc000\u2283\u20d2qual;\u6289ilde\u0200;EFT\u0d6e\u0d6f\u0d75\u0d7f\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uc000\ud835\udca9ilde\u803b\xd1\u40d1;\u439d\u0700Eacdfgmoprstuv\u0dbd\u0dc2\u0dc9\u0dd5\u0ddb\u0de0\u0de7\u0dfc\u0e02\u0e20\u0e22\u0e32\u0e3f\u0e44lig;\u4152cute\u803b\xd3\u40d3\u0100iy\u0dce\u0dd3rc\u803b\xd4\u40d4;\u441eblac;\u4150r;\uc000\ud835\udd12rave\u803b\xd2\u40d2\u0180aei\u0dee\u0df2\u0df6cr;\u414cga;\u43a9cron;\u439fpf;\uc000\ud835\udd46enCurly\u0100DQ\u0e0e\u0e1aoubleQuote;\u601cuote;\u6018;\u6a54\u0100cl\u0e27\u0e2cr;\uc000\ud835\udcaaash\u803b\xd8\u40d8i\u016c\u0e37\u0e3cde\u803b\xd5\u40d5es;\u6a37ml\u803b\xd6\u40d6er\u0100BP\u0e4b\u0e60\u0100ar\u0e50\u0e53r;\u603eac\u0100ek\u0e5a\u0e5c;\u63deet;\u63b4arenthesis;\u63dc\u0480acfhilors\u0e7f\u0e87\u0e8a\u0e8f\u0e92\u0e94\u0e9d\u0eb0\u0efcrtialD;\u6202y;\u441fr;\uc000\ud835\udd13i;\u43a6;\u43a0usMinus;\u40b1\u0100ip\u0ea2\u0eadncareplan\xe5\u069df;\u6119\u0200;eio\u0eb9\u0eba\u0ee0\u0ee4\u6abbcedes\u0200;EST\u0ec8\u0ec9\u0ecf\u0eda\u627aqual;\u6aaflantEqual;\u627cilde;\u627eme;\u6033\u0100dp\u0ee9\u0eeeuct;\u620fortion\u0100;a\u0225\u0ef9l;\u621d\u0100ci\u0f01\u0f06r;\uc000\ud835\udcab;\u43a8\u0200Ufos\u0f11\u0f16\u0f1b\u0f1fOT\u803b"\u4022r;\uc000\ud835\udd14pf;\u611acr;\uc000\ud835\udcac\u0600BEacefhiorsu\u0f3e\u0f43\u0f47\u0f60\u0f73\u0fa7\u0faa\u0fad\u1096\u10a9\u10b4\u10bearr;\u6910G\u803b\xae\u40ae\u0180cnr\u0f4e\u0f53\u0f56ute;\u4154g;\u67ebr\u0100;t\u0f5c\u0f5d\u61a0l;\u6916\u0180aey\u0f67\u0f6c\u0f71ron;\u4158dil;\u4156;\u4420\u0100;v\u0f78\u0f79\u611cerse\u0100EU\u0f82\u0f99\u0100lq\u0f87\u0f8eement;\u620builibrium;\u61cbpEquilibrium;\u696fr\xbb\u0f79o;\u43a1ght\u0400ACDFTUVa\u0fc1\u0feb\u0ff3\u1022\u1028\u105b\u1087\u03d8\u0100nr\u0fc6\u0fd2gleBracket;\u67e9row\u0180;BL\u0fdc\u0fdd\u0fe1\u6192ar;\u61e5eftArrow;\u61c4eiling;\u6309o\u01f5\u0ff9\0\u1005bleBracket;\u67e7n\u01d4\u100a\0\u1014eeVector;\u695dector\u0100;B\u101d\u101e\u61c2ar;\u6955loor;\u630b\u0100er\u102d\u1043e\u0180;AV\u1035\u1036\u103c\u62a2rrow;\u61a6ector;\u695biangle\u0180;BE\u1050\u1051\u1055\u62b3ar;\u69d0qual;\u62b5p\u0180DTV\u1063\u106e\u1078ownVector;\u694feeVector;\u695cector\u0100;B\u1082\u1083\u61bear;\u6954ector\u0100;B\u1091\u1092\u61c0ar;\u6953\u0100pu\u109b\u109ef;\u611dndImplies;\u6970ightarrow;\u61db\u0100ch\u10b9\u10bcr;\u611b;\u61b1leDelayed;\u69f4\u0680HOacfhimoqstu\u10e4\u10f1\u10f7\u10fd\u1119\u111e\u1151\u1156\u1161\u1167\u11b5\u11bb\u11bf\u0100Cc\u10e9\u10eeHcy;\u4429y;\u4428FTcy;\u442ccute;\u415a\u0280;aeiy\u1108\u1109\u110e\u1113\u1117\u6abcron;\u4160dil;\u415erc;\u415c;\u4421r;\uc000\ud835\udd16ort\u0200DLRU\u112a\u1134\u113e\u1149ownArrow\xbb\u041eeftArrow\xbb\u089aightArrow\xbb\u0fddpArrow;\u6191gma;\u43a3allCircle;\u6218pf;\uc000\ud835\udd4a\u0272\u116d\0\0\u1170t;\u621aare\u0200;ISU\u117b\u117c\u1189\u11af\u65a1ntersection;\u6293u\u0100bp\u118f\u119eset\u0100;E\u1197\u1198\u628fqual;\u6291erset\u0100;E\u11a8\u11a9\u6290qual;\u6292nion;\u6294cr;\uc000\ud835\udcaear;\u62c6\u0200bcmp\u11c8\u11db\u1209\u120b\u0100;s\u11cd\u11ce\u62d0et\u0100;E\u11cd\u11d5qual;\u6286\u0100ch\u11e0\u1205eeds\u0200;EST\u11ed\u11ee\u11f4\u11ff\u627bqual;\u6ab0lantEqual;\u627dilde;\u627fTh\xe1\u0f8c;\u6211\u0180;es\u1212\u1213\u1223\u62d1rset\u0100;E\u121c\u121d\u6283qual;\u6287et\xbb\u1213\u0580HRSacfhiors\u123e\u1244\u1249\u1255\u125e\u1271\u1276\u129f\u12c2\u12c8\u12d1ORN\u803b\xde\u40deADE;\u6122\u0100Hc\u124e\u1252cy;\u440by;\u4426\u0100bu\u125a\u125c;\u4009;\u43a4\u0180aey\u1265\u126a\u126fron;\u4164dil;\u4162;\u4422r;\uc000\ud835\udd17\u0100ei\u127b\u1289\u01f2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128e\u1298kSpace;\uc000\u205f\u200aSpace;\u6009lde\u0200;EFT\u12ab\u12ac\u12b2\u12bc\u623cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uc000\ud835\udd4bipleDot;\u60db\u0100ct\u12d6\u12dbr;\uc000\ud835\udcafrok;\u4166\u0ae1\u12f7\u130e\u131a\u1326\0\u132c\u1331\0\0\0\0\0\u1338\u133d\u1377\u1385\0\u13ff\u1404\u140a\u1410\u0100cr\u12fb\u1301ute\u803b\xda\u40dar\u0100;o\u1307\u1308\u619fcir;\u6949r\u01e3\u1313\0\u1316y;\u440eve;\u416c\u0100iy\u131e\u1323rc\u803b\xdb\u40db;\u4423blac;\u4170r;\uc000\ud835\udd18rave\u803b\xd9\u40d9acr;\u416a\u0100di\u1341\u1369er\u0100BP\u1348\u135d\u0100ar\u134d\u1350r;\u405fac\u0100ek\u1357\u1359;\u63dfet;\u63b5arenthesis;\u63ddon\u0100;P\u1370\u1371\u62c3lus;\u628e\u0100gp\u137b\u137fon;\u4172f;\uc000\ud835\udd4c\u0400ADETadps\u1395\u13ae\u13b8\u13c4\u03e8\u13d2\u13d7\u13f3rrow\u0180;BD\u1150\u13a0\u13a4ar;\u6912ownArrow;\u61c5ownArrow;\u6195quilibrium;\u696eee\u0100;A\u13cb\u13cc\u62a5rrow;\u61a5own\xe1\u03f3er\u0100LR\u13de\u13e8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13f9\u13fa\u43d2on;\u43a5ing;\u416ecr;\uc000\ud835\udcb0ilde;\u4168ml\u803b\xdc\u40dc\u0480Dbcdefosv\u1427\u142c\u1430\u1433\u143e\u1485\u148a\u1490\u1496ash;\u62abar;\u6aeby;\u4412ash\u0100;l\u143b\u143c\u62a9;\u6ae6\u0100er\u1443\u1445;\u62c1\u0180bty\u144c\u1450\u147aar;\u6016\u0100;i\u144f\u1455cal\u0200BLST\u1461\u1465\u146a\u1474ar;\u6223ine;\u407ceparator;\u6758ilde;\u6240ThinSpace;\u600ar;\uc000\ud835\udd19pf;\uc000\ud835\udd4dcr;\uc000\ud835\udcb1dash;\u62aa\u0280cefos\u14a7\u14ac\u14b1\u14b6\u14bcirc;\u4174dge;\u62c0r;\uc000\ud835\udd1apf;\uc000\ud835\udd4ecr;\uc000\ud835\udcb2\u0200fios\u14cb\u14d0\u14d2\u14d8r;\uc000\ud835\udd1b;\u439epf;\uc000\ud835\udd4fcr;\uc000\ud835\udcb3\u0480AIUacfosu\u14f1\u14f5\u14f9\u14fd\u1504\u150f\u1514\u151a\u1520cy;\u442fcy;\u4407cy;\u442ecute\u803b\xdd\u40dd\u0100iy\u1509\u150drc;\u4176;\u442br;\uc000\ud835\udd1cpf;\uc000\ud835\udd50cr;\uc000\ud835\udcb4ml;\u4178\u0400Hacdefos\u1535\u1539\u153f\u154b\u154f\u155d\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417d;\u4417ot;\u417b\u01f2\u1554\0\u155boWidt\xe8\u0ad9a;\u4396r;\u6128pf;\u6124cr;\uc000\ud835\udcb5\u0be1\u1583\u158a\u1590\0\u15b0\u15b6\u15bf\0\0\0\0\u15c6\u15db\u15eb\u165f\u166d\0\u1695\u169b\u16b2\u16b9\0\u16becute\u803b\xe1\u40e1reve;\u4103\u0300;Ediuy\u159c\u159d\u15a1\u15a3\u15a8\u15ad\u623e;\uc000\u223e\u0333;\u623frc\u803b\xe2\u40e2te\u80bb\xb4\u0306;\u4430lig\u803b\xe6\u40e6\u0100;r\xb2\u15ba;\uc000\ud835\udd1erave\u803b\xe0\u40e0\u0100ep\u15ca\u15d6\u0100fp\u15cf\u15d4sym;\u6135\xe8\u15d3ha;\u43b1\u0100ap\u15dfc\u0100cl\u15e4\u15e7r;\u4101g;\u6a3f\u0264\u15f0\0\0\u160a\u0280;adsv\u15fa\u15fb\u15ff\u1601\u1607\u6227nd;\u6a55;\u6a5clope;\u6a58;\u6a5a\u0380;elmrsz\u1618\u1619\u161b\u161e\u163f\u164f\u1659\u6220;\u69a4e\xbb\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163a\u163c\u163e;\u69a8;\u69a9;\u69aa;\u69ab;\u69ac;\u69ad;\u69ae;\u69aft\u0100;v\u1645\u1646\u621fb\u0100;d\u164c\u164d\u62be;\u699d\u0100pt\u1654\u1657h;\u6222\xbb\xb9arr;\u637c\u0100gp\u1663\u1667on;\u4105f;\uc000\ud835\udd52\u0380;Eaeiop\u12c1\u167b\u167d\u1682\u1684\u1687\u168a;\u6a70cir;\u6a6f;\u624ad;\u624bs;\u4027rox\u0100;e\u12c1\u1692\xf1\u1683ing\u803b\xe5\u40e5\u0180cty\u16a1\u16a6\u16a8r;\uc000\ud835\udcb6;\u402amp\u0100;e\u12c1\u16af\xf1\u0288ilde\u803b\xe3\u40e3ml\u803b\xe4\u40e4\u0100ci\u16c2\u16c8onin\xf4\u0272nt;\u6a11\u0800Nabcdefiklnoprsu\u16ed\u16f1\u1730\u173c\u1743\u1748\u1778\u177d\u17e0\u17e6\u1839\u1850\u170d\u193d\u1948\u1970ot;\u6aed\u0100cr\u16f6\u171ek\u0200ceps\u1700\u1705\u170d\u1713ong;\u624cpsilon;\u43f6rime;\u6035im\u0100;e\u171a\u171b\u623dq;\u62cd\u0176\u1722\u1726ee;\u62bded\u0100;g\u172c\u172d\u6305e\xbb\u172drk\u0100;t\u135c\u1737brk;\u63b6\u0100oy\u1701\u1741;\u4431quo;\u601e\u0280cmprt\u1753\u175b\u1761\u1764\u1768aus\u0100;e\u010a\u0109ptyv;\u69b0s\xe9\u170cno\xf5\u0113\u0180ahw\u176f\u1771\u1773;\u43b2;\u6136een;\u626cr;\uc000\ud835\udd1fg\u0380costuvw\u178d\u179d\u17b3\u17c1\u17d5\u17db\u17de\u0180aiu\u1794\u1796\u179a\xf0\u0760rc;\u65efp\xbb\u1371\u0180dpt\u17a4\u17a8\u17adot;\u6a00lus;\u6a01imes;\u6a02\u0271\u17b9\0\0\u17becup;\u6a06ar;\u6605riangle\u0100du\u17cd\u17d2own;\u65bdp;\u65b3plus;\u6a04e\xe5\u1444\xe5\u14adarow;\u690d\u0180ako\u17ed\u1826\u1835\u0100cn\u17f2\u1823k\u0180lst\u17fa\u05ab\u1802ozenge;\u69ebriangle\u0200;dlr\u1812\u1813\u1818\u181d\u65b4own;\u65beeft;\u65c2ight;\u65b8k;\u6423\u01b1\u182b\0\u1833\u01b2\u182f\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183e\u184d\u0100;q\u1843\u1846\uc000=\u20e5uiv;\uc000\u2261\u20e5t;\u6310\u0200ptwx\u1859\u185e\u1867\u186cf;\uc000\ud835\udd53\u0100;t\u13cb\u1863om\xbb\u13cctie;\u62c8\u0600DHUVbdhmptuv\u1885\u1896\u18aa\u18bb\u18d7\u18db\u18ec\u18ff\u1905\u190a\u1910\u1921\u0200LRlr\u188e\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18a1\u18a2\u18a4\u18a6\u18a8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18b3\u18b5\u18b7\u18b9;\u655d;\u655a;\u655c;\u6559\u0380;HLRhlr\u18ca\u18cb\u18cd\u18cf\u18d1\u18d3\u18d5\u6551;\u656c;\u6563;\u6560;\u656b;\u6562;\u655fox;\u69c9\u0200LRlr\u18e4\u18e6\u18e8\u18ea;\u6555;\u6552;\u6510;\u650c\u0280;DUdu\u06bd\u18f7\u18f9\u18fb\u18fd;\u6565;\u6568;\u652c;\u6534inus;\u629flus;\u629eimes;\u62a0\u0200LRlr\u1919\u191b\u191d\u191f;\u655b;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193b\u6502;\u656a;\u6561;\u655e;\u653c;\u6524;\u651c\u0100ev\u0123\u1942bar\u803b\xa6\u40a6\u0200ceio\u1951\u1956\u195a\u1960r;\uc000\ud835\udcb7mi;\u604fm\u0100;e\u171a\u171cl\u0180;bh\u1968\u1969\u196b\u405c;\u69c5sub;\u67c8\u016c\u1974\u197el\u0100;e\u1979\u197a\u6022t\xbb\u197ap\u0180;Ee\u012f\u1985\u1987;\u6aae\u0100;q\u06dc\u06db\u0ce1\u19a7\0\u19e8\u1a11\u1a15\u1a32\0\u1a37\u1a50\0\0\u1ab4\0\0\u1ac1\0\0\u1b21\u1b2e\u1b4d\u1b52\0\u1bfd\0\u1c0c\u0180cpr\u19ad\u19b2\u19ddute;\u4107\u0300;abcds\u19bf\u19c0\u19c4\u19ca\u19d5\u19d9\u6229nd;\u6a44rcup;\u6a49\u0100au\u19cf\u19d2p;\u6a4bp;\u6a47ot;\u6a40;\uc000\u2229\ufe00\u0100eo\u19e2\u19e5t;\u6041\xee\u0693\u0200aeiu\u19f0\u19fb\u1a01\u1a05\u01f0\u19f5\0\u19f8s;\u6a4don;\u410ddil\u803b\xe7\u40e7rc;\u4109ps\u0100;s\u1a0c\u1a0d\u6a4cm;\u6a50ot;\u410b\u0180dmn\u1a1b\u1a20\u1a26il\u80bb\xb8\u01adptyv;\u69b2t\u8100\xa2;e\u1a2d\u1a2e\u40a2r\xe4\u01b2r;\uc000\ud835\udd20\u0180cei\u1a3d\u1a40\u1a4dy;\u4447ck\u0100;m\u1a47\u1a48\u6713ark\xbb\u1a48;\u43c7r\u0380;Ecefms\u1a5f\u1a60\u1a62\u1a6b\u1aa4\u1aaa\u1aae\u65cb;\u69c3\u0180;el\u1a69\u1a6a\u1a6d\u42c6q;\u6257e\u0261\u1a74\0\0\u1a88rrow\u0100lr\u1a7c\u1a81eft;\u61baight;\u61bb\u0280RSacd\u1a92\u1a94\u1a96\u1a9a\u1a9f\xbb\u0f47;\u64c8st;\u629birc;\u629aash;\u629dnint;\u6a10id;\u6aefcir;\u69c2ubs\u0100;u\u1abb\u1abc\u6663it\xbb\u1abc\u02ec\u1ac7\u1ad4\u1afa\0\u1b0aon\u0100;e\u1acd\u1ace\u403a\u0100;q\xc7\xc6\u026d\u1ad9\0\0\u1ae2a\u0100;t\u1ade\u1adf\u402c;\u4040\u0180;fl\u1ae8\u1ae9\u1aeb\u6201\xee\u1160e\u0100mx\u1af1\u1af6ent\xbb\u1ae9e\xf3\u024d\u01e7\u1afe\0\u1b07\u0100;d\u12bb\u1b02ot;\u6a6dn\xf4\u0246\u0180fry\u1b10\u1b14\u1b17;\uc000\ud835\udd54o\xe4\u0254\u8100\xa9;s\u0155\u1b1dr;\u6117\u0100ao\u1b25\u1b29rr;\u61b5ss;\u6717\u0100cu\u1b32\u1b37r;\uc000\ud835\udcb8\u0100bp\u1b3c\u1b44\u0100;e\u1b41\u1b42\u6acf;\u6ad1\u0100;e\u1b49\u1b4a\u6ad0;\u6ad2dot;\u62ef\u0380delprvw\u1b60\u1b6c\u1b77\u1b82\u1bac\u1bd4\u1bf9arr\u0100lr\u1b68\u1b6a;\u6938;\u6935\u0270\u1b72\0\0\u1b75r;\u62dec;\u62dfarr\u0100;p\u1b7f\u1b80\u61b6;\u693d\u0300;bcdos\u1b8f\u1b90\u1b96\u1ba1\u1ba5\u1ba8\u622arcap;\u6a48\u0100au\u1b9b\u1b9ep;\u6a46p;\u6a4aot;\u628dr;\u6a45;\uc000\u222a\ufe00\u0200alrv\u1bb5\u1bbf\u1bde\u1be3rr\u0100;m\u1bbc\u1bbd\u61b7;\u693cy\u0180evw\u1bc7\u1bd4\u1bd8q\u0270\u1bce\0\0\u1bd2re\xe3\u1b73u\xe3\u1b75ee;\u62ceedge;\u62cfen\u803b\xa4\u40a4earrow\u0100lr\u1bee\u1bf3eft\xbb\u1b80ight\xbb\u1bbde\xe4\u1bdd\u0100ci\u1c01\u1c07onin\xf4\u01f7nt;\u6231lcty;\u632d\u0980AHabcdefhijlorstuwz\u1c38\u1c3b\u1c3f\u1c5d\u1c69\u1c75\u1c8a\u1c9e\u1cac\u1cb7\u1cfb\u1cff\u1d0d\u1d7b\u1d91\u1dab\u1dbb\u1dc6\u1dcdr\xf2\u0381ar;\u6965\u0200glrs\u1c48\u1c4d\u1c52\u1c54ger;\u6020eth;\u6138\xf2\u1133h\u0100;v\u1c5a\u1c5b\u6010\xbb\u090a\u016b\u1c61\u1c67arow;\u690fa\xe3\u0315\u0100ay\u1c6e\u1c73ron;\u410f;\u4434\u0180;ao\u0332\u1c7c\u1c84\u0100gr\u02bf\u1c81r;\u61catseq;\u6a77\u0180glm\u1c91\u1c94\u1c98\u803b\xb0\u40b0ta;\u43b4ptyv;\u69b1\u0100ir\u1ca3\u1ca8sht;\u697f;\uc000\ud835\udd21ar\u0100lr\u1cb3\u1cb5\xbb\u08dc\xbb\u101e\u0280aegsv\u1cc2\u0378\u1cd6\u1cdc\u1ce0m\u0180;os\u0326\u1cca\u1cd4nd\u0100;s\u0326\u1cd1uit;\u6666amma;\u43ddin;\u62f2\u0180;io\u1ce7\u1ce8\u1cf8\u40f7de\u8100\xf7;o\u1ce7\u1cf0ntimes;\u62c7n\xf8\u1cf7cy;\u4452c\u026f\u1d06\0\0\u1d0arn;\u631eop;\u630d\u0280lptuw\u1d18\u1d1d\u1d22\u1d49\u1d55lar;\u4024f;\uc000\ud835\udd55\u0280;emps\u030b\u1d2d\u1d37\u1d3d\u1d42q\u0100;d\u0352\u1d33ot;\u6251inus;\u6238lus;\u6214quare;\u62a1blebarwedg\xe5\xfan\u0180adh\u112e\u1d5d\u1d67ownarrow\xf3\u1c83arpoon\u0100lr\u1d72\u1d76ef\xf4\u1cb4igh\xf4\u1cb6\u0162\u1d7f\u1d85karo\xf7\u0f42\u026f\u1d8a\0\0\u1d8ern;\u631fop;\u630c\u0180cot\u1d98\u1da3\u1da6\u0100ry\u1d9d\u1da1;\uc000\ud835\udcb9;\u4455l;\u69f6rok;\u4111\u0100dr\u1db0\u1db4ot;\u62f1i\u0100;f\u1dba\u1816\u65bf\u0100ah\u1dc0\u1dc3r\xf2\u0429a\xf2\u0fa6angle;\u69a6\u0100ci\u1dd2\u1dd5y;\u445fgrarr;\u67ff\u0900Dacdefglmnopqrstux\u1e01\u1e09\u1e19\u1e38\u0578\u1e3c\u1e49\u1e61\u1e7e\u1ea5\u1eaf\u1ebd\u1ee1\u1f2a\u1f37\u1f44\u1f4e\u1f5a\u0100Do\u1e06\u1d34o\xf4\u1c89\u0100cs\u1e0e\u1e14ute\u803b\xe9\u40e9ter;\u6a6e\u0200aioy\u1e22\u1e27\u1e31\u1e36ron;\u411br\u0100;c\u1e2d\u1e2e\u6256\u803b\xea\u40ealon;\u6255;\u444dot;\u4117\u0100Dr\u1e41\u1e45ot;\u6252;\uc000\ud835\udd22\u0180;rs\u1e50\u1e51\u1e57\u6a9aave\u803b\xe8\u40e8\u0100;d\u1e5c\u1e5d\u6a96ot;\u6a98\u0200;ils\u1e6a\u1e6b\u1e72\u1e74\u6a99nters;\u63e7;\u6113\u0100;d\u1e79\u1e7a\u6a95ot;\u6a97\u0180aps\u1e85\u1e89\u1e97cr;\u4113ty\u0180;sv\u1e92\u1e93\u1e95\u6205et\xbb\u1e93p\u01001;\u1e9d\u1ea4\u0133\u1ea1\u1ea3;\u6004;\u6005\u6003\u0100gs\u1eaa\u1eac;\u414bp;\u6002\u0100gp\u1eb4\u1eb8on;\u4119f;\uc000\ud835\udd56\u0180als\u1ec4\u1ece\u1ed2r\u0100;s\u1eca\u1ecb\u62d5l;\u69e3us;\u6a71i\u0180;lv\u1eda\u1edb\u1edf\u43b5on\xbb\u1edb;\u43f5\u0200csuv\u1eea\u1ef3\u1f0b\u1f23\u0100io\u1eef\u1e31rc\xbb\u1e2e\u0269\u1ef9\0\0\u1efb\xed\u0548ant\u0100gl\u1f02\u1f06tr\xbb\u1e5dess\xbb\u1e7a\u0180aei\u1f12\u1f16\u1f1als;\u403dst;\u625fv\u0100;D\u0235\u1f20D;\u6a78parsl;\u69e5\u0100Da\u1f2f\u1f33ot;\u6253rr;\u6971\u0180cdi\u1f3e\u1f41\u1ef8r;\u612fo\xf4\u0352\u0100ah\u1f49\u1f4b;\u43b7\u803b\xf0\u40f0\u0100mr\u1f53\u1f57l\u803b\xeb\u40ebo;\u60ac\u0180cip\u1f61\u1f64\u1f67l;\u4021s\xf4\u056e\u0100eo\u1f6c\u1f74ctatio\xee\u0559nential\xe5\u0579\u09e1\u1f92\0\u1f9e\0\u1fa1\u1fa7\0\0\u1fc6\u1fcc\0\u1fd3\0\u1fe6\u1fea\u2000\0\u2008\u205allingdotse\xf1\u1e44y;\u4444male;\u6640\u0180ilr\u1fad\u1fb3\u1fc1lig;\u8000\ufb03\u0269\u1fb9\0\0\u1fbdg;\u8000\ufb00ig;\u8000\ufb04;\uc000\ud835\udd23lig;\u8000\ufb01lig;\uc000fj\u0180alt\u1fd9\u1fdc\u1fe1t;\u666dig;\u8000\ufb02ns;\u65b1of;\u4192\u01f0\u1fee\0\u1ff3f;\uc000\ud835\udd57\u0100ak\u05bf\u1ff7\u0100;v\u1ffc\u1ffd\u62d4;\u6ad9artint;\u6a0d\u0100ao\u200c\u2055\u0100cs\u2011\u2052\u03b1\u201a\u2030\u2038\u2045\u2048\0\u2050\u03b2\u2022\u2025\u2027\u202a\u202c\0\u202e\u803b\xbd\u40bd;\u6153\u803b\xbc\u40bc;\u6155;\u6159;\u615b\u01b3\u2034\0\u2036;\u6154;\u6156\u02b4\u203e\u2041\0\0\u2043\u803b\xbe\u40be;\u6157;\u615c5;\u6158\u01b6\u204c\0\u204e;\u615a;\u615d8;\u615el;\u6044wn;\u6322cr;\uc000\ud835\udcbb\u0880Eabcdefgijlnorstv\u2082\u2089\u209f\u20a5\u20b0\u20b4\u20f0\u20f5\u20fa\u20ff\u2103\u2112\u2138\u0317\u213e\u2152\u219e\u0100;l\u064d\u2087;\u6a8c\u0180cmp\u2090\u2095\u209dute;\u41f5ma\u0100;d\u209c\u1cda\u43b3;\u6a86reve;\u411f\u0100iy\u20aa\u20aerc;\u411d;\u4433ot;\u4121\u0200;lqs\u063e\u0642\u20bd\u20c9\u0180;qs\u063e\u064c\u20c4lan\xf4\u0665\u0200;cdl\u0665\u20d2\u20d5\u20e5c;\u6aa9ot\u0100;o\u20dc\u20dd\u6a80\u0100;l\u20e2\u20e3\u6a82;\u6a84\u0100;e\u20ea\u20ed\uc000\u22db\ufe00s;\u6a94r;\uc000\ud835\udd24\u0100;g\u0673\u061bmel;\u6137cy;\u4453\u0200;Eaj\u065a\u210c\u210e\u2110;\u6a92;\u6aa5;\u6aa4\u0200Eaes\u211b\u211d\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6a8arox\xbb\u2124\u0100;q\u212e\u212f\u6a88\u0100;q\u212e\u211bim;\u62e7pf;\uc000\ud835\udd58\u0100ci\u2143\u2146r;\u610am\u0180;el\u066b\u214e\u2150;\u6a8e;\u6a90\u8300>;cdlqr\u05ee\u2160\u216a\u216e\u2173\u2179\u0100ci\u2165\u2167;\u6aa7r;\u6a7aot;\u62d7Par;\u6995uest;\u6a7c\u0280adels\u2184\u216a\u2190\u0656\u219b\u01f0\u2189\0\u218epro\xf8\u209er;\u6978q\u0100lq\u063f\u2196les\xf3\u2088i\xed\u066b\u0100en\u21a3\u21adrtneqq;\uc000\u2269\ufe00\xc5\u21aa\u0500Aabcefkosy\u21c4\u21c7\u21f1\u21f5\u21fa\u2218\u221d\u222f\u2268\u227dr\xf2\u03a0\u0200ilmr\u21d0\u21d4\u21d7\u21dbrs\xf0\u1484f\xbb\u2024il\xf4\u06a9\u0100dr\u21e0\u21e4cy;\u444a\u0180;cw\u08f4\u21eb\u21efir;\u6948;\u61adar;\u610firc;\u4125\u0180alr\u2201\u220e\u2213rts\u0100;u\u2209\u220a\u6665it\xbb\u220alip;\u6026con;\u62b9r;\uc000\ud835\udd25s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223a\u223e\u2243\u225e\u2263rr;\u61fftht;\u623bk\u0100lr\u2249\u2253eftarrow;\u61a9ightarrow;\u61aaf;\uc000\ud835\udd59bar;\u6015\u0180clt\u226f\u2274\u2278r;\uc000\ud835\udcbdas\xe8\u21f4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xbb\u1c5b\u0ae1\u22a3\0\u22aa\0\u22b8\u22c5\u22ce\0\u22d5\u22f3\0\0\u22f8\u2322\u2367\u2362\u237f\0\u2386\u23aa\u23b4cute\u803b\xed\u40ed\u0180;iy\u0771\u22b0\u22b5rc\u803b\xee\u40ee;\u4438\u0100cx\u22bc\u22bfy;\u4435cl\u803b\xa1\u40a1\u0100fr\u039f\u22c9;\uc000\ud835\udd26rave\u803b\xec\u40ec\u0200;ino\u073e\u22dd\u22e9\u22ee\u0100in\u22e2\u22e6nt;\u6a0ct;\u622dfin;\u69dcta;\u6129lig;\u4133\u0180aop\u22fe\u231a\u231d\u0180cgt\u2305\u2308\u2317r;\u412b\u0180elp\u071f\u230f\u2313in\xe5\u078ear\xf4\u0720h;\u4131f;\u62b7ed;\u41b5\u0280;cfot\u04f4\u232c\u2331\u233d\u2341are;\u6105in\u0100;t\u2338\u2339\u621eie;\u69dddo\xf4\u2319\u0280;celp\u0757\u234c\u2350\u235b\u2361al;\u62ba\u0100gr\u2355\u2359er\xf3\u1563\xe3\u234darhk;\u6a17rod;\u6a3c\u0200cgpt\u236f\u2372\u2376\u237by;\u4451on;\u412ff;\uc000\ud835\udd5aa;\u43b9uest\u803b\xbf\u40bf\u0100ci\u238a\u238fr;\uc000\ud835\udcben\u0280;Edsv\u04f4\u239b\u239d\u23a1\u04f3;\u62f9ot;\u62f5\u0100;v\u23a6\u23a7\u62f4;\u62f3\u0100;i\u0777\u23aelde;\u4129\u01eb\u23b8\0\u23bccy;\u4456l\u803b\xef\u40ef\u0300cfmosu\u23cc\u23d7\u23dc\u23e1\u23e7\u23f5\u0100iy\u23d1\u23d5rc;\u4135;\u4439r;\uc000\ud835\udd27ath;\u4237pf;\uc000\ud835\udd5b\u01e3\u23ec\0\u23f1r;\uc000\ud835\udcbfrcy;\u4458kcy;\u4454\u0400acfghjos\u240b\u2416\u2422\u2427\u242d\u2431\u2435\u243bppa\u0100;v\u2413\u2414\u43ba;\u43f0\u0100ey\u241b\u2420dil;\u4137;\u443ar;\uc000\ud835\udd28reen;\u4138cy;\u4445cy;\u445cpf;\uc000\ud835\udd5ccr;\uc000\ud835\udcc0\u0b80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248d\u2491\u250e\u253d\u255a\u2580\u264e\u265e\u2665\u2679\u267d\u269a\u26b2\u26d8\u275d\u2768\u278b\u27c0\u2801\u2812\u0180art\u2477\u247a\u247cr\xf2\u09c6\xf2\u0395ail;\u691barr;\u690e\u0100;g\u0994\u248b;\u6a8bar;\u6962\u0963\u24a5\0\u24aa\0\u24b1\0\0\0\0\0\u24b5\u24ba\0\u24c6\u24c8\u24cd\0\u24f9ute;\u413amptyv;\u69b4ra\xee\u084cbda;\u43bbg\u0180;dl\u088e\u24c1\u24c3;\u6991\xe5\u088e;\u6a85uo\u803b\xab\u40abr\u0400;bfhlpst\u0899\u24de\u24e6\u24e9\u24eb\u24ee\u24f1\u24f5\u0100;f\u089d\u24e3s;\u691fs;\u691d\xeb\u2252p;\u61abl;\u6939im;\u6973l;\u61a2\u0180;ae\u24ff\u2500\u2504\u6aabil;\u6919\u0100;s\u2509\u250a\u6aad;\uc000\u2aad\ufe00\u0180abr\u2515\u2519\u251drr;\u690crk;\u6772\u0100ak\u2522\u252cc\u0100ek\u2528\u252a;\u407b;\u405b\u0100es\u2531\u2533;\u698bl\u0100du\u2539\u253b;\u698f;\u698d\u0200aeuy\u2546\u254b\u2556\u2558ron;\u413e\u0100di\u2550\u2554il;\u413c\xec\u08b0\xe2\u2529;\u443b\u0200cqrs\u2563\u2566\u256d\u257da;\u6936uo\u0100;r\u0e19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694bh;\u61b2\u0280;fgqs\u258b\u258c\u0989\u25f3\u25ff\u6264t\u0280ahlrt\u2598\u25a4\u25b7\u25c2\u25e8rrow\u0100;t\u0899\u25a1a\xe9\u24f6arpoon\u0100du\u25af\u25b4own\xbb\u045ap\xbb\u0966eftarrows;\u61c7ight\u0180ahs\u25cd\u25d6\u25derrow\u0100;s\u08f4\u08a7arpoon\xf3\u0f98quigarro\xf7\u21f0hreetimes;\u62cb\u0180;qs\u258b\u0993\u25falan\xf4\u09ac\u0280;cdgs\u09ac\u260a\u260d\u261d\u2628c;\u6aa8ot\u0100;o\u2614\u2615\u6a7f\u0100;r\u261a\u261b\u6a81;\u6a83\u0100;e\u2622\u2625\uc000\u22da\ufe00s;\u6a93\u0280adegs\u2633\u2639\u263d\u2649\u264bppro\xf8\u24c6ot;\u62d6q\u0100gq\u2643\u2645\xf4\u0989gt\xf2\u248c\xf4\u099bi\xed\u09b2\u0180ilr\u2655\u08e1\u265asht;\u697c;\uc000\ud835\udd29\u0100;E\u099c\u2663;\u6a91\u0161\u2669\u2676r\u0100du\u25b2\u266e\u0100;l\u0965\u2673;\u696alk;\u6584cy;\u4459\u0280;acht\u0a48\u2688\u268b\u2691\u2696r\xf2\u25c1orne\xf2\u1d08ard;\u696bri;\u65fa\u0100io\u269f\u26a4dot;\u4140ust\u0100;a\u26ac\u26ad\u63b0che\xbb\u26ad\u0200Eaes\u26bb\u26bd\u26c9\u26d4;\u6268p\u0100;p\u26c3\u26c4\u6a89rox\xbb\u26c4\u0100;q\u26ce\u26cf\u6a87\u0100;q\u26ce\u26bbim;\u62e6\u0400abnoptwz\u26e9\u26f4\u26f7\u271a\u272f\u2741\u2747\u2750\u0100nr\u26ee\u26f1g;\u67ecr;\u61fdr\xeb\u08c1g\u0180lmr\u26ff\u270d\u2714eft\u0100ar\u09e6\u2707ight\xe1\u09f2apsto;\u67fcight\xe1\u09fdparrow\u0100lr\u2725\u2729ef\xf4\u24edight;\u61ac\u0180afl\u2736\u2739\u273dr;\u6985;\uc000\ud835\udd5dus;\u6a2dimes;\u6a34\u0161\u274b\u274fst;\u6217\xe1\u134e\u0180;ef\u2757\u2758\u1800\u65cange\xbb\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277c\u2785\u2787r\xf2\u08a8orne\xf2\u1d8car\u0100;d\u0f98\u2783;\u696d;\u600eri;\u62bf\u0300achiqt\u2798\u279d\u0a40\u27a2\u27ae\u27bbquo;\u6039r;\uc000\ud835\udcc1m\u0180;eg\u09b2\u27aa\u27ac;\u6a8d;\u6a8f\u0100bu\u252a\u27b3o\u0100;r\u0e1f\u27b9;\u601arok;\u4142\u8400<;cdhilqr\u082b\u27d2\u2639\u27dc\u27e0\u27e5\u27ea\u27f0\u0100ci\u27d7\u27d9;\u6aa6r;\u6a79re\xe5\u25f2mes;\u62c9arr;\u6976uest;\u6a7b\u0100Pi\u27f5\u27f9ar;\u6996\u0180;ef\u2800\u092d\u181b\u65c3r\u0100du\u2807\u280dshar;\u694ahar;\u6966\u0100en\u2817\u2821rtneqq;\uc000\u2268\ufe00\xc5\u281e\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288e\u2893\u28a0\u28a5\u28a8\u28da\u28e2\u28e4\u0a83\u28f3\u2902Dot;\u623a\u0200clpr\u284e\u2852\u2863\u287dr\u803b\xaf\u40af\u0100et\u2857\u2859;\u6642\u0100;e\u285e\u285f\u6720se\xbb\u285f\u0100;s\u103b\u2868to\u0200;dlu\u103b\u2873\u2877\u287bow\xee\u048cef\xf4\u090f\xf0\u13d1ker;\u65ae\u0100oy\u2887\u288cmma;\u6a29;\u443cash;\u6014asuredangle\xbb\u1626r;\uc000\ud835\udd2ao;\u6127\u0180cdn\u28af\u28b4\u28c9ro\u803b\xb5\u40b5\u0200;acd\u1464\u28bd\u28c0\u28c4s\xf4\u16a7ir;\u6af0ot\u80bb\xb7\u01b5us\u0180;bd\u28d2\u1903\u28d3\u6212\u0100;u\u1d3c\u28d8;\u6a2a\u0163\u28de\u28e1p;\u6adb\xf2\u2212\xf0\u0a81\u0100dp\u28e9\u28eeels;\u62a7f;\uc000\ud835\udd5e\u0100ct\u28f8\u28fdr;\uc000\ud835\udcc2pos\xbb\u159d\u0180;lm\u2909\u290a\u290d\u43bctimap;\u62b8\u0c00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297e\u2989\u2998\u29da\u29e9\u2a15\u2a1a\u2a58\u2a5d\u2a83\u2a95\u2aa4\u2aa8\u2b04\u2b07\u2b44\u2b7f\u2bae\u2c34\u2c67\u2c7c\u2ce9\u0100gt\u2947\u294b;\uc000\u22d9\u0338\u0100;v\u2950\u0bcf\uc000\u226b\u20d2\u0180elt\u295a\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61cdightarrow;\u61ce;\uc000\u22d8\u0338\u0100;v\u297b\u0c47\uc000\u226a\u20d2ightarrow;\u61cf\u0100Dd\u298e\u2993ash;\u62afash;\u62ae\u0280bcnpt\u29a3\u29a7\u29ac\u29b1\u29ccla\xbb\u02deute;\u4144g;\uc000\u2220\u20d2\u0280;Eiop\u0d84\u29bc\u29c0\u29c5\u29c8;\uc000\u2a70\u0338d;\uc000\u224b\u0338s;\u4149ro\xf8\u0d84ur\u0100;a\u29d3\u29d4\u666el\u0100;s\u29d3\u0b38\u01f3\u29df\0\u29e3p\u80bb\xa0\u0b37mp\u0100;e\u0bf9\u0c00\u0280aeouy\u29f4\u29fe\u2a03\u2a10\u2a13\u01f0\u29f9\0\u29fb;\u6a43on;\u4148dil;\u4146ng\u0100;d\u0d7e\u2a0aot;\uc000\u2a6d\u0338p;\u6a42;\u443dash;\u6013\u0380;Aadqsx\u0b92\u2a29\u2a2d\u2a3b\u2a41\u2a45\u2a50rr;\u61d7r\u0100hr\u2a33\u2a36k;\u6924\u0100;o\u13f2\u13f0ot;\uc000\u2250\u0338ui\xf6\u0b63\u0100ei\u2a4a\u2a4ear;\u6928\xed\u0b98ist\u0100;s\u0ba0\u0b9fr;\uc000\ud835\udd2b\u0200Eest\u0bc5\u2a66\u2a79\u2a7c\u0180;qs\u0bbc\u2a6d\u0be1\u0180;qs\u0bbc\u0bc5\u2a74lan\xf4\u0be2i\xed\u0bea\u0100;r\u0bb6\u2a81\xbb\u0bb7\u0180Aap\u2a8a\u2a8d\u2a91r\xf2\u2971rr;\u61aear;\u6af2\u0180;sv\u0f8d\u2a9c\u0f8c\u0100;d\u2aa1\u2aa2\u62fc;\u62facy;\u445a\u0380AEadest\u2ab7\u2aba\u2abe\u2ac2\u2ac5\u2af6\u2af9r\xf2\u2966;\uc000\u2266\u0338rr;\u619ar;\u6025\u0200;fqs\u0c3b\u2ace\u2ae3\u2aeft\u0100ar\u2ad4\u2ad9rro\xf7\u2ac1ightarro\xf7\u2a90\u0180;qs\u0c3b\u2aba\u2aealan\xf4\u0c55\u0100;s\u0c55\u2af4\xbb\u0c36i\xed\u0c5d\u0100;r\u0c35\u2afei\u0100;e\u0c1a\u0c25i\xe4\u0d90\u0100pt\u2b0c\u2b11f;\uc000\ud835\udd5f\u8180\xac;in\u2b19\u2b1a\u2b36\u40acn\u0200;Edv\u0b89\u2b24\u2b28\u2b2e;\uc000\u22f9\u0338ot;\uc000\u22f5\u0338\u01e1\u0b89\u2b33\u2b35;\u62f7;\u62f6i\u0100;v\u0cb8\u2b3c\u01e1\u0cb8\u2b41\u2b43;\u62fe;\u62fd\u0180aor\u2b4b\u2b63\u2b69r\u0200;ast\u0b7b\u2b55\u2b5a\u2b5flle\xec\u0b7bl;\uc000\u2afd\u20e5;\uc000\u2202\u0338lint;\u6a14\u0180;ce\u0c92\u2b70\u2b73u\xe5\u0ca5\u0100;c\u0c98\u2b78\u0100;e\u0c92\u2b7d\xf1\u0c98\u0200Aait\u2b88\u2b8b\u2b9d\u2ba7r\xf2\u2988rr\u0180;cw\u2b94\u2b95\u2b99\u619b;\uc000\u2933\u0338;\uc000\u219d\u0338ghtarrow\xbb\u2b95ri\u0100;e\u0ccb\u0cd6\u0380chimpqu\u2bbd\u2bcd\u2bd9\u2b04\u0b78\u2be4\u2bef\u0200;cer\u0d32\u2bc6\u0d37\u2bc9u\xe5\u0d45;\uc000\ud835\udcc3ort\u026d\u2b05\0\0\u2bd6ar\xe1\u2b56m\u0100;e\u0d6e\u2bdf\u0100;q\u0d74\u0d73su\u0100bp\u2beb\u2bed\xe5\u0cf8\xe5\u0d0b\u0180bcp\u2bf6\u2c11\u2c19\u0200;Ees\u2bff\u2c00\u0d22\u2c04\u6284;\uc000\u2ac5\u0338et\u0100;e\u0d1b\u2c0bq\u0100;q\u0d23\u2c00c\u0100;e\u0d32\u2c17\xf1\u0d38\u0200;Ees\u2c22\u2c23\u0d5f\u2c27\u6285;\uc000\u2ac6\u0338et\u0100;e\u0d58\u2c2eq\u0100;q\u0d60\u2c23\u0200gilr\u2c3d\u2c3f\u2c45\u2c47\xec\u0bd7lde\u803b\xf1\u40f1\xe7\u0c43iangle\u0100lr\u2c52\u2c5ceft\u0100;e\u0c1a\u2c5a\xf1\u0c26ight\u0100;e\u0ccb\u2c65\xf1\u0cd7\u0100;m\u2c6c\u2c6d\u43bd\u0180;es\u2c74\u2c75\u2c79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2c8f\u2c94\u2c99\u2c9e\u2ca3\u2cb0\u2cb6\u2cd3\u2ce3ash;\u62adarr;\u6904p;\uc000\u224d\u20d2ash;\u62ac\u0100et\u2ca8\u2cac;\uc000\u2265\u20d2;\uc000>\u20d2nfin;\u69de\u0180Aet\u2cbd\u2cc1\u2cc5rr;\u6902;\uc000\u2264\u20d2\u0100;r\u2cca\u2ccd\uc000<\u20d2ie;\uc000\u22b4\u20d2\u0100At\u2cd8\u2cdcrr;\u6903rie;\uc000\u22b5\u20d2im;\uc000\u223c\u20d2\u0180Aan\u2cf0\u2cf4\u2d02rr;\u61d6r\u0100hr\u2cfa\u2cfdk;\u6923\u0100;o\u13e7\u13e5ear;\u6927\u1253\u1a95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2d2d\0\u2d38\u2d48\u2d60\u2d65\u2d72\u2d84\u1b07\0\0\u2d8d\u2dab\0\u2dc8\u2dce\0\u2ddc\u2e19\u2e2b\u2e3e\u2e43\u0100cs\u2d31\u1a97ute\u803b\xf3\u40f3\u0100iy\u2d3c\u2d45r\u0100;c\u1a9e\u2d42\u803b\xf4\u40f4;\u443e\u0280abios\u1aa0\u2d52\u2d57\u01c8\u2d5alac;\u4151v;\u6a38old;\u69bclig;\u4153\u0100cr\u2d69\u2d6dir;\u69bf;\uc000\ud835\udd2c\u036f\u2d79\0\0\u2d7c\0\u2d82n;\u42dbave\u803b\xf2\u40f2;\u69c1\u0100bm\u2d88\u0df4ar;\u69b5\u0200acit\u2d95\u2d98\u2da5\u2da8r\xf2\u1a80\u0100ir\u2d9d\u2da0r;\u69beoss;\u69bbn\xe5\u0e52;\u69c0\u0180aei\u2db1\u2db5\u2db9cr;\u414dga;\u43c9\u0180cdn\u2dc0\u2dc5\u01cdron;\u43bf;\u69b6pf;\uc000\ud835\udd60\u0180ael\u2dd4\u2dd7\u01d2r;\u69b7rp;\u69b9\u0380;adiosv\u2dea\u2deb\u2dee\u2e08\u2e0d\u2e10\u2e16\u6228r\xf2\u1a86\u0200;efm\u2df7\u2df8\u2e02\u2e05\u6a5dr\u0100;o\u2dfe\u2dff\u6134f\xbb\u2dff\u803b\xaa\u40aa\u803b\xba\u40bagof;\u62b6r;\u6a56lope;\u6a57;\u6a5b\u0180clo\u2e1f\u2e21\u2e27\xf2\u2e01ash\u803b\xf8\u40f8l;\u6298i\u016c\u2e2f\u2e34de\u803b\xf5\u40f5es\u0100;a\u01db\u2e3as;\u6a36ml\u803b\xf6\u40f6bar;\u633d\u0ae1\u2e5e\0\u2e7d\0\u2e80\u2e9d\0\u2ea2\u2eb9\0\0\u2ecb\u0e9c\0\u2f13\0\0\u2f2b\u2fbc\0\u2fc8r\u0200;ast\u0403\u2e67\u2e72\u0e85\u8100\xb6;l\u2e6d\u2e6e\u40b6le\xec\u0403\u0269\u2e78\0\0\u2e7bm;\u6af3;\u6afdy;\u443fr\u0280cimpt\u2e8b\u2e8f\u2e93\u1865\u2e97nt;\u4025od;\u402eil;\u6030enk;\u6031r;\uc000\ud835\udd2d\u0180imo\u2ea8\u2eb0\u2eb4\u0100;v\u2ead\u2eae\u43c6;\u43d5ma\xf4\u0a76ne;\u660e\u0180;tv\u2ebf\u2ec0\u2ec8\u43c0chfork\xbb\u1ffd;\u43d6\u0100au\u2ecf\u2edfn\u0100ck\u2ed5\u2eddk\u0100;h\u21f4\u2edb;\u610e\xf6\u21f4s\u0480;abcdemst\u2ef3\u2ef4\u1908\u2ef9\u2efd\u2f04\u2f06\u2f0a\u2f0e\u402bcir;\u6a23ir;\u6a22\u0100ou\u1d40\u2f02;\u6a25;\u6a72n\u80bb\xb1\u0e9dim;\u6a26wo;\u6a27\u0180ipu\u2f19\u2f20\u2f25ntint;\u6a15f;\uc000\ud835\udd61nd\u803b\xa3\u40a3\u0500;Eaceinosu\u0ec8\u2f3f\u2f41\u2f44\u2f47\u2f81\u2f89\u2f92\u2f7e\u2fb6;\u6ab3p;\u6ab7u\xe5\u0ed9\u0100;c\u0ece\u2f4c\u0300;acens\u0ec8\u2f59\u2f5f\u2f66\u2f68\u2f7eppro\xf8\u2f43urlye\xf1\u0ed9\xf1\u0ece\u0180aes\u2f6f\u2f76\u2f7approx;\u6ab9qq;\u6ab5im;\u62e8i\xed\u0edfme\u0100;s\u2f88\u0eae\u6032\u0180Eas\u2f78\u2f90\u2f7a\xf0\u2f75\u0180dfp\u0eec\u2f99\u2faf\u0180als\u2fa0\u2fa5\u2faalar;\u632eine;\u6312urf;\u6313\u0100;t\u0efb\u2fb4\xef\u0efbrel;\u62b0\u0100ci\u2fc0\u2fc5r;\uc000\ud835\udcc5;\u43c8ncsp;\u6008\u0300fiopsu\u2fda\u22e2\u2fdf\u2fe5\u2feb\u2ff1r;\uc000\ud835\udd2epf;\uc000\ud835\udd62rime;\u6057cr;\uc000\ud835\udcc6\u0180aeo\u2ff8\u3009\u3013t\u0100ei\u2ffe\u3005rnion\xf3\u06b0nt;\u6a16st\u0100;e\u3010\u3011\u403f\xf1\u1f19\xf4\u0f14\u0a80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30e0\u310e\u312b\u3147\u3162\u3172\u318e\u3206\u3215\u3224\u3229\u3258\u326e\u3272\u3290\u32b0\u32b7\u0180art\u3047\u304a\u304cr\xf2\u10b3\xf2\u03ddail;\u691car\xf2\u1c65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307f\u308f\u3094\u30cc\u0100eu\u306d\u3071;\uc000\u223d\u0331te;\u4155i\xe3\u116emptyv;\u69b3g\u0200;del\u0fd1\u3089\u308b\u308d;\u6992;\u69a5\xe5\u0fd1uo\u803b\xbb\u40bbr\u0580;abcfhlpstw\u0fdc\u30ac\u30af\u30b7\u30b9\u30bc\u30be\u30c0\u30c3\u30c7\u30cap;\u6975\u0100;f\u0fe0\u30b4s;\u6920;\u6933s;\u691e\xeb\u225d\xf0\u272el;\u6945im;\u6974l;\u61a3;\u619d\u0100ai\u30d1\u30d5il;\u691ao\u0100;n\u30db\u30dc\u6236al\xf3\u0f1e\u0180abr\u30e7\u30ea\u30eer\xf2\u17e5rk;\u6773\u0100ak\u30f3\u30fdc\u0100ek\u30f9\u30fb;\u407d;\u405d\u0100es\u3102\u3104;\u698cl\u0100du\u310a\u310c;\u698e;\u6990\u0200aeuy\u3117\u311c\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xec\u0ff2\xe2\u30fa;\u4440\u0200clqs\u3134\u3137\u313d\u3144a;\u6937dhar;\u6969uo\u0100;r\u020e\u020dh;\u61b3\u0180acg\u314e\u315f\u0f44l\u0200;ips\u0f78\u3158\u315b\u109cn\xe5\u10bbar\xf4\u0fa9t;\u65ad\u0180ilr\u3169\u1023\u316esht;\u697d;\uc000\ud835\udd2f\u0100ao\u3177\u3186r\u0100du\u317d\u317f\xbb\u047b\u0100;l\u1091\u3184;\u696c\u0100;v\u318b\u318c\u43c1;\u43f1\u0180gns\u3195\u31f9\u31fcht\u0300ahlrst\u31a4\u31b0\u31c2\u31d8\u31e4\u31eerrow\u0100;t\u0fdc\u31ada\xe9\u30c8arpoon\u0100du\u31bb\u31bfow\xee\u317ep\xbb\u1092eft\u0100ah\u31ca\u31d0rrow\xf3\u0feaarpoon\xf3\u0551ightarrows;\u61c9quigarro\xf7\u30cbhreetimes;\u62ccg;\u42daingdotse\xf1\u1f32\u0180ahm\u320d\u3210\u3213r\xf2\u0feaa\xf2\u0551;\u600foust\u0100;a\u321e\u321f\u63b1che\xbb\u321fmid;\u6aee\u0200abpt\u3232\u323d\u3240\u3252\u0100nr\u3237\u323ag;\u67edr;\u61fer\xeb\u1003\u0180afl\u3247\u324a\u324er;\u6986;\uc000\ud835\udd63us;\u6a2eimes;\u6a35\u0100ap\u325d\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6a12ar\xf2\u31e3\u0200achq\u327b\u3280\u10bc\u3285quo;\u603ar;\uc000\ud835\udcc7\u0100bu\u30fb\u328ao\u0100;r\u0214\u0213\u0180hir\u3297\u329b\u32a0re\xe5\u31f8mes;\u62cai\u0200;efl\u32aa\u1059\u1821\u32ab\u65b9tri;\u69celuhar;\u6968;\u611e\u0d61\u32d5\u32db\u32df\u332c\u3338\u3371\0\u337a\u33a4\0\0\u33ec\u33f0\0\u3428\u3448\u345a\u34ad\u34b1\u34ca\u34f1\0\u3616\0\0\u3633cute;\u415bqu\xef\u27ba\u0500;Eaceinpsy\u11ed\u32f3\u32f5\u32ff\u3302\u330b\u330f\u331f\u3326\u3329;\u6ab4\u01f0\u32fa\0\u32fc;\u6ab8on;\u4161u\xe5\u11fe\u0100;d\u11f3\u3307il;\u415frc;\u415d\u0180Eas\u3316\u3318\u331b;\u6ab6p;\u6abaim;\u62e9olint;\u6a13i\xed\u1204;\u4441ot\u0180;be\u3334\u1d47\u3335\u62c5;\u6a66\u0380Aacmstx\u3346\u334a\u3357\u335b\u335e\u3363\u336drr;\u61d8r\u0100hr\u3350\u3352\xeb\u2228\u0100;o\u0a36\u0a34t\u803b\xa7\u40a7i;\u403bwar;\u6929m\u0100in\u3369\xf0nu\xf3\xf1t;\u6736r\u0100;o\u3376\u2055\uc000\ud835\udd30\u0200acoy\u3382\u3386\u3391\u33a0rp;\u666f\u0100hy\u338b\u338fcy;\u4449;\u4448rt\u026d\u3399\0\0\u339ci\xe4\u1464ara\xec\u2e6f\u803b\xad\u40ad\u0100gm\u33a8\u33b4ma\u0180;fv\u33b1\u33b2\u33b2\u43c3;\u43c2\u0400;deglnpr\u12ab\u33c5\u33c9\u33ce\u33d6\u33de\u33e1\u33e6ot;\u6a6a\u0100;q\u12b1\u12b0\u0100;E\u33d3\u33d4\u6a9e;\u6aa0\u0100;E\u33db\u33dc\u6a9d;\u6a9fe;\u6246lus;\u6a24arr;\u6972ar\xf2\u113d\u0200aeit\u33f8\u3408\u340f\u3417\u0100ls\u33fd\u3404lsetm\xe9\u336ahp;\u6a33parsl;\u69e4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341c\u341d\u6aaa\u0100;s\u3422\u3423\u6aac;\uc000\u2aac\ufe00\u0180flp\u342e\u3433\u3442tcy;\u444c\u0100;b\u3438\u3439\u402f\u0100;a\u343e\u343f\u69c4r;\u633ff;\uc000\ud835\udd64a\u0100dr\u344d\u0402es\u0100;u\u3454\u3455\u6660it\xbb\u3455\u0180csu\u3460\u3479\u349f\u0100au\u3465\u346fp\u0100;s\u1188\u346b;\uc000\u2293\ufe00p\u0100;s\u11b4\u3475;\uc000\u2294\ufe00u\u0100bp\u347f\u348f\u0180;es\u1197\u119c\u3486et\u0100;e\u1197\u348d\xf1\u119d\u0180;es\u11a8\u11ad\u3496et\u0100;e\u11a8\u349d\xf1\u11ae\u0180;af\u117b\u34a6\u05b0r\u0165\u34ab\u05b1\xbb\u117car\xf2\u1148\u0200cemt\u34b9\u34be\u34c2\u34c5r;\uc000\ud835\udcc8tm\xee\xf1i\xec\u3415ar\xe6\u11be\u0100ar\u34ce\u34d5r\u0100;f\u34d4\u17bf\u6606\u0100an\u34da\u34edight\u0100ep\u34e3\u34eapsilo\xee\u1ee0h\xe9\u2eafs\xbb\u2852\u0280bcmnp\u34fb\u355e\u1209\u358b\u358e\u0480;Edemnprs\u350e\u350f\u3511\u3515\u351e\u3523\u352c\u3531\u3536\u6282;\u6ac5ot;\u6abd\u0100;d\u11da\u351aot;\u6ac3ult;\u6ac1\u0100Ee\u3528\u352a;\u6acb;\u628alus;\u6abfarr;\u6979\u0180eiu\u353d\u3552\u3555t\u0180;en\u350e\u3545\u354bq\u0100;q\u11da\u350feq\u0100;q\u352b\u3528m;\u6ac7\u0100bp\u355a\u355c;\u6ad5;\u6ad3c\u0300;acens\u11ed\u356c\u3572\u3579\u357b\u3326ppro\xf8\u32faurlye\xf1\u11fe\xf1\u11f3\u0180aes\u3582\u3588\u331bppro\xf8\u331aq\xf1\u3317g;\u666a\u0680123;Edehlmnps\u35a9\u35ac\u35af\u121c\u35b2\u35b4\u35c0\u35c9\u35d5\u35da\u35df\u35e8\u35ed\u803b\xb9\u40b9\u803b\xb2\u40b2\u803b\xb3\u40b3;\u6ac6\u0100os\u35b9\u35bct;\u6abeub;\u6ad8\u0100;d\u1222\u35c5ot;\u6ac4s\u0100ou\u35cf\u35d2l;\u67c9b;\u6ad7arr;\u697bult;\u6ac2\u0100Ee\u35e4\u35e6;\u6acc;\u628blus;\u6ac0\u0180eiu\u35f4\u3609\u360ct\u0180;en\u121c\u35fc\u3602q\u0100;q\u1222\u35b2eq\u0100;q\u35e7\u35e4m;\u6ac8\u0100bp\u3611\u3613;\u6ad4;\u6ad6\u0180Aan\u361c\u3620\u362drr;\u61d9r\u0100hr\u3626\u3628\xeb\u222e\u0100;o\u0a2b\u0a29war;\u692alig\u803b\xdf\u40df\u0be1\u3651\u365d\u3660\u12ce\u3673\u3679\0\u367e\u36c2\0\0\0\0\0\u36db\u3703\0\u3709\u376c\0\0\0\u3787\u0272\u3656\0\0\u365bget;\u6316;\u43c4r\xeb\u0e5f\u0180aey\u3666\u366b\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uc000\ud835\udd31\u0200eiko\u3686\u369d\u36b5\u36bc\u01f2\u368b\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369b\u43b8ym;\u43d1\u0100cn\u36a2\u36b2k\u0100as\u36a8\u36aeppro\xf8\u12c1im\xbb\u12acs\xf0\u129e\u0100as\u36ba\u36ae\xf0\u12c1rn\u803b\xfe\u40fe\u01ec\u031f\u36c6\u22e7es\u8180\xd7;bd\u36cf\u36d0\u36d8\u40d7\u0100;a\u190f\u36d5r;\u6a31;\u6a30\u0180eps\u36e1\u36e3\u3700\xe1\u2a4d\u0200;bcf\u0486\u36ec\u36f0\u36f4ot;\u6336ir;\u6af1\u0100;o\u36f9\u36fc\uc000\ud835\udd65rk;\u6ada\xe1\u3362rime;\u6034\u0180aip\u370f\u3712\u3764d\xe5\u1248\u0380adempst\u3721\u374d\u3740\u3751\u3757\u375c\u375fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65b5own\xbb\u1dbbeft\u0100;e\u2800\u373e\xf1\u092e;\u625cight\u0100;e\u32aa\u374b\xf1\u105aot;\u65ecinus;\u6a3alus;\u6a39b;\u69cdime;\u6a3bezium;\u63e2\u0180cht\u3772\u377d\u3781\u0100ry\u3777\u377b;\uc000\ud835\udcc9;\u4446cy;\u445brok;\u4167\u0100io\u378b\u378ex\xf4\u1777head\u0100lr\u3797\u37a0eftarro\xf7\u084fightarrow\xbb\u0f5d\u0900AHabcdfghlmoprstuw\u37d0\u37d3\u37d7\u37e4\u37f0\u37fc\u380e\u381c\u3823\u3834\u3851\u385d\u386b\u38a9\u38cc\u38d2\u38ea\u38f6r\xf2\u03edar;\u6963\u0100cr\u37dc\u37e2ute\u803b\xfa\u40fa\xf2\u1150r\u01e3\u37ea\0\u37edy;\u445eve;\u416d\u0100iy\u37f5\u37farc\u803b\xfb\u40fb;\u4443\u0180abh\u3803\u3806\u380br\xf2\u13adlac;\u4171a\xf2\u13c3\u0100ir\u3813\u3818sht;\u697e;\uc000\ud835\udd32rave\u803b\xf9\u40f9\u0161\u3827\u3831r\u0100lr\u382c\u382e\xbb\u0957\xbb\u1083lk;\u6580\u0100ct\u3839\u384d\u026f\u383f\0\0\u384arn\u0100;e\u3845\u3846\u631cr\xbb\u3846op;\u630fri;\u65f8\u0100al\u3856\u385acr;\u416b\u80bb\xa8\u0349\u0100gp\u3862\u3866on;\u4173f;\uc000\ud835\udd66\u0300adhlsu\u114b\u3878\u387d\u1372\u3891\u38a0own\xe1\u13b3arpoon\u0100lr\u3888\u388cef\xf4\u382digh\xf4\u382fi\u0180;hl\u3899\u389a\u389c\u43c5\xbb\u13faon\xbb\u389aparrows;\u61c8\u0180cit\u38b0\u38c4\u38c8\u026f\u38b6\0\0\u38c1rn\u0100;e\u38bc\u38bd\u631dr\xbb\u38bdop;\u630eng;\u416fri;\u65f9cr;\uc000\ud835\udcca\u0180dir\u38d9\u38dd\u38e2ot;\u62f0lde;\u4169i\u0100;f\u3730\u38e8\xbb\u1813\u0100am\u38ef\u38f2r\xf2\u38a8l\u803b\xfc\u40fcangle;\u69a7\u0780ABDacdeflnoprsz\u391c\u391f\u3929\u392d\u39b5\u39b8\u39bd\u39df\u39e4\u39e8\u39f3\u39f9\u39fd\u3a01\u3a20r\xf2\u03f7ar\u0100;v\u3926\u3927\u6ae8;\u6ae9as\xe8\u03e1\u0100nr\u3932\u3937grt;\u699c\u0380eknprst\u34e3\u3946\u394b\u3952\u395d\u3964\u3996app\xe1\u2415othin\xe7\u1e96\u0180hir\u34eb\u2ec8\u3959op\xf4\u2fb5\u0100;h\u13b7\u3962\xef\u318d\u0100iu\u3969\u396dgm\xe1\u33b3\u0100bp\u3972\u3984setneq\u0100;q\u397d\u3980\uc000\u228a\ufe00;\uc000\u2acb\ufe00setneq\u0100;q\u398f\u3992\uc000\u228b\ufe00;\uc000\u2acc\ufe00\u0100hr\u399b\u399fet\xe1\u369ciangle\u0100lr\u39aa\u39afeft\xbb\u0925ight\xbb\u1051y;\u4432ash\xbb\u1036\u0180elr\u39c4\u39d2\u39d7\u0180;be\u2dea\u39cb\u39cfar;\u62bbq;\u625alip;\u62ee\u0100bt\u39dc\u1468a\xf2\u1469r;\uc000\ud835\udd33tr\xe9\u39aesu\u0100bp\u39ef\u39f1\xbb\u0d1c\xbb\u0d59pf;\uc000\ud835\udd67ro\xf0\u0efbtr\xe9\u39b4\u0100cu\u3a06\u3a0br;\uc000\ud835\udccb\u0100bp\u3a10\u3a18n\u0100Ee\u3980\u3a16\xbb\u397en\u0100Ee\u3992\u3a1e\xbb\u3990igzag;\u699a\u0380cefoprs\u3a36\u3a3b\u3a56\u3a5b\u3a54\u3a61\u3a6airc;\u4175\u0100di\u3a40\u3a51\u0100bg\u3a45\u3a49ar;\u6a5fe\u0100;q\u15fa\u3a4f;\u6259erp;\u6118r;\uc000\ud835\udd34pf;\uc000\ud835\udd68\u0100;e\u1479\u3a66at\xe8\u1479cr;\uc000\ud835\udccc\u0ae3\u178e\u3a87\0\u3a8b\0\u3a90\u3a9b\0\0\u3a9d\u3aa8\u3aab\u3aaf\0\0\u3ac3\u3ace\0\u3ad8\u17dc\u17dftr\xe9\u17d1r;\uc000\ud835\udd35\u0100Aa\u3a94\u3a97r\xf2\u03c3r\xf2\u09f6;\u43be\u0100Aa\u3aa1\u3aa4r\xf2\u03b8r\xf2\u09eba\xf0\u2713is;\u62fb\u0180dpt\u17a4\u3ab5\u3abe\u0100fl\u3aba\u17a9;\uc000\ud835\udd69im\xe5\u17b2\u0100Aa\u3ac7\u3acar\xf2\u03cer\xf2\u0a01\u0100cq\u3ad2\u17b8r;\uc000\ud835\udccd\u0100pt\u17d6\u3adcr\xe9\u17d4\u0400acefiosu\u3af0\u3afd\u3b08\u3b0c\u3b11\u3b15\u3b1b\u3b21c\u0100uy\u3af6\u3afbte\u803b\xfd\u40fd;\u444f\u0100iy\u3b02\u3b06rc;\u4177;\u444bn\u803b\xa5\u40a5r;\uc000\ud835\udd36cy;\u4457pf;\uc000\ud835\udd6acr;\uc000\ud835\udcce\u0100cm\u3b26\u3b29y;\u444el\u803b\xff\u40ff\u0500acdefhiosw\u3b42\u3b48\u3b54\u3b58\u3b64\u3b69\u3b6d\u3b74\u3b7a\u3b80cute;\u417a\u0100ay\u3b4d\u3b52ron;\u417e;\u4437ot;\u417c\u0100et\u3b5d\u3b61tr\xe6\u155fa;\u43b6r;\uc000\ud835\udd37cy;\u4436grarr;\u61ddpf;\uc000\ud835\udd6bcr;\uc000\ud835\udccf\u0100jn\u3b85\u3b87;\u600dj;\u600c'
        .split('')
        .map(function (c) { return c.charCodeAt(0) }))
  }, {}],
  253: [function (require, module, exports) {
    'use strict'
    // Generated using scripts/write-decode-map.ts
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.default = new Uint16Array(
    // prettier-ignore
      '\u0200aglq\t\x15\x18\x1b\u026d\x0f\0\0\x12p;\u4026os;\u4027t;\u403et;\u403cuot;\u4022'
        .split('')
        .map(function (c) { return c.charCodeAt(0) }))
  }, {}],
  254: [function (require, module, exports) {
    'use strict'
    const __createBinding = (this && this.__createBinding) || (Object.create
      ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        let desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function () { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }
      : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
    const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create
      ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
      : function (o, v) {
        o.default = v
      })
    const __importStar = (this && this.__importStar) || function (mod) {
      if (mod && mod.__esModule) return mod
      const result = {}
      if (mod != null) for (const k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k)
      __setModuleDefault(result, mod)
      return result
    }
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.Parser = void 0
    const Tokenizer_js_1 = __importStar(require('./Tokenizer.js'))
    const decode_js_1 = require('entities/lib/decode.js')
    const formTags = new Set([
      'input',
      'option',
      'optgroup',
      'select',
      'button',
      'datalist',
      'textarea'
    ])
    const pTag = new Set(['p'])
    const tableSectionTags = new Set(['thead', 'tbody'])
    const ddtTags = new Set(['dd', 'dt'])
    const rtpTags = new Set(['rt', 'rp'])
    const openImpliesClose = new Map([
      ['tr', new Set(['tr', 'th', 'td'])],
      ['th', new Set(['th'])],
      ['td', new Set(['thead', 'th', 'td'])],
      ['body', new Set(['head', 'link', 'script'])],
      ['li', new Set(['li'])],
      ['p', pTag],
      ['h1', pTag],
      ['h2', pTag],
      ['h3', pTag],
      ['h4', pTag],
      ['h5', pTag],
      ['h6', pTag],
      ['select', formTags],
      ['input', formTags],
      ['output', formTags],
      ['button', formTags],
      ['datalist', formTags],
      ['textarea', formTags],
      ['option', new Set(['option'])],
      ['optgroup', new Set(['optgroup', 'option'])],
      ['dd', ddtTags],
      ['dt', ddtTags],
      ['address', pTag],
      ['article', pTag],
      ['aside', pTag],
      ['blockquote', pTag],
      ['details', pTag],
      ['div', pTag],
      ['dl', pTag],
      ['fieldset', pTag],
      ['figcaption', pTag],
      ['figure', pTag],
      ['footer', pTag],
      ['form', pTag],
      ['header', pTag],
      ['hr', pTag],
      ['main', pTag],
      ['nav', pTag],
      ['ol', pTag],
      ['pre', pTag],
      ['section', pTag],
      ['table', pTag],
      ['ul', pTag],
      ['rt', rtpTags],
      ['rp', rtpTags],
      ['tbody', tableSectionTags],
      ['tfoot', tableSectionTags]
    ])
    const voidElements = new Set([
      'area',
      'base',
      'basefont',
      'br',
      'col',
      'command',
      'embed',
      'frame',
      'hr',
      'img',
      'input',
      'isindex',
      'keygen',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr'
    ])
    const foreignContextElements = new Set(['math', 'svg'])
    const htmlIntegrationElements = new Set([
      'mi',
      'mo',
      'mn',
      'ms',
      'mtext',
      'annotation-xml',
      'foreignobject',
      'desc',
      'title'
    ])
    const reNameEnd = /\s|\//
    const Parser = /** @class */ (function () {
      function Parser (cbs, options) {
        if (options === void 0) { options = {} }
        let _a, _b, _c, _d, _e, _f
        this.options = options
        /** The start index of the last event. */
        this.startIndex = 0
        /** The end index of the last event. */
        this.endIndex = 0
        /**
         * Store the start index of the current open tag,
         * so we can update the start index for attributes.
         */
        this.openTagStart = 0
        this.tagname = ''
        this.attribname = ''
        this.attribvalue = ''
        this.attribs = null
        this.stack = []
        this.buffers = []
        this.bufferOffset = 0
        /** The index of the last written buffer. Used when resuming after a `pause()`. */
        this.writeIndex = 0
        /** Indicates whether the parser has finished running / `.end` has been called. */
        this.ended = false
        this.cbs = cbs !== null && cbs !== void 0 ? cbs : {}
        this.htmlMode = !this.options.xmlMode
        this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : this.htmlMode
        this.lowerCaseAttributeNames =
            (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : this.htmlMode
        this.recognizeSelfClosing =
            (_c = options.recognizeSelfClosing) !== null && _c !== void 0 ? _c : !this.htmlMode
        this.tokenizer = new ((_d = options.Tokenizer) !== null && _d !== void 0 ? _d : Tokenizer_js_1.default)(this.options, this)
        this.foreignContext = [!this.htmlMode];
        (_f = (_e = this.cbs).onparserinit) === null || _f === void 0 ? void 0 : _f.call(_e, this)
      }
      // Tokenizer event handlers
      /** @internal */
      Parser.prototype.ontext = function (start, endIndex) {
        let _a, _b
        const data = this.getSlice(start, endIndex)
        this.endIndex = endIndex - 1;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data)
        this.startIndex = endIndex
      }
      /** @internal */
      Parser.prototype.ontextentity = function (cp, endIndex) {
        let _a, _b
        this.endIndex = endIndex - 1;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, (0, decode_js_1.fromCodePoint)(cp))
        this.startIndex = endIndex
      }
      /**
     * Checks if the current tag is a void element. Override this if you want
     * to specify your own additional void elements.
     */
      Parser.prototype.isVoidElement = function (name) {
        return this.htmlMode && voidElements.has(name)
      }
      /** @internal */
      Parser.prototype.onopentagname = function (start, endIndex) {
        this.endIndex = endIndex
        let name = this.getSlice(start, endIndex)
        if (this.lowerCaseTagNames) {
          name = name.toLowerCase()
        }
        this.emitOpenTag(name)
      }
      Parser.prototype.emitOpenTag = function (name) {
        let _a, _b, _c, _d
        this.openTagStart = this.startIndex
        this.tagname = name
        const impliesClose = this.htmlMode && openImpliesClose.get(name)
        if (impliesClose) {
          while (this.stack.length > 0 && impliesClose.has(this.stack[0])) {
            const element = this.stack.shift();
            (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, element, true)
          }
        }
        if (!this.isVoidElement(name)) {
          this.stack.unshift(name)
          if (this.htmlMode) {
            if (foreignContextElements.has(name)) {
              this.foreignContext.unshift(true)
            } else if (htmlIntegrationElements.has(name)) {
              this.foreignContext.unshift(false)
            }
          }
        }
        (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name)
        if (this.cbs.onopentag) { this.attribs = {} }
      }
      Parser.prototype.endOpenTag = function (isImplied) {
        let _a, _b
        this.startIndex = this.openTagStart
        if (this.attribs) {
          (_b = (_a = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a, this.tagname, this.attribs, isImplied)
          this.attribs = null
        }
        if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
          this.cbs.onclosetag(this.tagname, true)
        }
        this.tagname = ''
      }
      /** @internal */
      Parser.prototype.onopentagend = function (endIndex) {
        this.endIndex = endIndex
        this.endOpenTag(false)
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1
      }
      /** @internal */
      Parser.prototype.onclosetag = function (start, endIndex) {
        let _a, _b, _c, _d, _e, _f, _g, _h
        this.endIndex = endIndex
        let name = this.getSlice(start, endIndex)
        if (this.lowerCaseTagNames) {
          name = name.toLowerCase()
        }
        if (this.htmlMode &&
            (foreignContextElements.has(name) ||
                htmlIntegrationElements.has(name))) {
          this.foreignContext.shift()
        }
        if (!this.isVoidElement(name)) {
          const pos = this.stack.indexOf(name)
          if (pos !== -1) {
            for (let index = 0; index <= pos; index++) {
              const element = this.stack.shift();
              // We know the stack has sufficient elements.
              (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, element, index !== pos)
            }
          } else if (this.htmlMode && name === 'p') {
          // Implicit open before close
            this.emitOpenTag('p')
            this.closeCurrentTag(true)
          }
        } else if (this.htmlMode && name === 'br') {
        // We can't use `emitOpenTag` for implicit open, as `br` would be implicitly closed.
          (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, 'br');
          (_f = (_e = this.cbs).onopentag) === null || _f === void 0 ? void 0 : _f.call(_e, 'br', {}, true);
          (_h = (_g = this.cbs).onclosetag) === null || _h === void 0 ? void 0 : _h.call(_g, 'br', false)
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1
      }
      /** @internal */
      Parser.prototype.onselfclosingtag = function (endIndex) {
        this.endIndex = endIndex
        if (this.recognizeSelfClosing || this.foreignContext[0]) {
          this.closeCurrentTag(false)
          // Set `startIndex` for next node
          this.startIndex = endIndex + 1
        } else {
        // Ignore the fact that the tag is self-closing.
          this.onopentagend(endIndex)
        }
      }
      Parser.prototype.closeCurrentTag = function (isOpenImplied) {
        let _a, _b
        const name = this.tagname
        this.endOpenTag(isOpenImplied)
        // Self-closing tags will be on the top of the stack
        if (this.stack[0] === name) {
        // If the opening tag isn't implied, the closing tag has to be implied.
          (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name, !isOpenImplied)
          this.stack.shift()
        }
      }
      /** @internal */
      Parser.prototype.onattribname = function (start, endIndex) {
        this.startIndex = start
        const name = this.getSlice(start, endIndex)
        this.attribname = this.lowerCaseAttributeNames
          ? name.toLowerCase()
          : name
      }
      /** @internal */
      Parser.prototype.onattribdata = function (start, endIndex) {
        this.attribvalue += this.getSlice(start, endIndex)
      }
      /** @internal */
      Parser.prototype.onattribentity = function (cp) {
        this.attribvalue += (0, decode_js_1.fromCodePoint)(cp)
      }
      /** @internal */
      Parser.prototype.onattribend = function (quote, endIndex) {
        let _a, _b
        this.endIndex = endIndex;
        (_b = (_a = this.cbs).onattribute) === null || _b === void 0
          ? void 0
          : _b.call(_a, this.attribname, this.attribvalue, quote === Tokenizer_js_1.QuoteType.Double
            ? '"'
            : quote === Tokenizer_js_1.QuoteType.Single
              ? "'"
              : quote === Tokenizer_js_1.QuoteType.NoValue
                ? undefined
                : null)
        if (this.attribs &&
            !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
          this.attribs[this.attribname] = this.attribvalue
        }
        this.attribvalue = ''
      }
      Parser.prototype.getInstructionName = function (value) {
        const index = value.search(reNameEnd)
        let name = index < 0 ? value : value.substr(0, index)
        if (this.lowerCaseTagNames) {
          name = name.toLowerCase()
        }
        return name
      }
      /** @internal */
      Parser.prototype.ondeclaration = function (start, endIndex) {
        this.endIndex = endIndex
        const value = this.getSlice(start, endIndex)
        if (this.cbs.onprocessinginstruction) {
          const name = this.getInstructionName(value)
          this.cbs.onprocessinginstruction('!'.concat(name), '!'.concat(value))
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1
      }
      /** @internal */
      Parser.prototype.onprocessinginstruction = function (start, endIndex) {
        this.endIndex = endIndex
        const value = this.getSlice(start, endIndex)
        if (this.cbs.onprocessinginstruction) {
          const name = this.getInstructionName(value)
          this.cbs.onprocessinginstruction('?'.concat(name), '?'.concat(value))
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1
      }
      /** @internal */
      Parser.prototype.oncomment = function (start, endIndex, offset) {
        let _a, _b, _c, _d
        this.endIndex = endIndex;
        (_b = (_a = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a, this.getSlice(start, endIndex - offset));
        (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c)
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1
      }
      /** @internal */
      Parser.prototype.oncdata = function (start, endIndex, offset) {
        let _a, _b, _c, _d, _e, _f, _g, _h, _j, _k
        this.endIndex = endIndex
        const value = this.getSlice(start, endIndex - offset)
        if (!this.htmlMode || this.options.recognizeCDATA) {
          (_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a);
          (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
          (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e)
        } else {
          (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, '[CDATA['.concat(value, ']]'));
          (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j)
        }
        // Set `startIndex` for next node
        this.startIndex = endIndex + 1
      }
      /** @internal */
      Parser.prototype.onend = function () {
        let _a, _b
        if (this.cbs.onclosetag) {
        // Set the end index for all remaining tags
          this.endIndex = this.startIndex
          for (let index = 0; index < this.stack.length; index++) {
            this.cbs.onclosetag(this.stack[index], true)
          }
        }
        (_b = (_a = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a)
      }
      /**
     * Resets the parser to a blank state, ready to parse a new HTML document
     */
      Parser.prototype.reset = function () {
        let _a, _b, _c, _d;
        (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a)
        this.tokenizer.reset()
        this.tagname = ''
        this.attribname = ''
        this.attribs = null
        this.stack.length = 0
        this.startIndex = 0
        this.endIndex = 0;
        (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this)
        this.buffers.length = 0
        this.foreignContext.length = 0
        this.foreignContext.unshift(!this.htmlMode)
        this.bufferOffset = 0
        this.writeIndex = 0
        this.ended = false
      }
      /**
     * Resets the parser, then parses a complete document and
     * pushes it to the handler.
     *
     * @param data Document to parse.
     */
      Parser.prototype.parseComplete = function (data) {
        this.reset()
        this.end(data)
      }
      Parser.prototype.getSlice = function (start, end) {
        while (start - this.bufferOffset >= this.buffers[0].length) {
          this.shiftBuffer()
        }
        let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset)
        while (end - this.bufferOffset > this.buffers[0].length) {
          this.shiftBuffer()
          slice += this.buffers[0].slice(0, end - this.bufferOffset)
        }
        return slice
      }
      Parser.prototype.shiftBuffer = function () {
        this.bufferOffset += this.buffers[0].length
        this.writeIndex--
        this.buffers.shift()
      }
      /**
     * Parses a chunk of data and calls the corresponding callbacks.
     *
     * @param chunk Chunk to parse.
     */
      Parser.prototype.write = function (chunk) {
        let _a, _b
        if (this.ended) {
          (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, new Error('.write() after done!'))
          return
        }
        this.buffers.push(chunk)
        if (this.tokenizer.running) {
          this.tokenizer.write(chunk)
          this.writeIndex++
        }
      }
      /**
     * Parses the end of the buffer and clears the stack, calls onend.
     *
     * @param chunk Optional final chunk to parse.
     */
      Parser.prototype.end = function (chunk) {
        let _a, _b
        if (this.ended) {
          (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, new Error('.end() after done!'))
          return
        }
        if (chunk) { this.write(chunk) }
        this.ended = true
        this.tokenizer.end()
      }
      /**
     * Pauses parsing. The parser won't emit events until `resume` is called.
     */
      Parser.prototype.pause = function () {
        this.tokenizer.pause()
      }
      /**
     * Resumes parsing after `pause` was called.
     */
      Parser.prototype.resume = function () {
        this.tokenizer.resume()
        while (this.tokenizer.running &&
            this.writeIndex < this.buffers.length) {
          this.tokenizer.write(this.buffers[this.writeIndex++])
        }
        if (this.ended) { this.tokenizer.end() }
      }
      /**
     * Alias of `write`, for backwards compatibility.
     *
     * @param chunk Chunk to parse.
     * @deprecated
     */
      Parser.prototype.parseChunk = function (chunk) {
        this.write(chunk)
      }
      /**
     * Alias of `end`, for backwards compatibility.
     *
     * @param chunk Optional final chunk to parse.
     * @deprecated
     */
      Parser.prototype.done = function (chunk) {
        this.end(chunk)
      }
      return Parser
    }())
    exports.Parser = Parser
  }, { './Tokenizer.js': 255, 'entities/lib/decode.js': 250 }],
  255: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.QuoteType = void 0
    const decode_js_1 = require('entities/lib/decode.js')
    let CharCodes;
    (function (CharCodes) {
      CharCodes[CharCodes.Tab = 9] = 'Tab'
      CharCodes[CharCodes.NewLine = 10] = 'NewLine'
      CharCodes[CharCodes.FormFeed = 12] = 'FormFeed'
      CharCodes[CharCodes.CarriageReturn = 13] = 'CarriageReturn'
      CharCodes[CharCodes.Space = 32] = 'Space'
      CharCodes[CharCodes.ExclamationMark = 33] = 'ExclamationMark'
      CharCodes[CharCodes.Number = 35] = 'Number'
      CharCodes[CharCodes.Amp = 38] = 'Amp'
      CharCodes[CharCodes.SingleQuote = 39] = 'SingleQuote'
      CharCodes[CharCodes.DoubleQuote = 34] = 'DoubleQuote'
      CharCodes[CharCodes.Dash = 45] = 'Dash'
      CharCodes[CharCodes.Slash = 47] = 'Slash'
      CharCodes[CharCodes.Zero = 48] = 'Zero'
      CharCodes[CharCodes.Nine = 57] = 'Nine'
      CharCodes[CharCodes.Semi = 59] = 'Semi'
      CharCodes[CharCodes.Lt = 60] = 'Lt'
      CharCodes[CharCodes.Eq = 61] = 'Eq'
      CharCodes[CharCodes.Gt = 62] = 'Gt'
      CharCodes[CharCodes.Questionmark = 63] = 'Questionmark'
      CharCodes[CharCodes.UpperA = 65] = 'UpperA'
      CharCodes[CharCodes.LowerA = 97] = 'LowerA'
      CharCodes[CharCodes.UpperF = 70] = 'UpperF'
      CharCodes[CharCodes.LowerF = 102] = 'LowerF'
      CharCodes[CharCodes.UpperZ = 90] = 'UpperZ'
      CharCodes[CharCodes.LowerZ = 122] = 'LowerZ'
      CharCodes[CharCodes.LowerX = 120] = 'LowerX'
      CharCodes[CharCodes.OpeningSquareBracket = 91] = 'OpeningSquareBracket'
    })(CharCodes || (CharCodes = {}))
    /** All the states the tokenizer can be in. */
    let State;
    (function (State) {
      State[State.Text = 1] = 'Text'
      State[State.BeforeTagName = 2] = 'BeforeTagName'
      State[State.InTagName = 3] = 'InTagName'
      State[State.InSelfClosingTag = 4] = 'InSelfClosingTag'
      State[State.BeforeClosingTagName = 5] = 'BeforeClosingTagName'
      State[State.InClosingTagName = 6] = 'InClosingTagName'
      State[State.AfterClosingTagName = 7] = 'AfterClosingTagName'
      // Attributes
      State[State.BeforeAttributeName = 8] = 'BeforeAttributeName'
      State[State.InAttributeName = 9] = 'InAttributeName'
      State[State.AfterAttributeName = 10] = 'AfterAttributeName'
      State[State.BeforeAttributeValue = 11] = 'BeforeAttributeValue'
      State[State.InAttributeValueDq = 12] = 'InAttributeValueDq'
      State[State.InAttributeValueSq = 13] = 'InAttributeValueSq'
      State[State.InAttributeValueNq = 14] = 'InAttributeValueNq'
      // Declarations
      State[State.BeforeDeclaration = 15] = 'BeforeDeclaration'
      State[State.InDeclaration = 16] = 'InDeclaration'
      // Processing instructions
      State[State.InProcessingInstruction = 17] = 'InProcessingInstruction'
      // Comments & CDATA
      State[State.BeforeComment = 18] = 'BeforeComment'
      State[State.CDATASequence = 19] = 'CDATASequence'
      State[State.InSpecialComment = 20] = 'InSpecialComment'
      State[State.InCommentLike = 21] = 'InCommentLike'
      // Special tags
      State[State.BeforeSpecialS = 22] = 'BeforeSpecialS'
      State[State.BeforeSpecialT = 23] = 'BeforeSpecialT'
      State[State.SpecialStartSequence = 24] = 'SpecialStartSequence'
      State[State.InSpecialTag = 25] = 'InSpecialTag'
      State[State.InEntity = 26] = 'InEntity'
    })(State || (State = {}))
    function isWhitespace (c) {
      return (c === CharCodes.Space ||
        c === CharCodes.NewLine ||
        c === CharCodes.Tab ||
        c === CharCodes.FormFeed ||
        c === CharCodes.CarriageReturn)
    }
    function isEndOfTagSection (c) {
      return c === CharCodes.Slash || c === CharCodes.Gt || isWhitespace(c)
    }
    function isASCIIAlpha (c) {
      return ((c >= CharCodes.LowerA && c <= CharCodes.LowerZ) ||
        (c >= CharCodes.UpperA && c <= CharCodes.UpperZ))
    }
    let QuoteType;
    (function (QuoteType) {
      QuoteType[QuoteType.NoValue = 0] = 'NoValue'
      QuoteType[QuoteType.Unquoted = 1] = 'Unquoted'
      QuoteType[QuoteType.Single = 2] = 'Single'
      QuoteType[QuoteType.Double = 3] = 'Double'
    })(QuoteType || (exports.QuoteType = QuoteType = {}))
    /**
 * Sequences used to match longer strings.
 *
 * We don't have `Script`, `Style`, or `Title` here. Instead, we re-use the *End
 * sequences with an increased offset.
 */
    const Sequences = {
      Cdata: new Uint8Array([0x43, 0x44, 0x41, 0x54, 0x41, 0x5b]), // CDATA[
      CdataEnd: new Uint8Array([0x5d, 0x5d, 0x3e]), // ]]>
      CommentEnd: new Uint8Array([0x2d, 0x2d, 0x3e]), // `-->`
      ScriptEnd: new Uint8Array([0x3c, 0x2f, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74]), // `</script`
      StyleEnd: new Uint8Array([0x3c, 0x2f, 0x73, 0x74, 0x79, 0x6c, 0x65]), // `</style`
      TitleEnd: new Uint8Array([0x3c, 0x2f, 0x74, 0x69, 0x74, 0x6c, 0x65]), // `</title`
      TextareaEnd: new Uint8Array([
        0x3c, 0x2f, 0x74, 0x65, 0x78, 0x74, 0x61, 0x72, 0x65, 0x61
      ]) // `</textarea`
    }
    const Tokenizer = /** @class */ (function () {
      function Tokenizer (_a, cbs) {
        const _b = _a.xmlMode; const xmlMode = _b === void 0 ? false : _b; const _c = _a.decodeEntities; const decodeEntities = _c === void 0 ? true : _c
        const _this = this
        this.cbs = cbs
        /** The current state the tokenizer is in. */
        this.state = State.Text
        /** The read buffer. */
        this.buffer = ''
        /** The beginning of the section that is currently being read. */
        this.sectionStart = 0
        /** The index within the buffer that we are currently looking at. */
        this.index = 0
        /** The start of the last entity. */
        this.entityStart = 0
        /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
        this.baseState = State.Text
        /** For special parsing behavior inside of script and style tags. */
        this.isSpecial = false
        /** Indicates whether the tokenizer has been paused. */
        this.running = true
        /** The offset of the current buffer. */
        this.offset = 0
        this.currentSequence = undefined
        this.sequenceIndex = 0
        this.xmlMode = xmlMode
        this.decodeEntities = decodeEntities
        this.entityDecoder = new decode_js_1.EntityDecoder(xmlMode ? decode_js_1.xmlDecodeTree : decode_js_1.htmlDecodeTree, function (cp, consumed) { return _this.emitCodePoint(cp, consumed) })
      }
      Tokenizer.prototype.reset = function () {
        this.state = State.Text
        this.buffer = ''
        this.sectionStart = 0
        this.index = 0
        this.baseState = State.Text
        this.currentSequence = undefined
        this.running = true
        this.offset = 0
      }
      Tokenizer.prototype.write = function (chunk) {
        this.offset += this.buffer.length
        this.buffer = chunk
        this.parse()
      }
      Tokenizer.prototype.end = function () {
        if (this.running) { this.finish() }
      }
      Tokenizer.prototype.pause = function () {
        this.running = false
      }
      Tokenizer.prototype.resume = function () {
        this.running = true
        if (this.index < this.buffer.length + this.offset) {
          this.parse()
        }
      }
      Tokenizer.prototype.stateText = function (c) {
        if (c === CharCodes.Lt ||
            (!this.decodeEntities && this.fastForwardTo(CharCodes.Lt))) {
          if (this.index > this.sectionStart) {
            this.cbs.ontext(this.sectionStart, this.index)
          }
          this.state = State.BeforeTagName
          this.sectionStart = this.index
        } else if (this.decodeEntities && c === CharCodes.Amp) {
          this.startEntity()
        }
      }
      Tokenizer.prototype.stateSpecialStartSequence = function (c) {
        const isEnd = this.sequenceIndex === this.currentSequence.length
        const isMatch = isEnd
          ? // If we are at the end of the sequence, make sure the tag name has ended
          isEndOfTagSection(c)
          : // Otherwise, do a case-insensitive comparison
            (c | 0x20) === this.currentSequence[this.sequenceIndex]
        if (!isMatch) {
          this.isSpecial = false
        } else if (!isEnd) {
          this.sequenceIndex++
          return
        }
        this.sequenceIndex = 0
        this.state = State.InTagName
        this.stateInTagName(c)
      }
      /** Look for an end tag. For <title> tags, also decode entities. */
      Tokenizer.prototype.stateInSpecialTag = function (c) {
        if (this.sequenceIndex === this.currentSequence.length) {
          if (c === CharCodes.Gt || isWhitespace(c)) {
            const endOfText = this.index - this.currentSequence.length
            if (this.sectionStart < endOfText) {
            // Spoof the index so that reported locations match up.
              const actualIndex = this.index
              this.index = endOfText
              this.cbs.ontext(this.sectionStart, endOfText)
              this.index = actualIndex
            }
            this.isSpecial = false
            this.sectionStart = endOfText + 2 // Skip over the `</`
            this.stateInClosingTagName(c)
            return // We are done; skip the rest of the function.
          }
          this.sequenceIndex = 0
        }
        if ((c | 0x20) === this.currentSequence[this.sequenceIndex]) {
          this.sequenceIndex += 1
        } else if (this.sequenceIndex === 0) {
          if (this.currentSequence === Sequences.TitleEnd) {
          // We have to parse entities in <title> tags.
            if (this.decodeEntities && c === CharCodes.Amp) {
              this.startEntity()
            }
          } else if (this.fastForwardTo(CharCodes.Lt)) {
          // Outside of <title> tags, we can fast-forward.
            this.sequenceIndex = 1
          }
        } else {
        // If we see a `<`, set the sequence index to 1; useful for eg. `<</script>`.
          this.sequenceIndex = Number(c === CharCodes.Lt)
        }
      }
      Tokenizer.prototype.stateCDATASequence = function (c) {
        if (c === Sequences.Cdata[this.sequenceIndex]) {
          if (++this.sequenceIndex === Sequences.Cdata.length) {
            this.state = State.InCommentLike
            this.currentSequence = Sequences.CdataEnd
            this.sequenceIndex = 0
            this.sectionStart = this.index + 1
          }
        } else {
          this.sequenceIndex = 0
          this.state = State.InDeclaration
          this.stateInDeclaration(c) // Reconsume the character
        }
      }
      /**
     * When we wait for one specific character, we can speed things up
     * by skipping through the buffer until we find it.
     *
     * @returns Whether the character was found.
     */
      Tokenizer.prototype.fastForwardTo = function (c) {
        while (++this.index < this.buffer.length + this.offset) {
          if (this.buffer.charCodeAt(this.index - this.offset) === c) {
            return true
          }
        }
        /*
         * We increment the index at the end of the `parse` loop,
         * so set it to `buffer.length - 1` here.
         *
         * TODO: Refactor `parse` to increment index before calling states.
         */
        this.index = this.buffer.length + this.offset - 1
        return false
      }
      /**
     * Comments and CDATA end with `-->` and `]]>`.
     *
     * Their common qualities are:
     * - Their end sequences have a distinct character they start with.
     * - That character is then repeated, so we have to check multiple repeats.
     * - All characters but the start character of the sequence can be skipped.
     */
      Tokenizer.prototype.stateInCommentLike = function (c) {
        if (c === this.currentSequence[this.sequenceIndex]) {
          if (++this.sequenceIndex === this.currentSequence.length) {
            if (this.currentSequence === Sequences.CdataEnd) {
              this.cbs.oncdata(this.sectionStart, this.index, 2)
            } else {
              this.cbs.oncomment(this.sectionStart, this.index, 2)
            }
            this.sequenceIndex = 0
            this.sectionStart = this.index + 1
            this.state = State.Text
          }
        } else if (this.sequenceIndex === 0) {
        // Fast-forward to the first character of the sequence
          if (this.fastForwardTo(this.currentSequence[0])) {
            this.sequenceIndex = 1
          }
        } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
        // Allow long sequences, eg. --->, ]]]>
          this.sequenceIndex = 0
        }
      }
      /**
     * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
     *
     * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
     * We allow anything that wouldn't end the tag.
     */
      Tokenizer.prototype.isTagStartChar = function (c) {
        return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c)
      }
      Tokenizer.prototype.startSpecial = function (sequence, offset) {
        this.isSpecial = true
        this.currentSequence = sequence
        this.sequenceIndex = offset
        this.state = State.SpecialStartSequence
      }
      Tokenizer.prototype.stateBeforeTagName = function (c) {
        if (c === CharCodes.ExclamationMark) {
          this.state = State.BeforeDeclaration
          this.sectionStart = this.index + 1
        } else if (c === CharCodes.Questionmark) {
          this.state = State.InProcessingInstruction
          this.sectionStart = this.index + 1
        } else if (this.isTagStartChar(c)) {
          const lower = c | 0x20
          this.sectionStart = this.index
          if (this.xmlMode) {
            this.state = State.InTagName
          } else if (lower === Sequences.ScriptEnd[2]) {
            this.state = State.BeforeSpecialS
          } else if (lower === Sequences.TitleEnd[2]) {
            this.state = State.BeforeSpecialT
          } else {
            this.state = State.InTagName
          }
        } else if (c === CharCodes.Slash) {
          this.state = State.BeforeClosingTagName
        } else {
          this.state = State.Text
          this.stateText(c)
        }
      }
      Tokenizer.prototype.stateInTagName = function (c) {
        if (isEndOfTagSection(c)) {
          this.cbs.onopentagname(this.sectionStart, this.index)
          this.sectionStart = -1
          this.state = State.BeforeAttributeName
          this.stateBeforeAttributeName(c)
        }
      }
      Tokenizer.prototype.stateBeforeClosingTagName = function (c) {
        if (isWhitespace(c)) {
        // Ignore
        } else if (c === CharCodes.Gt) {
          this.state = State.Text
        } else {
          this.state = this.isTagStartChar(c)
            ? State.InClosingTagName
            : State.InSpecialComment
          this.sectionStart = this.index
        }
      }
      Tokenizer.prototype.stateInClosingTagName = function (c) {
        if (c === CharCodes.Gt || isWhitespace(c)) {
          this.cbs.onclosetag(this.sectionStart, this.index)
          this.sectionStart = -1
          this.state = State.AfterClosingTagName
          this.stateAfterClosingTagName(c)
        }
      }
      Tokenizer.prototype.stateAfterClosingTagName = function (c) {
      // Skip everything until ">"
        if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
          this.state = State.Text
          this.sectionStart = this.index + 1
        }
      }
      Tokenizer.prototype.stateBeforeAttributeName = function (c) {
        if (c === CharCodes.Gt) {
          this.cbs.onopentagend(this.index)
          if (this.isSpecial) {
            this.state = State.InSpecialTag
            this.sequenceIndex = 0
          } else {
            this.state = State.Text
          }
          this.sectionStart = this.index + 1
        } else if (c === CharCodes.Slash) {
          this.state = State.InSelfClosingTag
        } else if (!isWhitespace(c)) {
          this.state = State.InAttributeName
          this.sectionStart = this.index
        }
      }
      Tokenizer.prototype.stateInSelfClosingTag = function (c) {
        if (c === CharCodes.Gt) {
          this.cbs.onselfclosingtag(this.index)
          this.state = State.Text
          this.sectionStart = this.index + 1
          this.isSpecial = false // Reset special state, in case of self-closing special tags
        } else if (!isWhitespace(c)) {
          this.state = State.BeforeAttributeName
          this.stateBeforeAttributeName(c)
        }
      }
      Tokenizer.prototype.stateInAttributeName = function (c) {
        if (c === CharCodes.Eq || isEndOfTagSection(c)) {
          this.cbs.onattribname(this.sectionStart, this.index)
          this.sectionStart = this.index
          this.state = State.AfterAttributeName
          this.stateAfterAttributeName(c)
        }
      }
      Tokenizer.prototype.stateAfterAttributeName = function (c) {
        if (c === CharCodes.Eq) {
          this.state = State.BeforeAttributeValue
        } else if (c === CharCodes.Slash || c === CharCodes.Gt) {
          this.cbs.onattribend(QuoteType.NoValue, this.sectionStart)
          this.sectionStart = -1
          this.state = State.BeforeAttributeName
          this.stateBeforeAttributeName(c)
        } else if (!isWhitespace(c)) {
          this.cbs.onattribend(QuoteType.NoValue, this.sectionStart)
          this.state = State.InAttributeName
          this.sectionStart = this.index
        }
      }
      Tokenizer.prototype.stateBeforeAttributeValue = function (c) {
        if (c === CharCodes.DoubleQuote) {
          this.state = State.InAttributeValueDq
          this.sectionStart = this.index + 1
        } else if (c === CharCodes.SingleQuote) {
          this.state = State.InAttributeValueSq
          this.sectionStart = this.index + 1
        } else if (!isWhitespace(c)) {
          this.sectionStart = this.index
          this.state = State.InAttributeValueNq
          this.stateInAttributeValueNoQuotes(c) // Reconsume token
        }
      }
      Tokenizer.prototype.handleInAttributeValue = function (c, quote) {
        if (c === quote ||
            (!this.decodeEntities && this.fastForwardTo(quote))) {
          this.cbs.onattribdata(this.sectionStart, this.index)
          this.sectionStart = -1
          this.cbs.onattribend(quote === CharCodes.DoubleQuote
            ? QuoteType.Double
            : QuoteType.Single, this.index + 1)
          this.state = State.BeforeAttributeName
        } else if (this.decodeEntities && c === CharCodes.Amp) {
          this.startEntity()
        }
      }
      Tokenizer.prototype.stateInAttributeValueDoubleQuotes = function (c) {
        this.handleInAttributeValue(c, CharCodes.DoubleQuote)
      }
      Tokenizer.prototype.stateInAttributeValueSingleQuotes = function (c) {
        this.handleInAttributeValue(c, CharCodes.SingleQuote)
      }
      Tokenizer.prototype.stateInAttributeValueNoQuotes = function (c) {
        if (isWhitespace(c) || c === CharCodes.Gt) {
          this.cbs.onattribdata(this.sectionStart, this.index)
          this.sectionStart = -1
          this.cbs.onattribend(QuoteType.Unquoted, this.index)
          this.state = State.BeforeAttributeName
          this.stateBeforeAttributeName(c)
        } else if (this.decodeEntities && c === CharCodes.Amp) {
          this.startEntity()
        }
      }
      Tokenizer.prototype.stateBeforeDeclaration = function (c) {
        if (c === CharCodes.OpeningSquareBracket) {
          this.state = State.CDATASequence
          this.sequenceIndex = 0
        } else {
          this.state =
                c === CharCodes.Dash
                  ? State.BeforeComment
                  : State.InDeclaration
        }
      }
      Tokenizer.prototype.stateInDeclaration = function (c) {
        if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
          this.cbs.ondeclaration(this.sectionStart, this.index)
          this.state = State.Text
          this.sectionStart = this.index + 1
        }
      }
      Tokenizer.prototype.stateInProcessingInstruction = function (c) {
        if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
          this.cbs.onprocessinginstruction(this.sectionStart, this.index)
          this.state = State.Text
          this.sectionStart = this.index + 1
        }
      }
      Tokenizer.prototype.stateBeforeComment = function (c) {
        if (c === CharCodes.Dash) {
          this.state = State.InCommentLike
          this.currentSequence = Sequences.CommentEnd
          // Allow short comments (eg. <!-->)
          this.sequenceIndex = 2
          this.sectionStart = this.index + 1
        } else {
          this.state = State.InDeclaration
        }
      }
      Tokenizer.prototype.stateInSpecialComment = function (c) {
        if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
          this.cbs.oncomment(this.sectionStart, this.index, 0)
          this.state = State.Text
          this.sectionStart = this.index + 1
        }
      }
      Tokenizer.prototype.stateBeforeSpecialS = function (c) {
        const lower = c | 0x20
        if (lower === Sequences.ScriptEnd[3]) {
          this.startSpecial(Sequences.ScriptEnd, 4)
        } else if (lower === Sequences.StyleEnd[3]) {
          this.startSpecial(Sequences.StyleEnd, 4)
        } else {
          this.state = State.InTagName
          this.stateInTagName(c) // Consume the token again
        }
      }
      Tokenizer.prototype.stateBeforeSpecialT = function (c) {
        const lower = c | 0x20
        if (lower === Sequences.TitleEnd[3]) {
          this.startSpecial(Sequences.TitleEnd, 4)
        } else if (lower === Sequences.TextareaEnd[3]) {
          this.startSpecial(Sequences.TextareaEnd, 4)
        } else {
          this.state = State.InTagName
          this.stateInTagName(c) // Consume the token again
        }
      }
      Tokenizer.prototype.startEntity = function () {
        this.baseState = this.state
        this.state = State.InEntity
        this.entityStart = this.index
        this.entityDecoder.startEntity(this.xmlMode
          ? decode_js_1.DecodingMode.Strict
          : this.baseState === State.Text ||
                this.baseState === State.InSpecialTag
            ? decode_js_1.DecodingMode.Legacy
            : decode_js_1.DecodingMode.Attribute)
      }
      Tokenizer.prototype.stateInEntity = function () {
        const length = this.entityDecoder.write(this.buffer, this.index - this.offset)
        // If `length` is positive, we are done with the entity.
        if (length >= 0) {
          this.state = this.baseState
          if (length === 0) {
            this.index = this.entityStart
          }
        } else {
        // Mark buffer as consumed.
          this.index = this.offset + this.buffer.length - 1
        }
      }
      /**
     * Remove data that has already been consumed from the buffer.
     */
      Tokenizer.prototype.cleanup = function () {
      // If we are inside of text or attributes, emit what we already have.
        if (this.running && this.sectionStart !== this.index) {
          if (this.state === State.Text ||
                (this.state === State.InSpecialTag && this.sequenceIndex === 0)) {
            this.cbs.ontext(this.sectionStart, this.index)
            this.sectionStart = this.index
          } else if (this.state === State.InAttributeValueDq ||
                this.state === State.InAttributeValueSq ||
                this.state === State.InAttributeValueNq) {
            this.cbs.onattribdata(this.sectionStart, this.index)
            this.sectionStart = this.index
          }
        }
      }
      Tokenizer.prototype.shouldContinue = function () {
        return this.index < this.buffer.length + this.offset && this.running
      }
      /**
     * Iterates through the buffer, calling the function corresponding to the current state.
     *
     * States that are more likely to be hit are higher up, as a performance improvement.
     */
      Tokenizer.prototype.parse = function () {
        while (this.shouldContinue()) {
          const c = this.buffer.charCodeAt(this.index - this.offset)
          switch (this.state) {
            case State.Text: {
              this.stateText(c)
              break
            }
            case State.SpecialStartSequence: {
              this.stateSpecialStartSequence(c)
              break
            }
            case State.InSpecialTag: {
              this.stateInSpecialTag(c)
              break
            }
            case State.CDATASequence: {
              this.stateCDATASequence(c)
              break
            }
            case State.InAttributeValueDq: {
              this.stateInAttributeValueDoubleQuotes(c)
              break
            }
            case State.InAttributeName: {
              this.stateInAttributeName(c)
              break
            }
            case State.InCommentLike: {
              this.stateInCommentLike(c)
              break
            }
            case State.InSpecialComment: {
              this.stateInSpecialComment(c)
              break
            }
            case State.BeforeAttributeName: {
              this.stateBeforeAttributeName(c)
              break
            }
            case State.InTagName: {
              this.stateInTagName(c)
              break
            }
            case State.InClosingTagName: {
              this.stateInClosingTagName(c)
              break
            }
            case State.BeforeTagName: {
              this.stateBeforeTagName(c)
              break
            }
            case State.AfterAttributeName: {
              this.stateAfterAttributeName(c)
              break
            }
            case State.InAttributeValueSq: {
              this.stateInAttributeValueSingleQuotes(c)
              break
            }
            case State.BeforeAttributeValue: {
              this.stateBeforeAttributeValue(c)
              break
            }
            case State.BeforeClosingTagName: {
              this.stateBeforeClosingTagName(c)
              break
            }
            case State.AfterClosingTagName: {
              this.stateAfterClosingTagName(c)
              break
            }
            case State.BeforeSpecialS: {
              this.stateBeforeSpecialS(c)
              break
            }
            case State.BeforeSpecialT: {
              this.stateBeforeSpecialT(c)
              break
            }
            case State.InAttributeValueNq: {
              this.stateInAttributeValueNoQuotes(c)
              break
            }
            case State.InSelfClosingTag: {
              this.stateInSelfClosingTag(c)
              break
            }
            case State.InDeclaration: {
              this.stateInDeclaration(c)
              break
            }
            case State.BeforeDeclaration: {
              this.stateBeforeDeclaration(c)
              break
            }
            case State.BeforeComment: {
              this.stateBeforeComment(c)
              break
            }
            case State.InProcessingInstruction: {
              this.stateInProcessingInstruction(c)
              break
            }
            case State.InEntity: {
              this.stateInEntity()
              break
            }
          }
          this.index++
        }
        this.cleanup()
      }
      Tokenizer.prototype.finish = function () {
        if (this.state === State.InEntity) {
          this.entityDecoder.end()
          this.state = this.baseState
        }
        this.handleTrailingData()
        this.cbs.onend()
      }
      /** Handle any trailing data. */
      Tokenizer.prototype.handleTrailingData = function () {
        const endIndex = this.buffer.length + this.offset
        // If there is no remaining data, we are done.
        if (this.sectionStart >= endIndex) {
          return
        }
        if (this.state === State.InCommentLike) {
          if (this.currentSequence === Sequences.CdataEnd) {
            this.cbs.oncdata(this.sectionStart, endIndex, 0)
          } else {
            this.cbs.oncomment(this.sectionStart, endIndex, 0)
          }
        } else if (this.state === State.InTagName ||
            this.state === State.BeforeAttributeName ||
            this.state === State.BeforeAttributeValue ||
            this.state === State.AfterAttributeName ||
            this.state === State.InAttributeName ||
            this.state === State.InAttributeValueSq ||
            this.state === State.InAttributeValueDq ||
            this.state === State.InAttributeValueNq ||
            this.state === State.InClosingTagName) {
        /*
             * If we are currently in an opening or closing tag, us not calling the
             * respective callback signals that the tag should be ignored.
             */
        } else {
          this.cbs.ontext(this.sectionStart, endIndex)
        }
      }
      Tokenizer.prototype.emitCodePoint = function (cp, consumed) {
        if (this.baseState !== State.Text &&
            this.baseState !== State.InSpecialTag) {
          if (this.sectionStart < this.entityStart) {
            this.cbs.onattribdata(this.sectionStart, this.entityStart)
          }
          this.sectionStart = this.entityStart + consumed
          this.index = this.sectionStart - 1
          this.cbs.onattribentity(cp)
        } else {
          if (this.sectionStart < this.entityStart) {
            this.cbs.ontext(this.sectionStart, this.entityStart)
          }
          this.sectionStart = this.entityStart + consumed
          this.index = this.sectionStart - 1
          this.cbs.ontextentity(cp, this.sectionStart)
        }
      }
      return Tokenizer
    }())
    exports.default = Tokenizer
  }, { 'entities/lib/decode.js': 250 }],
  256: [function (require, module, exports) {
    'use strict'
    const __createBinding = (this && this.__createBinding) || (Object.create
      ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        let desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function () { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }
      : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
    const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create
      ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
      : function (o, v) {
        o.default = v
      })
    const __importStar = (this && this.__importStar) || function (mod) {
      if (mod && mod.__esModule) return mod
      const result = {}
      if (mod != null) for (const k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k)
      __setModuleDefault(result, mod)
      return result
    }
    const __importDefault = (this && this.__importDefault) || function (mod) {
      return (mod && mod.__esModule) ? mod : { default: mod }
    }
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.DomUtils = exports.parseFeed = exports.getFeed = exports.ElementType = exports.QuoteType = exports.Tokenizer = exports.createDomStream = exports.createDocumentStream = exports.parseDOM = exports.parseDocument = exports.DefaultHandler = exports.DomHandler = exports.Parser = void 0
    const Parser_js_1 = require('./Parser.js')
    const Parser_js_2 = require('./Parser.js')
    Object.defineProperty(exports, 'Parser', { enumerable: true, get: function () { return Parser_js_2.Parser } })
    const domhandler_1 = require('domhandler')
    const domhandler_2 = require('domhandler')
    Object.defineProperty(exports, 'DomHandler', { enumerable: true, get: function () { return domhandler_2.DomHandler } })
    // Old name for DomHandler
    Object.defineProperty(exports, 'DefaultHandler', { enumerable: true, get: function () { return domhandler_2.DomHandler } })
    // Helper methods
    /**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM handler.
 */
    function parseDocument (data, options) {
      const handler = new domhandler_1.DomHandler(undefined, options)
      new Parser_js_1.Parser(handler, options).end(data)
      return handler.root
    }
    exports.parseDocument = parseDocument
    /**
 * Parses data, returns an array of the root nodes.
 *
 * Note that the root nodes still have a `Document` node as their parent.
 * Use `parseDocument` to get the `Document` node instead.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM handler.
 * @deprecated Use `parseDocument` instead.
 */
    function parseDOM (data, options) {
      return parseDocument(data, options).children
    }
    exports.parseDOM = parseDOM
    /**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param callback A callback that will be called once parsing has been completed, with the resulting document.
 * @param options Optional options for the parser and DOM handler.
 * @param elementCallback An optional callback that will be called every time a tag has been completed inside of the DOM.
 */
    function createDocumentStream (callback, options, elementCallback) {
      var handler = new domhandler_1.DomHandler(function (error) { return callback(error, handler.root) }, options, elementCallback)
      return new Parser_js_1.Parser(handler, options)
    }
    exports.createDocumentStream = createDocumentStream
    /**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param callback A callback that will be called once parsing has been completed, with an array of root nodes.
 * @param options Optional options for the parser and DOM handler.
 * @param elementCallback An optional callback that will be called every time a tag has been completed inside of the DOM.
 * @deprecated Use `createDocumentStream` instead.
 */
    function createDomStream (callback, options, elementCallback) {
      const handler = new domhandler_1.DomHandler(callback, options, elementCallback)
      return new Parser_js_1.Parser(handler, options)
    }
    exports.createDomStream = createDomStream
    const Tokenizer_js_1 = require('./Tokenizer.js')
    Object.defineProperty(exports, 'Tokenizer', { enumerable: true, get: function () { return __importDefault(Tokenizer_js_1).default } })
    Object.defineProperty(exports, 'QuoteType', { enumerable: true, get: function () { return Tokenizer_js_1.QuoteType } })
    /*
 * All of the following exports exist for backwards-compatibility.
 * They should probably be removed eventually.
 */
    exports.ElementType = __importStar(require('domelementtype'))
    const domutils_1 = require('domutils')
    const domutils_2 = require('domutils')
    Object.defineProperty(exports, 'getFeed', { enumerable: true, get: function () { return domutils_2.getFeed } })
    const parseFeedDefaultOptions = { xmlMode: true }
    /**
 * Parse a feed.
 *
 * @param feed The feed that should be parsed, as a string.
 * @param options Optionally, options for parsing. When using this, you should set `xmlMode` to `true`.
 */
    function parseFeed (feed, options) {
      if (options === void 0) { options = parseFeedDefaultOptions }
      return (0, domutils_1.getFeed)(parseDOM(feed, options))
    }
    exports.parseFeed = parseFeed
    exports.DomUtils = __importStar(require('domutils'))
  }, { './Parser.js': 254, './Tokenizer.js': 255, domelementtype: 249, domhandler: 45, domutils: 45 }],
  257: [function (require, module, exports) {
    'use strict'
    const __importDefault = (this && this.__importDefault) || function (mod) {
      return (mod && mod.__esModule) ? mod : { default: mod }
    }
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.generate = exports.compile = void 0
    const boolbase_1 = __importDefault(require('boolbase'))
    /**
 * Returns a function that checks if an elements index matches the given rule
 * highly optimized to return the fastest solution.
 *
 * @param parsed A tuple [a, b], as returned by `parse`.
 * @returns A highly optimized function that returns whether an index matches the nth-check.
 * @example
 *
 * ```js
 * const check = nthCheck.compile([2, 3]);
 *
 * check(0); // `false`
 * check(1); // `false`
 * check(2); // `true`
 * check(3); // `false`
 * check(4); // `true`
 * check(5); // `false`
 * check(6); // `true`
 * ```
 */
    function compile (parsed) {
      const a = parsed[0]
      // Subtract 1 from `b`, to convert from one- to zero-indexed.
      const b = parsed[1] - 1
      /*
     * When `b <= 0`, `a * n` won't be lead to any matches for `a < 0`.
     * Besides, the specification states that no elements are
     * matched when `a` and `b` are 0.
     *
     * `b < 0` here as we subtracted 1 from `b` above.
     */
      if (b < 0 && a <= 0) { return boolbase_1.default.falseFunc }
      // When `a` is in the range -1..1, it matches any element (so only `b` is checked).
      if (a === -1) { return function (index) { return index <= b } }
      if (a === 0) { return function (index) { return index === b } }
      // When `b <= 0` and `a === 1`, they match any element.
      if (a === 1) { return b < 0 ? boolbase_1.default.trueFunc : function (index) { return index >= b } }
      /*
     * Otherwise, modulo can be used to check if there is a match.
     *
     * Modulo doesn't care about the sign, so let's use `a`s absolute value.
     */
      const absA = Math.abs(a)
      // Get `b mod a`, + a if this is negative.
      const bMod = ((b % absA) + absA) % absA
      return a > 1
        ? function (index) { return index >= b && index % absA === bMod }
        : function (index) { return index <= b && index % absA === bMod }
    }
    exports.compile = compile
    /**
 * Returns a function that produces a monotonously increasing sequence of indices.
 *
 * If the sequence has an end, the returned function will return `null` after
 * the last index in the sequence.
 *
 * @param parsed A tuple [a, b], as returned by `parse`.
 * @returns A function that produces a sequence of indices.
 * @example <caption>Always increasing (2n+3)</caption>
 *
 * ```js
 * const gen = nthCheck.generate([2, 3])
 *
 * gen() // `1`
 * gen() // `3`
 * gen() // `5`
 * gen() // `8`
 * gen() // `11`
 * ```
 *
 * @example <caption>With end value (-2n+10)</caption>
 *
 * ```js
 *
 * const gen = nthCheck.generate([-2, 5]);
 *
 * gen() // 0
 * gen() // 2
 * gen() // 4
 * gen() // null
 * ```
 */
    function generate (parsed) {
      const a = parsed[0]
      // Subtract 1 from `b`, to convert from one- to zero-indexed.
      let b = parsed[1] - 1
      let n = 0
      // Make sure to always return an increasing sequence
      if (a < 0) {
        const aPos_1 = -a
        // Get `b mod a`
        const minValue_1 = ((b % aPos_1) + aPos_1) % aPos_1
        return function () {
          const val = minValue_1 + aPos_1 * n++
          return val > b ? null : val
        }
      }
      if (a === 0) {
        return b < 0
          ? // There are no result — always return `null`
          function () { return null }
          : // Return `b` exactly once
          function () { return (n++ === 0 ? b : null) }
      }
      if (b < 0) {
        b += a * Math.ceil(-b / a)
      }
      return function () { return a * n++ + b }
    }
    exports.generate = generate
  }, { boolbase: 43 }],
  258: [function (require, module, exports) {
    'use strict'
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.sequence = exports.generate = exports.compile = exports.parse = void 0
    const parse_js_1 = require('./parse.js')
    Object.defineProperty(exports, 'parse', { enumerable: true, get: function () { return parse_js_1.parse } })
    const compile_js_1 = require('./compile.js')
    Object.defineProperty(exports, 'compile', { enumerable: true, get: function () { return compile_js_1.compile } })
    Object.defineProperty(exports, 'generate', { enumerable: true, get: function () { return compile_js_1.generate } })
    /**
 * Parses and compiles a formula to a highly optimized function.
 * Combination of {@link parse} and {@link compile}.
 *
 * If the formula doesn't match any elements,
 * it returns [`boolbase`](https://github.com/fb55/boolbase)'s `falseFunc`.
 * Otherwise, a function accepting an _index_ is returned, which returns
 * whether or not the passed _index_ matches the formula.
 *
 * Note: The nth-rule starts counting at `1`, the returned function at `0`.
 *
 * @param formula The formula to compile.
 * @example
 * const check = nthCheck("2n+3");
 *
 * check(0); // `false`
 * check(1); // `false`
 * check(2); // `true`
 * check(3); // `false`
 * check(4); // `true`
 * check(5); // `false`
 * check(6); // `true`
 */
    function nthCheck (formula) {
      return (0, compile_js_1.compile)((0, parse_js_1.parse)(formula))
    }
    exports.default = nthCheck
    /**
 * Parses and compiles a formula to a generator that produces a sequence of indices.
 * Combination of {@link parse} and {@link generate}.
 *
 * @param formula The formula to compile.
 * @returns A function that produces a sequence of indices.
 * @example <caption>Always increasing</caption>
 *
 * ```js
 * const gen = nthCheck.sequence('2n+3')
 *
 * gen() // `1`
 * gen() // `3`
 * gen() // `5`
 * gen() // `8`
 * gen() // `11`
 * ```
 *
 * @example <caption>With end value</caption>
 *
 * ```js
 *
 * const gen = nthCheck.sequence('-2n+5');
 *
 * gen() // 0
 * gen() // 2
 * gen() // 4
 * gen() // null
 * ```
 */
    function sequence (formula) {
      return (0, compile_js_1.generate)((0, parse_js_1.parse)(formula))
    }
    exports.sequence = sequence
  }, { './compile.js': 257, './parse.js': 259 }],
  259: [function (require, module, exports) {
    'use strict'
    // Following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
    Object.defineProperty(exports, '__esModule', { value: true })
    exports.parse = void 0
    // Whitespace as per https://www.w3.org/TR/selectors-3/#lex is " \t\r\n\f"
    const whitespace = new Set([9, 10, 12, 13, 32])
    const ZERO = '0'.charCodeAt(0)
    const NINE = '9'.charCodeAt(0)
    /**
 * Parses an expression.
 *
 * @throws An `Error` if parsing fails.
 * @returns An array containing the integer step size and the integer offset of the nth rule.
 * @example nthCheck.parse("2n+3"); // returns [2, 3]
 */
    function parse (formula) {
      formula = formula.trim().toLowerCase()
      if (formula === 'even') {
        return [2, 0]
      } else if (formula === 'odd') {
        return [2, 1]
      }
      // Parse [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?
      let idx = 0
      let a = 0
      let sign = readSign()
      let number = readNumber()
      if (idx < formula.length && formula.charAt(idx) === 'n') {
        idx++
        a = sign * (number !== null && number !== void 0 ? number : 1)
        skipWhitespace()
        if (idx < formula.length) {
          sign = readSign()
          skipWhitespace()
          number = readNumber()
        } else {
          sign = number = 0
        }
      }
      // Throw if there is anything else
      if (number === null || idx < formula.length) {
        throw new Error("n-th rule couldn't be parsed ('".concat(formula, "')"))
      }
      return [a, sign * number]
      function readSign () {
        if (formula.charAt(idx) === '-') {
          idx++
          return -1
        }
        if (formula.charAt(idx) === '+') {
          idx++
        }
        return 1
      }
      function readNumber () {
        const start = idx
        let value = 0
        while (idx < formula.length &&
            formula.charCodeAt(idx) >= ZERO &&
            formula.charCodeAt(idx) <= NINE) {
          value = value * 10 + (formula.charCodeAt(idx) - ZERO)
          idx++
        }
        // Return `null` if we didn't read anything.
        return idx === start ? null : value
      }
      function skipWhitespace () {
        while (idx < formula.length &&
            whitespace.has(formula.charCodeAt(idx))) {
          idx++
        }
      }
    }
    exports.parse = parse
  }, {}],
  260: [function (require, module, exports) {
    // shim for using process in browser
    const process = module.exports = {}

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    let cachedSetTimeout
    let cachedClearTimeout

    function defaultSetTimout () {
      throw new Error('setTimeout has not been defined')
    }
    function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined')
    }
    (function () {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout
        } else {
          cachedSetTimeout = defaultSetTimout
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout
      }
      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout
        } else {
          cachedClearTimeout = defaultClearTimeout
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout
      }
    }())
    function runTimeout (fun) {
      if (cachedSetTimeout === setTimeout) {
      // normal enviroments in sane situations
        return setTimeout(fun, 0)
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout
        return setTimeout(fun, 0)
      }
      try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0)
      } catch (e) {
        try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0)
        } catch (e) {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0)
        }
      }
    }
    function runClearTimeout (marker) {
      if (cachedClearTimeout === clearTimeout) {
      // normal enviroments in sane situations
        return clearTimeout(marker)
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout
        return clearTimeout(marker)
      }
      try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker)
      } catch (e) {
        try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker)
        } catch (e) {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker)
        }
      }
    }
    let queue = []
    let draining = false
    let currentQueue
    let queueIndex = -1

    function cleanUpNextTick () {
      if (!draining || !currentQueue) {
        return
      }
      draining = false
      if (currentQueue.length) {
        queue = currentQueue.concat(queue)
      } else {
        queueIndex = -1
      }
      if (queue.length) {
        drainQueue()
      }
    }

    function drainQueue () {
      if (draining) {
        return
      }
      const timeout = runTimeout(cleanUpNextTick)
      draining = true

      let len = queue.length
      while (len) {
        currentQueue = queue
        queue = []
        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run()
          }
        }
        queueIndex = -1
        len = queue.length
      }
      currentQueue = null
      draining = false
      runClearTimeout(timeout)
    }

    process.nextTick = function (fun) {
      const args = new Array(arguments.length - 1)
      if (arguments.length > 1) {
        for (let i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i]
        }
      }
      queue.push(new Item(fun, args))
      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue)
      }
    }

    // v8 likes predictible objects
    function Item (fun, array) {
      this.fun = fun
      this.array = array
    }
    Item.prototype.run = function () {
      this.fun.apply(null, this.array)
    }
    process.title = 'browser'
    process.browser = true
    process.env = {}
    process.argv = []
    process.version = '' // empty string to avoid regexp issues
    process.versions = {}

    function noop () {}

    process.on = noop
    process.addListener = noop
    process.once = noop
    process.off = noop
    process.removeListener = noop
    process.removeAllListeners = noop
    process.emit = noop
    process.prependListener = noop
    process.prependOnceListener = noop

    process.listeners = function (name) { return [] }

    process.binding = function (name) {
      throw new Error('process.binding is not supported')
    }

    process.cwd = function () { return '/' }
    process.chdir = function (dir) {
      throw new Error('process.chdir is not supported')
    }
    process.umask = function () { return 0 }
  }, {}],
  261: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    /**
 * Given a function, call with the correct number of parameters from an array of possible parameters.
 * @memberOf module:functionHelpers
 * @param {Function} fn - The function to be called
 * @param {Array} params - Array of possible function parameters
 * @param {number} [minimum=2] - Minimum number of parameters to use in the function
 * @returns {*}
 */
    const callWithParams = (fn, params = [], minimum = 2) => fn(...params.slice(0, fn.length || minimum))
    const _default = exports.default = callWithParams
  }, {}],
  262: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.filter.js')
    require('core-js/modules/esnext.iterator.map.js')
    /**
 * Remove elements out of relevance range and update the max relevance.
 * @memberOf module:functionHelpers
 * @param {relevanceMap} map
 * @param {Object} [options={}]
 * @param {number} [options.mapLimit=1000] - Only filter once the map exceeds this many entries.
 * @param {number} [options.relevancyRange=100] - How many of the most-recent relevance values to keep.
 * @returns {relevanceMap}
 */
    const relevancyFilter = (map, {
      mapLimit = 1000,
      relevancyRange = 100
    } = {}) => {
      if (map.length <= mapLimit) {
        return map
      }
      const minRelevance = map.length - relevancyRange
      const filtered = map.filter(reference => reference.relevance >= minRelevance)
      return filtered.map(reference => {
        reference.relevance = reference.relevance > filtered.length ? filtered.length : reference.relevance
        return reference
      })
    }
    const _default = exports.default = relevancyFilter
  }, { 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.filter.js': 195, 'core-js/modules/esnext.iterator.map.js': 198 }],
  263: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    const _mergeObjectsBase = _interopRequireDefault(require('./mergeObjectsBase'))
    function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
    /**
 * Clone objects for manipulation without data corruption, returns a copy of the provided object.
 * NOTE: Use the mapLimit and relevancyRange to resolve "too much recursion" when the object is large and is known to
 * have circular references. A high mapLimit may lead to heavy memory usage and slow performance.
 * @memberOf module:objectHelpers
 * @param {Object} object - The original object that is being cloned
 * @param {Object} [options={}]
 * @param {number} [options.mapLimit=100] - Size of temporary reference array used in memory before assessing relevancy.
 * @param {number} [options.depthLimit=-1] - Control how many nested levels deep will be used, -1 = no limit, >-1 = nth level limited.
 * @param {number} [options.relevancyRange=1000] - Total reference map length subtract this range, any relevancy less than that amount at time of evaluation will be removed.
 * @returns {Object}
 */
    const cloneObject = (object, {
      mapLimit = 100,
      depthLimit = -1,
      relevancyRange = 1000
    } = {}) => (0, _mergeObjectsBase.default)({
      mapLimit,
      depthLimit,
      relevancyRange,
      useClone: true
    })(object)
    const _default = exports.default = cloneObject
  }, { './mergeObjectsBase': 268 }],
  264: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    const _isInstanceObject = _interopRequireDefault(require('./isInstanceObject'))
    function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
    /**
 * Determine if the value is a reference instance
 * @memberOf module:objectHelpers
 * @param {Array|Object|*} value
 * @returns {boolean}
 */
    const isCloneable = value => typeof value === 'object' && value !== null && !(0, _isInstanceObject.default)(value)
    const _default = exports.default = isCloneable
  }, { './isInstanceObject': 266 }],
  265: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/es.regexp.flags.js')
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.every.js')
    require('core-js/modules/esnext.iterator.some.js')
    require('core-js/modules/esnext.map.delete-all.js')
    require('core-js/modules/esnext.map.every.js')
    require('core-js/modules/esnext.map.filter.js')
    require('core-js/modules/esnext.map.find.js')
    require('core-js/modules/esnext.map.find-key.js')
    require('core-js/modules/esnext.map.includes.js')
    require('core-js/modules/esnext.map.key-of.js')
    require('core-js/modules/esnext.map.map-keys.js')
    require('core-js/modules/esnext.map.map-values.js')
    require('core-js/modules/esnext.map.merge.js')
    require('core-js/modules/esnext.map.reduce.js')
    require('core-js/modules/esnext.map.some.js')
    require('core-js/modules/esnext.map.update.js')
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
    require('core-js/modules/esnext.weak-map.delete-all.js')
    require('core-js/modules/esnext.weak-set.add-all.js')
    require('core-js/modules/esnext.weak-set.delete-all.js')
    const sameValueZero = (first, second) => first === second || first !== first && second !== second
    const compare = (first, second, seen) => {
      if (sameValueZero(first, second)) {
        return true
      }
      if (typeof first !== 'object' || typeof second !== 'object' || first === null || second === null) {
        // Different primitives, or a function (which is only equal to itself), or an object against a primitive
        return false
      }
      if (Object.getPrototypeOf(first) !== Object.getPrototypeOf(second)) {
        return false
      }
      // A pair which is already being compared further up is not a difference (this is what makes circular references work)
      const comparing = seen.get(first)
      if (comparing && comparing.has(second)) {
        return true
      }
      if (comparing) {
        comparing.add(second)
      } else {
        seen.set(first, new WeakSet([second]))
      }
      if (first instanceof Date) {
        return first.getTime() === second.getTime()
      }
      if (first instanceof RegExp) {
        return first.source === second.source && first.flags === second.flags
      }
      if (first instanceof Map) {
        return first.size === second.size && Array.from(first.entries()).every(([key, value]) => second.has(key) && compare(value, second.get(key), seen))
      }
      if (first instanceof Set) {
        const others = Array.from(second.values())
        return first.size === second.size && Array.from(first.values()).every(value => others.some(other => compare(value, other, seen)))
      }
      if (Array.isArray(first) && first.length !== second.length) {
        return false
      }
      const firstKeys = Object.keys(first)
      const secondKeys = Object.keys(second)
      return firstKeys.length === secondKeys.length && firstKeys.every(key => Object.prototype.hasOwnProperty.call(second, key) && compare(first[key], second[key], seen))
    }
    /**
 * Check whether two values are equal by value, however they are stored: two separately made arrays or objects with the
 * same contents are equal, while two references only need to be the same when the value is a function.
 * - Primitives are equal when they are the same value (and NaN equals NaN)
 * - Arrays are equal when they have the same elements in the same order
 * - Objects are equal when they have the same prototype (the same kind of object) and the same own properties with
 * equal values, the order of the properties does not matter
 * - Dates, regular expressions, Maps and Sets are compared by what they hold
 * - Circular references are handled: a pair of objects which is already being compared is taken to be equal
 * @memberOf module:objectHelpers
 * @param {*} first - The first value.
 * @param {*} second - The second value.
 * @returns {boolean} True when the values are equal.
 */
    const isEqual = (first, second) => compare(first, second, new WeakMap())
    const _default = exports.default = isEqual
  }, { 'core-js/modules/es.regexp.flags.js': 192, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.every.js': 194, 'core-js/modules/esnext.iterator.some.js': 200, 'core-js/modules/esnext.map.delete-all.js': 201, 'core-js/modules/esnext.map.every.js': 202, 'core-js/modules/esnext.map.filter.js': 203, 'core-js/modules/esnext.map.find-key.js': 204, 'core-js/modules/esnext.map.find.js': 205, 'core-js/modules/esnext.map.includes.js': 206, 'core-js/modules/esnext.map.key-of.js': 207, 'core-js/modules/esnext.map.map-keys.js': 208, 'core-js/modules/esnext.map.map-values.js': 209, 'core-js/modules/esnext.map.merge.js': 210, 'core-js/modules/esnext.map.reduce.js': 211, 'core-js/modules/esnext.map.some.js': 212, 'core-js/modules/esnext.map.update.js': 213, 'core-js/modules/esnext.set.add-all.js': 214, 'core-js/modules/esnext.set.delete-all.js': 215, 'core-js/modules/esnext.set.difference.js': 216, 'core-js/modules/esnext.set.every.js': 217, 'core-js/modules/esnext.set.filter.js': 218, 'core-js/modules/esnext.set.find.js': 219, 'core-js/modules/esnext.set.intersection.js': 220, 'core-js/modules/esnext.set.is-disjoint-from.js': 221, 'core-js/modules/esnext.set.is-subset-of.js': 222, 'core-js/modules/esnext.set.is-superset-of.js': 223, 'core-js/modules/esnext.set.join.js': 224, 'core-js/modules/esnext.set.map.js': 225, 'core-js/modules/esnext.set.reduce.js': 226, 'core-js/modules/esnext.set.some.js': 227, 'core-js/modules/esnext.set.symmetric-difference.js': 228, 'core-js/modules/esnext.set.union.js': 229, 'core-js/modules/esnext.weak-map.delete-all.js': 230, 'core-js/modules/esnext.weak-set.add-all.js': 231, 'core-js/modules/esnext.weak-set.delete-all.js': 232 }],
  266: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/es.array.includes.js')
    const _isObject = _interopRequireDefault(require('./isObject'))
    const _objectKeys = _interopRequireDefault(require('./objectKeys'))
    function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
    /**
 * Check if the current object has inherited properties.
 * @memberOf module:objectHelpers
 * @param {Object|Array} object
 * @returns {boolean}
 */
    const isInstanceObject = object => {
      if (typeof object !== 'function' && !(0, _isObject.default)(object)) {
        return false
      }
      if (!['Array', 'Function', 'Object'].includes(object.constructor.name)) {
        return true
      }
      return object.constructor.name !== 'Array' && (0, _objectKeys.default)(object, true).length > (0, _objectKeys.default)(object).length
    }
    const _default = exports.default = isInstanceObject
  }, { './isObject': 267, './objectKeys': 269, 'core-js/modules/es.array.includes.js': 183 }],
  267: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    /**
 * Check if the provided thing is an object / array.
 * @memberOf module:objectHelpers
 * @param {*} object
 * @returns {boolean}
 */
    const isObject = object => typeof object === 'object' && object !== null
    const _default = exports.default = isObject
  }, {}],
  268: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.find.js')
    require('core-js/modules/esnext.iterator.map.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    const _isCloneable = _interopRequireDefault(require('./isCloneable'))
    const _reduceObject = _interopRequireDefault(require('./reduceObject'))
    const _relevancyFilter = _interopRequireDefault(require('../functions/relevancyFilter'))
    const _setValue = _interopRequireDefault(require('./setValue'))
    function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
    /**
 * Perform a deep merge of objects. This will return a function that will combine all objects and sub-objects.
 * Objects having the same attributes will overwrite from last object to first.
 * NOTE: Use the mapLimit and relevancyRange to resolve "too much recursion" when the object is large and is known to
 * have circular references. A high mapLimit may lead to heavy memory usage and slow performance.
 * @memberOf module:objectHelpers
 * @param {Object} [options={}]
 * @param {number} [options.mapLimit=100] - Size of temporary reference array used in memory before assessing relevancy.
 * @param {number} [options.depthLimit=-1] - Control how many nested levels deep will be used, -1 = no limit, >-1 = nth level limited.
 * @param {number} [options.relevancyRange=1000] - Total reference map length subtract this range, any relevancy less than that amount at time of evaluation will be removed.
 * @param {Iterable|array} [options.map=[]] - A predetermined list of references gathered (to be passed to itself during recursion).
 * @param {boolean} [options.useClone=false]
 * @returns {module:objectHelpers~mergeObjectsCallback|mergeObjectsCallback}
 */
    const mergeObjectsBase = ({
      mapLimit = 100,
      depthLimit = -1,
      relevancyRange = 1000,
      map = [],
      useClone = false
    } = {}) => (...objects) => {
      const firstObject = useClone ? Array.isArray(objects[0]) ? [] : {} : objects.shift()
      if (objects.length < 1) {
        return firstObject
      }
      if (depthLimit === 0) {
        return firstObject
      }
      return objects.reduce((newObj, arg) => {
        if (!arg) {
          return newObj
        }
        map.push({
          source: arg,
          object: newObj,
          relevance: map.length
        })
        map = (0, _relevancyFilter.default)(map, {
          mapLimit,
          relevancyRange
        })
        return (0, _reduceObject.default)(arg, (returnObj, value, key) => {
          if ((0, _isCloneable.default)(value)) {
            let objectValue = newObj[key]
            const exists = map.find(existing => existing.source === value)
            if (exists) {
              exists.relevance = map.length + 1
              return (0, _setValue.default)(key, exists.object, returnObj)
            }
            if (!(0, _isCloneable.default)(objectValue) || !objectValue) {
              objectValue = useClone ? Array.isArray(value) ? [] : {} : value
            }
            if ((0, _isCloneable.default)(objectValue)) {
              return (0, _setValue.default)(key, mergeObjectsBase({
                mapLimit,
                depthLimit: depthLimit - 1,
                relevancyRange,
                map,
                useClone
              })(objectValue, value), returnObj)
            }
            map.push({
              source: value,
              object: objectValue,
              relevance: map.length
            })
            map = (0, _relevancyFilter.default)(map, {
              mapLimit,
              relevancyRange
            })
          }
          return (0, _setValue.default)(key, value, returnObj)
        }, newObj)
      }, firstObject || {})
    }
    const _default = exports.default = mergeObjectsBase
  }, { '../functions/relevancyFilter': 262, './isCloneable': 264, './reduceObject': 270, './setValue': 271, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.find.js': 196, 'core-js/modules/esnext.iterator.map.js': 198, 'core-js/modules/esnext.iterator.reduce.js': 199 }],
  269: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    const _isObject = _interopRequireDefault(require('./isObject'))
    function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
    /**
 * Get an array of keys from any object or array. Will return empty array when invalid or there are no keys.
 * Optional flag will include the inherited keys from prototype chain when set.
 * @memberOf module:objectHelpers
 * @param {Object|Array} object
 * @param {boolean} [includeInherited=false]
 * @returns {Array.<string|number>}
 */
    const objectKeys = (object, includeInherited = false) => {
      if (typeof object !== 'function' && !(0, _isObject.default)(object)) {
        return []
      }
      if (includeInherited) {
        const propNames = Object.getOwnPropertyNames(object)
        if (propNames.length) {
          return propNames
        }
      }
      const keys = []
      for (const key in object) {
        if (includeInherited || Object.prototype.hasOwnProperty.call(object, key)) {
          if (Array.isArray(object)) {
            keys.push(parseInt(key))
            continue
          }
          keys.push(key)
        }
      }
      return keys
    }
    const _default = exports.default = objectKeys
  }, { './isObject': 267 }],
  270: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    const _callWithParams = _interopRequireDefault(require('../functions/callWithParams'))
    const _objectKeys = _interopRequireDefault(require('./objectKeys'))
    function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
    /**
 * This function is intended to replicate behaviour of the Array.reduce() function but for Objects.
 * If an array is passed in instead then it will perform standard reduce(). It is recommended to
 * always use the standard reduce() function when it is known that the object is actually an array.
 * @memberOf module:objectHelpers
 * @param {Object|Array} obj - The Object (or Array) to be filtered
 * @param {module:objectHelpers~reduceCallback|Function|reduceCallback} fn - The function to be processed for each filtered property
 * @param {Object|Array} [initialValue] - Optional. Value to use as the first argument to the first call of the
 * callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty
 * array without an initial value is an error.
 * @returns {*}
 */
    const reduceObject = (obj, fn, initialValue = obj[(0, _objectKeys.default)(obj)[0]] || obj[0]) => Array.isArray(obj) ? obj.reduce(fn, initialValue) : (0, _objectKeys.default)(obj, true).reduce((newObj, curr) => (0, _callWithParams.default)(fn, [newObj, obj[curr], curr, obj], 2), initialValue)
    const _default = exports.default = reduceObject
  }, { '../functions/callWithParams': 261, './objectKeys': 269, 'core-js/modules/esnext.iterator.constructor.js': 193, 'core-js/modules/esnext.iterator.reduce.js': 199 }],
  271: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    /**
 * Set a value on an item, then return the item.
 * NOTE: Argument order designed for usage with pipe
 * @memberOf module:objectHelpers
 * @param {string|number} key - The key on the item which will have its value set
 * @param {*} value - Any value to be applied to the key
 * @param {Object|Array} item - An object or array to be updated
 * @returns {Object|Array}
 */
    const setValue = (key, value, item) => {
      // @ts-ignore
      item[key] = value
      return item
    }
    const _default = exports.default = setValue
  }, {}]
}, {}, [21])

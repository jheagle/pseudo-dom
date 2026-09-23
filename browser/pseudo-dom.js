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
  }, { '../services/EventService': 22 }],
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
  }, { '../services/DocumentService': 20, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.find.js': 187 }],
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
  }, { 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList': 43, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.map.js': 189 }],
  4: [function (require, module, exports) {
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
  }, { '../services/CustomEventService': 17, '../services/EventService': 22, '../services/FocusEventService': 24, '../services/InputEventService': 27, '../services/KeyboardEventService': 28, '../services/MouseEventService': 29, '../services/PointerEventService': 32, '../services/UIEventService': 33, './eventDefaults': 6 }],
  5: [function (require, module, exports) {
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
  }, { '../services/NodeService': 31, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.filter.js': 186, 'core-js/modules/esnext.iterator.for-each.js': 188, 'core-js/modules/esnext.iterator.some.js': 191 }],
  6: [function (require, module, exports) {
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
  7: [function (require, module, exports) {
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
   * @type {Node|PseudoNode}
   */
      const Node = root.Node || new NodeService_1.NodeService()
      if (typeof newWindow.Node === 'undefined') {
        newWindow.Node = Node
      }
      /**
   *
   * @type {Element|PseudoElement}
   */
      const Element = root.Element || new ElementService_1.ElementService()
      if (typeof newWindow.Element === 'undefined') {
        newWindow.Element = Element
      }
      /**
   * Create an instance of HTMLElement if not available
   * @type {HTMLElement|PseudoHTMLElement}
   */
      const HTMLElement = root.HTMLElement || new HTMLElementService_1.HTMLElementService()
      if (typeof newWindow.HTMLElement === 'undefined') {
        newWindow.HTMLElement = HTMLElement
      }
      /**
   * Define document when not available
   * @type {Document|PseudoHTMLDocument}
   */
      const document = root.document || new PseudoHTMLDocument_1.default()
      if (typeof newWindow.document === 'undefined') {
        newWindow.document = document
      }
      return context ? Object.assign(context, newWindow) : Object.assign(root, newWindow)
    }
    exports.default = generateDocument
  }, { '../classes/PseudoHTMLDocument': 2, '../services/ElementService': 21, '../services/EventTargetService': 23, '../services/HTMLElementService': 26, '../services/NodeService': 31 }],
  8: [function (require, module, exports) {
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
  9: [function (require, module, exports) {
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
  }, { './cssSelectAdapter': 5, 'css-select': 230 }],
  10: [function (require, module, exports) {
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
  }, { 'core-js/modules/esnext.weak-map.delete-all.js': 221 }],
  11: [function (require, module, exports) {
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
  }, { '../services/NodeService': 31 }],
  12: [function (require, module, exports) {
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
  13: [function (require, module, exports) {
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
  }, { './getParentNodes': 12, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.filter.js': 186 }],
  14: [function (require, module, exports) {
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
  15: [function (require, module, exports) {
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
    exports.PseudoHTMLDocument = exports.PseudoHTMLElement = exports.PseudoElement = exports.PseudoComment = exports.PseudoText = exports.PseudoNode = exports.PseudoEventTarget = exports.PseudoCustomEvent = exports.PseudoInputEvent = exports.PseudoFocusEvent = exports.PseudoKeyboardEvent = exports.PseudoPointerEvent = exports.PseudoMouseEvent = exports.PseudoUIEvent = exports.PseudoEvent = exports.simulate = exports.eventDefaults = exports.createEvent = exports.generateDocument = void 0
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
  }, { './classes/PseudoHTMLDocument': 2, './factories/createEvent': 4, './factories/eventDefaults': 6, './factories/generateDocument': 7, './services/CustomEventService': 17, './services/ElementService': 21, './services/EventService': 22, './services/EventTargetService': 23, './services/FocusEventService': 24, './services/HTMLElementService': 26, './services/InputEventService': 27, './services/KeyboardEventService': 28, './services/MouseEventService': 29, './services/NodeService': 31, './services/PointerEventService': 32, './services/UIEventService': 33, './simulate': 34 }],
  16: [function (require, module, exports) {
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
  }, { './NodeService': 31 }],
  17: [function (require, module, exports) {
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
  }, { './EventService': 22 }],
  18: [function (require, module, exports) {
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
  }, { 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.filter.js': 186, 'core-js/modules/esnext.iterator.for-each.js': 188, 'core-js/modules/esnext.iterator.map.js': 189 }],
  19: [function (require, module, exports) {
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
  }, { '../functions/getElementById': 11, './NodeService': 31 }],
  20: [function (require, module, exports) {
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
  }, { '../functions/getElementById': 11, './DocumentFragmentService': 19, './HTMLElementService': 26, './NodeService': 31 }],
  21: [function (require, module, exports) {
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
    const HTMLCollectionService_1 = require('./HTMLCollectionService')
    const cloneObject_1 = __importDefault(require('si-funciona/dist/helpers/objects/cloneObject'))
    const isEqual_1 = __importDefault(require('si-funciona/dist/helpers/objects/isEqual'))
    const query_1 = require('../factories/query')
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
    }
    exports.ElementService = ElementService
  }, { '../factories/createEvent': 4, '../factories/query': 9, '../functions/getParentNodesFromAttribute': 13, './AttrService': 16, './DOMTokenListService': 18, './HTMLCollectionService': 25, './NamedNodeMapService': 30, './NodeService': 31, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.every.js': 185, 'core-js/modules/esnext.iterator.find.js': 187, 'core-js/modules/esnext.iterator.for-each.js': 188, 'core-js/modules/esnext.iterator.map.js': 189, 'core-js/modules/esnext.iterator.some.js': 191, 'si-funciona/dist/helpers/objects/cloneObject': 245, 'si-funciona/dist/helpers/objects/isEqual': 247 }],
  22: [function (require, module, exports) {
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
  23: [function (require, module, exports) {
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
  }, { '../classes/PseudoEventListener': 1, '../functions/getParentNodes': 12, './EventService': 22, 'collect-your-stuff/dist/collections/linked-list/LinkedList': 41, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.filter.js': 186, 'core-js/modules/esnext.iterator.find.js': 187, 'core-js/modules/esnext.iterator.for-each.js': 188, 'core-js/modules/esnext.iterator.map.js': 189, 'core-js/modules/esnext.iterator.some.js': 191 }],
  24: [function (require, module, exports) {
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
  }, { './UIEventService': 33 }],
  25: [function (require, module, exports) {
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
  }, { './NodeService': 31, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.find.js': 187, 'core-js/modules/esnext.iterator.for-each.js': 188 }],
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
  }, { '../factories/createEvent': 4, '../functions/activeElement': 10, './ElementService': 21 }],
  27: [function (require, module, exports) {
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
  }, { './UIEventService': 33 }],
  28: [function (require, module, exports) {
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
  }, { '../functions/modifierState': 14, './UIEventService': 33 }],
  29: [function (require, module, exports) {
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
  }, { '../functions/modifierState': 14, './UIEventService': 33 }],
  30: [function (require, module, exports) {
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
  }, { 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.find.js': 187 }],
  31: [function (require, module, exports) {
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
  }, { '../factories/generateNodeList': 8, '../factories/query': 9, './EventTargetService': 23, './HTMLCollectionService': 25, 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker': 44, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.every.js': 185, 'core-js/modules/esnext.iterator.filter.js': 186, 'core-js/modules/esnext.iterator.for-each.js': 188 }],
  32: [function (require, module, exports) {
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
  }, { './MouseEventService': 29 }],
  33: [function (require, module, exports) {
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
  }, { './EventService': 22 }],
  34: [function (require, module, exports) {
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
  }, { './factories/createEvent': 4, './functions/activeElement': 10 }],
  35: [function (require, module, exports) {
    module.exports = {
      trueFunc: function trueFunc () {
        return true
      },
      falseFunc: function falseFunc () {
        return false
      }
    }
  }, {}],
  36: [function (require, module, exports) {

  }, {}],
  37: [function (require, module, exports) {
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
  }, { 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.reduce.js': 190 }],
  38: [function (require, module, exports) {
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
  }, { '../../recipes/ArrayIterator': 45, './ArrayElement': 37 }],
  39: [function (require, module, exports) {
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
  }, { '../linked-list/Linker': 42, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.reduce.js': 190 }],
  40: [function (require, module, exports) {
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
  }, { '../../recipes/DoubleLinkerIterator': 46, '../linked-list/LinkedList': 41, './DoubleLinker': 39, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.for-each.js': 188 }],
  41: [function (require, module, exports) {
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
  }, { '../../recipes/LinkerIterator': 47, '../arrayable/Arrayable': 38, './Linker': 42 }],
  42: [function (require, module, exports) {
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
  }, { '../arrayable/ArrayElement': 37, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.reduce.js': 190 }],
  43: [function (require, module, exports) {
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
  }, { '../../recipes/TreeLinkerIterator': 48, '../doubly-linked-list/DoublyLinkedList': 40, './TreeLinker': 44, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.for-each.js': 188 }],
  44: [function (require, module, exports) {
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
  }, { '../doubly-linked-list/DoubleLinker': 39, './LinkedTreeList': 43, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.map.js': 189 }],
  45: [function (require, module, exports) {
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
  46: [function (require, module, exports) {
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
  47: [function (require, module, exports) {
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
  48: [function (require, module, exports) {
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
  }, { '../services/parseTreeNext': 49 }],
  49: [function (require, module, exports) {
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
  50: [function (require, module, exports) {
    'use strict'
    const isCallable = require('../internals/is-callable')
    const tryToString = require('../internals/try-to-string')

    const $TypeError = TypeError

    // `Assert: IsCallable(argument) is true`
    module.exports = function (argument) {
      if (isCallable(argument)) return argument
      throw new $TypeError(tryToString(argument) + ' is not a function')
    }
  }, { '../internals/is-callable': 102, '../internals/try-to-string': 166 }],
  51: [function (require, module, exports) {
    'use strict'
    const has = require('../internals/map-helpers').has

    // Perform ? RequireInternalSlot(M, [[MapData]])
    module.exports = function (it) {
      has(it)
      return it
    }
  }, { '../internals/map-helpers': 121 }],
  52: [function (require, module, exports) {
    'use strict'
    const has = require('../internals/set-helpers').has

    // Perform ? RequireInternalSlot(M, [[SetData]])
    module.exports = function (it) {
      has(it)
      return it
    }
  }, { '../internals/set-helpers': 143 }],
  53: [function (require, module, exports) {
    'use strict'
    const has = require('../internals/weak-map-helpers').has

    // Perform ? RequireInternalSlot(M, [[WeakMapData]])
    module.exports = function (it) {
      has(it)
      return it
    }
  }, { '../internals/weak-map-helpers': 171 }],
  54: [function (require, module, exports) {
    'use strict'
    const has = require('../internals/weak-set-helpers').has

    // Perform ? RequireInternalSlot(M, [[WeakSetData]])
    module.exports = function (it) {
      has(it)
      return it
    }
  }, { '../internals/weak-set-helpers': 172 }],
  55: [function (require, module, exports) {
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
  }, { '../internals/object-create': 124, '../internals/object-define-property': 126, '../internals/well-known-symbol': 173 }],
  56: [function (require, module, exports) {
    'use strict'
    const isPrototypeOf = require('../internals/object-is-prototype-of')

    const $TypeError = TypeError

    module.exports = function (it, Prototype) {
      if (isPrototypeOf(Prototype, it)) return it
      throw new $TypeError('Incorrect invocation')
    }
  }, { '../internals/object-is-prototype-of': 131 }],
  57: [function (require, module, exports) {
    'use strict'
    const isObject = require('../internals/is-object')

    const $String = String
    const $TypeError = TypeError

    // `Assert: Type(argument) is Object`
    module.exports = function (argument) {
      if (isObject(argument)) return argument
      throw new $TypeError($String(argument) + ' is not an object')
    }
  }, { '../internals/is-object': 106 }],
  58: [function (require, module, exports) {
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
  }, { '../internals/length-of-array-like': 119, '../internals/to-absolute-index': 156, '../internals/to-indexed-object': 157 }],
  59: [function (require, module, exports) {
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
  }, { '../internals/an-object': 57, '../internals/iterator-close': 113 }],
  60: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    const toString = uncurryThis({}.toString)
    const stringSlice = uncurryThis(''.slice)

    module.exports = function (it) {
      return stringSlice(toString(it), 8, -1)
    }
  }, { '../internals/function-uncurry-this': 86 }],
  61: [function (require, module, exports) {
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
  }, { '../internals/classof-raw': 60, '../internals/is-callable': 102, '../internals/to-string-tag-support': 164, '../internals/well-known-symbol': 173 }],
  62: [function (require, module, exports) {
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
  }, { '../internals/has-own-property': 94, '../internals/object-define-property': 126, '../internals/object-get-own-property-descriptor': 127, '../internals/own-keys': 136 }],
  63: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    module.exports = !fails(function () {
      function F () { /* empty */ }
      F.prototype.constructor = null
      // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
      return Object.getPrototypeOf(new F()) !== F.prototype
    })
  }, { '../internals/fails': 78 }],
  64: [function (require, module, exports) {
    'use strict'
    // `CreateIterResultObject` abstract operation
    // https://tc39.es/ecma262/#sec-createiterresultobject
    module.exports = function (value, done) {
      return { value, done }
    }
  }, {}],
  65: [function (require, module, exports) {
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
  }, { '../internals/create-property-descriptor': 66, '../internals/descriptors': 72, '../internals/object-define-property': 126 }],
  66: [function (require, module, exports) {
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
  67: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const definePropertyModule = require('../internals/object-define-property')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')

    module.exports = function (object, key, value) {
      if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value))
      else object[key] = value
    }
  }, { '../internals/create-property-descriptor': 66, '../internals/descriptors': 72, '../internals/object-define-property': 126 }],
  68: [function (require, module, exports) {
    'use strict'
    const makeBuiltIn = require('../internals/make-built-in')
    const defineProperty = require('../internals/object-define-property')

    module.exports = function (target, name, descriptor) {
      if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true })
      if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true })
      return defineProperty.f(target, name, descriptor)
    }
  }, { '../internals/make-built-in': 120, '../internals/object-define-property': 126 }],
  69: [function (require, module, exports) {
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
  }, { '../internals/define-global-property': 71, '../internals/is-callable': 102, '../internals/make-built-in': 120, '../internals/object-define-property': 126 }],
  70: [function (require, module, exports) {
    'use strict'
    const defineBuiltIn = require('../internals/define-built-in')

    module.exports = function (target, src, options) {
      for (const key in src) defineBuiltIn(target, key, src[key], options)
      return target
    }
  }, { '../internals/define-built-in': 69 }],
  71: [function (require, module, exports) {
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
  }, { '../internals/global-this': 93 }],
  72: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    // Detect IE8's incomplete defineProperty implementation
    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty({}, 1, { get: function () { return 7 } })[1] !== 7
    })
  }, { '../internals/fails': 78 }],
  73: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const isObject = require('../internals/is-object')

    const document = globalThis.document
    // typeof document.createElement is 'object' in old IE
    const EXISTS = isObject(document) && isObject(document.createElement)

    module.exports = function (it) {
      return EXISTS ? document.createElement(it) : {}
    }
  }, { '../internals/global-this': 93, '../internals/is-object': 106 }],
  74: [function (require, module, exports) {
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
  75: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')

    const navigator = globalThis.navigator
    const userAgent = navigator && navigator.userAgent

    module.exports = userAgent ? String(userAgent) : ''
  }, { '../internals/global-this': 93 }],
  76: [function (require, module, exports) {
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
  }, { '../internals/environment-user-agent': 75, '../internals/global-this': 93 }],
  77: [function (require, module, exports) {
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
  }, { '../internals/copy-constructor-properties': 62, '../internals/create-non-enumerable-property': 65, '../internals/define-built-in': 69, '../internals/define-global-property': 71, '../internals/global-this': 93, '../internals/is-forced': 103, '../internals/object-get-own-property-descriptor': 127 }],
  78: [function (require, module, exports) {
    'use strict'
    module.exports = function (exec) {
      try {
        return !!exec()
      } catch (error) {
        return true
      }
    }
  }, {}],
  79: [function (require, module, exports) {
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
  }, { '../internals/function-bind-native': 81 }],
  80: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/function-bind-native': 81, '../internals/function-uncurry-this-clause': 85 }],
  81: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-function-prototype-bind -- safe
      const test = function () { /* empty */ }.bind()
      // eslint-disable-next-line no-prototype-builtins -- safe
      return typeof test !== 'function' || test.hasOwnProperty('prototype')
    })
  }, { '../internals/fails': 78 }],
  82: [function (require, module, exports) {
    'use strict'
    const NATIVE_BIND = require('../internals/function-bind-native')

    const call = Function.prototype.call
    // eslint-disable-next-line es/no-function-prototype-bind -- safe
    module.exports = NATIVE_BIND
      ? call.bind(call)
      : function () {
        return call.apply(call, arguments)
      }
  }, { '../internals/function-bind-native': 81 }],
  83: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 72, '../internals/has-own-property': 94 }],
  84: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')
    const aCallable = require('../internals/a-callable')

    module.exports = function (object, key, method) {
      try {
        // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
        return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]))
      } catch (error) { /* empty */ }
    }
  }, { '../internals/a-callable': 50, '../internals/function-uncurry-this': 86 }],
  85: [function (require, module, exports) {
    'use strict'
    const classofRaw = require('../internals/classof-raw')
    const uncurryThis = require('../internals/function-uncurry-this')

    module.exports = function (fn) {
      // Nashorn bug:
      //   https://github.com/zloirock/core-js/issues/1128
      //   https://github.com/zloirock/core-js/issues/1130
      if (classofRaw(fn) === 'Function') return uncurryThis(fn)
    }
  }, { '../internals/classof-raw': 60, '../internals/function-uncurry-this': 86 }],
  86: [function (require, module, exports) {
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
  }, { '../internals/function-bind-native': 81 }],
  87: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const isCallable = require('../internals/is-callable')

    const aFunction = function (argument) {
      return isCallable(argument) ? argument : undefined
    }

    module.exports = function (namespace, method) {
      return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method]
    }
  }, { '../internals/global-this': 93, '../internals/is-callable': 102 }],
  88: [function (require, module, exports) {
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
  89: [function (require, module, exports) {
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
  }, { '../internals/an-object': 57, '../internals/function-call': 82, '../internals/get-iterator-method-internal': 90, '../internals/is-callable': 102, '../internals/try-to-string': 166 }],
  90: [function (require, module, exports) {
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
  }, { '../internals/classof-raw': 60, '../internals/get-method': 91, '../internals/is-null-or-undefined': 105, '../internals/well-known-symbol': 173 }],
  91: [function (require, module, exports) {
    'use strict'
    const aCallable = require('../internals/a-callable')
    const isNullOrUndefined = require('../internals/is-null-or-undefined')

    // `GetMethod` abstract operation
    // https://tc39.es/ecma262/#sec-getmethod
    module.exports = function (V, P) {
      const func = V[P]
      return isNullOrUndefined(func) ? undefined : aCallable(func)
    }
  }, { '../internals/a-callable': 50, '../internals/is-null-or-undefined': 105 }],
  92: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/an-object': 57, '../internals/function-call': 82, '../internals/get-iterator-direct': 88, '../internals/to-integer-or-infinity': 158 }],
  93: [function (require, module, exports) {
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
  94: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 86, '../internals/to-object': 160 }],
  95: [function (require, module, exports) {
    'use strict'
    module.exports = {}
  }, {}],
  96: [function (require, module, exports) {
    'use strict'
    const getBuiltIn = require('../internals/get-built-in')

    module.exports = getBuiltIn('document', 'documentElement')
  }, { '../internals/get-built-in': 87 }],
  97: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 72, '../internals/document-create-element': 73, '../internals/fails': 78 }],
  98: [function (require, module, exports) {
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
  }, { '../internals/classof-raw': 60, '../internals/fails': 78, '../internals/function-uncurry-this': 86 }],
  99: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 86, '../internals/is-callable': 102, '../internals/shared-store': 153 }],
  100: [function (require, module, exports) {
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
  }, { '../internals/create-non-enumerable-property': 65, '../internals/global-this': 93, '../internals/has-own-property': 94, '../internals/hidden-keys': 95, '../internals/is-object': 106, '../internals/shared-key': 152, '../internals/shared-store': 153, '../internals/weak-map-basic-detection': 170 }],
  101: [function (require, module, exports) {
    'use strict'
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const Iterators = require('../internals/iterators')

    const ITERATOR = wellKnownSymbol('iterator')
    const ArrayPrototype = Array.prototype

    // check on default Array iterator
    module.exports = function (it) {
      return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it)
    }
  }, { '../internals/iterators': 118, '../internals/well-known-symbol': 173 }],
  102: [function (require, module, exports) {
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
  103: [function (require, module, exports) {
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
  }, { '../internals/fails': 78, '../internals/is-callable': 102 }],
  104: [function (require, module, exports) {
    'use strict'
    const classof = require('../internals/classof-raw')
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const ITERATOR = wellKnownSymbol('iterator')

    module.exports = function (it) {
      return it[ITERATOR] !== undefined ||
    it['@@iterator'] !== undefined ||
    classof(it) === 'Arguments'
    }
  }, { '../internals/classof-raw': 60, '../internals/well-known-symbol': 173 }],
  105: [function (require, module, exports) {
    'use strict'
    // we can't use just `it == null` since of `document.all` special case
    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
    module.exports = function (it) {
      return it === null || it === undefined
    }
  }, {}],
  106: [function (require, module, exports) {
    'use strict'
    const isCallable = require('../internals/is-callable')

    module.exports = function (it) {
      return typeof it === 'object' ? it !== null : isCallable(it)
    }
  }, { '../internals/is-callable': 102 }],
  107: [function (require, module, exports) {
    'use strict'
    module.exports = false
  }, {}],
  108: [function (require, module, exports) {
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
  }, { '../internals/get-built-in': 87, '../internals/is-callable': 102, '../internals/object-is-prototype-of': 131, '../internals/use-symbol-as-uid': 168 }],
  109: [function (require, module, exports) {
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
  }, { '../internals/function-call': 82 }],
  110: [function (require, module, exports) {
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
  }, { '../internals/an-object': 57, '../internals/function-bind-context': 80, '../internals/function-call': 82, '../internals/get-iterator-internal': 89, '../internals/get-iterator-method-internal': 90, '../internals/is-array-iterator-method': 101, '../internals/iterator-close': 113, '../internals/length-of-array-like': 119, '../internals/object-is-prototype-of': 131, '../internals/try-to-string': 166 }],
  111: [function (require, module, exports) {
    'use strict'
    // release references held by exhausted / closed iterator helpers to allow GC of the source chain
    module.exports = function (state) {
      state.iterator = state.next = state.nextHandler = state.mapper = state.predicate = state.inner =
    state.iterables = state.iters = state.openIters = state.padding = state.finishResults = state.buffer = null
    }
  }, {}],
  112: [function (require, module, exports) {
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
  }, { '../internals/iterator-close': 113 }],
  113: [function (require, module, exports) {
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
  }, { '../internals/an-object': 57, '../internals/function-call': 82, '../internals/get-method': 91 }],
  114: [function (require, module, exports) {
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
  }, { '../internals/create-iter-result-object': 64, '../internals/create-non-enumerable-property': 65, '../internals/define-built-ins': 70, '../internals/function-call': 82, '../internals/get-method': 91, '../internals/internal-state': 100, '../internals/iterator-cleanup-state': 111, '../internals/iterator-close': 113, '../internals/iterator-close-all': 112, '../internals/iterators-core': 117, '../internals/object-create': 124, '../internals/well-known-symbol': 173 }],
  115: [function (require, module, exports) {
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
  116: [function (require, module, exports) {
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
  }, { '../internals/global-this': 93 }],
  117: [function (require, module, exports) {
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
  }, { '../internals/define-built-in': 69, '../internals/fails': 78, '../internals/is-callable': 102, '../internals/is-object': 106, '../internals/is-pure': 107, '../internals/object-create': 124, '../internals/object-get-prototype-of': 130, '../internals/well-known-symbol': 173 }],
  118: [function (require, module, exports) {
    'use strict'
    module.exports = Object.create ? Object.create(null) : {}
  }, {}],
  119: [function (require, module, exports) {
    'use strict'
    const toLength = require('../internals/to-length')

    // `LengthOfArrayLike` abstract operation
    // https://tc39.es/ecma262/#sec-lengthofarraylike
    module.exports = function (obj) {
      return toLength(obj.length)
    }
  }, { '../internals/to-length': 159 }],
  120: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 72, '../internals/fails': 78, '../internals/function-name': 83, '../internals/function-uncurry-this': 86, '../internals/has-own-property': 94, '../internals/inspect-source': 99, '../internals/internal-state': 100, '../internals/is-callable': 102 }],
  121: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 86 }],
  122: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 86, '../internals/iterate-simple': 109, '../internals/map-helpers': 121 }],
  123: [function (require, module, exports) {
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
  124: [function (require, module, exports) {
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
  }, { '../internals/an-object': 57, '../internals/document-create-element': 73, '../internals/enum-bug-keys': 74, '../internals/hidden-keys': 95, '../internals/html': 96, '../internals/object-define-properties': 125, '../internals/shared-key': 152 }],
  125: [function (require, module, exports) {
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
  }, { '../internals/an-object': 57, '../internals/descriptors': 72, '../internals/object-define-property': 126, '../internals/object-keys': 133, '../internals/to-indexed-object': 157, '../internals/v8-prototype-define-bug': 169 }],
  126: [function (require, module, exports) {
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
  }, { '../internals/an-object': 57, '../internals/descriptors': 72, '../internals/ie8-dom-define': 97, '../internals/to-property-key': 162, '../internals/v8-prototype-define-bug': 169 }],
  127: [function (require, module, exports) {
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
  }, { '../internals/create-property-descriptor': 66, '../internals/descriptors': 72, '../internals/function-call': 82, '../internals/has-own-property': 94, '../internals/ie8-dom-define': 97, '../internals/object-property-is-enumerable': 134, '../internals/to-indexed-object': 157, '../internals/to-property-key': 162 }],
  128: [function (require, module, exports) {
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
  }, { '../internals/enum-bug-keys': 74, '../internals/object-keys-internal': 132 }],
  129: [function (require, module, exports) {
    'use strict'
    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    exports.f = Object.getOwnPropertySymbols
  }, {}],
  130: [function (require, module, exports) {
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
  }, { '../internals/correct-prototype-getter': 63, '../internals/has-own-property': 94, '../internals/is-callable': 102, '../internals/shared-key': 152, '../internals/to-object': 160 }],
  131: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    module.exports = uncurryThis({}.isPrototypeOf)
  }, { '../internals/function-uncurry-this': 86 }],
  132: [function (require, module, exports) {
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
  }, { '../internals/array-includes': 58, '../internals/function-uncurry-this': 86, '../internals/has-own-property': 94, '../internals/hidden-keys': 95, '../internals/to-indexed-object': 157 }],
  133: [function (require, module, exports) {
    'use strict'
    const internalObjectKeys = require('../internals/object-keys-internal')
    const enumBugKeys = require('../internals/enum-bug-keys')

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    module.exports = Object.keys || function keys (O) {
      return internalObjectKeys(O, enumBugKeys)
    }
  }, { '../internals/enum-bug-keys': 74, '../internals/object-keys-internal': 132 }],
  134: [function (require, module, exports) {
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
  135: [function (require, module, exports) {
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
  }, { '../internals/function-call': 82, '../internals/is-callable': 102, '../internals/is-object': 106 }],
  136: [function (require, module, exports) {
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
  }, { '../internals/an-object': 57, '../internals/function-uncurry-this': 86, '../internals/get-built-in': 87, '../internals/object-get-own-property-names': 128, '../internals/object-get-own-property-symbols': 129 }],
  137: [function (require, module, exports) {
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
  }, { '../internals/fails': 78, '../internals/global-this': 93 }],
  138: [function (require, module, exports) {
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
  }, { '../internals/an-object': 57 }],
  139: [function (require, module, exports) {
    'use strict'
    const isNullOrUndefined = require('../internals/is-null-or-undefined')

    const $TypeError = TypeError

    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    module.exports = function (it) {
      if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it)
      return it
    }
  }, { '../internals/is-null-or-undefined': 105 }],
  140: [function (require, module, exports) {
    'use strict'
    // `SameValueZero` abstract operation
    // https://tc39.es/ecma262/#sec-samevaluezero
    module.exports = function (x, y) {
      // eslint-disable-next-line no-self-compare -- NaN check
      return x === y || x !== x && y !== y
    }
  }, {}],
  141: [function (require, module, exports) {
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
  }, { '../internals/set-helpers': 143, '../internals/set-iterate': 148 }],
  142: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/get-set-record': 92, '../internals/iterate-simple': 109, '../internals/set-clone': 141, '../internals/set-helpers': 143, '../internals/set-iterate': 148, '../internals/set-size': 149 }],
  143: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 86 }],
  144: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/get-set-record': 92, '../internals/iterate-simple': 109, '../internals/set-helpers': 143, '../internals/set-iterate': 148, '../internals/set-size': 149 }],
  145: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/get-set-record': 92, '../internals/iterate-simple': 109, '../internals/iterator-close': 113, '../internals/set-helpers': 143, '../internals/set-iterate': 148, '../internals/set-size': 149 }],
  146: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/get-set-record': 92, '../internals/set-iterate': 148, '../internals/set-size': 149 }],
  147: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/get-set-record': 92, '../internals/iterate-simple': 109, '../internals/iterator-close': 113, '../internals/set-helpers': 143, '../internals/set-size': 149 }],
  148: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 86, '../internals/iterate-simple': 109, '../internals/set-helpers': 143 }],
  149: [function (require, module, exports) {
    'use strict'
    const uncurryThisAccessor = require('../internals/function-uncurry-this-accessor')
    const SetHelpers = require('../internals/set-helpers')

    module.exports = uncurryThisAccessor(SetHelpers.proto, 'size', 'get') || function (set) {
      return set.size
    }
  }, { '../internals/function-uncurry-this-accessor': 84, '../internals/set-helpers': 143 }],
  150: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/get-set-record': 92, '../internals/iterate-simple': 109, '../internals/set-clone': 141, '../internals/set-helpers': 143 }],
  151: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/get-set-record': 92, '../internals/iterate-simple': 109, '../internals/set-clone': 141, '../internals/set-helpers': 143 }],
  152: [function (require, module, exports) {
    'use strict'
    const shared = require('../internals/shared')
    const uid = require('../internals/uid')

    const keys = shared('keys')

    module.exports = function (key) {
      return keys[key] || (keys[key] = uid(key))
    }
  }, { '../internals/shared': 154, '../internals/uid': 167 }],
  153: [function (require, module, exports) {
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
  }, { '../internals/define-global-property': 71, '../internals/global-this': 93, '../internals/is-pure': 107 }],
  154: [function (require, module, exports) {
    'use strict'
    const store = require('../internals/shared-store')
    // eslint-disable-next-line es/no-object-create -- safe
    const create = Object.create || Object

    module.exports = function (key, value) {
      return store[key] || (store[key] = value || create(null))
    }
  }, { '../internals/shared-store': 153 }],
  155: [function (require, module, exports) {
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
  }, { '../internals/environment-v8-version': 76, '../internals/fails': 78, '../internals/global-this': 93 }],
  156: [function (require, module, exports) {
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
  }, { '../internals/to-integer-or-infinity': 158 }],
  157: [function (require, module, exports) {
    'use strict'
    // toObject with fallback for non-array-like ES3 strings
    const IndexedObject = require('../internals/indexed-object')
    const requireObjectCoercible = require('../internals/require-object-coercible')

    module.exports = function (it) {
      return IndexedObject(requireObjectCoercible(it))
    }
  }, { '../internals/indexed-object': 98, '../internals/require-object-coercible': 139 }],
  158: [function (require, module, exports) {
    'use strict'
    const trunc = require('../internals/math-trunc')

    // `ToIntegerOrInfinity` abstract operation
    // https://tc39.es/ecma262/#sec-tointegerorinfinity
    module.exports = function (argument) {
      const number = +argument
      // eslint-disable-next-line no-self-compare -- NaN check
      return number !== number || number === 0 ? 0 : trunc(number)
    }
  }, { '../internals/math-trunc': 123 }],
  159: [function (require, module, exports) {
    'use strict'
    const toIntegerOrInfinity = require('../internals/to-integer-or-infinity')

    const min = Math.min

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    module.exports = function (argument) {
      const len = toIntegerOrInfinity(argument)
      return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0 // 2 ** 53 - 1 == 9007199254740991
    }
  }, { '../internals/to-integer-or-infinity': 158 }],
  160: [function (require, module, exports) {
    'use strict'
    const requireObjectCoercible = require('../internals/require-object-coercible')

    const $Object = Object

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    module.exports = function (argument) {
      return $Object(requireObjectCoercible(argument))
    }
  }, { '../internals/require-object-coercible': 139 }],
  161: [function (require, module, exports) {
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
  }, { '../internals/function-call': 82, '../internals/get-method': 91, '../internals/is-object': 106, '../internals/is-symbol': 108, '../internals/ordinary-to-primitive': 135, '../internals/well-known-symbol': 173 }],
  162: [function (require, module, exports) {
    'use strict'
    const toPrimitive = require('../internals/to-primitive')
    const isSymbol = require('../internals/is-symbol')

    // `ToPropertyKey` abstract operation
    // https://tc39.es/ecma262/#sec-topropertykey
    module.exports = function (argument) {
      const key = toPrimitive(argument, 'string')
      return isSymbol(key) ? key : key + ''
    }
  }, { '../internals/is-symbol': 108, '../internals/to-primitive': 161 }],
  163: [function (require, module, exports) {
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
  }, { '../internals/get-built-in': 87, '../internals/is-callable': 102, '../internals/is-iterable': 104, '../internals/is-object': 106 }],
  164: [function (require, module, exports) {
    'use strict'
    const wellKnownSymbol = require('../internals/well-known-symbol')

    const TO_STRING_TAG = wellKnownSymbol('toStringTag')
    const test = {}
    // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
    test[TO_STRING_TAG] = 'z'

    module.exports = String(test) === '[object z]'
  }, { '../internals/well-known-symbol': 173 }],
  165: [function (require, module, exports) {
    'use strict'
    const classof = require('../internals/classof')

    const $String = String

    module.exports = function (argument) {
      if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string')
      return $String(argument)
    }
  }, { '../internals/classof': 61 }],
  166: [function (require, module, exports) {
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
  167: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    let id = 0
    const postfix = Math.random()
    const toString = uncurryThis(1.1.toString)

    module.exports = function (key) {
      return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36)
    }
  }, { '../internals/function-uncurry-this': 86 }],
  168: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-symbol -- required for testing */
    const NATIVE_SYMBOL = require('../internals/symbol-constructor-detection')

    module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator === 'symbol'
  }, { '../internals/symbol-constructor-detection': 155 }],
  169: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 72, '../internals/fails': 78 }],
  170: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const isCallable = require('../internals/is-callable')

    const WeakMap = globalThis.WeakMap

    module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap))
  }, { '../internals/global-this': 93, '../internals/is-callable': 102 }],
  171: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 86 }],
  172: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 86 }],
  173: [function (require, module, exports) {
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
  }, { '../internals/global-this': 93, '../internals/has-own-property': 94, '../internals/shared': 154, '../internals/symbol-constructor-detection': 155, '../internals/uid': 167, '../internals/use-symbol-as-uid': 168 }],
  174: [function (require, module, exports) {
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
  }, { '../internals/add-to-unscopables': 55, '../internals/array-includes': 58, '../internals/export': 77, '../internals/fails': 78 }],
  175: [function (require, module, exports) {
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
  }, { '../internals/an-instance': 56, '../internals/an-object': 57, '../internals/create-property': 67, '../internals/define-built-in-accessor': 68, '../internals/descriptors': 72, '../internals/export': 77, '../internals/fails': 78, '../internals/global-this': 93, '../internals/has-own-property': 94, '../internals/is-callable': 102, '../internals/is-pure': 107, '../internals/iterators-core': 117, '../internals/object-get-prototype-of': 130, '../internals/well-known-symbol': 173 }],
  176: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/an-object': 57, '../internals/export': 77, '../internals/function-call': 82, '../internals/get-iterator-direct': 88, '../internals/iterate': 110, '../internals/iterator-close': 113, '../internals/iterator-helper-without-closing-on-early-error': 116 }],
  177: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/an-object': 57, '../internals/call-with-safe-iteration-closing': 59, '../internals/export': 77, '../internals/function-call': 82, '../internals/get-iterator-direct': 88, '../internals/is-pure': 107, '../internals/iterator-close': 113, '../internals/iterator-create-proxy': 114, '../internals/iterator-helper-throws-on-invalid-iterator': 115, '../internals/iterator-helper-without-closing-on-early-error': 116 }],
  178: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/an-object': 57, '../internals/export': 77, '../internals/function-call': 82, '../internals/get-iterator-direct': 88, '../internals/iterate': 110, '../internals/iterator-close': 113, '../internals/iterator-helper-without-closing-on-early-error': 116 }],
  179: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/an-object': 57, '../internals/export': 77, '../internals/function-call': 82, '../internals/get-iterator-direct': 88, '../internals/iterate': 110, '../internals/iterator-close': 113, '../internals/iterator-helper-without-closing-on-early-error': 116 }],
  180: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/an-object': 57, '../internals/call-with-safe-iteration-closing': 59, '../internals/export': 77, '../internals/function-call': 82, '../internals/get-iterator-direct': 88, '../internals/is-pure': 107, '../internals/iterator-close': 113, '../internals/iterator-create-proxy': 114, '../internals/iterator-helper-throws-on-invalid-iterator': 115, '../internals/iterator-helper-without-closing-on-early-error': 116 }],
  181: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/an-object': 57, '../internals/export': 77, '../internals/fails': 78, '../internals/function-apply': 79, '../internals/get-iterator-direct': 88, '../internals/iterate': 110, '../internals/iterator-close': 113, '../internals/iterator-helper-without-closing-on-early-error': 116 }],
  182: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/an-object': 57, '../internals/export': 77, '../internals/function-call': 82, '../internals/get-iterator-direct': 88, '../internals/iterate': 110, '../internals/iterator-close': 113, '../internals/iterator-helper-without-closing-on-early-error': 116 }],
  183: [function (require, module, exports) {
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
  }, { '../internals/define-built-in-accessor': 68, '../internals/descriptors': 72, '../internals/regexp-flags': 138, '../internals/regexp-flags-detection': 137 }],
  184: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.constructor')
  }, { '../modules/es.iterator.constructor': 175 }],
  185: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.every')
  }, { '../modules/es.iterator.every': 176 }],
  186: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.filter')
  }, { '../modules/es.iterator.filter': 177 }],
  187: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.find')
  }, { '../modules/es.iterator.find': 178 }],
  188: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.for-each')
  }, { '../modules/es.iterator.for-each': 179 }],
  189: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.map')
  }, { '../modules/es.iterator.map': 180 }],
  190: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.reduce')
  }, { '../modules/es.iterator.reduce': 181 }],
  191: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.some')
  }, { '../modules/es.iterator.some': 182 }],
  192: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/map-helpers': 121 }],
  193: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/map-iterate': 122 }],
  194: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/map-helpers': 121, '../internals/map-iterate': 122 }],
  195: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/map-iterate': 122 }],
  196: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/map-iterate': 122 }],
  197: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/map-iterate': 122, '../internals/same-value-zero': 140 }],
  198: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/map-iterate': 122 }],
  199: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/map-helpers': 121, '../internals/map-iterate': 122 }],
  200: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/map-helpers': 121, '../internals/map-iterate': 122 }],
  201: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/iterate': 110, '../internals/map-helpers': 121 }],
  202: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/a-map': 51, '../internals/export': 77, '../internals/map-iterate': 122 }],
  203: [function (require, module, exports) {
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
  }, { '../internals/a-map': 51, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/map-iterate': 122 }],
  204: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/a-map': 51, '../internals/export': 77, '../internals/map-helpers': 121 }],
  205: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/export': 77, '../internals/set-helpers': 143 }],
  206: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/export': 77, '../internals/set-helpers': 143 }],
  207: [function (require, module, exports) {
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
  }, { '../internals/export': 77, '../internals/function-call': 82, '../internals/set-difference': 142, '../internals/to-set-like': 163 }],
  208: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/set-iterate': 148 }],
  209: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/set-helpers': 143, '../internals/set-iterate': 148 }],
  210: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/set-iterate': 148 }],
  211: [function (require, module, exports) {
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
  }, { '../internals/export': 77, '../internals/function-call': 82, '../internals/set-intersection': 144, '../internals/to-set-like': 163 }],
  212: [function (require, module, exports) {
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
  }, { '../internals/export': 77, '../internals/function-call': 82, '../internals/set-is-disjoint-from': 145, '../internals/to-set-like': 163 }],
  213: [function (require, module, exports) {
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
  }, { '../internals/export': 77, '../internals/function-call': 82, '../internals/set-is-subset-of': 146, '../internals/to-set-like': 163 }],
  214: [function (require, module, exports) {
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
  }, { '../internals/export': 77, '../internals/function-call': 82, '../internals/set-is-superset-of': 147, '../internals/to-set-like': 163 }],
  215: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/export': 77, '../internals/function-uncurry-this': 86, '../internals/set-iterate': 148, '../internals/to-string': 165 }],
  216: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/set-helpers': 143, '../internals/set-iterate': 148 }],
  217: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 50, '../internals/a-set': 52, '../internals/export': 77, '../internals/set-iterate': 148 }],
  218: [function (require, module, exports) {
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
  }, { '../internals/a-set': 52, '../internals/export': 77, '../internals/function-bind-context': 80, '../internals/set-iterate': 148 }],
  219: [function (require, module, exports) {
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
  }, { '../internals/export': 77, '../internals/function-call': 82, '../internals/set-symmetric-difference': 150, '../internals/to-set-like': 163 }],
  220: [function (require, module, exports) {
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
  }, { '../internals/export': 77, '../internals/function-call': 82, '../internals/set-union': 151, '../internals/to-set-like': 163 }],
  221: [function (require, module, exports) {
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
  }, { '../internals/a-weak-map': 53, '../internals/export': 77, '../internals/weak-map-helpers': 171 }],
  222: [function (require, module, exports) {
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
  }, { '../internals/a-weak-set': 54, '../internals/export': 77, '../internals/weak-set-helpers': 172 }],
  223: [function (require, module, exports) {
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
  }, { '../internals/a-weak-set': 54, '../internals/export': 77, '../internals/weak-set-helpers': 172 }],
  224: [function (require, module, exports) {
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
  }, { boolbase: 35 }],
  225: [function (require, module, exports) {
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
  }, { './general.js': 226, './helpers/querying.js': 228, './helpers/selectors.js': 229, './pseudo-selectors/subselects.js': 235, boolbase: 35, 'css-what': 236 }],
  226: [function (require, module, exports) {
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
  }, { './attributes.js': 224, './helpers/querying.js': 228, './pseudo-selectors/index.js': 233, 'css-what': 236 }],
  227: [function (require, module, exports) {
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
  }, { './querying.js': 228 }],
  228: [function (require, module, exports) {
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
  229: [function (require, module, exports) {
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
  }, { 'css-what': 236 }],
  230: [function (require, module, exports) {
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
  }, { './compile.js': 225, './helpers/querying.js': 228, './pseudo-selectors/index.js': 233, boolbase: 35, 'css-what': 236, domutils: 36 }],
  231: [function (require, module, exports) {
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
  232: [function (require, module, exports) {
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
  }, { '../helpers/cache.js': 227, '../helpers/querying.js': 228, boolbase: 35, 'nth-check': 241 }],
  233: [function (require, module, exports) {
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
  }, { './aliases.js': 231, './filters.js': 232, './pseudos.js': 234, './subselects.js': 235, 'css-what': 236 }],
  234: [function (require, module, exports) {
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
  235: [function (require, module, exports) {
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
  }, { '../helpers/cache.js': 227, '../helpers/querying.js': 228, '../helpers/selectors.js': 229, boolbase: 35 }],
  236: [function (require, module, exports) {
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
  }, { './parse.js': 237, './stringify.js': 238, './types.js': 239 }],
  237: [function (require, module, exports) {
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
  }, { './types.js': 239 }],
  238: [function (require, module, exports) {
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
  }, { './types.js': 239 }],
  239: [function (require, module, exports) {
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
  240: [function (require, module, exports) {
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
  }, { boolbase: 35 }],
  241: [function (require, module, exports) {
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
  }, { './compile.js': 240, './parse.js': 242 }],
  242: [function (require, module, exports) {
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
  243: [function (require, module, exports) {
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
  244: [function (require, module, exports) {
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
  }, { 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.filter.js': 186, 'core-js/modules/esnext.iterator.map.js': 189 }],
  245: [function (require, module, exports) {
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
  }, { './mergeObjectsBase': 250 }],
  246: [function (require, module, exports) {
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
  }, { './isInstanceObject': 248 }],
  247: [function (require, module, exports) {
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
  }, { 'core-js/modules/es.regexp.flags.js': 183, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.every.js': 185, 'core-js/modules/esnext.iterator.some.js': 191, 'core-js/modules/esnext.map.delete-all.js': 192, 'core-js/modules/esnext.map.every.js': 193, 'core-js/modules/esnext.map.filter.js': 194, 'core-js/modules/esnext.map.find-key.js': 195, 'core-js/modules/esnext.map.find.js': 196, 'core-js/modules/esnext.map.includes.js': 197, 'core-js/modules/esnext.map.key-of.js': 198, 'core-js/modules/esnext.map.map-keys.js': 199, 'core-js/modules/esnext.map.map-values.js': 200, 'core-js/modules/esnext.map.merge.js': 201, 'core-js/modules/esnext.map.reduce.js': 202, 'core-js/modules/esnext.map.some.js': 203, 'core-js/modules/esnext.map.update.js': 204, 'core-js/modules/esnext.set.add-all.js': 205, 'core-js/modules/esnext.set.delete-all.js': 206, 'core-js/modules/esnext.set.difference.js': 207, 'core-js/modules/esnext.set.every.js': 208, 'core-js/modules/esnext.set.filter.js': 209, 'core-js/modules/esnext.set.find.js': 210, 'core-js/modules/esnext.set.intersection.js': 211, 'core-js/modules/esnext.set.is-disjoint-from.js': 212, 'core-js/modules/esnext.set.is-subset-of.js': 213, 'core-js/modules/esnext.set.is-superset-of.js': 214, 'core-js/modules/esnext.set.join.js': 215, 'core-js/modules/esnext.set.map.js': 216, 'core-js/modules/esnext.set.reduce.js': 217, 'core-js/modules/esnext.set.some.js': 218, 'core-js/modules/esnext.set.symmetric-difference.js': 219, 'core-js/modules/esnext.set.union.js': 220, 'core-js/modules/esnext.weak-map.delete-all.js': 221, 'core-js/modules/esnext.weak-set.add-all.js': 222, 'core-js/modules/esnext.weak-set.delete-all.js': 223 }],
  248: [function (require, module, exports) {
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
  }, { './isObject': 249, './objectKeys': 251, 'core-js/modules/es.array.includes.js': 174 }],
  249: [function (require, module, exports) {
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
  250: [function (require, module, exports) {
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
  }, { '../functions/relevancyFilter': 244, './isCloneable': 246, './reduceObject': 252, './setValue': 253, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.find.js': 187, 'core-js/modules/esnext.iterator.map.js': 189, 'core-js/modules/esnext.iterator.reduce.js': 190 }],
  251: [function (require, module, exports) {
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
  }, { './isObject': 249 }],
  252: [function (require, module, exports) {
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
  }, { '../functions/callWithParams': 243, './objectKeys': 251, 'core-js/modules/esnext.iterator.constructor.js': 184, 'core-js/modules/esnext.iterator.reduce.js': 190 }],
  253: [function (require, module, exports) {
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
}, {}, [15])

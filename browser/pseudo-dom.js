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
  }, { '../services/EventService': 12 }],
  2: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    /**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    /**
 *
 * @type {PseudoHTMLElement}
 */
    const HTMLElementService_1 = require('../services/HTMLElementService')
    /**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement (which is not in the document until it is appended)
 */
    class PseudoHTMLDocument extends HTMLElementService_1.HTMLElementService {
      /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @constructor
   */
      constructor () {
        super()
        const html = new HTMLElementService_1.HTMLElementService({
          tagName: 'html'
        })
        this.appendChild(html)
        /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */
        this.head = new HTMLElementService_1.HTMLElementService({
          tagName: 'head'
        })
        html.appendChild(this.head)
        /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */
        this.body = new HTMLElementService_1.HTMLElementService({
          tagName: 'body'
        })
        html.appendChild(this.body)
      }

      /**
   * Create and return a PseudoHTMLElement, which is not added to the document until it is appended somewhere
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */
      createElement (tagName = 'div') {
        // Like the DOM, the new element is not added anywhere: it has no parent until it is appended
        return new HTMLElementService_1.HTMLElementService({
          tagName
        })
      }
    }
    exports.default = PseudoHTMLDocument
  }, { '../services/HTMLElementService': 14 }],
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
  }, { 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList': 23, 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.map.js': 134 }],
  4: [function (require, module, exports) {
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
  }, { '../classes/PseudoHTMLDocument': 2, '../services/ElementService': 11, '../services/EventTargetService': 13, '../services/HTMLElementService': 14, '../services/NodeService': 16 }],
  5: [function (require, module, exports) {
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
  6: [function (require, module, exports) {
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
  7: [function (require, module, exports) {
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
  }, { './getParentNodes': 6, 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.filter.js': 131 }],
  8: [function (require, module, exports) {
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
    exports.PseudoHTMLDocument = exports.PseudoHTMLElement = exports.PseudoElement = exports.PseudoNode = exports.PseudoEventTarget = exports.PseudoEvent = exports.generateDocument = void 0
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
    /**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
    const pseudoDom = {
      generateDocument: generateDocument_1.default,
      PseudoEvent: EventService_1.EventService,
      PseudoEventTarget: EventTargetService_1.default,
      PseudoNode: NodeService_1.NodeService,
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
  }, { './classes/PseudoHTMLDocument': 2, './factories/generateDocument': 4, './services/ElementService': 11, './services/EventService': 12, './services/EventTargetService': 13, './services/HTMLElementService': 14, './services/NodeService': 16 }],
  9: [function (require, module, exports) {
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
  }, { './NodeService': 16 }],
  10: [function (require, module, exports) {
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
  }, { 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.filter.js': 131, 'core-js/modules/esnext.iterator.for-each.js': 133, 'core-js/modules/esnext.iterator.map.js': 134 }],
  11: [function (require, module, exports) {
    'use strict'

    require('core-js/modules/esnext.iterator.constructor.js')
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
    const EventService_1 = require('./EventService')
    const NodeService_1 = require('./NodeService')
    const AttrService_1 = require('./AttrService')
    const DOMTokenListService_1 = require('./DOMTokenListService')
    const NamedNodeMapService_1 = require('./NamedNodeMapService')
    const getParentNodesFromAttribute_1 = __importDefault(require('../functions/getParentNodesFromAttribute'))
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

      get tagName () {
        return this.tag
      }

      get nodeType () {
        return NodeService_1.NodeService.ELEMENT_NODE
      }

      get attributes () {
        return new NamedNodeMapService_1.NamedNodeMapService(this.attributeList.map(({
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
            if (/^(submit|image)$/i.test(this.type || '')) {
              // Clicking a submit button submits the form it is in: the form gets a submit event, which can be cancelled
              callback = event => {
                const forms = (0, getParentNodesFromAttribute_1.default)('tagName', 'form', this)
                if (forms.length) {
                  forms[forms.length - 1].dispatchEvent(new EventService_1.EventService('submit', {
                    bubbles: true,
                    cancelable: true
                  }))
                }
              }
              super.setDefaultEvent('click', callback)
              this.defaultEventApplied = true
            }
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
        const found = this.attributeList.find(({
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
  }, { '../functions/getParentNodesFromAttribute': 7, './AttrService': 9, './DOMTokenListService': 10, './EventService': 12, './NamedNodeMapService': 15, './NodeService': 16, 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.find.js': 132, 'core-js/modules/esnext.iterator.for-each.js': 133, 'core-js/modules/esnext.iterator.map.js': 134, 'core-js/modules/esnext.iterator.some.js': 136 }],
  12: [function (require, module, exports) {
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
          isTrusted: true,
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
  13: [function (require, module, exports) {
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
  }, { '../classes/PseudoEventListener': 1, '../functions/getParentNodes': 6, './EventService': 12, 'collect-your-stuff/dist/collections/linked-list/LinkedList': 21, 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.filter.js': 131, 'core-js/modules/esnext.iterator.find.js': 132, 'core-js/modules/esnext.iterator.for-each.js': 133, 'core-js/modules/esnext.iterator.map.js': 134, 'core-js/modules/esnext.iterator.some.js': 136 }],
  14: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.HTMLElementService = void 0
    const ElementService_1 = require('./ElementService')
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
    }
    exports.HTMLElementService = HTMLElementService
  }, { './ElementService': 11 }],
  15: [function (require, module, exports) {
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
  }, { 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.find.js': 132 }],
  16: [function (require, module, exports) {
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
    exports.NodeService = void 0
    /**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    const generateNodeList_1 = __importDefault(require('../factories/generateNodeList'))
    const TreeLinker_1 = require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker')
    const EventTargetService_1 = __importDefault(require('./EventTargetService'))
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
        this.nodeValueStore = ''
        this.textContentStore = ''
        this.nodeNameValue = ''
        this.children = (0, generateNodeList_1.default)()
        this.parent = null
        this.listLinker = null
      }

      get baseURI () {
        return window.location || '/'
      }

      get childNodes () {
        return this.children
      }

      get firstChild () {
        return this.children.first ? this.children.first.data : null
      }

      get isConnected () {
        return !!this.parent
      }

      get lastChild () {
        return this.children.last ? this.children.last.data : null
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
        return null
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
        return this.textContentStore
      }

      set textContent (text) {
        this.textContentStore = text
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
   * Called each time a node has been inserted as a child of this node, so that nodes which need to react to children
   * (for example elements applying default events) can do so.
   * @param {NodeService} child The node which was inserted
   */
      childInserted (child) {}
      /**
   * Not implemented yet.
   * @throws {Error}
   */
      cloneNode (deep = false) {
        throw new Error(`NodeService.cloneNode(${deep}) is not implemented yet.`)
      }

      /**
   * Not implemented yet.
   * @throws {Error}
   */
      compareDocumentPosition (otherNode) {
        throw new Error('NodeService.compareDocumentPosition() is not implemented yet.')
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
        return this.children.length > 0
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
        this.children.insertBefore(referenceNode ? referenceNode.listLinker : null, linker)
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
   * Not implemented yet.
   * @throws {Error}
   */
      isEqualNode (otherNode) {
        throw new Error('NodeService.isEqualNode() is not implemented yet.')
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

      normalize () {}
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
        this.children.remove(removed.listLinker)
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
  }, { '../factories/generateNodeList': 5, './EventTargetService': 13, 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker': 24 }],
  17: [function (require, module, exports) {
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
  }, { 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.reduce.js': 135 }],
  18: [function (require, module, exports) {
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
  }, { '../../recipes/ArrayIterator': 25, './ArrayElement': 17 }],
  19: [function (require, module, exports) {
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
  }, { '../linked-list/Linker': 22, 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.reduce.js': 135 }],
  20: [function (require, module, exports) {
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
  }, { '../../recipes/DoubleLinkerIterator': 26, '../linked-list/LinkedList': 21, './DoubleLinker': 19, 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.for-each.js': 133 }],
  21: [function (require, module, exports) {
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
  }, { '../../recipes/LinkerIterator': 27, '../arrayable/Arrayable': 18, './Linker': 22 }],
  22: [function (require, module, exports) {
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
  }, { '../arrayable/ArrayElement': 17, 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.reduce.js': 135 }],
  23: [function (require, module, exports) {
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
  }, { '../../recipes/TreeLinkerIterator': 28, '../doubly-linked-list/DoublyLinkedList': 20, './TreeLinker': 24, 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.for-each.js': 133 }],
  24: [function (require, module, exports) {
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
  }, { '../doubly-linked-list/DoubleLinker': 19, './LinkedTreeList': 23, 'core-js/modules/esnext.iterator.constructor.js': 130, 'core-js/modules/esnext.iterator.map.js': 134 }],
  25: [function (require, module, exports) {
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
  26: [function (require, module, exports) {
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
  27: [function (require, module, exports) {
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
  28: [function (require, module, exports) {
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
  }, { '../services/parseTreeNext': 29 }],
  29: [function (require, module, exports) {
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
  30: [function (require, module, exports) {
    'use strict'
    const isCallable = require('../internals/is-callable')
    const tryToString = require('../internals/try-to-string')

    const $TypeError = TypeError

    // `Assert: IsCallable(argument) is true`
    module.exports = function (argument) {
      if (isCallable(argument)) return argument
      throw new $TypeError(tryToString(argument) + ' is not a function')
    }
  }, { '../internals/is-callable': 74, '../internals/try-to-string': 117 }],
  31: [function (require, module, exports) {
    'use strict'
    const isPrototypeOf = require('../internals/object-is-prototype-of')

    const $TypeError = TypeError

    module.exports = function (it, Prototype) {
      if (isPrototypeOf(Prototype, it)) return it
      throw new $TypeError('Incorrect invocation')
    }
  }, { '../internals/object-is-prototype-of': 99 }],
  32: [function (require, module, exports) {
    'use strict'
    const isObject = require('../internals/is-object')

    const $String = String
    const $TypeError = TypeError

    // `Assert: Type(argument) is Object`
    module.exports = function (argument) {
      if (isObject(argument)) return argument
      throw new $TypeError($String(argument) + ' is not an object')
    }
  }, { '../internals/is-object': 77 }],
  33: [function (require, module, exports) {
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
  }, { '../internals/length-of-array-like': 89, '../internals/to-absolute-index': 110, '../internals/to-indexed-object': 111 }],
  34: [function (require, module, exports) {
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
  }, { '../internals/an-object': 32, '../internals/iterator-close': 83 }],
  35: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    const toString = uncurryThis({}.toString)
    const stringSlice = uncurryThis(''.slice)

    module.exports = function (it) {
      return stringSlice(toString(it), 8, -1)
    }
  }, { '../internals/function-uncurry-this': 59 }],
  36: [function (require, module, exports) {
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
  }, { '../internals/has-own-property': 66, '../internals/object-define-property': 94, '../internals/object-get-own-property-descriptor': 95, '../internals/own-keys': 104 }],
  37: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    module.exports = !fails(function () {
      function F () { /* empty */ }
      F.prototype.constructor = null
      // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
      return Object.getPrototypeOf(new F()) !== F.prototype
    })
  }, { '../internals/fails': 52 }],
  38: [function (require, module, exports) {
    'use strict'
    // `CreateIterResultObject` abstract operation
    // https://tc39.es/ecma262/#sec-createiterresultobject
    module.exports = function (value, done) {
      return { value, done }
    }
  }, {}],
  39: [function (require, module, exports) {
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
  }, { '../internals/create-property-descriptor': 40, '../internals/descriptors': 46, '../internals/object-define-property': 94 }],
  40: [function (require, module, exports) {
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
  41: [function (require, module, exports) {
    'use strict'
    const DESCRIPTORS = require('../internals/descriptors')
    const definePropertyModule = require('../internals/object-define-property')
    const createPropertyDescriptor = require('../internals/create-property-descriptor')

    module.exports = function (object, key, value) {
      if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value))
      else object[key] = value
    }
  }, { '../internals/create-property-descriptor': 40, '../internals/descriptors': 46, '../internals/object-define-property': 94 }],
  42: [function (require, module, exports) {
    'use strict'
    const makeBuiltIn = require('../internals/make-built-in')
    const defineProperty = require('../internals/object-define-property')

    module.exports = function (target, name, descriptor) {
      if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true })
      if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true })
      return defineProperty.f(target, name, descriptor)
    }
  }, { '../internals/make-built-in': 90, '../internals/object-define-property': 94 }],
  43: [function (require, module, exports) {
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
  }, { '../internals/define-global-property': 45, '../internals/is-callable': 74, '../internals/make-built-in': 90, '../internals/object-define-property': 94 }],
  44: [function (require, module, exports) {
    'use strict'
    const defineBuiltIn = require('../internals/define-built-in')

    module.exports = function (target, src, options) {
      for (const key in src) defineBuiltIn(target, key, src[key], options)
      return target
    }
  }, { '../internals/define-built-in': 43 }],
  45: [function (require, module, exports) {
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
  }, { '../internals/global-this': 65 }],
  46: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    // Detect IE8's incomplete defineProperty implementation
    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty({}, 1, { get: function () { return 7 } })[1] !== 7
    })
  }, { '../internals/fails': 52 }],
  47: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const isObject = require('../internals/is-object')

    const document = globalThis.document
    // typeof document.createElement is 'object' in old IE
    const EXISTS = isObject(document) && isObject(document.createElement)

    module.exports = function (it) {
      return EXISTS ? document.createElement(it) : {}
    }
  }, { '../internals/global-this': 65, '../internals/is-object': 77 }],
  48: [function (require, module, exports) {
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
  49: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')

    const navigator = globalThis.navigator
    const userAgent = navigator && navigator.userAgent

    module.exports = userAgent ? String(userAgent) : ''
  }, { '../internals/global-this': 65 }],
  50: [function (require, module, exports) {
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
  }, { '../internals/environment-user-agent': 49, '../internals/global-this': 65 }],
  51: [function (require, module, exports) {
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
  }, { '../internals/copy-constructor-properties': 36, '../internals/create-non-enumerable-property': 39, '../internals/define-built-in': 43, '../internals/define-global-property': 45, '../internals/global-this': 65, '../internals/is-forced': 75, '../internals/object-get-own-property-descriptor': 95 }],
  52: [function (require, module, exports) {
    'use strict'
    module.exports = function (exec) {
      try {
        return !!exec()
      } catch (error) {
        return true
      }
    }
  }, {}],
  53: [function (require, module, exports) {
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
  }, { '../internals/function-bind-native': 55 }],
  54: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 30, '../internals/function-bind-native': 55, '../internals/function-uncurry-this-clause': 58 }],
  55: [function (require, module, exports) {
    'use strict'
    const fails = require('../internals/fails')

    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-function-prototype-bind -- safe
      const test = function () { /* empty */ }.bind()
      // eslint-disable-next-line no-prototype-builtins -- safe
      return typeof test !== 'function' || test.hasOwnProperty('prototype')
    })
  }, { '../internals/fails': 52 }],
  56: [function (require, module, exports) {
    'use strict'
    const NATIVE_BIND = require('../internals/function-bind-native')

    const call = Function.prototype.call
    // eslint-disable-next-line es/no-function-prototype-bind -- safe
    module.exports = NATIVE_BIND
      ? call.bind(call)
      : function () {
        return call.apply(call, arguments)
      }
  }, { '../internals/function-bind-native': 55 }],
  57: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 46, '../internals/has-own-property': 66 }],
  58: [function (require, module, exports) {
    'use strict'
    const classofRaw = require('../internals/classof-raw')
    const uncurryThis = require('../internals/function-uncurry-this')

    module.exports = function (fn) {
      // Nashorn bug:
      //   https://github.com/zloirock/core-js/issues/1128
      //   https://github.com/zloirock/core-js/issues/1130
      if (classofRaw(fn) === 'Function') return uncurryThis(fn)
    }
  }, { '../internals/classof-raw': 35, '../internals/function-uncurry-this': 59 }],
  59: [function (require, module, exports) {
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
  }, { '../internals/function-bind-native': 55 }],
  60: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const isCallable = require('../internals/is-callable')

    const aFunction = function (argument) {
      return isCallable(argument) ? argument : undefined
    }

    module.exports = function (namespace, method) {
      return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method]
    }
  }, { '../internals/global-this': 65, '../internals/is-callable': 74 }],
  61: [function (require, module, exports) {
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
  62: [function (require, module, exports) {
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
  }, { '../internals/an-object': 32, '../internals/function-call': 56, '../internals/get-iterator-method-internal': 63, '../internals/is-callable': 74, '../internals/try-to-string': 117 }],
  63: [function (require, module, exports) {
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
  }, { '../internals/classof-raw': 35, '../internals/get-method': 64, '../internals/is-null-or-undefined': 76, '../internals/well-known-symbol': 122 }],
  64: [function (require, module, exports) {
    'use strict'
    const aCallable = require('../internals/a-callable')
    const isNullOrUndefined = require('../internals/is-null-or-undefined')

    // `GetMethod` abstract operation
    // https://tc39.es/ecma262/#sec-getmethod
    module.exports = function (V, P) {
      const func = V[P]
      return isNullOrUndefined(func) ? undefined : aCallable(func)
    }
  }, { '../internals/a-callable': 30, '../internals/is-null-or-undefined': 76 }],
  65: [function (require, module, exports) {
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
  66: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 59, '../internals/to-object': 114 }],
  67: [function (require, module, exports) {
    'use strict'
    module.exports = {}
  }, {}],
  68: [function (require, module, exports) {
    'use strict'
    const getBuiltIn = require('../internals/get-built-in')

    module.exports = getBuiltIn('document', 'documentElement')
  }, { '../internals/get-built-in': 60 }],
  69: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 46, '../internals/document-create-element': 47, '../internals/fails': 52 }],
  70: [function (require, module, exports) {
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
  }, { '../internals/classof-raw': 35, '../internals/fails': 52, '../internals/function-uncurry-this': 59 }],
  71: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 59, '../internals/is-callable': 74, '../internals/shared-store': 107 }],
  72: [function (require, module, exports) {
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
  }, { '../internals/create-non-enumerable-property': 39, '../internals/global-this': 65, '../internals/has-own-property': 66, '../internals/hidden-keys': 67, '../internals/is-object': 77, '../internals/shared-key': 106, '../internals/shared-store': 107, '../internals/weak-map-basic-detection': 121 }],
  73: [function (require, module, exports) {
    'use strict'
    const wellKnownSymbol = require('../internals/well-known-symbol')
    const Iterators = require('../internals/iterators')

    const ITERATOR = wellKnownSymbol('iterator')
    const ArrayPrototype = Array.prototype

    // check on default Array iterator
    module.exports = function (it) {
      return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it)
    }
  }, { '../internals/iterators': 88, '../internals/well-known-symbol': 122 }],
  74: [function (require, module, exports) {
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
  75: [function (require, module, exports) {
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
  }, { '../internals/fails': 52, '../internals/is-callable': 74 }],
  76: [function (require, module, exports) {
    'use strict'
    // we can't use just `it == null` since of `document.all` special case
    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
    module.exports = function (it) {
      return it === null || it === undefined
    }
  }, {}],
  77: [function (require, module, exports) {
    'use strict'
    const isCallable = require('../internals/is-callable')

    module.exports = function (it) {
      return typeof it === 'object' ? it !== null : isCallable(it)
    }
  }, { '../internals/is-callable': 74 }],
  78: [function (require, module, exports) {
    'use strict'
    module.exports = false
  }, {}],
  79: [function (require, module, exports) {
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
  }, { '../internals/get-built-in': 60, '../internals/is-callable': 74, '../internals/object-is-prototype-of': 99, '../internals/use-symbol-as-uid': 119 }],
  80: [function (require, module, exports) {
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
  }, { '../internals/an-object': 32, '../internals/function-bind-context': 54, '../internals/function-call': 56, '../internals/get-iterator-internal': 62, '../internals/get-iterator-method-internal': 63, '../internals/is-array-iterator-method': 73, '../internals/iterator-close': 83, '../internals/length-of-array-like': 89, '../internals/object-is-prototype-of': 99, '../internals/try-to-string': 117 }],
  81: [function (require, module, exports) {
    'use strict'
    // release references held by exhausted / closed iterator helpers to allow GC of the source chain
    module.exports = function (state) {
      state.iterator = state.next = state.nextHandler = state.mapper = state.predicate = state.inner =
    state.iterables = state.iters = state.openIters = state.padding = state.finishResults = state.buffer = null
    }
  }, {}],
  82: [function (require, module, exports) {
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
  }, { '../internals/iterator-close': 83 }],
  83: [function (require, module, exports) {
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
  }, { '../internals/an-object': 32, '../internals/function-call': 56, '../internals/get-method': 64 }],
  84: [function (require, module, exports) {
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
  }, { '../internals/create-iter-result-object': 38, '../internals/create-non-enumerable-property': 39, '../internals/define-built-ins': 44, '../internals/function-call': 56, '../internals/get-method': 64, '../internals/internal-state': 72, '../internals/iterator-cleanup-state': 81, '../internals/iterator-close': 83, '../internals/iterator-close-all': 82, '../internals/iterators-core': 87, '../internals/object-create': 92, '../internals/well-known-symbol': 122 }],
  85: [function (require, module, exports) {
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
  86: [function (require, module, exports) {
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
  }, { '../internals/global-this': 65 }],
  87: [function (require, module, exports) {
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
  }, { '../internals/define-built-in': 43, '../internals/fails': 52, '../internals/is-callable': 74, '../internals/is-object': 77, '../internals/is-pure': 78, '../internals/object-create': 92, '../internals/object-get-prototype-of': 98, '../internals/well-known-symbol': 122 }],
  88: [function (require, module, exports) {
    'use strict'
    module.exports = Object.create ? Object.create(null) : {}
  }, {}],
  89: [function (require, module, exports) {
    'use strict'
    const toLength = require('../internals/to-length')

    // `LengthOfArrayLike` abstract operation
    // https://tc39.es/ecma262/#sec-lengthofarraylike
    module.exports = function (obj) {
      return toLength(obj.length)
    }
  }, { '../internals/to-length': 113 }],
  90: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 46, '../internals/fails': 52, '../internals/function-name': 57, '../internals/function-uncurry-this': 59, '../internals/has-own-property': 66, '../internals/inspect-source': 71, '../internals/internal-state': 72, '../internals/is-callable': 74 }],
  91: [function (require, module, exports) {
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
  92: [function (require, module, exports) {
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
  }, { '../internals/an-object': 32, '../internals/document-create-element': 47, '../internals/enum-bug-keys': 48, '../internals/hidden-keys': 67, '../internals/html': 68, '../internals/object-define-properties': 93, '../internals/shared-key': 106 }],
  93: [function (require, module, exports) {
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
  }, { '../internals/an-object': 32, '../internals/descriptors': 46, '../internals/object-define-property': 94, '../internals/object-keys': 101, '../internals/to-indexed-object': 111, '../internals/v8-prototype-define-bug': 120 }],
  94: [function (require, module, exports) {
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
  }, { '../internals/an-object': 32, '../internals/descriptors': 46, '../internals/ie8-dom-define': 69, '../internals/to-property-key': 116, '../internals/v8-prototype-define-bug': 120 }],
  95: [function (require, module, exports) {
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
  }, { '../internals/create-property-descriptor': 40, '../internals/descriptors': 46, '../internals/function-call': 56, '../internals/has-own-property': 66, '../internals/ie8-dom-define': 69, '../internals/object-property-is-enumerable': 102, '../internals/to-indexed-object': 111, '../internals/to-property-key': 116 }],
  96: [function (require, module, exports) {
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
  }, { '../internals/enum-bug-keys': 48, '../internals/object-keys-internal': 100 }],
  97: [function (require, module, exports) {
    'use strict'
    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    exports.f = Object.getOwnPropertySymbols
  }, {}],
  98: [function (require, module, exports) {
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
  }, { '../internals/correct-prototype-getter': 37, '../internals/has-own-property': 66, '../internals/is-callable': 74, '../internals/shared-key': 106, '../internals/to-object': 114 }],
  99: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    module.exports = uncurryThis({}.isPrototypeOf)
  }, { '../internals/function-uncurry-this': 59 }],
  100: [function (require, module, exports) {
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
  }, { '../internals/array-includes': 33, '../internals/function-uncurry-this': 59, '../internals/has-own-property': 66, '../internals/hidden-keys': 67, '../internals/to-indexed-object': 111 }],
  101: [function (require, module, exports) {
    'use strict'
    const internalObjectKeys = require('../internals/object-keys-internal')
    const enumBugKeys = require('../internals/enum-bug-keys')

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    module.exports = Object.keys || function keys (O) {
      return internalObjectKeys(O, enumBugKeys)
    }
  }, { '../internals/enum-bug-keys': 48, '../internals/object-keys-internal': 100 }],
  102: [function (require, module, exports) {
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
  103: [function (require, module, exports) {
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
  }, { '../internals/function-call': 56, '../internals/is-callable': 74, '../internals/is-object': 77 }],
  104: [function (require, module, exports) {
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
  }, { '../internals/an-object': 32, '../internals/function-uncurry-this': 59, '../internals/get-built-in': 60, '../internals/object-get-own-property-names': 96, '../internals/object-get-own-property-symbols': 97 }],
  105: [function (require, module, exports) {
    'use strict'
    const isNullOrUndefined = require('../internals/is-null-or-undefined')

    const $TypeError = TypeError

    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    module.exports = function (it) {
      if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it)
      return it
    }
  }, { '../internals/is-null-or-undefined': 76 }],
  106: [function (require, module, exports) {
    'use strict'
    const shared = require('../internals/shared')
    const uid = require('../internals/uid')

    const keys = shared('keys')

    module.exports = function (key) {
      return keys[key] || (keys[key] = uid(key))
    }
  }, { '../internals/shared': 108, '../internals/uid': 118 }],
  107: [function (require, module, exports) {
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
  }, { '../internals/define-global-property': 45, '../internals/global-this': 65, '../internals/is-pure': 78 }],
  108: [function (require, module, exports) {
    'use strict'
    const store = require('../internals/shared-store')
    // eslint-disable-next-line es/no-object-create -- safe
    const create = Object.create || Object

    module.exports = function (key, value) {
      return store[key] || (store[key] = value || create(null))
    }
  }, { '../internals/shared-store': 107 }],
  109: [function (require, module, exports) {
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
  }, { '../internals/environment-v8-version': 50, '../internals/fails': 52, '../internals/global-this': 65 }],
  110: [function (require, module, exports) {
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
  }, { '../internals/to-integer-or-infinity': 112 }],
  111: [function (require, module, exports) {
    'use strict'
    // toObject with fallback for non-array-like ES3 strings
    const IndexedObject = require('../internals/indexed-object')
    const requireObjectCoercible = require('../internals/require-object-coercible')

    module.exports = function (it) {
      return IndexedObject(requireObjectCoercible(it))
    }
  }, { '../internals/indexed-object': 70, '../internals/require-object-coercible': 105 }],
  112: [function (require, module, exports) {
    'use strict'
    const trunc = require('../internals/math-trunc')

    // `ToIntegerOrInfinity` abstract operation
    // https://tc39.es/ecma262/#sec-tointegerorinfinity
    module.exports = function (argument) {
      const number = +argument
      // eslint-disable-next-line no-self-compare -- NaN check
      return number !== number || number === 0 ? 0 : trunc(number)
    }
  }, { '../internals/math-trunc': 91 }],
  113: [function (require, module, exports) {
    'use strict'
    const toIntegerOrInfinity = require('../internals/to-integer-or-infinity')

    const min = Math.min

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    module.exports = function (argument) {
      const len = toIntegerOrInfinity(argument)
      return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0 // 2 ** 53 - 1 == 9007199254740991
    }
  }, { '../internals/to-integer-or-infinity': 112 }],
  114: [function (require, module, exports) {
    'use strict'
    const requireObjectCoercible = require('../internals/require-object-coercible')

    const $Object = Object

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    module.exports = function (argument) {
      return $Object(requireObjectCoercible(argument))
    }
  }, { '../internals/require-object-coercible': 105 }],
  115: [function (require, module, exports) {
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
  }, { '../internals/function-call': 56, '../internals/get-method': 64, '../internals/is-object': 77, '../internals/is-symbol': 79, '../internals/ordinary-to-primitive': 103, '../internals/well-known-symbol': 122 }],
  116: [function (require, module, exports) {
    'use strict'
    const toPrimitive = require('../internals/to-primitive')
    const isSymbol = require('../internals/is-symbol')

    // `ToPropertyKey` abstract operation
    // https://tc39.es/ecma262/#sec-topropertykey
    module.exports = function (argument) {
      const key = toPrimitive(argument, 'string')
      return isSymbol(key) ? key : key + ''
    }
  }, { '../internals/is-symbol': 79, '../internals/to-primitive': 115 }],
  117: [function (require, module, exports) {
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
  118: [function (require, module, exports) {
    'use strict'
    const uncurryThis = require('../internals/function-uncurry-this')

    let id = 0
    const postfix = Math.random()
    const toString = uncurryThis(1.1.toString)

    module.exports = function (key) {
      return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36)
    }
  }, { '../internals/function-uncurry-this': 59 }],
  119: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-symbol -- required for testing */
    const NATIVE_SYMBOL = require('../internals/symbol-constructor-detection')

    module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator === 'symbol'
  }, { '../internals/symbol-constructor-detection': 109 }],
  120: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 46, '../internals/fails': 52 }],
  121: [function (require, module, exports) {
    'use strict'
    const globalThis = require('../internals/global-this')
    const isCallable = require('../internals/is-callable')

    const WeakMap = globalThis.WeakMap

    module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap))
  }, { '../internals/global-this': 65, '../internals/is-callable': 74 }],
  122: [function (require, module, exports) {
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
  }, { '../internals/global-this': 65, '../internals/has-own-property': 66, '../internals/shared': 108, '../internals/symbol-constructor-detection': 109, '../internals/uid': 118, '../internals/use-symbol-as-uid': 119 }],
  123: [function (require, module, exports) {
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
  }, { '../internals/an-instance': 31, '../internals/an-object': 32, '../internals/create-property': 41, '../internals/define-built-in-accessor': 42, '../internals/descriptors': 46, '../internals/export': 51, '../internals/fails': 52, '../internals/global-this': 65, '../internals/has-own-property': 66, '../internals/is-callable': 74, '../internals/is-pure': 78, '../internals/iterators-core': 87, '../internals/object-get-prototype-of': 98, '../internals/well-known-symbol': 122 }],
  124: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 30, '../internals/an-object': 32, '../internals/call-with-safe-iteration-closing': 34, '../internals/export': 51, '../internals/function-call': 56, '../internals/get-iterator-direct': 61, '../internals/is-pure': 78, '../internals/iterator-close': 83, '../internals/iterator-create-proxy': 84, '../internals/iterator-helper-throws-on-invalid-iterator': 85, '../internals/iterator-helper-without-closing-on-early-error': 86 }],
  125: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 30, '../internals/an-object': 32, '../internals/export': 51, '../internals/function-call': 56, '../internals/get-iterator-direct': 61, '../internals/iterate': 80, '../internals/iterator-close': 83, '../internals/iterator-helper-without-closing-on-early-error': 86 }],
  126: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 30, '../internals/an-object': 32, '../internals/export': 51, '../internals/function-call': 56, '../internals/get-iterator-direct': 61, '../internals/iterate': 80, '../internals/iterator-close': 83, '../internals/iterator-helper-without-closing-on-early-error': 86 }],
  127: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 30, '../internals/an-object': 32, '../internals/call-with-safe-iteration-closing': 34, '../internals/export': 51, '../internals/function-call': 56, '../internals/get-iterator-direct': 61, '../internals/is-pure': 78, '../internals/iterator-close': 83, '../internals/iterator-create-proxy': 84, '../internals/iterator-helper-throws-on-invalid-iterator': 85, '../internals/iterator-helper-without-closing-on-early-error': 86 }],
  128: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 30, '../internals/an-object': 32, '../internals/export': 51, '../internals/fails': 52, '../internals/function-apply': 53, '../internals/get-iterator-direct': 61, '../internals/iterate': 80, '../internals/iterator-close': 83, '../internals/iterator-helper-without-closing-on-early-error': 86 }],
  129: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 30, '../internals/an-object': 32, '../internals/export': 51, '../internals/function-call': 56, '../internals/get-iterator-direct': 61, '../internals/iterate': 80, '../internals/iterator-close': 83, '../internals/iterator-helper-without-closing-on-early-error': 86 }],
  130: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.constructor')
  }, { '../modules/es.iterator.constructor': 123 }],
  131: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.filter')
  }, { '../modules/es.iterator.filter': 124 }],
  132: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.find')
  }, { '../modules/es.iterator.find': 125 }],
  133: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.for-each')
  }, { '../modules/es.iterator.for-each': 126 }],
  134: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.map')
  }, { '../modules/es.iterator.map': 127 }],
  135: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.reduce')
  }, { '../modules/es.iterator.reduce': 128 }],
  136: [function (require, module, exports) {
    'use strict'
    // TODO: Remove from `core-js@4`
    require('../modules/es.iterator.some')
  }, { '../modules/es.iterator.some': 129 }]
}, {}, [8])

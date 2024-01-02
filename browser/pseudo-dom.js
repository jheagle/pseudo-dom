(function () { function r (e, n, t) { function o (i, f) { if (!n[i]) { if (!e[i]) { var c = typeof require === 'function' && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = 'MODULE_NOT_FOUND', a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = typeof require === 'function' && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.async-iterator.map.js')
    require('core-js/modules/esnext.iterator.map.js')
    require('core-js/modules/esnext.async-iterator.find.js')
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.find.js')
    var _PseudoNode = _interopRequireDefault(require('./PseudoNode'))
    var _generateNodeList = _interopRequireDefault(require('../factories/generateNodeList'))
    var _TreeLinker = _interopRequireDefault(require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

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
    class PseudoElement extends _PseudoNode.default {
      /**
   * Simulate the Element object when the Dom is not available
   * @param {Object} [elementOptions={}]
   * @param {string} [elementOptions.tagName='']
   * @param {array} [elementOptions.attributes=[]]
   * @param {PseudoNode|Object} [elementOptions.parent={}]
   * @param {Array} [elementOptions.children=[]]
   * @constructor
   */
      constructor () {
        const {
          tagName = '',
          attributes = [],
          parent = null,
          children = []
        } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        super()
        this.parent = parent
        this.children = (0, _generateNodeList.default)(_TreeLinker.default.fromArray(children).head)
        this.tagName = tagName
        this.attributes = attributes.concat([{
          name: 'className',
          value: ''
        }, {
          name: 'id',
          value: ''
        }, {
          name: 'innerHTML',
          value: ''
        }])
        /**
     * Map all incoming attributes to the attribute array and attach each as a property of this element
     */
        this.attributes.map(_ref => {
          const {
            name,
            value
          } = _ref
          // @ts-ignore
          this[name] = value
          return {
            name,
            value
          }
        })
        // this.classList = new DOMSettableTokenList(this.className)
        this.classList = this.className
      }

      get nodeType () {
        return _PseudoNode.default.ELEMENT_NODE
      }

      /**
   *
   * @returns {Function}
   */
      applyDefaultEvent () {
        let callback = event => undefined
        switch (this.tagName) {
          case 'form':
            this.addEventListener('submit', callback)
            break
          case 'button':
          case 'input':
            if (/^(submit|image)$/i.test(this.type || '')) {
              callback = event => {
                const forms = require('./PseudoEvent').getParentNodesFromAttribute('tagName', 'form', this)
                if (forms) {
                  forms[0].submit()
                }
              }
              super.setDefaultEvent('click', callback)
            }
        }
        return callback
      }

      /**
   *
   * @param {PseudoNode|PseudoElement} childElement
   * @returns {PseudoNode}
   */
      appendChild (childElement) {
        super.appendChild(childElement)
        childElement.applyDefaultEvent()
        return childElement
      }

      /**
   * Check if an attribute is assigned to this element.
   * @param {string} attributeName - The attribute name to check
   * @returns {boolean}
   */
      hasAttribute (attributeName) {
        return this.getAttribute(attributeName) !== 'undefined'
      }

      /**
   * Assign a new attribute or overwrite an assigned attribute with name and value.
   * @param {string} attributeName - The name key of the attribute to append
   * @param {string|Object} attributeValue - The value of the attribute to append
   * @returns {undefined}
   */
      setAttribute (attributeName, attributeValue) {
        if (this.hasAttribute(attributeName) || this[attributeName] === 'undefined') {
          // @ts-ignore
          this[attributeName] = attributeValue
          this.attributes.push({
            name: attributeName,
            value: attributeValue
          })
        }
        return undefined
      }

      /**
   * Retrieve the value of the specified attribute from the Element
   * @param {string} attributeName - A string representing the name of the attribute to be retrieved
   * @returns {string|Object}
   */
      getAttribute (attributeName) {
        return this.attributes.find(attribute => attribute.name === attributeName)
      }

      /**
   * Remove an assigned attribute from the Element
   * @param {string} attributeName - The string name of the attribute to be removed
   * @returns {null}
   */
      removeAttribute (attributeName) {
        if (this.hasAttribute(attributeName)) {
          delete this[attributeName]
          // TODO: how do we delete it as an attribute?
        }
        return null
      }
    }
    var _default = exports.default = PseudoElement
  }, { '../factories/generateNodeList': 11, './PseudoEvent': 2, './PseudoNode': 7, 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker': 23, 'core-js/modules/esnext.async-iterator.find.js': 130, 'core-js/modules/esnext.async-iterator.map.js': 132, 'core-js/modules/esnext.iterator.constructor.js': 134, 'core-js/modules/esnext.iterator.find.js': 135, 'core-js/modules/esnext.iterator.map.js': 137 }],
  2: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _getParentNodes = _interopRequireDefault(require('../functions/getParentNodes'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file Substitute for the DOM Event Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

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
 * @property {int} eventPhase - Indicates which phase of the event flow is being processed. Uses PseudoEvent constants.
 * @property {EventTarget|PseudoEventTarget} target - A reference to the target to which the event was originally
 * dispatched.
 * @property {int} timeStamp - The time at which the event was created (in milliseconds). By specification, this
 * value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this
 * to be a DomHighResTimeStamp instead.
 * @property {string} type - The name of the event (case-insensitive).
 * @property {boolean} isTrusted - Indicates whether the event was initiated by the browser (after a user
 * click for instance) or by a script (using an event creation method, like event.initEvent)
 */
    class PseudoEvent {
      /**
   *
   * @param {string} typeArg
   * @param {Object} [eventOptions={}]
   * @param {boolean} [eventOptions.bubbles=true]
   * @param {boolean} [eventOptions.cancelable=true]
   * @param {boolean} [eventOptions.composed=true]
   * @constructor
   */
      constructor () {
        const typeArg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
        const {
          bubbles = true,
          cancelable = true,
          composed = true
        } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
        this.properties = {
          bubbles: true,
          cancelable: true,
          composed: true,
          currentTarget: null,
          defaultPrevented: false,
          immediatePropagationStopped: false,
          propagationStopped: false,
          eventPhase: 0,
          target: null,
          timeStamp: Math.floor(Date.now() / 1000),
          type: '',
          isTrusted: true
        }
        this.setReadOnlyProperties({
          type: typeArg,
          bubbles: bubbles,
          cancelable: cancelable,
          composed: composed
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
          set currentTarget (target) {
            self.properties.currentTarget = target
          },
          set eventPhase (phase) {
            self.properties.eventPhase = phase
          },
          set target (target) {
            self.properties.target = target
          },
          get immediatePropagationStopped () {
            return self.properties.immediatePropagationStopped
          },
          get propagationStopped () {
            return self.properties.propagationStopped
          }
        }
      }

      /**
   * Return an array of targets that will have the event executed open them. The order is based on the eventPhase
   * @method
   * @returns {Array.<PseudoEventTarget>}
   */
      composedPath () {
        switch (this.eventPhase) {
          case PseudoEvent.CAPTURING_PHASE:
            return (0, _getParentNodes.default)(this.target)
          case PseudoEvent.BUBBLING_PHASE:
            return (0, _getParentNodes.default)(this.target).slice().reverse()
          case PseudoEvent.AT_TARGET:
            return [this.target]
          default:
            return []
        }
      }

      /**
   * Cancels the event (if it is cancelable).
   * @method
   * @returns {null}
   */
      preventDefault () {
        this.setReadOnlyProperties({
          defaultPrevented: true
        })
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

      setReadOnlyProperties () {
        const updateProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        this.properties = Object.assign({}, this.properties, updateProps)
        return this
      }
    }
    PseudoEvent.NONE = 0
    PseudoEvent.CAPTURING_PHASE = 1
    PseudoEvent.AT_TARGET = 2
    PseudoEvent.BUBBLING_PHASE = 3
    var _default = exports.default = PseudoEvent
  }, { '../functions/getParentNodes': 12 }],
  3: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _PseudoEvent = _interopRequireDefault(require('./PseudoEvent'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

    /**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventType
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
    class PseudoEventListener {
      constructor (eventType) {
        const {
          capture = false,
          once = false,
          passive = false
        } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
        const handleEvent = arguments.length > 2 ? arguments[2] : undefined
        this.eventOptions = {
          capture: false,
          once: false,
          passive: false
        }
        this.eventType = ''
        this.isDefault = false
        this.eventOptions = {
          capture,
          once,
          passive
        }
        this.eventType = eventType
        this.handler = handleEvent
      }

      get once () {
        return this.eventOptions.once
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
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doCapturePhase (event) {
        return event.eventPhase === _PseudoEvent.default.CAPTURING_PHASE && this.eventOptions.capture
      }

      /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doTargetPhase (event) {
        return event.eventPhase === _PseudoEvent.default.AT_TARGET
      }

      /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      doBubblePhase (event) {
        return event.eventPhase === _PseudoEvent.default.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
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
   * @method
   * @name PseudoEventListener#skipDefault
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      skipDefault (event) {
        return this.isDefault && event.defaultPrevented
      }

      /**
   * @method
   * @name PseudoEventListener#stopPropagation
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      stopPropagation (event) {
        return !this.doTargetPhase(event) && event.inner.propagationStopped
      }

      /**
   * @method
   * @name PseudoEventListener#nonPassiveHalt
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      nonPassiveHalt (event) {
        return !this.eventOptions.passive && (this.skipDefault(event) || event.inner.immediatePropagationStopped || this.stopPropagation(event))
      }

      /**
   * @method
   * @name PseudoEventListener#rejectEvent
   * @param {PseudoEvent} event
   * @returns {*|boolean}
   */
      rejectEvent (event) {
        return this.nonPassiveHalt(event) || this.skipPhase(event)
      }
    }
    var _default = exports.default = PseudoEventListener
  }, { './PseudoEvent': 2 }],
  4: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.async-iterator.for-each.js')
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.for-each.js')
    require('core-js/modules/esnext.async-iterator.reduce.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    var _PseudoEvent = _interopRequireDefault(require('./PseudoEvent'))
    var _PseudoEventListener = _interopRequireDefault(require('./PseudoEventListener'))
    var _Stack = _interopRequireDefault(require('collect-your-stuff/dist/collections/stack/Stack'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

    /**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {Object.<string, Array.<PseudoEventListener>>} listeners
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */
    class PseudoEventTarget {
      /**
   * @constructor
   */
      constructor () {
        this.listeners = {}
        this.defaultEvent = {}
      }

      /**
   *
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      runEvents (event) {
        if (!(event.type in this.listeners)) {
          return true
        }
        /**
     *
     * @type {Array<PseudoEventListener>}
     */
        const stack = this.listeners[event.type]
        let eventReturn = null
        if (this.listeners[event.type].empty()) {
          return eventReturn
        }
        let currentListener = this.listeners[event.type].top()
        if (currentListener === null) {
          return eventReturn
        }
        if (event.inner.immediatePropagationStopped || currentListener.task.rejectEvent(event)) {
          return eventReturn
        }
        // Temporary store the stack
        const runningListeners = new _Stack.default()
        currentListener = this.listeners[event.type].pop()
        while (currentListener !== null) {
          eventReturn = currentListener.task.handleEvent(event)
          if (currentListener.data.once) {
            return currentListener.task
          }
          runningListeners.push(currentListener)
          currentListener = this.listeners[event.type].top()
          if (currentListener === null) {
            return eventReturn
          }
          if (event.inner.immediatePropagationStopped || currentListener.task.rejectEvent(event)) {
            return eventReturn
          }
          currentListener = this.listeners[event.type].pop()
        }
        if (!runningListeners.empty()) {
          // Rebuild the stack
          const completedListener = runningListeners.pop()
          while (completedListener !== null) {
            this.listeners[event.type].push(completedListener)
          }
        }
        return eventReturn
      }

      /**
   *
   * @param {string} type
   * @param {Function} callback
   */
      setDefaultEvent (type, callback) {
        if (!(type in this.listeners)) {
          this.listeners[type] = new _Stack.default()
        }
        this.defaultEvent[type] = callback
      }

      /**
   *
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      runDefaultEvent (event) {
        if (event.defaultPrevented) {
          return false
        }
        this.defaultEvent[event.type](event)
      }

      /**
   *
   * @param {PseudoEvent} eventType
   * @returns {boolean}
   */
      startEvents (eventType) {
        /**
     * type PseudoEvent
     */
        const event = new _PseudoEvent.default(eventType)
        event.inner.target = this
        console.log('startEvents', event.type, event.target);
        [_PseudoEvent.default.CAPTURING_PHASE, _PseudoEvent.default.AT_TARGET, _PseudoEvent.default.BUBBLING_PHASE].forEach(phase => {
          let continueEvents = null
          if (phase === _PseudoEvent.default.AT_TARGET || !event.inner.propagationStopped) {
            event.inner.eventPhase = phase
            event.composedPath().forEach(target => {
              event.inner.currentTarget = target
              continueEvents = event.currentTarget.runEvents(event)
            })
          }
          if (event.eventPhase === _PseudoEvent.default.AT_TARGET && typeof continueEvents !== 'boolean' && this.defaultEvent[eventType]) {
            this.runDefaultEvent(event)
          }
        })
        return true
      }

      /**
   *
   * @param {string} type
   * @param {function|Object} callback
   * @param {boolean|Object} [useCapture=false]
   */
      addEventListener (type, callback) {
        const useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
        let options = {
          capture: false,
          once: false,
          passive: false
        }
        if (typeof useCapture === 'object') {
          // Originally useCapture was a single boolean flag, later optional other flags can be used
          // Here we take all the given flags from the object and assign them as the options
          options = Object.keys(useCapture).reduce((opts, opt) => {
            opts[opt] = useCapture[opt]
            return opts
          }, options)
        } else {
          options.capture = useCapture
        }
        if (!(type in this.listeners)) {
          this.listeners[type] = new _Stack.default()
        }
        const listener = new _PseudoEventListener.default(type, options, (callback.handleEvent || callback).bind(this))
        this.listeners[type].push(listener)
        const defaultListeners = []
        const explicitListeners = []
        let currentListener = this.listeners[type].pop()
        while (currentListener !== null) {
          if (currentListener.task.isDefault) {
            defaultListeners.push(currentListener)
          } else {
            explicitListeners.push(currentListener)
          }
          currentListener = this.listeners[type].pop()
        }
        this.listeners[type] = _Stack.default.fromArray([].concat(explicitListeners, defaultListeners))
      }

      /**
   *
   * @param {string} type
   * @param {function} callback
   */
      removeEventListener (type, callback) {
        if (!(type in this.listeners)) {
          return
        }
        const stack = this.listeners[type]
        const currentListener = stack.pop()
        const checkedListeners = []
        while (currentListener !== null) {
          const listener = currentListener.task
          if (listener.handleEvent === callback && !listener.isDefault) {
            continue
          }
          checkedListeners.push(currentListener)
        }
        this.listeners[type] = _Stack.default.fromArray(checkedListeners)
      }

      /**
   *
   * @param {Event|PseudoEvent} event
   * @param {EventTarget|PseudoEventTarget} target
   * @returns {boolean}
   */
      dispatchEvent (event) {
        const target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
        event.inner.target = target
        if (!(event.type in this.listeners)) {
          return true
        }
        this.runEvents(event)
        return !event.defaultPrevented
      }
    }
    var _default = exports.default = PseudoEventTarget
  }, { './PseudoEvent': 2, './PseudoEventListener': 3, 'collect-your-stuff/dist/collections/stack/Stack': 24, 'core-js/modules/esnext.async-iterator.for-each.js': 131, 'core-js/modules/esnext.async-iterator.reduce.js': 133, 'core-js/modules/esnext.iterator.constructor.js': 134, 'core-js/modules/esnext.iterator.for-each.js': 136, 'core-js/modules/esnext.iterator.reduce.js': 138 }],
  5: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _PseudoHTMLElement = _interopRequireDefault(require('./PseudoHTMLElement'))
    var _generateNodeList = _interopRequireDefault(require('../factories/generateNodeList'))
    var _TreeLinker = _interopRequireDefault(require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    /**
 *
 * @type {PseudoHTMLElement}
 */

    /**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
 */
    class PseudoHTMLDocument extends _PseudoHTMLElement.default {
      /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @constructor
   */
      constructor () {
        super()
        const html = new _PseudoHTMLElement.default({
          tagName: 'html',
          parent: this
        })
        /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */
        this.head = new _PseudoHTMLElement.default({
          tagName: 'head',
          parent: html
        })
        /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */
        this.body = new _PseudoHTMLElement.default({
          tagName: 'body',
          parent: html
        })
        html.children = (0, _generateNodeList.default)(_TreeLinker.default.fromArray([this.head, this.body]).head)
      }

      /**
   * Create and return a PseudoHTMLElement
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */
      createElement () {
        const tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div'
        const returnElement = new _PseudoHTMLElement.default({
          tagName
        })
        returnElement.parent = this
        return returnElement
      }
    }
    var _default = exports.default = PseudoHTMLDocument
  }, { '../factories/generateNodeList': 11, './PseudoHTMLElement': 6, 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker': 23 }],
  6: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _PseudoElement = _interopRequireDefault(require('./PseudoElement'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file Substitute for the DOM HTMLElement Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

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
    class PseudoHTMLElement extends _PseudoElement.default {
      /**
   * Simulate the HTMLElement object when the Dom is not available
   * @param {Object} [elementOptions={}]
   * @param {string} [elementOptions.tagName='']
   * @param {PseudoNode|Object} [elementOptions.parent={}]
   * @param {Array} [elementOptions.children=[]]
   * @constructor
   */
      constructor () {
        const {
          tagName = '',
          parent = null,
          children = []
        } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
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
    var _default = exports.default = PseudoHTMLElement
  }, { './PseudoElement': 1 }],
  7: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _PseudoEventTarget = _interopRequireDefault(require('./PseudoEventTarget'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

    /**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
    class PseudoNode extends _PseudoEventTarget.default {
      /**
   *
   * @constructor
   */
      constructor () {
        super()
        this.nodeValue = ''
        this.textContext = ''
      }

      get baseURI () {
        return window.location || '/'
      }

      get childNodes () {
        return this.children
      }

      get firstChild () {
        return this.children.first
      }

      get isConnected () {
        return !!this.parent
      }

      get lastChild () {
        return this.children.last
      }

      get nextSibling () {
        return this.isConnected ? this.next : null
      }

      get nodeName () {
        return this.name || ''
      }

      get nodeType () {
        return PseudoNode.DEFAULT_NODE
      }

      get ownerDocument () {
        return undefined
      }

      get parentNode () {
        return this.parent
      }

      get parentElement () {
        return this.parent.nodeType === PseudoNode.ELEMENT_NODE ? this.parent : null
      }

      get previousSibling () {
        return this.isConnected ? this.prev : null
      }

      /**
   *
   * @param {PseudoNode} childNode
   * @returns {PseudoNode}
   */
      appendChild (childNode) {
        this.children.append(childNode)
        return childNode
      }

      cloneNode () {}
      compareDocumentPosition () {}
      contains () {}
      getRootNode () {
        return this.parent.getRootNode() || this.parent
      }

      hasChildNodes () {
        return this.children.length > 0
      }

      insertBefore () {}
      isDefaultNamespace () {}
      isEqualNode () {}
      isSameNode () {}
      lookupPrefix () {}
      lookupNamespaceURI () {}
      normalize () {}
      /**
   *
   * @param {PseudoNode} childElement
   * @returns {PseudoNode}
   */
      removeChild (childElement) {
        return this.children.remove(childElement)
      }

      replaceChild () {}
    }
    PseudoNode.DEFAULT_NODE = 0
    PseudoNode.ELEMENT_NODE = 1
    PseudoNode.ATTRIBUTE_NODE = 2
    PseudoNode.TEXT_NODE = 3
    PseudoNode.CDATA_SECTION_NODE = 4
    PseudoNode.ENTITY_REFERENCE_NODE = 5
    PseudoNode.ENTITY_NODE = 6
    PseudoNode.PROCESSING_INSTRUCTION_NODE = 7
    PseudoNode.COMMENT_NODE = 8
    PseudoNode.DOCUMENT_NODE = 9
    PseudoNode.DOCUMENT_TYPE_NODE = 10
    PseudoNode.DOCUMENT_FRAGMENT_NODE = 11
    PseudoNode.NOTATION_NODE = 12
    var _default = exports.default = PseudoNode
  }, { './PseudoEventTarget': 4 }],
  8: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _LinkedTreeList = _interopRequireDefault(require('collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'))
    var _generateNode = _interopRequireDefault(require('../factories/generateNode'))
    var _AttachedNodeIterator = _interopRequireDefault(require('../recipes/AttachedNodeIterator'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    class PseudoNodeList extends _LinkedTreeList.default {
      constructor () {
        super(...arguments)
        this.classType = PseudoNodeList
      }

      entries () {
        let count = 0
        return {
          [Symbol.iterator]: () => new _AttachedNodeIterator.default(this.first, node => {
            if (node === null) {
              return node
            }
            return [count++, node.data]
          })
        }
      }

      keys () {
        let count = 0
        return {
          [Symbol.iterator]: () => new _AttachedNodeIterator.default(this.first, node => count++)
        }
      }

      values () {
        return {
          [Symbol.iterator]: () => new _AttachedNodeIterator.default(this.first, node => {
            if (node === null) {
              return node
            }
            return node.data
          })
        }
      }

      /**
   * Be able to iterate over this class.
   * @returns {Iterator}
   */
      [Symbol.iterator] () {
        return new _AttachedNodeIterator.default(this.first)
      }

      /**
   * Convert an array into a LinkedTreeList instance, return the new instance.
   * @param {Array} [values=[]] An array of values which will be converted to nodes in this tree-list
   * @param {NodeFactory} [nodeClass=NodeFactory] The class to use for each node
   * @param {IsArrayable<NodeFactory>} [classType=PseudoNodeList] Provide the type of IsArrayable to use.
   * @returns {PseudoNodeList}
   */
      static fromArray () {
        const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
        const nodeClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _generateNode.default)()
        const classType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PseudoNodeList
        return _LinkedTreeList.default.fromArray(values, nodeClass, classType)
      }
    }
    var _default = exports.default = PseudoNodeList
  }, { '../factories/generateNode': 10, '../recipes/AttachedNodeIterator': 15, 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList': 22 }],
  9: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _PseudoEventTarget = _interopRequireDefault(require('../classes/PseudoEventTarget'))
    var _PseudoNode = _interopRequireDefault(require('../classes/PseudoNode'))
    var _PseudoElement = _interopRequireDefault(require('../classes/PseudoElement'))
    var _PseudoHTMLElement = _interopRequireDefault(require('../classes/PseudoHTMLElement'))
    var _PseudoHTMLDocument = _interopRequireDefault(require('../classes/PseudoHTMLDocument'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside the browser
 * context.
 * @function generateDocument
 * @param {Object} root
 * @param {Object} context
 * @returns {Window|PseudoEventTarget}
 */
    const generateDocument = function (root) {
      const context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
      /**
   *
   * @type {Window|PseudoEventTarget}
   */
      const newWindow = typeof root.document === 'undefined' ? root : new _PseudoEventTarget.default()
      /**
   * @type {Node|PseudoNode}
   */
      const Node = root.Node || new _PseudoNode.default()
      if (typeof newWindow.Node === 'undefined') {
        newWindow.Node = Node
      }
      /**
   *
   * @type {Element|PseudoElement}
   */
      const Element = root.Element || new _PseudoElement.default()
      if (typeof newWindow.Element === 'undefined') {
        newWindow.Element = Element
      }
      /**
   * Create an instance of HTMLElement if not available
   * @type {HTMLElement|PseudoHTMLElement}
   */
      const HTMLElement = root.HTMLElement || new _PseudoHTMLElement.default()
      if (typeof newWindow.HTMLElement === 'undefined') {
        newWindow.HTMLElement = HTMLElement
      }
      /**
   * Define document when not available
   * @type {Document|PseudoHTMLDocument}
   */
      const document = root.document || new _PseudoHTMLDocument.default()
      if (typeof newWindow.document === 'undefined') {
        newWindow.document = document
      }
      return context ? Object.assign(context, newWindow) : Object.assign(root, newWindow)
    }
    var _default = exports.default = generateDocument
  }, { '../classes/PseudoElement': 1, '../classes/PseudoEventTarget': 4, '../classes/PseudoHTMLDocument': 5, '../classes/PseudoHTMLElement': 6, '../classes/PseudoNode': 7 }],
  10: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = exports.NodeFactory = void 0
    require('core-js/modules/esnext.async-iterator.reduce.js')
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    var _PseudoNode = _interopRequireDefault(require('../classes/PseudoNode'))
    var _PseudoNodeList = _interopRequireDefault(require('../classes/PseudoNodeList'))
    var _TreeLinker = _interopRequireDefault(require('collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    class NodeFactory extends _TreeLinker.default {
      /**
   * Create the new TreeLinker instance, provide the data and optionally set references for next, prev, parent, or children.
   * @param {Object} [settings={}]
   * @param {*} [settings.data=null] The data to be stored in this tree node
   * @param {TreeLinker} [settings.next=null] The reference to the next linker if any
   * @param {TreeLinker} [settings.prev=null] The reference to the previous linker if any
   * @param {LinkedTreeList} [settings.children=null] The references to child linkers if any
   * @param {TreeLinker} [settings.parent=null] The reference to a parent linker if any
   * @param {IsArrayable<IsTreeNode>} listClass Give the type of list to use for storing the children
   */
      constructor () {
        const {
          data = null,
          next = null,
          prev = null,
          children = null,
          parent = null,
          listClass = _PseudoNodeList.default
        } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        super({
          data: data,
          next: next,
          prev: prev,
          parent: parent
        })
        this.classType = NodeFactory
        this.children = this.childrenFromArray(children, listClass)
      }
    }
    exports.NodeFactory = NodeFactory
    const generateNode = () => {
      NodeFactory.make = (node, nodeClass) => _TreeLinker.default.make(node, nodeClass)
      NodeFactory.fromArray = function () {
        const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
        const linkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NodeFactory
        return values.reduce((list, element) => {
          const newElement = linkerClass.make(element, linkerClass)
          /**
       * Simulate the behaviour of the Node Class when there is no DOM available.
       * @author Joshua Heagle <joshuaheagle@gmail.com>
       * @class
       * @augments PseudoEventTarget
       * @property {string} name
       * @property {function} appendChild
       * @property {function} removeChild
       */
          class PseudoNodeAttached extends _PseudoNode.default {
            /**
         *
         * @constructor
         */
            constructor () {
              super()
              this.nodeValue = newElement.data
              this.textContext = ''
            }

            get baseURI () {
              return window.location || '/'
            }

            get childNodes () {
              return newElement.children
            }

            get firstChild () {
              return newElement.children.first.data
            }

            get isConnected () {
              return newElement.parent !== null
            }

            get lastChild () {
              return newElement.children.last.data
            }

            get nextSibling () {
              return newElement.next.data
            }

            get nodeName () {
              return this.name || ''
            }

            get nodeType () {
              const typeName = 'DEFAULT_NODE'
              const nodeTypes = ['DEFAULT_NODE', 'ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE', 'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE', 'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE', 'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE']
              return nodeTypes.indexOf(typeName)
            }

            get ownerDocument () {
              return newElement.rootParent
            }

            get parentNode () {
              return newElement.parent
            }

            get parentElement () {
              return newElement.parent.nodeType === 1 ? newElement.parent : null
            }

            get previousSibling () {
              return newElement.prev
            }

            /**
         *
         * @param {PseudoNode} childNode
         * @returns {PseudoNode}
         */
            appendChild (childNode) {
              newElement.next = childNode
              // @ts-ignore
              childNode.prev = newElement
              return childNode
            }

            cloneNode () {}
            compareDocumentPosition () {}
            contains () {}
            getRootNode () {
              return newElement.rootParent
            }

            hasChildNodes () {
              return false
            }

            insertBefore () {}
            isDefaultNamespace () {}
            isEqualNode () {}
            isSameNode () {}
            lookupPrefix () {}
            lookupNamespaceURI () {}
            normalize () {}
            /**
         *
         * @param {PseudoNode} childElement
         * @returns {PseudoNode}
         */
            removeChild (childElement) {
              // @ts-ignore
              return this.children.remove(childElement)
            }

            replaceChild () {}
          }
          newElement.data = new PseudoNodeAttached()
          if (list.head === null) {
            return {
              head: newElement,
              tail: newElement
            }
          }
          list.tail.next = newElement
          newElement.prev = list.tail
          return {
            head: list.head,
            tail: newElement
          }
        }, {
          head: null,
          tail: null
        })
      }
      return NodeFactory
    }
    var _default = exports.default = generateNode
  }, { '../classes/PseudoNode': 7, '../classes/PseudoNodeList': 8, 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker': 23, 'core-js/modules/esnext.async-iterator.reduce.js': 133, 'core-js/modules/esnext.iterator.constructor.js': 134, 'core-js/modules/esnext.iterator.reduce.js': 138 }],
  11: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _PseudoNodeList = _interopRequireDefault(require('../classes/PseudoNodeList'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    const generateNodeList = function () {
      const innerList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
      return new _PseudoNodeList.default().initialize(innerList)
    }
    var _default = exports.default = generateNodeList
  }, { '../classes/PseudoNodeList': 8 }],
  12: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _getParentNodesFromAttribute = _interopRequireDefault(require('./getParentNodesFromAttribute'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    const getParentNodes = node => (0, _getParentNodesFromAttribute.default)('', false, node)
    var _default = exports.default = getParentNodes
  }, { './getParentNodesFromAttribute': 13 }],
  13: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    const getParentNodesFromAttribute = (attr, value, node) => {
      return Object.keys(node.parentNode).length ? (node.parentNode[attr] || false) === value ? getParentNodesFromAttribute(attr, value, node.parentNode).concat([node.parentNode]) : getParentNodesFromAttribute(attr, value, node.parentNode) : []
    }
    var _default = exports.default = getParentNodesFromAttribute
  }, {}],
  14: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _PseudoEvent = _interopRequireDefault(require('./classes/PseudoEvent'))
    var _PseudoEventTarget = _interopRequireDefault(require('./classes/PseudoEventTarget'))
    var _PseudoNode = _interopRequireDefault(require('./classes/PseudoNode'))
    var _PseudoElement = _interopRequireDefault(require('./classes/PseudoElement'))
    var _PseudoHTMLElement = _interopRequireDefault(require('./classes/PseudoHTMLElement'))
    var _PseudoHTMLDocument = _interopRequireDefault(require('./classes/PseudoHTMLDocument'))
    var _generateDocument = _interopRequireDefault(require('./factories/generateDocument'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

    /**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
    const pseudoDom = Object.assign({
      generateDocument: _generateDocument.default
    }, _PseudoEvent.default, _PseudoEventTarget.default, _PseudoNode.default, _PseudoElement.default, _PseudoHTMLElement.default, _PseudoHTMLDocument.default)
    var _default = exports.default = pseudoDom
    if (void 0) {
      // @ts-ignore
      (void 0).pseudoDom = pseudoDom
    } else if (typeof window !== 'undefined') {
      // @ts-ignore
      window.pseudoDom = pseudoDom
    }
  }, { './classes/PseudoElement': 1, './classes/PseudoEvent': 2, './classes/PseudoEventTarget': 4, './classes/PseudoHTMLDocument': 5, './classes/PseudoHTMLElement': 6, './classes/PseudoNode': 7, './factories/generateDocument': 9 }],
  15: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    /**
 * Class TreeLinkerIterator returns the next value taking a left-first approach down a tree.
 */
    class AttachedNodeIterator {
      constructor (current) {
        const valueRule = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
        this.current = current
        this.valueRule = valueRule
      }

      next () {
        let currentNode = this.current
        if (this.valueRule === null && currentNode !== null) {
          currentNode = currentNode.data
        }
        if (this.valueRule !== null) {
          currentNode = this.valueRule(currentNode)
        }
        const result = {
          value: currentNode,
          done: !this.current
        }
        this.current = this.current ? this.current.next : null
        return result
      }
    }
    var _default = exports.default = AttachedNodeIterator
  }, {}],
  16: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.async-iterator.reduce.js')
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
      constructor () {
        const data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
        this.classType = ArrayElement
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
    ArrayElement.make = function (element) {
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ArrayElement
      if (typeof element !== 'object') {
        // It is not an object, so instantiate the Element with element as the data
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
    ArrayElement.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ArrayElement
      return values.reduce((references, element) => {
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
    }
    var _default = exports.default = ArrayElement
  }, { 'core-js/modules/esnext.async-iterator.reduce.js': 133, 'core-js/modules/esnext.iterator.constructor.js': 134, 'core-js/modules/esnext.iterator.reduce.js': 138 }],
  17: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _ArrayElement = _interopRequireDefault(require('./ArrayElement'))
    var _ArrayIterator = _interopRequireDefault(require('../../recipes/ArrayIterator'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
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
   */
      constructor () {
        const elementClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _ArrayElement.default
        this.classType = Arrayable
        this.innerList = []
        this.initialized = false
        this.elementClass = elementClass
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
   * Retrieve a copy of the innerList used.
   * @returns {Array<ArrayElement>}
   */
      get list () {
        return this.innerList
      }

      /**
   * Retrieve the first Element from the Arrayable
   * @returns {ArrayElement}
   */
      get first () {
        return this.innerList[0]
      }

      /**
   * Retrieve the last Element from the Arrayable
   * @returns {ArrayElement}
   */
      get last () {
        return this.innerList[this.length - 1]
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
   * @param {ArrayElement|*} node The existing node as reference
   * @param {ArrayElement|*} newNode The new node to go after the existing node
   * @returns {Arrayable}
   */
      insertAfter (node, newNode) {
        const insertAt = this.innerList.indexOf(node)
        this.innerList.splice(insertAt + 1, 0, this.elementClass.make(newNode))
        return this
      }

      /**
   * Insert a new node (or data) before a node.
   * @param {ArrayElement|*} node The existing node as reference
   * @param {ArrayElement|*} newNode The new node to go before the existing node
   * @returns {Arrayable}
   */
      insertBefore (node, newNode) {
        const insertAt = this.innerList.indexOf(node)
        this.innerList.splice(insertAt, 0, this.elementClass.make(newNode))
        return this
      }

      /**
   * Add a node (or data) after the given (or last) node in the list.
   * @param {ArrayElement|*} node The new node to add to the end of the list
   * @param {ArrayElement} after The existing last node
   * @returns {Arrayable}
   */
      append (node) {
        const after = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.last
        return this.insertAfter(after, node)
      }

      /**
   * Add a node (or data) before the given (or first) node in the list.
   * @param {ArrayElement|*} node The new node to add to the start of the list
   * @param {ArrayElement} before The existing first node
   * @returns {Arrayable}
   */
      prepend (node) {
        const before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.first
        return this.insertBefore(before, node)
      }

      /**
   * Remove an element from this arrayable.
   * @param {ArrayElement} node The node we wish to remove (and it will be returned after removal)
   * @return {ArrayElement}
   */
      remove (node) {
        const deleteAt = this.innerList.indexOf(node)
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
      forEach (callback) {
        const thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
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
        return new _ArrayIterator.default(this.innerList, index)
      }
    }
    /**
 * Convert an array to an Arrayable.
 * @param {Array} values An array of values which will be converted to elements in this arrayable
 * @param {IsElement} [elementClass=ArrayElement] The class to use for each element
 * @param {IsArrayable<ArrayElement>} [classType=Arrayable] Provide the type of IsArrayable to use.
 * @returns {Arrayable}
 */
    Arrayable.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const elementClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _ArrayElement.default
      const classType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Arrayable
      const list = new classType(elementClass)
      return list.initialize(elementClass.fromArray(values).head)
    }
    var _default = exports.default = Arrayable
  }, { '../../recipes/ArrayIterator': 26, './ArrayElement': 16 }],
  18: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.async-iterator.reduce.js')
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    var _Linker = _interopRequireDefault(require('../linked-list/Linker'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * DoubleLinker represents a node in a DoublyLinkedList which is chained by next and prev.
 * @extends Linker
 */
    class DoubleLinker {
      /**
   * Create the new DoubleLinker instance, provide the data and optionally the next and prev references.
   * @param {Object} [nodeData={}]
   * @param {*} [nodeData.data=null] The data to be stored in this linker
   * @param {DoubleLinker|null} [nodeData.next=null] The reference to the next linker if any
   * @param {DoubleLinker|null} [nodeData.prev=null] The reference to the previous linker if any
   */
      constructor () {
        const {
          data = null,
          next = null,
          prev = null
        } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        this.classType = DoubleLinker
        this.data = null
        this.next = null
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
    DoubleLinker.make = function (linker) {
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DoubleLinker
      return _Linker.default.make(linker, classType)
    }
    /**
 * Convert an array into DoubleLinker instances, return the head and tail DoubleLinkers.
 * @param {Array} [values=[]] Provide an array of data that will be converted to a chain of linkers.
 * @param {IsDoubleLinker} [classType=DoubleLinker] Provide the type of IsDoubleLinker to use.
 * @returns {{head: DoubleLinker, tail: DoubleLinker}}
 */
    DoubleLinker.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DoubleLinker
      return values.reduce((references, linker) => {
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
    }
    var _default = exports.default = DoubleLinker
  }, { '../linked-list/Linker': 21, 'core-js/modules/esnext.async-iterator.reduce.js': 133, 'core-js/modules/esnext.iterator.constructor.js': 134, 'core-js/modules/esnext.iterator.reduce.js': 138 }],
  19: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _DoubleLinker = _interopRequireDefault(require('./DoubleLinker'))
    var _DoubleLinkerIterator = _interopRequireDefault(require('../../recipes/DoubleLinkerIterator'))
    var _LinkedList = _interopRequireDefault(require('../linked-list/LinkedList'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
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
   */
      constructor () {
        const linkerClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _DoubleLinker.default
        this.classType = DoublyLinkedList
        this.innerList = null
        this.initialized = false
        this.linkerClass = linkerClass
      }

      /**
   * Initialize the inner list, should only run once.
   * @param {DoubleLinker} initialList Give the list of double-linkers to start in this doubly linked-list.
   * @return {DoublyLinkedList}
   */
      initialize (initialList) {
        return _LinkedList.default.prototype.initialize.call(this, initialList)
      }

      /**
   * Retrieve a copy of the innerList used.
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
        return this.reset()
      }

      /**
   * Retrieve the last DoubleLinker in the list.
   * @returns {DoubleLinker}
   */
      get last () {
        let tail = this.innerList
        if (tail === null) {
          return null
        }
        let next = tail.next
        while (next !== null) {
          tail = next
          next = tail.next
        }
        return tail
      }

      /**
   * Return the length of the list.
   * @returns {number}
   */
      get length () {
        let current = this.first
        let length = 0
        while (current !== null) {
          ++length
          current = current.next
        }
        return length
      }

      /**
   * Insert a new node (or data) after a node.
   * @param {DoubleLinker|*} node The existing node as reference
   * @param {DoubleLinker|*} newNode The new node to go after the existing node
   * @returns {DoublyLinkedList}
   */
      insertAfter (node, newNode) {
        newNode = this.linkerClass.make(newNode)
        if (node !== null) {
          // Ensure the next reference of this node is assigned to the new node
          newNode.next = node.next
          // Ensure this node is assigned as the prev reference of the new node
          newNode.prev = node
          // Then set this node's next reference to the new node
          node.next = newNode
        }
        if (newNode.next) {
          // Update the next reference to ensure circular reference for prev points to the new node
          newNode.next.prev = newNode
        }
        if (!this.length) {
          this.innerList = newNode
        }
        this.reset()
        return this
      }

      /**
   * Insert a new node (or data) before a node.
   * @param {DoubleLinker|*} node The existing node as reference
   * @param {DoubleLinker|*} newNode The new node to go before the existing node
   * @returns {DoublyLinkedList}
   */
      insertBefore (node, newNode) {
        newNode = this.linkerClass.make(newNode)
        if (node !== null) {
          // The new node will reference this prev node as prev
          newNode.prev = node.prev
          // The new node will reference this node as next
          newNode.next = node
          // This prev will reference the new node
          node.prev = newNode
        }
        if (newNode.prev) {
          // Update the prev reference to ensure circular reference for next points to the new node
          newNode.prev.next = newNode
        }
        if (!this.length) {
          this.innerList = newNode
        }
        this.reset()
        return this
      }

      /**
   * Add a node (or data) after the given (or last) node in the list.
   * @param {DoubleLinker|*} node The new node to add to the end of the list
   * @param {DoubleLinker} after The existing last node
   * @returns {DoubleLinker}
   */
      append (node) {
        const after = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.last
        return this.insertAfter(after, node)
      }

      /**
   * Add a node (or data) before the given (or first) node in the list.
   * @param {DoubleLinker|*} node The new node to add to the start of the list
   * @param {DoubleLinker} before The existing first node
   * @returns {DoubleLinker}
   */
      prepend (node) {
        const before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.first
        return this.insertBefore(before, node)
      }

      /**
   * Remove a linker from this linked list.
   * @param {DoubleLinker} node The node we wish to remove (and it will be returned after removal)
   * @return {DoubleLinker}
   */
      remove (node) {
        if (node === null) {
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
        // Update head reference
        this.reset()
        return node
      }

      /**
   * Refresh all references and return head reference.
   * @return {DoubleLinker}
   */
      reset () {
        // Start at the pointer for the list
        let pointer = this.innerList
        if (pointer === null) {
          return null
        }
        let next = pointer.next
        // Follow references till the end
        while (next !== null) {
          pointer = next
          next = pointer.next
        }
        let prev = pointer.prev
        // From final reference, follow references back to the beginning
        while (prev !== null) {
          pointer = prev
          prev = pointer.prev
        }
        // All the live references should have been found, and we are pointing to the true head
        this.innerList = pointer
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
   */
      forEach (callback) {
        const thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
        return _LinkedList.default.prototype.forEach.call(this, callback, thisArg)
      }

      /**
   * Be able to iterate over this class.
   * @returns {Iterator}
   */
      [Symbol.iterator] () {
        const current = this.first
        return new _DoubleLinkerIterator.default(current)
      }
    }
    /**
 * Convert an array into a DoublyLinkedList instance, return the new instance.
 * @param {Array} [values=[]] An array of values which will be converted to linkers in this doubly-linked-list
 * @param {IsDoubleLinker} [linkerClass=DoubleLinker] The class to use for each linker
 * @param {IsArrayable<IsDoubleLinker>} [classType=LinkedList] Provide the type of IsArrayable to use.
 * @returns {DoublyLinkedList}
 */
    DoublyLinkedList.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const linkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _DoubleLinker.default
      const classType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DoublyLinkedList
      return _LinkedList.default.fromArray(values, linkerClass, classType)
    }
    var _default = exports.default = DoublyLinkedList
  }, { '../../recipes/DoubleLinkerIterator': 27, '../linked-list/LinkedList': 20, './DoubleLinker': 18 }],
  20: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _Linker = _interopRequireDefault(require('./Linker'))
    var _LinkerIterator = _interopRequireDefault(require('../../recipes/LinkerIterator'))
    var _Arrayable = _interopRequireDefault(require('../arrayable/Arrayable'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * LinkedList represents a collection stored as a LinkedList with next references.
 * @extends Arrayable
 */
    class LinkedList {
      /**
   * Create the new LinkedList instance.
   */
      constructor () {
        const linkerClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _Linker.default
        this.classType = LinkedList
        this.innerList = null
        this.initialized = false
        this.linkerClass = linkerClass
      }

      /**
   * Initialize the inner list, should only run once.
   * @param {Linker|Array} initialList Give the list of linkers to start in this linked-list.
   * @return {LinkedList}
   */
      initialize (initialList) {
        return _Arrayable.default.prototype.initialize.call(this, initialList)
      }

      /**
   * Retrieve a copy of the innerList used.
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
   * Retrieve the last Linker in the list.
   * @returns {Linker}
   */
      get last () {
        let tail = this.innerList
        if (tail === null) {
          return null
        }
        let next = tail.next
        while (next !== null) {
          tail = next
          next = tail.next
        }
        return tail
      }

      /**
   * Return the length of the list.
   * @returns {number}
   */
      get length () {
        let current = this.first
        let length = 0
        while (current !== null) {
          ++length
          current = current.next
        }
        return length
      }

      /**
   * Insert a new node (or data) after a node.
   * @param {Linker|*} node The existing node as reference
   * @param {Linker|*} newNode The new node to go after the existing node
   * @returns {LinkedList}
   */
      insertAfter (node, newNode) {
        newNode = this.linkerClass.make(newNode)
        if (node !== null) {
          // Ensure the next reference of this node is assigned to the new node
          newNode.next = node.next
          // Then set this node's next reference to the new node
          node.next = newNode
        }
        if (!this.length) {
          this.innerList = newNode
        }
        return this
      }

      /**
   * Insert a new node (or data) before a node.
   * @param {Linker|*} node The existing node as reference
   * @param {Linker|*} newNode The new node to go before the existing node
   * @returns {LinkedList}
   */
      insertBefore (node, newNode) {
        newNode = this.linkerClass.make(newNode)
        let prevNode = null
        let currentNode = this.first
        while (currentNode !== node) {
          prevNode = currentNode
          currentNode = currentNode.next
        }
        // The new node will reference this node as next
        newNode.next = node
        if (prevNode) {
          // Ensure the next reference of the previous node is assigned to the new node
          prevNode.next = newNode
        }
        if (node === this.first || node === null) {
          this.innerList = newNode
        }
        return this
      }

      /**
   * Add a node (or data) after the given (or last) node in the list.
   * @param {Linker|*} node The new node to add to the end of the list
   * @param {Linker} after The existing last node
   * @returns {Linker}
   */
      append (node) {
        const after = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.last
        return this.insertAfter(after, node)
      }

      /**
   * Add a node (or data) before the given (or first) node in the list.
   * @param {Linker|*} node The new node to add to the start of the list
   * @param {Linker} before The existing first node
   * @returns {Linker}
   */
      prepend (node) {
        const before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.first
        return this.insertBefore(before, node)
      }

      /**
   * Remove a linker from this linked list.
   * @param {Linker} node The node we wish to remove (and it will be returned after removal)
   * @return {Linker}
   */
      remove (node) {
        let prevNode = null
        let currentNode = this.first
        while (currentNode !== node) {
          prevNode = currentNode
          currentNode = currentNode.next
        }
        if (prevNode) {
          // Ensure the next reference of the previous node skips over the removed node
          prevNode.next = node.next
        }
        if (node === this.first && node !== null) {
          // Update list head to point to next if it was this node
          this.innerList = node.next
        }
        return node
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
      forEach (callback) {
        const thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
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
        return new _LinkerIterator.default(this.first)
      }
    }
    /**
 * Convert an array to a LinkedList.
 * @param {Array} values An array of values which will be converted to linkers in this linked-list
 * @param {IsLinker} linkerClass The class to use for each linker
 * @param {IsArrayable<Linker>} [classType=LinkedList] Provide the type of IsArrayable to use.
 * @returns {LinkedList}
 */
    LinkedList.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const linkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Linker.default
      const classType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : LinkedList
      const list = new classType(linkerClass)
      return list.initialize(linkerClass.fromArray(values).head)
    }
    var _default = exports.default = LinkedList
  }, { '../../recipes/LinkerIterator': 28, '../arrayable/Arrayable': 17, './Linker': 21 }],
  21: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.async-iterator.reduce.js')
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    var _ArrayElement = _interopRequireDefault(require('../arrayable/ArrayElement'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * Linker represents a node in a LinkedList.
 * @extends ArrayElement
 */
    class Linker {
      /**
   * Create the new Linker instance, provide the data and optionally give the next Linker.
   * @param {Object} [nodeData={}]
   * @param {*} [nodeData.data=null] The data to be stored in this linker
   * @param {Linker|null} [nodeData.next=null] The reference to the next linker if any
   */
      constructor () {
        const {
          data = null,
          next = null
        } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        this.classType = Linker
        this.data = null
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
    Linker.make = function (linker) {
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Linker
      if (typeof linker !== 'object') {
        // It is not an object, so instantiate the Linker with element as the data
        return new classType({
          data: linker
        })
      }
      if (linker.classType) {
        // Already valid Linker, return as-is
        return linker
      }
      if (!linker.data) {
        linker = {
          data: linker
        }
      }
      // Create the new node as the configured #classType
      return _ArrayElement.default.make(linker, classType)
    }
    /**
 * Convert an array into Linker instances, return the head and tail Linkers.
 * @param {Array} [values=[]] Provide an array of data that will be converted to a chain of linkers.
 * @param {IsLinker} [classType=Linker] Provide the type of IsLinker to use.
 * @returns {{head: Linker, tail: Linker}}
 */
    Linker.fromArray = function (values) {
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Linker
      return values.reduce((references, linker) => {
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
    }
    var _default = exports.default = Linker
  }, { '../arrayable/ArrayElement': 16, 'core-js/modules/esnext.async-iterator.reduce.js': 133, 'core-js/modules/esnext.iterator.constructor.js': 134, 'core-js/modules/esnext.iterator.reduce.js': 138 }],
  22: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _TreeLinker = _interopRequireDefault(require('./TreeLinker'))
    var _TreeLinkerIterator = _interopRequireDefault(require('../../recipes/TreeLinkerIterator'))
    var _DoublyLinkedList = _interopRequireDefault(require('../doubly-linked-list/DoublyLinkedList'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file doubly linked tree list.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.1.0
 * @memberOf module:collect-your-stuff
 */

    /**
 * LinkedTreeList represents a collection stored with a root and spreading in branching (tree) formation.
 * @extends DoublyLinkedList
 */
    class LinkedTreeList {
      /**
   * Create the new LinkedTreeList instance, configure the list class.
   */
      constructor () {
        const linkerClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _TreeLinker.default
        this.classType = LinkedTreeList
        this.innerList = null
        this.initialized = false
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
   * Retrieve a copy of the innerList used.
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
        return this.reset()
      }

      /**
   * Retrieve the last TreeLinker in the list.
   * @returns {TreeLinker}
   */
      get last () {
        let tail = this.innerList
        if (tail === null) {
          return null
        }
        let next = tail.next
        while (next !== null) {
          tail = next
          next = tail.next
        }
        return tail
      }

      /**
   * Return the length of the list.
   * @returns {number}
   */
      get length () {
        let current = this.first
        let length = 0
        while (current !== null) {
          ++length
          current = current.next
        }
        return length
      }

      /**
   * Get the parent of this tree list.
   * @return {TreeLinker}
   */
      get parent () {
        const first = this.first
        if (first === null) {
          return null
        }
        return this.first.parent
      }

      /**
   * Set the parent of this tree list
   * @param {TreeLinker} parent The new node to use as the parent for this group of children
   */
      set parent (parent) {
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
   * @param {TreeLinker} item The TreeLinker node that will be the parent of the children
   * @param {LinkedTreeList} children The LinkedTreeList which has the child nodes to use
   */
      setChildren (item) {
        const children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
        if (Array.from(this).indexOf(item) < 0) {
          console.error('item is not a child of this')
        }
        children.parent = item
      }

      /**
   * Insert a new node (or data) after a node.
   * @param {TreeLinker|*} node The existing node as reference
   * @param {TreeLinker|*} newNode The new node to go after the existing node
   * @returns {LinkedTreeList}
   */
      insertAfter (node, newNode) {
        return _DoublyLinkedList.default.prototype.insertAfter.call(this, node, newNode)
      }

      /**
   * Insert a new node (or data) before a node.
   * @param {TreeLinker|*} node The existing node as reference
   * @param {TreeLinker|*} newNode The new node to go before the existing node
   * @returns {LinkedTreeList}
   */
      insertBefore (node, newNode) {
        return _DoublyLinkedList.default.prototype.insertBefore.call(this, node, newNode)
      }

      /**
   * Add a node (or data) after the given (or last) node in the list.
   * @param {TreeLinker|*} node The new node to add to the end of the list
   * @param {TreeLinker} after The existing last node
   * @returns {TreeLinker}
   */
      append (node) {
        const after = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.last
        return _DoublyLinkedList.default.prototype.append.call(this, node, after)
      }

      /**
   * Add a node (or data) before the given (or first) node in the list.
   * @param {TreeLinker|*} node The new node to add to the start of the list
   * @param {TreeLinker} before The existing first node
   * @returns {TreeLinker}
   */
      prepend (node) {
        const before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.first
        return _DoublyLinkedList.default.prototype.prepend.call(this, node, before)
      }

      /**
   * Remove a linker from this linked list.
   * @param {TreeLinker} node The node we wish to remove (and it will be returned after removal)
   * @return {TreeLinker}
   */
      remove (node) {
        return _DoublyLinkedList.default.prototype.remove.call(this, node)
      }

      /**
   * Refresh all references and return head reference.
   * @return {TreeLinker}
   */
      reset () {
        return _DoublyLinkedList.default.prototype.reset.call(this)
      }

      /**
   * Retrieve a TreeLinker item from this list by numeric index, otherwise return null.
   * @param {number} index The integer number for retrieving a node by position.
   * @returns {TreeLinker|null}
   */
      item (index) {
        return _DoublyLinkedList.default.prototype.item.call(this, index)
      }

      /**
   * Be able to run forEach on this LinkedTreeList to iterate over the TreeLinker Items.
   * @param {forEachCallback} callback The function to call for-each tree node
   * @param {LinkedTreeList} thisArg Optional, 'this' reference
   */
      forEach (callback) {
        const thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
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
        const root = this.rootParent
        return new _TreeLinkerIterator.default(root)
      }
    }
    /**
 * Convert an array into a LinkedTreeList instance, return the new instance.
 * @param {Array} [values=[]] An array of values which will be converted to nodes in this tree-list
 * @param {TreeLinker} [linkerClass=TreeLinker] The class to use for each node
 * @param {IsArrayable<TreeLinker>} [classType=LinkedTreeList] Provide the type of IsArrayable to use.
 * @returns {LinkedTreeList}
 */
    LinkedTreeList.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const linkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _TreeLinker.default
      const classType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : LinkedTreeList
      const list = new classType(linkerClass)
      return list.initialize(linkerClass.fromArray(values).head)
    }
    var _default = exports.default = LinkedTreeList
  }, { '../../recipes/TreeLinkerIterator': 29, '../doubly-linked-list/DoublyLinkedList': 19, './TreeLinker': 23 }],
  23: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.async-iterator.map.js')
    require('core-js/modules/esnext.iterator.map.js')
    var _DoubleLinker = _interopRequireDefault(require('../doubly-linked-list/DoubleLinker'))
    var _LinkedTreeList = _interopRequireDefault(require('./LinkedTreeList'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * TreeLinker represents a node in a LinkedTreeList having a parent (or root) and child nodes.
 * @extends DoubleLinker
 */
    class TreeLinker {
      /**
   * Create the new TreeLinker instance, provide the data and optionally set references for next, prev, parent, or children.
   * @param {Object} [settings={}]
   * @param {*} [settings.data=null] The data to be stored in this tree node
   * @param {TreeLinker} [settings.next=null] The reference to the next linker if any
   * @param {TreeLinker} [settings.prev=null] The reference to the previous linker if any
   * @param {LinkedTreeList} [settings.children=null] The references to child linkers if any
   * @param {TreeLinker} [settings.parent=null] The reference to a parent linker if any
   * @param {IsArrayable<IsTreeNode>} listClass Give the type of list to use for storing the children
   */
      constructor () {
        const {
          data = null,
          next = null,
          prev = null,
          children = null,
          parent = null,
          listClass = _LinkedTreeList.default
        } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        this.classType = TreeLinker
        this.data = null
        this.next = null
        this.prev = null
        this.parent = null
        this.children = null
        this.data = data
        this.next = next
        this.prev = prev
        this.parent = parent
        this.children = this.childrenFromArray(children, listClass)
      }

      /**
   * Create the children for this tree from an array.
   * @param {Array|null} children Provide an array of data / linker references to be children of this tree node.
   * @param {IsArrayable<IsTreeNode>} listClass Give the type of list to use for storing the children
   * @return {LinkedTreeList|null}
   */
      childrenFromArray () {
        const children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
        const listClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _LinkedTreeList.default
        if (children === null) {
          return null
        }
        // Creates a linked-tree-list to store the children.
        return listClass.fromArray(children.map(child => Object.assign({}, child, {
          parent: this
        })), this.classType)
      }
    }
    /**
 * Make a new DoubleLinker from the data given if it is not already a valid Linker.
 * @param {TreeLinker|*} linker Return a valid TreeLinker instance from given data, or even an already valid one.
 * @param {IsTreeNode} [classType=TreeLinker] Provide the type of IsTreeNode to use.
 * @return {TreeLinker}
 */
    TreeLinker.make = function (linker) {
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TreeLinker
      return _DoubleLinker.default.make(linker, classType)
    }
    /**
 * Convert an array into DoubleLinker instances, return the head and tail DoubleLinkers.
 * @param {Array} [values=[]] Provide an array of data that will be converted to a chain of tree-linkers.
 * @param {IsTreeNode} [classType=TreeLinker] Provide the type of IsTreeNode to use.
 * @returns {{head: TreeLinker, tail: TreeLinker}}
 */
    TreeLinker.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TreeLinker
      return _DoubleLinker.default.fromArray(values, classType)
    }
    var _default = exports.default = TreeLinker
  }, { '../doubly-linked-list/DoubleLinker': 18, './LinkedTreeList': 22, 'core-js/modules/esnext.async-iterator.map.js': 132, 'core-js/modules/esnext.iterator.map.js': 137 }],
  24: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _Stackable = _interopRequireDefault(require('./Stackable'))
    var _LinkedList = _interopRequireDefault(require('../linked-list/LinkedList'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file stack.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @memberOf module:collect-your-stuff
 */

    /**
 * Store a collection of items which can only be inserted and removed from the top.
 */
    class Stack {
      /**
   * Instantiate the state with the starter stacked list.
   * @param {Iterable|LinkedList} stackedList
   * @param {IsArrayable} listClass
   * @param {Stackable} stackableClass
   */
      constructor () {
        let stackedList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
        const listClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _LinkedList.default
        const stackableClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _Stackable.default
        this.listClass = listClass
        this.stackableClass = stackableClass
        if (stackedList === null) {
          stackedList = new listClass(stackableClass)
        }
        this.stackedList = stackedList
      }

      /**
   * Return true if the stack is empty (there are no tasks in the stacked list)
   * @return {boolean}
   */
      empty () {
        return this.size() <= 0
      }

      /**
   * Take a look at the next stacked task
   * @return {Stackable}
   */
      top () {
        return this.stackedList.first
      }

      /**
   * Remove the next stacked task and return it.
   * @return {Stackable|null}
   */
      pop () {
        const next = this.remove()
        if (!next) {
          return {
            success: 'No more stackable tasks in the stack',
            error: false,
            context: this.stackedList
          }
        }
        return next.run()
      }

      /**
   * Push a stackable task to the top of the stack.
   * @param {Stackable|*} stackable Add a new stackable to the top of the stack
   */
      push (stackable) {
        this.stackedList.prepend(stackable)
      }

      /**
   * Remove the next stacked task and return it.
   * @return {Stackable|null}
   */
      remove () {
        if (this.empty()) {
          return null
        }
        return this.stackedList.remove(this.stackedList.first)
      }

      /**
   * Get the size of the current stack.
   * @return {number}
   */
      size () {
        return this.stackedList.length
      }
    }
    /**
 * Convert an array to a Stack.
 * @param {Array} values An array of values which will be converted to stackables in this queue
 * @param {Stackable} stackableClass The class to use for each stackable
 * @param {Stack|Iterable} listClass The class to use to manage the stackables
 * @returns {Stack}
 */
    Stack.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const stackableClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Stackable.default
      const listClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _LinkedList.default
      const list = new listClass(stackableClass)
      list.initialize(stackableClass.fromArray(values, stackableClass).head)
      return new Stack(list)
    }
    var _default = exports.default = Stack
  }, { '../linked-list/LinkedList': 20, './Stackable': 25 }],
  25: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _Linker = _interopRequireDefault(require('../linked-list/Linker'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * Stackable represents a runnable entry in stack.
 * @extends Linker
 */
    class Stackable {
      /**
   * Create a stackable item that can be used in a stack.
   * @param {Object} [stackData={}]
   * @param {*} [stackData.task=null] The data to be stored in this stackable
   * @param {Stackable|null} [stackData.next=null] The reference to the next stackable if any
   * @param {boolean|Function} [stackData.ready=false] Indicate if the stackable is ready to run
   */
      constructor () {
        const {
          task = null,
          next = null,
          ready = false
        } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        this.data = null
        this.next = null
        this.classType = Stackable
        this.data = task
        this.next = next
      }

      /**
   * Retrieve the data which should be formed as a task.
   * @return {*}
   */
      get task () {
        if (typeof this.data === 'function') {
          return this.data
        }
        return () => this.data
      }

      /**
   * Run the stacked task.
   * @return {*}
   */
      run () {
        return this.task()
      }
    }
    /**
 * Make a new Stackable from the data given if it is not already a valid Stackable.
 * @param {Stackable|*} stackable Return a valid Stackable instance from given data, or even an already valid one.
 * @param {IsLinker} [classType=Stackable] Provide the type of IsLinker to use.
 * @return {Stackable}
 */
    Stackable.make = function (stackable) {
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Stackable
      if (typeof stackable !== 'object') {
        // It is not an object, so instantiate the Stackable with stackable as the data
        return new classType({
          task: stackable
        })
      }
      if (stackable.classType) {
        // Already valid Stackable, return as-is
        return stackable
      }
      if (!stackable.task) {
        stackable = {
          task: stackable
        }
      }
      // Create the new node as the configured stackableClass
      return new Stackable(stackable)
    }
    /**
 * Convert an array into Stackable instances, return the head and tail Stackables.
 * @param {Array} [values=[]] Provide an array of data that will be converted to a chain of stackable linkers.
 * @param {IsLinker} [classType=Stackable] Provide the type of IsLinker to use.
 * @returns {{head: Stackable, tail: Stackable}}
 */
    Stackable.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const classType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Stackable
      return _Linker.default.fromArray(values, classType)
    }
    var _default = exports.default = Stackable
  }, { '../linked-list/Linker': 21 }],
  26: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    /**
 * Class ArrayIterator returns the next value when using elements of array type list.
 */
    class ArrayIterator {
      constructor (innerList) {
        const index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
        this.innerList = innerList
        this.index = index
      }

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
    var _default = exports.default = ArrayIterator
  }, {}],
  27: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    /**
 * Class DoubleLinkerIterator returns the next value when using linkers of linked type lists.
 */
    class DoubleLinkerIterator {
      constructor (current) {
        this.current = current
      }

      next (value) {
        const result = {
          value: this.current,
          done: !this.current
        }
        this.current = this.current ? this.current.next : null
        return result
      }
    }
    var _default = exports.default = DoubleLinkerIterator
  }, {}],
  28: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    /**
 * Class LinkerIterator returns the next value when using linkers of linked type lists.
 */
    class LinkerIterator {
      constructor (current) {
        this.current = current
      }

      next (value) {
        const result = {
          value: this.current,
          done: !this.current
        }
        this.current = this.current ? this.current.next : null
        return result
      }
    }
    var _default = exports.default = LinkerIterator
  }, {}],
  29: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _parseTreeNext = _interopRequireDefault(require('../services/parseTreeNext'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * Class TreeLinkerIterator returns the next value taking a left-first approach down a tree.
 */
    class TreeLinkerIterator {
      constructor (current) {
        this.current = current
      }

      next (value) {
        const result = {
          value: this.current,
          done: !this.current
        }
        this.current = (0, _parseTreeNext.default)(this.current)
        return result
      }
    }
    var _default = exports.default = TreeLinkerIterator
  }, { '../services/parseTreeNext': 30 }],
  30: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    /**
 * Be able to parse over every node in a tree.
 * 1. Start at root (get root parent)
 * 2. Get first child (repeat until no children)
 * 3. Check next child
 * 4. Repeat 2
 * 5. Repeat 3
 * 6. If no next child, return to parent and repeat 3
 * 7. Stop at root (next is null and parent is null
 * @param {IsTreeNode} treeNode Provide a node in a tree and get the next node (left-first approach)
 * @returns {IsTreeNode|null}
 */
    const parseTreeNext = treeNode => {
      if (!treeNode) {
        return null
      }
      let test = null
      if (treeNode.children && treeNode.children.length) {
        // Go down the left side of the tree
        test = treeNode.children.first
      }
      if (!test) {
        // Reached the bottom, go the next node on the right
        test = treeNode.next
      }
      if (!test && treeNode.parent) {
        // No more child nodes, return to parent and check parent sibling on the right
        let parentNext = treeNode.parent.next
        let parent = treeNode.parent
        while (parent && !parentNext) {
          parentNext = parent.next
          // Keep checking parent next, until there are no more parents, or we find the parent sibling
          parent = parent.parent
        }
        // This may be the parent sibling, or it could be null indicating we are done
        test = parentNext
      }
      // Finally, either use the node we found, or it may be null
      return test
    }
    var _default = exports.default = parseTreeNext
  }, {}],
  31: [function (require, module, exports) {
    'use strict'
    var isCallable = require('../internals/is-callable')
    var tryToString = require('../internals/try-to-string')

    var $TypeError = TypeError

    // `Assert: IsCallable(argument) is true`
    module.exports = function (argument) {
      if (isCallable(argument)) return argument
      throw new $TypeError(tryToString(argument) + ' is not a function')
    }
  }, { '../internals/is-callable': 82, '../internals/try-to-string': 124 }],
  32: [function (require, module, exports) {
    'use strict'
    var isPrototypeOf = require('../internals/object-is-prototype-of')

    var $TypeError = TypeError

    module.exports = function (it, Prototype) {
      if (isPrototypeOf(Prototype, it)) return it
      throw new $TypeError('Incorrect invocation')
    }
  }, { '../internals/object-is-prototype-of': 104 }],
  33: [function (require, module, exports) {
    'use strict'
    var isObject = require('../internals/is-object')

    var $String = String
    var $TypeError = TypeError

    // `Assert: Type(argument) is Object`
    module.exports = function (argument) {
      if (isObject(argument)) return argument
      throw new $TypeError($String(argument) + ' is not an object')
    }
  }, { '../internals/is-object': 85 }],
  34: [function (require, module, exports) {
    'use strict'
    var toIndexedObject = require('../internals/to-indexed-object')
    var toAbsoluteIndex = require('../internals/to-absolute-index')
    var lengthOfArrayLike = require('../internals/length-of-array-like')

    // `Array.prototype.{ indexOf, includes }` methods implementation
    var createMethod = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        var O = toIndexedObject($this)
        var length = lengthOfArrayLike(O)
        var index = toAbsoluteIndex(fromIndex, length)
        var value
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
  }, { '../internals/length-of-array-like': 94, '../internals/to-absolute-index': 116, '../internals/to-indexed-object': 117 }],
  35: [function (require, module, exports) {
    'use strict'
    var call = require('../internals/function-call')
    var getBuiltIn = require('../internals/get-built-in')
    var getMethod = require('../internals/get-method')

    module.exports = function (iterator, method, argument, reject) {
      try {
        var returnMethod = getMethod(iterator, 'return')
        if (returnMethod) {
          return getBuiltIn('Promise').resolve(call(returnMethod, iterator)).then(function () {
            method(argument)
          }, function (error) {
            reject(error)
          })
        }
      } catch (error2) {
        return reject(error2)
      } method(argument)
    }
  }, { '../internals/function-call': 64, '../internals/get-built-in': 68, '../internals/get-method': 72 }],
  36: [function (require, module, exports) {
    'use strict'
    var call = require('../internals/function-call')
    var perform = require('../internals/perform')
    var anObject = require('../internals/an-object')
    var create = require('../internals/object-create')
    var createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    var defineBuiltIns = require('../internals/define-built-ins')
    var wellKnownSymbol = require('../internals/well-known-symbol')
    var InternalStateModule = require('../internals/internal-state')
    var getBuiltIn = require('../internals/get-built-in')
    var getMethod = require('../internals/get-method')
    var AsyncIteratorPrototype = require('../internals/async-iterator-prototype')
    var createIterResultObject = require('../internals/create-iter-result-object')
    var iteratorClose = require('../internals/iterator-close')

    var Promise = getBuiltIn('Promise')

    var TO_STRING_TAG = wellKnownSymbol('toStringTag')
    var ASYNC_ITERATOR_HELPER = 'AsyncIteratorHelper'
    var WRAP_FOR_VALID_ASYNC_ITERATOR = 'WrapForValidAsyncIterator'
    var setInternalState = InternalStateModule.set

    var createAsyncIteratorProxyPrototype = function (IS_ITERATOR) {
      var IS_GENERATOR = !IS_ITERATOR
      var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER)

      var getStateOrEarlyExit = function (that) {
        var stateCompletion = perform(function () {
          return getInternalState(that)
        })

        var stateError = stateCompletion.error
        var state = stateCompletion.value

        if (stateError || (IS_GENERATOR && state.done)) {
          return { exit: true, value: stateError ? Promise.reject(state) : Promise.resolve(createIterResultObject(undefined, true)) }
        } return { exit: false, value: state }
      }

      return defineBuiltIns(create(AsyncIteratorPrototype), {
        next: function next () {
          var stateCompletion = getStateOrEarlyExit(this)
          var state = stateCompletion.value
          if (stateCompletion.exit) return state
          var handlerCompletion = perform(function () {
            return anObject(state.nextHandler(Promise))
          })
          var handlerError = handlerCompletion.error
          var value = handlerCompletion.value
          if (handlerError) state.done = true
          return handlerError ? Promise.reject(value) : Promise.resolve(value)
        },
        return: function () {
          var stateCompletion = getStateOrEarlyExit(this)
          var state = stateCompletion.value
          if (stateCompletion.exit) return state
          state.done = true
          var iterator = state.iterator
          var returnMethod, result
          var completion = perform(function () {
            if (state.inner) {
              try {
                iteratorClose(state.inner.iterator, 'normal')
              } catch (error) {
                return iteratorClose(iterator, 'throw', error)
              }
            }
            return getMethod(iterator, 'return')
          })
          returnMethod = result = completion.value
          if (completion.error) return Promise.reject(result)
          if (returnMethod === undefined) return Promise.resolve(createIterResultObject(undefined, true))
          completion = perform(function () {
            return call(returnMethod, iterator)
          })
          result = completion.value
          if (completion.error) return Promise.reject(result)
          return IS_ITERATOR ? Promise.resolve(result) : Promise.resolve(result).then(function (resolved) {
            anObject(resolved)
            return createIterResultObject(undefined, true)
          })
        }
      })
    }

    var WrapForValidAsyncIteratorPrototype = createAsyncIteratorProxyPrototype(true)
    var AsyncIteratorHelperPrototype = createAsyncIteratorProxyPrototype(false)

    createNonEnumerableProperty(AsyncIteratorHelperPrototype, TO_STRING_TAG, 'Async Iterator Helper')

    module.exports = function (nextHandler, IS_ITERATOR) {
      var AsyncIteratorProxy = function AsyncIterator (record, state) {
        if (state) {
          state.iterator = record.iterator
          state.next = record.next
        } else state = record
        state.type = IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER
        state.nextHandler = nextHandler
        state.counter = 0
        state.done = false
        setInternalState(this, state)
      }

      AsyncIteratorProxy.prototype = IS_ITERATOR ? WrapForValidAsyncIteratorPrototype : AsyncIteratorHelperPrototype

      return AsyncIteratorProxy
    }
  }, { '../internals/an-object': 33, '../internals/async-iterator-prototype': 39, '../internals/create-iter-result-object': 45, '../internals/create-non-enumerable-property': 46, '../internals/define-built-ins': 51, '../internals/function-call': 64, '../internals/get-built-in': 68, '../internals/get-method': 72, '../internals/internal-state': 80, '../internals/iterator-close': 89, '../internals/object-create': 97, '../internals/perform': 110, '../internals/well-known-symbol': 129 }],
  37: [function (require, module, exports) {
    'use strict'
    // https://github.com/tc39/proposal-iterator-helpers
    // https://github.com/tc39/proposal-array-from-async
    var call = require('../internals/function-call')
    var aCallable = require('../internals/a-callable')
    var anObject = require('../internals/an-object')
    var isObject = require('../internals/is-object')
    var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer')
    var getBuiltIn = require('../internals/get-built-in')
    var getIteratorDirect = require('../internals/get-iterator-direct')
    var closeAsyncIteration = require('../internals/async-iterator-close')

    var createMethod = function (TYPE) {
      var IS_TO_ARRAY = TYPE === 0
      var IS_FOR_EACH = TYPE === 1
      var IS_EVERY = TYPE === 2
      var IS_SOME = TYPE === 3
      return function (object, fn, target) {
        anObject(object)
        var MAPPING = fn !== undefined
        if (MAPPING || !IS_TO_ARRAY) aCallable(fn)
        var record = getIteratorDirect(object)
        var Promise = getBuiltIn('Promise')
        var iterator = record.iterator
        var next = record.next
        var counter = 0

        return new Promise(function (resolve, reject) {
          var ifAbruptCloseAsyncIterator = function (error) {
            closeAsyncIteration(iterator, reject, error, reject)
          }

          var loop = function () {
            try {
              if (MAPPING) {
                try {
                  doesNotExceedSafeInteger(counter)
                } catch (error5) { ifAbruptCloseAsyncIterator(error5) }
              }
              Promise.resolve(anObject(call(next, iterator))).then(function (step) {
                try {
                  if (anObject(step).done) {
                    if (IS_TO_ARRAY) {
                      target.length = counter
                      resolve(target)
                    } else resolve(IS_SOME ? false : IS_EVERY || undefined)
                  } else {
                    var value = step.value
                    try {
                      if (MAPPING) {
                        var result = fn(value, counter)

                        var handler = function ($result) {
                          if (IS_FOR_EACH) {
                            loop()
                          } else if (IS_EVERY) {
                            $result ? loop() : closeAsyncIteration(iterator, resolve, false, reject)
                          } else if (IS_TO_ARRAY) {
                            try {
                              target[counter++] = $result
                              loop()
                            } catch (error4) { ifAbruptCloseAsyncIterator(error4) }
                          } else {
                            $result ? closeAsyncIteration(iterator, resolve, IS_SOME || value, reject) : loop()
                          }
                        }

                        if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator)
                        else handler(result)
                      } else {
                        target[counter++] = value
                        loop()
                      }
                    } catch (error3) { ifAbruptCloseAsyncIterator(error3) }
                  }
                } catch (error2) { reject(error2) }
              }, reject)
            } catch (error) { reject(error) }
          }

          loop()
        })
      }
    }

    module.exports = {
      toArray: createMethod(0),
      forEach: createMethod(1),
      every: createMethod(2),
      some: createMethod(3),
      find: createMethod(4)
    }
  }, { '../internals/a-callable': 31, '../internals/an-object': 33, '../internals/async-iterator-close': 35, '../internals/does-not-exceed-safe-integer': 56, '../internals/function-call': 64, '../internals/get-built-in': 68, '../internals/get-iterator-direct': 69, '../internals/is-object': 85 }],
  38: [function (require, module, exports) {
    'use strict'
    var call = require('../internals/function-call')
    var aCallable = require('../internals/a-callable')
    var anObject = require('../internals/an-object')
    var isObject = require('../internals/is-object')
    var getIteratorDirect = require('../internals/get-iterator-direct')
    var createAsyncIteratorProxy = require('../internals/async-iterator-create-proxy')
    var createIterResultObject = require('../internals/create-iter-result-object')
    var closeAsyncIteration = require('../internals/async-iterator-close')

    var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
      var state = this
      var iterator = state.iterator
      var mapper = state.mapper

      return new Promise(function (resolve, reject) {
        var doneAndReject = function (error) {
          state.done = true
          reject(error)
        }

        var ifAbruptCloseAsyncIterator = function (error) {
          closeAsyncIteration(iterator, doneAndReject, error, doneAndReject)
        }

        Promise.resolve(anObject(call(state.next, iterator))).then(function (step) {
          try {
            if (anObject(step).done) {
              state.done = true
              resolve(createIterResultObject(undefined, true))
            } else {
              var value = step.value
              try {
                var result = mapper(value, state.counter++)

                var handler = function (mapped) {
                  resolve(createIterResultObject(mapped, false))
                }

                if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator)
                else handler(result)
              } catch (error2) { ifAbruptCloseAsyncIterator(error2) }
            }
          } catch (error) { doneAndReject(error) }
        }, doneAndReject)
      })
    })

    // `AsyncIterator.prototype.map` method
    // https://github.com/tc39/proposal-iterator-helpers
    module.exports = function map (mapper) {
      anObject(this)
      aCallable(mapper)
      return new AsyncIteratorProxy(getIteratorDirect(this), {
        mapper: mapper
      })
    }
  }, { '../internals/a-callable': 31, '../internals/an-object': 33, '../internals/async-iterator-close': 35, '../internals/async-iterator-create-proxy': 36, '../internals/create-iter-result-object': 45, '../internals/function-call': 64, '../internals/get-iterator-direct': 69, '../internals/is-object': 85 }],
  39: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var shared = require('../internals/shared-store')
    var isCallable = require('../internals/is-callable')
    var create = require('../internals/object-create')
    var getPrototypeOf = require('../internals/object-get-prototype-of')
    var defineBuiltIn = require('../internals/define-built-in')
    var wellKnownSymbol = require('../internals/well-known-symbol')
    var IS_PURE = require('../internals/is-pure')

    var USE_FUNCTION_CONSTRUCTOR = 'USE_FUNCTION_CONSTRUCTOR'
    var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator')
    var AsyncIterator = global.AsyncIterator
    var PassedAsyncIteratorPrototype = shared.AsyncIteratorPrototype
    var AsyncIteratorPrototype, prototype

    if (PassedAsyncIteratorPrototype) {
      AsyncIteratorPrototype = PassedAsyncIteratorPrototype
    } else if (isCallable(AsyncIterator)) {
      AsyncIteratorPrototype = AsyncIterator.prototype
    } else if (shared[USE_FUNCTION_CONSTRUCTOR] || global[USE_FUNCTION_CONSTRUCTOR]) {
      try {
        // eslint-disable-next-line no-new-func -- we have no alternatives without usage of modern syntax
        prototype = getPrototypeOf(getPrototypeOf(getPrototypeOf(Function('return async function*(){}()')())))
        if (getPrototypeOf(prototype) === Object.prototype) AsyncIteratorPrototype = prototype
      } catch (error) { /* empty */ }
    }

    if (!AsyncIteratorPrototype) AsyncIteratorPrototype = {}
    else if (IS_PURE) AsyncIteratorPrototype = create(AsyncIteratorPrototype)

    if (!isCallable(AsyncIteratorPrototype[ASYNC_ITERATOR])) {
      defineBuiltIn(AsyncIteratorPrototype, ASYNC_ITERATOR, function () {
        return this
      })
    }

    module.exports = AsyncIteratorPrototype
  }, { '../internals/define-built-in': 50, '../internals/global': 73, '../internals/is-callable': 82, '../internals/is-pure': 86, '../internals/object-create': 97, '../internals/object-get-prototype-of': 103, '../internals/shared-store': 113, '../internals/well-known-symbol': 129 }],
  40: [function (require, module, exports) {
    'use strict'
    var anObject = require('../internals/an-object')
    var iteratorClose = require('../internals/iterator-close')

    // call something on iterator step with safe closing on error
    module.exports = function (iterator, fn, value, ENTRIES) {
      try {
        return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value)
      } catch (error) {
        iteratorClose(iterator, 'throw', error)
      }
    }
  }, { '../internals/an-object': 33, '../internals/iterator-close': 89 }],
  41: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')

    var toString = uncurryThis({}.toString)
    var stringSlice = uncurryThis(''.slice)

    module.exports = function (it) {
      return stringSlice(toString(it), 8, -1)
    }
  }, { '../internals/function-uncurry-this': 67 }],
  42: [function (require, module, exports) {
    'use strict'
    var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support')
    var isCallable = require('../internals/is-callable')
    var classofRaw = require('../internals/classof-raw')
    var wellKnownSymbol = require('../internals/well-known-symbol')

    var TO_STRING_TAG = wellKnownSymbol('toStringTag')
    var $Object = Object

    // ES3 wrong here
    var CORRECT_ARGUMENTS = classofRaw(function () { return arguments }()) === 'Arguments'

    // fallback for IE11 Script Access Denied error
    var tryGet = function (it, key) {
      try {
        return it[key]
      } catch (error) { /* empty */ }
    }

    // getting tag from ES6+ `Object.prototype.toString`
    module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
      var O, tag, result
      return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
        : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) === 'string' ? tag
        // builtinTag case
          : CORRECT_ARGUMENTS ? classofRaw(O)
          // ES3 arguments fallback
            : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result
    }
  }, { '../internals/classof-raw': 41, '../internals/is-callable': 82, '../internals/to-string-tag-support': 123, '../internals/well-known-symbol': 129 }],
  43: [function (require, module, exports) {
    'use strict'
    var hasOwn = require('../internals/has-own-property')
    var ownKeys = require('../internals/own-keys')
    var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor')
    var definePropertyModule = require('../internals/object-define-property')

    module.exports = function (target, source, exceptions) {
      var keys = ownKeys(source)
      var defineProperty = definePropertyModule.f
      var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
          defineProperty(target, key, getOwnPropertyDescriptor(source, key))
        }
      }
    }
  }, { '../internals/has-own-property': 74, '../internals/object-define-property': 99, '../internals/object-get-own-property-descriptor': 100, '../internals/own-keys': 109 }],
  44: [function (require, module, exports) {
    'use strict'
    var fails = require('../internals/fails')

    module.exports = !fails(function () {
      function F () { /* empty */ }
      F.prototype.constructor = null
      // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
      return Object.getPrototypeOf(new F()) !== F.prototype
    })
  }, { '../internals/fails': 61 }],
  45: [function (require, module, exports) {
    'use strict'
    // `CreateIterResultObject` abstract operation
    // https://tc39.es/ecma262/#sec-createiterresultobject
    module.exports = function (value, done) {
      return { value: value, done: done }
    }
  }, {}],
  46: [function (require, module, exports) {
    'use strict'
    var DESCRIPTORS = require('../internals/descriptors')
    var definePropertyModule = require('../internals/object-define-property')
    var createPropertyDescriptor = require('../internals/create-property-descriptor')

    module.exports = DESCRIPTORS ? function (object, key, value) {
      return definePropertyModule.f(object, key, createPropertyDescriptor(1, value))
    } : function (object, key, value) {
      object[key] = value
      return object
    }
  }, { '../internals/create-property-descriptor': 47, '../internals/descriptors': 53, '../internals/object-define-property': 99 }],
  47: [function (require, module, exports) {
    'use strict'
    module.exports = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
      }
    }
  }, {}],
  48: [function (require, module, exports) {
    'use strict'
    var toPropertyKey = require('../internals/to-property-key')
    var definePropertyModule = require('../internals/object-define-property')
    var createPropertyDescriptor = require('../internals/create-property-descriptor')

    module.exports = function (object, key, value) {
      var propertyKey = toPropertyKey(key)
      if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value))
      else object[propertyKey] = value
    }
  }, { '../internals/create-property-descriptor': 47, '../internals/object-define-property': 99, '../internals/to-property-key': 122 }],
  49: [function (require, module, exports) {
    'use strict'
    var makeBuiltIn = require('../internals/make-built-in')
    var defineProperty = require('../internals/object-define-property')

    module.exports = function (target, name, descriptor) {
      if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true })
      if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true })
      return defineProperty.f(target, name, descriptor)
    }
  }, { '../internals/make-built-in': 95, '../internals/object-define-property': 99 }],
  50: [function (require, module, exports) {
    'use strict'
    var isCallable = require('../internals/is-callable')
    var definePropertyModule = require('../internals/object-define-property')
    var makeBuiltIn = require('../internals/make-built-in')
    var defineGlobalProperty = require('../internals/define-global-property')

    module.exports = function (O, key, value, options) {
      if (!options) options = {}
      var simple = options.enumerable
      var name = options.name !== undefined ? options.name : key
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
            value: value,
            enumerable: false,
            configurable: !options.nonConfigurable,
            writable: !options.nonWritable
          })
        }
      } return O
    }
  }, { '../internals/define-global-property': 52, '../internals/is-callable': 82, '../internals/make-built-in': 95, '../internals/object-define-property': 99 }],
  51: [function (require, module, exports) {
    'use strict'
    var defineBuiltIn = require('../internals/define-built-in')

    module.exports = function (target, src, options) {
      for (var key in src) defineBuiltIn(target, key, src[key], options)
      return target
    }
  }, { '../internals/define-built-in': 50 }],
  52: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')

    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var defineProperty = Object.defineProperty

    module.exports = function (key, value) {
      try {
        defineProperty(global, key, { value: value, configurable: true, writable: true })
      } catch (error) {
        global[key] = value
      } return value
    }
  }, { '../internals/global': 73 }],
  53: [function (require, module, exports) {
    'use strict'
    var fails = require('../internals/fails')

    // Detect IE8's incomplete defineProperty implementation
    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty({}, 1, { get: function () { return 7 } })[1] !== 7
    })
  }, { '../internals/fails': 61 }],
  54: [function (require, module, exports) {
    'use strict'
    var documentAll = typeof document === 'object' && document.all

    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
    // eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
    var IS_HTMLDDA = typeof documentAll === 'undefined' && documentAll !== undefined

    module.exports = {
      all: documentAll,
      IS_HTMLDDA: IS_HTMLDDA
    }
  }, {}],
  55: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var isObject = require('../internals/is-object')

    var document = global.document
    // typeof document.createElement is 'object' in old IE
    var EXISTS = isObject(document) && isObject(document.createElement)

    module.exports = function (it) {
      return EXISTS ? document.createElement(it) : {}
    }
  }, { '../internals/global': 73, '../internals/is-object': 85 }],
  56: [function (require, module, exports) {
    'use strict'
    var $TypeError = TypeError
    var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF // 2 ** 53 - 1 == 9007199254740991

    module.exports = function (it) {
      if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded')
      return it
    }
  }, {}],
  57: [function (require, module, exports) {
    'use strict'
    module.exports = typeof navigator !== 'undefined' && String(navigator.userAgent) || ''
  }, {}],
  58: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var userAgent = require('../internals/engine-user-agent')

    var process = global.process
    var Deno = global.Deno
    var versions = process && process.versions || Deno && Deno.version
    var v8 = versions && versions.v8
    var match, version

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
  }, { '../internals/engine-user-agent': 57, '../internals/global': 73 }],
  59: [function (require, module, exports) {
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
  60: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f
    var createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    var defineBuiltIn = require('../internals/define-built-in')
    var defineGlobalProperty = require('../internals/define-global-property')
    var copyConstructorProperties = require('../internals/copy-constructor-properties')
    var isForced = require('../internals/is-forced')

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
      var TARGET = options.target
      var GLOBAL = options.global
      var STATIC = options.stat
      var FORCED, target, key, targetProperty, sourceProperty, descriptor
      if (GLOBAL) {
        target = global
      } else if (STATIC) {
        target = global[TARGET] || defineGlobalProperty(TARGET, {})
      } else {
        target = (global[TARGET] || {}).prototype
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
  }, { '../internals/copy-constructor-properties': 43, '../internals/create-non-enumerable-property': 46, '../internals/define-built-in': 50, '../internals/define-global-property': 52, '../internals/global': 73, '../internals/is-forced': 83, '../internals/object-get-own-property-descriptor': 100 }],
  61: [function (require, module, exports) {
    'use strict'
    module.exports = function (exec) {
      try {
        return !!exec()
      } catch (error) {
        return true
      }
    }
  }, {}],
  62: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this-clause')
    var aCallable = require('../internals/a-callable')
    var NATIVE_BIND = require('../internals/function-bind-native')

    var bind = uncurryThis(uncurryThis.bind)

    // optional / simple context binding
    module.exports = function (fn, that) {
      aCallable(fn)
      return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
        return fn.apply(that, arguments)
      }
    }
  }, { '../internals/a-callable': 31, '../internals/function-bind-native': 63, '../internals/function-uncurry-this-clause': 66 }],
  63: [function (require, module, exports) {
    'use strict'
    var fails = require('../internals/fails')

    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-function-prototype-bind -- safe
      var test = function () { /* empty */ }.bind()
      // eslint-disable-next-line no-prototype-builtins -- safe
      return typeof test !== 'function' || test.hasOwnProperty('prototype')
    })
  }, { '../internals/fails': 61 }],
  64: [function (require, module, exports) {
    'use strict'
    var NATIVE_BIND = require('../internals/function-bind-native')

    var call = Function.prototype.call

    module.exports = NATIVE_BIND ? call.bind(call) : function () {
      return call.apply(call, arguments)
    }
  }, { '../internals/function-bind-native': 63 }],
  65: [function (require, module, exports) {
    'use strict'
    var DESCRIPTORS = require('../internals/descriptors')
    var hasOwn = require('../internals/has-own-property')

    var FunctionPrototype = Function.prototype
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor

    var EXISTS = hasOwn(FunctionPrototype, 'name')
    // additional protection from minified / mangled / dropped function names
    var PROPER = EXISTS && function something () { /* empty */ }.name === 'something'
    var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable))

    module.exports = {
      EXISTS: EXISTS,
      PROPER: PROPER,
      CONFIGURABLE: CONFIGURABLE
    }
  }, { '../internals/descriptors': 53, '../internals/has-own-property': 74 }],
  66: [function (require, module, exports) {
    'use strict'
    var classofRaw = require('../internals/classof-raw')
    var uncurryThis = require('../internals/function-uncurry-this')

    module.exports = function (fn) {
      // Nashorn bug:
      //   https://github.com/zloirock/core-js/issues/1128
      //   https://github.com/zloirock/core-js/issues/1130
      if (classofRaw(fn) === 'Function') return uncurryThis(fn)
    }
  }, { '../internals/classof-raw': 41, '../internals/function-uncurry-this': 67 }],
  67: [function (require, module, exports) {
    'use strict'
    var NATIVE_BIND = require('../internals/function-bind-native')

    var FunctionPrototype = Function.prototype
    var call = FunctionPrototype.call
    var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call)

    module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
      return function () {
        return call.apply(fn, arguments)
      }
    }
  }, { '../internals/function-bind-native': 63 }],
  68: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var isCallable = require('../internals/is-callable')

    var aFunction = function (argument) {
      return isCallable(argument) ? argument : undefined
    }

    module.exports = function (namespace, method) {
      return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method]
    }
  }, { '../internals/global': 73, '../internals/is-callable': 82 }],
  69: [function (require, module, exports) {
    'use strict'
    // `GetIteratorDirect(obj)` abstract operation
    // https://tc39.es/proposal-iterator-helpers/#sec-getiteratordirect
    module.exports = function (obj) {
      return {
        iterator: obj,
        next: obj.next,
        done: false
      }
    }
  }, {}],
  70: [function (require, module, exports) {
    'use strict'
    var classof = require('../internals/classof')
    var getMethod = require('../internals/get-method')
    var isNullOrUndefined = require('../internals/is-null-or-undefined')
    var Iterators = require('../internals/iterators')
    var wellKnownSymbol = require('../internals/well-known-symbol')

    var ITERATOR = wellKnownSymbol('iterator')

    module.exports = function (it) {
      if (!isNullOrUndefined(it)) {
        return getMethod(it, ITERATOR) ||
    getMethod(it, '@@iterator') ||
    Iterators[classof(it)]
      }
    }
  }, { '../internals/classof': 42, '../internals/get-method': 72, '../internals/is-null-or-undefined': 84, '../internals/iterators': 93, '../internals/well-known-symbol': 129 }],
  71: [function (require, module, exports) {
    'use strict'
    var call = require('../internals/function-call')
    var aCallable = require('../internals/a-callable')
    var anObject = require('../internals/an-object')
    var tryToString = require('../internals/try-to-string')
    var getIteratorMethod = require('../internals/get-iterator-method')

    var $TypeError = TypeError

    module.exports = function (argument, usingIterator) {
      var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator
      if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument))
      throw new $TypeError(tryToString(argument) + ' is not iterable')
    }
  }, { '../internals/a-callable': 31, '../internals/an-object': 33, '../internals/function-call': 64, '../internals/get-iterator-method': 70, '../internals/try-to-string': 124 }],
  72: [function (require, module, exports) {
    'use strict'
    var aCallable = require('../internals/a-callable')
    var isNullOrUndefined = require('../internals/is-null-or-undefined')

    // `GetMethod` abstract operation
    // https://tc39.es/ecma262/#sec-getmethod
    module.exports = function (V, P) {
      var func = V[P]
      return isNullOrUndefined(func) ? undefined : aCallable(func)
    }
  }, { '../internals/a-callable': 31, '../internals/is-null-or-undefined': 84 }],
  73: [function (require, module, exports) {
    (function (global) {
      (function () {
        'use strict'
        var check = function (it) {
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
  74: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')
    var toObject = require('../internals/to-object')

    var hasOwnProperty = uncurryThis({}.hasOwnProperty)

    // `HasOwnProperty` abstract operation
    // https://tc39.es/ecma262/#sec-hasownproperty
    // eslint-disable-next-line es/no-object-hasown -- safe
    module.exports = Object.hasOwn || function hasOwn (it, key) {
      return hasOwnProperty(toObject(it), key)
    }
  }, { '../internals/function-uncurry-this': 67, '../internals/to-object': 120 }],
  75: [function (require, module, exports) {
    'use strict'
    module.exports = {}
  }, {}],
  76: [function (require, module, exports) {
    'use strict'
    var getBuiltIn = require('../internals/get-built-in')

    module.exports = getBuiltIn('document', 'documentElement')
  }, { '../internals/get-built-in': 68 }],
  77: [function (require, module, exports) {
    'use strict'
    var DESCRIPTORS = require('../internals/descriptors')
    var fails = require('../internals/fails')
    var createElement = require('../internals/document-create-element')

    // Thanks to IE8 for its funny defineProperty
    module.exports = !DESCRIPTORS && !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty(createElement('div'), 'a', {
        get: function () { return 7 }
      }).a !== 7
    })
  }, { '../internals/descriptors': 53, '../internals/document-create-element': 55, '../internals/fails': 61 }],
  78: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')
    var fails = require('../internals/fails')
    var classof = require('../internals/classof-raw')

    var $Object = Object
    var split = uncurryThis(''.split)

    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    module.exports = fails(function () {
      // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
      // eslint-disable-next-line no-prototype-builtins -- safe
      return !$Object('z').propertyIsEnumerable(0)
    }) ? function (it) {
        return classof(it) === 'String' ? split(it, '') : $Object(it)
      } : $Object
  }, { '../internals/classof-raw': 41, '../internals/fails': 61, '../internals/function-uncurry-this': 67 }],
  79: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')
    var isCallable = require('../internals/is-callable')
    var store = require('../internals/shared-store')

    var functionToString = uncurryThis(Function.toString)

    // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
    if (!isCallable(store.inspectSource)) {
      store.inspectSource = function (it) {
        return functionToString(it)
      }
    }

    module.exports = store.inspectSource
  }, { '../internals/function-uncurry-this': 67, '../internals/is-callable': 82, '../internals/shared-store': 113 }],
  80: [function (require, module, exports) {
    'use strict'
    var NATIVE_WEAK_MAP = require('../internals/weak-map-basic-detection')
    var global = require('../internals/global')
    var isObject = require('../internals/is-object')
    var createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    var hasOwn = require('../internals/has-own-property')
    var shared = require('../internals/shared-store')
    var sharedKey = require('../internals/shared-key')
    var hiddenKeys = require('../internals/hidden-keys')

    var OBJECT_ALREADY_INITIALIZED = 'Object already initialized'
    var TypeError = global.TypeError
    var WeakMap = global.WeakMap
    var set, get, has

    var enforce = function (it) {
      return has(it) ? get(it) : set(it, {})
    }

    var getterFor = function (TYPE) {
      return function (it) {
        var state
        if (!isObject(it) || (state = get(it)).type !== TYPE) {
          throw new TypeError('Incompatible receiver, ' + TYPE + ' required')
        } return state
      }
    }

    if (NATIVE_WEAK_MAP || shared.state) {
      var store = shared.state || (shared.state = new WeakMap())
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
      var STATE = sharedKey('state')
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
      set: set,
      get: get,
      has: has,
      enforce: enforce,
      getterFor: getterFor
    }
  }, { '../internals/create-non-enumerable-property': 46, '../internals/global': 73, '../internals/has-own-property': 74, '../internals/hidden-keys': 75, '../internals/is-object': 85, '../internals/shared-key': 112, '../internals/shared-store': 113, '../internals/weak-map-basic-detection': 128 }],
  81: [function (require, module, exports) {
    'use strict'
    var wellKnownSymbol = require('../internals/well-known-symbol')
    var Iterators = require('../internals/iterators')

    var ITERATOR = wellKnownSymbol('iterator')
    var ArrayPrototype = Array.prototype

    // check on default Array iterator
    module.exports = function (it) {
      return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it)
    }
  }, { '../internals/iterators': 93, '../internals/well-known-symbol': 129 }],
  82: [function (require, module, exports) {
    'use strict'
    var $documentAll = require('../internals/document-all')

    var documentAll = $documentAll.all

    // `IsCallable` abstract operation
    // https://tc39.es/ecma262/#sec-iscallable
    module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
      return typeof argument === 'function' || argument === documentAll
    } : function (argument) {
      return typeof argument === 'function'
    }
  }, { '../internals/document-all': 54 }],
  83: [function (require, module, exports) {
    'use strict'
    var fails = require('../internals/fails')
    var isCallable = require('../internals/is-callable')

    var replacement = /#|\.prototype\./

    var isForced = function (feature, detection) {
      var value = data[normalize(feature)]
      return value === POLYFILL ? true
        : value === NATIVE ? false
          : isCallable(detection) ? fails(detection)
            : !!detection
    }

    var normalize = isForced.normalize = function (string) {
      return String(string).replace(replacement, '.').toLowerCase()
    }

    var data = isForced.data = {}
    var NATIVE = isForced.NATIVE = 'N'
    var POLYFILL = isForced.POLYFILL = 'P'

    module.exports = isForced
  }, { '../internals/fails': 61, '../internals/is-callable': 82 }],
  84: [function (require, module, exports) {
    'use strict'
    // we can't use just `it == null` since of `document.all` special case
    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
    module.exports = function (it) {
      return it === null || it === undefined
    }
  }, {}],
  85: [function (require, module, exports) {
    'use strict'
    var isCallable = require('../internals/is-callable')
    var $documentAll = require('../internals/document-all')

    var documentAll = $documentAll.all

    module.exports = $documentAll.IS_HTMLDDA ? function (it) {
      return typeof it === 'object' ? it !== null : isCallable(it) || it === documentAll
    } : function (it) {
      return typeof it === 'object' ? it !== null : isCallable(it)
    }
  }, { '../internals/document-all': 54, '../internals/is-callable': 82 }],
  86: [function (require, module, exports) {
    'use strict'
    module.exports = false
  }, {}],
  87: [function (require, module, exports) {
    'use strict'
    var getBuiltIn = require('../internals/get-built-in')
    var isCallable = require('../internals/is-callable')
    var isPrototypeOf = require('../internals/object-is-prototype-of')
    var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid')

    var $Object = Object

    module.exports = USE_SYMBOL_AS_UID ? function (it) {
      return typeof it === 'symbol'
    } : function (it) {
      var $Symbol = getBuiltIn('Symbol')
      return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it))
    }
  }, { '../internals/get-built-in': 68, '../internals/is-callable': 82, '../internals/object-is-prototype-of': 104, '../internals/use-symbol-as-uid': 126 }],
  88: [function (require, module, exports) {
    'use strict'
    var bind = require('../internals/function-bind-context')
    var call = require('../internals/function-call')
    var anObject = require('../internals/an-object')
    var tryToString = require('../internals/try-to-string')
    var isArrayIteratorMethod = require('../internals/is-array-iterator-method')
    var lengthOfArrayLike = require('../internals/length-of-array-like')
    var isPrototypeOf = require('../internals/object-is-prototype-of')
    var getIterator = require('../internals/get-iterator')
    var getIteratorMethod = require('../internals/get-iterator-method')
    var iteratorClose = require('../internals/iterator-close')

    var $TypeError = TypeError

    var Result = function (stopped, result) {
      this.stopped = stopped
      this.result = result
    }

    var ResultPrototype = Result.prototype

    module.exports = function (iterable, unboundFunction, options) {
      var that = options && options.that
      var AS_ENTRIES = !!(options && options.AS_ENTRIES)
      var IS_RECORD = !!(options && options.IS_RECORD)
      var IS_ITERATOR = !!(options && options.IS_ITERATOR)
      var INTERRUPTED = !!(options && options.INTERRUPTED)
      var fn = bind(unboundFunction, that)
      var iterator, iterFn, index, length, result, next, step

      var stop = function (condition) {
        if (iterator) iteratorClose(iterator, 'normal', condition)
        return new Result(true, condition)
      }

      var callFn = function (value) {
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
        try {
          result = callFn(step.value)
        } catch (error) {
          iteratorClose(iterator, 'throw', error)
        }
        if (typeof result === 'object' && result && isPrototypeOf(ResultPrototype, result)) return result
      } return new Result(false)
    }
  }, { '../internals/an-object': 33, '../internals/function-bind-context': 62, '../internals/function-call': 64, '../internals/get-iterator': 71, '../internals/get-iterator-method': 70, '../internals/is-array-iterator-method': 81, '../internals/iterator-close': 89, '../internals/length-of-array-like': 94, '../internals/object-is-prototype-of': 104, '../internals/try-to-string': 124 }],
  89: [function (require, module, exports) {
    'use strict'
    var call = require('../internals/function-call')
    var anObject = require('../internals/an-object')
    var getMethod = require('../internals/get-method')

    module.exports = function (iterator, kind, value) {
      var innerResult, innerError
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
  }, { '../internals/an-object': 33, '../internals/function-call': 64, '../internals/get-method': 72 }],
  90: [function (require, module, exports) {
    'use strict'
    var call = require('../internals/function-call')
    var create = require('../internals/object-create')
    var createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    var defineBuiltIns = require('../internals/define-built-ins')
    var wellKnownSymbol = require('../internals/well-known-symbol')
    var InternalStateModule = require('../internals/internal-state')
    var getMethod = require('../internals/get-method')
    var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype
    var createIterResultObject = require('../internals/create-iter-result-object')
    var iteratorClose = require('../internals/iterator-close')

    var TO_STRING_TAG = wellKnownSymbol('toStringTag')
    var ITERATOR_HELPER = 'IteratorHelper'
    var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator'
    var setInternalState = InternalStateModule.set

    var createIteratorProxyPrototype = function (IS_ITERATOR) {
      var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER)

      return defineBuiltIns(create(IteratorPrototype), {
        next: function next () {
          var state = getInternalState(this)
          // for simplification:
          //   for `%WrapForValidIteratorPrototype%.next` our `nextHandler` returns `IterResultObject`
          //   for `%IteratorHelperPrototype%.next` - just a value
          if (IS_ITERATOR) return state.nextHandler()
          try {
            var result = state.done ? undefined : state.nextHandler()
            return createIterResultObject(result, state.done)
          } catch (error) {
            state.done = true
            throw error
          }
        },
        return: function () {
          var state = getInternalState(this)
          var iterator = state.iterator
          state.done = true
          if (IS_ITERATOR) {
            var returnMethod = getMethod(iterator, 'return')
            return returnMethod ? call(returnMethod, iterator) : createIterResultObject(undefined, true)
          }
          if (state.inner) {
            try {
              iteratorClose(state.inner.iterator, 'normal')
            } catch (error) {
              return iteratorClose(iterator, 'throw', error)
            }
          }
          iteratorClose(iterator, 'normal')
          return createIterResultObject(undefined, true)
        }
      })
    }

    var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true)
    var IteratorHelperPrototype = createIteratorProxyPrototype(false)

    createNonEnumerableProperty(IteratorHelperPrototype, TO_STRING_TAG, 'Iterator Helper')

    module.exports = function (nextHandler, IS_ITERATOR) {
      var IteratorProxy = function Iterator (record, state) {
        if (state) {
          state.iterator = record.iterator
          state.next = record.next
        } else state = record
        state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER
        state.nextHandler = nextHandler
        state.counter = 0
        state.done = false
        setInternalState(this, state)
      }

      IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype

      return IteratorProxy
    }
  }, { '../internals/create-iter-result-object': 45, '../internals/create-non-enumerable-property': 46, '../internals/define-built-ins': 51, '../internals/function-call': 64, '../internals/get-method': 72, '../internals/internal-state': 80, '../internals/iterator-close': 89, '../internals/iterators-core': 92, '../internals/object-create': 97, '../internals/well-known-symbol': 129 }],
  91: [function (require, module, exports) {
    'use strict'
    var call = require('../internals/function-call')
    var aCallable = require('../internals/a-callable')
    var anObject = require('../internals/an-object')
    var getIteratorDirect = require('../internals/get-iterator-direct')
    var createIteratorProxy = require('../internals/iterator-create-proxy')
    var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing')

    var IteratorProxy = createIteratorProxy(function () {
      var iterator = this.iterator
      var result = anObject(call(this.next, iterator))
      var done = this.done = !!result.done
      if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true)
    })

    // `Iterator.prototype.map` method
    // https://github.com/tc39/proposal-iterator-helpers
    module.exports = function map (mapper) {
      anObject(this)
      aCallable(mapper)
      return new IteratorProxy(getIteratorDirect(this), {
        mapper: mapper
      })
    }
  }, { '../internals/a-callable': 31, '../internals/an-object': 33, '../internals/call-with-safe-iteration-closing': 40, '../internals/function-call': 64, '../internals/get-iterator-direct': 69, '../internals/iterator-create-proxy': 90 }],
  92: [function (require, module, exports) {
    'use strict'
    var fails = require('../internals/fails')
    var isCallable = require('../internals/is-callable')
    var isObject = require('../internals/is-object')
    var create = require('../internals/object-create')
    var getPrototypeOf = require('../internals/object-get-prototype-of')
    var defineBuiltIn = require('../internals/define-built-in')
    var wellKnownSymbol = require('../internals/well-known-symbol')
    var IS_PURE = require('../internals/is-pure')

    var ITERATOR = wellKnownSymbol('iterator')
    var BUGGY_SAFARI_ITERATORS = false

    // `%IteratorPrototype%` object
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
    var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator

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

    var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
      var test = {}
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
      IteratorPrototype: IteratorPrototype,
      BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
    }
  }, { '../internals/define-built-in': 50, '../internals/fails': 61, '../internals/is-callable': 82, '../internals/is-object': 85, '../internals/is-pure': 86, '../internals/object-create': 97, '../internals/object-get-prototype-of': 103, '../internals/well-known-symbol': 129 }],
  93: [function (require, module, exports) {
    arguments[4][75][0].apply(exports, arguments)
  }, { dup: 75 }],
  94: [function (require, module, exports) {
    'use strict'
    var toLength = require('../internals/to-length')

    // `LengthOfArrayLike` abstract operation
    // https://tc39.es/ecma262/#sec-lengthofarraylike
    module.exports = function (obj) {
      return toLength(obj.length)
    }
  }, { '../internals/to-length': 119 }],
  95: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')
    var fails = require('../internals/fails')
    var isCallable = require('../internals/is-callable')
    var hasOwn = require('../internals/has-own-property')
    var DESCRIPTORS = require('../internals/descriptors')
    var CONFIGURABLE_FUNCTION_NAME = require('../internals/function-name').CONFIGURABLE
    var inspectSource = require('../internals/inspect-source')
    var InternalStateModule = require('../internals/internal-state')

    var enforceInternalState = InternalStateModule.enforce
    var getInternalState = InternalStateModule.get
    var $String = String
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var defineProperty = Object.defineProperty
    var stringSlice = uncurryThis(''.slice)
    var replace = uncurryThis(''.replace)
    var join = uncurryThis([].join)

    var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
      return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8
    })

    var TEMPLATE = String(String).split('String')

    var makeBuiltIn = module.exports = function (value, name, options) {
      if (stringSlice($String(name), 0, 7) === 'Symbol(') {
        name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']'
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
      var state = enforceInternalState(value)
      if (!hasOwn(state, 'source')) {
        state.source = join(TEMPLATE, typeof name === 'string' ? name : '')
      } return value
    }

    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    // eslint-disable-next-line no-extend-native -- required
    Function.prototype.toString = makeBuiltIn(function toString () {
      return isCallable(this) && getInternalState(this).source || inspectSource(this)
    }, 'toString')
  }, { '../internals/descriptors': 53, '../internals/fails': 61, '../internals/function-name': 65, '../internals/function-uncurry-this': 67, '../internals/has-own-property': 74, '../internals/inspect-source': 79, '../internals/internal-state': 80, '../internals/is-callable': 82 }],
  96: [function (require, module, exports) {
    'use strict'
    var ceil = Math.ceil
    var floor = Math.floor

    // `Math.trunc` method
    // https://tc39.es/ecma262/#sec-math.trunc
    // eslint-disable-next-line es/no-math-trunc -- safe
    module.exports = Math.trunc || function trunc (x) {
      var n = +x
      return (n > 0 ? floor : ceil)(n)
    }
  }, {}],
  97: [function (require, module, exports) {
    'use strict'
    /* global ActiveXObject -- old IE, WSH */
    var anObject = require('../internals/an-object')
    var definePropertiesModule = require('../internals/object-define-properties')
    var enumBugKeys = require('../internals/enum-bug-keys')
    var hiddenKeys = require('../internals/hidden-keys')
    var html = require('../internals/html')
    var documentCreateElement = require('../internals/document-create-element')
    var sharedKey = require('../internals/shared-key')

    var GT = '>'
    var LT = '<'
    var PROTOTYPE = 'prototype'
    var SCRIPT = 'script'
    var IE_PROTO = sharedKey('IE_PROTO')

    var EmptyConstructor = function () { /* empty */ }

    var scriptTag = function (content) {
      return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT
    }

    // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
    var NullProtoObjectViaActiveX = function (activeXDocument) {
      activeXDocument.write(scriptTag(''))
      activeXDocument.close()
      var temp = activeXDocument.parentWindow.Object
      activeXDocument = null // avoid memory leak
      return temp
    }

    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    var NullProtoObjectViaIFrame = function () {
      // Thrash, waste and sodomy: IE GC bug
      var iframe = documentCreateElement('iframe')
      var JS = 'java' + SCRIPT + ':'
      var iframeDocument
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
    var activeXDocument
    var NullProtoObject = function () {
      try {
        activeXDocument = new ActiveXObject('htmlfile')
      } catch (error) { /* ignore */ }
      NullProtoObject = typeof document !== 'undefined'
        ? document.domain && activeXDocument
          ? NullProtoObjectViaActiveX(activeXDocument) // old IE
          : NullProtoObjectViaIFrame()
        : NullProtoObjectViaActiveX(activeXDocument) // WSH
      var length = enumBugKeys.length
      while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]]
      return NullProtoObject()
    }

    hiddenKeys[IE_PROTO] = true

    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    // eslint-disable-next-line es/no-object-create -- safe
    module.exports = Object.create || function create (O, Properties) {
      var result
      if (O !== null) {
        EmptyConstructor[PROTOTYPE] = anObject(O)
        result = new EmptyConstructor()
        EmptyConstructor[PROTOTYPE] = null
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO] = O
      } else result = NullProtoObject()
      return Properties === undefined ? result : definePropertiesModule.f(result, Properties)
    }
  }, { '../internals/an-object': 33, '../internals/document-create-element': 55, '../internals/enum-bug-keys': 59, '../internals/hidden-keys': 75, '../internals/html': 76, '../internals/object-define-properties': 98, '../internals/shared-key': 112 }],
  98: [function (require, module, exports) {
    'use strict'
    var DESCRIPTORS = require('../internals/descriptors')
    var V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug')
    var definePropertyModule = require('../internals/object-define-property')
    var anObject = require('../internals/an-object')
    var toIndexedObject = require('../internals/to-indexed-object')
    var objectKeys = require('../internals/object-keys')

    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    // eslint-disable-next-line es/no-object-defineproperties -- safe
    exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties (O, Properties) {
      anObject(O)
      var props = toIndexedObject(Properties)
      var keys = objectKeys(Properties)
      var length = keys.length
      var index = 0
      var key
      while (length > index) definePropertyModule.f(O, key = keys[index++], props[key])
      return O
    }
  }, { '../internals/an-object': 33, '../internals/descriptors': 53, '../internals/object-define-property': 99, '../internals/object-keys': 106, '../internals/to-indexed-object': 117, '../internals/v8-prototype-define-bug': 127 }],
  99: [function (require, module, exports) {
    'use strict'
    var DESCRIPTORS = require('../internals/descriptors')
    var IE8_DOM_DEFINE = require('../internals/ie8-dom-define')
    var V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug')
    var anObject = require('../internals/an-object')
    var toPropertyKey = require('../internals/to-property-key')

    var $TypeError = TypeError
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var $defineProperty = Object.defineProperty
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
    var ENUMERABLE = 'enumerable'
    var CONFIGURABLE = 'configurable'
    var WRITABLE = 'writable'

    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty (O, P, Attributes) {
      anObject(O)
      P = toPropertyKey(P)
      anObject(Attributes)
      if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
        var current = $getOwnPropertyDescriptor(O, P)
        if (current && current[WRITABLE]) {
          O[P] = Attributes.value
          Attributes = {
            configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
            enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
            writable: false
          }
        }
      } return $defineProperty(O, P, Attributes)
    } : $defineProperty : function defineProperty (O, P, Attributes) {
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
  }, { '../internals/an-object': 33, '../internals/descriptors': 53, '../internals/ie8-dom-define': 77, '../internals/to-property-key': 122, '../internals/v8-prototype-define-bug': 127 }],
  100: [function (require, module, exports) {
    'use strict'
    var DESCRIPTORS = require('../internals/descriptors')
    var call = require('../internals/function-call')
    var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable')
    var createPropertyDescriptor = require('../internals/create-property-descriptor')
    var toIndexedObject = require('../internals/to-indexed-object')
    var toPropertyKey = require('../internals/to-property-key')
    var hasOwn = require('../internals/has-own-property')
    var IE8_DOM_DEFINE = require('../internals/ie8-dom-define')

    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor

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
  }, { '../internals/create-property-descriptor': 47, '../internals/descriptors': 53, '../internals/function-call': 64, '../internals/has-own-property': 74, '../internals/ie8-dom-define': 77, '../internals/object-property-is-enumerable': 107, '../internals/to-indexed-object': 117, '../internals/to-property-key': 122 }],
  101: [function (require, module, exports) {
    'use strict'
    var internalObjectKeys = require('../internals/object-keys-internal')
    var enumBugKeys = require('../internals/enum-bug-keys')

    var hiddenKeys = enumBugKeys.concat('length', 'prototype')

    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    // eslint-disable-next-line es/no-object-getownpropertynames -- safe
    exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames (O) {
      return internalObjectKeys(O, hiddenKeys)
    }
  }, { '../internals/enum-bug-keys': 59, '../internals/object-keys-internal': 105 }],
  102: [function (require, module, exports) {
    'use strict'
    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    exports.f = Object.getOwnPropertySymbols
  }, {}],
  103: [function (require, module, exports) {
    'use strict'
    var hasOwn = require('../internals/has-own-property')
    var isCallable = require('../internals/is-callable')
    var toObject = require('../internals/to-object')
    var sharedKey = require('../internals/shared-key')
    var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter')

    var IE_PROTO = sharedKey('IE_PROTO')
    var $Object = Object
    var ObjectPrototype = $Object.prototype

    // `Object.getPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.getprototypeof
    // eslint-disable-next-line es/no-object-getprototypeof -- safe
    module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
      var object = toObject(O)
      if (hasOwn(object, IE_PROTO)) return object[IE_PROTO]
      var constructor = object.constructor
      if (isCallable(constructor) && object instanceof constructor) {
        return constructor.prototype
      } return object instanceof $Object ? ObjectPrototype : null
    }
  }, { '../internals/correct-prototype-getter': 44, '../internals/has-own-property': 74, '../internals/is-callable': 82, '../internals/shared-key': 112, '../internals/to-object': 120 }],
  104: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')

    module.exports = uncurryThis({}.isPrototypeOf)
  }, { '../internals/function-uncurry-this': 67 }],
  105: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')
    var hasOwn = require('../internals/has-own-property')
    var toIndexedObject = require('../internals/to-indexed-object')
    var indexOf = require('../internals/array-includes').indexOf
    var hiddenKeys = require('../internals/hidden-keys')

    var push = uncurryThis([].push)

    module.exports = function (object, names) {
      var O = toIndexedObject(object)
      var i = 0
      var result = []
      var key
      for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key)
      // Don't enum bug & hidden keys
      while (names.length > i) {
        if (hasOwn(O, key = names[i++])) {
          ~indexOf(result, key) || push(result, key)
        }
      }
      return result
    }
  }, { '../internals/array-includes': 34, '../internals/function-uncurry-this': 67, '../internals/has-own-property': 74, '../internals/hidden-keys': 75, '../internals/to-indexed-object': 117 }],
  106: [function (require, module, exports) {
    'use strict'
    var internalObjectKeys = require('../internals/object-keys-internal')
    var enumBugKeys = require('../internals/enum-bug-keys')

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    module.exports = Object.keys || function keys (O) {
      return internalObjectKeys(O, enumBugKeys)
    }
  }, { '../internals/enum-bug-keys': 59, '../internals/object-keys-internal': 105 }],
  107: [function (require, module, exports) {
    'use strict'
    var $propertyIsEnumerable = {}.propertyIsEnumerable
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor

    // Nashorn ~ JDK8 bug
    var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1)

    // `Object.prototype.propertyIsEnumerable` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
    exports.f = NASHORN_BUG ? function propertyIsEnumerable (V) {
      var descriptor = getOwnPropertyDescriptor(this, V)
      return !!descriptor && descriptor.enumerable
    } : $propertyIsEnumerable
  }, {}],
  108: [function (require, module, exports) {
    'use strict'
    var call = require('../internals/function-call')
    var isCallable = require('../internals/is-callable')
    var isObject = require('../internals/is-object')

    var $TypeError = TypeError

    // `OrdinaryToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-ordinarytoprimitive
    module.exports = function (input, pref) {
      var fn, val
      if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val
      if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val
      if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val
      throw new $TypeError("Can't convert object to primitive value")
    }
  }, { '../internals/function-call': 64, '../internals/is-callable': 82, '../internals/is-object': 85 }],
  109: [function (require, module, exports) {
    'use strict'
    var getBuiltIn = require('../internals/get-built-in')
    var uncurryThis = require('../internals/function-uncurry-this')
    var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names')
    var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols')
    var anObject = require('../internals/an-object')

    var concat = uncurryThis([].concat)

    // all object keys, includes non-enumerable and symbols
    module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys (it) {
      var keys = getOwnPropertyNamesModule.f(anObject(it))
      var getOwnPropertySymbols = getOwnPropertySymbolsModule.f
      return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys
    }
  }, { '../internals/an-object': 33, '../internals/function-uncurry-this': 67, '../internals/get-built-in': 68, '../internals/object-get-own-property-names': 101, '../internals/object-get-own-property-symbols': 102 }],
  110: [function (require, module, exports) {
    'use strict'
    module.exports = function (exec) {
      try {
        return { error: false, value: exec() }
      } catch (error) {
        return { error: true, value: error }
      }
    }
  }, {}],
  111: [function (require, module, exports) {
    'use strict'
    var isNullOrUndefined = require('../internals/is-null-or-undefined')

    var $TypeError = TypeError

    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    module.exports = function (it) {
      if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it)
      return it
    }
  }, { '../internals/is-null-or-undefined': 84 }],
  112: [function (require, module, exports) {
    'use strict'
    var shared = require('../internals/shared')
    var uid = require('../internals/uid')

    var keys = shared('keys')

    module.exports = function (key) {
      return keys[key] || (keys[key] = uid(key))
    }
  }, { '../internals/shared': 114, '../internals/uid': 125 }],
  113: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var defineGlobalProperty = require('../internals/define-global-property')

    var SHARED = '__core-js_shared__'
    var store = global[SHARED] || defineGlobalProperty(SHARED, {})

    module.exports = store
  }, { '../internals/define-global-property': 52, '../internals/global': 73 }],
  114: [function (require, module, exports) {
    'use strict'
    var IS_PURE = require('../internals/is-pure')
    var store = require('../internals/shared-store');

    (module.exports = function (key, value) {
      return store[key] || (store[key] = value !== undefined ? value : {})
    })('versions', []).push({
      version: '3.34.0',
      mode: IS_PURE ? 'pure' : 'global',
      copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
      license: 'https://github.com/zloirock/core-js/blob/v3.34.0/LICENSE',
      source: 'https://github.com/zloirock/core-js'
    })
  }, { '../internals/is-pure': 86, '../internals/shared-store': 113 }],
  115: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-symbol -- required for testing */
    var V8_VERSION = require('../internals/engine-v8-version')
    var fails = require('../internals/fails')
    var global = require('../internals/global')

    var $String = global.String

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
    module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
      var symbol = Symbol('symbol detection')
      // Chrome 38 Symbol has incorrect toString conversion
      // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
      // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
      // of course, fail.
      return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41
    })
  }, { '../internals/engine-v8-version': 58, '../internals/fails': 61, '../internals/global': 73 }],
  116: [function (require, module, exports) {
    'use strict'
    var toIntegerOrInfinity = require('../internals/to-integer-or-infinity')

    var max = Math.max
    var min = Math.min

    // Helper for a popular repeating case of the spec:
    // Let integer be ? ToInteger(index).
    // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
    module.exports = function (index, length) {
      var integer = toIntegerOrInfinity(index)
      return integer < 0 ? max(integer + length, 0) : min(integer, length)
    }
  }, { '../internals/to-integer-or-infinity': 118 }],
  117: [function (require, module, exports) {
    'use strict'
    // toObject with fallback for non-array-like ES3 strings
    var IndexedObject = require('../internals/indexed-object')
    var requireObjectCoercible = require('../internals/require-object-coercible')

    module.exports = function (it) {
      return IndexedObject(requireObjectCoercible(it))
    }
  }, { '../internals/indexed-object': 78, '../internals/require-object-coercible': 111 }],
  118: [function (require, module, exports) {
    'use strict'
    var trunc = require('../internals/math-trunc')

    // `ToIntegerOrInfinity` abstract operation
    // https://tc39.es/ecma262/#sec-tointegerorinfinity
    module.exports = function (argument) {
      var number = +argument
      // eslint-disable-next-line no-self-compare -- NaN check
      return number !== number || number === 0 ? 0 : trunc(number)
    }
  }, { '../internals/math-trunc': 96 }],
  119: [function (require, module, exports) {
    'use strict'
    var toIntegerOrInfinity = require('../internals/to-integer-or-infinity')

    var min = Math.min

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    module.exports = function (argument) {
      return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0 // 2 ** 53 - 1 == 9007199254740991
    }
  }, { '../internals/to-integer-or-infinity': 118 }],
  120: [function (require, module, exports) {
    'use strict'
    var requireObjectCoercible = require('../internals/require-object-coercible')

    var $Object = Object

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    module.exports = function (argument) {
      return $Object(requireObjectCoercible(argument))
    }
  }, { '../internals/require-object-coercible': 111 }],
  121: [function (require, module, exports) {
    'use strict'
    var call = require('../internals/function-call')
    var isObject = require('../internals/is-object')
    var isSymbol = require('../internals/is-symbol')
    var getMethod = require('../internals/get-method')
    var ordinaryToPrimitive = require('../internals/ordinary-to-primitive')
    var wellKnownSymbol = require('../internals/well-known-symbol')

    var $TypeError = TypeError
    var TO_PRIMITIVE = wellKnownSymbol('toPrimitive')

    // `ToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-toprimitive
    module.exports = function (input, pref) {
      if (!isObject(input) || isSymbol(input)) return input
      var exoticToPrim = getMethod(input, TO_PRIMITIVE)
      var result
      if (exoticToPrim) {
        if (pref === undefined) pref = 'default'
        result = call(exoticToPrim, input, pref)
        if (!isObject(result) || isSymbol(result)) return result
        throw new $TypeError("Can't convert object to primitive value")
      }
      if (pref === undefined) pref = 'number'
      return ordinaryToPrimitive(input, pref)
    }
  }, { '../internals/function-call': 64, '../internals/get-method': 72, '../internals/is-object': 85, '../internals/is-symbol': 87, '../internals/ordinary-to-primitive': 108, '../internals/well-known-symbol': 129 }],
  122: [function (require, module, exports) {
    'use strict'
    var toPrimitive = require('../internals/to-primitive')
    var isSymbol = require('../internals/is-symbol')

    // `ToPropertyKey` abstract operation
    // https://tc39.es/ecma262/#sec-topropertykey
    module.exports = function (argument) {
      var key = toPrimitive(argument, 'string')
      return isSymbol(key) ? key : key + ''
    }
  }, { '../internals/is-symbol': 87, '../internals/to-primitive': 121 }],
  123: [function (require, module, exports) {
    'use strict'
    var wellKnownSymbol = require('../internals/well-known-symbol')

    var TO_STRING_TAG = wellKnownSymbol('toStringTag')
    var test = {}

    test[TO_STRING_TAG] = 'z'

    module.exports = String(test) === '[object z]'
  }, { '../internals/well-known-symbol': 129 }],
  124: [function (require, module, exports) {
    'use strict'
    var $String = String

    module.exports = function (argument) {
      try {
        return $String(argument)
      } catch (error) {
        return 'Object'
      }
    }
  }, {}],
  125: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')

    var id = 0
    var postfix = Math.random()
    var toString = uncurryThis(1.0.toString)

    module.exports = function (key) {
      return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36)
    }
  }, { '../internals/function-uncurry-this': 67 }],
  126: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-symbol -- required for testing */
    var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection')

    module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator === 'symbol'
  }, { '../internals/symbol-constructor-detection': 115 }],
  127: [function (require, module, exports) {
    'use strict'
    var DESCRIPTORS = require('../internals/descriptors')
    var fails = require('../internals/fails')

    // V8 ~ Chrome 36-
    // https://bugs.chromium.org/p/v8/issues/detail?id=3334
    module.exports = DESCRIPTORS && fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty(function () { /* empty */ }, 'prototype', {
        value: 42,
        writable: false
      }).prototype !== 42
    })
  }, { '../internals/descriptors': 53, '../internals/fails': 61 }],
  128: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var isCallable = require('../internals/is-callable')

    var WeakMap = global.WeakMap

    module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap))
  }, { '../internals/global': 73, '../internals/is-callable': 82 }],
  129: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var shared = require('../internals/shared')
    var hasOwn = require('../internals/has-own-property')
    var uid = require('../internals/uid')
    var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection')
    var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid')

    var Symbol = global.Symbol
    var WellKnownSymbolsStore = shared('wks')
    var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol.for || Symbol : Symbol && Symbol.withoutSetter || uid

    module.exports = function (name) {
      if (!hasOwn(WellKnownSymbolsStore, name)) {
        WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
          ? Symbol[name]
          : createWellKnownSymbol('Symbol.' + name)
      } return WellKnownSymbolsStore[name]
    }
  }, { '../internals/global': 73, '../internals/has-own-property': 74, '../internals/shared': 114, '../internals/symbol-constructor-detection': 115, '../internals/uid': 125, '../internals/use-symbol-as-uid': 126 }],
  130: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var $find = require('../internals/async-iterator-iteration').find

    // `AsyncIterator.prototype.find` method
    // https://github.com/tc39/proposal-async-iterator-helpers
    $({ target: 'AsyncIterator', proto: true, real: true }, {
      find: function find (predicate) {
        return $find(this, predicate)
      }
    })
  }, { '../internals/async-iterator-iteration': 37, '../internals/export': 60 }],
  131: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var $forEach = require('../internals/async-iterator-iteration').forEach

    // `AsyncIterator.prototype.forEach` method
    // https://github.com/tc39/proposal-async-iterator-helpers
    $({ target: 'AsyncIterator', proto: true, real: true }, {
      forEach: function forEach (fn) {
        return $forEach(this, fn)
      }
    })
  }, { '../internals/async-iterator-iteration': 37, '../internals/export': 60 }],
  132: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var map = require('../internals/async-iterator-map')
    var IS_PURE = require('../internals/is-pure')

    // `AsyncIterator.prototype.map` method
    // https://github.com/tc39/proposal-async-iterator-helpers
    $({ target: 'AsyncIterator', proto: true, real: true, forced: IS_PURE }, {
      map: map
    })
  }, { '../internals/async-iterator-map': 38, '../internals/export': 60, '../internals/is-pure': 86 }],
  133: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var call = require('../internals/function-call')
    var aCallable = require('../internals/a-callable')
    var anObject = require('../internals/an-object')
    var isObject = require('../internals/is-object')
    var getBuiltIn = require('../internals/get-built-in')
    var getIteratorDirect = require('../internals/get-iterator-direct')
    var closeAsyncIteration = require('../internals/async-iterator-close')

    var Promise = getBuiltIn('Promise')
    var $TypeError = TypeError

    // `AsyncIterator.prototype.reduce` method
    // https://github.com/tc39/proposal-async-iterator-helpers
    $({ target: 'AsyncIterator', proto: true, real: true }, {
      reduce: function reduce (reducer /* , initialValue */) {
        anObject(this)
        aCallable(reducer)
        var record = getIteratorDirect(this)
        var iterator = record.iterator
        var next = record.next
        var noInitial = arguments.length < 2
        var accumulator = noInitial ? undefined : arguments[1]
        var counter = 0

        return new Promise(function (resolve, reject) {
          var ifAbruptCloseAsyncIterator = function (error) {
            closeAsyncIteration(iterator, reject, error, reject)
          }

          var loop = function () {
            try {
              Promise.resolve(anObject(call(next, iterator))).then(function (step) {
                try {
                  if (anObject(step).done) {
                    noInitial ? reject(new $TypeError('Reduce of empty iterator with no initial value')) : resolve(accumulator)
                  } else {
                    var value = step.value
                    if (noInitial) {
                      noInitial = false
                      accumulator = value
                      loop()
                    } else {
                      try {
                        var result = reducer(accumulator, value, counter)

                        var handler = function ($result) {
                          accumulator = $result
                          loop()
                        }

                        if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator)
                        else handler(result)
                      } catch (error3) { ifAbruptCloseAsyncIterator(error3) }
                    }
                  }
                  counter++
                } catch (error2) { reject(error2) }
              }, reject)
            } catch (error) { reject(error) }
          }

          loop()
        })
      }
    })
  }, { '../internals/a-callable': 31, '../internals/an-object': 33, '../internals/async-iterator-close': 35, '../internals/export': 60, '../internals/function-call': 64, '../internals/get-built-in': 68, '../internals/get-iterator-direct': 69, '../internals/is-object': 85 }],
  134: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var global = require('../internals/global')
    var anInstance = require('../internals/an-instance')
    var anObject = require('../internals/an-object')
    var isCallable = require('../internals/is-callable')
    var getPrototypeOf = require('../internals/object-get-prototype-of')
    var defineBuiltInAccessor = require('../internals/define-built-in-accessor')
    var createProperty = require('../internals/create-property')
    var fails = require('../internals/fails')
    var hasOwn = require('../internals/has-own-property')
    var wellKnownSymbol = require('../internals/well-known-symbol')
    var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype
    var DESCRIPTORS = require('../internals/descriptors')
    var IS_PURE = require('../internals/is-pure')

    var CONSTRUCTOR = 'constructor'
    var ITERATOR = 'Iterator'
    var TO_STRING_TAG = wellKnownSymbol('toStringTag')

    var $TypeError = TypeError
    var NativeIterator = global[ITERATOR]

    // FF56- have non-standard global helper `Iterator`
    var FORCED = IS_PURE ||
  !isCallable(NativeIterator) ||
  NativeIterator.prototype !== IteratorPrototype ||
  // FF44- non-standard `Iterator` passes previous tests
  !fails(function () { NativeIterator({}) })

    var IteratorConstructor = function Iterator () {
      anInstance(this, IteratorPrototype)
      if (getPrototypeOf(this) === IteratorPrototype) throw new $TypeError('Abstract class Iterator not directly constructable')
    }

    var defineIteratorPrototypeAccessor = function (key, value) {
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
    // https://github.com/tc39/proposal-iterator-helpers
    $({ global: true, constructor: true, forced: FORCED }, {
      Iterator: IteratorConstructor
    })
  }, { '../internals/an-instance': 32, '../internals/an-object': 33, '../internals/create-property': 48, '../internals/define-built-in-accessor': 49, '../internals/descriptors': 53, '../internals/export': 60, '../internals/fails': 61, '../internals/global': 73, '../internals/has-own-property': 74, '../internals/is-callable': 82, '../internals/is-pure': 86, '../internals/iterators-core': 92, '../internals/object-get-prototype-of': 103, '../internals/well-known-symbol': 129 }],
  135: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var iterate = require('../internals/iterate')
    var aCallable = require('../internals/a-callable')
    var anObject = require('../internals/an-object')
    var getIteratorDirect = require('../internals/get-iterator-direct')

    // `Iterator.prototype.find` method
    // https://github.com/tc39/proposal-iterator-helpers
    $({ target: 'Iterator', proto: true, real: true }, {
      find: function find (predicate) {
        anObject(this)
        aCallable(predicate)
        var record = getIteratorDirect(this)
        var counter = 0
        return iterate(record, function (value, stop) {
          if (predicate(value, counter++)) return stop(value)
        }, { IS_RECORD: true, INTERRUPTED: true }).result
      }
    })
  }, { '../internals/a-callable': 31, '../internals/an-object': 33, '../internals/export': 60, '../internals/get-iterator-direct': 69, '../internals/iterate': 88 }],
  136: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var iterate = require('../internals/iterate')
    var aCallable = require('../internals/a-callable')
    var anObject = require('../internals/an-object')
    var getIteratorDirect = require('../internals/get-iterator-direct')

    // `Iterator.prototype.forEach` method
    // https://github.com/tc39/proposal-iterator-helpers
    $({ target: 'Iterator', proto: true, real: true }, {
      forEach: function forEach (fn) {
        anObject(this)
        aCallable(fn)
        var record = getIteratorDirect(this)
        var counter = 0
        iterate(record, function (value) {
          fn(value, counter++)
        }, { IS_RECORD: true })
      }
    })
  }, { '../internals/a-callable': 31, '../internals/an-object': 33, '../internals/export': 60, '../internals/get-iterator-direct': 69, '../internals/iterate': 88 }],
  137: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var map = require('../internals/iterator-map')
    var IS_PURE = require('../internals/is-pure')

    // `Iterator.prototype.map` method
    // https://github.com/tc39/proposal-iterator-helpers
    $({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
      map: map
    })
  }, { '../internals/export': 60, '../internals/is-pure': 86, '../internals/iterator-map': 91 }],
  138: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var iterate = require('../internals/iterate')
    var aCallable = require('../internals/a-callable')
    var anObject = require('../internals/an-object')
    var getIteratorDirect = require('../internals/get-iterator-direct')

    var $TypeError = TypeError

    // `Iterator.prototype.reduce` method
    // https://github.com/tc39/proposal-iterator-helpers
    $({ target: 'Iterator', proto: true, real: true }, {
      reduce: function reduce (reducer /* , initialValue */) {
        anObject(this)
        aCallable(reducer)
        var record = getIteratorDirect(this)
        var noInitial = arguments.length < 2
        var accumulator = noInitial ? undefined : arguments[1]
        var counter = 0
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
  }, { '../internals/a-callable': 31, '../internals/an-object': 33, '../internals/export': 60, '../internals/get-iterator-direct': 69, '../internals/iterate': 88 }]
}, {}, [14])

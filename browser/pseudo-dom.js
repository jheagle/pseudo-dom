(function () { function r (e, n, t) { function o (i, f) { if (!n[i]) { if (!e[i]) { var c = typeof require === 'function' && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = 'MODULE_NOT_FOUND', a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = typeof require === 'function' && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _PseudoEvent = _interopRequireDefault(require('././classes/PseudoEvent'))
    var _PseudoEventTarget = _interopRequireDefault(require('././classes/PseudoEventTarget'))
    var _PseudoNode = _interopRequireDefault(require('././classes/PseudoNode'))
    var _PseudoElement = _interopRequireDefault(require('././classes/PseudoElement'))
    var _PseudoHTMLElement = _interopRequireDefault(require('././classes/PseudoHTMLElement'))
    var _PseudoHTMLDocument = _interopRequireDefault(require('././classes/PseudoHTMLDocument'))
    function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
    /**
 * @file All of the Pseudo Dom classes for replicating DOM structure.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    var _default = exports.default = {
      PseudoEvent: _PseudoEvent.default,
      PseudoEventTarget: _PseudoEventTarget.default,
      PseudoNode: _PseudoNode.default,
      PseudoElement: _PseudoElement.default,
      PseudoHTMLElement: _PseudoHTMLElement.default,
      PseudoHTMLDocument: _PseudoHTMLDocument.default
    }
  }, { '././classes/PseudoElement': 2, '././classes/PseudoEvent': 3, '././classes/PseudoEventTarget': 5, '././classes/PseudoHTMLDocument': 6, '././classes/PseudoHTMLElement': 7, '././classes/PseudoNode': 8 }],
  2: [function (require, module, exports) {
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
   * @param {string} [tagName=''] - The
   * @param {array} [attributes=[]]
   * @param {PseudoNode|Object} [parent={}]
   * @param {Array} [children=[]]
   * @constructor
   */
      constructor () {
        const {
          tagName = '',
          attributes = [],
          parent = {},
          children = []
        } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        super({
          parent,
          children
        })
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
     * Map all incoming attributes to the attributes array and attach each as a property of this element
     */
        this.attributes.map(_ref => {
          const {
            name,
            value
          } = _ref
          this[name] = value
          return {
            name,
            value
          }
        })

        // this.classList = new DOMSettableTokenList(this.className)
        this.classList = this.className
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

      // noinspection JSUnusedGlobalSymbols
      /**
   * Remove an assigned attribute from the Element
   * @param {string} attributeName - The string name of the attribute to be removed
   * @returns {null}
   */
      removeAttribute (attributeName) {
        if (this.hasAttribute(attributeName)) {
          delete this[attributeName]
          delete this.getAttribute(attributeName)
        }
        return null
      }
    }
    var _default = exports.default = PseudoElement
  }, { './PseudoEvent': 3, './PseudoNode': 8, 'core-js/modules/esnext.async-iterator.find.js': 107, 'core-js/modules/esnext.async-iterator.map.js': 109, 'core-js/modules/esnext.iterator.constructor.js': 111, 'core-js/modules/esnext.iterator.find.js': 112, 'core-js/modules/esnext.iterator.map.js': 114 }],
  3: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.async-iterator.map.js')
    require('core-js/modules/esnext.iterator.map.js')
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
 * @property {boolean} composed - A Boolean value indicating whether or not the event can bubble across the boundary
 * between the shadow Dom and the regular Dom.
 * @property {function|PseudoEventTarget} currentTarget - A reference to the currently registered target for the event. This
 * is the object to which the event is currently slated to be sent; it's possible this has been changed along the way
 * through re-targeting.
 * @property {boolean} defaultPrevented - Indicates whether or not event.preventDefault() has been called on the event.
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
 * @property {boolean} isTrusted - Indicates whether or not the event was initiated by the browser (after a user
 * click for instance) or by a script (using an event creation method, like event.initEvent)
 */
    class PseudoEvent {
      /**
   *
   * @param typeArg
   * @param bubbles
   * @param cancelable
   * @param composed
   * @returns {PseudoEvent}
   * @constructor
   */
      constructor () {
        var _this = this
        const typeArg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
        const {
          bubbles = true,
          cancelable = true,
          composed = true
        } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
        let properties = {
          bubbles,
          cancelable,
          composed,
          currentTarget: () => undefined,
          defaultPrevented: false,
          immediatePropagationStopped: false,
          propagationStopped: false,
          eventPhase: '',
          target: () => undefined,
          timeStamp: Math.floor(Date.now() / 1000),
          type: typeArg,
          isTrusted: true
        }
        this.setReadOnlyProperties = function () {
          const updateProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
          properties = Object.assign({}, properties, updateProps)
          _this.getReadOnlyProperties = (properties => function () {
            const name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
            return properties[name]
          })(properties)
          return properties
        }
        this.setReadOnlyProperties()
        Object.keys(properties).map(propKey => Object.defineProperty(this, propKey, {
          enumerable: true,
          get: () => this.getReadOnlyProperties(propKey)
        }))
      }

      /**
   * A selector function for retrieving existing parent PseudoNode from the given child item.
   * This function will check all the parents starting from node, and scan the attributes
   * property for matches. The return array contains all matching parent ancestors.
   * WARNING: This is a recursive function.
   * @param {string} attr
   * @param {number|string} value
   * @param {PseudoNode} node
   * @returns {Array.<PseudoNode>}
   */
      static getParentNodesFromAttribute (attr, value, node) {
        return Object.keys(node.parentNode).length ? (node.parentNode[attr] || false) === value ? PseudoEvent.getParentNodesFromAttribute(attr, value, node.parentNode).concat([node.parentNode]) : PseudoEvent.getParentNodesFromAttribute(attr, value, node.parentNode) : []
      }

      /**
   * A helper selector function for retrieving all parent PseudoNode for the given child node.
   * @param {PseudoNode} node
   * @returns {Array.<PseudoNode>}
   */
      static getParentNodes (node) {
        return PseudoEvent.getParentNodesFromAttribute('', false, node)
      }

      /**
   * Return an array of targets that will have the event executed open them. The order is based on the eventPhase
   * @method
   * @returns {Array.<PseudoEventTarget>}
   */
      composedPath () {
        switch (this.eventPhase) {
          case PseudoEvent.CAPTURING_PHASE:
            return PseudoEvent.getParentNodes(this.target)
          case PseudoEvent.BUBBLING_PHASE:
            return PseudoEvent.getParentNodes(this.target).slice().reverse()
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
    }

    // Set up the class constants
    ['NONE', 'CAPTURING_PHASE', 'AT_TARGET', 'BUBBLING_PHASE'].reduce((phases, phase, key) => {
      Object.defineProperty(PseudoEvent, phase, {
        value: key,
        writable: false,
        static: {
          get: () => key
        }
      })
      return Object.assign({}, phases, {
        [`${phase}`]: key
      })
    }, {})
    var _default = exports.default = PseudoEvent
  }, { 'core-js/modules/esnext.async-iterator.map.js': 109, 'core-js/modules/esnext.iterator.map.js': 114 }],
  4: [function (require, module, exports) {
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
 * @property {string} eventTypes
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
    const PseudoEventListener = {
      eventType: '',
      eventOptions: {
        capture: false,
        once: false,
        passive: false
      },
      isDefault: false,
      /**
   * @method
   * @name PseudoEventListener#handleEvent
   * @param {PseudoEvent} event
   * @returns {undefined}
   */
      handleEvent: event => undefined,
      /**
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doCapturePhase (event) {
        return event.eventPhase === _PseudoEvent.default.CAPTURING_PHASE && this.eventOptions.capture
      },
      /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doTargetPhase (event) {
        return event.eventPhase === _PseudoEvent.default.AT_TARGET
      },
      /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      doBubblePhase (event) {
        return event.eventPhase === _PseudoEvent.default.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
      },
      /**
   * @method
   * @name PseudoEventListener#skipPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      skipPhase (event) {
        return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
      },
      /**
   * @method
   * @name PseudoEventListener#skipDefault
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      skipDefault (event) {
        return this.isDefault && event.defaultPrevented
      },
      /**
   * @method
   * @name PseudoEventListener#stopPropagation
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      stopPropagation (event) {
        return !this.doTargetPhase(event) && event.propagationStopped
      },
      /**
   * @method
   * @name PseudoEventListener#nonPassiveHalt
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      nonPassiveHalt (event) {
        return !this.eventOptions.passive && (this.skipDefault(event) || event.immediatePropagationStopped || this.stopPropagation(event))
      },
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
  }, { './PseudoEvent': 3 }],
  5: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    require('core-js/modules/esnext.async-iterator.reduce.js')
    require('core-js/modules/esnext.iterator.constructor.js')
    require('core-js/modules/esnext.iterator.reduce.js')
    require('core-js/modules/esnext.async-iterator.for-each.js')
    require('core-js/modules/esnext.iterator.for-each.js')
    var _PseudoEvent = _interopRequireDefault(require('./PseudoEvent'))
    var _PseudoEventListener = _interopRequireDefault(require('./PseudoEventListener'))
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
        this.listeners = []
        this.defaultEvent = []
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
        this.listeners[event.type] = stack.reduce(
        /**
     *
     * @param {Array<PseudoEventListener>} listeners
     * @param {PseudoEventListener} listener
     * @returns {Array<PseudoEventListener>}
     */
          (listeners, listener) => {
            if (event.immediatePropagationStopped || listener.rejectEvent(event)) {
              return listeners.concat(listener)
            }
            eventReturn = listener.handleEvent(event)
            if (listener.eventOptions.once) {
              event.currentTarget.removeEventListener(event.eventType, event.handleEvent)
              return listeners
            }
            return listeners.concat(listener)
          }, [])
        return eventReturn
      }

      /**
   *
   * @param {string} type
   * @param {Function} callback
   */
      setDefaultEvent (type, callback) {
        if (!(type in this.listeners)) {
          this[type] = () => this.startEvents(type)
          this.listeners[type] = []
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
        event.setReadOnlyProperties({
          target: this
        })
        console.log('startEvents', event.type, event.target);
        [_PseudoEvent.default.CAPTURING_PHASE, _PseudoEvent.default.AT_TARGET, _PseudoEvent.default.BUBBLING_PHASE].forEach(phase => {
          let continueEvents = null
          if (phase === _PseudoEvent.default.AT_TARGET || !event.propagationStopped) {
            event.setReadOnlyProperties({
              eventPhase: phase
            })
            event.composedPath().forEach(target => {
              event.setReadOnlyProperties({
                currentTarget: target
              })
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
          options = Object.keys(useCapture).reduce((opts, opt) => {
            opts[opt] = useCapture[opt]
            return opts
          }, options)
        } else {
          options.capture = useCapture
        }
        if (!(type in this.listeners)) {
          this[type] = () => this.startEvents(type)
          this.listeners[type] = []
        }
        this.listeners[type] = this.listeners[type].concat([Object.assign(Object.create(_PseudoEventListener.default), _PseudoEventListener.default, {
          eventType: type,
          eventOptions: Object.assign({}, _PseudoEventListener.default.eventOptions, options),
          handleEvent: (callback.handleEvent || callback).bind(this)
        })])
        const groupedDefault = this.listeners[type].reduce((listeners, listener) => listener.isDefault ? Object.assign({}, listeners, {
          default: listeners.default.concat([listener])
        }) : Object.assign({}, listeners, {
          explicit: listeners.explicit.concat([listener])
        }), {
          explicit: [],
          default: []
        })
        this.listeners[type] = [].concat(groupedDefault.explicit, groupedDefault.default)
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
        for (let i = 0, l = stack.length; i < l; i++) {
          if (stack[i].handleEvent === callback && !stack[i].isDefault) {
            stack.splice(i, 1)
            return
          }
        }
      }

      /**
   *
   * @param {Event|PseudoEvent} event
   * @param {EventTarget|PseudoEventTarget} target
   * @returns {boolean}
   */
      dispatchEvent (event) {
        const target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
        event.setReadOnlyProperties({
          target
        })
        if (!(event.type in this.listeners)) {
          return true
        }
        this.runEvents(event)
        return !event.defaultPrevented
      }
    }
    var _default = exports.default = PseudoEventTarget
  }, { './PseudoEvent': 3, './PseudoEventListener': 4, 'core-js/modules/esnext.async-iterator.for-each.js': 108, 'core-js/modules/esnext.async-iterator.reduce.js': 110, 'core-js/modules/esnext.iterator.constructor.js': 111, 'core-js/modules/esnext.iterator.for-each.js': 113, 'core-js/modules/esnext.iterator.reduce.js': 115 }],
  6: [function (require, module, exports) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    exports.default = void 0
    var _PseudoHTMLElement = _interopRequireDefault(require('./PseudoHTMLElement'))
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
   * @returns {PseudoHTMLDocument}
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
        html.children = [this.head, this.body]

        /**
     * Create document child element
     * @type {PseudoHTMLElement[]}
     */
        this.children = [html]
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
  }, { './PseudoHTMLElement': 7 }],
  7: [function (require, module, exports) {
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
   * Simulate the HTMLELement object when the Dom is not available
   * @param {string} [tagName=''] - The
   * @param {PseudoNode|Object} [parent={}]
   * @param {Array} [children=[]]
   * @returns {PseudoHTMLElement}
   * @constructor
   */
      constructor () {
        const {
          tagName = '',
          parent = {},
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
  }, { './PseudoElement': 2 }],
  8: [function (require, module, exports) {
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
        this.children = []
        this.parent = undefined
      }

      get baseURI () {
        return window.location || '/'
      }

      get childNodes () {
        return this.children
      }

      get firstChild () {
        return this.children[0]
      }

      get isConnected () {
        return !!this.parent
      }

      get lastChild () {
        return this.children[this.children.length - 1]
      }

      get nextSibling () {
        return this.isConnected ? this.parent.children[this.parent.children.indexOf(this) + 1] : null
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
        return undefined
      }

      get parentNode () {
        return this.parent
      }

      get parentElement () {
        return this.parent.nodeType === 1 ? this.parent : null
      }

      get previousSibling () {
        return this.isConnected ? this.parent.children[this.parent.children.indexOf(this) - 1] : null
      }

      /**
   *
   * @param {PseudoNode} childNode
   * @returns {PseudoNode}
   */
      appendChild (childNode) {
        this.children.push(childNode)
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
        return this.children.splice(this.children.indexOf(childElement), 1)[0]
      }

      replaceChild () {}
    }
    var _default = exports.default = PseudoNode
  }, { './PseudoEventTarget': 5 }],
  9: [function (require, module, exports) {
    (function (global) {
      (function () {
        'use strict'

        Object.defineProperty(exports, '__esModule', {
          value: true
        })
        exports.default = void 0
        var _classes = require('././classes.js')
        /**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

        /**
 * Store a reference to this scope which will be Window if rendered via browser
 */
        const root = void 0 || window || global || {}

        /**
 * Store reference to any pre-existing module of the same name
 * @type {module|*}
 */
        const previousPseudoDom = root.pseudoDom || {}

        /**
 * All methods exported from this module are encapsulated within pseudoDom.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} pseudoDom
 * @module pseudoDom/objects
 */
        const pseudoDom = {}
        root.pseudoDom = pseudoDom

        /**
 * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside of the browser
 * context.
 * @function generate
 * @param {Object} root
 * @param {Object} context
 * @returns {Window|PseudoEventTarget}
 */
        pseudoDom.generate = function (root) {
          const context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
          /**
   *
   * @type {Window|PseudoEventTarget}
   */
          const newWindow = typeof root.document === 'undefined' ? root : new pseudoDom.PseudoEventTarget()

          /**
   * @type {Node|PseudoNode}
   */
          const Node = root.Node || new pseudoDom.PseudoNode()
          if (typeof newWindow.Node === 'undefined') {
            newWindow.Node = Node
          }

          /**
   *
   * @type {Element|PseudoElement}
   */
          const Element = root.Element || new pseudoDom.PseudoElement()
          if (typeof newWindow.Element === 'undefined') {
            newWindow.Element = Element
          }

          /**
   * Create an instance of HTMLElement if not available
   * @type {HTMLElement|PseudoHTMLElement}
   */
          const HTMLElement = root.HTMLElement || new pseudoDom.PseudoHTMLElement()
          if (typeof newWindow.HTMLElement === 'undefined') {
            newWindow.HTMLElement = HTMLElement
          }

          /**
   * Define document when not available
   * @type {Document|PseudoHTMLDocument}
   */
          const document = root.document || new pseudoDom.PseudoHTMLDocument()
          if (typeof newWindow.document === 'undefined') {
            newWindow.document = document
          }
          return context ? Object.assign(context, pseudoDom, newWindow) : Object.assign(root, newWindow)
        }

        /**
 * Return a reference to this library while preserving the original same-named library
 * @function noConflict
 * @returns {pseudoDom}
 */
        pseudoDom.noConflict = () => {
          root.pseudoDom = previousPseudoDom
          return pseudoDom
        }
        var _default = exports.default = Object.assign(pseudoDom, _classes.PseudoEvent, _classes.PseudoEventTarget, _classes.PseudoNode, _classes.PseudoElement, _classes.PseudoHTMLElement, _classes.PseudoHTMLDocument)
      }).call(this)
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, { '././classes.js': 1 }],
  10: [function (require, module, exports) {
    'use strict'
    var isCallable = require('../internals/is-callable')
    var tryToString = require('../internals/try-to-string')

    var $TypeError = TypeError

    // `Assert: IsCallable(argument) is true`
    module.exports = function (argument) {
      if (isCallable(argument)) return argument
      throw new $TypeError(tryToString(argument) + ' is not a function')
    }
  }, { '../internals/is-callable': 59, '../internals/try-to-string': 101 }],
  11: [function (require, module, exports) {
    'use strict'
    var isPrototypeOf = require('../internals/object-is-prototype-of')

    var $TypeError = TypeError

    module.exports = function (it, Prototype) {
      if (isPrototypeOf(Prototype, it)) return it
      throw new $TypeError('Incorrect invocation')
    }
  }, { '../internals/object-is-prototype-of': 81 }],
  12: [function (require, module, exports) {
    'use strict'
    var isObject = require('../internals/is-object')

    var $String = String
    var $TypeError = TypeError

    // `Assert: Type(argument) is Object`
    module.exports = function (argument) {
      if (isObject(argument)) return argument
      throw new $TypeError($String(argument) + ' is not an object')
    }
  }, { '../internals/is-object': 62 }],
  13: [function (require, module, exports) {
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
  }, { '../internals/length-of-array-like': 71, '../internals/to-absolute-index': 93, '../internals/to-indexed-object': 94 }],
  14: [function (require, module, exports) {
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
  }, { '../internals/function-call': 41, '../internals/get-built-in': 45, '../internals/get-method': 49 }],
  15: [function (require, module, exports) {
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
  }, { '../internals/an-object': 12, '../internals/async-iterator-prototype': 18, '../internals/create-iter-result-object': 24, '../internals/create-non-enumerable-property': 25, '../internals/define-built-ins': 28, '../internals/function-call': 41, '../internals/get-built-in': 45, '../internals/get-method': 49, '../internals/internal-state': 57, '../internals/iterator-close': 66, '../internals/object-create': 74, '../internals/perform': 87, '../internals/well-known-symbol': 106 }],
  16: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 10, '../internals/an-object': 12, '../internals/async-iterator-close': 14, '../internals/does-not-exceed-safe-integer': 33, '../internals/function-call': 41, '../internals/get-built-in': 45, '../internals/get-iterator-direct': 46, '../internals/is-object': 62 }],
  17: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 10, '../internals/an-object': 12, '../internals/async-iterator-close': 14, '../internals/async-iterator-create-proxy': 15, '../internals/create-iter-result-object': 24, '../internals/function-call': 41, '../internals/get-iterator-direct': 46, '../internals/is-object': 62 }],
  18: [function (require, module, exports) {
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
  }, { '../internals/define-built-in': 27, '../internals/global': 50, '../internals/is-callable': 59, '../internals/is-pure': 63, '../internals/object-create': 74, '../internals/object-get-prototype-of': 80, '../internals/shared-store': 90, '../internals/well-known-symbol': 106 }],
  19: [function (require, module, exports) {
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
  }, { '../internals/an-object': 12, '../internals/iterator-close': 66 }],
  20: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')

    var toString = uncurryThis({}.toString)
    var stringSlice = uncurryThis(''.slice)

    module.exports = function (it) {
      return stringSlice(toString(it), 8, -1)
    }
  }, { '../internals/function-uncurry-this': 44 }],
  21: [function (require, module, exports) {
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
  }, { '../internals/classof-raw': 20, '../internals/is-callable': 59, '../internals/to-string-tag-support': 100, '../internals/well-known-symbol': 106 }],
  22: [function (require, module, exports) {
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
  }, { '../internals/has-own-property': 51, '../internals/object-define-property': 76, '../internals/object-get-own-property-descriptor': 77, '../internals/own-keys': 86 }],
  23: [function (require, module, exports) {
    'use strict'
    var fails = require('../internals/fails')

    module.exports = !fails(function () {
      function F () { /* empty */ }
      F.prototype.constructor = null
      // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
      return Object.getPrototypeOf(new F()) !== F.prototype
    })
  }, { '../internals/fails': 38 }],
  24: [function (require, module, exports) {
    'use strict'
    // `CreateIterResultObject` abstract operation
    // https://tc39.es/ecma262/#sec-createiterresultobject
    module.exports = function (value, done) {
      return { value: value, done: done }
    }
  }, {}],
  25: [function (require, module, exports) {
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
  }, { '../internals/create-property-descriptor': 26, '../internals/descriptors': 30, '../internals/object-define-property': 76 }],
  26: [function (require, module, exports) {
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
  27: [function (require, module, exports) {
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
  }, { '../internals/define-global-property': 29, '../internals/is-callable': 59, '../internals/make-built-in': 72, '../internals/object-define-property': 76 }],
  28: [function (require, module, exports) {
    'use strict'
    var defineBuiltIn = require('../internals/define-built-in')

    module.exports = function (target, src, options) {
      for (var key in src) defineBuiltIn(target, key, src[key], options)
      return target
    }
  }, { '../internals/define-built-in': 27 }],
  29: [function (require, module, exports) {
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
  }, { '../internals/global': 50 }],
  30: [function (require, module, exports) {
    'use strict'
    var fails = require('../internals/fails')

    // Detect IE8's incomplete defineProperty implementation
    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty({}, 1, { get: function () { return 7 } })[1] !== 7
    })
  }, { '../internals/fails': 38 }],
  31: [function (require, module, exports) {
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
  32: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var isObject = require('../internals/is-object')

    var document = global.document
    // typeof document.createElement is 'object' in old IE
    var EXISTS = isObject(document) && isObject(document.createElement)

    module.exports = function (it) {
      return EXISTS ? document.createElement(it) : {}
    }
  }, { '../internals/global': 50, '../internals/is-object': 62 }],
  33: [function (require, module, exports) {
    'use strict'
    var $TypeError = TypeError
    var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF // 2 ** 53 - 1 == 9007199254740991

    module.exports = function (it) {
      if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded')
      return it
    }
  }, {}],
  34: [function (require, module, exports) {
    'use strict'
    module.exports = typeof navigator !== 'undefined' && String(navigator.userAgent) || ''
  }, {}],
  35: [function (require, module, exports) {
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
  }, { '../internals/engine-user-agent': 34, '../internals/global': 50 }],
  36: [function (require, module, exports) {
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
  37: [function (require, module, exports) {
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
  }, { '../internals/copy-constructor-properties': 22, '../internals/create-non-enumerable-property': 25, '../internals/define-built-in': 27, '../internals/define-global-property': 29, '../internals/global': 50, '../internals/is-forced': 60, '../internals/object-get-own-property-descriptor': 77 }],
  38: [function (require, module, exports) {
    'use strict'
    module.exports = function (exec) {
      try {
        return !!exec()
      } catch (error) {
        return true
      }
    }
  }, {}],
  39: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 10, '../internals/function-bind-native': 40, '../internals/function-uncurry-this-clause': 43 }],
  40: [function (require, module, exports) {
    'use strict'
    var fails = require('../internals/fails')

    module.exports = !fails(function () {
      // eslint-disable-next-line es/no-function-prototype-bind -- safe
      var test = function () { /* empty */ }.bind()
      // eslint-disable-next-line no-prototype-builtins -- safe
      return typeof test !== 'function' || test.hasOwnProperty('prototype')
    })
  }, { '../internals/fails': 38 }],
  41: [function (require, module, exports) {
    'use strict'
    var NATIVE_BIND = require('../internals/function-bind-native')

    var call = Function.prototype.call

    module.exports = NATIVE_BIND ? call.bind(call) : function () {
      return call.apply(call, arguments)
    }
  }, { '../internals/function-bind-native': 40 }],
  42: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 30, '../internals/has-own-property': 51 }],
  43: [function (require, module, exports) {
    'use strict'
    var classofRaw = require('../internals/classof-raw')
    var uncurryThis = require('../internals/function-uncurry-this')

    module.exports = function (fn) {
      // Nashorn bug:
      //   https://github.com/zloirock/core-js/issues/1128
      //   https://github.com/zloirock/core-js/issues/1130
      if (classofRaw(fn) === 'Function') return uncurryThis(fn)
    }
  }, { '../internals/classof-raw': 20, '../internals/function-uncurry-this': 44 }],
  44: [function (require, module, exports) {
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
  }, { '../internals/function-bind-native': 40 }],
  45: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var isCallable = require('../internals/is-callable')

    var aFunction = function (argument) {
      return isCallable(argument) ? argument : undefined
    }

    module.exports = function (namespace, method) {
      return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method]
    }
  }, { '../internals/global': 50, '../internals/is-callable': 59 }],
  46: [function (require, module, exports) {
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
  47: [function (require, module, exports) {
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
  }, { '../internals/classof': 21, '../internals/get-method': 49, '../internals/is-null-or-undefined': 61, '../internals/iterators': 70, '../internals/well-known-symbol': 106 }],
  48: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 10, '../internals/an-object': 12, '../internals/function-call': 41, '../internals/get-iterator-method': 47, '../internals/try-to-string': 101 }],
  49: [function (require, module, exports) {
    'use strict'
    var aCallable = require('../internals/a-callable')
    var isNullOrUndefined = require('../internals/is-null-or-undefined')

    // `GetMethod` abstract operation
    // https://tc39.es/ecma262/#sec-getmethod
    module.exports = function (V, P) {
      var func = V[P]
      return isNullOrUndefined(func) ? undefined : aCallable(func)
    }
  }, { '../internals/a-callable': 10, '../internals/is-null-or-undefined': 61 }],
  50: [function (require, module, exports) {
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
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this })() || this || Function('return this')()
      }).call(this)
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
  }, {}],
  51: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 44, '../internals/to-object': 97 }],
  52: [function (require, module, exports) {
    'use strict'
    module.exports = {}
  }, {}],
  53: [function (require, module, exports) {
    'use strict'
    var getBuiltIn = require('../internals/get-built-in')

    module.exports = getBuiltIn('document', 'documentElement')
  }, { '../internals/get-built-in': 45 }],
  54: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 30, '../internals/document-create-element': 32, '../internals/fails': 38 }],
  55: [function (require, module, exports) {
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
  }, { '../internals/classof-raw': 20, '../internals/fails': 38, '../internals/function-uncurry-this': 44 }],
  56: [function (require, module, exports) {
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
  }, { '../internals/function-uncurry-this': 44, '../internals/is-callable': 59, '../internals/shared-store': 90 }],
  57: [function (require, module, exports) {
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
  }, { '../internals/create-non-enumerable-property': 25, '../internals/global': 50, '../internals/has-own-property': 51, '../internals/hidden-keys': 52, '../internals/is-object': 62, '../internals/shared-key': 89, '../internals/shared-store': 90, '../internals/weak-map-basic-detection': 105 }],
  58: [function (require, module, exports) {
    'use strict'
    var wellKnownSymbol = require('../internals/well-known-symbol')
    var Iterators = require('../internals/iterators')

    var ITERATOR = wellKnownSymbol('iterator')
    var ArrayPrototype = Array.prototype

    // check on default Array iterator
    module.exports = function (it) {
      return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it)
    }
  }, { '../internals/iterators': 70, '../internals/well-known-symbol': 106 }],
  59: [function (require, module, exports) {
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
  }, { '../internals/document-all': 31 }],
  60: [function (require, module, exports) {
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
  }, { '../internals/fails': 38, '../internals/is-callable': 59 }],
  61: [function (require, module, exports) {
    'use strict'
    // we can't use just `it == null` since of `document.all` special case
    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
    module.exports = function (it) {
      return it === null || it === undefined
    }
  }, {}],
  62: [function (require, module, exports) {
    'use strict'
    var isCallable = require('../internals/is-callable')
    var $documentAll = require('../internals/document-all')

    var documentAll = $documentAll.all

    module.exports = $documentAll.IS_HTMLDDA ? function (it) {
      return typeof it === 'object' ? it !== null : isCallable(it) || it === documentAll
    } : function (it) {
      return typeof it === 'object' ? it !== null : isCallable(it)
    }
  }, { '../internals/document-all': 31, '../internals/is-callable': 59 }],
  63: [function (require, module, exports) {
    'use strict'
    module.exports = false
  }, {}],
  64: [function (require, module, exports) {
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
  }, { '../internals/get-built-in': 45, '../internals/is-callable': 59, '../internals/object-is-prototype-of': 81, '../internals/use-symbol-as-uid': 103 }],
  65: [function (require, module, exports) {
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
  }, { '../internals/an-object': 12, '../internals/function-bind-context': 39, '../internals/function-call': 41, '../internals/get-iterator': 48, '../internals/get-iterator-method': 47, '../internals/is-array-iterator-method': 58, '../internals/iterator-close': 66, '../internals/length-of-array-like': 71, '../internals/object-is-prototype-of': 81, '../internals/try-to-string': 101 }],
  66: [function (require, module, exports) {
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
  }, { '../internals/an-object': 12, '../internals/function-call': 41, '../internals/get-method': 49 }],
  67: [function (require, module, exports) {
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
  }, { '../internals/create-iter-result-object': 24, '../internals/create-non-enumerable-property': 25, '../internals/define-built-ins': 28, '../internals/function-call': 41, '../internals/get-method': 49, '../internals/internal-state': 57, '../internals/iterator-close': 66, '../internals/iterators-core': 69, '../internals/object-create': 74, '../internals/well-known-symbol': 106 }],
  68: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 10, '../internals/an-object': 12, '../internals/call-with-safe-iteration-closing': 19, '../internals/function-call': 41, '../internals/get-iterator-direct': 46, '../internals/iterator-create-proxy': 67 }],
  69: [function (require, module, exports) {
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
  }, { '../internals/define-built-in': 27, '../internals/fails': 38, '../internals/is-callable': 59, '../internals/is-object': 62, '../internals/is-pure': 63, '../internals/object-create': 74, '../internals/object-get-prototype-of': 80, '../internals/well-known-symbol': 106 }],
  70: [function (require, module, exports) {
    arguments[4][52][0].apply(exports, arguments)
  }, { dup: 52 }],
  71: [function (require, module, exports) {
    'use strict'
    var toLength = require('../internals/to-length')

    // `LengthOfArrayLike` abstract operation
    // https://tc39.es/ecma262/#sec-lengthofarraylike
    module.exports = function (obj) {
      return toLength(obj.length)
    }
  }, { '../internals/to-length': 96 }],
  72: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 30, '../internals/fails': 38, '../internals/function-name': 42, '../internals/function-uncurry-this': 44, '../internals/has-own-property': 51, '../internals/inspect-source': 56, '../internals/internal-state': 57, '../internals/is-callable': 59 }],
  73: [function (require, module, exports) {
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
  74: [function (require, module, exports) {
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
  }, { '../internals/an-object': 12, '../internals/document-create-element': 32, '../internals/enum-bug-keys': 36, '../internals/hidden-keys': 52, '../internals/html': 53, '../internals/object-define-properties': 75, '../internals/shared-key': 89 }],
  75: [function (require, module, exports) {
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
  }, { '../internals/an-object': 12, '../internals/descriptors': 30, '../internals/object-define-property': 76, '../internals/object-keys': 83, '../internals/to-indexed-object': 94, '../internals/v8-prototype-define-bug': 104 }],
  76: [function (require, module, exports) {
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
  }, { '../internals/an-object': 12, '../internals/descriptors': 30, '../internals/ie8-dom-define': 54, '../internals/to-property-key': 99, '../internals/v8-prototype-define-bug': 104 }],
  77: [function (require, module, exports) {
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
  }, { '../internals/create-property-descriptor': 26, '../internals/descriptors': 30, '../internals/function-call': 41, '../internals/has-own-property': 51, '../internals/ie8-dom-define': 54, '../internals/object-property-is-enumerable': 84, '../internals/to-indexed-object': 94, '../internals/to-property-key': 99 }],
  78: [function (require, module, exports) {
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
  }, { '../internals/enum-bug-keys': 36, '../internals/object-keys-internal': 82 }],
  79: [function (require, module, exports) {
    'use strict'
    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    exports.f = Object.getOwnPropertySymbols
  }, {}],
  80: [function (require, module, exports) {
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
  }, { '../internals/correct-prototype-getter': 23, '../internals/has-own-property': 51, '../internals/is-callable': 59, '../internals/shared-key': 89, '../internals/to-object': 97 }],
  81: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')

    module.exports = uncurryThis({}.isPrototypeOf)
  }, { '../internals/function-uncurry-this': 44 }],
  82: [function (require, module, exports) {
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
  }, { '../internals/array-includes': 13, '../internals/function-uncurry-this': 44, '../internals/has-own-property': 51, '../internals/hidden-keys': 52, '../internals/to-indexed-object': 94 }],
  83: [function (require, module, exports) {
    'use strict'
    var internalObjectKeys = require('../internals/object-keys-internal')
    var enumBugKeys = require('../internals/enum-bug-keys')

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    module.exports = Object.keys || function keys (O) {
      return internalObjectKeys(O, enumBugKeys)
    }
  }, { '../internals/enum-bug-keys': 36, '../internals/object-keys-internal': 82 }],
  84: [function (require, module, exports) {
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
  85: [function (require, module, exports) {
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
  }, { '../internals/function-call': 41, '../internals/is-callable': 59, '../internals/is-object': 62 }],
  86: [function (require, module, exports) {
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
  }, { '../internals/an-object': 12, '../internals/function-uncurry-this': 44, '../internals/get-built-in': 45, '../internals/object-get-own-property-names': 78, '../internals/object-get-own-property-symbols': 79 }],
  87: [function (require, module, exports) {
    'use strict'
    module.exports = function (exec) {
      try {
        return { error: false, value: exec() }
      } catch (error) {
        return { error: true, value: error }
      }
    }
  }, {}],
  88: [function (require, module, exports) {
    'use strict'
    var isNullOrUndefined = require('../internals/is-null-or-undefined')

    var $TypeError = TypeError

    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    module.exports = function (it) {
      if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it)
      return it
    }
  }, { '../internals/is-null-or-undefined': 61 }],
  89: [function (require, module, exports) {
    'use strict'
    var shared = require('../internals/shared')
    var uid = require('../internals/uid')

    var keys = shared('keys')

    module.exports = function (key) {
      return keys[key] || (keys[key] = uid(key))
    }
  }, { '../internals/shared': 91, '../internals/uid': 102 }],
  90: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var defineGlobalProperty = require('../internals/define-global-property')

    var SHARED = '__core-js_shared__'
    var store = global[SHARED] || defineGlobalProperty(SHARED, {})

    module.exports = store
  }, { '../internals/define-global-property': 29, '../internals/global': 50 }],
  91: [function (require, module, exports) {
    'use strict'
    var IS_PURE = require('../internals/is-pure')
    var store = require('../internals/shared-store');

    (module.exports = function (key, value) {
      return store[key] || (store[key] = value !== undefined ? value : {})
    })('versions', []).push({
      version: '3.33.2',
      mode: IS_PURE ? 'pure' : 'global',
      copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
      license: 'https://github.com/zloirock/core-js/blob/v3.33.2/LICENSE',
      source: 'https://github.com/zloirock/core-js'
    })
  }, { '../internals/is-pure': 63, '../internals/shared-store': 90 }],
  92: [function (require, module, exports) {
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
  }, { '../internals/engine-v8-version': 35, '../internals/fails': 38, '../internals/global': 50 }],
  93: [function (require, module, exports) {
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
  }, { '../internals/to-integer-or-infinity': 95 }],
  94: [function (require, module, exports) {
    'use strict'
    // toObject with fallback for non-array-like ES3 strings
    var IndexedObject = require('../internals/indexed-object')
    var requireObjectCoercible = require('../internals/require-object-coercible')

    module.exports = function (it) {
      return IndexedObject(requireObjectCoercible(it))
    }
  }, { '../internals/indexed-object': 55, '../internals/require-object-coercible': 88 }],
  95: [function (require, module, exports) {
    'use strict'
    var trunc = require('../internals/math-trunc')

    // `ToIntegerOrInfinity` abstract operation
    // https://tc39.es/ecma262/#sec-tointegerorinfinity
    module.exports = function (argument) {
      var number = +argument
      // eslint-disable-next-line no-self-compare -- NaN check
      return number !== number || number === 0 ? 0 : trunc(number)
    }
  }, { '../internals/math-trunc': 73 }],
  96: [function (require, module, exports) {
    'use strict'
    var toIntegerOrInfinity = require('../internals/to-integer-or-infinity')

    var min = Math.min

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    module.exports = function (argument) {
      return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0 // 2 ** 53 - 1 == 9007199254740991
    }
  }, { '../internals/to-integer-or-infinity': 95 }],
  97: [function (require, module, exports) {
    'use strict'
    var requireObjectCoercible = require('../internals/require-object-coercible')

    var $Object = Object

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    module.exports = function (argument) {
      return $Object(requireObjectCoercible(argument))
    }
  }, { '../internals/require-object-coercible': 88 }],
  98: [function (require, module, exports) {
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
  }, { '../internals/function-call': 41, '../internals/get-method': 49, '../internals/is-object': 62, '../internals/is-symbol': 64, '../internals/ordinary-to-primitive': 85, '../internals/well-known-symbol': 106 }],
  99: [function (require, module, exports) {
    'use strict'
    var toPrimitive = require('../internals/to-primitive')
    var isSymbol = require('../internals/is-symbol')

    // `ToPropertyKey` abstract operation
    // https://tc39.es/ecma262/#sec-topropertykey
    module.exports = function (argument) {
      var key = toPrimitive(argument, 'string')
      return isSymbol(key) ? key : key + ''
    }
  }, { '../internals/is-symbol': 64, '../internals/to-primitive': 98 }],
  100: [function (require, module, exports) {
    'use strict'
    var wellKnownSymbol = require('../internals/well-known-symbol')

    var TO_STRING_TAG = wellKnownSymbol('toStringTag')
    var test = {}

    test[TO_STRING_TAG] = 'z'

    module.exports = String(test) === '[object z]'
  }, { '../internals/well-known-symbol': 106 }],
  101: [function (require, module, exports) {
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
  102: [function (require, module, exports) {
    'use strict'
    var uncurryThis = require('../internals/function-uncurry-this')

    var id = 0
    var postfix = Math.random()
    var toString = uncurryThis(1.0.toString)

    module.exports = function (key) {
      return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36)
    }
  }, { '../internals/function-uncurry-this': 44 }],
  103: [function (require, module, exports) {
    'use strict'
    /* eslint-disable es/no-symbol -- required for testing */
    var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection')

    module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator === 'symbol'
  }, { '../internals/symbol-constructor-detection': 92 }],
  104: [function (require, module, exports) {
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
  }, { '../internals/descriptors': 30, '../internals/fails': 38 }],
  105: [function (require, module, exports) {
    'use strict'
    var global = require('../internals/global')
    var isCallable = require('../internals/is-callable')

    var WeakMap = global.WeakMap

    module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap))
  }, { '../internals/global': 50, '../internals/is-callable': 59 }],
  106: [function (require, module, exports) {
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
  }, { '../internals/global': 50, '../internals/has-own-property': 51, '../internals/shared': 91, '../internals/symbol-constructor-detection': 92, '../internals/uid': 102, '../internals/use-symbol-as-uid': 103 }],
  107: [function (require, module, exports) {
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
  }, { '../internals/async-iterator-iteration': 16, '../internals/export': 37 }],
  108: [function (require, module, exports) {
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
  }, { '../internals/async-iterator-iteration': 16, '../internals/export': 37 }],
  109: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var map = require('../internals/async-iterator-map')
    var IS_PURE = require('../internals/is-pure')

    // `AsyncIterator.prototype.map` method
    // https://github.com/tc39/proposal-async-iterator-helpers
    $({ target: 'AsyncIterator', proto: true, real: true, forced: IS_PURE }, {
      map: map
    })
  }, { '../internals/async-iterator-map': 17, '../internals/export': 37, '../internals/is-pure': 63 }],
  110: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 10, '../internals/an-object': 12, '../internals/async-iterator-close': 14, '../internals/export': 37, '../internals/function-call': 41, '../internals/get-built-in': 45, '../internals/get-iterator-direct': 46, '../internals/is-object': 62 }],
  111: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var global = require('../internals/global')
    var anInstance = require('../internals/an-instance')
    var isCallable = require('../internals/is-callable')
    var getPrototypeOf = require('../internals/object-get-prototype-of')
    var createNonEnumerableProperty = require('../internals/create-non-enumerable-property')
    var fails = require('../internals/fails')
    var hasOwn = require('../internals/has-own-property')
    var wellKnownSymbol = require('../internals/well-known-symbol')
    var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype
    var IS_PURE = require('../internals/is-pure')

    var TO_STRING_TAG = wellKnownSymbol('toStringTag')

    var $TypeError = TypeError
    var NativeIterator = global.Iterator

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

    if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) {
      createNonEnumerableProperty(IteratorPrototype, TO_STRING_TAG, 'Iterator')
    }

    if (FORCED || !hasOwn(IteratorPrototype, 'constructor') || IteratorPrototype.constructor === Object) {
      createNonEnumerableProperty(IteratorPrototype, 'constructor', IteratorConstructor)
    }

    IteratorConstructor.prototype = IteratorPrototype

    // `Iterator` constructor
    // https://github.com/tc39/proposal-iterator-helpers
    $({ global: true, constructor: true, forced: FORCED }, {
      Iterator: IteratorConstructor
    })
  }, { '../internals/an-instance': 11, '../internals/create-non-enumerable-property': 25, '../internals/export': 37, '../internals/fails': 38, '../internals/global': 50, '../internals/has-own-property': 51, '../internals/is-callable': 59, '../internals/is-pure': 63, '../internals/iterators-core': 69, '../internals/object-get-prototype-of': 80, '../internals/well-known-symbol': 106 }],
  112: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 10, '../internals/an-object': 12, '../internals/export': 37, '../internals/get-iterator-direct': 46, '../internals/iterate': 65 }],
  113: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 10, '../internals/an-object': 12, '../internals/export': 37, '../internals/get-iterator-direct': 46, '../internals/iterate': 65 }],
  114: [function (require, module, exports) {
    'use strict'
    var $ = require('../internals/export')
    var map = require('../internals/iterator-map')
    var IS_PURE = require('../internals/is-pure')

    // `Iterator.prototype.map` method
    // https://github.com/tc39/proposal-iterator-helpers
    $({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
      map: map
    })
  }, { '../internals/export': 37, '../internals/is-pure': 63, '../internals/iterator-map': 68 }],
  115: [function (require, module, exports) {
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
  }, { '../internals/a-callable': 10, '../internals/an-object': 12, '../internals/export': 37, '../internals/get-iterator-direct': 46, '../internals/iterate': 65 }]
}, {}, [9])

'use strict'

require('core-js/modules/es.reflect.construct.js')

require('core-js/modules/es.symbol.js')

require('core-js/modules/es.symbol.description.js')

require('core-js/modules/es.object.to-string.js')

require('core-js/modules/es.symbol.iterator.js')

require('core-js/modules/es.array.iterator.js')

require('core-js/modules/es.string.iterator.js')

require('core-js/modules/web.dom-collections.iterator.js')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.generateNode = exports.NodeFactory = exports.PseudoNode = void 0

require('core-js/modules/es.array.index-of.js')

require('core-js/modules/es.function.name.js')

require('core-js/modules/es.array.splice.js')

require('core-js/modules/es.array.reduce.js')

require('core-js/modules/es.object.assign.js')

require('core-js/modules/es.object.set-prototype-of.js')

require('core-js/modules/es.object.get-prototype-of.js')

const _collections = require('collections')

const _PseudoEventTarget2 = require('./PseudoEventTarget')

function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {function} appendChild
 * @property {function} removeChild
 */
const PseudoNode = /* #__PURE__ */(function (_PseudoEventTarget) {
  _inherits(PseudoNode, _PseudoEventTarget)

  const _super = _createSuper(PseudoNode)

  /**
   *
   * @constructor
   */
  function PseudoNode () {
    let _this

    _classCallCheck(this, PseudoNode)

    _this = _super.call(this)
    _this.nodeValue = ''
    _this.textContext = ''
    _this.children = []
    _this.parent = undefined
    return _this
  }

  _createClass(PseudoNode, [{
    key: 'baseURI',
    get: function get () {
      return window.location || '/'
    }
  }, {
    key: 'childNodes',
    get: function get () {
      return this.children
    }
  }, {
    key: 'firstChild',
    get: function get () {
      return this.children[0]
    }
  }, {
    key: 'isConnected',
    get: function get () {
      return !!this.parent
    }
  }, {
    key: 'lastChild',
    get: function get () {
      return this.children[this.children.length - 1]
    }
  }, {
    key: 'nextSibling',
    get: function get () {
      return this.isConnected ? this.parent.children[this.parent.children.indexOf(this) + 1] : null
    }
  }, {
    key: 'nodeName',
    get: function get () {
      return this.name || ''
    }
  }, {
    key: 'nodeType',
    get: function get () {
      const typeName = 'DEFAULT_NODE'
      const nodeTypes = ['DEFAULT_NODE', 'ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE', 'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE', 'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE', 'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE']
      return nodeTypes.indexOf(typeName)
    }
  }, {
    key: 'ownerDocument',
    get: function get () {
      return undefined
    }
  }, {
    key: 'parentNode',
    get: function get () {
      return this.parent
    }
  }, {
    key: 'parentElement',
    get: function get () {
      return this.parent.nodeType === 1 ? this.parent : null
    }
  }, {
    key: 'previousSibling',
    get: function get () {
      return this.isConnected ? this.parent.children[this.parent.children.indexOf(this) - 1] : null
    }
    /**
     *
     * @param {PseudoNode} childNode
     * @returns {PseudoNode}
     */

  }, {
    key: 'appendChild',
    value: function appendChild (childNode) {
      this.children.push(childNode)
      return childNode
    }
  }, {
    key: 'cloneNode',
    value: function cloneNode () {}
  }, {
    key: 'compareDocumentPosition',
    value: function compareDocumentPosition () {}
  }, {
    key: 'contains',
    value: function contains () {}
  }, {
    key: 'getRootNode',
    value: function getRootNode () {
      return this.parent.getRootNode() || this.parent
    }
  }, {
    key: 'hasChildNodes',
    value: function hasChildNodes () {
      return this.children.length > 0
    }
  }, {
    key: 'insertBefore',
    value: function insertBefore () {}
  }, {
    key: 'isDefaultNamespace',
    value: function isDefaultNamespace () {}
  }, {
    key: 'isEqualNode',
    value: function isEqualNode () {}
  }, {
    key: 'isSameNode',
    value: function isSameNode () {}
  }, {
    key: 'lookupPrefix',
    value: function lookupPrefix () {}
  }, {
    key: 'lookupNamespaceURI',
    value: function lookupNamespaceURI () {}
  }, {
    key: 'normalize',
    value: function normalize () {}
    /**
     *
     * @param {PseudoNode} childElement
     * @returns {PseudoNode}
     */

  }, {
    key: 'removeChild',
    value: function removeChild (childElement) {
      return this.children.splice(this.children.indexOf(childElement), 1)[0]
    }
  }, {
    key: 'replaceChild',
    value: function replaceChild () {}
  }])

  return PseudoNode
}(_PseudoEventTarget2.PseudoEventTarget))

exports.PseudoNode = PseudoNode

const NodeFactory = /* #__PURE__ */(function (_TreeLinker) {
  _inherits(NodeFactory, _TreeLinker)

  const _super2 = _createSuper(NodeFactory)

  function NodeFactory () {
    _classCallCheck(this, NodeFactory)

    return _super2.apply(this, arguments)
  }

  return NodeFactory
}(_collections.TreeLinker))

exports.NodeFactory = NodeFactory

const generateNode = function generateNode () {
  NodeFactory.fromArray = function () {
    const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
    const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NodeFactory
    return values.reduce(function (list, element) {
      if (_typeof(element) !== 'object') {
        element = {
          data: element
        }
      }

      let newList = false

      if (list === null) {
        newList = true
        list = new LinkerClass(Object.assign({}, element, {
          prev: list
        }))
      }
      /**
       * Simulate the behaviour of the Node Class when there is no DOM available.
       * @author Joshua Heagle <joshuaheagle@gmail.com>
       * @class
       * @augments PseudoEventTarget
       * @property {string} name
       * @property {function} appendChild
       * @property {function} removeChild
       */

      const PseudoNodeAttached = /* #__PURE__ */(function (_PseudoNode) {
        _inherits(PseudoNodeAttached, _PseudoNode)

        const _super3 = _createSuper(PseudoNodeAttached)

        /**
         *
         * @constructor
         */
        function PseudoNodeAttached () {
          let _this2

          _classCallCheck(this, PseudoNodeAttached)

          _this2 = _super3.call(this)
          _this2.nodeValue = element.data
          _this2.textContext = ''
          return _this2
        }

        _createClass(PseudoNodeAttached, [{
          key: 'baseURI',
          get: function get () {
            return window.location || '/'
          }
        }, {
          key: 'childNodes',
          get: function get () {
            return list.children
          }
        }, {
          key: 'firstChild',
          get: function get () {
            return list.children.first.data
          }
        }, {
          key: 'isConnected',
          get: function get () {
            return list.parent !== null
          }
        }, {
          key: 'lastChild',
          get: function get () {
            return list.children.last.data
          }
        }, {
          key: 'nextSibling',
          get: function get () {
            return list.next.data
          }
        }, {
          key: 'nodeName',
          get: function get () {
            return this.name || ''
          }
        }, {
          key: 'nodeType',
          get: function get () {
            const typeName = 'DEFAULT_NODE'
            const nodeTypes = ['DEFAULT_NODE', 'ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE', 'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE', 'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE', 'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE']
            return nodeTypes.indexOf(typeName)
          }
        }, {
          key: 'ownerDocument',
          get: function get () {
            return list.rootParent
          }
        }, {
          key: 'parentNode',
          get: function get () {
            return list.parent
          }
        }, {
          key: 'parentElement',
          get: function get () {
            return list.parent.nodeType === 1 ? list.parent : null
          }
        }, {
          key: 'previousSibling',
          get: function get () {
            return list.prev
          }
          /**
           *
           * @param {PseudoNode} childNode
           * @returns {PseudoNode}
           */

        }, {
          key: 'appendChild',
          value: function appendChild (childNode) {
            list.after(list, [childNode])
            return childNode
          }
        }, {
          key: 'cloneNode',
          value: function cloneNode () {}
        }, {
          key: 'compareDocumentPosition',
          value: function compareDocumentPosition () {}
        }, {
          key: 'contains',
          value: function contains () {}
        }, {
          key: 'getRootNode',
          value: function getRootNode () {
            return list.rootParent
          }
        }, {
          key: 'hasChildNodes',
          value: function hasChildNodes () {}
        }, {
          key: 'insertBefore',
          value: function insertBefore () {}
        }, {
          key: 'isDefaultNamespace',
          value: function isDefaultNamespace () {}
        }, {
          key: 'isEqualNode',
          value: function isEqualNode () {}
        }, {
          key: 'isSameNode',
          value: function isSameNode () {}
        }, {
          key: 'lookupPrefix',
          value: function lookupPrefix () {}
        }, {
          key: 'lookupNamespaceURI',
          value: function lookupNamespaceURI () {}
        }, {
          key: 'normalize',
          value: function normalize () {}
          /**
           *
           * @param {PseudoNode} childElement
           * @returns {PseudoNode}
           */

        }, {
          key: 'removeChild',
          value: function removeChild (childElement) {
            return this.children.splice(this.children.indexOf(childElement), 1)[0]
          }
        }, {
          key: 'replaceChild',
          value: function replaceChild () {}
        }])

        return PseudoNodeAttached
      }(PseudoNode))

      if (newList) {
        list.data = new PseudoNodeAttached()
        return list
      }

      element.data = new PseudoNodeAttached()
      return _collections.TreeLinker.prototype.after.apply(list, [element])
    }, null)
  }

  return NodeFactory
}

exports.generateNode = generateNode

'use strict'

function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

require('core-js/modules/es.reflect.construct.js')

require('core-js/modules/es.reflect.get.js')

require('core-js/modules/es.object.get-own-property-descriptor.js')

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
exports.PseudoElement = void 0

require('core-js/modules/es.array.concat.js')

require('core-js/modules/es.array.map.js')

require('core-js/modules/es.function.name.js')

require('core-js/modules/es.array.find.js')

require('core-js/modules/es.object.set-prototype-of.js')

require('core-js/modules/es.object.get-prototype-of.js')

const _PseudoNode2 = require('./PseudoNode')

function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

function _get (target, property, receiver) { if (typeof Reflect !== 'undefined' && Reflect.get) { _get = Reflect.get } else { _get = function _get (target, property, receiver) { const base = _superPropBase(target, property); if (!base) return; const desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver) } return desc.value } } return _get(target, property, receiver || target) }

function _superPropBase (object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break } return object }

function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

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
const PseudoElement = /* #__PURE__ */(function (_PseudoNode) {
  _inherits(PseudoElement, _PseudoNode)

  const _super = _createSuper(PseudoElement)

  /**
   * Simulate the Element object when the Dom is not available
   * @param {string} [tagName=''] - The
   * @param {array} [attributes=[]]
   * @param {PseudoNode|Object} [parent={}]
   * @param {Array} [children=[]]
   * @constructor
   */
  function PseudoElement () {
    let _this

    const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
    const _ref$tagName = _ref.tagName
    const tagName = _ref$tagName === void 0 ? '' : _ref$tagName
    const _ref$attributes = _ref.attributes
    const attributes = _ref$attributes === void 0 ? [] : _ref$attributes
    const _ref$parent = _ref.parent
    const parent = _ref$parent === void 0 ? {} : _ref$parent
    const _ref$children = _ref.children
    const children = _ref$children === void 0 ? [] : _ref$children

    _classCallCheck(this, PseudoElement)

    _this = _super.call(this, {
      parent: parent,
      children: children
    })
    _this.tagName = tagName
    _this.attributes = attributes.concat([{
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

    _this.attributes.map(function (_ref2) {
      const name = _ref2.name
      const value = _ref2.value
      _this[name] = value
      return {
        name: name,
        value: value
      }
    }) // this.classList = new DOMSettableTokenList(this.className)

    _this.classList = _this.className
    return _this
  }
  /**
   *
   * @returns {Function}
   */

  _createClass(PseudoElement, [{
    key: 'applyDefaultEvent',
    value: function applyDefaultEvent () {
      const _this2 = this

      let callback = function callback (event) {
        return undefined
      }

      switch (this.tagName) {
        case 'form':
          this.addEventListener('submit', callback)
          break

        case 'button':
        case 'input':
          if (/^(submit|image)$/i.test(this.type || '')) {
            callback = function callback (event) {
              const forms = require('./PseudoEvent').getParentNodesFromAttribute('tagName', 'form', _this2)

              if (forms) {
                forms[0].submit()
              }
            }

            _get(_getPrototypeOf(PseudoElement.prototype), 'setDefaultEvent', this).call(this, 'click', callback)
          }
      }

      return callback
    }
    /**
     *
     * @param {PseudoNode|PseudoElement} childElement
     * @returns {PseudoNode}
     */

  }, {
    key: 'appendChild',
    value: function appendChild (childElement) {
      _get(_getPrototypeOf(PseudoElement.prototype), 'appendChild', this).call(this, childElement)

      childElement.applyDefaultEvent()
      return childElement
    }
    /**
     * Check if an attribute is assigned to this element.
     * @param {string} attributeName - The attribute name to check
     * @returns {boolean}
     */

  }, {
    key: 'hasAttribute',
    value: function hasAttribute (attributeName) {
      return this.getAttribute(attributeName) !== 'undefined'
    }
    /**
     * Assign a new attribute or overwrite an assigned attribute with name and value.
     * @param {string} attributeName - The name key of the attribute to append
     * @param {string|Object} attributeValue - The value of the attribute to append
     * @returns {undefined}
     */

  }, {
    key: 'setAttribute',
    value: function setAttribute (attributeName, attributeValue) {
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

  }, {
    key: 'getAttribute',
    value: function getAttribute (attributeName) {
      return this.attributes.find(function (attribute) {
        return attribute.name === attributeName
      })
    } // noinspection JSUnusedGlobalSymbols

    /**
     * Remove an assigned attribute from the Element
     * @param {string} attributeName - The string name of the attribute to be removed
     * @returns {null}
     */

  }, {
    key: 'removeAttribute',
    value: function removeAttribute (attributeName) {
      if (this.hasAttribute(attributeName)) {
        delete this[attributeName]
        delete this.getAttribute(attributeName)
      }

      return null
    }
  }])

  return PseudoElement
}(_PseudoNode2.PseudoNode))

exports.PseudoElement = PseudoElement

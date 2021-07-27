'use strict'

function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

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
exports.PseudoHTMLDocument = void 0

require('core-js/modules/es.object.set-prototype-of.js')

require('core-js/modules/es.object.get-prototype-of.js')

const _PseudoHTMLElement2 = require('./PseudoHTMLElement')

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
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
 */
const PseudoHTMLDocument = /* #__PURE__ */(function (_PseudoHTMLElement) {
  _inherits(PseudoHTMLDocument, _PseudoHTMLElement)

  const _super = _createSuper(PseudoHTMLDocument)

  /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @returns {PseudoHTMLDocument}
   * @constructor
   */
  function PseudoHTMLDocument () {
    let _this

    _classCallCheck(this, PseudoHTMLDocument)

    _this = _super.call(this)
    const html = new _PseudoHTMLElement2.PseudoHTMLElement({
      tagName: 'html',
      parent: _assertThisInitialized(_this)
    })
    /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */

    _this.head = new _PseudoHTMLElement2.PseudoHTMLElement({
      tagName: 'head',
      parent: html
    })
    /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */

    _this.body = new _PseudoHTMLElement2.PseudoHTMLElement({
      tagName: 'body',
      parent: html
    })
    html.children = [_this.head, _this.body]
    /**
     * Create document child element
     * @type {PseudoHTMLElement[]}
     */

    _this.children = [html]
    return _this
  }
  /**
   * Create and return a PseudoHTMLElement
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */

  _createClass(PseudoHTMLDocument, [{
    key: 'createElement',
    value: function createElement () {
      const tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div'
      const returnElement = new _PseudoHTMLElement2.PseudoHTMLElement({
        tagName: tagName
      })
      returnElement.parent = this
      return returnElement
    }
  }])

  return PseudoHTMLDocument
}(_PseudoHTMLElement2.PseudoHTMLElement))

exports.PseudoHTMLDocument = PseudoHTMLDocument

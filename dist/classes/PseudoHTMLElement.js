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

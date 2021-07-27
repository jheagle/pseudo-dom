'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.PseudoEvent = void 0

require('core-js/modules/es.object.assign.js')

require('core-js/modules/es.array.map.js')

require('core-js/modules/es.object.keys.js')

require('core-js/modules/es.array.slice.js')

require('core-js/modules/es.array.concat.js')

require('core-js/modules/es.array.reduce.js')

function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

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
const PseudoEvent = /* #__PURE__ */(function () {
  /**
   *
   * @param typeArg
   * @param bubbles
   * @param cancelable
   * @param composed
   * @returns {PseudoEvent}
   * @constructor
   */
  function PseudoEvent () {
    const _this = this

    const typeArg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''

    const _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
    const _ref$bubbles = _ref.bubbles
    const bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles
    const _ref$cancelable = _ref.cancelable
    const cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable
    const _ref$composed = _ref.composed
    const composed = _ref$composed === void 0 ? true : _ref$composed

    _classCallCheck(this, PseudoEvent)

    let properties = {
      bubbles: bubbles,
      cancelable: cancelable,
      composed: composed,
      currentTarget: function currentTarget () {
        return undefined
      },
      defaultPrevented: false,
      immediatePropagationStopped: false,
      propagationStopped: false,
      eventPhase: '',
      target: function target () {
        return undefined
      },
      timeStamp: Math.floor(Date.now() / 1000),
      type: typeArg,
      isTrusted: true
    }

    this.setReadOnlyProperties = function () {
      const updateProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
      properties = Object.assign({}, properties, updateProps)

      _this.getReadOnlyProperties = (function (properties) {
        return function () {
          const name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
          return properties[name]
        }
      }(properties))

      return properties
    }

    this.setReadOnlyProperties()
    Object.keys(properties).map(function (propKey) {
      return Object.defineProperty(_this, propKey, {
        enumerable: true,
        get: function get () {
          return _this.getReadOnlyProperties(propKey)
        }
      })
    })
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

  _createClass(PseudoEvent, [{
    key: 'composedPath',
    value:
    /**
     * Return an array of targets that will have the event executed open them. The order is based on the eventPhase
     * @method
     * @returns {Array.<PseudoEventTarget>}
     */
    function composedPath () {
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

  }, {
    key: 'preventDefault',
    value: function preventDefault () {
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

  }, {
    key: 'stopImmediatePropagation',
    value: function stopImmediatePropagation () {
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

  }, {
    key: 'stopPropagation',
    value: function stopPropagation () {
      this.setReadOnlyProperties({
        propagationStopped: true
      })
      return null
    }
  }], [{
    key: 'getParentNodesFromAttribute',
    value: function getParentNodesFromAttribute (attr, value, node) {
      return Object.keys(node.parentNode).length ? (node.parentNode[attr] || false) === value ? PseudoEvent.getParentNodesFromAttribute(attr, value, node.parentNode).concat([node.parentNode]) : PseudoEvent.getParentNodesFromAttribute(attr, value, node.parentNode) : []
    }
    /**
     * A helper selector function for retrieving all parent PseudoNode for the given child node.
     * @param {PseudoNode} node
     * @returns {Array.<PseudoNode>}
     */

  }, {
    key: 'getParentNodes',
    value: function getParentNodes (node) {
      return PseudoEvent.getParentNodesFromAttribute('', false, node)
    }
  }])

  return PseudoEvent
}()) // Set up the class constants

exports.PseudoEvent = PseudoEvent;
['NONE', 'CAPTURING_PHASE', 'AT_TARGET', 'BUBBLING_PHASE'].reduce(function (phases, phase, key) {
  Object.defineProperty(PseudoEvent, phase, {
    value: key,
    writable: false,
    static: {
      get: function get () {
        return key
      }
    }
  })
  return Object.assign({}, phases, _defineProperty({}, ''.concat(phase), key))
}, {})

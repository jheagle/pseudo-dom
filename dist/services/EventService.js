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

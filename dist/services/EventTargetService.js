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
 * Substitute for the DOM EventTarget Class.
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
 */
class EventTargetService {
  constructor () {
    this.listeners = {}
    this.defaultEvent = {}
  }

  /**
   * The listeners registered for a type of event, creating the (empty) list of them when there are none yet.
   * @param type
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
   * @param event The event, which is at a phase and has a current target
   * @returns The errors which the listeners threw
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
   * @param type
   * @param listener
   */
  removeListener (type, listener) {
    listener.removed = true
    const registered = this.listeners[type]
    Array.from(registered).filter(linker => linker.data === listener).forEach(linker => registered.remove(linker))
  }

  /**
   * Register the function to run when nothing else has prevented the default for this type of event.
   * @param type
   * @param callback
   */
  setDefaultEvent (type, callback) {
    this.listenersFor(type)
    this.defaultEvent[type] = callback
  }

  /**
   * Registers an event handler of a specific event type. Adding the same handler again for the same type and phase does
   * nothing, like the DOM.
   * @param type The type of event to listen for
   * @param callback The function to call (or an object with a handleEvent function)
   * @param useCapture Listen while the event travels down to the target (true), or an object with capture, once and passive
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
   * @param type The type of event
   * @param callback The handler which was added
   * @param options Whether the listener was a capture listener (true), or an object with capture
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
   * @param event The event to dispatch
   * @returns False when the event was cancelable and a listener prevented the default, otherwise true
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

/**
 * @file Substitute for the DOM Event Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */

import { PseudoEventTarget } from '../interfaces/PseudoEventTarget'
import { PseudoEvent } from '../interfaces/PseudoEvent'

type innerProperties = {
  bubbles: boolean,
  cancelable: boolean,
  composed: boolean,
  currentTarget: PseudoEventTarget,
  defaultPrevented: boolean,
  immediatePropagationStopped: boolean,
  propagationStopped: boolean,
  eventPhase: number,
  target: PseudoEventTarget,
  timeStamp: number,
  type: string,
  isTrusted: boolean,
  dispatching: boolean,
  inPassiveListener: boolean,
  path: Array<PseudoEventTarget>
}

/**
 * The parts of an event which the dispatching of it (EventTargetService) needs to change or read. Not part of the DOM's
 * Event, which is why they are kept apart from the event's own properties.
 */
export type EventInner = {
  currentTarget: PseudoEventTarget | null,
  eventPhase: number,
  target: PseudoEventTarget,
  immediatePropagationStopped: boolean,
  propagationStopped: boolean,
  /** True while the event is being dispatched. */
  dispatching: boolean,
  /** True while a passive listener is running, in which preventDefault does nothing. */
  inPassiveListener: boolean,
  /** The targets the event travels through, the target first and the root last, set while dispatching. */
  path: Array<PseudoEventTarget>,
  /** Finish the dispatch: no phase, no current target, no path and the stop flags are cleared so the event can be dispatched again. */
  finishDispatch: () => void
}

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
export class EventService implements PseudoEvent {
  public static readonly NONE = 0
  public static readonly CAPTURING_PHASE = 1
  public static readonly AT_TARGET = 2
  public static readonly BUBBLING_PHASE = 3
  private properties: innerProperties = {
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
    isTrusted: true,
    dispatching: false,
    inPassiveListener: false,
    path: []
  }

  /**
   *
   * @param {string} typeArg
   * @param {Object} [eventOptions={}]
   * @param {boolean} [eventOptions.bubbles=true]
   * @param {boolean} [eventOptions.cancelable=true]
   * @param {boolean} [eventOptions.composed=true]
   * @constructor
   */
  constructor (typeArg: string = '', { bubbles = true, cancelable = true, composed = true }: {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean
  } = {}) {
    this.setReadOnlyProperties({ type: typeArg, bubbles: bubbles, cancelable: cancelable, composed: composed })
  }

  get bubbles (): boolean {
    return this.properties.bubbles
  }

  get cancelable (): boolean {
    return this.properties.cancelable
  }

  get composed (): boolean {
    return this.properties.composed
  }

  get currentTarget (): PseudoEventTarget {
    return this.properties.currentTarget
  }

  get defaultPrevented (): boolean {
    return this.properties.defaultPrevented
  }

  get eventPhase (): number {
    return this.properties.eventPhase
  }

  get isTrusted (): boolean {
    return this.properties.isTrusted
  }

  get target (): PseudoEventTarget {
    return this.properties.target
  }

  get timeStamp (): number {
    return this.properties.timeStamp
  }

  get type (): string {
    return this.properties.type
  }

  /**
   * Scope several accessors inside the inner object. These are only intended for usage by other DOM classes.
   * @returns {EventInner}
   */
  get inner (): EventInner {
    const self = this
    return {
      get currentTarget (): PseudoEventTarget | null {
        return self.properties.currentTarget
      },
      set currentTarget (target: PseudoEventTarget | null) {
        self.properties.currentTarget = target as PseudoEventTarget
      },
      get eventPhase (): number {
        return self.properties.eventPhase
      },
      set eventPhase (phase: number) {
        self.properties.eventPhase = phase
      },
      get target (): PseudoEventTarget {
        return self.properties.target
      },
      set target (target: PseudoEventTarget) {
        self.properties.target = target
      },
      get immediatePropagationStopped (): boolean {
        return self.properties.immediatePropagationStopped
      },
      get propagationStopped (): boolean {
        return self.properties.propagationStopped
      },
      get dispatching (): boolean {
        return self.properties.dispatching
      },
      set dispatching (dispatching: boolean) {
        self.properties.dispatching = dispatching
      },
      get inPassiveListener (): boolean {
        return self.properties.inPassiveListener
      },
      set inPassiveListener (passive: boolean) {
        self.properties.inPassiveListener = passive
      },
      get path (): Array<PseudoEventTarget> {
        return self.properties.path
      },
      set path (path: Array<PseudoEventTarget>) {
        self.properties.path = path
      },
      finishDispatch (): void {
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
  public composedPath (): Array<PseudoEventTarget> {
    // While the event is being dispatched this is every target it travels through, the target first and the root last
    return this.properties.dispatching ? this.properties.path.slice() : []
  }

  /**
   * Cancels the event (if it is cancelable).
   * @method
   * @returns {null}
   */
  public preventDefault (): null {
    // Only an event which can be cancelled can be prevented, and a passive listener cannot prevent the default
    if (this.cancelable && !this.properties.inPassiveListener) {
      this.setReadOnlyProperties({ defaultPrevented: true })
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
  public stopImmediatePropagation (): null {
    this.setReadOnlyProperties({ immediatePropagationStopped: true })
    return null
  }

  /**
   * Stops the propagation of events further along in the Dom.
   * @method
   * @returns {null}
   */
  public stopPropagation (): null {
    this.setReadOnlyProperties({ propagationStopped: true })
    return null
  }

  private setReadOnlyProperties (updateProps: Object = {}) {
    this.properties = Object.assign({}, this.properties, updateProps)
    return this
  }
}

/**
 * The standard event types of the browser, and how the browser creates them.
 */

/**
 * How the browser creates an event of a standard type: whether it bubbles, whether it can be cancelled, whether it
 * crosses the boundary of a shadow tree, and which kind of event object it is.
 */
export type EventDefinition = {
  /** After the target, the event goes back up through the ancestors (the capture phase, going down, always happens) */
  bubbles: boolean
  /** preventDefault() can stop the default action */
  cancelable: boolean
  /** The event crosses the boundary of a shadow tree */
  composed: boolean
  /** The kind of event object: Event, UIEvent, MouseEvent, PointerEvent, KeyboardEvent, FocusEvent, InputEvent or CustomEvent */
  interface: 'Event' | 'UIEvent' | 'MouseEvent' | 'PointerEvent' | 'KeyboardEvent' | 'FocusEvent' | 'InputEvent' | 'CustomEvent'
}

const define = (
  bubbles: boolean,
  cancelable: boolean,
  composed: boolean,
  eventInterface: EventDefinition['interface'] = 'Event'
): EventDefinition => ({ bubbles, cancelable, composed, interface: eventInterface })

/**
 * The events which the browser itself creates (for a user action, or for something like element.click()) have these
 * options. A script which creates an event with the constructor gets none of them (everything is false) unless it asks
 * for them, which is why createEvent only uses this table when it is told the browser is creating the event.
 * The values follow the UI Events, HTML, Pointer Events, Clipboard, Drag and Drop, Touch and CSS specifications.
 */
export const eventDefaults: { [type: string]: EventDefinition } = {
  // Mouse (UI Events)
  click: define(true, true, true, 'MouseEvent'),
  auxclick: define(true, true, true, 'MouseEvent'),
  dblclick: define(true, true, true, 'MouseEvent'),
  contextmenu: define(true, true, true, 'MouseEvent'),
  mousedown: define(true, true, true, 'MouseEvent'),
  mouseup: define(true, true, true, 'MouseEvent'),
  mousemove: define(true, true, true, 'MouseEvent'),
  mouseover: define(true, true, true, 'MouseEvent'),
  mouseout: define(true, true, true, 'MouseEvent'),
  mouseenter: define(false, false, true, 'MouseEvent'),
  mouseleave: define(false, false, true, 'MouseEvent'),
  wheel: define(true, true, true, 'MouseEvent'),

  // Pointer (Pointer Events)
  pointerdown: define(true, true, true, 'PointerEvent'),
  pointerup: define(true, true, true, 'PointerEvent'),
  pointermove: define(true, true, true, 'PointerEvent'),
  pointerover: define(true, true, true, 'PointerEvent'),
  pointerout: define(true, true, true, 'PointerEvent'),
  pointerenter: define(false, false, true, 'PointerEvent'),
  pointerleave: define(false, false, true, 'PointerEvent'),
  pointercancel: define(true, false, true, 'PointerEvent'),
  gotpointercapture: define(true, false, true, 'PointerEvent'),
  lostpointercapture: define(true, false, true, 'PointerEvent'),

  // Keyboard (UI Events)
  keydown: define(true, true, true, 'KeyboardEvent'),
  keypress: define(true, true, true, 'KeyboardEvent'),
  keyup: define(true, true, true, 'KeyboardEvent'),

  // Focus (UI Events): focus and blur do not bubble, focusin and focusout do
  focus: define(false, false, true, 'FocusEvent'),
  blur: define(false, false, true, 'FocusEvent'),
  focusin: define(true, false, true, 'FocusEvent'),
  focusout: define(true, false, true, 'FocusEvent'),

  // Forms (HTML, Input Events)
  beforeinput: define(true, true, true, 'InputEvent'),
  input: define(true, false, true, 'InputEvent'),
  change: define(true, false, false),
  select: define(true, false, false),
  submit: define(true, true, false),
  reset: define(true, true, false),
  invalid: define(false, true, false),
  toggle: define(false, false, false),

  // Loading and the page (HTML)
  load: define(false, false, false),
  error: define(false, false, false),
  abort: define(false, false, false),
  scroll: define(false, false, false),
  scrollend: define(false, false, false),
  resize: define(false, false, false),
  DOMContentLoaded: define(true, false, false),
  readystatechange: define(false, false, false),
  visibilitychange: define(true, false, false),

  // Clipboard
  copy: define(true, true, true),
  cut: define(true, true, true),
  paste: define(true, true, true),

  // Drag and drop
  drag: define(true, true, true, 'MouseEvent'),
  dragstart: define(true, true, true, 'MouseEvent'),
  dragend: define(true, false, true, 'MouseEvent'),
  dragenter: define(true, true, true, 'MouseEvent'),
  dragover: define(true, true, true, 'MouseEvent'),
  dragleave: define(true, false, true, 'MouseEvent'),
  drop: define(true, true, true, 'MouseEvent'),

  // Touch
  touchstart: define(true, true, true, 'UIEvent'),
  touchmove: define(true, true, true, 'UIEvent'),
  touchend: define(true, true, true, 'UIEvent'),
  touchcancel: define(true, false, true, 'UIEvent'),

  // Animations and transitions (CSS)
  animationstart: define(true, false, false),
  animationiteration: define(true, false, false),
  animationend: define(true, false, false),
  animationcancel: define(true, false, false),
  transitionrun: define(true, false, false),
  transitionstart: define(true, false, false),
  transitionend: define(true, false, false),
  transitioncancel: define(true, false, false)
}

export default eventDefaults

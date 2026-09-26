'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.createEvent = void 0
const EventService_1 = require('../services/EventService')
const UIEventService_1 = require('../services/UIEventService')
const MouseEventService_1 = require('../services/MouseEventService')
const PointerEventService_1 = require('../services/PointerEventService')
const KeyboardEventService_1 = require('../services/KeyboardEventService')
const FocusEventService_1 = require('../services/FocusEventService')
const InputEventService_1 = require('../services/InputEventService')
const CustomEventService_1 = require('../services/CustomEventService')
const eventDefaults_1 = require('./eventDefaults')
const eventClasses = {
  Event: EventService_1.EventService,
  UIEvent: UIEventService_1.UIEventService,
  MouseEvent: MouseEventService_1.MouseEventService,
  PointerEvent: PointerEventService_1.PointerEventService,
  KeyboardEvent: KeyboardEventService_1.KeyboardEventService,
  FocusEvent: FocusEventService_1.FocusEventService,
  InputEvent: InputEventService_1.InputEventService,
  CustomEvent: CustomEventService_1.CustomEventService
}
/**
 * Create an event of the kind which suits its type (a click is a MouseEvent, a keydown a KeyboardEvent, ...).
 * By default this is like using the constructor of the event in a script: nothing bubbles or can be cancelled unless
 * the init says so, and the event is not trusted. With browser: true the event is created the way the browser creates
 * it, using the standard options for its type (see eventDefaults), and trusted: true makes it look like it came from a
 * real user action (isTrusted).
 * @param type The type of the event, such as click
 * @param init The options for the event (bubbles, cancelable, composed and those of its kind of event)
 * @param options Whether the browser is creating the event, and whether it is trusted
 */
const createEvent = (type, init = {}, {
  browser = false,
  trusted = false
} = {}) => {
  const definition = eventDefaults_1.eventDefaults[type]
  const options = browser && definition
    ? Object.assign({
      bubbles: definition.bubbles,
      cancelable: definition.cancelable,
      composed: definition.composed
    }, init)
    : init
  const EventClass = eventClasses[definition ? definition.interface : 'Event']
  const event = new EventClass(type, options)
  event.inner.trusted = trusted
  return event
}
exports.createEvent = createEvent
exports.default = exports.createEvent

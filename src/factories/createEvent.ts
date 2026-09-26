import { EventService } from '../services/EventService'
import { UIEventService } from '../services/UIEventService'
import { MouseEventService } from '../services/MouseEventService'
import { PointerEventService } from '../services/PointerEventService'
import { KeyboardEventService } from '../services/KeyboardEventService'
import { FocusEventService } from '../services/FocusEventService'
import { InputEventService } from '../services/InputEventService'
import { CustomEventService } from '../services/CustomEventService'
import { eventDefaults } from './eventDefaults'

const eventClasses: { [name: string]: typeof EventService } = {
  Event: EventService,
  UIEvent: UIEventService,
  MouseEvent: MouseEventService,
  PointerEvent: PointerEventService,
  KeyboardEvent: KeyboardEventService,
  FocusEvent: FocusEventService,
  InputEvent: InputEventService,
  CustomEvent: CustomEventService
}

/**
 * How the event is being created.
 */
export type CreateEventOptions = {
  /** The browser is creating the event (for a user action, or for something like element.click()), so the standard options for the type of event apply where the init does not give its own (default false) */
  browser?: boolean,
  /** The event comes from a real user action rather than from a script (isTrusted) (default false) */
  trusted?: boolean
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
export const createEvent = (type: string, init: { [option: string]: any } = {}, { browser = false, trusted = false }: CreateEventOptions = {}): EventService => {
  const definition = eventDefaults[type]
  const options = browser && definition
    ? Object.assign({ bubbles: definition.bubbles, cancelable: definition.cancelable, composed: definition.composed }, init)
    : init
  const EventClass = eventClasses[definition ? definition.interface : 'Event']
  const event = new (EventClass as any)(type, options) as EventService
  event.inner.trusted = trusted
  return event
}

export default createEvent

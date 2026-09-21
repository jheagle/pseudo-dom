import createEvent from './createEvent'
import { EventService } from '../services/EventService'
import { MouseEventService } from '../services/MouseEventService'
import { PointerEventService } from '../services/PointerEventService'
import { KeyboardEventService } from '../services/KeyboardEventService'
import { FocusEventService } from '../services/FocusEventService'
import { InputEventService } from '../services/InputEventService'

describe('createEvent', () => {
  test('makes the kind of event which suits the type', () => {
    expect(createEvent('click')).toBeInstanceOf(MouseEventService)
    expect(createEvent('pointerdown')).toBeInstanceOf(PointerEventService)
    expect(createEvent('keydown')).toBeInstanceOf(KeyboardEventService)
    expect(createEvent('focus')).toBeInstanceOf(FocusEventService)
    expect(createEvent('input')).toBeInstanceOf(InputEventService)
    expect(createEvent('submit')).toBeInstanceOf(EventService)
    expect(createEvent('my-own-event')).toBeInstanceOf(EventService)
    expect(createEvent('my-own-event').type).toBe('my-own-event')
  })

  test('is like using the constructor by default: nothing bubbles or can be cancelled, and it is not trusted', () => {
    const event = createEvent('click')
    expect(event.bubbles).toBe(false)
    expect(event.cancelable).toBe(false)
    expect(event.composed).toBe(false)
    expect(event.isTrusted).toBe(false)
  })

  test('the init gives the options and the details of the kind of event', () => {
    const event = createEvent('click', { bubbles: true, clientX: 10, clientY: 20, shiftKey: true })
    expect(event.bubbles).toBe(true)
    expect(event.cancelable).toBe(false)
    expect(event.clientX).toBe(10)
    expect(event.clientY).toBe(20)
    expect(event.getModifierState('Shift')).toBe(true)
  })

  test('when the browser makes it, the standard options for the type apply', () => {
    const click = createEvent('click', {}, { browser: true })
    expect([click.bubbles, click.cancelable, click.composed]).toEqual([true, true, true])
    const focus = createEvent('focus', {}, { browser: true })
    expect([focus.bubbles, focus.cancelable, focus.composed]).toEqual([false, false, true])
    const input = createEvent('input', {}, { browser: true })
    expect([input.bubbles, input.cancelable]).toEqual([true, false])
  })

  test('the init still wins over the standard options', () => {
    const click = createEvent('click', { cancelable: false }, { browser: true })
    expect(click.bubbles).toBe(true)
    expect(click.cancelable).toBe(false)
  })

  test('a type which is not standard gets only what the init says, even for the browser', () => {
    const event = createEvent('my-own-event', { bubbles: true }, { browser: true })
    expect([event.bubbles, event.cancelable, event.composed]).toEqual([true, false, false])
  })

  test('trusted makes it look like it came from a real user action', () => {
    expect(createEvent('click', {}, { browser: true, trusted: true }).isTrusted).toBe(true)
    expect(createEvent('click', {}, { browser: true }).isTrusted).toBe(false)
  })
})

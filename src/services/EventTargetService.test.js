import EventTargetService from './EventTargetService'
import { EventService } from './EventService'

// Listeners only run for an event which is at (or moving through) a phase, so place the event at the target.
const eventAtTarget = type => {
  const event = new EventService(type)
  event.inner.eventPhase = EventService.AT_TARGET
  return event
}

describe('EventTargetService', () => {
  test('listeners run in the order they were added', () => {
    const target = new EventTargetService()
    const calls = []
    target.addEventListener('click', () => calls.push('first'))
    target.addEventListener('click', () => calls.push('second'))
    target.dispatchEvent(eventAtTarget('click'))
    expect(calls).toEqual(['first', 'second'])
  })

  test('listeners keep running for later events', () => {
    const target = new EventTargetService()
    let count = 0
    target.addEventListener('click', () => count++)
    target.dispatchEvent(eventAtTarget('click'))
    target.dispatchEvent(eventAtTarget('click'))
    expect(count).toBe(2)
  })

  test('once listeners run once and are then removed', () => {
    const target = new EventTargetService()
    const calls = []
    target.addEventListener('click', () => calls.push('once'), { once: true })
    target.addEventListener('click', () => calls.push('always'))
    target.dispatchEvent(eventAtTarget('click'))
    target.dispatchEvent(eventAtTarget('click'))
    expect(calls).toEqual(['once', 'always', 'always'])
  })

  test('listeners can be objects with handleEvent', () => {
    const target = new EventTargetService()
    const seen = []
    target.addEventListener('click', { handleEvent: event => seen.push(event.type) })
    target.dispatchEvent(eventAtTarget('click'))
    expect(seen).toEqual(['click'])
  })

  test('removed listeners no longer run and removing something unknown is harmless', () => {
    const target = new EventTargetService()
    const calls = []
    const listener = () => calls.push('removed')
    target.addEventListener('click', listener)
    target.addEventListener('click', () => calls.push('kept'))
    target.removeEventListener('click', listener)
    target.removeEventListener('click', () => undefined)
    target.removeEventListener('other', listener)
    target.dispatchEvent(eventAtTarget('click'))
    expect(calls).toEqual(['kept'])
  })

  test('stopImmediatePropagation stops the remaining listeners', () => {
    const target = new EventTargetService()
    const calls = []
    target.addEventListener('click', event => {
      calls.push('first')
      event.stopImmediatePropagation()
    })
    target.addEventListener('click', () => calls.push('second'))
    target.dispatchEvent(eventAtTarget('click'))
    expect(calls).toEqual(['first'])
  })

  test('dispatchEvent sets the target and reports whether the default was prevented', () => {
    const target = new EventTargetService()
    target.addEventListener('click', event => event.preventDefault())
    const event = eventAtTarget('click')
    expect(target.dispatchEvent(event)).toBe(false)
    expect(event.target).toBe(target)
    expect(target.dispatchEvent(eventAtTarget('unheard'))).toBe(true)
  })

  test('the handler runs with the target as this', () => {
    const target = new EventTargetService()
    let thisValue
    target.addEventListener('click', function () { thisValue = this })
    target.dispatchEvent(eventAtTarget('click'))
    expect(thisValue).toBe(target)
  })

  test('listeners added while the event is running do not run for that event', () => {
    const target = new EventTargetService()
    const calls = []
    target.addEventListener('click', () => {
      calls.push('first')
      target.addEventListener('click', () => calls.push('added'))
    })
    target.dispatchEvent(eventAtTarget('click'))
    expect(calls).toEqual(['first'])
    target.dispatchEvent(eventAtTarget('click'))
    expect(calls).toEqual(['first', 'first', 'added'])
  })

  test('a listener can remove itself while the event is running', () => {
    const target = new EventTargetService()
    const calls = []
    const listener = () => {
      calls.push('self')
      target.removeEventListener('click', listener)
    }
    target.addEventListener('click', listener)
    target.addEventListener('click', () => calls.push('other'))
    target.dispatchEvent(eventAtTarget('click'))
    target.dispatchEvent(eventAtTarget('click'))
    expect(calls).toEqual(['self', 'other', 'other'])
  })
})

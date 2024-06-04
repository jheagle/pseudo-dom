import { EventService } from '../services/EventService'

class GenericEvent extends EventService {}

const testEvent = new GenericEvent('click')

describe('PseudoEvent', () => {
  test('event has type', () => {
    expect(testEvent.type).toBe('click')
  })

  test('event has bubbles', () => {
    expect(testEvent.bubbles).toBe(true)
    const nonBubblesEvent = new GenericEvent('click', { bubbles: false })
    expect(nonBubblesEvent.bubbles).toBe(false)
  })

  test('event has cancelable', () => {
    expect(testEvent.cancelable).toBe(true)
    const nonCancelableEvent = new GenericEvent('click', { cancelable: false })
    expect(nonCancelableEvent.cancelable).toBe(false)
  })

  test('event has composed', () => {
    expect(testEvent.composed).toBe(true)
    const nonComposedEvent = new GenericEvent('click', { composed: false })
    expect(nonComposedEvent.composed).toBe(false)
  })

  test('event has currentTarget', () => {
    expect(testEvent).toHaveProperty('currentTarget')
  })

  test('event has defaultPrevented, which can be updated with preventDefault()', () => {
    expect(testEvent.defaultPrevented).toBe(false)
    testEvent.preventDefault()
    expect(testEvent.defaultPrevented).toBe(true)
  })

  test('event has immediatePropagationStopped, which can be updated with stopImmediatePropagation()', () => {
    expect(testEvent.inner.immediatePropagationStopped).toBe(false)
    testEvent.stopImmediatePropagation()
    expect(testEvent.inner.immediatePropagationStopped).toBe(true)
  })

  test('event has propagationStopped, which can be updated with stopPropagation()', () => {
    expect(testEvent.inner.propagationStopped).toBe(false)
    testEvent.stopPropagation()
    expect(testEvent.inner.propagationStopped).toBe(true)
  })

  test('event has eventPhase', () => {
    expect(testEvent.eventPhase).toBe(GenericEvent.NONE)
  })

  test('event has target', () => {
    expect(testEvent).toHaveProperty('target')
  })

  test('event has timeStamp', () => {
    expect(testEvent.timeStamp).toBeCloseTo(Math.floor(Date.now() / 1000))
  })

  test('event has isTrusted as true', () => {
    expect(testEvent.isTrusted).toBe(true)
  })

  test('event constants are readable', () => {
    expect(GenericEvent.NONE).toBe(0)
    expect(GenericEvent.CAPTURING_PHASE).toBe(1)
    expect(GenericEvent.AT_TARGET).toBe(2)
    expect(GenericEvent.BUBBLING_PHASE).toBe(3)
  })

  test('event composedPath is empty when not running a phase', () => {
    expect(testEvent.composedPath()).toStrictEqual([])
  })
})

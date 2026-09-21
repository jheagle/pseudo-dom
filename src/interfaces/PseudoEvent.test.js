import { EventService } from '../services/EventService'

class GenericEvent extends EventService {}

const testEvent = new GenericEvent('click')

describe('PseudoEvent', () => {
  test('event has type', () => {
    expect(testEvent.type).toBe('click')
  })

  test('event has bubbles, which is false unless it is asked for (like the DOM)', () => {
    expect(testEvent.bubbles).toBe(false)
    const bubblesEvent = new GenericEvent('click', { bubbles: true })
    expect(bubblesEvent.bubbles).toBe(true)
  })

  test('event has cancelable, which is false unless it is asked for (like the DOM)', () => {
    expect(testEvent.cancelable).toBe(false)
    const cancelableEvent = new GenericEvent('click', { cancelable: true })
    expect(cancelableEvent.cancelable).toBe(true)
  })

  test('event has composed, which is false unless it is asked for (like the DOM)', () => {
    expect(testEvent.composed).toBe(false)
    const composedEvent = new GenericEvent('click', { composed: true })
    expect(composedEvent.composed).toBe(true)
  })

  test('event has currentTarget', () => {
    expect(testEvent).toHaveProperty('currentTarget')
  })

  test('event has defaultPrevented, which can be updated with preventDefault() when the event is cancelable', () => {
    const cancelableEvent = new GenericEvent('click', { cancelable: true })
    expect(cancelableEvent.defaultPrevented).toBe(false)
    cancelableEvent.preventDefault()
    expect(cancelableEvent.defaultPrevented).toBe(true)
  })

  test('preventDefault does nothing for an event which is not cancelable', () => {
    const plainEvent = new GenericEvent('click')
    plainEvent.preventDefault()
    expect(plainEvent.defaultPrevented).toBe(false)
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

  test('event made by a script is not trusted', () => {
    expect(testEvent.isTrusted).toBe(false)
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

import EventTargetService from '../services/EventTargetService'

class GenericEventTarget extends EventTargetService {}

const testEventTarget = new GenericEventTarget()

describe('PseudoEventTarget', () => {
  test('event target has listeners', () => {
    expect(testEventTarget.listeners).toStrictEqual({})
  })
})

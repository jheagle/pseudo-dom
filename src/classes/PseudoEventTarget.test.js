import PseudoEventTarget from './PseudoEventTarget'

const testEventTarget = new PseudoEventTarget()

describe('PseudoEventTarget', () => {
  test('event target has listeners', () => {
    expect(testEventTarget.listeners).toStrictEqual({})
  })
})

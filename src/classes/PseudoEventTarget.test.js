import PseudoEventTarget from './PseudoEventTarget'

const testEventTarget = new PseudoEventTarget()

test('event target has listeners', () => {
  expect(testEventTarget.listeners).toStrictEqual([])
})

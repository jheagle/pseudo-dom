import generateListenerList from './generateListenerList'

const testEventTarget = generateListenerList()

describe('generateListenerList', () => {
  test('event target has listeners', () => {
    expect(testEventTarget.listeners).toStrictEqual({})
  })
})

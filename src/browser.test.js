import * as browser from './browser'
import pseudoDom from './main'

describe('browser entry', () => {
  test('holds everything once, by name, without a default', () => {
    expect(Object.keys(browser)).not.toContain('default')
    expect(Object.keys(browser).sort()).toEqual(Object.keys(pseudoDom).sort())
  })
})

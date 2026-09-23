import { HTMLElementService } from '../services/HTMLElementService'

describe('createDataset (element.dataset)', () => {
  test('reading a camelCase name reads the matching data- attribute', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    el.setAttribute('data-foo-bar', 'hi')
    expect(el.dataset.fooBar).toBe('hi')
  })

  test('an unset name reads as undefined, like the DOM', () => {
    expect(new HTMLElementService({ tagName: 'div' }).dataset.missing).toBeUndefined()
  })

  test('writing a camelCase name sets the matching data- attribute', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    el.dataset.fooBar = 'hi'
    expect(el.getAttribute('data-foo-bar')).toBe('hi')
    expect(el.dataset.fooBar).toBe('hi')
  })

  test('deleting a camelCase name removes the matching data- attribute', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    el.dataset.fooBar = 'hi'
    delete el.dataset.fooBar
    expect(el.hasAttribute('data-foo-bar')).toBe(false)
    expect(el.dataset.fooBar).toBeUndefined()
  })

  test('"in" checks for a data- attribute', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    el.dataset.fooBar = 'hi'
    expect('fooBar' in el.dataset).toBe(true)
    expect('missing' in el.dataset).toBe(false)
  })

  test('is live: reflects attribute changes made after it was read', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    const dataset = el.dataset
    expect(dataset.fooBar).toBeUndefined()
    el.setAttribute('data-foo-bar', 'hi')
    expect(dataset.fooBar).toBe('hi')
  })

  test('is not affected by non-data- attributes', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    el.id = 'x'
    expect(el.dataset.id).toBeUndefined()
    expect(Object.keys(el.dataset)).toEqual([])
  })

  test('enumerates every data- attribute under its camelCase name', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    el.dataset.fooBar = 'one'
    el.dataset.baz = 'two'
    expect(Object.keys(el.dataset).sort()).toEqual(['baz', 'fooBar'])
    expect({ ...el.dataset }).toEqual({ fooBar: 'one', baz: 'two' })
  })
})

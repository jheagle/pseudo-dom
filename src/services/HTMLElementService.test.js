import { HTMLElementService } from './HTMLElementService'

describe('HTMLElementService style / dataset wiring', () => {
  test('style is the same live object across accesses, and not shared between elements', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    expect(el.style).toBe(el.style)
    expect(el.style).not.toBe(new HTMLElementService({ tagName: 'div' }).style)
  })

  test('dataset is the same live object across accesses, and not shared between elements', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    expect(el.dataset).toBe(el.dataset)
    expect(el.dataset).not.toBe(new HTMLElementService({ tagName: 'div' }).dataset)
  })

  test('cloneNode copies the style (it is not attribute-backed like most properties)', () => {
    const el = new HTMLElementService({ tagName: 'div' })
    el.style.color = 'red'
    const copy = el.cloneNode()
    expect(copy.style.color).toBe('red')
    expect(copy.style).not.toBe(el.style)
    copy.style.color = 'blue'
    expect(el.style.color).toBe('red')
  })

  test('isEqualNode compares style too', () => {
    const first = new HTMLElementService({ tagName: 'div' })
    const second = new HTMLElementService({ tagName: 'div' })
    expect(first.isEqualNode(second)).toBe(true)
    first.style.color = 'red'
    expect(first.isEqualNode(second)).toBe(false)
    second.style.color = 'red'
    expect(first.isEqualNode(second)).toBe(true)
  })
})

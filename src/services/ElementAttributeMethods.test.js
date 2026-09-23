import { ElementService } from './ElementService'
import { HTMLCollectionService } from './HTMLCollectionService'

describe('localName / prefix', () => {
  test('localName matches tagName, and prefix is always null (no real namespace parsing)', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.localName).toBe('div')
    expect(div.prefix).toBeNull()
  })
})

describe('getAttributeNames / hasAttributes', () => {
  test('a plain element already reports its property-backed attributes (id, className, ...)', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.hasAttributes()).toBe(true)
    expect(div.getAttributeNames()).toEqual(expect.arrayContaining(['id', 'className']))
    // innerHTML is a computed getter, not a stored attribute (it never was reflected in outerHTML either)
    expect(div.getAttributeNames()).not.toEqual(expect.arrayContaining(['innerHTML']))
  })

  test('a custom attribute appears in both once set', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('data-x', '1')
    expect(div.getAttributeNames()).toEqual(expect.arrayContaining(['data-x']))
    div.removeAttribute('data-x')
    expect(div.getAttributeNames()).not.toEqual(expect.arrayContaining(['data-x']))
  })
})

describe('toggleAttribute', () => {
  test('adds the attribute (empty value) when it is not present', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.toggleAttribute('data-x')).toBe(true)
    expect(div.hasAttribute('data-x')).toBe(true)
    expect(div.getAttribute('data-x')).toBe('')
  })

  test('removes the attribute when it is present', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('data-x', '1')
    expect(div.toggleAttribute('data-x')).toBe(false)
    expect(div.hasAttribute('data-x')).toBe(false)
  })

  test('force decides instead of toggling', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.toggleAttribute('data-x', true)).toBe(true)
    expect(div.toggleAttribute('data-x', true)).toBe(true)
    expect(div.hasAttribute('data-x')).toBe(true)
    expect(div.toggleAttribute('data-x', false)).toBe(false)
    expect(div.toggleAttribute('data-x', false)).toBe(false)
    expect(div.hasAttribute('data-x')).toBe(false)
  })
})

describe('getElementsByTagNameNS', () => {
  test('behaves like getElementsByTagName, ignoring the namespace (no real namespace parsing)', () => {
    const div = new ElementService({ tagName: 'div' })
    const span = new ElementService({ tagName: 'span' })
    div.appendChild(span)
    const result = div.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'span')
    expect(result).toBeInstanceOf(HTMLCollectionService)
    expect(Array.from(result)).toEqual([span])
  })
})

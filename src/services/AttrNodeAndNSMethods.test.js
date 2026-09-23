import { ElementService } from './ElementService'
import { AttrService } from './AttrService'

describe('getAttributeNode / setAttributeNode / removeAttributeNode', () => {
  test('getAttributeNode returns null for an attribute that does not exist', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.getAttributeNode('data-x')).toBeNull()
  })

  test('getAttributeNode returns an Attr reflecting the current value once the attribute is set', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('data-x', '1')
    const attr = div.getAttributeNode('data-x')
    expect(attr).toBeInstanceOf(AttrService)
    expect(attr.name).toBe('data-x')
    expect(attr.value).toBe('1')
    expect(attr.ownerElement).toBe(div)
  })

  test('setAttributeNode adds a new attribute and returns null (there was no previous node)', () => {
    const div = new ElementService({ tagName: 'div' })
    const attr = new AttrService('data-x', '1')
    expect(div.setAttributeNode(attr)).toBeNull()
    expect(div.getAttribute('data-x')).toBe('1')
  })

  test('setAttributeNode replaces an existing attribute and returns the previous node', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('data-x', '1')
    const replacement = new AttrService('data-x', '2')
    const previous = div.setAttributeNode(replacement)
    expect(previous).toBeInstanceOf(AttrService)
    expect(previous.value).toBe('1')
    expect(div.getAttribute('data-x')).toBe('2')
  })

  test('removeAttributeNode removes the attribute and returns the removed node', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('data-x', '1')
    const attr = div.getAttributeNode('data-x')
    const removed = div.removeAttributeNode(attr)
    expect(removed).toBeInstanceOf(AttrService)
    expect(removed.value).toBe('1')
    expect(div.hasAttribute('data-x')).toBe(false)
  })

  test('removeAttributeNode throws when the element has no attribute matching the given node', () => {
    const div = new ElementService({ tagName: 'div' })
    const attr = new AttrService('data-x', '1')
    expect(() => div.removeAttributeNode(attr)).toThrow()
  })
})

describe('*NS attribute methods (no real namespace parsing, so the namespace argument is ignored)', () => {
  const namespace = 'http://www.w3.org/1999/xhtml'

  test('getAttributeNS behaves like getAttribute', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('data-x', '1')
    expect(div.getAttributeNS(namespace, 'data-x')).toBe('1')
    expect(div.getAttributeNS('anything-else', 'data-x')).toBe('1')
    expect(div.getAttributeNS(namespace, 'missing')).toBeNull()
  })

  test('hasAttributeNS behaves like hasAttribute', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('data-x', '1')
    expect(div.hasAttributeNS(namespace, 'data-x')).toBe(true)
    expect(div.hasAttributeNS(namespace, 'missing')).toBe(false)
  })

  test('setAttributeNS behaves like setAttribute', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttributeNS(namespace, 'data-x', '1')
    expect(div.getAttribute('data-x')).toBe('1')
  })

  test('removeAttributeNS behaves like removeAttribute', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('data-x', '1')
    div.removeAttributeNS(namespace, 'data-x')
    expect(div.hasAttribute('data-x')).toBe(false)
  })

  test('getAttributeNodeNS behaves like getAttributeNode', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('data-x', '1')
    const attr = div.getAttributeNodeNS(namespace, 'data-x')
    expect(attr).toBeInstanceOf(AttrService)
    expect(attr.value).toBe('1')
    expect(div.getAttributeNodeNS(namespace, 'missing')).toBeNull()
  })

  test('setAttributeNodeNS behaves like setAttributeNode', () => {
    const div = new ElementService({ tagName: 'div' })
    const attr = new AttrService('data-x', '1')
    expect(div.setAttributeNodeNS(attr)).toBeNull()
    expect(div.getAttribute('data-x')).toBe('1')
    const replacement = new AttrService('data-x', '2')
    const previous = div.setAttributeNodeNS(replacement)
    expect(previous.value).toBe('1')
    expect(div.getAttribute('data-x')).toBe('2')
  })
})

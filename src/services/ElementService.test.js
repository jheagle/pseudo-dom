import { ElementService } from './ElementService'
import { NodeService } from './NodeService'

describe('ElementService', () => {
  test('is an element node with a tag name', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.tagName).toBe('div')
    expect(div.nodeType).toBe(NodeService.ELEMENT_NODE)
    expect(div.id).toBe('')
    expect(div.className).toBe('')
  })

  test('has, sets, reads and removes attributes', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.hasAttribute('data-x')).toBe(false)
    expect(div.getAttribute('data-x')).toBeNull()
    div.setAttribute('data-x', '1')
    expect(div.hasAttribute('data-x')).toBe(true)
    expect(div.getAttribute('data-x')).toBe('1')
    div.setAttribute('data-x', '2')
    expect(div.getAttribute('data-x')).toBe('2')
    div.removeAttribute('data-x')
    expect(div.hasAttribute('data-x')).toBe(false)
  })

  test('attributes that are also properties are kept in sync', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('id', 'main')
    expect(div.id).toBe('main')
    expect(div.getAttribute('id')).toBe('main')
  })

  test('setting an attribute never replaces a method of the element', () => {
    const div = new ElementService({ tagName: 'div' })
    div.setAttribute('appendChild', 'oops')
    expect(typeof div.appendChild).toBe('function')
  })

  test('exposes the attributes as a NamedNodeMap of Attrs', () => {
    const div = new ElementService({ tagName: 'div', attributes: [{ name: 'title', value: 'hi' }] })
    const title = div.attributes.getNamedItem('title')
    expect(title.value).toBe('hi')
    expect(title.ownerElement).toBe(div)
    expect(div.attributes.getNamedItem('id').value).toBe('')
  })

  test('className and classList are the same tokens', () => {
    const div = new ElementService({ tagName: 'div' })
    div.className = 'one two'
    expect(div.classList.contains('two')).toBe(true)
    div.classList.add('three')
    expect(div.className).toBe('one two three')
  })

  test('appendChild stores the child, returns it and applies its default events', () => {
    const parent = new ElementService({ tagName: 'div' })
    const child = new ElementService({ tagName: 'form' })
    expect(parent.appendChild(child)).toBe(child)
    expect(parent.hasChildNodes()).toBe(true)
    expect(parent.firstChild).toBe(child)
  })

  test('elements can be created with children and a parent, which are appended for real', () => {
    const child = new ElementService({ tagName: 'span' })
    const parent = new ElementService({ tagName: 'div', children: [child] })
    expect(child.parentNode).toBe(parent)
    const outer = new ElementService({ tagName: 'section', parent })
    expect(Array.from(parent.childNodes)).toEqual([child, outer])
    expect(outer.previousSibling).toBe(child)
  })

  test('children which are not nodes are refused', () => {
    expect(() => new ElementService({ tagName: 'div', children: ['text'] })).toThrow('must be nodes')
  })

  test('elements get their default events however they are inserted', () => {
    const form = new ElementService({ tagName: 'form' })
    const before = jest.spyOn(form, 'applyDefaultEvent')
    const parent = new ElementService({ tagName: 'div' })
    const reference = new ElementService({ tagName: 'p' })
    parent.appendChild(reference)
    parent.insertBefore(form, reference)
    expect(before).toHaveBeenCalledTimes(1)
  })

  test('an attribute which is also a property shows what the property was set to', () => {
    const div = new ElementService({ tagName: 'div' })
    div.id = 'set-by-property'
    div.className = 'a b'
    expect(div.getAttribute('id')).toBe('set-by-property')
    expect(div.getAttribute('className')).toBe('a b')
    expect(div.attributes.getNamedItem('id').value).toBe('set-by-property')
  })
})

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
})

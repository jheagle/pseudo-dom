import { NodeService, TextService, CommentService } from './NodeService'
import { ElementService } from './ElementService'
import { HTMLElementService } from './HTMLElementService'
import { DocumentFragmentService } from './DocumentFragmentService'

const el = (tagName, attributes = {}) => {
  const element = new HTMLElementService({ tagName })
  Object.keys(attributes).forEach(name => element.setAttribute(name, attributes[name]))
  return element
}
const kids = node => Array.from(node.childNodes)
const values = node => kids(node).map(child => child.nodeType === 3 ? child.data : child.tagName || child.nodeName)

describe('append / prepend', () => {
  test('append adds at the end, in the order given, strings become text nodes', () => {
    const parent = el('div')
    parent.append('a', el('span'), 'b')
    expect(values(parent)).toEqual(['a', 'span', 'b'])
    expect(kids(parent)[0]).toBeInstanceOf(TextService)
  })

  test('prepend adds at the start, in the order given', () => {
    const parent = el('div')
    parent.appendChild(el('existing'))
    parent.prepend('a', el('span'), 'b')
    expect(values(parent)).toEqual(['a', 'span', 'b', 'existing'])
  })

  test('append and prepend work on an empty node', () => {
    const parent = el('div')
    parent.prepend('only')
    expect(values(parent)).toEqual(['only'])
  })

  test('an existing node given to append / prepend is moved, not duplicated', () => {
    const parent = el('div')
    const other = el('div')
    const moved = el('span')
    other.appendChild(moved)
    parent.append(moved)
    expect(values(parent)).toEqual(['span'])
    expect(values(other)).toEqual([])
    expect(moved.parentNode).toBe(parent)
  })

  test('append / prepend throw for a kind of node which cannot have children', () => {
    expect(() => new TextService('a').append('b')).toThrow('cannot have children')
    expect(() => new CommentService('a').prepend('b')).toThrow('cannot have children')
  })
})

describe('replaceChildren', () => {
  test('removes every child and puts the given ones in their place', () => {
    const parent = el('div')
    parent.append(el('a'), el('b'))
    parent.replaceChildren('x', el('y'))
    expect(values(parent)).toEqual(['x', 'y'])
  })

  test('with nothing given, empties the node', () => {
    const parent = el('div')
    parent.append(el('a'), el('b'))
    parent.replaceChildren()
    expect(parent.hasChildNodes()).toBe(false)
  })
})

describe('before / after', () => {
  test('before adds siblings just before this node, in order', () => {
    const parent = el('div')
    const target = el('target')
    parent.append(el('first'), target, el('last'))
    target.before('a', el('b'))
    expect(values(parent)).toEqual(['first', 'a', 'b', 'target', 'last'])
  })

  test('after adds siblings just after this node, in order', () => {
    const parent = el('div')
    const target = el('target')
    parent.append(el('first'), target, el('last'))
    target.after('a', el('b'))
    expect(values(parent)).toEqual(['first', 'target', 'a', 'b', 'last'])
  })

  test('before / after do nothing when the node has no parent', () => {
    const alone = el('div')
    alone.before('x')
    alone.after('y')
    expect(alone.parentNode).toBeNull()
  })

  test('moving an existing node with before / after works', () => {
    const parent = el('div')
    const target = el('target')
    const mover = el('mover')
    parent.append(mover, target)
    target.before(mover)
    expect(values(parent)).toEqual(['mover', 'target'])
  })
})

describe('replaceWith', () => {
  test('puts the given nodes where this one was, in order, and removes this one', () => {
    const parent = el('div')
    const target = el('target')
    parent.append(el('first'), target, el('last'))
    target.replaceWith('a', el('b'))
    expect(values(parent)).toEqual(['first', 'a', 'b', 'last'])
    expect(target.parentNode).toBeNull()
  })

  test('does nothing when the node has no parent', () => {
    const alone = el('div')
    alone.replaceWith('x')
    expect(alone.parentNode).toBeNull()
  })
})

describe('remove', () => {
  test('removes this node from its parent', () => {
    const parent = el('div')
    const target = el('target')
    parent.append(el('first'), target, el('last'))
    target.remove()
    expect(values(parent)).toEqual(['first', 'last'])
    expect(target.parentNode).toBeNull()
  })

  test('does nothing when the node has no parent', () => {
    const alone = el('div')
    expect(() => alone.remove()).not.toThrow()
  })

  test('a text node can remove itself', () => {
    const parent = el('div')
    const text = new TextService('x')
    parent.appendChild(text)
    text.remove()
    expect(parent.hasChildNodes()).toBe(false)
  })
})

import { HTMLElementService } from './HTMLElementService'
import { TextService, CommentService } from './NodeService'
import { DocumentService } from './DocumentService'
import { DocumentFragmentService } from './DocumentFragmentService'
import { HTMLCollectionService } from './HTMLCollectionService'

const el = (tagName, attributes = {}) => {
  const element = new HTMLElementService({ tagName })
  Object.keys(attributes).forEach(name => element.setAttribute(name, attributes[name]))
  return element
}

// document
//   div#root.wrap
//     span#s1.item.first (text: 'one')
//     <!-- note -->
//     span#s2.item (text: 'two')
//       em.nested (text: 'deep')
//     p.item (text: 'three')
const makeTree = () => {
  const document = new DocumentService()
  const root = el('div', { id: 'root', className: 'wrap' })
  const span1 = el('span', { id: 's1', className: 'item first' })
  const span2 = el('span', { id: 's2', className: 'item' })
  const nested = el('em', { className: 'nested' })
  const paragraph = el('p', { className: 'item' })
  span1.textContent = 'one'
  nested.textContent = 'deep'
  paragraph.textContent = 'three'
  span2.appendChild(nested)
  root.appendChild(span1)
  root.appendChild(new CommentService(' note '))
  root.appendChild(span2)
  root.appendChild(paragraph)
  document.appendChild(root)
  return { document, root, span1, span2, nested, paragraph }
}

describe('getElementsByTagName', () => {
  test('finds every matching descendant, deep, live', () => {
    const { root, span1, span2, nested } = makeTree()
    const spans = root.getElementsByTagName('span')
    expect(spans).toBeInstanceOf(HTMLCollectionService)
    expect(Array.from(spans)).toEqual([span1, span2])
    const added = el('span')
    nested.appendChild(added)
    expect(Array.from(root.getElementsByTagName('span'))).toEqual([span1, span2, added])
  })

  test('* matches every element', () => {
    const { root, span1, span2, nested, paragraph } = makeTree()
    expect(Array.from(root.getElementsByTagName('*'))).toEqual([span1, span2, nested, paragraph])
  })

  test('no matches is an empty (but valid) collection', () => {
    const { root } = makeTree()
    const result = root.getElementsByTagName('table')
    expect(result.length).toBe(0)
    expect(Array.from(result)).toEqual([])
  })

  test('works from the document too', () => {
    const { document, span1, span2 } = makeTree()
    expect(Array.from(document.getElementsByTagName('span'))).toEqual([span1, span2])
  })
})

describe('getElementsByClassName', () => {
  test('finds descendants with the class, deep', () => {
    const { root, span1, span2, paragraph } = makeTree()
    expect(Array.from(root.getElementsByClassName('item'))).toEqual([span1, span2, paragraph])
  })

  test('requires every given (space separated) class to be present', () => {
    const { root, span1 } = makeTree()
    expect(Array.from(root.getElementsByClassName('item first'))).toEqual([span1])
  })

  test('no matches is an empty collection', () => {
    const { root } = makeTree()
    expect(Array.from(root.getElementsByClassName('missing'))).toEqual([])
  })
})

describe('querySelector / querySelectorAll', () => {
  test('querySelector returns the first match in tree order, or null', () => {
    const { root, span1 } = makeTree()
    expect(root.querySelector('.item')).toBe(span1)
    expect(root.querySelector('#s1')).toBe(span1)
    expect(root.querySelector('.nowhere')).toBeNull()
  })

  test('querySelectorAll returns a plain array of every match, in tree order', () => {
    const { root, span1, span2, paragraph } = makeTree()
    const result = root.querySelectorAll('.item')
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual([span1, span2, paragraph])
  })

  test('supports descendant and child combinators, attribute and id selectors', () => {
    const { root, nested, span2 } = makeTree()
    expect(root.querySelector('#s2 em')).toBe(nested)
    expect(root.querySelector('div > span.item.first')).not.toBeNull()
    expect(root.querySelector('span[id="s2"]')).toBe(span2)
  })

  test('querySelectorAll is a snapshot, not live', () => {
    const { root } = makeTree()
    const result = root.querySelectorAll('.item')
    const before = result.length
    root.appendChild(el('div', { className: 'item' }))
    expect(result.length).toBe(before)
    expect(root.querySelectorAll('.item').length).toBe(before + 1)
  })

  test('works on a DocumentFragment too', () => {
    const fragment = new DocumentFragmentService()
    const item = el('span', { className: 'item' })
    fragment.appendChild(item)
    expect(fragment.querySelector('.item')).toBe(item)
    expect(fragment.querySelectorAll('.item')).toEqual([item])
  })
})

describe('matches', () => {
  test('true when the element itself matches the selector', () => {
    const { span1 } = makeTree()
    expect(span1.matches('.item')).toBe(true)
    expect(span1.matches('#s1')).toBe(true)
    expect(span1.matches('span.item.first')).toBe(true)
  })

  test('false when it does not match', () => {
    const { span1 } = makeTree()
    expect(span1.matches('p')).toBe(false)
    expect(span1.matches('.nested')).toBe(false)
  })

  test('does not consider descendants', () => {
    const { root } = makeTree()
    expect(root.matches('.nested')).toBe(false)
  })
})

describe('closest', () => {
  test('returns the element itself when it matches', () => {
    const { span1 } = makeTree()
    expect(span1.closest('.item')).toBe(span1)
  })

  test('walks up to the nearest matching ancestor', () => {
    const { root, nested } = makeTree()
    expect(nested.closest('.wrap')).toBe(root)
    expect(nested.closest('#root')).toBe(root)
  })

  test('null when no ancestor (or the element itself) matches', () => {
    const { nested } = makeTree()
    expect(nested.closest('.nope')).toBeNull()
  })
})

describe('getElementById', () => {
  test('finds the element anywhere in the document, deep', () => {
    const { document, span2 } = makeTree()
    expect(document.getElementById('s2')).toBe(span2)
  })

  test('null when no element has that id', () => {
    const { document } = makeTree()
    expect(document.getElementById('missing')).toBeNull()
  })

  test('is not available on plain elements', () => {
    const { root } = makeTree()
    expect(typeof root.getElementById).toBe('undefined')
  })

  test('also works on a DocumentFragment (the DOM\'s NonElementParentNode mixin)', () => {
    const fragment = new DocumentFragmentService()
    const item = new HTMLElementService({ tagName: 'span' })
    item.id = 'frag-item'
    fragment.appendChild(item)
    expect(fragment.getElementById('frag-item')).toBe(item)
    expect(fragment.getElementById('missing')).toBeNull()
  })
})

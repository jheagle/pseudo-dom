import { HTMLElementService } from './HTMLElementService'
import { TextService, CommentService } from './NodeService'
import { HTMLCollectionService } from './HTMLCollectionService'

const el = (tagName, attributes = {}) => {
  const element = new HTMLElementService({ tagName })
  Object.keys(attributes).forEach(name => element.setAttribute(name, attributes[name]))
  return element
}

// <div><!-- note -->a<span id="s1">one</span>b<span id="s2" name="two">two</span></div>
const makeMixed = () => {
  const div = el('div')
  const span1 = el('span', { id: 's1' })
  const span2 = el('span', { id: 's2', name: 'two' })
  span1.textContent = 'one'
  span2.textContent = 'two'
  div.appendChild(new CommentService(' note '))
  div.appendChild(new TextService('a'))
  div.appendChild(span1)
  div.appendChild(new TextService('b'))
  div.appendChild(span2)
  return { div, span1, span2 }
}

describe('children (HTMLCollection)', () => {
  test('only counts the element children, not text or comments', () => {
    const { div, span1, span2 } = makeMixed()
    expect(div.children).toBeInstanceOf(HTMLCollectionService)
    expect(div.children.length).toBe(2)
    expect(div.childElementCount).toBe(2)
    expect(Array.from(div.children)).toEqual([span1, span2])
  })

  test('item and namedItem', () => {
    const { div, span1, span2 } = makeMixed()
    expect(div.children.item(0)).toBe(span1)
    expect(div.children.item(1)).toBe(span2)
    expect(div.children.item(2)).toBeNull()
    expect(div.children.namedItem('s1')).toBe(span1)
    expect(div.children.namedItem('two')).toBe(span2)
    expect(div.children.namedItem('missing')).toBeNull()
  })

  test('is live: reflects changes made after it was read', () => {
    const div = el('div')
    const collection = div.children
    expect(collection.length).toBe(0)
    div.appendChild(el('span'))
    expect(collection.length).toBe(1)
  })

  test('an element with no element children has an empty collection', () => {
    const div = el('div')
    div.appendChild(new TextService('only text'))
    expect(div.children.length).toBe(0)
    expect(div.firstElementChild).toBeNull()
    expect(div.lastElementChild).toBeNull()
  })
})

describe('firstElementChild / lastElementChild', () => {
  test('skip text and comments', () => {
    const { div, span1, span2 } = makeMixed()
    expect(div.firstElementChild).toBe(span1)
    expect(div.lastElementChild).toBe(span2)
  })
})

describe('nextElementSibling / previousElementSibling', () => {
  test('skip text and comments between elements', () => {
    const { span1, span2 } = makeMixed()
    expect(span1.nextElementSibling).toBe(span2)
    expect(span2.previousElementSibling).toBe(span1)
  })

  test('are null at the ends', () => {
    const { span1, span2 } = makeMixed()
    expect(span1.previousElementSibling).toBeNull()
    expect(span2.nextElementSibling).toBeNull()
  })

  test('are null for an only child', () => {
    const div = el('div')
    const only = el('span')
    div.appendChild(only)
    expect(only.nextElementSibling).toBeNull()
    expect(only.previousElementSibling).toBeNull()
  })
})

describe('insertAdjacentElement', () => {
  test('beforebegin and afterend insert as siblings', () => {
    const parent = el('div')
    const target = el('target')
    parent.appendChild(target)
    const before = el('before')
    const after = el('after')
    expect(target.insertAdjacentElement('beforebegin', before)).toBe(before)
    expect(target.insertAdjacentElement('afterend', after)).toBe(after)
    expect(Array.from(parent.children)).toEqual([before, target, after])
  })

  test('afterbegin and beforeend insert as this element first / last child', () => {
    const parent = el('div')
    parent.appendChild(el('existing'))
    const first = el('first')
    const last = el('last')
    parent.insertAdjacentElement('afterbegin', first)
    parent.insertAdjacentElement('beforeend', last)
    expect(Array.from(parent.children).map(child => child.tagName)).toEqual(['first', 'existing', 'last'])
  })

  test('beforebegin / afterend return null and do nothing without a parent', () => {
    const alone = el('div')
    expect(alone.insertAdjacentElement('beforebegin', el('x'))).toBeNull()
    expect(alone.insertAdjacentElement('afterend', el('x'))).toBeNull()
  })

  test('throws for an unknown position', () => {
    expect(() => el('div').insertAdjacentElement('nowhere', el('x'))).toThrow('nowhere')
  })
})

describe('insertAdjacentText', () => {
  test('inserts a text node at the position', () => {
    const parent = el('div')
    const target = el('target')
    parent.appendChild(target)
    target.insertAdjacentText('beforebegin', 'hi')
    expect(parent.firstChild.data).toBe('hi')
    target.insertAdjacentText('afterbegin', 'in')
    expect(target.firstChild.data).toBe('in')
  })
})

describe('insertAdjacentHTML', () => {
  test('is not implemented yet', () => {
    expect(() => el('div').insertAdjacentHTML('beforeend', '<span></span>')).toThrow('not implemented')
  })
})

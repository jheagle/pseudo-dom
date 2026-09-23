import { HTMLElementService } from './HTMLElementService'
import { ElementService } from './ElementService'
import { TextService, CommentService } from './NodeService'

const el = (tagName, attributes = {}) => {
  const element = new HTMLElementService({ tagName })
  Object.keys(attributes).forEach(name => element.setAttribute(name, attributes[name]))
  return element
}

describe('innerHTML (getter, serializing)', () => {
  test('serializes text, nested elements and attributes', () => {
    const div = el('div', { id: 'x' })
    const span = el('span', { class: 'a b' })
    span.textContent = 'hi'
    div.appendChild(span)
    expect(div.innerHTML).toBe('<span class="a b">hi</span>')
  })

  test('serializes comments', () => {
    const div = el('div')
    div.appendChild(new CommentService(' note '))
    expect(div.innerHTML).toBe('<!-- note -->')
  })

  test('escapes & < > in text', () => {
    const div = el('div')
    div.appendChild(new TextService('a < b & c > d'))
    expect(div.innerHTML).toBe('a &lt; b &amp; c &gt; d')
  })

  test('escapes & and " in attribute values', () => {
    const div = el('div', { title: 'a "quoted" & tricky' })
    expect(div.innerHTML).toBe('') // no children
    expect(div.outerHTML).toBe('<div title="a &quot;quoted&quot; &amp; tricky"></div>')
  })

  // Real bug found testing against battleship (a downstream consumer): unlike a real DOM, pseudo-dom's setAttribute
  // does not coerce what it is given to a string - a caller can pass a number, boolean, etc. (setAttribute's own
  // type says string, but that is not enforced at runtime in plain JS) and it is stored as-is. Serializing it then
  // crashed with 'x'.replace is not a function instead of just stringifying it.
  test('does not throw when an attribute value is not actually a string, and stringifies it', () => {
    const div = el('div')
    // setAttribute's own type says string, but nothing stops a caller (in plain JS) from passing something else,
    // and pseudo-dom's setAttribute (unlike a real DOM) does not itself coerce it
    div.setAttribute('count', 5)
    div.setAttribute('active', true)
    expect(() => div.outerHTML).not.toThrow()
    expect(div.outerHTML).toBe('<div count="5" active="true"></div>')
  })

  test('does not throw when a text node\'s value is not actually a string', () => {
    const div = el('div')
    const text = new TextService('')
    text.nodeValue = 5
    div.appendChild(text)
    expect(() => div.innerHTML).not.toThrow()
    expect(div.innerHTML).toBe('5')
  })

  test('serializes void elements without a closing tag or children', () => {
    const div = el('div')
    div.appendChild(el('br'))
    div.appendChild(el('img', { src: 'x.png' }))
    expect(div.innerHTML).toBe('<br><img src="x.png">')
  })

  test('never serializes id="" / class="" / the mock layout properties, and className becomes class', () => {
    const div = el('div')
    div.appendChild(el('span'))
    expect(div.innerHTML).toBe('<span></span>')
    const withClass = el('span')
    withClass.className = 'a'
    expect(withClass.outerHTML).toBe('<span class="a"></span>')
  })

  test('serializes style, live from the CSSStyleDeclaration', () => {
    const div = el('div')
    div.style.color = 'red'
    expect(div.outerHTML).toBe('<div style="color: red;"></div>')
  })

  test('a boolean attribute (hidden) serializes bare when true, and is absent when false', () => {
    const div = el('div')
    expect(div.outerHTML).toBe('<div></div>')
    div.hidden = true
    expect(div.outerHTML).toBe('<div hidden></div>')
  })

  test('is empty for an element with no children', () => {
    expect(el('div').innerHTML).toBe('')
  })
})

describe('outerHTML (getter, serializing)', () => {
  test('includes the element itself as well as its children', () => {
    const div = el('div', { id: 'x' })
    div.appendChild(el('span'))
    expect(div.outerHTML).toBe('<div id="x"><span></span></div>')
  })
})

describe('innerHTML (setter, parsing)', () => {
  test('replaces the element\'s children', () => {
    const div = el('div')
    div.appendChild(el('p'))
    div.innerHTML = '<span id="s">hi</span>'
    expect(div.childNodes.length).toBe(1)
    expect(div.firstChild.tagName).toBe('span')
    expect(div.firstChild.id).toBe('s')
    expect(div.firstChild.textContent).toBe('hi')
  })

  test('parses nested elements, text, attributes and comments', () => {
    const div = el('div')
    div.innerHTML = '<ul class="list"><li>one</li><!-- note --><li>two</li></ul>'
    const ul = div.firstChild
    expect(ul.tagName).toBe('ul')
    expect(ul.className).toBe('list')
    expect(Array.from(ul.childNodes).map(node => node.nodeName)).toEqual(['li', '#comment', 'li'])
    expect(ul.firstChild.textContent).toBe('one')
    expect(ul.firstChild.nextSibling.data).toBe(' note ')
  })

  test('a class="..." attribute populates className / classList (not just a generic attribute)', () => {
    const div = el('div')
    div.innerHTML = '<span class="a b"></span>'
    expect(div.firstChild.className).toBe('a b')
    expect(div.firstChild.classList.contains('b')).toBe(true)
  })

  test('a style="..." attribute populates the real style object', () => {
    const div = el('div')
    div.innerHTML = '<span style="color: red;"></span>'
    expect(div.firstChild.style.color).toBe('red')
  })

  test('decodes HTML entities in text', () => {
    const div = el('div')
    div.innerHTML = 'a &amp; b'
    expect(div.textContent).toBe('a & b')
  })

  test('auto-closes void elements without an explicit /', () => {
    const div = el('div')
    div.innerHTML = 'before<br>after'
    expect(Array.from(div.childNodes).map(node => node.nodeName)).toEqual(['#text', 'br', '#text'])
    expect(div.lastChild.data).toBe('after')
  })

  test('multiple top-level siblings all become children', () => {
    const div = el('div')
    div.innerHTML = '<span>a</span><span>b</span>'
    expect(Array.from(div.childNodes).map(node => node.textContent)).toEqual(['a', 'b'])
  })

  test('parsed elements are real HTMLElements (have style, dataset, click, ...)', () => {
    const div = el('div')
    div.innerHTML = '<span></span>'
    const span = div.firstChild
    expect(span).toBeInstanceOf(HTMLElementService)
    span.style.color = 'red'
    expect(span.style.color).toBe('red')
  })

  test('the new nodes belong to the same document as the element', () => {
    const div = el('div')
    div.ownerDocumentStore = { fake: 'document' }
    div.innerHTML = '<span></span>'
    expect(div.firstChild.ownerDocument).toBe(div.ownerDocumentStore)
  })

  test('round-trips through outerHTML', () => {
    const original = el('div', { id: 'x' })
    original.appendChild(el('span', { class: 'a' }))
    const copy = el('div')
    copy.innerHTML = original.innerHTML
    expect(copy.innerHTML).toBe(original.innerHTML)
  })
})

describe('outerHTML (setter, parsing)', () => {
  test('replaces the element itself, in its parent', () => {
    const parent = el('div')
    const target = el('span')
    parent.appendChild(target)
    target.outerHTML = '<p id="new">hi</p>'
    expect(parent.firstChild.tagName).toBe('p')
    expect(parent.firstChild.id).toBe('new')
    expect(parent.firstChild.textContent).toBe('hi')
    expect(target.parentNode).toBeNull()
  })

  test('does nothing when the element has no parent, like replaceWith', () => {
    const alone = el('div')
    expect(() => { alone.outerHTML = '<span></span>' }).not.toThrow()
  })
})

describe('insertAdjacentHTML', () => {
  test('all four positions', () => {
    const parent = el('div')
    const target = el('target')
    parent.appendChild(target)
    target.insertAdjacentHTML('beforebegin', '<before></before>')
    target.insertAdjacentHTML('afterend', '<after></after>')
    target.insertAdjacentHTML('afterbegin', 'start')
    target.insertAdjacentHTML('beforeend', 'end')
    expect(Array.from(parent.children).map(child => child.tagName)).toEqual(['before', 'target', 'after'])
    expect(target.textContent).toBe('startend')
  })

  test('throws for an unknown position', () => {
    expect(() => el('div').insertAdjacentHTML('nowhere', '<span></span>')).toThrow('nowhere')
  })
})

describe('a plain Element (not HTMLElement) has no HTML-parsing setters', () => {
  test('innerHTML / outerHTML can still be read (empty), but not written', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.innerHTML).toBe('')
    expect(div.outerHTML).toBe('<div></div>')
    expect(() => { div.innerHTML = '<span></span>' }).toThrow()
    expect(() => { div.outerHTML = '<span></span>' }).toThrow()
  })

  test('insertAdjacentHTML is not implemented', () => {
    expect(() => new ElementService({ tagName: 'div' }).insertAdjacentHTML('beforeend', '<span></span>')).toThrow('not implemented')
  })
})

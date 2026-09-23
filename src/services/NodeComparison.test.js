import { NodeService, TextService, CommentService } from './NodeService'
import { HTMLElementService } from './HTMLElementService'
import { ElementService } from './ElementService'
import { AttrService } from './AttrService'
import { DocumentFragmentService } from './DocumentFragmentService'
import PseudoHTMLDocument from '../classes/PseudoHTMLDocument'
import { EventService } from './EventService'

const el = (tagName, attributes = {}) => {
  const element = new HTMLElementService({ tagName })
  Object.keys(attributes).forEach(name => element.setAttribute(name, attributes[name]))
  return element
}
const kids = node => Array.from(node.childNodes)

// <ul id="list"><li>one</li><!-- note --><li class="last">two</li></ul>
const makeList = () => {
  const ul = el('ul', { id: 'list' })
  const one = el('li')
  const two = el('li', { class: 'last' })
  one.textContent = 'one'
  two.textContent = 'two'
  ul.appendChild(one)
  ul.appendChild(new CommentService(' note '))
  ul.appendChild(two)
  return { ul, one, two }
}

describe('text and comment nodes', () => {
  test('a text node has data, a length and is a text node', () => {
    const text = new TextService('hello')
    expect([text.nodeType, text.nodeName, text.data, text.nodeValue, text.textContent, text.length]).toEqual([3, '#text', 'hello', 'hello', 'hello', 5])
    text.data = 'bye'
    expect(text.nodeValue).toBe('bye')
    text.textContent = 'again'
    expect(text.data).toBe('again')
    expect(new TextService().data).toBe('')
  })

  test('a comment is like text but is a comment', () => {
    const comment = new CommentService('note')
    expect([comment.nodeType, comment.nodeName, comment.data, comment.length]).toEqual([8, '#comment', 'note', 4])
    comment.textContent = 'other'
    expect(comment.nodeValue).toBe('other')
  })

  test('text and comments cannot have children', () => {
    expect(() => new TextService('a').appendChild(new TextService('b'))).toThrow('cannot have children')
    expect(() => new CommentService('a').insertBefore(new TextService('b'), null)).toThrow('cannot have children')
  })

  test('wholeText joins the text nodes which are next to each other', () => {
    const parent = el('p')
    ;['a', 'b', 'c'].forEach(text => parent.appendChild(new TextService(text)))
    parent.insertBefore(el('b'), parent.lastChild)
    expect(parent.firstChild.wholeText).toBe('ab')
    expect(parent.lastChild.wholeText).toBe('c')
  })

  test('splitText breaks the text in two, putting the rest next to it', () => {
    const parent = el('p')
    const text = new TextService('hello world')
    parent.appendChild(text)
    const rest = text.splitText(5)
    expect(text.data).toBe('hello')
    expect(rest.data).toBe(' world')
    expect(kids(parent)).toEqual([text, rest])
    expect(new TextService('abc').splitText(3).data).toBe('')
    expect(() => text.splitText(6)).toThrow('beyond')
  })
})

describe('textContent', () => {
  test('is the text of everything below, without comments', () => {
    const { ul } = makeList()
    expect(ul.textContent).toBe('onetwo')
    expect(el('div').textContent).toBe('')
  })

  test('setting it replaces the children with a single text node', () => {
    const { ul, one } = makeList()
    ul.textContent = 'plain'
    expect(kids(ul).length).toBe(1)
    expect(ul.firstChild.nodeType).toBe(NodeService.TEXT_NODE)
    expect(ul.textContent).toBe('plain')
    expect(one.parentNode).toBeNull()
    ul.textContent = ''
    expect(ul.hasChildNodes()).toBe(false)
    ul.textContent = null
    expect(ul.hasChildNodes()).toBe(false)
  })

  test('an attribute has its value as its text, a document has none', () => {
    const attr = new AttrService('title', 'hi')
    expect([attr.nodeValue, attr.textContent]).toEqual(['hi', 'hi'])
    attr.textContent = 'there'
    expect(attr.value).toBe('there')
    const document = new PseudoHTMLDocument()
    expect(document.textContent).toBeNull()
    document.textContent = 'ignored'
    expect(document.firstChild.tagName).toBe('html')
  })
})

describe('cloneNode', () => {
  test('a shallow copy of an element has the tag and the attributes but no children, parent or listeners', () => {
    const { ul } = makeList()
    const parent = el('div')
    parent.appendChild(ul)
    let heard = 0
    ul.addEventListener('click', () => heard++)
    const copy = ul.cloneNode()
    expect(copy).not.toBe(ul)
    expect(copy).toBeInstanceOf(HTMLElementService)
    expect(copy.tagName).toBe('ul')
    expect(copy.getAttribute('id')).toBe('list')
    expect(copy.id).toBe('list')
    expect(copy.hasChildNodes()).toBe(false)
    expect(copy.parentNode).toBeNull()
    copy.dispatchEvent(new EventService('click'))
    expect(heard).toBe(0)
  })

  test('a deep copy has copies of everything below', () => {
    const { ul, one, two } = makeList()
    const copy = ul.cloneNode(true)
    expect(kids(copy).map(node => node.nodeName)).toEqual(['li', '#comment', 'li'])
    expect(copy.firstChild).not.toBe(one)
    expect(copy.lastChild).not.toBe(two)
    expect(copy.textContent).toBe('onetwo')
    expect(copy.lastChild.parentNode).toBe(copy)
    expect(copy.lastChild.getAttribute('class')).toBe('last')
    expect(copy.firstChild.nextSibling.data).toBe(' note ')
  })

  test('changing the copy does not change the original', () => {
    const { ul } = makeList()
    const copy = ul.cloneNode(true)
    copy.setAttribute('id', 'other')
    copy.firstChild.textContent = 'changed'
    copy.firstChild.style.color = 'red'
    expect(ul.getAttribute('id')).toBe('list')
    expect(ul.firstChild.textContent).toBe('one')
    // Like a real CSSStyleDeclaration, an unset property is '' rather than undefined
    expect(ul.firstChild.style.color).toBe('')
  })

  test('the copy of the children has its own class list and attribute objects', () => {
    const button = el('button')
    button.className = 'one two'
    const copy = button.cloneNode()
    copy.classList.add('three')
    expect(copy.className).toBe('one two three')
    expect(button.className).toBe('one two')
    expect(copy.style).not.toBe(button.style)
  })

  test('text, comments, attributes and fragments can be cloned', () => {
    const text = new TextService('t')
    expect(text.cloneNode().data).toBe('t')
    expect(text.cloneNode()).not.toBe(text)
    expect(new CommentService('c').cloneNode().data).toBe('c')
    const attr = new AttrService('title', 'hi', null, 'ns', 'p')
    const attrCopy = attr.cloneNode()
    expect([attrCopy.localName, attrCopy.value, attrCopy.namespaceURI, attrCopy.prefix]).toEqual(['title', 'hi', 'ns', 'p'])
    const fragment = new DocumentFragmentService()
    fragment.appendChild(el('a'))
    expect(fragment.cloneNode().hasChildNodes()).toBe(false)
    expect(fragment.cloneNode(true).firstChild.tagName).toBe('a')
    expect(fragment.cloneNode(true).nodeType).toBe(NodeService.DOCUMENT_FRAGMENT_NODE)
  })

  test('a copied button still submits its form when it is clicked', () => {
    const form = el('form')
    const button = el('button')
    form.appendChild(button)
    const copy = form.cloneNode(true)
    let submitted = 0
    copy.addEventListener('submit', () => submitted++)
    copy.firstChild.click()
    expect(submitted).toBe(1)
  })

  test('a document can be cloned, deeply or not', () => {
    const document = new PseudoHTMLDocument()
    document.firstChild.lastChild.appendChild(el('p'))
    const shallow = document.cloneNode()
    expect(shallow.nodeType).toBe(NodeService.DOCUMENT_NODE)
    expect(shallow.hasChildNodes()).toBe(false)
    const deep = document.cloneNode(true)
    expect(deep).not.toBe(document)
    expect(deep.firstChild).not.toBe(document.firstChild)
    expect(deep.isEqualNode(document)).toBe(true)
    expect(deep.firstChild.lastChild.firstChild.tagName).toBe('p')
  })
})

describe('isEqualNode', () => {
  test('a copy equals the original, and different nodes do not', () => {
    const { ul } = makeList()
    expect(ul.isEqualNode(ul.cloneNode(true))).toBe(true)
    expect(ul.isEqualNode(ul)).toBe(true)
    expect(ul.isEqualNode(makeList().ul)).toBe(true)
    expect(ul.isEqualNode(null)).toBe(false)
    expect(ul.isEqualNode(new TextService('x'))).toBe(false)
  })

  test('the children matter, in order and in number', () => {
    const { ul } = makeList()
    const fewer = ul.cloneNode(true)
    fewer.removeChild(fewer.lastChild)
    expect(ul.isEqualNode(fewer)).toBe(false)
    const swapped = ul.cloneNode(true)
    swapped.appendChild(swapped.firstChild)
    expect(ul.isEqualNode(swapped)).toBe(false)
    const changed = ul.cloneNode(true)
    changed.firstChild.textContent = 'different'
    expect(ul.isEqualNode(changed)).toBe(false)
  })

  test('the tag and the attributes matter, but not the order they were set in', () => {
    const first = el('div', { a: '1', b: '2' })
    const second = el('div', { b: '2', a: '1' })
    expect(first.isEqualNode(second)).toBe(true)
    expect(first.isEqualNode(el('span', { a: '1', b: '2' }))).toBe(false)
    expect(first.isEqualNode(el('div', { a: '1' }))).toBe(false)
    expect(first.isEqualNode(el('div', { a: '1', b: '3' }))).toBe(false)
  })

  test('attributes whose values are objects are compared by what they hold', () => {
    const first = el('div')
    const second = el('div')
    first.style.color = 'red'
    second.style.color = 'red'
    expect(first.isEqualNode(second)).toBe(true)
    second.style.color = 'blue'
    expect(first.isEqualNode(second)).toBe(false)
  })

  test('text and comments compare their data', () => {
    expect(new TextService('a').isEqualNode(new TextService('a'))).toBe(true)
    expect(new TextService('a').isEqualNode(new TextService('b'))).toBe(false)
    expect(new CommentService('a').isEqualNode(new TextService('a'))).toBe(false)
    expect(new AttrService('t', 'v').isEqualNode(new AttrService('t', 'v'))).toBe(true)
    expect(new AttrService('t', 'v').isEqualNode(new AttrService('t', 'w'))).toBe(false)
  })
})

describe('compareDocumentPosition', () => {
  const makeTree = () => {
    const root = el('div')
    const a = el('section')
    const b = el('section')
    const a1 = el('p')
    const a2 = el('p')
    const b1 = el('p')
    root.appendChild(a)
    root.appendChild(b)
    a.appendChild(a1)
    a.appendChild(a2)
    b.appendChild(b1)
    return { root, a, b, a1, a2, b1 }
  }
  const { DOCUMENT_POSITION_DISCONNECTED: DISCONNECTED, DOCUMENT_POSITION_PRECEDING: PRECEDING, DOCUMENT_POSITION_FOLLOWING: FOLLOWING, DOCUMENT_POSITION_CONTAINS: CONTAINS, DOCUMENT_POSITION_CONTAINED_BY: CONTAINED_BY, DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: SPECIFIC } = NodeService

  test('is 0 for the same node', () => {
    const { a } = makeTree()
    expect(a.compareDocumentPosition(a)).toBe(0)
  })

  test('says when the other node is an ancestor or a descendant', () => {
    const { root, a, a1 } = makeTree()
    expect(a1.compareDocumentPosition(root)).toBe(CONTAINS | PRECEDING)
    expect(a1.compareDocumentPosition(a)).toBe(CONTAINS | PRECEDING)
    expect(root.compareDocumentPosition(a1)).toBe(CONTAINED_BY | FOLLOWING)
    expect(a.compareDocumentPosition(a1)).toBe(CONTAINED_BY | FOLLOWING)
  })

  test('says whether the other node comes before or after, siblings and cousins', () => {
    const { a, b, a1, a2, b1 } = makeTree()
    expect(a1.compareDocumentPosition(a2)).toBe(FOLLOWING)
    expect(a2.compareDocumentPosition(a1)).toBe(PRECEDING)
    expect(a.compareDocumentPosition(b)).toBe(FOLLOWING)
    expect(a1.compareDocumentPosition(b1)).toBe(FOLLOWING)
    expect(b1.compareDocumentPosition(a2)).toBe(PRECEDING)
    expect(a2.compareDocumentPosition(b)).toBe(FOLLOWING)
  })

  test('nodes in different trees are disconnected, with a consistent order', () => {
    const { a } = makeTree()
    const other = makeTree().b
    const forward = a.compareDocumentPosition(other)
    const backward = other.compareDocumentPosition(a)
    expect(forward & DISCONNECTED).toBe(DISCONNECTED)
    expect(forward & SPECIFIC).toBe(SPECIFIC)
    expect(backward & DISCONNECTED).toBe(DISCONNECTED)
    expect([forward & (PRECEDING | FOLLOWING), backward & (PRECEDING | FOLLOWING)].sort()).toEqual([PRECEDING, FOLLOWING].sort())
    expect(a.compareDocumentPosition(other)).toBe(forward)
  })
})

describe('isConnected and ownerDocument', () => {
  test('a node is connected when the tree it is in has a document at the top', () => {
    const document = new PseudoHTMLDocument()
    const body = document.firstChild.lastChild
    const div = document.createElement('div')
    expect(div.isConnected).toBe(false)
    body.appendChild(div)
    expect(div.isConnected).toBe(true)
    expect(document.isConnected).toBe(true)
    body.removeChild(div)
    expect(div.isConnected).toBe(false)
    const detached = el('div')
    detached.appendChild(el('p'))
    expect(detached.firstChild.isConnected).toBe(false)
  })

  test('the owner document is the one which made the node, and the one it is in', () => {
    const document = new PseudoHTMLDocument()
    const div = document.createElement('div')
    expect(div.ownerDocument).toBe(document)
    expect(document.createTextNode('t').ownerDocument).toBe(document)
    expect(document.createComment('c').ownerDocument).toBe(document)
    expect(document.createDocumentFragment().ownerDocument).toBe(document)
    expect(document.ownerDocument).toBeNull()
    expect(document.firstChild.ownerDocument).toBe(document)
    expect(el('div').ownerDocument).toBeNull()
  })

  test('a copy stays with the document its original belongs to', () => {
    const document = new PseudoHTMLDocument()
    expect(document.createElement('div').cloneNode().ownerDocument).toBe(document)
    expect(document.createTextNode('t').cloneNode().ownerDocument).toBe(document)
  })

  test('the document is a document node with a name, and makes text, comments and fragments', () => {
    const document = new PseudoHTMLDocument()
    expect([document.nodeType, document.nodeName]).toEqual([NodeService.DOCUMENT_NODE, '#document'])
    expect(document.createTextNode('hi').data).toBe('hi')
    expect(document.createComment('note').data).toBe('note')
    expect(document.createDocumentFragment().nodeType).toBe(NodeService.DOCUMENT_FRAGMENT_NODE)
    expect(document.firstChild.parentElement).toBeNull()
    expect(document.firstChild.lastChild.parentElement).toBe(document.firstChild)
  })
})

describe('normalize', () => {
  test('joins the text nodes which are next to each other and removes the empty ones', () => {
    const p = el('p')
    ;['a', '', 'b'].forEach(text => p.appendChild(new TextService(text)))
    p.appendChild(el('b'))
    p.appendChild(new TextService(''))
    p.appendChild(new TextService('c'))
    p.appendChild(new TextService('d'))
    p.normalize()
    expect(kids(p).map(node => node.nodeName)).toEqual(['#text', 'b', '#text'])
    expect(p.firstChild.data).toBe('ab')
    expect(p.lastChild.data).toBe('cd')
  })

  test('tidies the text of everything below too, and leaves comments and elements alone', () => {
    const outer = el('div')
    const inner = el('span')
    outer.appendChild(inner)
    outer.appendChild(new CommentService('note'))
    inner.appendChild(new TextService('x'))
    inner.appendChild(new TextService('y'))
    outer.normalize()
    expect(inner.childNodes.length).toBe(1)
    expect(inner.firstChild.data).toBe('xy')
    expect(outer.lastChild.data).toBe('note')
  })

  test('a node with nothing to tidy is left as it is', () => {
    const { ul } = makeList()
    const before = ul.cloneNode(true)
    ul.normalize()
    expect(ul.isEqualNode(before)).toBe(true)
  })

  test('an element made with a plain ElementService can be compared too', () => {
    const first = new ElementService({ tagName: 'div', attributes: [{ name: 'data-x', value: '1' }] })
    const second = new ElementService({ tagName: 'div', attributes: [{ name: 'data-x', value: '1' }] })
    expect(first.isEqualNode(second)).toBe(true)
    expect(first.cloneNode().isEqualNode(first)).toBe(true)
  })
})

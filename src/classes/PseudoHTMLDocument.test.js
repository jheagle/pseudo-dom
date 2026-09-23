import PseudoHTMLDocument from './PseudoHTMLDocument'

describe('PseudoHTMLDocument', () => {
  test('has an html element in it with the head and the body in that', () => {
    const document = new PseudoHTMLDocument()
    const html = document.firstChild
    expect(html.tagName).toBe('html')
    expect(html.parentNode).toBe(document)
    expect(Array.from(html.childNodes).map(node => node.tagName)).toEqual(['head', 'body'])
    const [head, body] = Array.from(html.childNodes)
    expect(head.parentNode).toBe(html)
    expect(head.nextSibling).toBe(body)
    expect(body.previousSibling).toBe(head)
    expect(body.getRootNode()).toBe(document)
  })

  test('createElement makes an element which is not in the document until it is appended', () => {
    const document = new PseudoHTMLDocument()
    const div = document.createElement('div')
    expect(div.tagName).toBe('div')
    expect(div.parentNode).toBeNull()
    const body = document.firstChild.lastChild
    body.appendChild(div)
    expect(div.parentNode).toBe(body)
    expect(div.getRootNode()).toBe(document)
  })

  test('the auto-created html, head and body belong to the document', () => {
    const document = new PseudoHTMLDocument()
    const html = document.firstChild
    expect(html.ownerDocument).toBe(document)
    expect(document.head.ownerDocument).toBe(document)
    expect(document.body.ownerDocument).toBe(document)
  })

  test('getElementById finds an element anywhere in the document (the real bug this class had: it did not extend DocumentService, so getElementById was unreachable)', () => {
    const document = new PseudoHTMLDocument()
    const div = document.createElement('div')
    div.id = 'target'
    document.body.appendChild(div)
    expect(document.getElementById('target')).toBe(div)
    expect(document.getElementById('missing')).toBeNull()
  })

  test('createTextNode / createComment / createDocumentFragment belong to the document', () => {
    const document = new PseudoHTMLDocument()
    const text = document.createTextNode('hi')
    const comment = document.createComment('note')
    const fragment = document.createDocumentFragment()
    expect(text.ownerDocument).toBe(document)
    expect(comment.ownerDocument).toBe(document)
    expect(fragment.ownerDocument).toBe(document)
  })

  test('a document does not have Element-only members (it is not an Element, unlike before)', () => {
    const document = new PseudoHTMLDocument()
    expect(document.tagName).toBeUndefined()
    expect(document.id).toBeUndefined()
    expect(document.className).toBeUndefined()
    expect(document.classList).toBeUndefined()
    expect(document.attributes).toBeUndefined()
    expect(typeof document.matches).toBe('undefined')
    expect(typeof document.closest).toBe('undefined')
  })
})

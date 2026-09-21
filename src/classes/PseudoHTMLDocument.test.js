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
})

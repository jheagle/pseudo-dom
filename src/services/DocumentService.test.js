import { DocumentService } from './DocumentService'
import { HTMLElementService } from './HTMLElementService'
import { TextService, CommentService } from './NodeService'
import { DocumentFragmentService } from './DocumentFragmentService'

describe('DocumentService', () => {
  test('nodeName / nodeType', () => {
    const document = new DocumentService()
    expect(document.nodeName).toBe('#document')
    expect(document.nodeType).toBe(DocumentService.DOCUMENT_NODE)
  })

  test('textContent is always null, and setting it does nothing (a document has no text of its own)', () => {
    const document = new DocumentService()
    document.textContent = 'ignored'
    expect(document.textContent).toBeNull()
  })

  test('createElement makes an HTMLElement which belongs to the document but has no parent yet', () => {
    const document = new DocumentService()
    const div = document.createElement('div')
    expect(div).toBeInstanceOf(HTMLElementService)
    expect(div.tagName).toBe('div')
    expect(div.parentNode).toBeNull()
    expect(div.ownerDocument).toBe(document)
  })

  test('createElement defaults to a div', () => {
    expect(new DocumentService().createElement().tagName).toBe('div')
  })

  test('createTextNode / createComment / createDocumentFragment belong to the document', () => {
    const document = new DocumentService()
    const text = document.createTextNode('hi')
    const comment = document.createComment('note')
    const fragment = document.createDocumentFragment()
    expect(text).toBeInstanceOf(TextService)
    expect(text.nodeValue).toBe('hi')
    expect(text.ownerDocument).toBe(document)
    expect(comment).toBeInstanceOf(CommentService)
    expect(comment.nodeValue).toBe('note')
    expect(comment.ownerDocument).toBe(document)
    expect(fragment).toBeInstanceOf(DocumentFragmentService)
    expect(fragment.ownerDocument).toBe(document)
  })

  test('getElementById finds an element added below it', () => {
    const document = new DocumentService()
    const div = document.createElement('div')
    div.id = 'target'
    document.appendChild(div)
    expect(document.getElementById('target')).toBe(div)
    expect(document.getElementById('missing')).toBeNull()
  })
})

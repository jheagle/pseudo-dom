import { HTMLElementService } from '../services/HTMLElementService'
import { TextService, CommentService } from '../services/NodeService'
import { prettyPrint } from './serializeHTML'
import logElement from './logElement'

const el = (tagName, attributes = {}) => {
  const element = new HTMLElementService({ tagName })
  Object.keys(attributes).forEach(name => element.setAttribute(name, attributes[name]))
  return element
}

describe('prettyPrint', () => {
  test('a leaf element is one line', () => {
    expect(prettyPrint(el('br'))).toBe('<br>')
  })

  test('an empty element is one line', () => {
    expect(prettyPrint(el('div'))).toBe('<div></div>')
  })

  test('an element with a text child is two lines, indented', () => {
    const div = el('div')
    div.textContent = 'hi'
    expect(prettyPrint(div)).toBe('<div>\n  hi\n</div>')
  })

  test('nested elements indent one level per level of nesting', () => {
    const outer = el('div', { id: 'x' })
    const inner = el('span')
    inner.textContent = 'hi'
    outer.appendChild(inner)
    expect(prettyPrint(outer)).toBe('<div id="x">\n  <span>\n    hi\n  </span>\n</div>')
  })

  test('a custom indent string is used instead of the default two spaces', () => {
    const outer = el('div')
    outer.appendChild(el('span'))
    expect(prettyPrint(outer, '> ')).toBe('<div>\n> <span></span>\n</div>')
  })

  test('comments and multiple children each get their own line', () => {
    const div = el('div')
    div.appendChild(el('span'))
    div.appendChild(new CommentService('note'))
    expect(prettyPrint(div)).toBe('<div>\n  <span></span>\n  <!--note-->\n</div>')
  })

  test('whitespace-only text nodes are skipped, not left as empty lines', () => {
    const div = el('div')
    div.appendChild(new TextService('  \n  '))
    div.appendChild(el('span'))
    expect(prettyPrint(div)).toBe('<div>\n  <span></span>\n</div>')
  })
})

describe('logElement', () => {
  test('logs the pretty-printed markup to the console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const div = el('div')
    div.appendChild(el('span'))
    logElement(div)
    expect(spy).toHaveBeenCalledWith('<div>\n  <span></span>\n</div>')
    spy.mockRestore()
  })

  test('prefixes a label when one is given', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    logElement(el('br'), 'after move')
    expect(spy).toHaveBeenCalledWith('after move\n<br>')
    spy.mockRestore()
  })
})

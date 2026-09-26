/**
 * Parses an HTML string into pseudo-dom nodes, for innerHTML / outerHTML / insertAdjacentHTML. Built on
 * htmlparser2's Parser (a SAX-style tokenizer) with a custom handler which builds pseudo-dom nodes directly -
 * htmlparser2's own default DomHandler / domutils tree (which this never uses) is stubbed out of the browser bundle
 * by the browser.ignore config, the same way css-select's unused default adapter already is.
 *
 * The class to build parsed elements with is given by the caller (rather than imported here) so this has no
 * dependency on ElementService / HTMLElementService - importing either here, from a factory ElementService itself
 * would need to call, would create an import cycle.
 */
import { Parser } from 'htmlparser2'
import { TextService, CommentService } from '../services/NodeService'

/**
 * Parse an HTML string into the nodes it describes (siblings at the top level, exactly like the DOM's own HTML
 * parsing does for innerHTML / insertAdjacentHTML - there is no single root unless the markup itself has one).
 * @param html
 * @param ownerDocument The document the new nodes belong to (matches what innerHTML etc. would set), or null
 * @param ElementClass The class to build each parsed element with
 */
const parseHTML = (html: string, ownerDocument: any, ElementClass: new (options: { tagName: string }) => any): Array<any> => {
  const roots: Array<any> = []
  const stack: Array<any> = []

  const appendNode = (node: any): void => {
    node.ownerDocumentStore = ownerDocument
    if (stack.length) {
      stack[stack.length - 1].appendChild(node)
    } else {
      roots.push(node)
    }
  }

  const parser: Parser = new Parser({
    onopentagname (name: string): void {
      const element: any = new ElementClass({ tagName: name })
      appendNode(element)
      stack.push(element)
    },
    onattribute (name: string, value: string): void {
      if (!stack.length) {
        return
      }
      const element: any = stack[stack.length - 1]
      // pseudo-dom's className / classList and style are not kept in sync with a literal 'class' / 'style'
      // attribute the way setAttribute usually is (there is no such special-casing here, unlike a real DOM) - route
      // them to the real objects directly, the same way cssSelectAdapter does for reading 'class' when matching a
      // CSS selector, so parsed markup's class="..." / style="..." actually populates className/classList and style.
      if (name === 'class') {
        element.className = value
        return
      }
      if (name === 'style' && element.style) {
        element.style.cssText = value
        return
      }
      element.setAttribute(name, value)
    },
    ontext (text: string): void {
      appendNode(new TextService(text))
    },
    oncomment (data: string): void {
      appendNode(new CommentService(data))
    },
    onclosetag (): void {
      stack.pop()
    }
  }, { lowerCaseTags: true, lowerCaseAttributeNames: true })
  parser.write(String(html || ''))
  parser.end()
  return roots
}

export default parseHTML

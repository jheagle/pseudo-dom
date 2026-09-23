'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
/**
 * @file Parses an HTML string into pseudo-dom nodes, for innerHTML / outerHTML / insertAdjacentHTML. Built on
 * htmlparser2's Parser (a SAX-style tokenizer) with a custom handler which builds pseudo-dom nodes directly -
 * htmlparser2's own default DomHandler / domutils tree (which this never uses) is stubbed out of the browser bundle
 * by the browser.ignore config, the same way css-select's unused default adapter already is.
 *
 * The class to build parsed elements with is given by the caller (rather than imported here) so this has no
 * dependency on ElementService / HTMLElementService - importing either here, from a factory ElementService itself
 * would need to call, would create an import cycle.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const htmlparser2_1 = require('htmlparser2')
const NodeService_1 = require('../services/NodeService')
/**
 * Parse an HTML string into the nodes it describes (siblings at the top level, exactly like the DOM's own HTML
 * parsing does for innerHTML / insertAdjacentHTML - there is no single root unless the markup itself has one).
 * @memberOf module:factories
 * @param {string} html
 * @param {*} ownerDocument The document the new nodes belong to (matches what innerHTML etc. would set), or null
 * @param {function(new: *, {tagName: string})} ElementClass The class to build each parsed element with
 * @returns {Array<*>}
 */
const parseHTML = (html, ownerDocument, ElementClass) => {
  const roots = []
  const stack = []
  const appendNode = node => {
    node.ownerDocumentStore = ownerDocument
    if (stack.length) {
      stack[stack.length - 1].appendChild(node)
    } else {
      roots.push(node)
    }
  }
  const parser = new htmlparser2_1.Parser({
    onopentagname (name) {
      const element = new ElementClass({
        tagName: name
      })
      appendNode(element)
      stack.push(element)
    },
    onattribute (name, value) {
      if (!stack.length) {
        return
      }
      const element = stack[stack.length - 1]
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
    ontext (text) {
      appendNode(new NodeService_1.TextService(text))
    },
    oncomment (data) {
      appendNode(new NodeService_1.CommentService(data))
    },
    onclosetag () {
      stack.pop()
    }
  }, {
    lowerCaseTags: true,
    lowerCaseAttributeNames: true
  })
  parser.write(String(html || ''))
  parser.end()
  return roots
}
exports.default = parseHTML

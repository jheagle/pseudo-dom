/**
 * @file Serializes pseudo-dom nodes back into an HTML string, for innerHTML / outerHTML.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { NodeService } from '../services/NodeService'

// Void elements are self-closing and never serialize a closing tag or children (there is no HTML parsing of their
// content either - the DOM never lets them have children in the first place).
const VOID_ELEMENTS: Set<string> = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])

// These property-backed names (see ElementService / HTMLElementService's constructors) are not real HTML content
// attributes - offsetWidth and friends describe layout, which does not exist here, and innerHTML is JS-only - so
// they must never appear in serialized markup, however getAttributeNames() may report them.
const NEVER_SERIALIZE: Set<string> = new Set([
  'innerHTML',
  'clientHeight', 'clientLeft', 'clientTop', 'clientWidth',
  'scrollHeight', 'scrollLeft', 'scrollTop', 'scrollWidth',
  'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth'
])

// The attribute name to serialize a property-backed name as, when it differs from the property name
const ATTRIBUTE_NAME: { [property: string]: string } = { className: 'class' }

// Boolean HTML attributes: present (with no value) when true, absent entirely when false
const BOOLEAN_ATTRIBUTES: Set<string> = new Set(['hidden'])

/**
 * Escape text so it is safe inside HTML text content.
 * @param {string} text
 * @returns {string}
 */
const escapeText = (text: string): string => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

/**
 * Escape a value so it is safe inside a double-quoted HTML attribute.
 * @param {string} value
 * @returns {string}
 */
const escapeAttributeValue = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')

/**
 * Every attribute of the element, serialized (class instead of className, boolean attributes bare, the never-real
 * mock properties left out, style added from the live CSSStyleDeclaration when it is not empty).
 * @param {*} element
 * @returns {string}
 */
const serializeAttributes = (element: any): string => {
  let result: string = (element.getAttributeNames ? element.getAttributeNames() : [])
    .filter((name: string) => !NEVER_SERIALIZE.has(name))
    .map((name: string): string => {
      if (BOOLEAN_ATTRIBUTES.has(name)) {
        return element[name] ? ` ${name}` : ''
      }
      const value: string = element.getAttribute(name)
      return value === '' ? '' : ` ${ATTRIBUTE_NAME[name] || name}="${escapeAttributeValue(value)}"`
    })
    .join('')
  const style: any = element.style
  if (style && style.cssText) {
    result += ` style="${escapeAttributeValue(style.cssText)}"`
  }
  return result
}

/**
 * One node, serialized (its own markup only - see serializeChildren for its descendants too).
 * @param {*} node
 * @returns {string}
 */
const serializeNode = (node: any): string => {
  if (node.nodeType === NodeService.TEXT_NODE) {
    return escapeText(node.nodeValue || '')
  }
  if (node.nodeType === NodeService.COMMENT_NODE) {
    return `<!--${node.nodeValue || ''}-->`
  }
  if (node.nodeType !== NodeService.ELEMENT_NODE) {
    return ''
  }
  const tagName: string = node.tagName
  const attributes: string = serializeAttributes(node)
  if (VOID_ELEMENTS.has(tagName)) {
    return `<${tagName}${attributes}>`
  }
  return `<${tagName}${attributes}>${serializeChildren(node)}</${tagName}>`
}

/**
 * A node's children, serialized in order (this is what innerHTML returns).
 * @memberOf module:factories
 * @param {*} node
 * @returns {string}
 */
const serializeChildren = (node: any): string => Array.from(node.childNodes).map(serializeNode).join('')

/**
 * An element itself, serialized with its children (this is what outerHTML returns).
 * @memberOf module:factories
 * @param {*} element
 * @returns {string}
 */
const serializeOuter = (element: any): string => serializeNode(element)

/**
 * One node, indented for readability (see prettyPrint) - unlike serializeNode, every non-empty node is its own
 * line, so the structure of a whole tree is easy to read at a glance.
 * @param {*} node
 * @param {number} depth
 * @param {string} indent
 * @returns {string}
 */
const prettyPrintNode = (node: any, depth: number, indent: string): string => {
  const pad: string = indent.repeat(depth)
  if (node.nodeType === NodeService.TEXT_NODE) {
    const text: string = escapeText((node.nodeValue || '').trim())
    return text ? `${pad}${text}` : ''
  }
  if (node.nodeType === NodeService.COMMENT_NODE) {
    return `${pad}<!--${node.nodeValue || ''}-->`
  }
  if (node.nodeType !== NodeService.ELEMENT_NODE) {
    return ''
  }
  const tagName: string = node.tagName
  const attributes: string = serializeAttributes(node)
  if (VOID_ELEMENTS.has(tagName)) {
    return `${pad}<${tagName}${attributes}>`
  }
  const children: Array<string> = Array.from(node.childNodes)
    .map((child: any): string => prettyPrintNode(child, depth + 1, indent))
    .filter((line: string): boolean => line !== '')
  if (children.length === 0) {
    return `${pad}<${tagName}${attributes}></${tagName}>`
  }
  return `${pad}<${tagName}${attributes}>\n${children.join('\n')}\n${pad}</${tagName}>`
}

/**
 * A node's markup, indented one level per level of nesting - a real DOM's outerHTML / innerHTML has no line breaks
 * at all, which does not read well for a whole tree (a board full of cells, say). Useful for watching pseudo-dom-
 * driven code run headlessly, printed to a terminal - see also logElement, which does the printing too.
 * @memberOf module:factories
 * @param {*} node
 * @param {string} [indent='  '] The indentation used per level of nesting
 * @returns {string}
 */
const prettyPrint = (node: any, indent: string = '  '): string => prettyPrintNode(node, 0, indent)

export { serializeChildren, serializeOuter, prettyPrint }

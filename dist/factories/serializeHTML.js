'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
require('core-js/modules/esnext.iterator.map.js')
require('core-js/modules/esnext.set.add-all.js')
require('core-js/modules/esnext.set.delete-all.js')
require('core-js/modules/esnext.set.difference.js')
require('core-js/modules/esnext.set.every.js')
require('core-js/modules/esnext.set.filter.js')
require('core-js/modules/esnext.set.find.js')
require('core-js/modules/esnext.set.intersection.js')
require('core-js/modules/esnext.set.is-disjoint-from.js')
require('core-js/modules/esnext.set.is-subset-of.js')
require('core-js/modules/esnext.set.is-superset-of.js')
require('core-js/modules/esnext.set.join.js')
require('core-js/modules/esnext.set.map.js')
require('core-js/modules/esnext.set.reduce.js')
require('core-js/modules/esnext.set.some.js')
require('core-js/modules/esnext.set.symmetric-difference.js')
require('core-js/modules/esnext.set.union.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.prettyPrint = exports.serializeOuter = exports.serializeChildren = void 0
/**
 * @file Serializes pseudo-dom nodes back into an HTML string, for innerHTML / outerHTML.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const NodeService_1 = require('../services/NodeService')
// Void elements are self-closing and never serialize a closing tag or children (there is no HTML parsing of their
// content either - the DOM never lets them have children in the first place).
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
// These property-backed names (see ElementService / HTMLElementService's constructors) are not real HTML content
// attributes - offsetWidth and friends describe layout, which does not exist here, and innerHTML is JS-only - so
// they must never appear in serialized markup, however getAttributeNames() may report them.
const NEVER_SERIALIZE = new Set(['innerHTML', 'clientHeight', 'clientLeft', 'clientTop', 'clientWidth', 'scrollHeight', 'scrollLeft', 'scrollTop', 'scrollWidth', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth'])
// The attribute name to serialize a property-backed name as, when it differs from the property name
const ATTRIBUTE_NAME = {
  className: 'class'
}
// Boolean HTML attributes: present (with no value) when true, absent entirely when false
const BOOLEAN_ATTRIBUTES = new Set(['hidden'])
/**
 * Escape text so it is safe inside HTML text content. Coerces to a string first - unlike a real DOM, pseudo-dom's
 * setAttribute does not itself coerce (see the same note on escapeAttributeValue), and nodeValue is not guaranteed
 * to be a string either.
 * @param {*} text
 * @returns {string}
 */
const escapeText = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
/**
 * Escape a value so it is safe inside a double-quoted HTML attribute. Coerces to a string first: a real DOM's
 * setAttribute always stores a string, however pseudo-dom's does not coerce what it is given, so a value set via
 * setAttribute(name, 5) is stored (and read back by getAttribute) as the number 5, not the string '5'.
 * @param {*} value
 * @returns {string}
 */
const escapeAttributeValue = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
/**
 * Every attribute of the element, serialized (class instead of className, boolean attributes bare, the never-real
 * mock properties left out, style added from the live CSSStyleDeclaration when it is not empty).
 * @param {*} element
 * @returns {string}
 */
const serializeAttributes = element => {
  let result = (element.getAttributeNames ? element.getAttributeNames() : []).filter(name => !NEVER_SERIALIZE.has(name)).map(name => {
    if (BOOLEAN_ATTRIBUTES.has(name)) {
      return element[name] ? ` ${name}` : ''
    }
    const value = element.getAttribute(name)
    return value === '' ? '' : ` ${ATTRIBUTE_NAME[name] || name}="${escapeAttributeValue(value)}"`
  }).join('')
  const style = element.style
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
const serializeNode = node => {
  if (node.nodeType === NodeService_1.NodeService.TEXT_NODE) {
    return escapeText(node.nodeValue || '')
  }
  if (node.nodeType === NodeService_1.NodeService.COMMENT_NODE) {
    return `<!--${node.nodeValue || ''}-->`
  }
  if (node.nodeType !== NodeService_1.NodeService.ELEMENT_NODE) {
    return ''
  }
  const tagName = node.tagName
  const attributes = serializeAttributes(node)
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
const serializeChildren = node => Array.from(node.childNodes).map(serializeNode).join('')
exports.serializeChildren = serializeChildren
/**
 * An element itself, serialized with its children (this is what outerHTML returns).
 * @memberOf module:factories
 * @param {*} element
 * @returns {string}
 */
const serializeOuter = element => serializeNode(element)
exports.serializeOuter = serializeOuter
/**
 * One node, indented for readability (see prettyPrint) - unlike serializeNode, every non-empty node is its own
 * line, so the structure of a whole tree is easy to read at a glance.
 * @param {*} node
 * @param {number} depth
 * @param {string} indent
 * @returns {string}
 */
const prettyPrintNode = (node, depth, indent) => {
  const pad = indent.repeat(depth)
  if (node.nodeType === NodeService_1.NodeService.TEXT_NODE) {
    const text = escapeText((node.nodeValue || '').trim())
    return text ? `${pad}${text}` : ''
  }
  if (node.nodeType === NodeService_1.NodeService.COMMENT_NODE) {
    return `${pad}<!--${node.nodeValue || ''}-->`
  }
  if (node.nodeType !== NodeService_1.NodeService.ELEMENT_NODE) {
    return ''
  }
  const tagName = node.tagName
  const attributes = serializeAttributes(node)
  if (VOID_ELEMENTS.has(tagName)) {
    return `${pad}<${tagName}${attributes}>`
  }
  const children = Array.from(node.childNodes).map(child => prettyPrintNode(child, depth + 1, indent)).filter(line => line !== '')
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
const prettyPrint = (node, indent = '  ') => prettyPrintNode(node, 0, indent)
exports.prettyPrint = prettyPrint

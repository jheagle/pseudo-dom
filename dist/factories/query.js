'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.closest = exports.matches = exports.querySelector = exports.querySelectorAll = void 0
/**
 * Selector queries (querySelector, querySelectorAll, matches, closest), built on css-select and the
 * cssSelectAdapter which lets it query pseudo-dom's own tree.
 */
const css_select_1 = require('css-select')
const cssSelectAdapter_1 = require('./cssSelectAdapter')
/**
 * All of the elements below (not including) scope which match the selector, in tree order.
 * @param selector A CSS selector
 * @param scope The node to search below
 */
const querySelectorAll = (selector, scope) => (0, css_select_1.selectAll)(selector, scope, {
  adapter: cssSelectAdapter_1.cssSelectAdapter
})
exports.querySelectorAll = querySelectorAll
/**
 * The first element below (not including) scope which matches the selector, in tree order, or null when there is none.
 * @param selector A CSS selector
 * @param scope The node to search below
 */
const querySelector = (selector, scope) => (0, css_select_1.selectOne)(selector, scope, {
  adapter: cssSelectAdapter_1.cssSelectAdapter
})
exports.querySelector = querySelector
/**
 * Whether an element itself (not its descendants) matches the selector.
 * @param element The element to test
 * @param selector A CSS selector
 */
const matches = (element, selector) => (0, css_select_1.is)(element, selector, {
  adapter: cssSelectAdapter_1.cssSelectAdapter
})
exports.matches = matches
/**
 * The nearest ancestor of an element (starting with the element itself) which matches the selector, or null when
 * none of them do.
 * @param element The element to start from
 * @param selector A CSS selector
 */
const closest = (element, selector) => {
  let current = element
  while (current && cssSelectAdapter_1.cssSelectAdapter.isTag(current)) {
    if ((0, exports.matches)(current, selector)) {
      return current
    }
    current = current.parentNode
  }
  return null
}
exports.closest = closest

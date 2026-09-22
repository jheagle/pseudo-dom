/**
 * @file Selector queries (querySelector, querySelectorAll, matches, closest), built on css-select and the
 * cssSelectAdapter which lets it query pseudo-dom's own tree.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { is, selectAll, selectOne } from 'css-select'
import { cssSelectAdapter } from './cssSelectAdapter'

/**
 * All of the elements below (not including) scope which match the selector, in tree order.
 * @memberOf module:factories
 * @param {string} selector A CSS selector
 * @param {*} scope The node to search below
 * @returns {Array<*>}
 */
export const querySelectorAll = (selector: string, scope: any): Array<any> => selectAll(selector, scope, { adapter: cssSelectAdapter as any })

/**
 * The first element below (not including) scope which matches the selector, in tree order, or null when there is none.
 * @memberOf module:factories
 * @param {string} selector A CSS selector
 * @param {*} scope The node to search below
 * @returns {*|null}
 */
export const querySelector = (selector: string, scope: any): any | null => selectOne(selector, scope, { adapter: cssSelectAdapter as any })

/**
 * Whether an element itself (not its descendants) matches the selector.
 * @memberOf module:factories
 * @param {*} element The element to test
 * @param {string} selector A CSS selector
 * @returns {boolean}
 */
export const matches = (element: any, selector: string): boolean => is(element, selector, { adapter: cssSelectAdapter as any })

/**
 * The nearest ancestor of an element (starting with the element itself) which matches the selector, or null when
 * none of them do.
 * @memberOf module:factories
 * @param {*} element The element to start from
 * @param {string} selector A CSS selector
 * @returns {*|null}
 */
export const closest = (element: any, selector: string): any | null => {
  let current: any = element
  while (current && cssSelectAdapter.isTag(current)) {
    if (matches(current, selector)) {
      return current
    }
    current = current.parentNode
  }
  return null
}

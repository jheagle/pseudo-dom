/**
 * @file The css-select Adapter which lets it query pseudo-dom's own tree, instead of the domutils-based tree it
 * defaults to.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { NodeService } from '../services/NodeService'

/**
 * Walk up from a node (not including it) to find the nearest element, in the given direction.
 * @param {*} node The node to start from
 * @param {'nextSibling'|'previousSibling'} direction Which sibling reference to follow
 * @returns {*|null}
 */
const nearestElementSibling = (node: any, direction: 'nextSibling' | 'previousSibling'): any | null => {
  let current: any = node ? node[direction] : null
  while (current && current.nodeType !== NodeService.ELEMENT_NODE) {
    current = current[direction]
  }
  return current || null
}

/**
 * Maps pseudo-dom's own Node / Element API onto the Adapter interface css-select needs to query a tree which is not
 * domutils' own (css-select's own Adapter<Node, ElementNode> type). Every method here is one pseudo-dom already has
 * under a different name; nothing here reimplements DOM behaviour.
 * @memberOf module:factories
 * @type {Object}
 */
export const cssSelectAdapter = {
  isTag: (node: any): boolean => !!node && node.nodeType === NodeService.ELEMENT_NODE,

  existsOne: (test: (elem: any) => boolean, elems: Array<any>): boolean => elems.some((elem: any) =>
    cssSelectAdapter.isTag(elem) && (test(elem) || cssSelectAdapter.existsOne(test, cssSelectAdapter.getChildren(elem)))
  ),

  // pseudo-dom's className / classList are kept in sync with each other, but not with a literal 'class' attribute
  // (there is no such special-cased attribute here, unlike a real DOM) - so the 'class' css-select needs for class
  // selectors is read from className instead.
  getAttributeValue: (elem: any, name: string): string | undefined => {
    const value = name === 'class' ? elem.className : elem.getAttribute(name)
    return value === null || value === undefined ? undefined : value
  },

  getChildren: (node: any): Array<any> => Array.from(node.childNodes),

  getName: (elem: any): string => elem.tagName,

  getParent: (node: any): any | null => node.parentNode,

  // Unlike jQuery's siblings(), this is expected to include the node itself
  getSiblings: (node: any): Array<any> => node.parentNode ? Array.from(node.parentNode.childNodes) : [node],

  prevElementSibling: (node: any): any | null => nearestElementSibling(node, 'previousSibling'),

  getText: (node: any): string => node.textContent || '',

  hasAttrib: (elem: any, name: string): boolean => elem.hasAttribute(name),

  removeSubsets: (nodes: Array<any>): Array<any> => nodes.filter((node: any, index: number) =>
    !nodes.some((other: any, otherIndex: number) => otherIndex !== index && typeof other.contains === 'function' && other !== node && other.contains(node))
  ),

  findAll: (test: (elem: any) => boolean, nodes: Array<any>): Array<any> => {
    const found: Array<any> = []
    const visit = (list: Array<any>): void => list.forEach((node: any) => {
      if (!cssSelectAdapter.isTag(node)) {
        return
      }
      if (test(node)) {
        found.push(node)
      }
      visit(cssSelectAdapter.getChildren(node))
    })
    visit(nodes)
    return found
  },

  findOne: (test: (elem: any) => boolean, nodes: Array<any>): any | null => {
    for (const node of nodes) {
      if (!cssSelectAdapter.isTag(node)) {
        continue
      }
      if (test(node)) {
        return node
      }
      const inChildren = cssSelectAdapter.findOne(test, cssSelectAdapter.getChildren(node))
      if (inChildren) {
        return inChildren
      }
    }
    return null
  }
}

export default cssSelectAdapter

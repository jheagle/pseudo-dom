/**
 * @file Wraps an element in a Proxy which behaves like the DOM's DOMStringMap (element.dataset): a live view of its
 * data-* attributes, under their camelCase names, backed by the element's own getAttribute / setAttribute /
 * hasAttribute / removeAttribute (nothing is stored separately, so it can never fall out of sync with the
 * attributes).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { camelToKebab, kebabToCamel } from './createStyleDeclaration'

const DATA_PREFIX = 'data-'

const attributeName = (property: string): string => `${DATA_PREFIX}${camelToKebab(property)}`

/**
 * Every data-* attribute name currently on the element, as [attributeName, camelCaseName] pairs.
 * @param {*} element
 * @returns {Array<Array<string>>}
 */
const dataAttributes = (element: any): Array<[string, string]> => {
  const names: Array<[string, string]> = []
  for (let index = 0; index < element.attributes.length; index++) {
    const name: string = element.attributes.item(index).name
    if (name.indexOf(DATA_PREFIX) === 0 && name.length > DATA_PREFIX.length) {
      names.push([name, kebabToCamel(name.slice(DATA_PREFIX.length))])
    }
  }
  return names
}

/**
 * A live DOMStringMap-like object for an element's data-* attributes.
 * @memberOf module:factories
 * @param {*} element The element whose data-* attributes this reflects
 * @returns {Object.<string, string>}
 */
const createDataset = (element: any): { [key: string]: string } => new Proxy({}, {
  get (_target: object, property: string | symbol): string | undefined {
    if (typeof property !== 'string') {
      return undefined
    }
    const value: string | null = element.getAttribute(attributeName(property))
    return value === null ? undefined : value
  },
  set (_target: object, property: string | symbol, value: any): boolean {
    if (typeof property !== 'string') {
      return false
    }
    element.setAttribute(attributeName(property), String(value))
    return true
  },
  deleteProperty (_target: object, property: string | symbol): boolean {
    if (typeof property === 'string') {
      element.removeAttribute(attributeName(property))
    }
    return true
  },
  has (_target: object, property: string | symbol): boolean {
    return typeof property === 'string' && element.hasAttribute(attributeName(property))
  },
  ownKeys (): Array<string> {
    return dataAttributes(element).map(([, camelCaseName]: [string, string]) => camelCaseName)
  },
  getOwnPropertyDescriptor (_target: object, property: string | symbol): PropertyDescriptor | undefined {
    if (typeof property !== 'string' || !element.hasAttribute(attributeName(property))) {
      return undefined
    }
    return { enumerable: true, configurable: true, value: element.getAttribute(attributeName(property)) }
  }
}) as unknown as { [key: string]: string }

export default createDataset

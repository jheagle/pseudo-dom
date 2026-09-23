'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.map.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
/**
 * @file Wraps an element in a Proxy which behaves like the DOM's DOMStringMap (element.dataset): a live view of its
 * data-* attributes, under their camelCase names, backed by the element's own getAttribute / setAttribute /
 * hasAttribute / removeAttribute (nothing is stored separately, so it can never fall out of sync with the
 * attributes).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
const createStyleDeclaration_1 = require('./createStyleDeclaration')
const DATA_PREFIX = 'data-'
const attributeName = property => `${DATA_PREFIX}${(0, createStyleDeclaration_1.camelToKebab)(property)}`
/**
 * Every data-* attribute name currently on the element, as [attributeName, camelCaseName] pairs.
 * @param {*} element
 * @returns {Array<Array<string>>}
 */
const dataAttributes = element => {
  const names = []
  for (let index = 0; index < element.attributes.length; index++) {
    const name = element.attributes.item(index).name
    if (name.indexOf(DATA_PREFIX) === 0 && name.length > DATA_PREFIX.length) {
      names.push([name, (0, createStyleDeclaration_1.kebabToCamel)(name.slice(DATA_PREFIX.length))])
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
const createDataset = element => new Proxy({}, {
  get (_target, property) {
    if (typeof property !== 'string') {
      return undefined
    }
    const value = element.getAttribute(attributeName(property))
    return value === null ? undefined : value
  },
  set (_target, property, value) {
    if (typeof property !== 'string') {
      return false
    }
    element.setAttribute(attributeName(property), String(value))
    return true
  },
  deleteProperty (_target, property) {
    if (typeof property === 'string') {
      element.removeAttribute(attributeName(property))
    }
    return true
  },
  has (_target, property) {
    return typeof property === 'string' && element.hasAttribute(attributeName(property))
  },
  ownKeys () {
    return dataAttributes(element).map(([, camelCaseName]) => camelCaseName)
  },
  getOwnPropertyDescriptor (_target, property) {
    if (typeof property !== 'string' || !element.hasAttribute(attributeName(property))) {
      return undefined
    }
    return {
      enumerable: true,
      configurable: true,
      value: element.getAttribute(attributeName(property))
    }
  }
})
exports.default = createDataset

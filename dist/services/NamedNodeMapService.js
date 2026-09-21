'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.find.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.NamedNodeMapService = void 0
/**
 * Simulate the behaviour of the NamedNodeMap Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
class NamedNodeMapService {
  /**
   * @param {Array<PseudoAttr>} [attributes=[]] The attributes to start with
   * @constructor
   */
  constructor (attributes = []) {
    this.attributes = attributes.slice()
  }

  get length () {
    return this.attributes.length
  }

  getNamedItem (name) {
    return this.attributes.find(attr => attr.name === name) || null
  }

  setNamedItem (attr) {
    const index = this.attributes.findIndex(existing => existing.name === attr.name)
    if (index < 0) {
      this.attributes.push(attr)
      return null
    }
    const replaced = this.attributes[index]
    this.attributes[index] = attr
    return replaced
  }

  removeNamedItem (attrName) {
    const index = this.attributes.findIndex(attr => attr.name === attrName)
    if (index < 0) {
      throw new Error(`The attribute "${attrName}" was not found.`)
    }
    return this.attributes.splice(index, 1)[0]
  }

  item (index) {
    return this.attributes[index] || null
  }

  getNamedItemNS (namespace, localName) {
    return this.attributes.find(attr => attr.namespaceURI === namespace && attr.localName === localName) || null
  }

  setNamedItemNS (attr) {
    const index = this.attributes.findIndex(existing => existing.namespaceURI === attr.namespaceURI && existing.localName === attr.localName)
    if (index < 0) {
      this.attributes.push(attr)
      return null
    }
    const replaced = this.attributes[index]
    this.attributes[index] = attr
    return replaced
  }

  removeNamedItemNS (namespace, localName) {
    const index = this.attributes.findIndex(attr => attr.namespaceURI === namespace && attr.localName === localName)
    if (index < 0) {
      throw new Error(`The attribute "${localName}" in the namespace "${namespace}" was not found.`)
    }
    return this.attributes.splice(index, 1)[0]
  }
}
exports.NamedNodeMapService = NamedNodeMapService

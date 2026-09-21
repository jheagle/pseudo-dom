'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.AttrService = void 0
const NodeService_1 = require('./NodeService')
/**
 * Simulate the behaviour of the Attr Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
class AttrService extends NodeService_1.NodeService {
  /**
   * @param {string} name The name of the attribute
   * @param {string} [value=''] The value of the attribute
   * @param {PseudoElement|null} [ownerElement=null] The element which has this attribute
   * @param {string} [namespaceURI=''] The namespace of the attribute
   * @param {string|null} [prefix=null] The namespace prefix of the attribute
   * @constructor
   */
  constructor (name = '', value = '', ownerElement = null, namespaceURI = '', prefix = null) {
    super()
    this.attributeName = name
    this.value = value
    this.element = ownerElement
    this.namespace = namespaceURI
    this.namespacePrefix = prefix
    this.nodeNameValue = name
  }

  get nodeType () {
    return NodeService_1.NodeService.ATTRIBUTE_NODE
  }

  get localName () {
    return this.attributeName
  }

  get name () {
    return this.namespacePrefix ? `${this.namespacePrefix}:${this.attributeName}` : this.attributeName
  }

  get namespaceURI () {
    return this.namespace
  }

  get ownerElement () {
    return this.element
  }

  get prefix () {
    return this.namespacePrefix
  }
}
exports.AttrService = AttrService

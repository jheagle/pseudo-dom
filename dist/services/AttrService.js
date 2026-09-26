'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.AttrService = void 0
const NodeService_1 = require('./NodeService')
/**
 * Simulate the behaviour of the Attr Class when there is no DOM available.
 */
class AttrService extends NodeService_1.NodeService {
  /**
   * @param name The name of the attribute
   * @param value The value of the attribute
   * @param ownerElement The element which has this attribute
   * @param namespaceURI The namespace of the attribute
   * @param prefix The namespace prefix of the attribute
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

  get acceptsChildren () {
    return false
  }

  get nodeValue () {
    return this.value
  }

  set nodeValue (value) {
    this.value = value === null ? '' : String(value)
  }

  get textContent () {
    return this.value
  }

  set textContent (text) {
    this.value = text === null ? '' : String(text)
  }

  cloneShallow () {
    return new AttrService(this.localName, this.value, null, this.namespaceURI, this.prefix)
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

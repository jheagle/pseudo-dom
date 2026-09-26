import { PseudoNamedNodeMap } from '../interfaces/PseudoNamedNodeMap'
import { PseudoAttr } from '../interfaces/PseudoAttr'

/**
 * Simulate the behaviour of the NamedNodeMap Class when there is no DOM available.
 */
export class NamedNodeMapService implements PseudoNamedNodeMap {
  private attributes: Array<PseudoAttr>

  /**
   * @param attributes The attributes to start with
   */
  constructor (attributes: Array<PseudoAttr> = []) {
    this.attributes = attributes.slice()
  }

  get length (): number {
    return this.attributes.length
  }

  getNamedItem (name: string): PseudoAttr | null {
    return this.attributes.find(attr => attr.name === name) || null
  }

  setNamedItem (attr: PseudoAttr): PseudoAttr | null {
    const index = this.attributes.findIndex(existing => existing.name === attr.name)
    if (index < 0) {
      this.attributes.push(attr)
      return null
    }
    const replaced = this.attributes[index]
    this.attributes[index] = attr
    return replaced
  }

  removeNamedItem (attrName: string): PseudoAttr {
    const index = this.attributes.findIndex(attr => attr.name === attrName)
    if (index < 0) {
      throw new Error(`The attribute "${attrName}" was not found.`)
    }
    return this.attributes.splice(index, 1)[0]
  }

  item (index: number): PseudoAttr | null {
    return this.attributes[index] || null
  }

  getNamedItemNS (namespace: string, localName: string): PseudoAttr | null {
    return this.attributes.find(attr => attr.namespaceURI === namespace && attr.localName === localName) || null
  }

  setNamedItemNS (attr: PseudoAttr): PseudoAttr | null {
    const index = this.attributes.findIndex(existing => existing.namespaceURI === attr.namespaceURI && existing.localName === attr.localName)
    if (index < 0) {
      this.attributes.push(attr)
      return null
    }
    const replaced = this.attributes[index]
    this.attributes[index] = attr
    return replaced
  }

  removeNamedItemNS (namespace: string, localName: string): PseudoAttr {
    const index = this.attributes.findIndex(attr => attr.namespaceURI === namespace && attr.localName === localName)
    if (index < 0) {
      throw new Error(`The attribute "${localName}" in the namespace "${namespace}" was not found.`)
    }
    return this.attributes.splice(index, 1)[0]
  }
}

/**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoNode } from '../interfaces/PseudoNode'
import generateNodeList from '../factories/generateNodeList'
import { TreeLinker } from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'
import { EventService } from './EventService'
import { NodeService } from './NodeService'
import { PseudoElement } from '../interfaces/PseudoElement'
import { PseudoNamedNodeMap } from '../interfaces/PseudoNamedNodeMap'
import { PseudoDOMTokenList } from '../interfaces/PseudoDOMTokenList'
import { AttrService } from './AttrService'
import { DOMTokenListService } from './DOMTokenListService'
import { NamedNodeMapService } from './NamedNodeMapService'
import getParentNodesFromAttribute from '../functions/getParentNodesFromAttribute'

type attribute = { name: string, value: any }

/**
 * Simulate the behaviour of the Element Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoNode
 * @property {string} tagName
 * @property {string} className
 * @property {string} id
 * @property {string} innerHtml
 * @property {Array} attributes
 * @property {function} hasAttribute
 * @property {function} setAttribute
 * @property {function} getAttribute
 * @property {function} removeAttribute
 */
export class ElementService extends NodeService implements Partial<PseudoElement> {
  public id: string
  public innerHTML: string
  public type: string
  private readonly tag: string
  private readonly attributeList: Array<attribute>
  private readonly propertyAttributes: Array<string>
  private readonly tokenList: DOMTokenListService

  /**
   * @param {Object} [settings={}]
   * @param {string} [settings.tagName=''] The name of the tag this element represents
   * @param {Array<{name: string, value: *}>} [settings.attributes=[]] The attributes (also assigned as properties) to start with
   * @param {PseudoNode|null} [settings.parent=null] The parent node
   * @param {Array} [settings.children=[]] The values or nodes to start as children
   * @constructor
   */
  constructor ({ tagName = '', attributes = [], parent = null, children = [] }: {
    tagName?: string;
    attributes?: Array<attribute>;
    parent?: PseudoNode | null;
    children?: Array<any>
  } = {}) {
    super()
    this.tokenList = new DOMTokenListService()
    this.parent = parent
    this.children = generateNodeList(TreeLinker.fromArray(children).head)
    this.tag = tagName
    this.attributeList = attributes.concat([
      { name: 'className', value: '' },
      { name: 'id', value: '' },
      { name: 'innerHTML', value: '' }
    ])
    this.propertyAttributes = this.attributeList.map(({ name }) => name)
    this.attributeList.forEach(({ name, value }) => {
      (this as any)[name] = value
    })
  }

  get tagName (): string {
    return this.tag
  }

  get nodeType (): number {
    return NodeService.ELEMENT_NODE
  }

  get attributes (): PseudoNamedNodeMap {
    return new NamedNodeMapService(this.attributeList.map(({ name, value }) => new AttrService(name, String(value), this as unknown as PseudoElement)))
  }

  get classList (): PseudoDOMTokenList {
    return this.tokenList
  }

  get className (): string {
    return this.tokenList.value
  }

  set className (className: string) {
    this.tokenList.value = className
  }

  /**
   * Some elements have default behaviour, this registers it when the element is added.
   * @returns {Function}
   */
  applyDefaultEvent (): Function {
    let callback: (event: EventService) => void = (event: EventService): undefined => undefined
    switch (this.tagName) {
      case 'form':
        this.addEventListener('submit', callback)
        break
      case 'button':
      case 'input':
        if (/^(submit|image)$/i.test(this.type || '')) {
          callback = (event: EventService): void => {
            const forms: Array<any> = getParentNodesFromAttribute('tagName', 'form', this)
            if (forms.length) {
              forms[0].submit()
            }
          }
          super.setDefaultEvent('click', callback)
        }
    }
    return callback
  }

  /**
   *
   * @param {PseudoNode|ElementService} childElement
   * @returns {PseudoNode}
   */
  appendChild (childElement: ElementService): PseudoNode {
    super.appendChild(childElement)
    childElement.applyDefaultEvent()
    return childElement
  }

  /**
   * Check whether the element has an attribute by that name.
   * @param {string} attributeName
   * @returns {boolean}
   */
  hasAttribute (attributeName: string): boolean {
    return this.attributeList.some(({ name }) => name === attributeName)
  }

  /**
   * Set the value of an attribute, adding the attribute if it did not exist.
   * @param {string} attributeName
   * @param {string} attributeValue
   * @returns {undefined}
   */
  setAttribute (attributeName: string, attributeValue: string): void {
    const existing = this.attributeList.find(({ name }) => name === attributeName)
    if (existing) {
      existing.value = attributeValue
    } else {
      this.attributeList.push({ name: attributeName, value: attributeValue })
    }
    if (this.propertyAttributes.indexOf(attributeName) >= 0) {
      (this as any)[attributeName] = attributeValue
    }
  }

  /**
   * Retrieve the value of an attribute.
   * @param {string} attributeName
   * @returns {string|null} The value, or null when there is no such attribute
   */
  getAttribute (attributeName: string): string | null {
    const found = this.attributeList.find(({ name }) => name === attributeName)
    return found ? found.value : null
  }

  /**
   * Remove an attribute from the element.
   * @param {string} attributeName
   * @returns {undefined}
   */
  removeAttribute (attributeName: string): void {
    const index = this.attributeList.findIndex(({ name }) => name === attributeName)
    if (index >= 0) {
      this.attributeList.splice(index, 1)
    }
  }
}

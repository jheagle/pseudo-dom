/**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import PseudoNode from './PseudoNode'
import generateNodeList from '../factories/generateNodeList'
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'
import PseudoEvent from './PseudoEvent'

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
class PseudoElement extends PseudoNode {
  private readonly tagName: string
  private attributes: any[]
  private classList: any
  private className: any
  private type: string

  /**
   * Simulate the Element object when the Dom is not available
   * @param {Object} [elementOptions={}]
   * @param {string} [elementOptions.tagName='']
   * @param {array} [elementOptions.attributes=[]]
   * @param {PseudoNode|Object} [elementOptions.parent={}]
   * @param {Array} [elementOptions.children=[]]
   * @constructor
   */
  constructor ({ tagName = '', attributes = [], parent = null, children = [] }: {
    tagName?: string;
    attributes?: Array<any>;
    parent?: PseudoNode | null;
    children?: Array<any>
  } = {}) {
    super()
    this.parent = parent
    this.children = generateNodeList(TreeLinker.fromArray(children).head)
    this.tagName = tagName
    this.attributes = attributes.concat([
      { name: 'className', value: '' },
      { name: 'id', value: '' },
      { name: 'innerHTML', value: '' }
    ])

    /**
     * Map all incoming attributes to the attribute array and attach each as a property of this element
     */
    this.attributes.map(({ name, value }): { name: keyof PseudoElement, value: any } => {
      // @ts-ignore
      this[name] = value
      return { name, value }
    })

    // this.classList = new DOMSettableTokenList(this.className)
    this.classList = this.className
  }

  get nodeType () {
    return PseudoNode.ELEMENT_NODE
  }

  /**
   *
   * @returns {Function}
   */
  applyDefaultEvent (): Function {
    let callback: (event: PseudoEvent) => void = (event: PseudoEvent): undefined => undefined
    switch (this.tagName) {
      case 'form':
        this.addEventListener('submit', callback)
        break
      case 'button':
      case 'input':
        if (/^(submit|image)$/i.test(this.type || '')) {
          callback = (event: PseudoEvent): void => {
            const forms = require('./PseudoEvent').getParentNodesFromAttribute('tagName', 'form', this)
            if (forms) {
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
   * @param {PseudoNode|PseudoElement} childElement
   * @returns {PseudoNode}
   */
  appendChild (childElement: PseudoElement): PseudoNode {
    super.appendChild(childElement)
    childElement.applyDefaultEvent()
    return childElement
  }

  /**
   * Check if an attribute is assigned to this element.
   * @param {string} attributeName - The attribute name to check
   * @returns {boolean}
   */
  hasAttribute (attributeName: string): boolean {
    return this.getAttribute(attributeName) !== 'undefined'
  }

  /**
   * Assign a new attribute or overwrite an assigned attribute with name and value.
   * @param {string} attributeName - The name key of the attribute to append
   * @param {string|Object} attributeValue - The value of the attribute to append
   * @returns {undefined}
   */
  setAttribute (attributeName: keyof PseudoElement, attributeValue: string | object): undefined {
    if (this.hasAttribute(attributeName) || this[attributeName] === 'undefined') {
      // @ts-ignore
      this[attributeName] = attributeValue
      this.attributes.push({ name: attributeName, value: attributeValue })
    }
    return undefined
  }

  /**
   * Retrieve the value of the specified attribute from the Element
   * @param {string} attributeName - A string representing the name of the attribute to be retrieved
   * @returns {string|Object}
   */
  getAttribute (attributeName: string): string | object {
    return this.attributes.find(attribute => attribute.name === attributeName)
  }

  /**
   * Remove an assigned attribute from the Element
   * @param {string} attributeName - The string name of the attribute to be removed
   * @returns {null}
   */
  removeAttribute (attributeName: keyof PseudoElement): null {
    if (this.hasAttribute(attributeName)) {
      delete this[attributeName]
      // TODO: how do we delete it as an attribute?
    }
    return null
  }
}

export default PseudoElement

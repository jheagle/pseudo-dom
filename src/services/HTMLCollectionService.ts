/**
 * @file Substitute for the DOM HTMLCollection Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { NodeService } from './NodeService'
import { PseudoHTMLCollection } from '../interfaces/PseudoHTMLCollection'
import { PseudoNode } from '../interfaces/PseudoNode'

/**
 * Simulate the behaviour of the HTMLCollection Class when there is no DOM available: a live view of the element
 * children of a node, recomputed from its childNodes each time it is used rather than kept in sync as they change.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
export class HTMLCollectionService implements PseudoHTMLCollection {
  private readonly owner: NodeService

  /**
   * @param {NodeService} owner The node whose element children this is a live view of
   * @constructor
   */
  constructor (owner: NodeService) {
    this.owner = owner
  }

  /**
   * The current element children of the owner, in order.
   * @returns {Array<PseudoNode>}
   */
  private elements (): Array<any> {
    return Array.from(this.owner.childNodes).filter((node: PseudoNode) => node.nodeType === NodeService.ELEMENT_NODE)
  }

  /**
   * How many elements are in the collection right now.
   * @returns {number}
   */
  get length (): number {
    return this.elements().length
  }

  /**
   * The element at the given index, or null when there is none.
   * @param {number} index
   * @returns {*}
   */
  item (index: number): any | null {
    return this.elements()[index] || null
  }

  /**
   * The element whose id, or (failing that) whose name attribute, is the given value, or null when there is none.
   * @param {string} name
   * @returns {*}
   */
  namedItem (name: string): any | null {
    const elements: Array<any> = this.elements()
    return elements.find(element => element.id === name) || elements.find(element => element.getAttribute('name') === name) || null
  }

  /**
   * Iterate over the current element children.
   * @returns {Iterator}
   */
  [Symbol.iterator] (): Iterator<any> {
    return this.elements()[Symbol.iterator]()
  }
}

export default HTMLCollectionService

import { TreeLinker } from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'
import { NodeService } from '../services/NodeService'
import { PseudoNode } from '../interfaces/PseudoNode'
import { PseudoElement } from '../interfaces/PseudoElement'

/**
 * A node which is stored in a TreeLinker (for example by a list built from an array of values). It finds its siblings
 * from that linker, and its parent from the linker's parent when it has not been given one by appendChild.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export class LinkedNode extends NodeService {
  /**
   * @param {TreeLinker} linker The linker holding this node
   * @param {string|null} value The value of the node
   * @constructor
   */
  constructor (linker: TreeLinker, value: string | null = '') {
    super()
    this.listLinker = linker
    this.nodeValue = value
  }

  get isConnected (): boolean {
    return !!this.parentNode
  }

  get parentNode (): PseudoNode | null {
    if (this.parent) {
      return this.parent
    }
    const parentLinker: TreeLinker | null = this.listLinker ? this.listLinker.parent as TreeLinker : null
    return parentLinker ? parentLinker.data : null
  }

  get parentElement (): PseudoElement | null {
    const parent = this.parentNode
    return parent && parent.nodeType === NodeService.ELEMENT_NODE ? parent as PseudoElement : null
  }
}

export class NodeFactory extends TreeLinker {}

/**
 * Create a TreeLinker class whose linkers each store a node (a LinkedNode) as their data, this can be used to build a
 * tree (or list) of nodes from plain values.
 * @function generateNode
 * @returns {Function} The NodeFactory class (a TreeLinker) to use as the linker class
 */
const generateNode = (): typeof NodeFactory => {
  NodeFactory.fromArray = (values: Array<any> = [], LinkerClass: any = NodeFactory) => values.reduce(
    (list: { head: any, tail: any }, element: any) => {
      if (typeof element !== 'object') {
        element = { data: element }
      }
      const newElement = new LinkerClass(Object.assign({}, element, { prev: list.tail }))
      newElement.data = new LinkedNode(newElement, element.data)
      if (list.head === null) {
        return { head: newElement, tail: newElement }
      }
      list.tail.next = newElement
      newElement.prev = list.tail
      return { head: list.head, tail: newElement }
    },
    { head: null, tail: null }
  )
  return NodeFactory
}

export default generateNode

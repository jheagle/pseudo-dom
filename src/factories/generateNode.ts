import { TreeLinker } from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'
import { NodeService } from '../services/NodeService'
import { PseudoNode } from '../interfaces/PseudoNode'
import { PseudoElement } from '../interfaces/PseudoElement'

/**
 * A node which is stored in a TreeLinker and answers questions about its position in the tree by asking that linker.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export class LinkedNode extends NodeService {
  private readonly linker: TreeLinker

  /**
   * @param {TreeLinker} linker The linker holding this node
   * @param {string|null} value The value of the node
   * @constructor
   */
  constructor (linker: TreeLinker, value: string | null = '') {
    super()
    this.linker = linker
    this.nodeValue = value
  }

  get childNodes (): any {
    return this.linker.children
  }

  get firstChild (): PseudoNode | null {
    const children: any = this.linker.children
    return children && children.first ? children.first.data : null
  }

  get isConnected (): boolean {
    return !!this.linker.parent
  }

  get lastChild (): PseudoNode | null {
    const children: any = this.linker.children
    return children && children.last ? children.last.data : null
  }

  get nextSibling (): PseudoNode | null {
    return this.linker.next ? this.linker.next.data : null
  }

  get ownerDocument (): any {
    const root: any = (this.linker.parent as any) ? (this.linker as any).rootParent : null
    return root ? root.data : null
  }

  get parentNode (): PseudoNode | null {
    return this.linker.parent ? this.linker.parent.data : null
  }

  get parentElement (): PseudoElement | null {
    const parent = this.parentNode
    return parent && parent.nodeType === NodeService.ELEMENT_NODE ? parent as PseudoElement : null
  }

  get previousSibling (): PseudoNode | null {
    return this.linker.prev ? this.linker.prev.data : null
  }

  appendChild (childNode: PseudoNode): PseudoNode {
    this.linker.next = childNode as any
    ;(childNode as any).prev = this.linker
    return childNode
  }

  getRootNode (): PseudoNode {
    const root: any = (this.linker as any).rootParent
    return root ? root.data : this
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

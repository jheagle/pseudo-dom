/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import IsArrayable from 'collect-your-stuff/dist/recipes/IsArrayable'
import IsTree from 'collect-your-stuff/dist/recipes/IsTree'
import LinkedTreeList from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'
import generateNode, { NodeFactory } from '../factories/generateNode'
import AttachedNodeIterator from '../recipes/AttachedNodeIterator'
import PseudoNode from './PseudoNode'

class PseudoNodeList extends LinkedTreeList implements IsTree, Iterable<NodeFactory> {
  public readonly classType: typeof PseudoNodeList = PseudoNodeList

  public entries (): { [Symbol.iterator]: () => AttachedNodeIterator } {
    let count = 0
    return {
      [Symbol.iterator]: (): AttachedNodeIterator =>
        new AttachedNodeIterator(this.first, (node: NodeFactory): NodeFactory | [number, PseudoNode] | null => {
          if (node === null) {
            return node
          }
          return [count++, node.data]
        })
    }
  }

  public keys (): { [Symbol.iterator]: () => AttachedNodeIterator } {
    let count = 0
    return {
      [Symbol.iterator]: (): AttachedNodeIterator =>
        new AttachedNodeIterator(this.first, (node: NodeFactory): number => count++)
    }
  }

  public values (): { [Symbol.iterator]: () => AttachedNodeIterator } {
    return {
      [Symbol.iterator]: (): AttachedNodeIterator =>
        new AttachedNodeIterator(this.first, (node: NodeFactory): NodeFactory | PseudoNode | null => {
          if (node === null) {
            return node
          }
          return node.data
        })
    }
  }

  /**
   * Be able to iterate over this class.
   * @returns {Iterator}
   */
  [Symbol.iterator] (): Iterator<NodeFactory> {
    return new AttachedNodeIterator(this.first)
  }

  /**
   * Convert an array into a LinkedTreeList instance, return the new instance.
   * @param {Array} [values=[]] An array of values which will be converted to nodes in this tree-list
   * @param {NodeFactory} [nodeClass=NodeFactory] The class to use for each node
   * @param {IsArrayable<NodeFactory>} [classType=PseudoNodeList] Provide the type of IsArrayable to use.
   * @returns {PseudoNodeList}
   */
  static fromArray (values: Array<any> = [], nodeClass: typeof NodeFactory = generateNode(), classType: any = PseudoNodeList): PseudoNodeList {
    return LinkedTreeList.fromArray(values, nodeClass, classType)
  }
}

export default PseudoNodeList

/**
 * Substitute for the NodeList interface.
 */
import { LinkedTreeList } from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'

/**
 * A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
 * the linkers that hold them.
 */
export class PseudoNodeList extends LinkedTreeList {
  /**
   * Iterate over the nodes in this list.
   */
  [Symbol.iterator] (): Iterator<any> {
    // Walk the nodes of this list only (the linkers of a child list have no children of their own)
    let current: any = this.first
    return {
      next: (): IteratorResult<any> => {
        if (current === null) {
          return { done: true, value: undefined }
        }
        const result: IteratorResult<any> = { done: false, value: current.data }
        current = current.next
        return result
      }
    }
  }

  /**
   * Iterate over [index, node] pairs.
   */
  entries (): Iterator<[number, any]> {
    return Array.from(this).map((node, index): [number, any] => [index, node])[Symbol.iterator]()
  }

  /**
   * Iterate over the indexes.
   */
  keys (): Iterator<number> {
    return Array.from(this).map((node, index) => index)[Symbol.iterator]()
  }

  /**
   * Iterate over the nodes.
   */
  values (): Iterator<any> {
    return Array.from(this)[Symbol.iterator]()
  }
}

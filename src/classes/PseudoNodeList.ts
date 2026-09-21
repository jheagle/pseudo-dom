/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { LinkedTreeList } from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'

/**
 * A NodeList, like the DOM one, iterates over the nodes themselves (the data stored in each TreeLinker), rather than
 * the linkers that hold them.
 * @class
 * @augments LinkedTreeList
 */
export class PseudoNodeList extends LinkedTreeList {
  /**
   * Iterate over the nodes in this list.
   * @returns {Iterator}
   */
  [Symbol.iterator] (): Iterator<any> {
    const linkers = super[Symbol.iterator]()
    return {
      next: (): IteratorResult<any> => {
        const result = linkers.next()
        return result.done ? result : { done: false, value: result.value.data }
      }
    }
  }

  /**
   * Iterate over [index, node] pairs.
   * @returns {Iterator}
   */
  entries (): Iterator<[number, any]> {
    return Array.from(this).map((node, index): [number, any] => [index, node])[Symbol.iterator]()
  }

  /**
   * Iterate over the indexes.
   * @returns {Iterator}
   */
  keys (): Iterator<number> {
    return Array.from(this).map((node, index) => index)[Symbol.iterator]()
  }

  /**
   * Iterate over the nodes.
   * @returns {Iterator}
   */
  values (): Iterator<any> {
    return Array.from(this)[Symbol.iterator]()
  }
}

/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { LinkedTreeList } from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'
import { TreeLinker } from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'
import { PseudoNode } from '../interfaces/PseudoNode'

export class PseudoNodeList extends LinkedTreeList {
  get entries () {
    return Array.from(this)
  }

  get keys () {
    return Array.from(this.innerList).keys
  }

  get values () {
    return Array.from(this.innerList).map((item: TreeLinker): PseudoNode => item.data).values
  }
}

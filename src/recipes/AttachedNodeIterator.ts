import { NodeFactory } from '../factories/generateNode'

/**
 * Class TreeLinkerIterator returns the next value taking a left-first approach down a tree.
 */
class AttachedNodeIterator implements Iterator<NodeFactory> {
  private current: NodeFactory
  private valueRule: Function | null

  constructor (current: NodeFactory, valueRule: Function | null = null) {
    this.current = current
    this.valueRule = valueRule
  }

  next (): IteratorResult<NodeFactory> {
    let currentNode = this.current
    if (this.valueRule === null && currentNode !== null) {
      currentNode = currentNode.data
    }
    if (this.valueRule !== null) {
      currentNode = this.valueRule(currentNode)
    }
    const result = { value: currentNode, done: !this.current }
    this.current = (this.current ? this.current.next : null)
    return result
  }
}

export default AttachedNodeIterator

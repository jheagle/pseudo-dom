import LinkedTreeList from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'
import generateNode from '../factories/generateNode'
import nodeListFactory from '../factories/nodeListFactory'

describe('PseudoNodeList', () => {
  test('can store elements', () => {
    const arrayData = ['one', 'two', 'three', 'four']
    const innerList = LinkedTreeList.fromArray(arrayData, generateNode())
    const someList = nodeListFactory(innerList)
    expect(someList.length).toBe(4)
    expect(Array.from(someList).map(node => node.nodeValue)).toEqual(arrayData)
  })
})

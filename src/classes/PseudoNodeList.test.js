import LinkedTreeList from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList'
import generateNode from '../factories/generateNode'
import generateNodeList from '../factories/generateNodeList'

describe('PseudoNodeList', () => {
  test('can store elements', () => {
    const arrayData = ['one', 'two', 'three', 'four']
    const innerList = LinkedTreeList.fromArray(arrayData, generateNode())
    const someList = generateNodeList(innerList)
    expect(someList.length).toBe(4)
    expect(Array.from(someList).map(node => node.nodeValue)).toEqual(arrayData)
  })
})

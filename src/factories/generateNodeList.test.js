import generateNode from '../factories/generateNode'
import generateNodeList from '../factories/generateNodeList'
import { logObject } from 'js-build-tools/functions/testHelpers'

describe('generateNodeList', () => {
  test('can store elements', () => {
    const arrayData = ['one', 'two', 'three', 'four']
    const generatedNode = generateNode()
    logObject(generatedNode, 'generatedNode')
    const innerList = generatedNode.fromArray(arrayData).head
    const someList = generateNodeList(innerList)
    expect(someList.length).toBe(4)
    expect(Array.from(someList).map(node => node.nodeValue)).toEqual(arrayData)
  })
})

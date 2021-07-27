/**
 * @jest-environment jsdom
 */
import { LinkedTreeList } from 'collections'
import { nodeListFactory } from '../dist/class/PseudoNodeList'
import { generateNode } from '../dist/class/PseudoNode'

test('NodeList can store elements', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const innerList = LinkedTreeList.fromArray(arrayData, generateNode())
  const someList = nodeListFactory(innerList)
  expect(someList.length).toBe(4)
  expect(Array.from(someList).map(node => node.nodeValue)).toEqual(arrayData)
})

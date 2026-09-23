import { TextService } from '../services/NodeService'
import { HTMLElementService } from '../services/HTMLElementService'
import generateNodeList from '../factories/generateNodeList'
import { PseudoNodeList } from './PseudoNodeList'

const arrayData = ['one', 'two', 'three', 'four']
// The real production path: a PseudoNodeList is a node's childNodes, built up by appendChild
const makeList = () => {
  const parent = new HTMLElementService({ tagName: 'div' })
  arrayData.forEach(value => parent.appendChild(new TextService(value)))
  return parent.childNodes
}

describe('PseudoNodeList', () => {
  test('can store elements', () => {
    const someList = makeList()
    expect(someList).toBeInstanceOf(PseudoNodeList)
    expect(someList.length).toBe(4)
    expect(Array.from(someList).map(node => node.nodeValue)).toEqual(arrayData)
  })

  test('can be created from a chain of linkers with generateNodeList', () => {
    const someList = generateNodeList(makeList().first)
    expect(someList.length).toBe(4)
    expect(Array.from(someList).map(node => node.nodeValue)).toEqual(arrayData)
  })

  test('an empty list can be created', () => {
    expect(generateNodeList().length).toBe(0)
  })

  test('iterates over the nodes, not the linkers', () => {
    const [first] = makeList()
    expect(first).toBeInstanceOf(TextService)
    expect(first.nodeValue).toBe('one')
    // A linker (unlike a real node) has no nodeType of its own
    expect(first.nodeType).toBe(3)
  })

  test('has keys, values and entries like a NodeList', () => {
    const someList = makeList()
    expect(Array.from({ [Symbol.iterator]: () => someList.keys() })).toEqual([0, 1, 2, 3])
    expect(Array.from({ [Symbol.iterator]: () => someList.values() }).map(node => node.nodeValue)).toEqual(arrayData)
    expect(Array.from({ [Symbol.iterator]: () => someList.entries() }).map(([index, node]) => [index, node.nodeValue]))
      .toEqual([[0, 'one'], [1, 'two'], [2, 'three'], [3, 'four']])
  })
})

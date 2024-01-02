import PseudoNodeList from './PseudoNodeList'

describe('PseudoNodeList', () => {
  test('can store given values', () => {
    const arrayData = ['one', 'two', 'three', 'four']
    const someList = PseudoNodeList.fromArray(arrayData)
    expect(someList.length).toBe(4)
    expect(Array.from(someList).map(node => node.nodeValue)).toEqual(arrayData)
  })

  test('use keys can output positional keys', () => {
    const arrayData = ['one', 'two', 'three', 'four']
    const someList = PseudoNodeList.fromArray(arrayData)
    const outKeys = []
    for (const key of someList.keys()) {
      outKeys.push(key)
    }
    expect(outKeys).toEqual([0, 1, 2, 3])
  })

  test('use values can output stored PseudoNodes', () => {
    const arrayData = ['one', 'two', 'three', 'four']
    const someList = PseudoNodeList.fromArray(arrayData)
    const outValues = []
    for (const pseudoNode of someList.values()) {
      outValues.push(pseudoNode.nodeValue)
    }
    expect(outValues).toEqual(arrayData)
  })

  test('use entries can output positional keys and PseudoNodes', () => {
    const arrayData = ['one', 'two', 'three', 'four']
    const someList = PseudoNodeList.fromArray(arrayData)
    const outKeys = []
    const outValues = []
    for (const entry of someList.entries()) {
      outKeys.push(entry[0])
      outValues.push(entry[1].nodeValue)
    }
    expect(outKeys).toEqual([0, 1, 2, 3])
    expect(outValues).toEqual(arrayData)
  })

  test('can be properly formed through multiple tiers', () => {
    const evenSimpler = [
      {
        data: 'one',
        children: [
          {
            data: 'four',
            children: [],
            listClass: PseudoNodeList
          },
          {
            data: 'five',
            children: [],
            listClass: PseudoNodeList
          }
        ],
        listClass: PseudoNodeList
      },
      {
        data: 'two',
        children: [
          {
            data: 'three',
            children: [],
            listClass: PseudoNodeList
          }
        ],
        listClass: PseudoNodeList
      }
    ]
    const someList = PseudoNodeList.fromArray(evenSimpler)
    expect(someList.first.data.nodeValue).toEqual('one')
    expect(someList.last.data.nodeValue).toEqual('two')
    expect(someList.last.children.first.data.nodeValue).toEqual('three')
    expect(someList.first.children.first.data.nodeValue).toEqual('four')
    expect(someList.first.children.last.data.nodeValue).toEqual('five')
  })
})

import { DOMTokenListService } from './DOMTokenListService'

describe('DOMTokenListService', () => {
  test('parses the starting value into unique tokens', () => {
    const list = new DOMTokenListService('  one two  one three ')
    expect(list.length).toBe(3)
    expect(list.value).toBe('one two three')
    expect(list.item(1)).toBe('two')
    expect(list.item(5)).toBeNull()
  })

  test('can add, remove and check tokens', () => {
    const list = new DOMTokenListService('one')
    list.add('two', 'three', 'one')
    expect(list.value).toBe('one two three')
    expect(list.contains('two')).toBe(true)
    list.remove('one', 'three')
    expect(list.value).toBe('two')
    expect(list.contains('one')).toBe(false)
  })

  test('can replace and toggle tokens', () => {
    const list = new DOMTokenListService('one two')
    expect(list.replace('one', 'three')).toBe(true)
    expect(list.value).toBe('three two')
    expect(list.replace('missing', 'x')).toBe(false)
    expect(list.toggle('two')).toBe(false)
    expect(list.toggle('two')).toBe(true)
    expect(list.toggle('two', true)).toBe(true)
    expect(list.toggle('other', false)).toBe(false)
    expect(list.value).toBe('three two')
  })

  test('setting the value replaces the tokens', () => {
    const list = new DOMTokenListService('one')
    list.value = 'a b'
    expect(Array.from({ [Symbol.iterator]: () => list.values() })).toEqual(['a', 'b'])
    expect(Array.from({ [Symbol.iterator]: () => list.keys() })).toEqual([0, 1])
    expect(Array.from({ [Symbol.iterator]: () => list.entries() })).toEqual([[0, 'a'], [1, 'b']])
  })

  test('forEach visits each token', () => {
    const seen = []
    new DOMTokenListService('a b').forEach((token, index) => seen.push([token, index]))
    expect(seen).toEqual([['a', 0], ['b', 1]])
  })

  test('reports every change to the onChange callback', () => {
    const changes = []
    const list = new DOMTokenListService('', value => changes.push(value))
    list.add('a')
    list.add('b')
    list.remove('a')
    expect(changes).toEqual(['a', 'a b', 'b'])
  })

  test('rejects empty tokens and tokens with whitespace', () => {
    const list = new DOMTokenListService()
    expect(() => list.add('')).toThrow(SyntaxError)
    expect(() => list.add('a b')).toThrow('whitespace')
  })
})

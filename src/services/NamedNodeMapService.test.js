import { NamedNodeMapService } from './NamedNodeMapService'
import { AttrService } from './AttrService'

describe('NamedNodeMapService', () => {
  test('stores attributes and finds them by name or index', () => {
    const id = new AttrService('id', 'main')
    const map = new NamedNodeMapService([id, new AttrService('title', 'hello')])
    expect(map.length).toBe(2)
    expect(map.getNamedItem('id')).toBe(id)
    expect(map.getNamedItem('missing')).toBeNull()
    expect(map.item(1).value).toBe('hello')
    expect(map.item(2)).toBeNull()
  })

  test('setNamedItem adds new attributes and replaces existing ones', () => {
    const map = new NamedNodeMapService()
    expect(map.setNamedItem(new AttrService('id', 'a'))).toBeNull()
    const replacement = new AttrService('id', 'b')
    expect(map.setNamedItem(replacement).value).toBe('a')
    expect(map.length).toBe(1)
    expect(map.getNamedItem('id')).toBe(replacement)
  })

  test('removeNamedItem removes and returns the attribute, or throws', () => {
    const map = new NamedNodeMapService([new AttrService('id', 'a')])
    expect(map.removeNamedItem('id').value).toBe('a')
    expect(map.length).toBe(0)
    expect(() => map.removeNamedItem('id')).toThrow('not found')
  })

  test('namespaced lookups use the namespace and local name', () => {
    const xlink = new AttrService('href', 'x', null, 'http://www.w3.org/1999/xlink', 'xlink')
    const map = new NamedNodeMapService([xlink])
    expect(xlink.name).toBe('xlink:href')
    expect(map.getNamedItemNS('http://www.w3.org/1999/xlink', 'href')).toBe(xlink)
    expect(map.getNamedItemNS('other', 'href')).toBeNull()
    expect(map.removeNamedItemNS('http://www.w3.org/1999/xlink', 'href')).toBe(xlink)
    expect(() => map.removeNamedItemNS('http://www.w3.org/1999/xlink', 'href')).toThrow('not found')
  })
})

import { NodeService } from './NodeService'

describe('NodeService', () => {
  test('a new node is empty, unattached and a default node', () => {
    const node = new NodeService()
    expect(node.nodeType).toBe(NodeService.DEFAULT_NODE)
    expect(node.nodeName).toBe('')
    expect(node.nodeValue).toBe('')
    expect(node.textContent).toBe('')
    expect(node.isConnected).toBe(false)
    expect(node.parentNode).toBeNull()
    expect(node.parentElement).toBeNull()
    expect(node.hasChildNodes()).toBe(false)
    expect(node.firstChild).toBeNull()
    expect(node.lastChild).toBeNull()
    expect(node.nextSibling).toBeNull()
    expect(node.previousSibling).toBeNull()
    expect(node.ownerDocument).toBeNull()
  })

  test('nodeValue and textContent can be updated', () => {
    const node = new NodeService()
    node.nodeValue = 'value'
    node.textContent = 'text'
    expect(node.nodeValue).toBe('value')
    expect(node.textContent).toBe('text')
  })

  test('appendChild adds the child and returns it', () => {
    const parent = new NodeService()
    const first = new NodeService()
    const last = new NodeService()
    expect(parent.appendChild(first)).toBe(first)
    parent.appendChild(last)
    expect(parent.hasChildNodes()).toBe(true)
    expect(parent.childNodes.length).toBe(2)
    expect(parent.firstChild).toBe(first)
    expect(parent.lastChild).toBe(last)
  })

  test('removeChild removes the child, or throws when it is not a child', () => {
    const parent = new NodeService()
    const staying = new NodeService()
    const leaving = new NodeService()
    parent.appendChild(staying)
    parent.appendChild(leaving)
    expect(parent.removeChild(leaving)).toBe(leaving)
    expect(parent.childNodes.length).toBe(1)
    expect(parent.lastChild).toBe(staying)
    expect(() => parent.removeChild(leaving)).toThrow('not a child')
    expect(() => parent.removeChild(new NodeService())).toThrow('not a child')
  })

  test('isSameNode compares identity', () => {
    const node = new NodeService()
    expect(node.isSameNode(node)).toBe(true)
    expect(node.isSameNode(new NodeService())).toBe(false)
  })

  test('the root node is the node itself when there is no parent', () => {
    const node = new NodeService()
    expect(node.getRootNode()).toBe(node)
  })

  test('namespace lookups find nothing for a plain node', () => {
    const node = new NodeService()
    expect(node.isDefaultNamespace(null)).toBe(true)
    expect(node.lookupPrefix('http://example.com')).toBeNull()
    expect(node.lookupNamespaceURI('x')).toBeNull()
  })

  test('the parts of the Node API which are not implemented yet say so', () => {
    const node = new NodeService()
    const other = new NodeService()
    expect(() => node.cloneNode(true)).toThrow('not implemented')
    expect(() => node.compareDocumentPosition(other)).toThrow('not implemented')
    expect(() => node.contains(other)).toThrow('not implemented')
    expect(() => node.insertBefore(other, null)).toThrow('not implemented')
    expect(() => node.isEqualNode(other)).toThrow('not implemented')
    expect(() => node.replaceChild(other, new NodeService())).toThrow('not implemented')
  })
})

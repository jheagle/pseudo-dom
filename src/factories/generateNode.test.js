import generateNode, { LinkedNode } from './generateNode'

describe('generateNode', () => {
  test('creates a linker class whose linkers store nodes', () => {
    const NodeLinker = generateNode()
    const { head, tail } = NodeLinker.fromArray(['a', 'b', 'c'])
    expect(head.data).toBeInstanceOf(LinkedNode)
    expect(head.data.nodeValue).toBe('a')
    expect(tail.data.nodeValue).toBe('c')
  })

  test('nodes can find their siblings through the linkers', () => {
    const { head, tail } = generateNode().fromArray(['a', 'b', 'c'])
    const [a, b, c] = [head.data, head.next.data, tail.data]
    expect(a.previousSibling).toBeNull()
    expect(a.nextSibling).toBe(b)
    expect(b.previousSibling).toBe(a)
    expect(b.nextSibling).toBe(c)
    expect(c.nextSibling).toBeNull()
  })

  test('nodes without a parent are not connected', () => {
    const { head } = generateNode().fromArray(['a'])
    expect(head.data.isConnected).toBe(false)
    expect(head.data.parentNode).toBeNull()
    expect(head.data.parentElement).toBeNull()
  })

  test('accepts objects as well as plain values', () => {
    const { head } = generateNode().fromArray([{ data: 'x' }])
    expect(head.data.nodeValue).toBe('x')
  })
})

import { NodeService } from './NodeService'
import { DocumentFragmentService } from './DocumentFragmentService'
import { DocumentService } from './DocumentService'

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

  test('the only child can be removed, leaving the node without children', () => {
    const parent = new NodeService()
    const child = new NodeService()
    parent.appendChild(child)
    expect(parent.removeChild(child)).toBe(child)
    expect(parent.hasChildNodes()).toBe(false)
    expect(parent.firstChild).toBeNull()
    expect(parent.lastChild).toBeNull()
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
    expect(() => node.isEqualNode(other)).toThrow('not implemented')
  })

  describe('the tree links', () => {
    const makeTree = () => {
      const root = new NodeService()
      const first = new NodeService()
      const second = new NodeService()
      const third = new NodeService()
      root.appendChild(first)
      root.appendChild(second)
      root.appendChild(third)
      return { root, first, second, third }
    }
    const children = node => Array.from(node.childNodes)

    test('appendChild sets the parent and the siblings of the child', () => {
      const { root, first, second, third } = makeTree()
      expect(children(root)).toEqual([first, second, third])
      expect(first.parentNode).toBe(root)
      expect(first.previousSibling).toBeNull()
      expect(first.nextSibling).toBe(second)
      expect(second.previousSibling).toBe(first)
      expect(second.nextSibling).toBe(third)
      expect(third.nextSibling).toBeNull()
      expect(root.firstChild).toBe(first)
      expect(root.lastChild).toBe(third)
    })

    test('a node without a parent has no siblings', () => {
      const alone = new NodeService()
      expect(alone.parentNode).toBeNull()
      expect(alone.previousSibling).toBeNull()
      expect(alone.nextSibling).toBeNull()
    })

    test('appending a node which is already in a tree moves it', () => {
      const { root, first, second, third } = makeTree()
      const other = new NodeService()
      other.appendChild(second)
      expect(children(root)).toEqual([first, third])
      expect(first.nextSibling).toBe(third)
      expect(third.previousSibling).toBe(first)
      expect(second.parentNode).toBe(other)
      root.appendChild(first)
      expect(children(root)).toEqual([third, first])
    })

    test('a node cannot be inserted into itself or its own descendants', () => {
      const { root, first } = makeTree()
      expect(() => root.appendChild(root)).toThrow('cannot be inserted into itself')
      expect(() => first.appendChild(root)).toThrow('cannot be inserted into itself')
      expect(children(root).length).toBe(3)
    })

    test('removeChild clears the parent and the siblings, and closes the gap', () => {
      const { root, first, second, third } = makeTree()
      expect(root.removeChild(second)).toBe(second)
      expect(second.parentNode).toBeNull()
      expect(second.previousSibling).toBeNull()
      expect(second.nextSibling).toBeNull()
      expect(first.nextSibling).toBe(third)
      expect(third.previousSibling).toBe(first)
      expect(children(root)).toEqual([first, third])
      expect(() => root.removeChild(second)).toThrow('not a child')
    })

    test('removing the first, the last and the only child', () => {
      const { root, first, second, third } = makeTree()
      root.removeChild(first)
      root.removeChild(third)
      expect(root.firstChild).toBe(second)
      expect(root.lastChild).toBe(second)
      root.removeChild(second)
      expect(root.hasChildNodes()).toBe(false)
      expect(root.firstChild).toBeNull()
    })

    test('a removed node can be added again', () => {
      const { root, second } = makeTree()
      root.removeChild(second)
      root.appendChild(second)
      expect(root.lastChild).toBe(second)
      expect(second.parentNode).toBe(root)
    })

    test('insertBefore puts the node before the reference, and at the end without one', () => {
      const { root, first, second, third } = makeTree()
      const a = new NodeService()
      const b = new NodeService()
      const c = new NodeService()
      expect(root.insertBefore(a, first)).toBe(a)
      root.insertBefore(b, third)
      root.insertBefore(c, null)
      expect(children(root)).toEqual([a, first, second, b, third, c])
      expect(a.previousSibling).toBeNull()
      expect(b.previousSibling).toBe(second)
      expect(b.nextSibling).toBe(third)
      expect(c.nextSibling).toBeNull()
    })

    test('insertBefore moves a node which is already a child', () => {
      const { root, first, second, third } = makeTree()
      root.insertBefore(third, first)
      expect(children(root)).toEqual([third, first, second])
      root.insertBefore(second, second)
      expect(children(root)).toEqual([third, first, second])
    })

    test('insertBefore throws when the reference is not a child', () => {
      const { root } = makeTree()
      expect(() => root.insertBefore(new NodeService(), new NodeService())).toThrow('not a child')
    })

    test('inserting a document fragment moves its children in order', () => {
      const { root, first, second } = makeTree()
      const fragment = new DocumentFragmentService()
      const a = new NodeService()
      const b = new NodeService()
      fragment.appendChild(a)
      fragment.appendChild(b)
      root.insertBefore(fragment, second)
      expect(children(root).slice(0, 4)).toEqual([first, a, b, second])
      expect(fragment.hasChildNodes()).toBe(false)
      expect(a.parentNode).toBe(root)
    })

    test('replaceChild puts the new node where the old one was', () => {
      const { root, first, second, third } = makeTree()
      const replacement = new NodeService()
      expect(root.replaceChild(replacement, second)).toBe(second)
      expect(children(root)).toEqual([first, replacement, third])
      expect(second.parentNode).toBeNull()
      expect(replacement.previousSibling).toBe(first)
      expect(replacement.nextSibling).toBe(third)
    })

    test('replaceChild works when the new node is the old one\'s next sibling, or is the old node', () => {
      const { root, first, second, third } = makeTree()
      root.replaceChild(third, second)
      expect(children(root)).toEqual([first, third])
      expect(root.replaceChild(first, first)).toBe(first)
      expect(children(root)).toEqual([first, third])
      expect(() => root.replaceChild(new NodeService(), new NodeService())).toThrow('not a child')
    })

    test('contains is true for the node itself and its descendants only', () => {
      const { root, first } = makeTree()
      const grandchild = new NodeService()
      first.appendChild(grandchild)
      expect(root.contains(root)).toBe(true)
      expect(root.contains(grandchild)).toBe(true)
      expect(first.contains(root)).toBe(false)
      expect(root.contains(new NodeService())).toBe(false)
      expect(root.contains(null)).toBe(false)
    })

    test('getRootNode finds the top of the tree', () => {
      const { root, first } = makeTree()
      const grandchild = new NodeService()
      first.appendChild(grandchild)
      expect(grandchild.getRootNode()).toBe(root)
    })

    test('documents and fragments are their own kind of node', () => {
      expect(new DocumentService().nodeType).toBe(NodeService.DOCUMENT_NODE)
      expect(new DocumentService().nodeName).toBe('#document')
      expect(new DocumentFragmentService().nodeType).toBe(NodeService.DOCUMENT_FRAGMENT_NODE)
      expect(new DocumentFragmentService().nodeName).toBe('#document-fragment')
    })

    test('a large tree of siblings can be built and taken apart', () => {
      const parent = new NodeService()
      const nodes = Array.from({ length: 20000 }, () => new NodeService())
      const started = Date.now()
      nodes.forEach(node => parent.appendChild(node))
      expect(parent.childNodes.length).toBe(20000)
      expect(nodes[10000].previousSibling).toBe(nodes[9999])
      nodes.forEach(node => parent.removeChild(node))
      expect(parent.hasChildNodes()).toBe(false)
      expect(Date.now() - started).toBeLessThan(3000)
    })
  })
})

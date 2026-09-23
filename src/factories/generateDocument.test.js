import generateDocument from './generateDocument'
import { NodeService } from '../services/NodeService'
import { ElementService } from '../services/ElementService'
import { HTMLElementService } from '../services/HTMLElementService'
import PseudoHTMLDocument from '../classes/PseudoHTMLDocument'

describe('generateDocument', () => {
  test('with no real document, fills document / Node / Element / HTMLElement in on root, and merges them into a separate context', () => {
    const root = {}
    const context = {}
    generateDocument(root, context)
    expect(root.document).toBeInstanceOf(PseudoHTMLDocument)
    expect(root.Node).toBeInstanceOf(NodeService)
    expect(root.Element).toBeInstanceOf(ElementService)
    expect(root.HTMLElement).toBeInstanceOf(HTMLElementService)
    expect(context.document).toBe(root.document)
  })

  test('with no context given, root is still mutated directly (context defaults to a separate object)', () => {
    const root = {}
    const result = generateDocument(root)
    expect(root.document).toBeInstanceOf(PseudoHTMLDocument)
    expect(result.document).toBe(root.document)
  })

  test('a real document already on root is kept, not replaced', () => {
    const realDocument = { real: true }
    const root = { document: realDocument }
    generateDocument(root)
    expect(root.document).toBe(realDocument)
  })

  // The real bug this covers: when root and context are the SAME object (as installGlobal(globalThis) passes),
  // and there is no real document, newWindow is root itself, so by the time the final merge step runs, context
  // (=== root === newWindow) already has everything on it - merging again is Object.assign(target, target), which
  // throws on any getter-only own property target already has. A plain object with such a property (like
  // globalThis.crypto in Node) reproduces it without needing the real global object.
  test('root and context being the same object does not throw, even when that object has a getter-only property', () => {
    const target = {}
    Object.defineProperty(target, 'readOnly', { get: () => 'kept', enumerable: true, configurable: true })
    expect(() => generateDocument(target, target)).not.toThrow()
    expect(target.document).toBeInstanceOf(PseudoHTMLDocument)
    expect(target.readOnly).toBe('kept')
  })
})

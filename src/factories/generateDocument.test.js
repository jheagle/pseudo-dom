import generateDocument from './generateDocument'
import { NodeService } from '../services/NodeService'
import { ElementService } from '../services/ElementService'
import { HTMLElementService } from '../services/HTMLElementService'
import PseudoHTMLDocument from '../classes/PseudoHTMLDocument'

describe('generateDocument', () => {
  test('with no real document, fills document / Node / Element / HTMLElement / HTMLDocument in on root, and merges them into a separate context', () => {
    const root = {}
    const context = {}
    generateDocument(root, context)
    expect(root.document).toBeInstanceOf(PseudoHTMLDocument)
    // Node / Element / HTMLElement / HTMLDocument must be the classes themselves, not instances - the right-hand
    // side of `instanceof` has to be a constructor, and real window.Node etc. are constructors too
    expect(root.Node).toBe(NodeService)
    expect(root.Element).toBe(ElementService)
    expect(root.HTMLElement).toBe(HTMLElementService)
    expect(root.HTMLDocument).toBe(PseudoHTMLDocument)
    expect(context.document).toBe(root.document)
  })

  test('document is a real instance you can use instanceof with, against the classes just installed', () => {
    const root = {}
    generateDocument(root)
    expect(root.document instanceof root.HTMLDocument).toBe(true)
    expect(root.document instanceof root.Node).toBe(true)
  })

  test('elements created through document.createElement satisfy instanceof Element / HTMLElement / Node', () => {
    const root = {}
    generateDocument(root)
    const div = root.document.createElement('div')
    expect(div instanceof root.Node).toBe(true)
    expect(div instanceof root.Element).toBe(true)
    expect(div instanceof root.HTMLElement).toBe(true)
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

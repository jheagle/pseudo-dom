import installGlobal from './installGlobal'
import { HTMLElementService } from '../services/HTMLElementService'

describe('installGlobal', () => {
  // Modern Node ships a built-in navigator.userAgent ("Node.js/24"), which browser-or-node's isJsDom check
  // (navigator.userAgent.includes('Node.js')) false-positives on - installGlobal must not depend on isJsDom,
  // only on isBrowser (which also covers real jsdom, since its window has a document too)
  test('populates document / Node / Element / HTMLElement on a plain target (no real DOM present)', () => {
    const target = {}
    installGlobal(target)
    expect(typeof target.document).not.toBe('undefined')
    expect(typeof target.Node).not.toBe('undefined')
    expect(typeof target.Element).not.toBe('undefined')
    expect(typeof target.HTMLElement).not.toBe('undefined')
    expect(target.document.createElement('div')).toBeInstanceOf(HTMLElementService)
  })

  test('Node / Element / HTMLElement / HTMLDocument are the classes themselves, so instanceof works', () => {
    const target = {}
    installGlobal(target)
    const div = target.document.createElement('div')
    expect(div instanceof target.Node).toBe(true)
    expect(div instanceof target.Element).toBe(true)
    expect(div instanceof target.HTMLElement).toBe(true)
    expect(target.document instanceof target.HTMLDocument).toBe(true)
  })

  // Some code (matrix-dom's `void 0 || window || global || {}`, for example) checks for a bare `window` before
  // falling back to `global` - without a typeof guard, that throws ReferenceError when window is not declared at
  // all, so window needs to resolve to something (a self-reference, like a real browser's) too
  test('window is a self-reference to the target, matching a real browser\'s global scope', () => {
    const target = {}
    installGlobal(target)
    expect(target.window).toBe(target)
  })

  test('does not overwrite a real window already on the target', () => {
    const realWindow = { real: true }
    const target = { window: realWindow }
    installGlobal(target)
    expect(target.window).toBe(realWindow)
  })

  test('does not overwrite a real document already on the target', () => {
    const realDocument = { real: true }
    const target = { document: realDocument }
    installGlobal(target)
    expect(target.document).toBe(realDocument)
  })

  test('returns the same target it was given', () => {
    const target = {}
    expect(installGlobal(target)).toBe(target)
  })

  test('defaults to globalThis when no target is given', () => {
    installGlobal()
    expect(typeof globalThis.document).not.toBe('undefined')
    delete globalThis.document
    delete globalThis.Node
    delete globalThis.Element
    delete globalThis.HTMLElement
    delete globalThis.HTMLDocument
    delete globalThis.window
  })
})

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
  })
})

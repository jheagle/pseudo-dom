import createStyleDeclaration from './createStyleDeclaration'
import { CSSStyleDeclarationService } from '../services/CSSStyleDeclarationService'

describe('createStyleDeclaration', () => {
  test('camelCase property access reads and writes the kebab-case declaration', () => {
    const style = createStyleDeclaration()
    style.backgroundColor = 'red'
    expect(style.getPropertyValue('background-color')).toBe('red')
    expect(style.backgroundColor).toBe('red')
  })

  test('setting to an empty string removes the property, like the DOM', () => {
    const style = createStyleDeclaration('color: red;')
    style.color = ''
    expect(style.getPropertyValue('color')).toBe('')
  })

  test('an unset camelCase property reads as empty, not undefined', () => {
    expect(createStyleDeclaration().fontSize).toBe('')
  })

  test('the real CSSStyleDeclaration methods and cssText still work through the proxy', () => {
    const style = createStyleDeclaration()
    style.setProperty('color', 'red')
    expect(style.getPropertyValue('color')).toBe('red')
    expect(style.cssText).toBe('color: red;')
    style.cssText = 'font-size: 12px;'
    expect(style.fontSize).toBe('12px')
    expect(style.length).toBe(1)
    style.removeProperty('font-size')
    expect(style.fontSize).toBe('')
  })

  test('indexed access works like the DOM\'s array-like CSSStyleDeclaration', () => {
    const style = createStyleDeclaration('color: red; font-size: 12px;')
    expect(style[0]).toBe('color')
    expect(style[1]).toBe('font-size')
  })

  test('is a real CSSStyleDeclarationService underneath', () => {
    expect(createStyleDeclaration()).toBeInstanceOf(CSSStyleDeclarationService)
  })
})

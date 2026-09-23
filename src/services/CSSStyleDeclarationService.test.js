import { CSSStyleDeclarationService } from './CSSStyleDeclarationService'

describe('CSSStyleDeclarationService', () => {
  test('parses declarations from a starting cssText', () => {
    const style = new CSSStyleDeclarationService('color: red; font-size: 12px;')
    expect(style.length).toBe(2)
    expect(style.getPropertyValue('color')).toBe('red')
    expect(style.getPropertyValue('font-size')).toBe('12px')
  })

  test('an unset property is empty, not undefined', () => {
    const style = new CSSStyleDeclarationService()
    expect(style.getPropertyValue('color')).toBe('')
    expect(style.getPropertyPriority('color')).toBe('')
  })

  test('setProperty / getPropertyValue / removeProperty', () => {
    const style = new CSSStyleDeclarationService()
    style.setProperty('color', 'blue')
    expect(style.getPropertyValue('color')).toBe('blue')
    expect(style.removeProperty('color')).toBe('blue')
    expect(style.getPropertyValue('color')).toBe('')
  })

  test('setProperty with an empty value removes the property, like the DOM', () => {
    const style = new CSSStyleDeclarationService('color: red;')
    style.setProperty('color', '')
    expect(style.getPropertyValue('color')).toBe('')
    expect(style.length).toBe(0)
  })

  test('setProperty accepts a priority', () => {
    const style = new CSSStyleDeclarationService()
    style.setProperty('color', 'red', 'important')
    expect(style.getPropertyPriority('color')).toBe('important')
    expect(style.cssText).toBe('color: red !important;')
  })

  test('cssText serializes every declaration, in the order they were set', () => {
    const style = new CSSStyleDeclarationService()
    style.setProperty('color', 'red')
    style.setProperty('font-size', '12px')
    expect(style.cssText).toBe('color: red; font-size: 12px;')
  })

  test('setting cssText replaces every declaration', () => {
    const style = new CSSStyleDeclarationService('color: red;')
    style.cssText = 'background: blue;'
    expect(style.getPropertyValue('color')).toBe('')
    expect(style.getPropertyValue('background')).toBe('blue')
  })

  test('item gives the property names in order, like an array', () => {
    const style = new CSSStyleDeclarationService('color: red; font-size: 12px;')
    expect(style.item(0)).toBe('color')
    expect(style.item(1)).toBe('font-size')
    expect(style.item(2)).toBe('')
  })
})

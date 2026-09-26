'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.camelToKebab = exports.kebabToCamel = void 0
/**
 * Wraps a CSSStyleDeclarationService in a Proxy so arbitrary camelCase CSS properties (element.style.
 * backgroundColor) work like the DOM's, on top of its real methods (getPropertyValue, setProperty, cssText, ...).
 */
const CSSStyleDeclarationService_1 = require('../services/CSSStyleDeclarationService')
const isIndex = property => /^\d+$/.test(property)
/**
 * kebab-case -> camelCase ("background-color" -> "backgroundColor").
 * @param name
 */
const kebabToCamel = name => name.replace(/-([a-z0-9])/gi, (_match, letter) => letter.toUpperCase())
exports.kebabToCamel = kebabToCamel
/**
 * camelCase -> kebab-case ("backgroundColor" -> "background-color").
 * @param name
 */
const camelToKebab = name => name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
exports.camelToKebab = camelToKebab
/**
 * A live CSSStyleDeclaration-like object: its real methods (cssText, getPropertyValue, setProperty, ...) work as
 * declared, and any other property name is treated as a camelCase CSS property (declaration.backgroundColor reads /
 * writes the "background-color" declaration), matching what a real element.style supports.
 * @param cssText Initial declarations
 */
const createStyleDeclaration = (cssText = '') => {
  const target = new CSSStyleDeclarationService_1.CSSStyleDeclarationService(cssText)
  return new Proxy(target, {
    get (declaration, property, receiver) {
      if (typeof property !== 'string') {
        return Reflect.get(declaration, property, receiver)
      }
      if (isIndex(property)) {
        return declaration.item(Number(property))
      }
      if (property in declaration) {
        return Reflect.get(declaration, property, receiver)
      }
      return declaration.getPropertyValue(camelToKebab(property))
    },
    set (declaration, property, value) {
      if (typeof property !== 'string' || property === 'cssText') {
        return Reflect.set(declaration, property, value)
      }
      declaration.setProperty(camelToKebab(property), value === null || typeof value === 'undefined' ? '' : String(value))
      return true
    },
    has (declaration, property) {
      return typeof property === 'string' && (property in declaration || declaration.getPropertyValue(camelToKebab(property)) !== '')
    }
  })
}
exports.default = createStyleDeclaration

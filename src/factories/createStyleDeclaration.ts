/**
 * Wraps a CSSStyleDeclarationService in a Proxy so arbitrary camelCase CSS properties (element.style.
 * backgroundColor) work like the DOM's, on top of its real methods (getPropertyValue, setProperty, cssText, ...).
 */
import { CSSStyleDeclarationService } from '../services/CSSStyleDeclarationService'

const isIndex = (property: string): boolean => /^\d+$/.test(property)

/**
 * kebab-case -> camelCase ("background-color" -> "backgroundColor").
 * @param name
 */
const kebabToCamel = (name: string): string => name.replace(/-([a-z0-9])/gi, (_match: string, letter: string): string => letter.toUpperCase())

/**
 * camelCase -> kebab-case ("backgroundColor" -> "background-color").
 * @param name
 */
const camelToKebab = (name: string): string => name.replace(/[A-Z]/g, (letter: string): string => `-${letter.toLowerCase()}`)

/**
 * A live CSSStyleDeclaration-like object: its real methods (cssText, getPropertyValue, setProperty, ...) work as
 * declared, and any other property name is treated as a camelCase CSS property (declaration.backgroundColor reads /
 * writes the "background-color" declaration), matching what a real element.style supports.
 * @param cssText Initial declarations
 */
const createStyleDeclaration = (cssText: string = ''): CSSStyleDeclarationService => {
  const target: CSSStyleDeclarationService = new CSSStyleDeclarationService(cssText)
  return new Proxy(target, {
    get (declaration: CSSStyleDeclarationService, property: string | symbol, receiver: any): any {
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
    set (declaration: CSSStyleDeclarationService, property: string | symbol, value: any): boolean {
      if (typeof property !== 'string' || property === 'cssText') {
        return Reflect.set(declaration, property, value)
      }
      declaration.setProperty(camelToKebab(property), value === null || typeof value === 'undefined' ? '' : String(value))
      return true
    },
    has (declaration: CSSStyleDeclarationService, property: string | symbol): boolean {
      return typeof property === 'string' && (property in declaration || declaration.getPropertyValue(camelToKebab(property)) !== '')
    }
  }) as unknown as CSSStyleDeclarationService
}

export { kebabToCamel, camelToKebab }
export default createStyleDeclaration

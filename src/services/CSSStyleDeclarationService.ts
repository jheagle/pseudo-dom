/**
 * Substitute for the DOM CSSStyleDeclaration Class (the object behind Element.style).
 */

type StyleEntry = { value: string, priority: string }

/**
 * Simulate the behaviour of the CSSStyleDeclaration Class when there is no DOM available: an ordered map of CSS
 * property/value pairs, parsed from and serialized back to a cssText string. Values are stored and returned as
 * given, with no unit conversion, shorthand expansion or validation - this is a data structure, not a real CSS
 * engine. Named property access (declaration.backgroundColor, camelCase) is added on top of this by
 * createStyleDeclaration, which wraps an instance of this class in a Proxy.
 */
export class CSSStyleDeclarationService {
  private readonly properties: Map<string, StyleEntry> = new Map()

  /**
   * @param cssText Initial declarations, as CSS text ("color: red; font-size: 12px;")
   */
  constructor (cssText: string = '') {
    this.cssText = cssText
  }

  /**
   * How many properties are currently set.
   */
  get length (): number {
    return this.properties.size
  }

  /**
   * The name of the property at the given index, in the order it was set, or '' when there is none (matches the
   * DOM's CSSStyleDeclaration, which is array-like).
   * @param index
   */
  item (index: number): string {
    return Array.from(this.properties.keys())[index] || ''
  }

  /**
   * The value of the given property, or '' when it is not set.
   * @param property A CSS property name (kebab-case, e.g. "background-color")
   */
  getPropertyValue (property: string): string {
    const entry: StyleEntry | undefined = this.properties.get(property)
    return entry ? entry.value : ''
  }

  /**
   * "important" when the property was set with !important, otherwise ''.
   * @param property A CSS property name (kebab-case)
   */
  getPropertyPriority (property: string): string {
    const entry: StyleEntry | undefined = this.properties.get(property)
    return entry ? entry.priority : ''
  }

  /**
   * Set a property's value (and optionally its priority). An empty, null or undefined value removes the property
   * instead, like the DOM.
   * @param property A CSS property name (kebab-case)
   * @param value The value, or '' to remove the property
   * @param priority "important" to mark it !important
   */
  setProperty (property: string, value: string, priority: string = ''): void {
    if (value === '' || value === null || typeof value === 'undefined') {
      this.removeProperty(property)
      return
    }
    this.properties.set(property, { value: String(value), priority })
  }

  /**
   * Remove a property, returning the value it had (or '' when it was not set).
   * @param property A CSS property name (kebab-case)
   */
  removeProperty (property: string): string {
    const value: string = this.getPropertyValue(property)
    this.properties.delete(property)
    return value
  }

  /**
   * All the declarations as one CSS text string.
   */
  get cssText (): string {
    return Array.from(this.properties.entries())
      .map(([property, { value, priority }]: [string, StyleEntry]) => `${property}: ${value}${priority ? ` !${priority}` : ''};`)
      .join(' ')
  }

  /**
   * Replace every declaration by parsing a CSS text string ("color: red; font-size: 12px !important;").
   * @param cssText
   */
  set cssText (cssText: string) {
    this.properties.clear()
    String(cssText || '').split(';').forEach((declaration: string) => {
      const colon: number = declaration.indexOf(':')
      if (colon < 0) {
        return
      }
      const property: string = declaration.slice(0, colon).trim()
      let value: string = declaration.slice(colon + 1).trim()
      let priority: string = ''
      const important: RegExpMatchArray | null = value.match(/!\s*important\s*$/i)
      if (important && typeof important.index === 'number') {
        priority = 'important'
        value = value.slice(0, important.index).trim()
      }
      if (property && value) {
        this.properties.set(property, { value, priority })
      }
    })
  }
}

export default CSSStyleDeclarationService

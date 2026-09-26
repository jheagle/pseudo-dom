/**
 * Substitute for the DOM CSSStyleDeclaration Class. Real instances (from createStyleDeclaration) also accept
 * arbitrary camelCase CSS property names (declaration.backgroundColor), which cannot be expressed in an interface.
 */
export interface PseudoCSSStyleDeclaration {
  get length (): number

  get cssText (): string

  set cssText (cssText: string)

  item (index: number): string

  getPropertyValue (property: string): string

  getPropertyPriority (property: string): string

  setProperty (property: string, value: string, priority: string): void

  removeProperty (property: string): string
}

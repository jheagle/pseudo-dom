/**
 * Wraps a CSSStyleDeclarationService in a Proxy so arbitrary camelCase CSS properties (element.style.
 * backgroundColor) work like the DOM's, on top of its real methods (getPropertyValue, setProperty, cssText, ...).
 */
import { CSSStyleDeclarationService } from '../services/CSSStyleDeclarationService';
/**
 * kebab-case -> camelCase ("background-color" -> "backgroundColor").
 * @param name
 */
declare const kebabToCamel: (name: string) => string;
/**
 * camelCase -> kebab-case ("backgroundColor" -> "background-color").
 * @param name
 */
declare const camelToKebab: (name: string) => string;
/**
 * A live CSSStyleDeclaration-like object: its real methods (cssText, getPropertyValue, setProperty, ...) work as
 * declared, and any other property name is treated as a camelCase CSS property (declaration.backgroundColor reads /
 * writes the "background-color" declaration), matching what a real element.style supports.
 * @param cssText Initial declarations
 */
declare const createStyleDeclaration: (cssText?: string) => CSSStyleDeclarationService;
export { kebabToCamel, camelToKebab };
export default createStyleDeclaration;

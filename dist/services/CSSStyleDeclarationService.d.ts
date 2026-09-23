/**
 * @file Substitute for the DOM CSSStyleDeclaration Class (the object behind Element.style).
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
/**
 * Simulate the behaviour of the CSSStyleDeclaration Class when there is no DOM available: an ordered map of CSS
 * property/value pairs, parsed from and serialized back to a cssText string. Values are stored and returned as
 * given, with no unit conversion, shorthand expansion or validation - this is a data structure, not a real CSS
 * engine. Named property access (declaration.backgroundColor, camelCase) is added on top of this by
 * createStyleDeclaration, which wraps an instance of this class in a Proxy.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
export declare class CSSStyleDeclarationService {
    private readonly properties;
    /**
     * @param {string} [cssText=''] Initial declarations, as CSS text ("color: red; font-size: 12px;")
     * @constructor
     */
    constructor(cssText?: string);
    /**
     * How many properties are currently set.
     * @returns {number}
     */
    get length(): number;
    /**
     * The name of the property at the given index, in the order it was set, or '' when there is none (matches the
     * DOM's CSSStyleDeclaration, which is array-like).
     * @param {number} index
     * @returns {string}
     */
    item(index: number): string;
    /**
     * The value of the given property, or '' when it is not set.
     * @param {string} property A CSS property name (kebab-case, e.g. "background-color")
     * @returns {string}
     */
    getPropertyValue(property: string): string;
    /**
     * "important" when the property was set with !important, otherwise ''.
     * @param {string} property A CSS property name (kebab-case)
     * @returns {string}
     */
    getPropertyPriority(property: string): string;
    /**
     * Set a property's value (and optionally its priority). An empty, null or undefined value removes the property
     * instead, like the DOM.
     * @param {string} property A CSS property name (kebab-case)
     * @param {string} value The value, or '' to remove the property
     * @param {string} [priority=''] "important" to mark it !important
     * @returns {undefined}
     */
    setProperty(property: string, value: string, priority?: string): void;
    /**
     * Remove a property, returning the value it had (or '' when it was not set).
     * @param {string} property A CSS property name (kebab-case)
     * @returns {string}
     */
    removeProperty(property: string): string;
    /**
     * All the declarations as one CSS text string.
     * @returns {string}
     */
    get cssText(): string;
    /**
     * Replace every declaration by parsing a CSS text string ("color: red; font-size: 12px !important;").
     * @param {string} cssText
     * @returns {undefined}
     */
    set cssText(cssText: string);
}
export default CSSStyleDeclarationService;

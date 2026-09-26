/**
 * Substitute for the DOM CSSStyleDeclaration Class (the object behind Element.style).
 */
/**
 * Simulate the behaviour of the CSSStyleDeclaration Class when there is no DOM available: an ordered map of CSS
 * property/value pairs, parsed from and serialized back to a cssText string. Values are stored and returned as
 * given, with no unit conversion, shorthand expansion or validation - this is a data structure, not a real CSS
 * engine. Named property access (declaration.backgroundColor, camelCase) is added on top of this by
 * createStyleDeclaration, which wraps an instance of this class in a Proxy.
 */
export declare class CSSStyleDeclarationService {
    private readonly properties;
    /**
     * @param cssText Initial declarations, as CSS text ("color: red; font-size: 12px;")
     */
    constructor(cssText?: string);
    /**
     * How many properties are currently set.
     */
    get length(): number;
    /**
     * The name of the property at the given index, in the order it was set, or '' when there is none (matches the
     * DOM's CSSStyleDeclaration, which is array-like).
     * @param index
     */
    item(index: number): string;
    /**
     * The value of the given property, or '' when it is not set.
     * @param property A CSS property name (kebab-case, e.g. "background-color")
     */
    getPropertyValue(property: string): string;
    /**
     * "important" when the property was set with !important, otherwise ''.
     * @param property A CSS property name (kebab-case)
     */
    getPropertyPriority(property: string): string;
    /**
     * Set a property's value (and optionally its priority). An empty, null or undefined value removes the property
     * instead, like the DOM.
     * @param property A CSS property name (kebab-case)
     * @param value The value, or '' to remove the property
     * @param priority "important" to mark it !important
     */
    setProperty(property: string, value: string, priority?: string): void;
    /**
     * Remove a property, returning the value it had (or '' when it was not set).
     * @param property A CSS property name (kebab-case)
     */
    removeProperty(property: string): string;
    /**
     * All the declarations as one CSS text string.
     */
    get cssText(): string;
    /**
     * Replace every declaration by parsing a CSS text string ("color: red; font-size: 12px !important;").
     * @param cssText
     */
    set cssText(cssText: string);
}
export default CSSStyleDeclarationService;

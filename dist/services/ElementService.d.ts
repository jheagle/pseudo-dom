/**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoNode } from '../interfaces/PseudoNode';
import { NodeService } from './NodeService';
import { PseudoElement } from '../interfaces/PseudoElement';
import { PseudoNamedNodeMap } from '../interfaces/PseudoNamedNodeMap';
import { PseudoDOMTokenList } from '../interfaces/PseudoDOMTokenList';
type attribute = {
    name: string;
    value: any;
};
/**
 * Simulate the behaviour of the Element Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoNode
 * @property {string} tagName
 * @property {string} className
 * @property {string} id
 * @property {string} innerHtml
 * @property {Array} attributes
 * @property {function} hasAttribute
 * @property {function} setAttribute
 * @property {function} getAttribute
 * @property {function} removeAttribute
 */
export declare class ElementService extends NodeService implements Partial<PseudoElement> {
    id: string;
    innerHTML: string;
    type: string;
    private readonly tag;
    private readonly attributeList;
    private readonly propertyAttributes;
    private readonly tokenList;
    private defaultEventApplied;
    /**
     * @param {Object} [settings={}]
     * @param {string} [settings.tagName=''] The name of the tag this element represents
     * @param {Array<{name: string, value: *}>} [settings.attributes=[]] The attributes (also assigned as properties) to start with
     * @param {PseudoNode|null} [settings.parent=null] The node to add this element to as its last child
     * @param {Array<PseudoNode>} [settings.children=[]] The nodes to start as children
     * @constructor
     */
    constructor({ tagName, attributes, parent, children }?: {
        tagName?: string;
        attributes?: Array<attribute>;
        parent?: PseudoNode | null;
        children?: Array<any>;
    });
    get tagName(): string;
    get nodeType(): number;
    get attributes(): PseudoNamedNodeMap;
    get classList(): PseudoDOMTokenList;
    get className(): string;
    set className(className: string);
    /**
     * Some elements have default behaviour, this registers it when the element is added.
     * @returns {Function}
     */
    applyDefaultEvent(): Function;
    /**
     * An element which is added as a child gets its default events (for example a submit button submits its form).
     * @param {NodeService} child The node which was inserted
     */
    protected childInserted(child: NodeService): void;
    /**
     * Check whether the element has an attribute by that name.
     * @param {string} attributeName
     * @returns {boolean}
     */
    hasAttribute(attributeName: string): boolean;
    /**
     * Set the value of an attribute, adding the attribute if it did not exist.
     * @param {string} attributeName
     * @param {string} attributeValue
     * @returns {undefined}
     */
    setAttribute(attributeName: string, attributeValue: string): void;
    /**
     * Retrieve the value of an attribute.
     * @param {string} attributeName
     * @returns {string|null} The value, or null when there is no such attribute
     */
    getAttribute(attributeName: string): string | null;
    /**
     * Remove an attribute from the element.
     * @param {string} attributeName
     * @returns {undefined}
     */
    removeAttribute(attributeName: string): void;
}
export {};

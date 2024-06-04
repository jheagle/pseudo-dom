/**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import { PseudoNode } from '../interfaces/PseudoNode';
import { NodeService } from './NodeService';
import { PseudoElement } from '../interfaces/PseudoElement';
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
export declare class ElementService extends NodeService implements PseudoElement {
    private readonly tagName;
    private attributes;
    private classList;
    private className;
    private type;
    /**
     * Simulate the Element object when the Dom is not available
     * @param {Object} [elementOptions={}]
     * @param {string} [elementOptions.tagName='']
     * @param {array} [elementOptions.attributes=[]]
     * @param {PseudoNode|Object} [elementOptions.parent={}]
     * @param {Array} [elementOptions.children=[]]
     * @constructor
     */
    constructor({ tagName, attributes, parent, children }?: {
        tagName?: string;
        attributes?: Array<any>;
        parent?: PseudoNode | null;
        children?: Array<any>;
    });
    get nodeType(): any;
    /**
     *
     * @returns {Function}
     */
    applyDefaultEvent(): Function;
    /**
     *
     * @param {PseudoNode|ElementService} childElement
     * @returns {PseudoNode}
     */
    appendChild(childElement: ElementService): PseudoNode;
    /**
     * Check if an attribute is assigned to this element.
     * @param {string} attributeName - The attribute name to check
     * @returns {boolean}
     */
    hasAttribute(attributeName: string): boolean;
    /**
     * Assign a new attribute or overwrite an assigned attribute with name and value.
     * @param {string} attributeName - The name key of the attribute to append
     * @param {string|Object} attributeValue - The value of the attribute to append
     * @returns {undefined}
     */
    setAttribute(attributeName: keyof ElementService, attributeValue: string | object): undefined;
    /**
     * Retrieve the value of the specified attribute from the Element
     * @param {string} attributeName - A string representing the name of the attribute to be retrieved
     * @returns {string|Object}
     */
    getAttribute(attributeName: string): string | object;
    /**
     * Remove an assigned attribute from the Element
     * @param {string} attributeName - The string name of the attribute to be removed
     * @returns {null}
     */
    removeAttribute(attributeName: keyof ElementService): null;
}

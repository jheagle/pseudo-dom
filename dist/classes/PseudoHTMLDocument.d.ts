/**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
/**
 *
 * @type {PseudoHTMLElement}
 */
import PseudoHTMLElement from '../interfaces/PseudoHTMLElement';
/**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
 */
declare class PseudoHTMLDocument extends PseudoHTMLElement {
    private head;
    private body;
    /**
     * The root HTML element is acts as the parent to all HTML elements in the document.
     * @constructor
     */
    constructor();
    /**
     * Create and return a PseudoHTMLElement
     * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
     * @returns {PseudoHTMLElement}
     */
    createElement(tagName?: string): PseudoHTMLElement;
}
export default PseudoHTMLDocument;

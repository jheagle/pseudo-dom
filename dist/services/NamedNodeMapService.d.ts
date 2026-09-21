import { PseudoNamedNodeMap } from '../interfaces/PseudoNamedNodeMap';
import { PseudoAttr } from '../interfaces/PseudoAttr';
/**
 * Simulate the behaviour of the NamedNodeMap Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
export declare class NamedNodeMapService implements PseudoNamedNodeMap {
    private attributes;
    /**
     * @param {Array<PseudoAttr>} [attributes=[]] The attributes to start with
     * @constructor
     */
    constructor(attributes?: Array<PseudoAttr>);
    get length(): number;
    getNamedItem(name: string): PseudoAttr | null;
    setNamedItem(attr: PseudoAttr): PseudoAttr | null;
    removeNamedItem(attrName: string): PseudoAttr;
    item(index: number): PseudoAttr | null;
    getNamedItemNS(namespace: string, localName: string): PseudoAttr | null;
    setNamedItemNS(attr: PseudoAttr): PseudoAttr | null;
    removeNamedItemNS(namespace: string, localName: string): PseudoAttr;
}

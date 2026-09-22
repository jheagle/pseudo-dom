import { PseudoAttr } from '../interfaces/PseudoAttr';
import { PseudoElement } from '../interfaces/PseudoElement';
import { NodeService } from './NodeService';
/**
 * Simulate the behaviour of the Attr Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments NodeService
 */
export declare class AttrService extends NodeService implements PseudoAttr {
    value: string;
    private readonly attributeName;
    private readonly element;
    private readonly namespace;
    private readonly namespacePrefix;
    /**
     * @param {string} name The name of the attribute
     * @param {string} [value=''] The value of the attribute
     * @param {PseudoElement|null} [ownerElement=null] The element which has this attribute
     * @param {string} [namespaceURI=''] The namespace of the attribute
     * @param {string|null} [prefix=null] The namespace prefix of the attribute
     * @constructor
     */
    constructor(name?: string, value?: string, ownerElement?: PseudoElement | null, namespaceURI?: string, prefix?: string | null);
    protected get acceptsChildren(): boolean;
    get nodeValue(): string | null;
    set nodeValue(value: string | null);
    get textContent(): string | null;
    set textContent(text: string | null);
    protected cloneShallow(): NodeService;
    get nodeType(): number;
    get localName(): string;
    get name(): string;
    get namespaceURI(): string;
    get ownerElement(): PseudoElement | null;
    get prefix(): string | null;
}

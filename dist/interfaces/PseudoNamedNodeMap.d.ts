import { PseudoAttr } from './PseudoAttr';
export interface PseudoNamedNodeMap {
    get length(): number;
    getNamedItem(name: string): PseudoAttr;
    setNamedItem(attr: PseudoAttr): PseudoAttr | null;
    removeNamedItem(attrName: string): PseudoAttr;
    item(index: number): PseudoAttr | null;
    getNamedItemNS(namespace: string, localName: string): PseudoAttr | null;
    setNamedItemNS(attr: PseudoAttr): PseudoAttr | null;
    removeNamedItem(namespace: string, localName: string): PseudoAttr;
}

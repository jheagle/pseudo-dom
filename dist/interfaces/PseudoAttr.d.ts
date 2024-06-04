import { PseudoNode } from './PseudoNode';
import { PseudoElement } from './PseudoElement';
export interface PseudoAttr extends PseudoNode {
    get localName(): string;
    get name(): string;
    get namespaceURI(): string;
    get ownerElement(): PseudoElement | null;
    get prefix(): string | null;
    get value(): string;
    set value(value: string);
}

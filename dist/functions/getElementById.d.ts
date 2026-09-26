import { NodeService } from '../services/NodeService';
import { PseudoElement } from '../interfaces/PseudoElement';
/**
 * The first element, in tree order, below (not including) the given node whose id matches the given value, or null
 * when there is none. Shared by Document and DocumentFragment, which both implement the DOM's NonElementParentNode
 * mixin (so ShadowRoot, a DocumentFragment, gets it too).
 * @param root The node to search below
 * @param id
 */
declare const getElementById: (root: NodeService, id: string) => PseudoElement | null;
export default getElementById;

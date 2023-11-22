/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
import LinkedTreeList from 'collect-your-stuff/dist/collections/linked-tree-list/LinkedTreeList';
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker';
import PseudoNode from './PseudoNode';
declare class PseudoNodeList extends LinkedTreeList {
    get entries(): TreeLinker[];
    get keys(): () => IterableIterator<number>;
    get values(): () => IterableIterator<PseudoNode>;
}
export default PseudoNodeList;

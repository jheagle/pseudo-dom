import { PseudoNodeList } from '../classes/PseudoNodeList';
import { TreeLinker } from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker';
/**
 * Create a PseudoNodeList, optionally starting from an existing chain of linkers.
 * @param innerList
 */
declare const generateNodeList: (innerList?: TreeLinker | null) => PseudoNodeList;
export default generateNodeList;

import PseudoNodeList from '../classes/PseudoNodeList'
import TreeLinker from 'collect-your-stuff/dist/collections/linked-tree-list/TreeLinker'

const generateNodeList = (innerList: TreeLinker | null = null) => (new PseudoNodeList()).initialize(innerList)

export default generateNodeList

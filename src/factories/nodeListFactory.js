import PseudoNodeList from '../classes/PseudoNodeList'

const nodeListFactory = innerList => {
  return (new PseudoNodeList()).initialize(innerList)
}

export default nodeListFactory

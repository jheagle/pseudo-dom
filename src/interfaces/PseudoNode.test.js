import { logObject } from 'test-filesystem'
import { NodeService } from '../services/NodeService'

class GenericNode extends NodeService {}

const testNode = new GenericNode()

describe('PseudoNode', () => {
  test('what does it even do', () => {
    logObject(testNode, 'pseudoNode')
  })
})

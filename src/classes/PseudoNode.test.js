import PseudoNode from './PseudoNode'
import { logObject } from 'test-filesystem'

describe('PseudoNode', () => {
  test('what does it even do', () => {
    const pseudoNode = new PseudoNode()
    logObject(pseudoNode, 'pseudoNode')
  })
})

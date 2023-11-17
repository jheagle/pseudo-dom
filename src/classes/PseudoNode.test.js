import PseudoNode from './PseudoNode'
import { logObject } from 'js-build-tools/functions/testHelpers'

describe('PseudoNode', () => {
  test('what does it even do', () => {
    const pseudoNode = new PseudoNode()
    logObject(pseudoNode, 'pseudoNode')
  })
})

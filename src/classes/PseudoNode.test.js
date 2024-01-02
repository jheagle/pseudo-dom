import PseudoNode from './PseudoNode'
import { logObject } from 'js-build-tools/functions/testHelpers'

describe('PseudoNode', () => {
  test('create generic node', () => {
    const pseudoNode = new PseudoNode()
    logObject(pseudoNode, 'pseudoNode')
  })
})

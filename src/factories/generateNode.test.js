import { logObject } from 'js-build-tools/functions/testHelpers'
import generateNode from './generateNode'
import PseudoNode from '../classes/PseudoNode'

describe('generateNode', () => {
  test('what does it even do', () => {
    const nodeFactory = generateNode()
    const generatedNode = new nodeFactory({ data: { nodeValue: 'one', nodeType: PseudoNode.TEXT_NODE } })
    logObject(generatedNode, 'generatedNode')
  })
})

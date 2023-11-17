import { logObject } from 'js-build-tools/functions/testHelpers'
import generateNode from './generateNode'

describe('generateNode', () => {
  test('what does it even do', () => {
    const generatedNode = generateNode()
    logObject(generatedNode, 'generatedNode')
  })
})

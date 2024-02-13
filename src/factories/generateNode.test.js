import { logObject } from 'test-filesystem'
import generateNode from './generateNode'

describe('generateNode', () => {
  test('what does it even do', () => {
    const generatedNode = generateNode()
    logObject(generatedNode, 'generatedNode')
  })
})

import getParentNodes from './getParentNodes'
import getParentNodesFromAttribute from './getParentNodesFromAttribute'
import { ElementService } from '../services/ElementService'

const makeChain = () => {
  const html = new ElementService({ tagName: 'html' })
  const form = new ElementService({ tagName: 'form' })
  const div = new ElementService({ tagName: 'div' })
  const input = new ElementService({ tagName: 'input' })
  html.appendChild(form)
  form.appendChild(div)
  div.appendChild(input)
  return { html, form, div, input }
}

describe('getParentNodes', () => {
  test('gives the ancestors starting with the root and ending with the parent', () => {
    const { html, form, div, input } = makeChain()
    expect(getParentNodes(input)).toEqual([html, form, div])
    expect(getParentNodes(div)).toEqual([html, form])
  })

  test('gives nothing for a node without a parent', () => {
    const { html } = makeChain()
    expect(getParentNodes(html)).toEqual([])
    expect(getParentNodes(new ElementService())).toEqual([])
  })
})

describe('getParentNodesFromAttribute', () => {
  test('gives the ancestors which have the value for the property', () => {
    const { form, input } = makeChain()
    expect(getParentNodesFromAttribute('tagName', 'form', input)).toEqual([form])
    expect(getParentNodesFromAttribute('tagName', 'table', input)).toEqual([])
  })

  test('treats a missing property as false', () => {
    const { html, form, div, input } = makeChain()
    expect(getParentNodesFromAttribute('doesNotExist', false, input)).toEqual([html, form, div])
  })

  test('gives nothing for a node without a parent', () => {
    expect(getParentNodesFromAttribute('tagName', 'form', new ElementService())).toEqual([])
  })
})

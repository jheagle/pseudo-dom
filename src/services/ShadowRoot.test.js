import { ElementService } from './ElementService'
import { ShadowRootService } from './ShadowRootService'

describe('attachShadow / shadowRoot', () => {
  test('attachShadow returns a ShadowRoot, hosted on the element', () => {
    const div = new ElementService({ tagName: 'div' })
    const root = div.attachShadow({ mode: 'open' })
    expect(root).toBeInstanceOf(ShadowRootService)
    expect(root.host).toBe(div)
    expect(root.mode).toBe('open')
  })

  test('an open shadow root is reachable via element.shadowRoot', () => {
    const div = new ElementService({ tagName: 'div' })
    const root = div.attachShadow({ mode: 'open' })
    expect(div.shadowRoot).toBe(root)
  })

  test('a closed shadow root exists, but is not reachable via element.shadowRoot', () => {
    const div = new ElementService({ tagName: 'div' })
    div.attachShadow({ mode: 'closed' })
    expect(div.shadowRoot).toBeNull()
  })

  test('an element without a shadow root has shadowRoot null', () => {
    expect(new ElementService({ tagName: 'div' }).shadowRoot).toBeNull()
  })

  test('attaching a second shadow root throws, like the DOM', () => {
    const div = new ElementService({ tagName: 'div' })
    div.attachShadow({ mode: 'open' })
    expect(() => div.attachShadow({ mode: 'open' })).toThrow()
  })

  test('the shadow root is a real DocumentFragment: nodes can be appended to it', () => {
    const div = new ElementService({ tagName: 'div' })
    const root = div.attachShadow({ mode: 'open' })
    const child = new ElementService({ tagName: 'span' })
    root.appendChild(child)
    expect(Array.from(root.childNodes)).toEqual([child])
  })
})

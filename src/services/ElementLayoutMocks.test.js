import { ElementService } from './ElementService'
import { HTMLElementService } from './HTMLElementService'

describe('client / scroll dimensions', () => {
  test('default to 0, and are directly settable (there is no layout engine here)', () => {
    const div = new ElementService({ tagName: 'div' })
    expect([div.clientHeight, div.clientLeft, div.clientTop, div.clientWidth, div.scrollHeight, div.scrollWidth])
      .toEqual([0, 0, 0, 0, 0, 0])
    div.clientHeight = 100
    div.clientWidth = 200
    expect(div.clientHeight).toBe(100)
    expect(div.clientWidth).toBe(200)
  })
})

describe('scrollLeft / scrollTop, scroll / scrollTo / scrollBy', () => {
  test('scroll / scrollTo set an absolute position, from two numbers', () => {
    const div = new ElementService({ tagName: 'div' })
    div.scroll(10, 20)
    expect([div.scrollLeft, div.scrollTop]).toEqual([10, 20])
    div.scrollTo(5, 6)
    expect([div.scrollLeft, div.scrollTop]).toEqual([5, 6])
  })

  test('scroll accepts an options object, setting only what it is given', () => {
    const div = new ElementService({ tagName: 'div' })
    div.scroll({ left: 10, top: 20 })
    div.scroll({ top: 99 })
    expect([div.scrollLeft, div.scrollTop]).toEqual([10, 99])
  })

  test('scrollBy adds a delta to the current position', () => {
    const div = new ElementService({ tagName: 'div' })
    div.scroll(10, 20)
    div.scrollBy(1, 2)
    expect([div.scrollLeft, div.scrollTop]).toEqual([11, 22])
    div.scrollBy({ left: 5 })
    expect([div.scrollLeft, div.scrollTop]).toEqual([16, 22])
  })

  test('scrollIntoView does nothing but does not throw (no real viewport to scroll)', () => {
    expect(() => new ElementService({ tagName: 'div' }).scrollIntoView()).not.toThrow()
  })
})

describe('getBoundingClientRect / getClientRects / getAnimations / checkVisibility', () => {
  test('default to sensible empty values', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.getBoundingClientRect()).toEqual({ x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 })
    expect(div.getClientRects()).toEqual([])
    expect(div.getAnimations()).toEqual([])
    expect(div.checkVisibility()).toBe(true)
  })

  test('are settable directly, and the methods return what was set', () => {
    const div = new ElementService({ tagName: 'div' })
    div.boundingClientRect = { x: 1, y: 2, width: 3, height: 4, top: 2, right: 4, bottom: 6, left: 1 }
    div.clientRects = [{ width: 3, height: 4 }]
    div.animations = [{ playState: 'running' }]
    div.isVisible = false
    expect(div.getBoundingClientRect().width).toBe(3)
    expect(div.getClientRects()).toEqual([{ width: 3, height: 4 }])
    expect(div.getAnimations()).toEqual([{ playState: 'running' }])
    expect(div.checkVisibility()).toBe(false)
  })
})

describe('computedStyleMap', () => {
  test('reflects the element\'s own inline style (style itself is HTMLElement-only)', () => {
    const div = new HTMLElementService({ tagName: 'div' })
    div.style.color = 'red'
    expect(div.computedStyleMap().get('color')).toBe('red')
    expect(div.computedStyleMap().get('font-size')).toBeUndefined()
  })

  test('a plain Element (no style) does not throw', () => {
    expect(() => new ElementService({ tagName: 'div' }).computedStyleMap().get('color')).not.toThrow()
    expect(new ElementService({ tagName: 'div' }).computedStyleMap().get('color')).toBeUndefined()
  })
})

describe('pointer capture', () => {
  test('set / has / release track capture per pointer id', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.hasPointerCapture(1)).toBe(false)
    div.setPointerCapture(1)
    expect(div.hasPointerCapture(1)).toBe(true)
    expect(div.hasPointerCapture(2)).toBe(false)
    div.releasePointerCapture(1)
    expect(div.hasPointerCapture(1)).toBe(false)
  })
})

describe('requestFullscreen / requestPointerLock', () => {
  test('resolve, like a browser granting the request would', async () => {
    const div = new ElementService({ tagName: 'div' })
    await expect(div.requestFullscreen()).resolves.toBeUndefined()
    await expect(div.requestPointerLock()).resolves.toBeUndefined()
  })
})

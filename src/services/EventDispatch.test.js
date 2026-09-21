import { EventService } from './EventService'
import { NodeService } from './NodeService'
import EventTargetService from './EventTargetService'
import { ElementService } from './ElementService'

// Events which bubble and can be cancelled, since the events of the DOM do neither unless they are asked to
const bubbling = (type = 'click', options = {}) => new EventService(type, Object.assign({ bubbles: true, cancelable: true }, options))

// root > parent > target, each recording what happened to the events they hear
const makeTree = () => {
  const root = new NodeService()
  const parent = new NodeService()
  const target = new NodeService()
  root.appendChild(parent)
  parent.appendChild(target)
  const log = []
  const names = new Map([[root, 'root'], [parent, 'parent'], [target, 'target']])
  const listen = (node, options = false, label = '') => node.addEventListener('click', function (event) {
    log.push(`${names.get(node)}${label} ${event.eventPhase} ${names.get(event.currentTarget)}`)
  }, options)
  return { root, parent, target, log, listen, names }
}

describe('dispatching an event through the tree', () => {
  test('capture listeners run from the root down, then the target, then the others from the parent up', () => {
    const { root, parent, target, log, listen } = makeTree()
    ;[root, parent, target].forEach(node => {
      listen(node, true, ':capture')
      listen(node, false, ':bubble')
    })
    target.dispatchEvent(bubbling())
    expect(log).toEqual([
      'root:capture 1 root',
      'parent:capture 1 parent',
      'target:capture 2 target',
      'target:bubble 2 target',
      'parent:bubble 3 parent',
      'root:bubble 3 root'
    ])
  })

  test('the event does not bubble when it is not a bubbling event', () => {
    const { root, parent, target, log, listen } = makeTree()
    ;[root, parent, target].forEach(node => listen(node, false))
    target.dispatchEvent(bubbling('click', { bubbles: false }))
    expect(log).toEqual(['target 2 target'])
    ;[root, parent, target].forEach(node => listen(node, true, ':capture'))
    log.length = 0
    target.dispatchEvent(bubbling('click', { bubbles: false }))
    expect(log).toEqual(['root:capture 1 root', 'parent:capture 1 parent', 'target:capture 2 target', 'target 2 target'])
  })

  test('the event knows its target, its phase and its path while it is dispatched', () => {
    const { root, parent, target } = makeTree()
    const seen = []
    parent.addEventListener('click', event => seen.push([event.target, event.currentTarget, event.eventPhase, event.composedPath()]))
    const event = bubbling()
    target.dispatchEvent(event)
    expect(seen).toEqual([[target, parent, EventService.BUBBLING_PHASE, [target, parent, root]]])
  })

  test('afterwards the event has no phase, no current target and no path, and can be dispatched again', () => {
    const { target, parent } = makeTree()
    let count = 0
    parent.addEventListener('click', () => count++)
    const event = bubbling()
    target.dispatchEvent(event)
    expect(event.eventPhase).toBe(EventService.NONE)
    expect(event.currentTarget).toBeNull()
    expect(event.composedPath()).toEqual([])
    expect(event.target).toBe(target)
    target.dispatchEvent(event)
    expect(count).toBe(2)
  })

  test('an event cannot be dispatched again while it is being dispatched', () => {
    const { target } = makeTree()
    const event = bubbling()
    let error
    target.addEventListener('click', () => {
      try {
        target.dispatchEvent(event)
      } catch (caught) {
        error = caught
      }
    })
    target.dispatchEvent(event)
    expect(error.message).toBe('The event is already being dispatched.')
  })

  test('stopPropagation stops the event reaching other targets but not the rest of the current target', () => {
    const { root, parent, target, log, listen } = makeTree()
    listen(root, false)
    parent.addEventListener('click', event => event.stopPropagation())
    listen(parent, false, ':second')
    listen(target, false)
    target.dispatchEvent(bubbling())
    expect(log).toEqual(['target 2 target', 'parent:second 3 parent'])
  })

  test('stopPropagation while capturing stops the event before it reaches the target', () => {
    const { root, parent, target, log, listen } = makeTree()
    root.addEventListener('click', event => event.stopPropagation(), true)
    listen(parent, true)
    listen(target, false)
    target.dispatchEvent(bubbling())
    expect(log).toEqual([])
  })

  test('stopImmediatePropagation also stops the remaining listeners of the current target', () => {
    const { root, parent, target, log, listen } = makeTree()
    listen(target, false, ':first')
    parent.addEventListener('click', event => event.stopImmediatePropagation())
    listen(parent, false, ':never')
    listen(root, false)
    target.dispatchEvent(bubbling())
    expect(log).toEqual(['target:first 2 target'])
  })

  test('the stop flags are cleared afterwards', () => {
    const { target } = makeTree()
    target.addEventListener('click', event => event.stopImmediatePropagation())
    const event = bubbling()
    target.dispatchEvent(event)
    expect(event.inner.immediatePropagationStopped).toBe(false)
    expect(event.inner.propagationStopped).toBe(false)
  })

  test('once listeners run once, and listeners added or removed while dispatching are handled', () => {
    const { parent, target } = makeTree()
    const calls = []
    const late = () => calls.push('late')
    const removed = () => calls.push('removed')
    target.addEventListener('click', () => calls.push('once'), { once: true })
    target.addEventListener('click', () => {
      calls.push('first')
      target.addEventListener('click', late)
      target.removeEventListener('click', removed)
    })
    target.addEventListener('click', removed)
    parent.addEventListener('click', () => calls.push('parent'))
    target.dispatchEvent(bubbling())
    target.dispatchEvent(bubbling())
    expect(calls).toEqual(['once', 'first', 'parent', 'first', 'late', 'parent'])
  })

  test('a listener runs with its target as this, an object listener as itself', () => {
    const { parent, target } = makeTree()
    let thisValue
    let objectThis
    const listenerObject = { handleEvent () { objectThis = this } }
    parent.addEventListener('click', function () { thisValue = this })
    parent.addEventListener('click', listenerObject)
    target.dispatchEvent(bubbling())
    expect(thisValue).toBe(parent)
    expect(objectThis).toBe(listenerObject)
  })

  test('adding the same listener twice for the same phase does nothing, capture and not capture are different', () => {
    const { target } = makeTree()
    const calls = []
    const handler = () => calls.push('run')
    target.addEventListener('click', handler)
    target.addEventListener('click', handler)
    target.addEventListener('click', handler, true)
    target.dispatchEvent(bubbling())
    expect(calls).toEqual(['run', 'run'])
    target.removeEventListener('click', handler, true)
    calls.length = 0
    target.dispatchEvent(bubbling())
    expect(calls).toEqual(['run'])
    target.removeEventListener('click', handler)
    target.dispatchEvent(bubbling())
    expect(calls).toEqual(['run'])
  })

  test('only the ancestors which are event targets are used, and a node with no parent works', () => {
    const alone = new NodeService()
    let called = false
    alone.addEventListener('click', () => { called = true })
    expect(alone.dispatchEvent(bubbling())).toBe(true)
    expect(called).toBe(true)
    expect(new EventTargetService().dispatchEvent(bubbling())).toBe(true)
  })
})

describe('cancelling and the default action', () => {
  test('dispatchEvent is false when a listener prevents the default of a cancelable event', () => {
    const { parent, target } = makeTree()
    parent.addEventListener('click', event => event.preventDefault())
    expect(target.dispatchEvent(bubbling())).toBe(false)
  })

  test('preventDefault does nothing for an event which is not cancelable, or in a passive listener', () => {
    const { parent, target } = makeTree()
    parent.addEventListener('click', event => event.preventDefault())
    expect(target.dispatchEvent(bubbling('click', { cancelable: false }))).toBe(true)
    const passive = makeTree()
    passive.parent.addEventListener('click', event => event.preventDefault(), { passive: true })
    expect(passive.target.dispatchEvent(bubbling())).toBe(true)
  })

  test('the default action of the target runs afterwards unless the default was prevented', () => {
    class Target extends NodeService {
      constructor () {
        super()
        this.actions = []
        this.setDefaultEvent('click', event => this.actions.push(`default ${event.eventPhase}`))
      }
    }
    const parent = new NodeService()
    const target = new Target()
    parent.appendChild(target)
    target.addEventListener('click', () => target.actions.push('listener'))
    target.dispatchEvent(bubbling())
    expect(target.actions).toEqual(['listener', `default ${EventService.NONE}`])
    parent.addEventListener('click', event => event.preventDefault())
    target.actions.length = 0
    expect(target.dispatchEvent(bubbling())).toBe(false)
    expect(target.actions).toEqual(['listener'])
  })
})

describe('listeners which throw', () => {
  test('the other listeners still run, then the error is thrown', () => {
    const { parent, target } = makeTree()
    const calls = []
    target.addEventListener('click', () => { throw new Error('first') })
    target.addEventListener('click', () => calls.push('second'))
    parent.addEventListener('click', () => calls.push('parent'))
    expect(() => target.dispatchEvent(bubbling())).toThrow('first')
    expect(calls).toEqual(['second', 'parent'])
  })

  test('when several throw, one error holds them all', () => {
    const { parent, target } = makeTree()
    target.addEventListener('click', () => { throw new Error('one') })
    parent.addEventListener('click', () => { throw new Error('two') })
    let error
    try {
      target.dispatchEvent(bubbling())
    } catch (caught) {
      error = caught
    }
    expect(error.errors.map(item => item.message)).toEqual(['one', 'two'])
  })
})

describe('clicking a submit button', () => {
  const makeForm = () => {
    const form = new ElementService({ tagName: 'form' })
    const wrapper = new ElementService({ tagName: 'div' })
    const button = new ElementService({ tagName: 'button', attributes: [{ name: 'type', value: 'submit' }] })
    form.appendChild(wrapper)
    wrapper.appendChild(button)
    return { form, wrapper, button }
  }

  test('the nearest form gets a submit event which bubbles', () => {
    const { form, button } = makeForm()
    const outer = new ElementService({ tagName: 'section' })
    outer.appendChild(form)
    const seen = []
    form.addEventListener('submit', event => seen.push(['form', event.target === form]))
    outer.addEventListener('submit', event => seen.push(['outer', event.target === form]))
    button.dispatchEvent(bubbling())
    expect(seen).toEqual([['form', true], ['outer', true]])
  })

  test('preventing the click default stops the submit', () => {
    const { form, wrapper, button } = makeForm()
    let submitted = false
    form.addEventListener('submit', () => { submitted = true })
    wrapper.addEventListener('click', event => event.preventDefault())
    button.dispatchEvent(bubbling())
    expect(submitted).toBe(false)
  })

  test('moving the button around does not submit twice', () => {
    const { form, wrapper, button } = makeForm()
    let count = 0
    form.addEventListener('submit', () => count++)
    wrapper.removeChild(button)
    wrapper.appendChild(button)
    wrapper.appendChild(button)
    button.dispatchEvent(bubbling())
    expect(count).toBe(1)
  })

  test('a button which is not in a form does nothing', () => {
    const button = new ElementService({ tagName: 'button', attributes: [{ name: 'type', value: 'submit' }] })
    const parent = new ElementService({ tagName: 'div' })
    parent.appendChild(button)
    expect(button.dispatchEvent(bubbling())).toBe(true)
  })
})

describe('an event which is not asked to bubble or be cancelled', () => {
  test('does not bubble to the ancestors, and cannot be prevented', () => {
    const { root, parent, target, log, listen } = makeTree()
    ;[root, parent, target].forEach(node => listen(node, false))
    target.addEventListener('click', event => event.preventDefault())
    const event = new EventService('click')
    expect(target.dispatchEvent(event)).toBe(true)
    expect(log).toEqual(['target 2 target'])
    expect(event.defaultPrevented).toBe(false)
  })
})

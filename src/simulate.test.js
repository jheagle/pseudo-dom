import simulate, { click, keyPress } from './simulate'
import { HTMLElementService } from './services/HTMLElementService'
import { getActiveElement } from './functions/activeElement'

const el = (tagName, attributes = {}) => {
  const element = new HTMLElementService({ tagName })
  Object.keys(attributes).forEach(name => element.setAttribute(name, attributes[name]))
  return element
}

const makePage = () => {
  const root = el('div')
  const form = el('form')
  const input = el('input', { type: 'text' })
  const button = el('button')
  const text = el('p')
  root.appendChild(form)
  form.appendChild(input)
  form.appendChild(button)
  root.appendChild(text)
  return { root, form, input, button, text }
}

const listenAll = (node, log, name, types) => types.forEach(type => node.addEventListener(type, event => log.push(`${name} ${type}${event.isTrusted ? '' : ' (untrusted)'}`)))

describe('simulate.click', () => {
  test('sends the events of a user click in order, all of them trusted', () => {
    const { root, button } = makePage()
    const log = []
    listenAll(button, log, 'button', ['pointerdown', 'mousedown', 'focus', 'focusin', 'pointerup', 'mouseup', 'click'])
    expect(click(button)).toBe(true)
    expect(log).toEqual(['button pointerdown', 'button mousedown', 'button focus', 'button focusin', 'button pointerup', 'button mouseup', 'button click'])
    expect(getActiveElement(root)).toBe(button)
  })

  test('the events have the options the browser gives them', () => {
    const { button } = makePage()
    const seen = {}
    ;['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type => button.addEventListener(type, event => {
      seen[type] = [event.bubbles, event.cancelable, event.button, event.detail, event.constructor.name]
    }))
    click(button, { clientX: 5 })
    expect(seen.pointerdown).toEqual([true, true, 0, 0, 'PointerEventService'])
    expect(seen.mousedown).toEqual([true, true, 0, 1, 'MouseEventService'])
    expect(seen.click).toEqual([true, true, 0, 1, 'MouseEventService'])
  })

  test('clicking a wrapper sends the events up to the elements around it', () => {
    const { root, button } = makePage()
    const log = []
    listenAll(root, log, 'root', ['mousedown', 'click'])
    click(button)
    expect(log).toEqual(['root mousedown', 'root click'])
  })

  test('moves the focus to the nearest element which can have it', () => {
    const { root, input, form } = makePage()
    const inner = el('span')
    const link = el('a', { href: '#' })
    form.appendChild(link)
    link.appendChild(inner)
    input.focus()
    click(inner)
    expect(getActiveElement(root)).toBe(link)
  })

  test('clicking something which cannot have the focus takes the focus away', () => {
    const { root, input, text } = makePage()
    input.focus()
    click(text)
    expect(getActiveElement(root)).toBeNull()
  })

  test('cancelling mousedown stops the focus moving, and cancelling the click is reported', () => {
    const { root, input, button } = makePage()
    input.focus()
    button.addEventListener('mousedown', event => event.preventDefault())
    button.addEventListener('click', event => event.preventDefault())
    expect(click(button)).toBe(false)
    expect(getActiveElement(root)).toBe(input)
  })

  test('a disabled element gets nothing', () => {
    const button = el('button', { disabled: '' })
    const log = []
    listenAll(button, log, 'button', ['mousedown', 'click'])
    expect(click(button)).toBe(false)
    expect(log).toEqual([])
  })

  test('clicking a submit button submits the form with a trusted submit event', () => {
    const { form, button } = makePage()
    const log = []
    listenAll(form, log, 'form', ['submit'])
    click(button)
    expect(log).toEqual(['form submit'])
  })

  test('no submit happens when the click is cancelled', () => {
    const { form, button } = makePage()
    let submitted = false
    form.addEventListener('submit', () => { submitted = true })
    form.addEventListener('click', event => event.preventDefault())
    click(button)
    expect(submitted).toBe(false)
  })
})

describe('simulate.keyPress', () => {
  test('sends keydown then keyup with the key, trusted', () => {
    const { input } = makePage()
    const log = []
    ;['keydown', 'keyup'].forEach(type => input.addEventListener(type, event => log.push([type, event.key, event.code, event.isTrusted, event.bubbles, event.cancelable])))
    expect(keyPress(input, 'Enter', { code: 'Enter' })).toBe(true)
    expect(log).toEqual([['keydown', 'Enter', 'Enter', true, true, true], ['keyup', 'Enter', 'Enter', true, true, true]])
  })

  test('reports a cancelled keydown', () => {
    const { input } = makePage()
    input.addEventListener('keydown', event => event.preventDefault())
    expect(keyPress(input, 'a')).toBe(false)
  })

  test('keys reach the elements around the target and modifiers can be given', () => {
    const { form, input } = makePage()
    const seen = []
    form.addEventListener('keydown', event => seen.push([event.key, event.shiftKey]))
    keyPress(input, 'A', { shiftKey: true })
    expect(seen).toEqual([['A', true]])
  })
})

test('the default export has both', () => {
  expect(simulate.click).toBe(click)
  expect(simulate.keyPress).toBe(keyPress)
})

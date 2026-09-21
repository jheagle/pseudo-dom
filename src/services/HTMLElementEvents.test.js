import { HTMLElementService } from './HTMLElementService'
import { ElementService } from './ElementService'
import { NodeService } from './NodeService'
import createEvent from '../factories/createEvent'
import { getActiveElement } from '../functions/activeElement'

const el = (tagName, attributes = {}) => {
  const element = new HTMLElementService({ tagName })
  Object.keys(attributes).forEach(name => element.setAttribute(name, attributes[name]))
  return element
}

// A form with a wrapper, and a text field and a button next to each other
const makePage = () => {
  const root = el('div')
  const wrapper = el('section')
  const input = el('input', { type: 'text' })
  const button = el('button')
  root.appendChild(wrapper)
  wrapper.appendChild(input)
  wrapper.appendChild(button)
  return { root, wrapper, input, button }
}

const record = (log, nodes) => nodes.forEach(([name, node]) => {
  ;['focus', 'blur', 'focusin', 'focusout', 'click'].forEach(type => {
    node.addEventListener(type, event => log.push(`${name} ${event.type}${event.relatedTarget ? ` (related ${nodes.find(([, n]) => n === event.relatedTarget)[0]})` : ''}`))
  })
})

describe('click()', () => {
  test('sends a click which bubbles, can be cancelled, and is not trusted', () => {
    const { wrapper, button } = makePage()
    const seen = []
    wrapper.addEventListener('click', event => seen.push([event.target === button, event.bubbles, event.cancelable, event.composed, event.isTrusted]))
    button.click()
    expect(seen).toEqual([[true, true, true, true, false]])
  })

  test('is a MouseEvent', () => {
    const { button } = makePage()
    let kind
    button.addEventListener('click', event => { kind = event.constructor.name })
    button.click()
    expect(kind).toBe('MouseEventService')
  })

  test('does nothing for a disabled element', () => {
    const button = el('button', { disabled: '' })
    let clicked = false
    button.addEventListener('click', () => { clicked = true })
    button.click()
    expect(clicked).toBe(false)
  })
})

describe('focus() and blur()', () => {
  test('focus sends focus (which does not bubble) then focusin (which does), and sets the active element', () => {
    const { root, wrapper, input } = makePage()
    const log = []
    record(log, [['wrapper', wrapper], ['input', input]])
    input.focus()
    expect(log).toEqual(['input focus', 'input focusin', 'wrapper focusin'])
    expect(getActiveElement(root)).toBe(input)
  })

  test('the events are trusted, and know the element which had the focus', () => {
    const { input, button } = makePage()
    input.focus()
    const seen = []
    button.addEventListener('focus', event => seen.push([event.isTrusted, event.relatedTarget]))
    button.focus()
    expect(seen).toEqual([[true, input]])
  })

  test('moving the focus blurs the old element first: blur, focusout, then focus, focusin', () => {
    const { wrapper, input, button } = makePage()
    const log = []
    input.focus()
    record(log, [['wrapper', wrapper], ['input', input], ['button', button]])
    button.focus()
    expect(log).toEqual([
      'input blur (related button)',
      'input focusout (related button)',
      'wrapper focusout (related button)',
      'button focus (related input)',
      'button focusin (related input)',
      'wrapper focusin (related input)'
    ])
  })

  test('focusing the element which already has the focus does nothing', () => {
    const { input } = makePage()
    input.focus()
    let count = 0
    input.addEventListener('focus', () => count++)
    input.focus()
    expect(count).toBe(0)
  })

  test('blur takes the focus away, sending blur then focusout', () => {
    const { root, wrapper, input } = makePage()
    input.focus()
    const log = []
    record(log, [['wrapper', wrapper], ['input', input]])
    input.blur()
    expect(log).toEqual(['input blur', 'input focusout', 'wrapper focusout'])
    expect(getActiveElement(root)).toBeNull()
  })

  test('blur does nothing for an element which does not have the focus', () => {
    const { input, button } = makePage()
    input.focus()
    let count = 0
    button.addEventListener('blur', () => count++)
    button.blur()
    expect(count).toBe(0)
    expect(input.canFocus).toBe(true)
  })

  test('only some elements can have the focus', () => {
    const { root } = makePage()
    expect(el('button').canFocus).toBe(true)
    expect(el('input', { type: 'text' }).canFocus).toBe(true)
    expect(el('input', { type: 'hidden' }).canFocus).toBe(false)
    expect(el('select').canFocus).toBe(true)
    expect(el('textarea').canFocus).toBe(true)
    expect(el('a', { href: '/x' }).canFocus).toBe(true)
    expect(el('a').canFocus).toBe(false)
    expect(el('div').canFocus).toBe(false)
    expect(el('div', { tabindex: '0' }).canFocus).toBe(true)
    expect(el('button', { disabled: '' }).canFocus).toBe(false)
    const div = el('div')
    root.appendChild(div)
    div.focus()
    expect(getActiveElement(root)).toBeNull()
  })

  test('each tree has its own focused element', () => {
    const first = makePage()
    const second = makePage()
    first.input.focus()
    second.button.focus()
    expect(getActiveElement(first.root)).toBe(first.input)
    expect(getActiveElement(second.root)).toBe(second.button)
  })
})

describe('the default action of a click on a button', () => {
  const makeForm = (buttonAttributes = {}) => {
    const form = el('form')
    const button = el('button', buttonAttributes)
    form.appendChild(button)
    return { form, button }
  }

  test('a button submits its form by default, like a browser', () => {
    const { form, button } = makeForm()
    let submitted = 0
    form.addEventListener('submit', () => submitted++)
    button.click()
    expect(submitted).toBe(1)
  })

  test('a button of another type does not submit', () => {
    ;['button', 'reset'].forEach(type => {
      const { form, button } = makeForm({ type })
      let submitted = false
      form.addEventListener('submit', () => { submitted = true })
      button.click()
      expect(submitted).toBe(false)
    })
  })

  test('the type can be set after the button is in the form', () => {
    const { form, button } = makeForm()
    button.setAttribute('type', 'button')
    let submitted = false
    form.addEventListener('submit', () => { submitted = true })
    button.click()
    expect(submitted).toBe(false)
  })

  test('the submit event is trusted only when the click was', () => {
    const { form, button } = makeForm()
    const trust = []
    form.addEventListener('submit', event => trust.push(event.isTrusted))
    button.click()
    button.dispatchEvent(createEvent('click', {}, { browser: true, trusted: true }))
    expect(trust).toEqual([false, true])
  })

  test('an input of type submit submits, a text input does not', () => {
    const form = el('form')
    const submitter = el('input', { type: 'submit' })
    const text = el('input', { type: 'text' })
    form.appendChild(submitter)
    form.appendChild(text)
    let count = 0
    form.addEventListener('submit', () => count++)
    text.click()
    expect(count).toBe(0)
    submitter.click()
    expect(count).toBe(1)
  })

  test('elements which are not html elements have no click, focus or blur', () => {
    const plain = new ElementService({ tagName: 'div' })
    expect(plain.click).toBeUndefined()
    expect(new NodeService().focus).toBeUndefined()
  })
})

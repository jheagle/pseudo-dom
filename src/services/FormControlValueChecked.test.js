import { HTMLElementService } from './HTMLElementService'

const input = (attributes = {}) => {
  const element = new HTMLElementService({ tagName: 'input' })
  Object.keys(attributes).forEach(name => element.setAttribute(name, attributes[name]))
  return element
}

describe('value', () => {
  test('reads the value attribute as a string (a number attribute included), and is empty without one', () => {
    expect(input({ value: 'abc' }).value).toBe('abc')
    expect(input({ value: 0 }).value).toBe('0')
    expect(input().value).toBe('')
  })

  test('a checkbox or radio without a value attribute has the value "on"', () => {
    expect(input({ type: 'checkbox' }).value).toBe('on')
    expect(input({ type: 'radio', value: 'x' }).value).toBe('x')
  })

  test('setting it changes the value but not the attribute; after that the attribute no longer changes it', () => {
    const element = input({ value: 'a' })
    element.value = 'typed'
    expect(element.value).toBe('typed')
    expect(element.getAttribute('value')).toBe('a')
    element.setAttribute('value', 'b')
    expect(element.value).toBe('typed')
  })

  test('a number is stored as a string, and parseInt works on it', () => {
    const element = input({ value: 3 })
    expect(parseInt(element.value)).toBe(3)
    element.value = 7
    expect(element.value).toBe('7')
  })

  test('textarea, select, button, option and output have one; a div does not (assigning just sets a plain property)', () => {
    ;['textarea', 'select', 'button', 'option', 'output'].forEach(tagName => {
      expect(new HTMLElementService({ tagName }).value).toBe('')
    })
    const div = new HTMLElementService({ tagName: 'div' })
    expect(div.value).toBeUndefined()
    div.value = 'x'
    expect(div.value).toBe('x')
    expect(div.hasAttribute('value')).toBe(false)
  })
})

describe('checked', () => {
  test('follows the checked attribute until it is set', () => {
    expect(input({ type: 'checkbox' }).checked).toBe(false)
    const element = input({ type: 'checkbox', checked: '' })
    expect(element.checked).toBe(true)
    element.checked = false
    expect(element.checked).toBe(false)
    expect(element.hasAttribute('checked')).toBe(true)
    element.setAttribute('checked', '')
    expect(element.checked).toBe(false)
  })

  test('only input has one; a div assigned one just gets a plain property', () => {
    const div = new HTMLElementService({ tagName: 'div' })
    expect(div.checked).toBeUndefined()
    div.checked = true
    expect(div.checked).toBe(true)
  })
})

describe('cloneNode', () => {
  test('keeps the current value and checkedness', () => {
    const element = input({ type: 'checkbox', value: 'a' })
    element.value = 'typed'
    element.checked = true
    const copy = element.cloneNode(true)
    expect(copy.value).toBe('typed')
    expect(copy.checked).toBe(true)
  })
})

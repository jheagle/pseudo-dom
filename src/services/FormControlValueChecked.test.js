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

const parsed = html => {
  const container = new HTMLElementService({ tagName: 'div' })
  container.innerHTML = html
  return container
}

describe('textarea value', () => {
  test('starts as its text, as in the DOM, and setting it leaves the text alone', () => {
    const textarea = parsed('<textarea>hello\nthere</textarea>').querySelector('textarea')
    expect(textarea.value).toBe('hello\nthere')
    textarea.value = 'typed'
    expect(textarea.value).toBe('typed')
    expect(textarea.textContent).toBe('hello\nthere')
  })

  test('ignores a value attribute (a textarea has none in the DOM), and follows its text until edited', () => {
    const textarea = new HTMLElementService({ tagName: 'textarea' })
    textarea.setAttribute('value', 'attribute')
    expect(textarea.value).toBe('')
    textarea.textContent = 'text'
    expect(textarea.value).toBe('text')
  })
})

describe('reflected boolean attributes', () => {
  test('disabled reads the attribute, and setting it adds or removes the attribute', () => {
    const button = parsed('<button disabled>Go</button>').querySelector('button')
    expect(button.disabled).toBe(true)
    button.disabled = false
    expect(button.hasAttribute('disabled')).toBe(false)
    expect(button.outerHTML).toBe('<button>Go</button>')
    button.disabled = true
    expect(button.getAttribute('disabled')).toBe('')
    expect(new HTMLElementService({ tagName: 'input' }).disabled).toBe(false)
  })

  test.each([
    ['readOnly', 'readonly', 'input'],
    ['readOnly', 'readonly', 'textarea'],
    ['required', 'required', 'select'],
    ['multiple', 'multiple', 'select'],
    ['disabled', 'disabled', 'fieldset'],
    ['disabled', 'disabled', 'optgroup']
  ])('%s reflects the %s attribute on %s', (property, attribute, tagName) => {
    const element = new HTMLElementService({ tagName })
    expect(element[property]).toBe(false)
    element.setAttribute(attribute, '')
    expect(element[property]).toBe(true)
    element[property] = false
    expect(element.hasAttribute(attribute)).toBe(false)
  })

  test('elements without the property get a plain property, and their attributes are left alone', () => {
    const div = new HTMLElementService({ tagName: 'div' })
    expect(div.disabled).toBeUndefined()
    div.disabled = true
    expect(div.disabled).toBe(true)
    expect(div.hasAttribute('disabled')).toBe(false)
  })
})

describe('label', () => {
  test('optgroup and option reflect the label attribute; an option without one uses its text', () => {
    const select = parsed('<select><optgroup label="Fruit"><option>  Apple\n pie </option><option label="B">Banana</option></optgroup></select>')
    const optgroup = select.querySelector('optgroup')
    const [apple, banana] = select.querySelectorAll('option')
    expect(optgroup.label).toBe('Fruit')
    optgroup.label = 'Fruits'
    expect(optgroup.getAttribute('label')).toBe('Fruits')
    expect(apple.label).toBe('Apple pie')
    expect(banana.label).toBe('B')
    expect(new HTMLElementService({ tagName: 'optgroup' }).label).toBe('')
    expect(new HTMLElementService({ tagName: 'div' }).label).toBeUndefined()
  })
})

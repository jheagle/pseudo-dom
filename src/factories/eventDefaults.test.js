import { eventDefaults } from './eventDefaults'

const optionsOf = type => {
  const { bubbles, cancelable, composed } = eventDefaults[type]
  return { bubbles, cancelable, composed }
}

describe('eventDefaults', () => {
  test('the mouse events which the browser sends bubble, can be cancelled and cross shadow trees', () => {
    ;['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'contextmenu', 'wheel'].forEach(type => {
      expect(optionsOf(type)).toEqual({ bubbles: true, cancelable: true, composed: true })
      expect(eventDefaults[type].interface).toBe('MouseEvent')
    })
  })

  test('mouseenter and mouseleave do not bubble and cannot be cancelled', () => {
    expect(optionsOf('mouseenter')).toEqual({ bubbles: false, cancelable: false, composed: true })
    expect(optionsOf('mouseleave')).toEqual({ bubbles: false, cancelable: false, composed: true })
  })

  test('focus and blur do not bubble, focusin and focusout do', () => {
    expect(optionsOf('focus').bubbles).toBe(false)
    expect(optionsOf('blur').bubbles).toBe(false)
    expect(optionsOf('focusin').bubbles).toBe(true)
    expect(optionsOf('focusout').bubbles).toBe(true)
    ;['focus', 'blur', 'focusin', 'focusout'].forEach(type => {
      expect(eventDefaults[type].cancelable).toBe(false)
      expect(eventDefaults[type].interface).toBe('FocusEvent')
    })
  })

  test('keyboard events bubble and can be cancelled', () => {
    ;['keydown', 'keyup', 'keypress'].forEach(type => {
      expect(optionsOf(type)).toEqual({ bubbles: true, cancelable: true, composed: true })
      expect(eventDefaults[type].interface).toBe('KeyboardEvent')
    })
  })

  test('input and change bubble but cannot be cancelled, beforeinput can', () => {
    expect(optionsOf('input').cancelable).toBe(false)
    expect(optionsOf('input').bubbles).toBe(true)
    expect(optionsOf('change')).toEqual({ bubbles: true, cancelable: false, composed: false })
    expect(optionsOf('beforeinput').cancelable).toBe(true)
  })

  test('submit and reset bubble and can be cancelled, but stay inside a shadow tree', () => {
    expect(optionsOf('submit')).toEqual({ bubbles: true, cancelable: true, composed: false })
    expect(optionsOf('reset')).toEqual({ bubbles: true, cancelable: true, composed: false })
  })

  test('load, error and scroll do not bubble', () => {
    ;['load', 'error', 'scroll', 'abort'].forEach(type => expect(eventDefaults[type].bubbles).toBe(false))
  })

  test('animation and transition events bubble but cannot be cancelled', () => {
    ;['animationend', 'animationstart', 'transitionend', 'transitionstart'].forEach(type => {
      expect(optionsOf(type)).toEqual({ bubbles: true, cancelable: false, composed: false })
    })
  })

  test('every entry has all of the options and a known kind of event', () => {
    const kinds = ['Event', 'UIEvent', 'MouseEvent', 'PointerEvent', 'KeyboardEvent', 'FocusEvent', 'InputEvent', 'CustomEvent']
    Object.keys(eventDefaults).forEach(type => {
      const definition = eventDefaults[type]
      expect(typeof definition.bubbles).toBe('boolean')
      expect(typeof definition.cancelable).toBe('boolean')
      expect(typeof definition.composed).toBe('boolean')
      expect(kinds).toContain(definition.interface)
    })
  })
})

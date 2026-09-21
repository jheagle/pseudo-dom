import { UIEventService } from './UIEventService'
import { MouseEventService } from './MouseEventService'
import { PointerEventService } from './PointerEventService'
import { KeyboardEventService } from './KeyboardEventService'
import { FocusEventService } from './FocusEventService'
import { InputEventService } from './InputEventService'
import { CustomEventService } from './CustomEventService'
import { EventService } from './EventService'
import { NodeService } from './NodeService'

describe('the kinds of event', () => {
  test('UIEvent has a detail and a view', () => {
    expect(new UIEventService('x').detail).toBe(0)
    expect(new UIEventService('x').view).toBeNull()
    const event = new UIEventService('x', { detail: 2, view: 'window' })
    expect(event.detail).toBe(2)
    expect(event.view).toBe('window')
    expect(event).toBeInstanceOf(EventService)
  })

  test('MouseEvent has positions, buttons, modifier keys and a related target', () => {
    const related = new NodeService()
    const event = new MouseEventService('click', {
      bubbles: true, screenX: 1, screenY: 2, clientX: 3, clientY: 4, button: 2, buttons: 2, ctrlKey: true, relatedTarget: related
    })
    expect([event.screenX, event.screenY, event.clientX, event.clientY, event.x, event.y]).toEqual([1, 2, 3, 4, 3, 4])
    expect([event.button, event.buttons]).toEqual([2, 2])
    expect(event.ctrlKey).toBe(true)
    expect(event.shiftKey).toBe(false)
    expect(event.getModifierState('Control')).toBe(true)
    expect(event.getModifierState('Alt')).toBe(false)
    expect(event.getModifierState('Unknown')).toBe(false)
    expect(event.relatedTarget).toBe(related)
    expect(event.bubbles).toBe(true)
    const plain = new MouseEventService('click')
    expect([plain.clientX, plain.button, plain.buttons, plain.relatedTarget]).toEqual([0, 0, 0, null])
  })

  test('PointerEvent is a MouseEvent with a pointer', () => {
    const event = new PointerEventService('pointerdown', { pointerId: 3, pointerType: 'touch', isPrimary: true, pressure: 0.5, clientX: 9 })
    expect(event).toBeInstanceOf(MouseEventService)
    expect([event.pointerId, event.pointerType, event.isPrimary, event.pressure, event.clientX]).toEqual([3, 'touch', true, 0.5, 9])
    const plain = new PointerEventService('pointerdown')
    expect([plain.pointerId, plain.width, plain.height, plain.pointerType, plain.isPrimary]).toEqual([0, 1, 1, '', false])
  })

  test('KeyboardEvent has the key, the code and the modifiers', () => {
    const event = new KeyboardEventService('keydown', { key: 'A', code: 'KeyA', shiftKey: true, repeat: true, location: 1 })
    expect([event.key, event.code, event.location, event.repeat, event.isComposing]).toEqual(['A', 'KeyA', 1, true, false])
    expect(event.shiftKey).toBe(true)
    expect(event.getModifierState('Shift')).toBe(true)
    expect(event.metaKey).toBe(false)
    expect([new KeyboardEventService('keyup').key, new KeyboardEventService('keyup').code]).toEqual(['', ''])
  })

  test('FocusEvent has a related target', () => {
    const other = new NodeService()
    expect(new FocusEventService('focus', { relatedTarget: other }).relatedTarget).toBe(other)
    expect(new FocusEventService('focus').relatedTarget).toBeNull()
  })

  test('InputEvent has the data and the type of input', () => {
    const event = new InputEventService('input', { data: 'a', inputType: 'insertText' })
    expect([event.data, event.inputType, event.isComposing]).toEqual(['a', 'insertText', false])
    expect(new InputEventService('input').data).toBeNull()
  })

  test('CustomEvent carries a detail', () => {
    const detail = { ship: 'destroyer' }
    expect(new CustomEventService('fire', { detail, bubbles: true }).detail).toBe(detail)
    expect(new CustomEventService('fire').detail).toBeNull()
    expect(new CustomEventService('fire', { detail: 0 }).detail).toBe(0)
  })
})

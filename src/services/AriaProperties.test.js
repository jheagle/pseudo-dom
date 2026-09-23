import { ElementService } from './ElementService'

// Every aria* property, and the real attribute name it reflects - the mapping is NOT a naive camelCase-to-kebab
// conversion (that would give aria-col-count, aria-has-popup, aria-multi-selectable, ... - all wrong): it is just
// the 'aria' prefix, lowercased, then the rest of the property name lowercased with no extra hyphens.
const ARIA_PROPERTIES = {
  ariaAtomic: 'aria-atomic',
  ariaAutoComplete: 'aria-autocomplete',
  ariaBusy: 'aria-busy',
  ariaChecked: 'aria-checked',
  ariaColCount: 'aria-colcount',
  ariaColIndex: 'aria-colindex',
  ariaColSpan: 'aria-colspan',
  ariaCurrent: 'aria-current',
  ariaDescription: 'aria-description',
  ariaDisabled: 'aria-disabled',
  ariaExpanded: 'aria-expanded',
  ariaHasPopup: 'aria-haspopup',
  ariaHidden: 'aria-hidden',
  ariaKeyShortcuts: 'aria-keyshortcuts',
  ariaLabel: 'aria-label',
  ariaLevel: 'aria-level',
  ariaLive: 'aria-live',
  ariaModal: 'aria-modal',
  ariaMultiline: 'aria-multiline',
  ariaMultiSelectable: 'aria-multiselectable',
  ariaOrientation: 'aria-orientation',
  ariaPlaceholder: 'aria-placeholder',
  ariaPosInSet: 'aria-posinset',
  ariaPressed: 'aria-pressed',
  ariaReadOnly: 'aria-readonly',
  ariaRequired: 'aria-required',
  ariaRoleDescription: 'aria-roledescription',
  ariaRowCount: 'aria-rowcount',
  ariaRowIndex: 'aria-rowindex',
  ariaRowSpan: 'aria-rowspan',
  ariaSelected: 'aria-selected',
  ariaSetSize: 'aria-setsize',
  ariaSort: 'aria-sort',
  ariaValueMax: 'aria-valuemax',
  ariaValueMin: 'aria-valuemin',
  ariaValueNow: 'aria-valuenow',
  ariaValueText: 'aria-valuetext'
}

describe('aria* reflected properties', () => {
  test('every one of the 37 properties reads/writes its real attribute name', () => {
    Object.entries(ARIA_PROPERTIES).forEach(([property, attributeName]) => {
      const div = new ElementService({ tagName: 'div' })
      expect(div[property]).toBe('')
      div[property] = 'some-value'
      expect(div.getAttribute(attributeName)).toBe('some-value')
      expect(div[property]).toBe('some-value')
    })
  })

  // Spot-check the trickiest cases specifically (not just the loop above), since a wrong mapping here would be an
  // easy typo to make and an easy one to miss: these are NOT what naive camelCase-to-kebab-case would produce
  test('tricky property names map correctly (not naive camelCase-to-kebab)', () => {
    const div = new ElementService({ tagName: 'div' })
    div.ariaColCount = '5'
    div.ariaHasPopup = 'menu'
    div.ariaMultiSelectable = 'true'
    div.ariaReadOnly = 'true'
    div.ariaValueNow = '3'
    expect(div.getAttribute('aria-colcount')).toBe('5')
    expect(div.getAttribute('aria-haspopup')).toBe('menu')
    expect(div.getAttribute('aria-multiselectable')).toBe('true')
    expect(div.getAttribute('aria-readonly')).toBe('true')
    expect(div.getAttribute('aria-valuenow')).toBe('3')
    // and none of the wrong, hyphenated versions
    expect(div.hasAttribute('aria-col-count')).toBe(false)
    expect(div.hasAttribute('aria-has-popup')).toBe(false)
    expect(div.hasAttribute('aria-multi-selectable')).toBe(false)
    expect(div.hasAttribute('aria-read-only')).toBe(false)
    expect(div.hasAttribute('aria-value-now')).toBe(false)
  })

  test('appears in getAttributeNames() and outerHTML once set, like any other attribute', () => {
    const div = new ElementService({ tagName: 'div' })
    div.ariaLabel = 'Close'
    expect(div.getAttributeNames()).toEqual(expect.arrayContaining(['aria-label']))
    expect(div.outerHTML).toBe('<div aria-label="Close"></div>')
  })

  test('an unset property reads as \'\', not undefined or null', () => {
    const div = new ElementService({ tagName: 'div' })
    expect(div.ariaExpanded).toBe('')
    expect(div.ariaExpanded).not.toBeNull()
    expect(div.ariaExpanded).not.toBeUndefined()
  })
})

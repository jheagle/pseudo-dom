'use strict'

require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
require('core-js/modules/esnext.iterator.for-each.js')
require('core-js/modules/esnext.iterator.map.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.DOMTokenListService = void 0
/**
 * Simulate the behaviour of the DOMTokenList Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 */
class DOMTokenListService {
  /**
   * @param {string} [value=''] The space separated tokens to start with
   * @param {function(string): void} [onChange] Called with the new value whenever the tokens change
   * @constructor
   */
  constructor (value = '', onChange = () => undefined) {
    this.tokens = DOMTokenListService.parse(value)
    this.onChange = onChange
  }

  static parse (value) {
    return (value || '').split(/\s+/).filter((token, index, tokens) => token !== '' && tokens.indexOf(token) === index)
  }

  update (tokens) {
    this.tokens = tokens
    this.onChange(this.value)
  }

  static validate (token) {
    if (token === '') {
      throw new SyntaxError('The token provided must not be empty.')
    }
    if (/\s/.test(token)) {
      throw new Error('The token provided contains whitespace.')
    }
  }

  get length () {
    return this.tokens.length
  }

  get value () {
    return this.tokens.join(' ')
  }

  set value (value) {
    this.update(DOMTokenListService.parse(value))
  }

  item (index) {
    return index >= 0 && index < this.tokens.length ? this.tokens[index] : null
  }

  contains (token) {
    return this.tokens.indexOf(token) >= 0
  }

  add (...tokens) {
    tokens.forEach(DOMTokenListService.validate)
    this.update(this.tokens.concat(tokens).filter((token, index, all) => all.indexOf(token) === index))
  }

  remove (...tokens) {
    tokens.forEach(DOMTokenListService.validate)
    this.update(this.tokens.filter(token => tokens.indexOf(token) < 0))
  }

  replace (oldToken, newToken) {
    DOMTokenListService.validate(oldToken)
    DOMTokenListService.validate(newToken)
    if (!this.contains(oldToken)) {
      return false
    }
    this.update(this.tokens.map(token => token === oldToken ? newToken : token).filter((token, index, all) => all.indexOf(token) === index))
    return true
  }

  supports (token) {
    // There is no list of supported tokens for arbitrary attributes, so like the DOM (for those) this is unsupported
    throw new TypeError(`Failed to execute 'supports' on 'DOMTokenList': DOMTokenList has no supported tokens (${token}).`)
  }

  toggle (token, force) {
    DOMTokenListService.validate(token)
    const shouldHave = typeof force === 'boolean' ? force : !this.contains(token)
    if (shouldHave) {
      this.add(token)
    } else {
      this.remove(token)
    }
    return shouldHave
  }

  entries () {
    return this.tokens.map((token, index) => [index, token])[Symbol.iterator]()
  }

  forEach (callback, thisArg) {
    this.tokens.forEach((token, index) => callback.call(thisArg, token, index, this))
  }

  keys () {
    return this.tokens.map((token, index) => index)[Symbol.iterator]()
  }

  values () {
    return this.tokens.slice()[Symbol.iterator]()
  }
}
exports.DOMTokenListService = DOMTokenListService

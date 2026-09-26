import { PseudoDOMTokenList } from '../interfaces/PseudoDOMTokenList'

/**
 * Simulate the behaviour of the DOMTokenList Class when there is no DOM available.
 */
export class DOMTokenListService implements PseudoDOMTokenList {
  private tokens: Array<string>
  private readonly onChange: (value: string) => void

  /**
   * @param value The space separated tokens to start with
   * @param onChange Called with the new value whenever the tokens change
   */
  constructor (value: string = '', onChange: (value: string) => void = () => undefined) {
    this.tokens = DOMTokenListService.parse(value)
    this.onChange = onChange
  }

  private static parse (value: string): Array<string> {
    return (value || '').split(/\s+/).filter((token, index, tokens) => token !== '' && tokens.indexOf(token) === index)
  }

  private update (tokens: Array<string>): void {
    this.tokens = tokens
    this.onChange(this.value)
  }

  private static validate (token: string): void {
    if (token === '') {
      throw new SyntaxError('The token provided must not be empty.')
    }
    if (/\s/.test(token)) {
      throw new Error('The token provided contains whitespace.')
    }
  }

  get length (): number {
    return this.tokens.length
  }

  get value (): string {
    return this.tokens.join(' ')
  }

  set value (value: string) {
    this.update(DOMTokenListService.parse(value))
  }

  item (index: number): string | null {
    return index >= 0 && index < this.tokens.length ? this.tokens[index] : null
  }

  contains (token: string): boolean {
    return this.tokens.indexOf(token) >= 0
  }

  add (...tokens: string[]): void {
    tokens.forEach(DOMTokenListService.validate)
    this.update(this.tokens.concat(tokens).filter((token, index, all) => all.indexOf(token) === index))
  }

  remove (...tokens: string[]): void {
    tokens.forEach(DOMTokenListService.validate)
    this.update(this.tokens.filter(token => tokens.indexOf(token) < 0))
  }

  replace (oldToken: string, newToken: string): boolean {
    DOMTokenListService.validate(oldToken)
    DOMTokenListService.validate(newToken)
    if (!this.contains(oldToken)) {
      return false
    }
    this.update(this.tokens
      .map(token => token === oldToken ? newToken : token)
      .filter((token, index, all) => all.indexOf(token) === index))
    return true
  }

  supports (token: string): boolean {
    // There is no list of supported tokens for arbitrary attributes, so like the DOM (for those) this is unsupported
    throw new TypeError(`Failed to execute 'supports' on 'DOMTokenList': DOMTokenList has no supported tokens (${token}).`)
  }

  toggle (token: string, force?: boolean): boolean {
    DOMTokenListService.validate(token)
    const shouldHave = typeof force === 'boolean' ? force : !this.contains(token)
    if (shouldHave) {
      this.add(token)
    } else {
      this.remove(token)
    }
    return shouldHave
  }

  entries (): Iterator<[number, string]> {
    return this.tokens.map((token, index): [number, string] => [index, token])[Symbol.iterator]()
  }

  forEach (callback: Function, thisArg?: any): void {
    this.tokens.forEach((token, index) => callback.call(thisArg, token, index, this))
  }

  keys (): Iterator<number> {
    return this.tokens.map((token, index) => index)[Symbol.iterator]()
  }

  values (): Iterator<string> {
    return this.tokens.slice()[Symbol.iterator]()
  }
}

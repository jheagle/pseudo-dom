
export interface PseudoDOMTokenList {
  get length(): number

  get value(): string

  set value(value: string)

  item(index: number): string | null

  contains(token: string): boolean

  add(...tokens: string[]): void

  remove(...tokens: string[]): void

  replace(oldToken: string, newToken: string): boolean

  supports(token: string): boolean

  toggle(token: string, force: boolean): boolean

  entries(): Iterator<any>

  forEach(callback: Function, thisArg: any): void

  keys(): Iterator<any>

  values(): Iterator<any>
}

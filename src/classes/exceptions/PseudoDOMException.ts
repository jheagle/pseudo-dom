class PseudoDOMException extends Error {
  public readonly message: string
  public readonly name: string

  public constructor (message: string = '', name: string = '') {
    super()
    this.message = message
    this.name = name
  }
}

export default PseudoDOMException

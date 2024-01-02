import PseudoCharacterData from '../PseudoCharacterData'

class PseudoText extends PseudoCharacterData {
  // TODO: create HTMLSlotElement to use here
  public readonly assignedSlot: HTMLElement | null
  public readonly wholeText: string

  public constructor (string: string = '') {
    super()
    this.data = string
  }

  public splitText (offset: number): PseudoText {
    // TODO: get the string after the offset and create a new PseudoText with it
    return new PseudoText(this.wholeText)
  }
}

export default PseudoText

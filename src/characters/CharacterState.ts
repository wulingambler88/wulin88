export type CharacterStateName = 'standing' | 'dragging' | 'sitting' | 'sleeping' | 'eating' | 'playing'

const LOCKED_STATES: readonly CharacterStateName[] = ['eating']

export class CharacterState {
  private current: CharacterStateName

  constructor(initial: CharacterStateName = 'standing') { this.current = initial }
  get value(): CharacterStateName { return this.current }
  get isBusy(): boolean { return LOCKED_STATES.includes(this.current) }

  transition(next: CharacterStateName): boolean {
    if (this.isBusy) return false
    this.current = next
    return true
  }

  finishReaction(): void { this.current = 'standing' }
}

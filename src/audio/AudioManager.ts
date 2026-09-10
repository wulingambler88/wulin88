export type SoundEvent =
  | 'pickup'
  | 'drop'
  | 'eat'
  | 'button'
  | 'wardrobe'
  | 'sleep'
  | 'inventoryOpen'
  | 'purchase'
  | 'chime'
  | 'pop'
  | 'switch'
  | 'water'
  | 'honk'
  | 'bounce'
  | 'chew'
  | 'rustle'
  | 'tvJingle'
  | 'register'

const FREQUENCIES: Record<SoundEvent, number> = {
  pickup: 520,
  drop: 360,
  eat: 660,
  button: 440,
  wardrobe: 580,
  sleep: 280,
  inventoryOpen: 490,
  purchase: 740,
  chime: 880,
  pop: 600,
  switch: 780,
  water: 420,
  honk: 580,
  bounce: 480,
  chew: 620,
  rustle: 320,
  tvJingle: 960,
  register: 820,
}

export class AudioManager {
  muted = false
  private context: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof AudioContext === 'undefined') return null
    if (!this.context) this.context = new AudioContext()
    if (this.context.state === 'suspended') void this.context.resume().catch(() => undefined)
    return this.context
  }

  play(event: SoundEvent): void {
    if (this.muted) return
    try {
      const context = this.getContext()
      if (!context) return
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.frequency.value = FREQUENCIES[event] ?? 440

      if (event === 'honk') {
        oscillator.type = 'sawtooth'
        gain.gain.setValueAtTime(0.04, context.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.15)
        oscillator.connect(gain).connect(context.destination)
        oscillator.start()
        oscillator.stop(context.currentTime + 0.15)
      } else if (event === 'tvJingle') {
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(520, context.currentTime)
        oscillator.frequency.setValueAtTime(660, context.currentTime + 0.06)
        oscillator.frequency.setValueAtTime(880, context.currentTime + 0.12)
        gain.gain.setValueAtTime(0.03, context.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22)
        oscillator.connect(gain).connect(context.destination)
        oscillator.start()
        oscillator.stop(context.currentTime + 0.22)
      } else if (event === 'bounce') {
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(320, context.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(640, context.currentTime + 0.1)
        gain.gain.setValueAtTime(0.03, context.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12)
        oscillator.connect(gain).connect(context.destination)
        oscillator.start()
        oscillator.stop(context.currentTime + 0.12)
      } else {
        gain.gain.setValueAtTime(0.025, context.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.09)
        oscillator.connect(gain).connect(context.destination)
        oscillator.start()
        oscillator.stop(context.currentTime + 0.09)
      }

    } catch { /* Audio is optional and must never block play. */ }
  }
}

export const audioManager = new AudioManager()

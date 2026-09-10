import type { AvatarCustomization, HairStyleName } from '../save/SaveSchema'
import { playerState } from '../state/PlayerState'
import { audioManager } from '../audio/AudioManager'
import { showToast } from '../ui/UIManager'

export const HAIR_STYLES: Array<{ id: HairStyleName; label: string; icon: string }> = [
  { id: 'long_waves', label: 'Long Waves with Bangs (Chibi Hero)', icon: '🌸' },
  { id: 'twin_buns', label: 'Twin Space Buns', icon: '🎀' },
  { id: 'ponytail', label: 'High Ponytail', icon: '👱‍♀️' },
  { id: 'bob', label: 'Classic Bob', icon: '💇‍♀️' },
  { id: 'pixie', label: 'Cute Pixie Cut', icon: '✨' },
]

export const HAIR_COLORS: Array<{ hex: number; label: string; css: string }> = [
  { hex: 0xffd96f, label: 'Golden Blonde', css: '#ffd96f' },
  { hex: 0x996340, label: 'Honey Brown', css: '#996340' },
  { hex: 0xff7fac, label: 'Strawberry Pink', css: '#ff7fac' },
  { hex: 0xb89fe8, label: 'Pastel Lavender', css: '#b89fe8' },
  { hex: 0x36303d, label: 'Midnight Black', css: '#36303d' },
  { hex: 0x79c7ec, label: 'Sky Blue', css: '#79c7ec' },
]

export const SKIN_TONES: Array<{ hex: number; label: string; css: string }> = [
  { hex: 0xffd7c6, label: 'Fair Peach', css: '#ffd7c6' },
  { hex: 0xf5c5a3, label: 'Warm Sand', css: '#f5c5a3' },
  { hex: 0xdfa880, label: 'Golden Honey', css: '#dfa880' },
  { hex: 0xaf7a58, label: 'Soft Mocha', css: '#af7a58' },
]

export const EYE_COLORS: Array<{ hex: number; label: string; css: string }> = [
  { hex: 0x6c3f68, label: 'Violet Blossom', css: '#6c3f68' },
  { hex: 0x3a86ff, label: 'Sky Blue', css: '#3a86ff' },
  { hex: 0x2ec4b6, label: 'Emerald Green', css: '#2ec4b6' },
  { hex: 0x5e3023, label: 'Cocoa Brown', css: '#5e3023' },
  { hex: 0xe76f51, label: 'Golden Amber', css: '#e76f51' },
]

export class CharacterCreatorModal {
  private container: HTMLElement
  private current: AvatarCustomization
  private original: AvatarCustomization
  private readonly onApply: (custom: AvatarCustomization) => void

  constructor(onApply: (custom: AvatarCustomization) => void) {
    this.onApply = onApply
    this.current = playerState.data.character.customization ?? {
      skinColor: 0xffd7c6,
      hairStyle: 'long_waves',
      hairColor: 0xffd96f,
      eyeColor: 0x6c3f68,
      blushColor: 0xff7e9f,
    }
    this.original = { ...this.current }

    this.container = document.createElement('div')
    this.container.className = 'creator-modal-overlay'
    this.container.hidden = true
    this.container.style.display = 'none'
    this.container.innerHTML = this.renderHTML()
    document.body.appendChild(this.container)

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close()
      }
    })
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !this.container.hidden) {
        this.close()
      }
    })

    this.bindEvents()
  }

  open(): void {
    this.current = playerState.data.character.customization ? { ...playerState.data.character.customization } : { ...this.current }
    this.original = { ...this.current }
    this.container.hidden = false
    this.container.style.display = 'grid'
    this.updateActiveSelections()
    this.container.querySelector<HTMLButtonElement>('#creator-close')?.focus()
    audioManager.play('wardrobe')
  }

  close(restore = true): void {
    if (restore) {
      this.current = { ...this.original }
      this.onApply(this.current)
    }
    this.container.hidden = true
    this.container.style.display = 'none'
    audioManager.play('button')
  }

  private renderHTML(): string {
    const hairStyleButtons = HAIR_STYLES.map(
      (h) => `<button type="button" class="creator-card" data-style="${h.id}"><span>${h.icon}</span><b>${h.label}</b></button>`,
    ).join('')

    const hairColorSwatches = HAIR_COLORS.map(
      (c) => `<button type="button" class="creator-swatch" data-hair-color="${c.hex}" style="background:${c.css}" title="${c.label}"></button>`,
    ).join('')

    const skinToneSwatches = SKIN_TONES.map(
      (s) => `<button type="button" class="creator-swatch" data-skin="${s.hex}" style="background:${s.css}" title="${s.label}"></button>`,
    ).join('')

    const eyeColorSwatches = EYE_COLORS.map(
      (e) => `<button type="button" class="creator-swatch" data-eye="${e.hex}" style="background:${e.css}" title="${e.label}"></button>`,
    ).join('')

    return `
      <div class="creator-modal-sheet" role="dialog" aria-label="Character Customization Studio">
        <header class="creator-header">
          <div>
            <small>MAKEOVER STUDIO</small>
            <h2>Design Qian Hui</h2>
          </div>
          <button type="button" class="creator-close-btn" id="creator-close">×</button>
        </header>

        <div class="creator-body">
          <section class="creator-group">
            <h3>✂️ Hairstyle & Haircut</h3>
            <div class="creator-styles-grid">${hairStyleButtons}</div>
          </section>

          <section class="creator-group">
            <h3>🎨 Hair Dye</h3>
            <div class="creator-swatch-row">${hairColorSwatches}</div>
          </section>

          <section class="creator-group">
            <h3>🌸 Skin Tone</h3>
            <div class="creator-swatch-row">${skinToneSwatches}</div>
          </section>

          <section class="creator-group">
            <h3>👁️ Eye Color</h3>
            <div class="creator-swatch-row">${eyeColorSwatches}</div>
          </section>
        </div>

        <footer class="creator-footer">
          <button type="button" class="creator-save-btn" id="creator-save">Save Look ✨</button>
        </footer>
      </div>
    `
  }

  private bindEvents(): void {
    this.container.querySelector('#creator-close')?.addEventListener('click', () => this.close())

    this.container.querySelectorAll<HTMLButtonElement>('[data-style]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.current.hairStyle = btn.dataset.style as HairStyleName
        this.updateActiveSelections()
        this.applyLive()
      })
    })

    this.container.querySelectorAll<HTMLButtonElement>('[data-hair-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.current.hairColor = Number(btn.dataset.hairColor)
        this.updateActiveSelections()
        this.applyLive()
      })
    })

    this.container.querySelectorAll<HTMLButtonElement>('[data-skin]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.current.skinColor = Number(btn.dataset.skin)
        this.updateActiveSelections()
        this.applyLive()
      })
    })

    this.container.querySelectorAll<HTMLButtonElement>('[data-eye]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.current.eyeColor = Number(btn.dataset.eye)
        this.updateActiveSelections()
        this.applyLive()
      })
    })

    this.container.querySelector('#creator-save')?.addEventListener('click', () => {
      playerState.data.character.customization = { ...this.current }
      playerState.save(true)
      this.onApply(this.current)
      audioManager.play('purchase')
      showToast('Looking gorgeous! New look saved! 💖')
      this.close(false)
    })
  }

  private updateActiveSelections(): void {
    this.container.querySelectorAll<HTMLButtonElement>('[data-style]').forEach((btn) => {
      btn.classList.toggle('selected', btn.dataset.style === this.current.hairStyle)
    })
    this.container.querySelectorAll<HTMLButtonElement>('[data-hair-color]').forEach((btn) => {
      btn.classList.toggle('selected', Number(btn.dataset.hairColor) === this.current.hairColor)
    })
    this.container.querySelectorAll<HTMLButtonElement>('[data-skin]').forEach((btn) => {
      btn.classList.toggle('selected', Number(btn.dataset.skin) === this.current.skinColor)
    })
    this.container.querySelectorAll<HTMLButtonElement>('[data-eye]').forEach((btn) => {
      btn.classList.toggle('selected', Number(btn.dataset.eye) === this.current.eyeColor)
    })
  }

  private applyLive(): void {
    audioManager.play('button')
    this.onApply(this.current)
  }
}

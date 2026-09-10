import { audioManager } from '../audio/AudioManager'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
}

/**
 * Kid-friendly in-game confirmation dialog (BUG-9 fix).
 * Replaces blocking window.confirm() so the Phaser loop keeps running.
 */
export class ConfirmModal {
  private container: HTMLElement
  private busy = false
  private returnFocus: HTMLElement | null = null

  constructor() {
    this.container = document.createElement('div')
    this.container.hidden = true
    Object.assign(this.container.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '10000',
      display: 'none',
      placeItems: 'center',
      background: 'rgba(92, 61, 78, 0.45)',
    })
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) this.close()
    })
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !this.container.hidden) this.close()
    })
    document.body.appendChild(this.container)
  }

  isOpen(): boolean { return !this.container.hidden }

  ask(options: ConfirmOptions): void {
    this.busy = false
    this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    this.container.innerHTML = `
      <div role="dialog" aria-modal="true" aria-label="${options.title}" style="background:#fff8e9;border:4px solid #ffffff;border-radius:24px;box-shadow:0 18px 44px rgba(102,61,99,.35);padding:24px 28px;max-width:360px;width:calc(100% - 48px);text-align:center;font-family:'Trebuchet MS',sans-serif;color:#754c72;">
        <h2 style="margin:0 0 10px;font-size:20px;">${options.title}</h2>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.55;">${options.message}</p>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button type="button" data-confirm-cancel style="border:2px solid #e8cfe4;border-radius:999px;background:#f4dbe8;color:#754c72;font-family:inherit;font-weight:bold;font-size:14px;padding:10px 20px;cursor:pointer;">${options.cancelLabel ?? 'Cancel'}</button>
          <button type="button" data-confirm-ok style="border:2px solid #ffffff;border-radius:999px;background:#dd5ca0;color:#ffffff;font-family:inherit;font-weight:bold;font-size:14px;padding:10px 20px;cursor:pointer;">${options.confirmLabel ?? 'OK'}</button>
        </div>
      </div>
    `
    this.container.querySelector('[data-confirm-cancel]')?.addEventListener('click', () => this.close())
    this.container.querySelector('[data-confirm-ok]')?.addEventListener('click', () => {
      if (this.busy) return
      this.busy = true
      audioManager.play('chime')
      this.close()
      options.onConfirm()
    })
    this.container.hidden = false
    this.container.style.display = 'grid'
    this.container.querySelector<HTMLButtonElement>('[data-confirm-cancel]')?.focus()
    audioManager.play('button')
  }

  close(): void {
    this.container.hidden = true
    this.container.style.display = 'none'
    this.returnFocus?.focus()
    this.returnFocus = null
  }
}

export const confirmModal = new ConfirmModal()

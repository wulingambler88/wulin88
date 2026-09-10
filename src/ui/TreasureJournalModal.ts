import {
  TREASURE_MYSTERIES,
  type TreasureMystery,
} from '../data/treasureHunt'
import { treasureManager } from '../treasure/TreasureManager'
import type { LocationId } from '../data/locations'
import { playerState } from '../state/PlayerState'
import { audioManager } from '../audio/AudioManager'
import { showToast } from './UIManager'
import { localDayKey } from '../state/DailyActivities'

export type TreasureTab = 'clue' | 'cases' | 'vault'

export class TreasureJournalModal {
  private container: HTMLElement
  private currentTab: TreasureTab = 'clue'
  private showHint = false
  private onTravel?: (location: LocationId) => void

  constructor(onTravel?: (location: LocationId) => void) {
    this.onTravel = onTravel
    this.container = document.createElement('div')
    this.container.className = 'treasure-modal-overlay'
    this.container.hidden = true
    this.container.style.display = 'none'
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

    this.render()
  }

  open(tab: TreasureTab = 'clue'): void {
    this.currentTab = tab
    this.showHint = false
    this.container.hidden = false
    this.container.style.display = 'grid'
    this.render()
    audioManager.play('wardrobe')
  }

  close(): void {
    this.container.hidden = true
    this.container.style.display = 'none'
    audioManager.play('button')
  }

  private setTab(tab: TreasureTab): void {
    this.currentTab = tab
    this.showHint = false
    audioManager.play('button')
    this.render()
  }

  private render(): void {
    const activeMystery = treasureManager.getActiveMystery()
    const currentClue = treasureManager.getCurrentClue()

    this.container.innerHTML = `
      <div class="treasure-journal-sheet" role="dialog" aria-modal="true" aria-label="Detective Treasure Journal">
        <header class="treasure-header">
          <div class="treasure-title-area">
            <span class="treasure-logo">📜</span>
            <div>
              <small>TOWN DETECTIVE SQUAD</small>
              <h2>Treasure Scavenger Journal</h2>
            </div>
          </div>
          <button type="button" class="treasure-close-btn" aria-label="Close journal" title="Close">✕</button>
        </header>

        <nav class="treasure-nav-tabs">
          <button type="button" class="treasure-tab-btn ${this.currentTab === 'clue' ? 'active' : ''}" data-tab="clue">
            <span>🔍</span><b>Active Clue</b>
          </button>
          <button type="button" class="treasure-tab-btn ${this.currentTab === 'cases' ? 'active' : ''}" data-tab="cases">
            <span>📁</span><b>Caseboard</b>
          </button>
          <button type="button" class="treasure-tab-btn ${this.currentTab === 'vault' ? 'active' : ''}" data-tab="vault">
            <span>💎</span><b>Vault</b>
          </button>
        </nav>

        <div class="treasure-body">
          ${this.renderTabContent(activeMystery, currentClue)}
        </div>
      </div>
    `

    this.bindEvents()
  }

  private renderTabContent(
    activeMystery: TreasureMystery | null,
    currentClue: ReturnType<typeof treasureManager.getCurrentClue>,
  ): string {
    switch (this.currentTab) {
      case 'clue':
        return this.renderClueTab(activeMystery, currentClue)
      case 'cases':
        return this.renderCasesTab(activeMystery)
      case 'vault':
        return this.renderVaultTab()
    }
  }

  private renderClueTab(
    activeMystery: TreasureMystery | null,
    currentClue: ReturnType<typeof treasureManager.getCurrentClue>,
  ): string {
    if (!activeMystery || !currentClue) {
      return `
        <div class="empty-quest-card">
          <span style="font-size:3rem">📜</span>
          <h3>No Active Case!</h3>
          <p>The Town Notice Board has unsolved mysteries waiting for your keen detective eye!</p>
          <button type="button" class="btn-action" id="go-caseboard-btn" style="margin-top:10px">
            Open Caseboard ➔
          </button>
        </div>
      `
    }

    const totalSteps = activeMystery.steps.length
    const currentStepNum = currentClue.stepIndex + 1
    const isFinal = currentStepNum === totalSteps

    return `
      <div class="active-clue-panel">
        <div class="mystery-summary-bar">
          <div class="mystery-badge-title">
            <span>${activeMystery.icon}</span>
            <div>
              <h3>${activeMystery.title}</h3>
              <small>Clue ${currentStepNum} of ${totalSteps} • ${currentClue.locationName}</small>
            </div>
          </div>
          <div class="mystery-step-dots">
            ${activeMystery.steps.map((_, i) => `
              <span class="step-dot ${i < currentStepNum ? 'completed' : ''} ${i === currentClue.stepIndex ? 'current' : ''}">${i + 1}</span>
            `).join('')}
          </div>
        </div>

        <!-- Parchment Clue Scroll -->
        <div class="parchment-scroll">
          <div class="parchment-stamp">${isFinal ? '🏆 GRAND CHEST' : '🔍 CLUE RIDDLE'}</div>
          <p class="riddle-text">"${currentClue.riddle}"</p>
          <div class="riddle-target-tag">
            <span>📍 Target Location: <b>${currentClue.locationName}</b></span>
            <span>🔎 Clue Object: <b>${currentClue.propName}</b></span>
          </div>
        </div>

        <!-- Helpful Assistance for Kids -->
        <div class="clue-assistance-box">
          ${
            this.showHint
              ? `
            <div class="revealed-hint">
              <span>💡 <b>Detective Tip:</b> ${currentClue.hint}</span>
            </div>
          `
              : `
            <button type="button" class="btn-hint-toggle" id="hint-toggle-btn">
              💡 Need a Detective Tip?
            </button>
          `
          }
        </div>

        <!-- Travel Shortcut Button -->
        <div class="clue-action-row">
          <button type="button" class="btn-travel" id="clue-travel-btn">
            🚀 Travel to ${currentClue.locationName}
          </button>
        </div>
      </div>
    `
  }

  private renderCasesTab(activeMystery: TreasureMystery | null): string {
    const mysteriesHtml = TREASURE_MYSTERIES.map((mystery) => {
      const isSolved = treasureManager.isMysterySolved(mystery.id)
      const isActive = activeMystery?.id === mystery.id

      return `
        <div class="mystery-case-card ${isSolved ? 'solved' : ''} ${isActive ? 'active' : ''}">
          <div class="case-card-header">
            <span class="case-icon">${mystery.icon}</span>
            <div class="case-header-text">
              <h4>${mystery.title}</h4>
              <p>${mystery.description}</p>
            </div>
          </div>

          <div class="case-reward-bar">
            <span>🎁 Reward: <b>+${mystery.reward.starCoins} ⭐</b> ${mystery.reward.title ? `+ ${mystery.reward.title}` : ''}</span>
          </div>

          <div class="case-action-bar">
            ${
              isSolved
                ? '<span class="status-pill-solved">✓ CASE SOLVED 🏆</span>'
                : isActive
                  ? '<span class="status-pill-active">🔍 INVESTIGATING NOW</span>'
                  : `<button type="button" class="btn-accept-case" data-mystery-id="${mystery.id}">Accept Case ➔</button>`
            }
          </div>
        </div>
      `
    }).join('')

    return `
      <div class="caseboard-panel">
        <div class="caseboard-header">
          <p>Choose an exciting mystery case! Solve clues to earn rare outfits and gold.</p>
        </div>
        <div class="cases-list">
          ${mysteriesHtml}
        </div>
        <div class="daily-mystery-box">
          <div class="daily-text">
            <span>🧭 <b>Daily Explorer Quest</b></span>
            <small>New mini-scavenger hunts around town anytime!</small>
          </div>
          <button type="button" class="btn-action-daily" id="daily-hunt-btn">Start Daily Hunt ➔</button>
        </div>
      </div>
    `
  }

  private renderVaultTab(): string {
    const solvedCount = treasureManager.getCasesSolvedCount()
    const clothes = playerState.data.ownedClothing

    const exclusiveItems = [
      { id: 'hat_detective_cap', name: 'Detective Deerstalker', icon: '🕵️', source: 'The Case of the Golden Whisker' },
      { id: 'dress_detective_cape', name: 'Detective Trench & Cape', icon: '🧥', source: 'The Case of the Golden Whisker' },
      { id: 'hat_star_tiara', name: 'Royal Starlight Tiara', icon: '👑', source: 'The Mystery of the Starlight Tiara' },
      { id: 'hat_pirate_bandana', name: 'Captain Pirate Bandana', icon: '🏴‍☠️', source: 'The Pirate Captain\'s Secret Stash' },
    ]

    const itemsHtml = exclusiveItems.map((item) => {
      const isOwned = clothes.includes(item.id)
      return `
        <div class="vault-item-card ${isOwned ? 'owned' : 'locked'}">
          <div class="vault-icon-box">
            <span>${item.icon}</span>
            ${isOwned ? '<span class="vault-check">✓</span>' : ''}
          </div>
          <div class="vault-item-info">
            <h4>${item.name}</h4>
            <small>From: ${item.source}</small>
          </div>
          <div class="vault-item-status">
            ${isOwned ? '<b class="unlocked-text">OWNED ✨</b>' : '<span class="locked-text">🔒 Locked</span>'}
          </div>
        </div>
      `
    }).join('')

    return `
      <div class="vault-panel">
        <div class="vault-stats-bar">
          <div class="stat-pill">🏆 <span>Mysteries Solved:</span> <b>${solvedCount} / 3</b></div>
          <div class="stat-pill">⭐ <span>Treasure Items:</span> <b>${exclusiveItems.filter(i => clothes.includes(i.id)).length} / 4</b></div>
        </div>

        <div class="vault-grid">
          ${itemsHtml}
        </div>

        <div class="badges-footer">
          <button type="button" class="btn-action" id="vault-close-btn">✓ Return to Town</button>
        </div>
      </div>
    `
  }

  private bindEvents(): void {
    const closeBtn = this.container.querySelector<HTMLButtonElement>('.treasure-close-btn')
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation()
        this.close()
      }
    }

    const vaultCloseBtn = this.container.querySelector<HTMLButtonElement>('#vault-close-btn')
    if (vaultCloseBtn) {
      vaultCloseBtn.onclick = (e) => {
        e.stopPropagation()
        this.close()
      }
    }

    this.container.querySelectorAll<HTMLButtonElement>('.treasure-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab as TreasureTab
        if (tab) this.setTab(tab)
      })
    })

    this.container.querySelector('#go-caseboard-btn')?.addEventListener('click', () => {
      this.setTab('cases')
    })

    this.container.querySelector('#hint-toggle-btn')?.addEventListener('click', () => {
      this.showHint = true
      audioManager.play('chime')
      this.render()
    })

    this.container.querySelector('#clue-travel-btn')?.addEventListener('click', () => {
      const clue = treasureManager.getCurrentClue()
      if (clue) {
        audioManager.play('button')
        this.close()
        this.onTravel?.(clue.location)
      }
    })

    this.container.querySelectorAll<HTMLButtonElement>('.btn-accept-case[data-mystery-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.mysteryId
        if (id) {
          treasureManager.startMystery(id)
          this.setTab('clue')
        }
      })
    })

    this.container.querySelector('#daily-hunt-btn')?.addEventListener('click', () => {
      // Deterministic seed from the real calendar date (BUG-8 fix): same hunt all day.
      const daySeed = localDayKey()
      const activeMystery = treasureManager.getActiveMystery()
      if (activeMystery?.id === `daily_hunt_${daySeed}`) {
        audioManager.play('button')
        showToast('You are already on today\'s hunt! Follow the active clue. 🔍')
        this.setTab('clue')
        return
      }
      treasureManager.startMystery(`daily_hunt_${daySeed}`)
      this.setTab('clue')
    })
  }
}

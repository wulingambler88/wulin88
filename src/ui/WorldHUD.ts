import type Phaser from 'phaser'
import { Icons } from '../theme/Icons'
import { playerState } from '../state/PlayerState'
import { activityComplete, claimDailyReward, completeActivity, DAILY_REWARD, localDayKey } from '../state/DailyActivities'
import { showToast } from './UIManager'

export function installWorldHUD(game: Phaser.Game): void {
  const assign = (selector: string, icon: keyof typeof Icons): void => {
    const node = document.querySelector<HTMLElement>(selector)
    if (node) node.innerHTML = `<span class="world-icon" aria-hidden="true">${Icons[icon]}</span>`
  }
  const nav: Record<string, keyof typeof Icons> = {
    'map-button': 'town',
    'home-button': 'home',
    'clues-button-nav': 'clues',
    'brain-button-nav': 'brain',
    'inventory-button': 'bag',
    'wardrobe-button': 'dress',
    'creator-button': 'avatar',
    'pet-whistle-button': 'pet',
    'edit-button': 'build',
    'reset-button': 'reset',
  }
  for (const [id, icon] of Object.entries(nav)) assign(`#${id} > span`, icon)
  assign('#clues-button', 'clues'); assign('#brain-button', 'brain'); assign('#time-button', 'sun'); assign('#sound-button', 'soundOn')
  assign('.coin-pill > span', 'star')
  assign('[data-room="0"] > span', 'bedroom'); assign('[data-room="1"] > span', 'livingRoom'); assign('[data-room="2"] > span', 'kitchen')

  const portrait = document.querySelector<HTMLElement>('.profile-portrait')
  if (portrait) {
    portrait.innerHTML = Icons.qianHuiPortrait
  }

  const townGiftBox = document.querySelector<HTMLElement>('#town-gift-box')
  if (townGiftBox) townGiftBox.innerHTML = Icons.giftBox

  // Sound toggling is owned by the single #sound-button listener in main.ts (BUG-1 fix).
  // Audit fix #1: time-of-day icon is managed by the click handler in main.ts.
  // The previous listener reset the icon to 'sun' on every cycle, overwriting
  // the sunset/moon emoji that main.ts had just set.
  game.events.on('ui:edit-state', () => assign('#edit-button > span', 'build'))

  const todayButton = document.createElement('button')
  todayButton.type = 'button'; todayButton.className = 'round-button world-today-button'; todayButton.id = 'world-today'
  todayButton.setAttribute('aria-expanded', 'false'); todayButton.setAttribute('aria-label', 'Today: optional activities and daily gift')
  todayButton.innerHTML = `<span class="world-icon">${Icons.quests}</span><small>Today</small>`
  document.querySelector('.top-bar')!.insertBefore(todayButton, document.querySelector('#clues-button'))

  const today = document.createElement('section'); today.className = 'world-today-panel'; today.hidden = true; today.setAttribute('aria-label', 'Today’s little adventures'); today.setAttribute('role', 'dialog')
  today.innerHTML = `<header><strong>Today’s little adventures</strong><button type="button" aria-label="Close daily activities">×</button></header><p>No rush. Play your own way.</p><ul><li data-activity="shop"></li><li data-activity="game"></li><li data-activity="decorate"></li></ul><button type="button" id="world-daily-gift"></button><small>A fixed gift. No luck, no streak pressure.</small>`
  document.querySelector('.game-shell')!.append(today)

  const settingsButton = document.createElement('button')
  settingsButton.type = 'button'; settingsButton.id = 'world-settings-button'; settingsButton.className = 'round-button'
  settingsButton.setAttribute('aria-label', 'Game settings'); settingsButton.innerHTML = `<span class="world-icon" aria-hidden="true">${Icons.settings}</span>`
  document.querySelector('.top-bar')!.insertBefore(settingsButton, document.querySelector('#sound-button'))
  const settings = document.createElement('section')
  settings.className = 'world-settings'; settings.hidden = true; settings.setAttribute('aria-label', 'Game settings'); settings.setAttribute('role', 'dialog')
  settings.innerHTML = '<header><strong>Game settings</strong><button type="button" aria-label="Close settings">×</button></header><label><input type="checkbox" id="world-reduced-motion"> Gentle motion</label><p>Reduce ambient effects while keeping the world playable.</p>'
  document.querySelector('.game-shell')!.append(settings)
  const motion = settings.querySelector<HTMLInputElement>('#world-reduced-motion')!
  motion.checked = playerState.data.settings.reducedMotion
  const stopActiveMotion = (): void => {
    game.scene.getScenes(true).forEach((scene) => scene.tweens.killAll())
  }
  motion.addEventListener('change', () => {
    playerState.data.settings.reducedMotion = motion.checked
    playerState.save(true)
    if (motion.checked) {
      stopActiveMotion()
      showToast('Gentle motion is on.')
    } else {
      showToast('Full motion will return when you enter a new place.')
    }
    game.events.emit('ui:reduced-motion', motion.checked)
  })
  const closeSettings = (): void => { settings.hidden = true; settingsButton.setAttribute('aria-expanded', 'false'); settingsButton.focus() }
  settingsButton.setAttribute('aria-expanded', 'false')
  settingsButton.addEventListener('click', () => {
    settings.hidden = !settings.hidden
    settingsButton.setAttribute('aria-expanded', String(!settings.hidden))
    if (!settings.hidden) {
      today.hidden = true; todayButton.setAttribute('aria-expanded', 'false')
      settings.querySelector<HTMLButtonElement>('header button')?.focus()
    }
  })
  settings.querySelector('header button')!.addEventListener('click', closeSettings)
  settings.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSettings() })

  const gift = today.querySelector<HTMLButtonElement>('#world-daily-gift')!
  const townGiftBtn = document.querySelector<HTMLButtonElement>('#town-gift-btn')

  const renderDaily = (): void => {
    for (const [key, title] of [['shop', 'Visit a shop'], ['game', 'Play a game'], ['decorate', 'Decorate home']] as const) {
      const item = today.querySelector(`[data-activity="${key}"]`)
      if (item) item.textContent = `${activityComplete(playerState.data.minigames, key) ? '✓' : '○'} ${title}`
    }
    const claimed = (playerState.data.minigames['world:daily:claimed'] ?? 0) >= localDayKey()
    gift.disabled = claimed
    gift.textContent = claimed ? 'Gift collected — see you tomorrow!' : `Daily gift · ${DAILY_REWARD} Star Coins`

    if (townGiftBtn) {
      townGiftBtn.disabled = claimed
      townGiftBtn.textContent = claimed ? 'Claimed! ⭐' : 'Daily Reward'
    }

    const progShop = document.querySelector('#task-shop-count')
    if (progShop) progShop.textContent = activityComplete(playerState.data.minigames, 'shop') ? '(1/1) ✓' : '(0/1)'
    const progGame = document.querySelector('#task-game-count')
    if (progGame) progGame.textContent = activityComplete(playerState.data.minigames, 'game') ? '(1/1) ✓' : '(0/1)'
    const progDecorate = document.querySelector('#task-decorate-count')
    if (progDecorate) progDecorate.textContent = activityComplete(playerState.data.minigames, 'decorate') ? '(1/1) ✓' : '(0/1)'
  }

  todayButton.addEventListener('click', () => {
    renderDaily(); today.hidden = !today.hidden; todayButton.setAttribute('aria-expanded', String(!today.hidden))
    if (!today.hidden) {
      settings.hidden = true; settingsButton.setAttribute('aria-expanded', 'false')
      today.querySelector<HTMLButtonElement>('header button')?.focus()
    }
  })
  today.querySelector('header button')!.addEventListener('click', () => { today.hidden = true; todayButton.setAttribute('aria-expanded', 'false'); todayButton.focus() })
  today.addEventListener('keydown', event => { if (event.key === 'Escape') { today.hidden = true; todayButton.setAttribute('aria-expanded', 'false'); todayButton.focus() } })

  gift.addEventListener('click', () => {
    const reward = claimDailyReward(playerState.data.minigames)
    if (reward) {
      playerState.currency.add(reward)
      playerState.save(true)
      showToast(`A little gift for you: ${reward} Star Coins! 🎁`)
    }
    renderDaily()
  })

  townGiftBtn?.addEventListener('click', () => gift.click())
  townGiftBox?.addEventListener('click', () => gift.click())
  document.querySelector('#town-today-card')?.addEventListener('click', () => todayButton.click())
  document.querySelector('#town-today-card')?.addEventListener('keydown', (event) => {
    const keyboardEvent = event as KeyboardEvent
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
      keyboardEvent.preventDefault()
      todayButton.click()
    }
  })
  document.querySelector('#coin-plus-btn')?.addEventListener('click', () => showToast('Find clues and play games to earn Star Coins! ⭐'))

  game.events.on('ui:context', (context: string) => {
    if (playerState.data.settings.reducedMotion) stopActiveMotion()
    if (context === 'boutique' || context === 'supermarket') {
      completeActivity(playerState.data.minigames, 'shop')
      playerState.save()
    }
    // BUG-19 fix: skip re-rendering the hidden panel on every context change.
    // The activity state is still recorded above and re-rendered on open.
    renderDaily()
  })
  game.events.on('shop:preview', () => { completeActivity(playerState.data.minigames, 'outfit'); playerState.save(); renderDaily() })
  game.events.on('brain:completed', renderDaily)
  game.events.on('world:decorated', () => { completeActivity(playerState.data.minigames, 'decorate'); playerState.save(); renderDaily() })

  for (const [id, title] of [['shop-panel', 'Browse outfits'], ['market-panel', 'Shop & basket']]) {
    const catalogue = document.getElementById(id)!
    const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'world-catalogue-toggle ' + (id === 'shop-panel' ? 'boutique-only' : 'supermarket-only')
    toggle.innerHTML = `<span class="world-icon">${Icons[id === 'shop-panel' ? 'dress' : 'basket']}</span>${title}`
    toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', id)
    catalogue.classList.add('world-collapsed')
    toggle.addEventListener('click', () => { const closed = catalogue.classList.toggle('world-collapsed'); toggle.setAttribute('aria-expanded', String(!closed)) })
    document.querySelector('.game-stage')!.append(toggle)
    game.events.on('ui:context', () => { catalogue.classList.add('world-collapsed'); toggle.setAttribute('aria-expanded', 'false') })
    game.events.on(id === 'shop-panel' ? 'world:browse-outfits' : 'world:browse-market', () => { catalogue.classList.remove('world-collapsed'); toggle.setAttribute('aria-expanded', 'true') })
  }

  renderDaily()
}

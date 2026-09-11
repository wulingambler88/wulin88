import './style.css'
import './world-style.css'
import { installWorldHUD } from './ui/WorldHUD'
import { createGame } from './game/Game'
import { CLOTHING_DEFINITIONS, ClothingRegistry, type ClothingDefinition } from './data/clothes'
import { ITEM_DEFINITIONS } from './data/items'
import { audioManager } from './audio/AudioManager'
import { playerState } from './state/PlayerState'
import { LOCATION_DEFINITIONS, type LocationId } from './data/locations'
import { CharacterCreatorModal } from './ui/CharacterCreatorModal'
import { BrainHubModal, type BrainHubTab } from './ui/BrainHubModal'
import { TreasureJournalModal, type TreasureTab } from './ui/TreasureJournalModal'
import { showToast } from './ui/UIManager'
import { Icons, createAvatarPortraitSVG } from './theme/Icons'
import { Character } from './characters/Character'
import type { AvatarCustomization } from './save/SaveSchema'
import { registerSW } from 'virtual:pwa-register'

function colorHex(color: number): string { return `#${color.toString(16).padStart(6, '0')}` }

const CLOTHING_ITEM_ICONS: Record<string, string> = {
  top_strawberry: '🍓',
  top_sunshine: '☀️',
  top_mint: '🌿',
  top_cloud_blue: '☁️',
  top_rose_stripe: '🌹',
  bottom_mint: '🩳',
  bottom_denim: '👖',
  bottom_lavender: '💜',
  bottom_cocoa: '🤎',
  dress_peach: '🍑',
  dress_star: '⭐',
  dress_meadow: '🌼',
  dress_detective_cape: '🧥',
  hat_beret: '👒',
  hat_sun: '☀️',
  hat_cat: '🐱',
  hat_cloud: '☁️',
  hat_flower_pearl: '🌸',
  hat_detective_cap: '🕵️',
  hat_star_tiara: '👑',
  hat_pirate_bandana: '🏴‍☠️',
  shoes_mint: '👟',
  shoes_strawberry: '🍓',
  shoes_star: '⭐',
  glasses_heart: '💖',
  accessory_star_pin: '⭐',
}

function clothingIcon(item: ClothingDefinition): string {
  if (item.icon) {
    return `<img src="${item.icon}" alt="${item.name}" />`
  }
  if (CLOTHING_ITEM_ICONS[item.id]) {
    return CLOTHING_ITEM_ICONS[item.id]
  }
  return item.layer === 'hat' ? '🎩' : item.layer === 'dress' ? '👗' : item.layer === 'bottom' ? '🩳' : item.layer === 'shoes' ? '👟' : item.layer === 'accessory' ? '👓' : '👕'
}

const wardrobeButtons = CLOTHING_DEFINITIONS.map((item) => `
  <button class="clothing-card" type="button" data-clothing="${item.id}" data-layer="${item.layer}" style="--swatch:${colorHex(item.color)};--accent:${colorHex(item.accent)}">
    <span class="clothing-swatch">${clothingIcon(item)}</span><b>${item.name}</b>
  </button>
`).join('')

const shopButtons = CLOTHING_DEFINITIONS.map((item) => `
  <button class="shop-card" type="button" data-shop-clothing="${item.id}" style="--swatch:${colorHex(item.color)}">
    <span>${clothingIcon(item)}</span><b>${item.name}</b><small>⭐ ${item.price}</small>
  </button>
`).join('')

const marketProducts = ITEM_DEFINITIONS.filter((item) => item.shop === 'supermarket')
const productButtons = marketProducts.map((item) => `
  <button class="product-card" type="button" data-product="${item.id}"><span>${item.icon}</span><b>${item.name}</b><small>⭐ ${item.price}</small></button>
`).join('')

const townLocationButtons = LOCATION_DEFINITIONS.map((location) => `<button type="button" data-location="${location.id}" aria-label="${location.name}${location.status === 'unlocked' ? '' : ' — Coming Soon'}" style="--x:${location.x / 9.6}%;--y:${location.y / 5.4}%;--w:${location.status === 'unlocked' ? 12 : 10}%;--h:${location.status === 'unlocked' ? 20 : 18}%"></button>`).join('')

const debugMarkup = import.meta.env.DEV && new URLSearchParams(window.location.search).has('debug') ? `
  <button class="debug-toggle" id="debug-toggle" type="button">DEV</button>
  <aside class="debug-panel" id="debug-panel" hidden>
    <strong>Developer</strong><span id="debug-readout">Waiting for scene…</span>
    <label class="home-only"><input id="anchor-toggle" type="checkbox"> Show interaction anchors</label>
    <div class="debug-actions">
      <button type="button" data-debug="coins-add">+100 ⭐</button><button type="button" data-debug="coins-remove">−100 ⭐</button>
      <button type="button" data-debug="unlock">Unlock current</button><button type="button" data-debug="clear-cart">Clear cart</button>
      <button type="button" data-debug="food">Add food</button><button type="button" data-debug="clothing">Add clothing</button>
      <button type="button" data-teleport="HomeScene">Home</button><button type="button" data-teleport="TownScene">Town</button>
      <button type="button" data-teleport="ClothingShopScene">Boutique</button><button type="button" data-teleport="SupermarketScene">Market</button>
      <button type="button" data-teleport="PetShopScene">Pet Shop</button><button type="button" data-teleport="ParkScene">Park</button>
      <button type="button" data-teleport="CafeScene">Café</button><button type="button" data-teleport="SalonScene">Salon</button>
      <button type="button" data-teleport="ToyShopScene">Toy Shop</button><button type="button" data-teleport="SchoolScene">School</button>
    </div>
  </aside>` : ''

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="game-shell" data-context="town" aria-label="Qian Hui Avatar City game">
    <header class="top-bar">
      <div class="brand profile-card" aria-label="Qian Hui Avatar City">
        <span class="profile-portrait">★</span>
        <div class="profile-info">
          <span class="profile-title">Qian Hui Avatar City</span>
          <span class="profile-subtitle">Little Moments <b class="heart-dot">♥</b> Big Imagination!</span>
        </div>
      </div>
      <div class="welcome-banner town-only" aria-label="Welcome banner">
        <span class="welcome-star">⭐</span>
        <div class="welcome-copy">
          <strong>Welcome back!</strong>
          <small>Let's explore and play!</small>
        </div>
      </div>
      <div class="needs venue-only" aria-label="Character needs">
        <span title="Happiness"><span class="world-icon">${Icons.statHappiness}</span><i id="stat-happiness" style="--value:80%"></i></span><span title="Energy"><span class="world-icon">${Icons.statEnergy}</span><i id="stat-energy" style="--value:80%"></i></span>
        <span title="Hunger"><span class="world-icon">${Icons.statHunger}</span><i id="stat-hunger" style="--value:70%"></i></span><span title="Fun"><span class="world-icon">${Icons.statFun}</span><i id="stat-fun" style="--value:80%"></i></span>
      </div>
      <div class="status-pill coin-pill" aria-label="Star coins">
        <span class="coin-star">⭐</span>
        <strong id="coin-balance">${playerState.currency.getBalance()}</strong>
        <button type="button" class="coin-plus-btn" id="coin-plus-btn" aria-label="Add coins">+</button>
        <em id="coin-change"></em>
      </div>
      <button class="round-button" id="clues-button" type="button" aria-label="Detective Clues Journal" title="Detective Clues">📜</button>
      <button class="round-button" id="brain-button" type="button" aria-label="Brain training games" title="Brain Games">🧠</button>
      <button class="round-button" id="time-button" type="button" aria-label="Cycle time of day">☀️</button>
      <button class="round-button" id="sound-button" type="button" aria-label="Mute sound" aria-pressed="false">🔊</button>
    </header>
    <section class="game-stage" aria-label="Game play area">
      <div id="game-container"></div>
      <aside class="town-left-deck town-only" aria-label="Today Quests and Daily Reward">
        <div class="today-widget-card" id="town-today-card" role="button" tabindex="0" aria-label="Today activities">
          <div class="today-header">
            <strong>Today</strong><span class="star-accent">⭐</span>
          </div>
          <ul class="today-task-list">
            <li data-task="games"><span class="task-badge">⭐</span><div class="task-info"><span>Play a game</span><small id="task-game-count">(0/1)</small></div></li>
            <li data-task="shop"><span class="task-badge">⭐</span><div class="task-info"><span>Visit a shop</span><small id="task-shop-count">(0/1)</small></div></li>
            <li data-task="decorate"><span class="task-badge">💼</span><div class="task-info"><span>Decorate home</span><small id="task-decorate-count">(0/1)</small></div></li>
          </ul>
        </div>
        <div class="daily-reward-widget">
          <div class="reward-gift-box" id="town-gift-box">🎁</div>
          <button type="button" class="daily-reward-btn" id="town-gift-btn">Daily Reward</button>
        </div>
      </aside>
      <div class="town-location-layer town-only" id="town-location-layer" aria-label="Town locations">${townLocationButtons}</div>
      <div id="toast" class="toast" role="status" aria-live="polite"></div>
      <div class="edit-actions" id="edit-actions" hidden>
        <div class="edit-toolbar-top">
          <button type="button" id="undo-button">↶ Undo</button>
          <button type="button" id="redo-button">↷ Redo</button>
          <button type="button" id="remove-button">🗑 Remove</button>
        </div>
        <div class="furniture-tray" id="furniture-tray" aria-label="Furniture catalog tray">
          <span class="furniture-tray-label">Tap to place:</span>
          <button type="button" class="furniture-pill" data-place-furniture="bed" title="Cloud Bed">🛏️ Bed</button>
          <button type="button" class="furniture-pill" data-place-furniture="sofa" title="Berry Sofa">🛋️ Sofa</button>
          <button type="button" class="furniture-pill" data-place-furniture="chair" title="Mint Chair">🪑 Chair</button>
          <button type="button" class="furniture-pill" data-place-furniture="table" title="Kitchen Table">🪵 Table</button>
          <button type="button" class="furniture-pill" data-place-furniture="wardrobe" title="Peach Wardrobe">🚪 Wardrobe</button>
          <button type="button" class="furniture-pill" data-place-furniture="bookshelf" title="Book Nook">📚 Bookshelf</button>
          <button type="button" class="furniture-pill" data-place-furniture="lamp" title="Star Lamp">💡 Lamp</button>
          <button type="button" class="furniture-pill" data-place-furniture="rug" title="Berry Rug">🌸 Rug</button>
          <button type="button" class="furniture-pill" data-place-furniture="plant" title="Happy Plant">🪴 Plant</button>
          <button type="button" class="furniture-pill" data-place-furniture="tv" title="Star TV">📺 TV</button>
        </div>
      </div>
      <section class="wardrobe-panel" id="wardrobe-panel" aria-label="Wardrobe" hidden>
        <header>
          <div><small>WARDROBE</small><h2>Your outfits</h2></div>
          <div style="display:flex;gap:6px">
            <button type="button" id="wardrobe-random-btn" class="nav-button" title="Surprise me with a random look">🎲 Surprise</button>
            <button type="button" id="wardrobe-creator-btn" class="nav-button">✂️ Style</button>
            <button type="button" id="wardrobe-close" aria-label="Close wardrobe">×</button>
          </div>
        </header>
        <div class="wardrobe-tabs" id="wardrobe-tabs" role="tablist">
          <button class="wardrobe-tab active" type="button" data-wardrobe-filter="all">✨ All</button>
          <button class="wardrobe-tab" type="button" data-wardrobe-filter="dress">👗 Dresses</button>
          <button class="wardrobe-tab" type="button" data-wardrobe-filter="top">👕 Tops</button>
          <button class="wardrobe-tab" type="button" data-wardrobe-filter="bottom">🩳 Bottoms</button>
          <button class="wardrobe-tab" type="button" data-wardrobe-filter="shoes">👟 Shoes</button>
          <button class="wardrobe-tab" type="button" data-wardrobe-filter="hat">👒 Hats</button>
          <button class="wardrobe-tab" type="button" data-wardrobe-filter="accessory">👓 Accessories</button>
        </div>
        <div class="clothing-grid">${wardrobeButtons}</div>
        <div class="wardrobe-empty-state" id="wardrobe-empty" hidden>
          <span class="wardrobe-empty-icon">👗</span>
          <p>No outfits in this category yet!</p>
          <small>Visit the Cloudberry Boutique in Town to shop new looks ✨</small>
        </div>
      </section>
      <section class="shop-panel boutique-only" id="shop-panel" aria-label="Boutique catalogue">
        <header><div><small>BOUTIQUE</small><h2>Try a new look</h2></div><span id="shop-owned-label">Tap to preview</span></header>
        <div class="shop-grid">${shopButtons}</div>
        <div class="shop-actions" id="shop-actions" hidden><button type="button" id="shop-cancel">Cancel</button><button type="button" id="shop-buy">Buy</button></div>
      </section>
      <section class="market-panel supermarket-only" id="market-panel" aria-label="Supermarket products and basket">
        <header><div><small>MARKET</small><h2>Fresh picks</h2></div><button type="button" id="cart-toggle" aria-expanded="true">🧺 Basket</button></header>
        <div class="product-grid">${productButtons}</div>
        <aside class="cart" id="cart">
          <div id="cart-lines" class="cart-lines">
            <div class="cart-empty-message">
              <span class="cart-empty-icon">🧺</span>
              <p>Your basket is empty!</p>
              <small>⭐ Tap products to add them.</small>
            </div>
          </div>
          <div class="cart-total"><strong>Total</strong><b id="cart-total">⭐ 0</b></div>
          <div class="cart-actions">
            <button type="button" id="cart-clear-button" class="cart-clear-button" disabled>🗑 Clear</button>
            <button type="button" id="checkout-button" disabled>Checkout</button>
          </div>
        </aside>
      </section>
      ${debugMarkup}<div class="rotate-hint"><span>↻</span><strong>Turn sideways to play</strong></div>
    </section>
    <nav class="bottom-bar" aria-label="Game navigation">
      <div class="dock-nav">
        <button class="nav-button" id="map-button" type="button"><span>🗺️</span><b>Town</b></button>
        <button class="nav-button away-only" id="home-button" type="button"><span>🏠</span><b>Home</b></button>
        <button class="nav-button with-badge" id="clues-button-nav" type="button"><span>📜</span><b>Clues</b><span class="notif-dot">!</span></button>
        <button class="nav-button" id="brain-button-nav" type="button"><span>🧠</span><b>Games</b></button>
      </div>
      <div class="room-switcher home-only" aria-label="Rooms"><button type="button" data-room="0" class="active" aria-label="Bedroom">🛏️</button><button type="button" data-room="1" aria-label="Living room">🛋️</button><button type="button" data-room="2" aria-label="Kitchen">🍳</button></div>
      <div class="helper-text"><span class="drag-hand">☝️</span><span id="helper-copy">Choose a place</span></div>
      <div class="dock-actions">
        <button class="nav-button" id="creator-button" type="button"><span>✨</span><b>Avatar</b></button>
        <button class="nav-button" id="wardrobe-button" type="button"><span>👗</span><b>Dress</b></button>
        <button class="nav-button" id="pet-whistle-button" type="button"><span>🐾</span><b>Pet</b></button>
        <button class="nav-button" id="inventory-button" type="button"><span>🎒</span><b>Bag</b></button>
        <button class="nav-button home-only" id="edit-button" type="button"><span>✏️</span><b>Build</b></button>
        <button class="nav-button town-only" id="reset-button" type="button"><span>↺</span><b>Reset</b></button>
      </div>
    </nav>
  </main>`

const game = createGame('game-container')
;(window as Window & { __PHASER_GAME__?: typeof game }).__PHASER_GAME__ = game
const shell = document.querySelector<HTMLElement>('.game-shell')!
const wardrobePanel = document.querySelector<HTMLElement>('#wardrobe-panel')!
const editButton = document.querySelector<HTMLButtonElement>('#edit-button')!
const editActions = document.querySelector<HTMLElement>('#edit-actions')!
const coinBalance = document.querySelector<HTMLElement>('#coin-balance')!
let previousCoins = playerState.currency.getBalance()

function updateCoins(value: number): void {
  const change = value - previousCoins
  previousCoins = value
  coinBalance.textContent = String(value)
  coinBalance.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 280 })
  const label = document.querySelector<HTMLElement>('#coin-change')!
  if (change !== 0) { label.textContent = `${change > 0 ? '+' : ''}${change} ⭐`; label.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-16px)' }], { duration: 900 }) }
}

document.querySelector<HTMLButtonElement>('#sound-button')!.addEventListener('click', (event) => {
  const button = event.currentTarget as HTMLButtonElement
  game.sound.mute = !game.sound.mute; audioManager.muted = game.sound.mute
  const iconSpan = button.querySelector<HTMLElement>('.world-icon')
  if (iconSpan) iconSpan.innerHTML = game.sound.mute ? Icons.soundMuted : Icons.soundOn
  button.setAttribute('aria-pressed', String(game.sound.mute)); button.setAttribute('aria-label', game.sound.mute ? 'Unmute sound' : 'Mute sound')
  playerState.data.settings.muted = game.sound.mute; playerState.save()
  game.events.emit('ui:mute', game.sound.mute)
})

function updateProfilePortrait(custom?: AvatarCustomization): void {
  const portrait = document.querySelector<HTMLElement>('.profile-portrait')
  if (portrait) {
    portrait.innerHTML = createAvatarPortraitSVG(custom ?? playerState.data.character.customization)
  }
}

const creatorModal = new CharacterCreatorModal((custom) => {
  game.scene.getScenes(true).forEach((scene) => {
    scene.children.list.forEach((child) => {
      if (child instanceof Character) child.setCustomization(custom)
    })
  })
  updateProfilePortrait(custom)
  game.events.emit('character:customized', custom)
})
game.events.on('character:customized', (custom: AvatarCustomization) => {
  updateProfilePortrait(custom)
})
const brainHub = new BrainHubModal()
document.querySelector<HTMLButtonElement>('#brain-button')?.addEventListener('click', () => brainHub.open())
document.querySelector<HTMLButtonElement>('#brain-button-nav')?.addEventListener('click', () => brainHub.open())
game.events.on('ui:open-brain-hub', (tab?: BrainHubTab) => brainHub.open(tab))
const treasureJournal = new TreasureJournalModal((location) => {
  if (location === 'town') game.events.emit('ui:map')
  else if (location === 'home') game.events.emit('ui:home')
  else game.events.emit('ui:location', location)
})
document.querySelector<HTMLButtonElement>('#clues-button')?.addEventListener('click', () => treasureJournal.open())
document.querySelector<HTMLButtonElement>('#clues-button-nav')?.addEventListener('click', () => treasureJournal.open())
game.events.on('ui:open-treasure-journal', (tab?: TreasureTab) => treasureJournal.open(tab))

document.querySelector<HTMLButtonElement>('#creator-button')?.addEventListener('click', () => creatorModal.open())
document.querySelector<HTMLButtonElement>('#wardrobe-creator-btn')?.addEventListener('click', () => creatorModal.open())
document.querySelector<HTMLButtonElement>('#pet-whistle-button')?.addEventListener('click', () => game.events.emit('ui:pet-whistle'))

let currentTimeIndex = 0
const timeIcons = [Icons.sun, Icons.sunset, Icons.moon]
const timeLabels = ['day', 'sunset', 'night']
document.querySelector<HTMLButtonElement>('#time-button')?.addEventListener('click', (event) => {
  currentTimeIndex = (currentTimeIndex + 1) % timeIcons.length
  const btn = event.currentTarget as HTMLButtonElement
  btn.innerHTML = `<span class="world-icon" aria-hidden="true">${timeIcons[currentTimeIndex]}</span>`
  btn.setAttribute('aria-label', `Change time of day. Current: ${timeLabels[currentTimeIndex]}`)
  game.events.emit('ui:time-cycle')
})

document.querySelector<HTMLButtonElement>('#map-button')!.addEventListener('click', () => game.events.emit('ui:map'))
document.querySelector<HTMLButtonElement>('#home-button')!.addEventListener('click', () => game.events.emit('ui:home'))
document.querySelector<HTMLButtonElement>('#reset-button')!.addEventListener('click', () => game.events.emit('ui:reset'))
document.querySelector<HTMLButtonElement>('#inventory-button')!.addEventListener('click', () => game.events.emit('ui:inventory'))
document.querySelector<HTMLButtonElement>('#wardrobe-button')!.addEventListener('click', () => game.events.emit('ui:wardrobe'))
editButton.addEventListener('click', () => game.events.emit('ui:edit'))
document.querySelector<HTMLButtonElement>('#undo-button')!.addEventListener('click', () => game.events.emit('ui:undo'))
document.querySelector<HTMLButtonElement>('#redo-button')!.addEventListener('click', () => game.events.emit('ui:redo'))
document.querySelector<HTMLButtonElement>('#remove-button')!.addEventListener('click', () => game.events.emit('ui:remove-furniture'))
document.querySelectorAll<HTMLButtonElement>('[data-room]').forEach((button) => button.addEventListener('click', () => game.events.emit('ui:room', Number(button.dataset.room))))
document.querySelectorAll<HTMLButtonElement>('[data-clothing]').forEach((button) => button.addEventListener('click', () => game.events.emit('ui:equip', button.dataset.clothing)))
document.querySelector<HTMLButtonElement>('#wardrobe-close')!.addEventListener('click', () => { wardrobePanel.hidden = true })

let activeWardrobeFilter = 'all'

function refreshWardrobeFilter(): void {
  const owned = playerState.data.ownedClothing
  let visibleCount = 0
  document.querySelectorAll<HTMLButtonElement>('[data-clothing]').forEach((button) => {
    const id = button.dataset.clothing ?? ''
    const layer = button.dataset.layer ?? ''
    const isOwned = owned.includes(id)
    const matches = activeWardrobeFilter === 'all' || layer === activeWardrobeFilter
    const show = isOwned && matches
    button.hidden = !show
    if (show) visibleCount++
  })
  const emptyNotice = document.querySelector<HTMLElement>('#wardrobe-empty')
  if (emptyNotice) emptyNotice.hidden = visibleCount > 0
}

;['#wardrobe-panel', '#shop-panel', '#market-panel'].forEach((sel) => {
  const el = document.querySelector<HTMLElement>(sel)
  if (!el) return
  ;['pointerdown', 'mousedown', 'touchstart', 'click'].forEach((evt) => {
    el.addEventListener(evt, (e) => e.stopPropagation())
  })
})

document.querySelectorAll<HTMLButtonElement>('[data-wardrobe-filter]').forEach((tab) => {
  tab.addEventListener('click', (event) => {
    event.stopPropagation()
    document.querySelectorAll('[data-wardrobe-filter]').forEach((t) => t.classList.remove('active'))
    tab.classList.add('active')
    activeWardrobeFilter = tab.dataset.wardrobeFilter ?? 'all'
    refreshWardrobeFilter()
  })
})

document.querySelector<HTMLButtonElement>('#wardrobe-random-btn')?.addEventListener('click', () => {
  const ownedIds = playerState.data.ownedClothing
  if (!ownedIds || ownedIds.length === 0) {
    showToast('No outfits available yet! Visit the Boutique!')
    return
  }
  const ownedItems = ownedIds.map((id) => ClothingRegistry.get(id)).filter(Boolean) as ClothingDefinition[]
  const dresses = ownedItems.filter((i) => i.layer === 'dress')
  const tops = ownedItems.filter((i) => i.layer === 'top')
  const bottoms = ownedItems.filter((i) => i.layer === 'bottom')
  const hats = ownedItems.filter((i) => i.layer === 'hat')
  const shoes = ownedItems.filter((i) => i.layer === 'shoes')
  const accessories = ownedItems.filter((i) => i.layer === 'accessory')

  const toEquip: string[] = []
  const pickDress = dresses.length > 0 && (Math.random() < 0.4 || tops.length === 0 || bottoms.length === 0)
  if (pickDress) {
    toEquip.push(dresses[Math.floor(Math.random() * dresses.length)]!.id)
  } else {
    if (tops.length > 0) toEquip.push(tops[Math.floor(Math.random() * tops.length)]!.id)
    if (bottoms.length > 0) toEquip.push(bottoms[Math.floor(Math.random() * bottoms.length)]!.id)
  }
  if (shoes.length > 0) toEquip.push(shoes[Math.floor(Math.random() * shoes.length)]!.id)
  if (hats.length > 0 && Math.random() < 0.75) toEquip.push(hats[Math.floor(Math.random() * hats.length)]!.id)
  if (accessories.length > 0 && Math.random() < 0.6) toEquip.push(accessories[Math.floor(Math.random() * accessories.length)]!.id)

  for (const id of toEquip) {
    game.events.emit('ui:equip', id)
  }
  audioManager.play('wardrobe')
  showToast('🎲 Surprise look styled!')
})

document.querySelectorAll<HTMLButtonElement>('[data-place-furniture]').forEach((button) => {
  button.addEventListener('click', () => {
    game.events.emit('ui:place-furniture', button.dataset.placeFurniture)
  })
})

document.querySelectorAll<HTMLButtonElement>('[data-shop-clothing]').forEach((button) => button.addEventListener('click', () => game.events.emit('shop:preview', button.dataset.shopClothing)))
document.querySelector<HTMLButtonElement>('#shop-cancel')!.addEventListener('click', () => game.events.emit('shop:cancel'))
document.querySelector<HTMLButtonElement>('#shop-buy')!.addEventListener('click', () => game.events.emit('shop:buy'))
document.querySelectorAll<HTMLButtonElement>('[data-product]').forEach((button) => button.addEventListener('click', () => game.events.emit('market:add', button.dataset.product)))
document.querySelectorAll<HTMLButtonElement>('[data-location]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation()
    game.events.emit('ui:location', button.dataset.location as LocationId)
  })
})
document.querySelector<HTMLButtonElement>('#checkout-button')!.addEventListener('click', () => game.events.emit('market:checkout'))
document.querySelector<HTMLButtonElement>('#cart-clear-button')?.addEventListener('click', () => game.events.emit('market:clear'))
document.querySelector<HTMLButtonElement>('#cart-toggle')!.addEventListener('click', (event) => {
  const cart = document.querySelector<HTMLElement>('#cart')!
  const panel = document.querySelector<HTMLElement>('#market-panel')
  cart.hidden = !cart.hidden
  panel?.classList.toggle('cart-hidden', cart.hidden)
  ;(event.currentTarget as HTMLButtonElement).setAttribute('aria-expanded', String(!cart.hidden))
})

const openWardrobe = (): void => {
  refreshWardrobeFilter()
  wardrobePanel.hidden = false
  audioManager.play('wardrobe')
}

game.events.on('ui:context', (context: 'town' | 'home' | 'boutique' | 'supermarket' | 'venue') => {
  shell.dataset.context = context
  wardrobePanel.hidden = true
  if (context === 'town') {
    requestAnimationFrame(syncTownOverlay)
  }
})
game.events.on('ui:wardrobe-open', openWardrobe)
game.events.on('ui:wardrobe', openWardrobe)
game.events.on('ui:equip', (itemId: string) => {
  if (!playerState.ownsClothing(itemId)) return
  game.scene.getScenes(true).forEach((scene) => {
    scene.children.list.forEach((child) => {
      if (child instanceof Character) child.equip(itemId)
    })
  })
  const def = ClothingRegistry.get(itemId)
  if (def) {
    playerState.data.character.equipped[def.layer] = itemId
    playerState.save(true)
  }
})
game.events.on('ui:edit-state', (active: boolean) => { editButton.querySelector('b')!.textContent = active ? 'Done' : 'Edit'; editButton.querySelector('span')!.textContent = active ? '✓' : '✏️'; editActions.hidden = !active })
game.events.on('ui:room-state', (room: number) => document.querySelectorAll<HTMLButtonElement>('[data-room]').forEach((button) => button.classList.toggle('active', Number(button.dataset.room) === room)))
game.events.on('ui:stats', (stats: Record<string, number>) => Object.entries(stats).forEach(([key, value]) => document.querySelector<HTMLElement>(`#stat-${key}`)?.style.setProperty('--value', `${value}%`)))
game.events.on('ui:owned-clothing', () => refreshWardrobeFilter())
game.events.on('shop:state', (state: { selectedId?: string; owned: string[]; starCoins: number }) => {
  updateCoins(state.starCoins)
  const actions = document.querySelector<HTMLElement>('#shop-actions')!; actions.hidden = !state.selectedId
  const selected = state.selectedId ? CLOTHING_DEFINITIONS.find((item) => item.id === state.selectedId) : undefined
  document.querySelector<HTMLButtonElement>('#shop-buy')!.textContent = state.selectedId && state.owned.includes(state.selectedId) ? 'Wear' : selected ? `Buy • ⭐ ${selected.price}` : 'Buy'
  document.querySelector<HTMLElement>('#shop-owned-label')!.textContent = selected ? (state.owned.includes(selected.id) ? 'Owned • ready to wear' : 'Previewing') : 'Tap to preview'
  document.querySelectorAll<HTMLButtonElement>('[data-shop-clothing]').forEach((button) => { button.classList.toggle('selected', button.dataset.shopClothing === state.selectedId); button.classList.toggle('owned', state.owned.includes(button.dataset.shopClothing ?? '')) })
})
game.events.on('market:cart', (state: { lines: Array<{ itemId: string; quantity: number; total: number }>; total: number; starCoins: number }) => {
  updateCoins(state.starCoins)
  const lines = document.querySelector<HTMLElement>('#cart-lines')!
  lines.innerHTML = state.lines.length
    ? state.lines.map((line) => {
        const item = marketProducts.find((entry) => entry.id === line.itemId)!
        return `<div class="cart-line-item"><span>${item.icon} ${item.name} ×${line.quantity}</span><b>⭐ ${line.total}</b><button type="button" data-remove-product="${line.itemId}" aria-label="Remove one ${item.name}">−</button></div>`
      }).join('')
    : '<div class="cart-empty-message"><span class="cart-empty-icon">🧺</span><p>Your basket is empty!</p><small>⭐ Tap products to add them.</small></div>'
  lines.querySelectorAll<HTMLButtonElement>('[data-remove-product]').forEach((button) => button.addEventListener('click', () => game.events.emit('market:remove', button.dataset.removeProduct)))
  document.querySelector<HTMLElement>('#cart-total')!.textContent = `⭐ ${state.total}`
  const checkoutBtn = document.querySelector<HTMLButtonElement>('#checkout-button')
  if (checkoutBtn) checkoutBtn.disabled = state.lines.length === 0
  const clearBtn = document.querySelector<HTMLButtonElement>('#cart-clear-button')
  if (clearBtn) clearBtn.disabled = state.lines.length === 0
  const cartToggle = document.querySelector<HTMLButtonElement>('#cart-toggle')
  if (cartToggle) {
    const itemCount = state.lines.reduce((sum, l) => sum + l.quantity, 0)
    cartToggle.textContent = itemCount > 0 ? `🧺 Basket (${itemCount})` : '🧺 Basket'
  }
})
game.events.on('market:insufficient', () => document.querySelector<HTMLElement>('.cart-total')?.animate([{ transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }], { duration: 300 }))
window.addEventListener('player-state-changed', (event) => updateCoins((event as CustomEvent<{ starCoins: number }>).detail.starCoins))

function syncTownOverlay(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#game-container canvas')
  const stage = document.querySelector<HTMLElement>('.game-stage')
  const layer = document.querySelector<HTMLElement>('#town-location-layer')
  if (!canvas || !stage || !layer) return
  const canvasRect = canvas.getBoundingClientRect(); const stageRect = stage.getBoundingClientRect()
  Object.assign(layer.style, { left: `${canvasRect.left - stageRect.left}px`, top: `${canvasRect.top - stageRect.top}px`, width: `${canvasRect.width}px`, height: `${canvasRect.height}px` })
}
window.addEventListener('resize', syncTownOverlay)
requestAnimationFrame(syncTownOverlay)

// Audit fix #12: show the rotate hint on touch devices held in portrait.
const rotateHint = document.querySelector<HTMLElement>('.rotate-hint')
if (rotateHint) {
  const isTouch = window.matchMedia('(pointer: coarse)').matches
  const updateRotateHint = (): void => {
    rotateHint.style.display = isTouch && window.innerHeight > window.innerWidth ? 'grid' : 'none'
  }
  window.addEventListener('resize', updateRotateHint)
  window.addEventListener('orientationchange', updateRotateHint)
  updateRotateHint()
}
// BUG-15 fix: track the Phaser canvas with a ResizeObserver instead of polling
// via setTimeout, so the town overlay stays aligned even when the scale manager
// finishes laying out later than the old 400ms guess.
if (typeof ResizeObserver !== 'undefined') {
  const observeTownCanvas = (): void => {
    const canvas = document.querySelector<HTMLCanvasElement>('#game-container canvas')
    if (!canvas) { requestAnimationFrame(observeTownCanvas); return }
    new ResizeObserver(syncTownOverlay).observe(canvas)
  }
  observeTownCanvas()
}
installWorldHUD(game)
updateProfilePortrait()

if (debugMarkup) {
  const debugPanel = document.querySelector<HTMLElement>('#debug-panel')!
  document.querySelector<HTMLButtonElement>('#debug-toggle')!.addEventListener('click', () => { debugPanel.hidden = !debugPanel.hidden })
  document.querySelector<HTMLInputElement>('#anchor-toggle')!.addEventListener('change', (event) => game.events.emit('ui:debug-anchors', (event.target as HTMLInputElement).checked))
  document.querySelectorAll<HTMLButtonElement>('[data-debug]').forEach((button) => button.addEventListener('click', () => game.events.emit('debug:action', button.dataset.debug)))
  document.querySelectorAll<HTMLButtonElement>('[data-teleport]').forEach((button) => button.addEventListener('click', () => game.events.emit('debug:teleport', button.dataset.teleport)))
  game.events.on('debug:update', (data: Record<string, unknown>) => { document.querySelector<HTMLElement>('#debug-readout')!.textContent = `Scene ${data.scene ?? 'Town'} • FPS ${data.fps ?? '—'} • ⭐ ${data.currency ?? playerState.currency.getBalance()} • selected ${data.selected ?? 'none'} • state ${data.state ?? '—'} • cart ⭐ ${data.cartTotal ?? 0}` })
  game.events.on('debug:action', (action: string) => {
    if (action === 'coins-add') playerState.currency.add(100)
    if (action === 'coins-remove') playerState.currency.spend(Math.min(100, playerState.currency.getBalance()))
    if (action === 'unlock') Object.assign(playerState.data.unlockedLocations, { home: true, clothing_boutique: true, supermarket: true })
    if (action === 'food') playerState.inventory.add('apple_01', 3)
    if (action === 'clothing') playerState.addOwnedClothing('top_cloud_blue')
    if (action === 'clear-cart') game.events.emit('market:clear')
    playerState.save(true); updateCoins(playerState.currency.getBalance())
  })
  game.events.on('debug:teleport', (sceneKey: string) => { game.scene.getScenes(true).forEach((scene) => scene.scene.start(sceneKey)) })
}

registerSW({ immediate: true })

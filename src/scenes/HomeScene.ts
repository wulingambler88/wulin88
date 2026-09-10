import { treasureManager } from '../treasure/TreasureManager'
import Phaser from 'phaser'
import { Character } from '../characters/Character'
import { ClothingRegistry } from '../data/clothes'
import type { FurnitureType } from '../data/furniture'
import { audioManager } from '../audio/AudioManager'
import { Furniture } from '../furniture/Furniture'
import { FurnitureManager, type FurniturePlacement } from '../furniture/FurnitureManager'
import { InventoryManager } from '../inventory/InventoryManager'
import { InventoryPanel } from '../inventory/InventoryPanel'
import { sortByWorldY } from '../interaction/DepthManager'
import { Item } from '../items/Item'
import { ItemManager, type RoomItemPlacement } from '../items/ItemManager'
import { PetManager } from '../pets/PetManager'
import { CookingManager } from '../kitchen/CookingManager'
import { InteractiveFridge } from '../kitchen/InteractiveFridge'
import { InteractiveSink } from '../kitchen/InteractiveSink'
import { DayNightManager } from '../environment/DayNightManager'
import type { GameSave } from '../save/SaveSchema'
import { playerState } from '../state/PlayerState'
import { locationManager } from '../navigation/LocationManager'
import { setHelper, showToast } from '../ui/UIManager'
import { confirmModal } from '../ui/ConfirmModal'

const ROOM_WIDTH = 960
const WORLD_WIDTH = ROOM_WIDTH * 3
const ROOM_NAMES = ['Bedroom', 'Living Room', 'Kitchen'] as const

export class HomeScene extends Phaser.Scene {
  private save!: GameSave
  private character!: Character
  private inventory!: InventoryManager
  private inventoryPanel!: InventoryPanel
  private furnitureManager!: FurnitureManager
  private itemManager!: ItemManager
  private petManager!: PetManager
  private cookingManager!: CookingManager
  private interactiveFridge!: InteractiveFridge
  private interactiveSink!: InteractiveSink
  private dayNight!: DayNightManager
  private anchorVisuals!: Phaser.GameObjects.Graphics
  private characterHome = { x: 620, y: 430 }
  private panning = false
  private panStartX = 0
  private panStartScroll = 0
  private activeDropZone = 'none'
  private debugElapsed = 0

  constructor() { super('HomeScene') }

  create(): void {
    locationManager.resetLock()
    this.save = playerState.data
    audioManager.muted = this.save.settings.muted
    this.save.currentLocation = 'home'
    this.drawDollhouse()
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 540).setScroll(this.save.currentRoom * ROOM_WIDTH, 0)
    this.cameras.main.resetFX()
    this.cameras.main.fadeIn(200, 255, 248, 233)
    this.dayNight = new DayNightManager(this, 'day')

    this.inventory = playerState.inventory
    this.furnitureManager = new FurnitureManager(this, this.save.furniture, (placements) => this.saveFurniture(placements))
    this.character = new Character(this, this.save.character)
    this.characterHome = { x: this.character.x, y: this.character.y }
    this.petManager = new PetManager(this, this.save.pets ?? [], {
      location: 'home',
      onChange: (pets) => {
        const others = (this.save.pets ?? []).filter((p) => p.location !== 'home')
        this.save.pets = [...others, ...pets]
        this.persist()
      },
    })
    this.cookingManager = new CookingManager(this, {
      onCook: (resultItemId, spawnX, spawnY) => {
        this.itemManager.create(resultItemId, spawnX, spawnY)
        this.saveItems(this.itemManager.snapshot())
      },
      onCookFailed: (ingredientIds) => {
        for (const itemId of ingredientIds) this.inventory.add(itemId)
        this.inventoryPanel.refresh()
        this.persist()
      },
    })
    this.interactiveFridge = new InteractiveFridge(this, 2080, 322, {
      onItemRetrieved: (itemId, spawnX, spawnY) => {
        this.itemManager.create(itemId, spawnX, spawnY)
        this.saveItems(this.itemManager.snapshot())
      },
      onStateChange: () => {
        this.save.fridge = this.interactiveFridge.getStoredItems()
        this.persist()
      },
    })
    this.interactiveFridge.setStoredItems(this.save.fridge ?? this.interactiveFridge.getStoredItems())
    this.interactiveSink = new InteractiveSink(this, 2680, 295)

    this.itemManager = new ItemManager(this, this.save.roomItems, {
      inventoryDropY: () => this.inventoryPanel?.dropY(),
      onPickup: (itemId) => this.pickupItem(itemId),
      onCharacterDrop: (item) => this.handleItemOnCharacter(item),
      onChange: (items) => this.saveItems(items),
    })
    this.inventoryPanel = new InventoryPanel(this, this.inventory, (itemId, x, y) => this.spawnFromInventory(itemId, x, y))
    this.anchorVisuals = this.add.graphics().setDepth(4800)

    this.character.on('pointerdown', () => {
      if (this.character.heldItemId) {
        const dropped = this.character.dropHeldItem()
        if (dropped) {
          this.itemManager.create(dropped, this.character.x + 35, this.character.y + 25)
          this.saveItems(this.itemManager.snapshot())
          audioManager.play('drop')
          showToast('Put down held item')
          this.persist()
        }
      } else {
        this.character.react('playing', 600)
        audioManager.play('chime')
      }
    })

    this.bindCharacterDragging()
    this.bindCameraPanning()
    this.bindFurnitureActions()
    this.bindUIActions()
    treasureManager.spawnClueIfPresent(this, 'home')
    this.refreshAnchors()
    this.refreshDepth()
    this.emitContext()
    this.persist()
  }

  update(_time: number, delta: number): void {
    if (this.petManager) {
      this.petManager.updateFollow(this.character.x, this.character.y)
    }

    this.debugElapsed += delta
    if (this.debugElapsed < 400) return
    this.debugElapsed = 0
    this.game.events.emit('debug:update', {
      fps: Math.round(this.game.loop.actualFps),
      selected: this.furnitureManager.selectedId() ?? 'none',
      x: Math.round(this.character.x),
      y: Math.round(this.character.y),
      state: this.character.stateMachine.value,
      zone: this.activeDropZone,
      inventory: JSON.stringify(this.inventory.snapshot()),
      scene: 'Home',
      currency: playerState.currency.getBalance(),
      cartTotal: 0,
    })
  }

  private drawDollhouse(): void {
    for (let room = 0; room < 3; room++) {
      const x = room * ROOM_WIDTH
      this.add.image(x + 480, 175, 'world-rooms', 'wall-' + room).setDisplaySize(960, 350)
      this.add.image(x + 480, 445, 'world-rooms', 'floor-' + room).setDisplaySize(960, 190)
      const label = this.add.graphics().fillStyle(0xffffff, .94).fillRoundedRect(x + 24, 22, 186, 40, 18)
      label.lineStyle(2, 0xefc6b3).strokeRoundedRect(x + 24, 22, 186, 40, 18)
      this.add.text(x + 44, 42, ROOM_NAMES[room]!, { fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#79524f', fontStyle: 'bold' }).setOrigin(0, .5)
      const sunshine = this.add.graphics().fillStyle(0xfff6ca, .12).fillTriangle(x + 480, 140, x + 270, 510, x + 720, 510).setDepth(1)
      this.add.zone(x + 480, 180, 180, 210).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        sunshine.setVisible(!sunshine.visible); audioManager.play('switch'); showToast(sunshine.visible ? 'Let the sunshine in!' : 'A little shade')
      })
      const mirror = this.add.image(x + 867, 290, 'world-furniture', 9).setDisplaySize(90, 200)
      mirror.setInteractive({ useHandCursor: true }).on('pointerdown', () => { this.character.react('playing', 900); audioManager.play('chime'); showToast('You look lovely today!') })
      for (let i = 0; i < 3; i++) {
        const mote = this.add.circle(x + 415 + i * 49, 190 + i * 70, 2, 0xfff8c7, .65)
        if (!this.save.settings.reducedMotion) this.tweens.add({ targets: mote, y: mote.y - 40, alpha: .1, duration: 3700 + i * 630, yoyo: true, repeat: -1 })
      }
    }
    this.drawKitchenFixtures(this.add.graphics())
  }

  private drawKitchenFixtures(g: Phaser.GameObjects.Graphics): void {
    const OUTLINE = 0x663d63

    // 1. Kitchen counter contact shadow
    g.fillStyle(OUTLINE, 0.16).fillRoundedRect(2542, 308, 286, 128, 16)

    // 2. Island Cabinet Base (Warm Antique Cream Shaker)
    g.fillStyle(0xf7f2e7).fillRoundedRect(2548, 302, 272, 126, 14)
    g.lineStyle(2.5, OUTLINE).strokeRoundedRect(2548, 302, 272, 126, 14)

    // Recessed toe-kick plinth
    g.fillStyle(0xd8cbbe).fillRoundedRect(2558, 416, 252, 10, 3)
    g.lineStyle(1.5, OUTLINE, 0.6).strokeRoundedRect(2558, 416, 252, 10, 3)

    // 3. Countertop Marble Surface (Carrara Marble with bevel edge and soft veining)
    g.fillStyle(0xffffff).fillRoundedRect(2536, 285, 296, 26, 8)
    g.fillStyle(0xeae3dc).fillRect(2537, 305, 294, 6) // Edge bevel shadow
    g.lineStyle(2.5, OUTLINE).strokeRoundedRect(2536, 285, 296, 26, 8)
    // Subtle marble veining
    g.lineStyle(1.5, 0xdfd9d2, 0.55)
      .lineBetween(2560, 291, 2620, 299)
      .lineBetween(2630, 289, 2665, 301)
      .lineBetween(2730, 290, 2780, 300)

    // 4. Shaker Doors & Drawers
    // Left Unit (under stove)
    // Top drawer
    g.fillStyle(0xfffdfa).fillRoundedRect(2558, 316, 122, 32, 6)
    g.lineStyle(2, OUTLINE).strokeRoundedRect(2558, 316, 122, 32, 6)
    g.fillStyle(0xf0e9dc).fillRoundedRect(2564, 320, 110, 24, 4) // Inset bevel
    g.lineStyle(1.2, OUTLINE, 0.45).strokeRoundedRect(2564, 320, 110, 24, 4)
    // Antique brass cup pull
    g.fillStyle(0xd4a359).fillRoundedRect(2608, 325, 22, 11, 4)
    g.fillStyle(0xffe89e).fillRect(2611, 326, 16, 3)
    g.lineStyle(1.5, OUTLINE).strokeRoundedRect(2608, 325, 22, 11, 4)

    // Bottom cupboard
    g.fillStyle(0xfffdfa).fillRoundedRect(2558, 354, 122, 64, 6)
    g.lineStyle(2, OUTLINE).strokeRoundedRect(2558, 354, 122, 64, 6)
    g.fillStyle(0xf0e9dc).fillRoundedRect(2564, 360, 110, 52, 4)
    g.lineStyle(1.2, OUTLINE, 0.45).strokeRoundedRect(2564, 360, 110, 52, 4)
    // Antique brass handle
    g.fillStyle(0xd4a359).fillRoundedRect(2665, 376, 6, 16, 3)
    g.lineStyle(1.5, OUTLINE).strokeRoundedRect(2665, 376, 6, 16, 3)

    // Right Unit (under sink)
    // Top drawer / apron
    g.fillStyle(0xfffdfa).fillRoundedRect(2688, 316, 122, 32, 6)
    g.lineStyle(2, OUTLINE).strokeRoundedRect(2688, 316, 122, 32, 6)
    g.fillStyle(0xf0e9dc).fillRoundedRect(2694, 320, 110, 24, 4)
    g.lineStyle(1.2, OUTLINE, 0.45).strokeRoundedRect(2694, 320, 110, 24, 4)
    // Antique brass cup pull
    g.fillStyle(0xd4a359).fillRoundedRect(2738, 325, 22, 11, 4)
    g.fillStyle(0xffe89e).fillRect(2741, 326, 16, 3)
    g.lineStyle(1.5, OUTLINE).strokeRoundedRect(2738, 325, 22, 11, 4)

    // Bottom cupboard
    g.fillStyle(0xfffdfa).fillRoundedRect(2688, 354, 122, 64, 6)
    g.lineStyle(2, OUTLINE).strokeRoundedRect(2688, 354, 122, 64, 6)
    g.fillStyle(0xf0e9dc).fillRoundedRect(2694, 360, 110, 52, 4)
    g.lineStyle(1.2, OUTLINE, 0.45).strokeRoundedRect(2694, 360, 110, 52, 4)
    // Antique brass handle
    g.fillStyle(0xd4a359).fillRoundedRect(2697, 376, 6, 16, 3)
    g.lineStyle(1.5, OUTLINE).strokeRoundedRect(2697, 376, 6, 16, 3)

    // 5. Hanging pink gingham tea towel on side rail
    // Brass rail
    g.fillStyle(0xd4a359).fillRoundedRect(2538, 324, 6, 32, 3)
    g.lineStyle(1.5, OUTLINE).strokeRoundedRect(2538, 324, 6, 32, 3)
    // Folded towel body
    g.fillStyle(0xffffff).fillRoundedRect(2534, 328, 14, 42, 3)
    // Gingham checks
    g.fillStyle(0xffb3c6).fillRect(2534, 332, 7, 7).fillRect(2541, 339, 7, 7).fillRect(2534, 346, 7, 7).fillRect(2541, 353, 7, 7).fillRect(2534, 360, 7, 7)
    g.lineStyle(1.5, OUTLINE).strokeRoundedRect(2534, 328, 14, 42, 3)
    // Bottom fringe
    g.fillStyle(0xd4a359).fillRect(2534, 368, 14, 2)
  }

  private bindCharacterDragging(): void {
    this.input.on(Phaser.Input.Events.DRAG_START, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (object !== this.character || this.character.stateMachine.isBusy) return
      this.characterHome = { x: this.character.x, y: this.character.y }
      this.character.changeState('dragging')
      this.character.setScale(1.07).setDepth(4500)
      this.showAnchors(true)
      audioManager.play('pickup')
    })
    this.input.on(Phaser.Input.Events.DRAG, (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, x: number, y: number) => {
      if (object !== this.character || this.character.stateMachine.value !== 'dragging') return
      if (pointer.x > 860) this.cameras.main.scrollX = Math.min(WORLD_WIDTH - 960, this.cameras.main.scrollX + 18)
      else if (pointer.x < 100) this.cameras.main.scrollX = Math.max(0, this.cameras.main.scrollX - 18)
      this.character.setPosition(Phaser.Math.Clamp(x, 60, WORLD_WIDTH - 60), Phaser.Math.Clamp(y, 130, 495))
      this.activeDropZone = this.nearestAnchor()?.id ?? (this.character.y >= 320 ? 'floor' : 'none')
    })
    this.input.on(Phaser.Input.Events.DRAG_END, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (object !== this.character || this.character.stateMachine.value !== 'dragging') return
      this.character.setScale(1)
      this.character.playDropSettle()
      const anchor = this.nearestAnchor()
      if (anchor) {
        if (!this.character.setDurableState(anchor.state)) { showToast('Qian Hui is busy right now!') }
        else {
          this.character.setPosition(anchor.x, anchor.y)
          if (anchor.state === 'sleeping') { this.character.updateStat('energy', 10); audioManager.play('sleep'); showToast('Sweet dreams! + energy') }
          else showToast('Comfy seat!')
        }
      } else if (this.character.y >= 320) {
        this.character.y = Phaser.Math.Clamp(this.character.y, 390, 470)
        this.character.setDurableState('standing')
        showToast('Ready to play!')
      } else {
        if (this.character.setDurableState('standing')) {
          this.character.setPosition(this.characterHome.x, this.characterHome.y)
          showToast('Try the floor or a glowing spot')
        } else {
          showToast('Qian Hui is busy right now!')
        }
      }
      this.activeDropZone = 'none'
      this.showAnchors(this.save.settings.showAnchors)
      this.refreshDepth()
      audioManager.play('drop')
      this.persist()
    })
  }

  private bindCameraPanning(): void {
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
      if (currentlyOver.length > 0 || this.inventoryPanel.isOpen()) return
      this.panning = true
      this.panStartX = pointer.x
      this.panStartScroll = this.cameras.main.scrollX
    })
    this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
      if (!this.panning || !pointer.isDown) return
      this.cameras.main.scrollX = Phaser.Math.Clamp(this.panStartScroll - (pointer.x - this.panStartX), 0, WORLD_WIDTH - 960)
    })
    this.input.on(Phaser.Input.Events.POINTER_UP, () => { this.panning = false })
  }

  private bindFurnitureActions(): void {
    this.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (this.furnitureManager.isEditing()) return

      if (object instanceof Furniture) {
        if (object.definition.type === 'wardrobe') {
          this.game.events.emit('ui:wardrobe-open')
          audioManager.play('wardrobe')
          return
        }

        object.interact()
        if (object.definition.type === 'lamp') {
          audioManager.play('switch')
          showToast(object.isOn ? 'Lamp On 💡' : 'Lamp Off')
          this.persist()
        } else if (object.definition.type === 'tv') {
          const channels = ['TV Off', 'Watching Kitty Cartoon 🐱', 'Watching Rainbow Sun 🌈', 'Watching Cosmic Rocket 🚀']
          audioManager.play(object.isOn ? 'tvJingle' : 'switch')
          showToast(channels[object.channelIndex] ?? 'TV')
          if (object.isOn && this.character.x >= 960 && this.character.x < 1920) {
            this.character.react('playing', 900)
          }
          this.persist()
        } else if (object.definition.type === 'plant') {
          audioManager.play('rustle')
          showToast('Happy leafy plant! 🌿')
        } else if (object.definition.type === 'bed') {
          audioManager.play('rustle')
          showToast('Fluffy cozy bed! ☁️')
        } else if (object.definition.type === 'bookshelf') {
          audioManager.play('pickup')
          this.character.react('playing', 900)
          this.itemManager.create('book_01', object.x + (Math.random() - 0.5) * 30, object.y + 40)
          this.saveItems(this.itemManager.snapshot())
          showToast('Found an enchanting storybook! 📘✨')
          this.persist()
        }
      }
    })
  }

  private bindUIActions(): void {
    const map = (): void => { this.persist(); locationManager.navigate(this, 'town', this.save.unlockedLocations) }
    const inventory = (): void => { this.inventoryPanel.toggle(); audioManager.play('inventoryOpen') }
    const wardrobe = (): void => { this.game.events.emit('ui:wardrobe-open'); audioManager.play('wardrobe') }
    const edit = (): void => {
      const active = !this.furnitureManager.isEditing()
      this.furnitureManager.setEditMode(active)
      this.input.setDraggable(this.character, !active)
      this.itemManager.setDraggable(!active)
      this.game.events.emit('ui:edit-state', active)
      setHelper(active ? 'Move furniture, then tap Done' : 'Drag Qian Hui or open your inventory')
    }
    const undo = (): void => { this.furnitureManager.undo(); this.refreshAnchors() }
    const redo = (): void => { this.furnitureManager.redo(); this.refreshAnchors() }
    const remove = (): void => { const type = this.furnitureManager.removeSelected(); if (!type) return; this.inventory.add(`furniture_${type}`); this.inventoryPanel.refresh(); this.persist() }
    const room = (roomIndex: number): void => this.goToRoom(roomIndex)
    const equip = (itemId: string): void => { if (!playerState.ownsClothing(itemId) || !this.character.equip(itemId)) return; showToast('Outfit changed!'); this.persist() }
    const anchors = (visible: boolean): void => { this.save.settings.showAnchors = visible; this.showAnchors(visible); this.persist() }
    const mute = (muted: boolean): void => { this.save.settings.muted = muted; audioManager.muted = muted; this.persist() }
    const reset = (): void => {
      confirmModal.ask({
        title: 'Start over?',
        message: 'Reset the home and all saved progress? This cannot be undone.',
        confirmLabel: 'Reset',
        onConfirm: () => {
          playerState.reset()
          this.save = playerState.data
          this.scene.restart()
        },
      })
    }
    const timeCycle = (): void => { this.dayNight.cycle() }
    const petWhistle = (): void => { this.petManager.toggleFollow({ x: this.character.x, y: this.character.y }) }
    const customized = (custom: import('../save/SaveSchema').AvatarCustomization): void => {
      this.character.setCustomization(custom)
      this.persist()
    }
    const placeFurniture = (type: import('../data/furniture').FurnitureType): void => {
      if (!this.furnitureManager.isEditing()) return
      const camera = this.cameras.main
      const placeX = Phaser.Math.Clamp(camera.scrollX + 480, 80, 2800)
      const placeY = 380
      const item = this.furnitureManager.add(type, placeX, placeY)
      if (item) {
        audioManager.play('pop')
        showToast(`Placed ${item.definition.name}! Drag to arrange.`)
        this.refreshAnchors()
        this.persist()
        this.game.events.emit('world:decorated')
      }
    }
    const petReaction = (): void => {
      this.character.updateStat('happiness', 15)
      this.character.updateStat('fun', 10)
      this.character.playPetReaction()
      this.persist()
    }
    this.game.events.on('ui:map', map).on('ui:inventory', inventory).on('ui:wardrobe', wardrobe).on('ui:edit', edit)
      .on('ui:undo', undo).on('ui:redo', redo).on('ui:remove-furniture', remove).on('ui:room', room)
      .on('ui:equip', equip).on('ui:debug-anchors', anchors).on('ui:mute', mute).on('ui:reset', reset)
      .on('ui:time-cycle', timeCycle).on('ui:pet-whistle', petWhistle).on('character:customized', customized)
      .on('ui:place-furniture', placeFurniture).on('character:pet-reacted', petReaction)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('ui:map', map).off('ui:inventory', inventory).off('ui:wardrobe', wardrobe).off('ui:edit', edit)
        .off('ui:undo', undo).off('ui:redo', redo).off('ui:remove-furniture', remove).off('ui:room', room)
        .off('ui:equip', equip).off('ui:debug-anchors', anchors).off('ui:mute', mute).off('ui:reset', reset)
        .off('ui:time-cycle', timeCycle).off('ui:pet-whistle', petWhistle).off('character:customized', customized)
        .off('ui:place-furniture', placeFurniture).off('character:pet-reacted', petReaction)
    })
  }

  private pickupItem(itemId: string): void {
    this.inventory.add(itemId)
    this.inventoryPanel.refresh()
    audioManager.play('pickup')
    showToast('Added to your bag!')
    this.persist()
  }

  private spawnFromInventory(itemId: string, x: number, y: number): boolean {
    if (ClothingRegistry.has(itemId)) {
      if (!this.character.equip(itemId)) return false
      showToast('Outfit changed!')
      this.persist()
      return true
    }
    if (itemId.startsWith('furniture_')) {
      if (!this.furnitureManager.isEditing()) { showToast('Turn on Edit Mode first'); return false }
      const type = itemId.replace('furniture_', '') as FurnitureType
      const created = this.furnitureManager.add(type, x, Phaser.Math.Clamp(y, 250, 470))
      if (!created) return false
      this.inventory.remove(itemId)
      this.refreshAnchors()
      this.persist()
      return true
    }
    const item = this.itemManager.create(itemId, x, Phaser.Math.Clamp(y, 250, 480))
    if (!item) return false
    this.inventory.remove(itemId)
    if (!this.handleItemOnCharacter(item)) {
      this.saveItems(this.itemManager.snapshot())
      audioManager.play('drop')
    }
    return true
  }

  private handleItemOnCharacter(item: Item): boolean {
    if (this.cookingManager && this.cookingManager.handleItemDrop(item.definition.id, item.x, item.y)) {
      this.tweens.add({ targets: item, scale: 0, alpha: 0, duration: 250, onComplete: () => this.itemManager.remove(item) })
      return true
    }

    if (this.interactiveFridge && this.interactiveFridge.isAcceptingDrops(item.x, item.y)) {
      if (this.interactiveFridge.storeItem(item.definition.id)) {
        this.itemManager.remove(item)
        this.saveItems(this.itemManager.snapshot())
        return true
      }
    }

    if (this.interactiveSink && this.interactiveSink.isOverSink(item.x, item.y)) {
      this.interactiveSink.washItem(item.definition.name)
      item.x = 2745
      item.y = 318
      item.lastValid = { x: 2745, y: 318 }
      this.saveItems(this.itemManager.snapshot())
      return true
    }

    if (this.petManager && (item.definition.category === 'food' || item.definition.id.startsWith('pet_') || item.definition.tags?.includes('pet'))) {
      const hunger = Number(item.definition.metadata.hunger ?? 20)
      if (this.petManager.handleItemOnPet(item.x, item.y, hunger)) {
        this.tweens.add({ targets: item, scale: 0, alpha: 0, duration: 300, onComplete: () => this.itemManager.remove(item) })
        return true
      }
    }

    // Surface snapping: Dining table in kitchen
    if (item.x >= 2280 && item.x <= 2520 && item.y >= 280 && item.y <= 440) {
      item.y = 335
      item.lastValid = { x: item.x, y: 335 }
      audioManager.play('drop')
      showToast(`Placed ${item.definition.name} on dining table`)
      this.saveItems(this.itemManager.snapshot())
      return true
    }

    // Surface snapping: Coffee table in living room
    if (item.x >= 1450 && item.x <= 1620 && item.y >= 280 && item.y <= 420) {
      item.y = 350
      item.lastValid = { x: item.x, y: 350 }
      audioManager.play('drop')
      showToast(`Placed ${item.definition.name} on coffee table`)
      this.saveItems(this.itemManager.snapshot())
      return true
    }

    if (Phaser.Math.Distance.Between(item.x, item.y, this.character.x, this.character.y) > 95) return false

    if (item.definition.category === 'food') {
      const hunger = Number(item.definition.metadata.hunger ?? 15)
      this.character.eatFood(item.definition.id, () => this.persist())
      this.character.updateStat('hunger', hunger)
      this.happyEffect()
      audioManager.play('chew')
      audioManager.play('eat')
      showToast(`Yummy! +${hunger} hunger 😋`)
      this.itemManager.remove(item)
      this.saveItems(this.itemManager.snapshot())
      this.persist()
      return true
    }

    // Toys and other props: Qian Hui can hold them in her hands!
    if (this.character.heldItemId) {
      const prevId = this.character.dropHeldItem()
      if (prevId) {
        this.itemManager.create(prevId, this.character.x + 35, this.character.y + 20)
      }
    }
    this.character.holdItem(item.definition.id)
    if (item.definition.category === 'toys') {
      const fun = Number(item.definition.metadata.fun ?? 15)
      this.character.updateStat('fun', fun)
      this.character.react('playing', 900)
      audioManager.play('bounce')
      showToast(`Playing with ${item.definition.name}! 🧸 +${fun} fun`)
    } else {
      audioManager.play('pop')
      showToast(`Holding ${item.definition.name}! ✨`)
    }
    this.happyEffect()
    this.itemManager.remove(item)
    this.saveItems(this.itemManager.snapshot())
    this.persist()
    return true
  }

  private happyEffect(): void {
    for (let index = 0; index < 5; index += 1) {
      const star = this.add.text(this.character.x, this.character.y - 80, index % 2 ? '♥' : '★', { fontSize: '24px', color: index % 2 ? '#ff7eae' : '#ffd85e' }).setDepth(4900)
      this.tweens.add({ targets: star, x: star.x + (index - 2) * 25, y: star.y - 70 - index * 5, alpha: 0, duration: 900, onComplete: () => star.destroy() })
    }
  }

  private nearestAnchor(): { id: string; x: number; y: number; state: 'sitting' | 'sleeping' } | undefined {
    return this.furnitureManager.anchors().map((anchor) => ({ ...anchor, distance: Phaser.Math.Distance.Between(this.character.x, this.character.y, anchor.x, anchor.y) }))
      .filter((anchor) => anchor.distance <= 105).sort((a, b) => a.distance - b.distance)[0]
  }

  private refreshAnchors(): void {
    this.anchorVisuals?.clear()
    if (!this.anchorVisuals) return
    this.anchorVisuals.fillStyle(0xffe47a, .32).lineStyle(4, 0xffffff, .9)
    for (const anchor of this.furnitureManager.anchors()) this.anchorVisuals.fillCircle(anchor.x, anchor.y, 30).strokeCircle(anchor.x, anchor.y, 30)
    this.showAnchors(this.save.settings.showAnchors)
  }

  private showAnchors(visible: boolean): void { this.anchorVisuals?.setVisible(visible) }

  private refreshDepth(): void {
    const furniture = this.furnitureManager.all().filter((item) => item.definition.type !== 'rug')
    const rugs = this.furnitureManager.all().filter((item) => item.definition.type === 'rug')
    const pets = this.petManager ? this.petManager.all() : []
    sortByWorldY([...furniture, ...this.itemManager.all(), ...pets, this.character])
    rugs.forEach((rug) => rug.setDepth(40))
    if (this.character.stateMachine.value === 'sleeping') this.character.setDepth(700)
  }

  private goToRoom(roomIndex: number): void {
    const room = Phaser.Math.Clamp(Math.round(roomIndex), 0, 2) as 0 | 1 | 2
    const localCharacterX = Phaser.Math.Clamp(this.character.x % ROOM_WIDTH, 80, ROOM_WIDTH - 80)
    this.save.currentRoom = room
    this.character.setPosition(room * ROOM_WIDTH + localCharacterX, this.character.y)
    this.characterHome = { x: this.character.x, y: this.character.y }
    this.tweens.add({ targets: this.cameras.main, scrollX: room * ROOM_WIDTH, duration: 420, ease: 'Cubic.InOut' })
    setHelper(`${ROOM_NAMES[room]} • drag empty space to look around`)
    this.game.events.emit('ui:room-state', room)
    this.refreshDepth()
    this.persist()
  }

  private emitContext(): void {
    this.game.events.emit('ui:context', 'home')
    this.game.events.emit('ui:room-state', this.save.currentRoom)
    this.game.events.emit('ui:edit-state', false)
    this.game.events.emit('ui:stats', { ...this.character.stats })
    this.game.events.emit('ui:owned-clothing', [...this.save.ownedClothing])
    setHelper('Drag Qian Hui, open the wardrobe, or explore your rooms')
  }

  private saveFurniture(placements: FurniturePlacement[]): void { this.save.furniture = placements; this.refreshAnchors(); this.persist(); this.game.events.emit('world:decorated') }
  private saveItems(items: RoomItemPlacement[]): void { this.save.roomItems = items; this.persist() }

  private persist(): void {
    if (!this.save || !this.character || !this.inventory) return
    this.save.character = this.character.toSave()
    this.save.inventory = this.inventory.snapshot()
    if (this.interactiveFridge) this.save.fridge = this.interactiveFridge.getStoredItems()
    if (this.itemManager) this.save.roomItems = this.itemManager.snapshot()
    if (this.furnitureManager) this.save.furniture = this.furnitureManager.snapshot()
    // BUG-20 fix: `this.save` is the same object reference as `playerState.data`
    // (assigned in create()), so re-assigning it here was a no-op.
    playerState.save()
    this.game.events.emit('ui:stats', { ...this.character.stats })
  }
}

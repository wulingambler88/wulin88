import { treasureManager } from '../treasure/TreasureManager'
import Phaser from 'phaser'
import { Character } from '../characters/Character'
import { NPCBase } from '../characters/NPCBase'
import { PET_DEFINITIONS, type PetDefinition } from '../data/pets'
import { audioManager } from '../audio/AudioManager'
import { locationManager } from '../navigation/LocationManager'
import { playerState } from '../state/PlayerState'
import { setHelper, showToast } from '../ui/UIManager'
import { confirmModal } from '../ui/ConfirmModal'

const OUTLINE = 0x663d63
const OUTLINE_LIGHT = 0x78504b

export class PetShopScene extends Phaser.Scene {
  private character!: Character
  private daisyNPC!: NPCBase
  private debugElapsed = 0

  constructor() { super('PetShopScene') }

  create(): void {
    locationManager.resetLock()
    playerState.setLocation('pet_shop')
    this.drawPetShop()
    this.drawShopkeeper()
    this.drawPetPens()

    this.character = new Character(this, { ...playerState.data.character, x: 500, y: 420, state: 'standing' })
    this.input.setDraggable(this.character, false)
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (!over.length && pointer.y > 370) {
        this.character.walkTo(Phaser.Math.Clamp(pointer.x, 80, 680), Phaser.Math.Clamp(pointer.y, 400, 450))
      }
    })

    treasureManager.spawnClueIfPresent(this, 'pet_shop')
    this.bindActions()
    this.game.events.emit('ui:context', 'venue')
    this.game.events.emit('ui:stats', { ...this.character.stats })
    setHelper('Tap any cute pet in their cozy bed to adopt them into your Home!')
    this.cameras.main.fadeIn(320, 255, 248, 233)
  }

  update(_time: number, delta: number): void {
    this.debugElapsed += delta
    if (this.debugElapsed < 400) return
    this.debugElapsed = 0
    this.game.events.emit('debug:update', {
      fps: Math.round(this.game.loop.actualFps),
      selected: 'none',
      x: Math.round(this.character.x),
      y: Math.round(this.character.y),
      state: this.character.stateMachine.value,
      zone: 'pet_shop',
      inventory: JSON.stringify(playerState.inventory.snapshot()),
      scene: 'PetShop',
      currency: playerState.currency.getBalance(),
      cartTotal: 0,
    })
  }

  private drawPetShop(): void {
    const g = this.add.graphics()
    this.add.image(610, 385, 'world-furniture', 7).setDisplaySize(120, 190)

    // 1. Warm Peach & Pastel Wallpaper
    g.fillStyle(0xfff3ea).fillRect(0, 0, 960, 370)
    // Wood wainscoting
    g.fillStyle(0xecd5bd).fillRect(0, 310, 960, 60)
    g.lineStyle(2, OUTLINE_LIGHT, 0.4).lineBetween(0, 310, 960, 310)

    // Paw-print wall wallpaper accents
    g.fillStyle(0xffb8d9, 0.35)
    for (let x = 60; x < 940; x += 90) {
      for (let y = 60; y < 290; y += 75) {
        g.fillCircle(x, y, 4).fillCircle(x - 5, y - 5, 2).fillCircle(x, y - 7, 2).fillCircle(x + 5, y - 5, 2)
      }
    }

    // Hardwood Flooring with planks
    g.fillStyle(0xdfbd98).fillRect(0, 370, 960, 170)
    g.lineStyle(1.5, 0xc49b74, 0.6)
    for (let y = 370; y < 540; y += 34) {
      g.lineBetween(0, y, 960, y)
    }

    // 2. Sunny Bay Window
    const wx = 75
    const wy = 65
    g.fillStyle(0xffffff).fillRoundedRect(wx, wy, 150, 120, 16)
    g.lineStyle(2.5, OUTLINE).strokeRoundedRect(wx, wy, 150, 120, 16)
    g.fillStyle(0xbee8f5).fillRoundedRect(wx + 8, wy + 8, 134, 104, 10)
    // Warm sunbeams
    g.fillStyle(0xfff5c0, 0.25).fillTriangle(wx + 75, wy + 20, wx - 40, wy + 260, wx + 200, wy + 260)
    // Window planter with flowers
    g.fillStyle(0x8a5832).fillRoundedRect(wx + 5, wy + 115, 140, 18, 5).lineStyle(2, OUTLINE).strokeRoundedRect(wx + 5, wy + 115, 140, 18, 5)
    for (let i = 0; i < 5; i++) {
      g.fillStyle(0xff8fc4).fillCircle(wx + 20 + i * 26, wy + 110, 7)
      g.fillStyle(0xffd700).fillCircle(wx + 20 + i * 26, wy + 110, 2.5)
    }

    // 3. Adoption Reception Counter
    g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(715, 325, 230, 140, 16)
    g.fillStyle(0xffcaa7).fillRoundedRect(720, 320, 220, 135, 16).lineStyle(2.5, OUTLINE).strokeRoundedRect(720, 320, 220, 135, 16)
    g.fillStyle(0xffffff).fillRoundedRect(708, 308, 244, 26, 10).lineStyle(2.5, OUTLINE).strokeRoundedRect(708, 308, 244, 26, 10)

    // Treat jars on counter
    g.fillStyle(0xcae9ff, 0.8).fillRoundedRect(865, 275, 28, 34, 5).lineStyle(2, OUTLINE).strokeRoundedRect(865, 275, 28, 34, 5)
    g.fillStyle(0xffd700).fillCircle(879, 292, 6) // Treats inside

    // 4. Shop Title Banner
    const banner = this.add.graphics()
    banner.fillStyle(0xffffff, 0.94).fillRoundedRect(280, 18, 400, 52, 16)
    banner.lineStyle(2, 0xf2c4ce).strokeRoundedRect(280, 18, 400, 52, 16)
    this.add.text(480, 32, '🐾 Pawprints Pet Boutique', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#6e4458',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    this.add.text(480, 54, 'Loving rescues ready for adoption & cuddles', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#8b687f',
    }).setOrigin(0.5)
  }

  private drawShopkeeper(): void {
    // Daisy NPC - Pet Caregiver
    this.daisyNPC = new NPCBase(this, 760, 310, {
      id: 'daisy',
      name: 'Daisy',
      role: 'Pet Caregiver',
      spriteKey: 'resident-petshop',
      skinColor: 0xffdfc5,
      hairStyle: 'twin_buns',
      hairColor: 0xb5805c,
      eyeColor: 0x483245,
      outfitColor: 0xff9bb5,
      apronColor: 0xfff0f5,
      accessory: 'ears',
      icon: '🐾',
      dialogues: [
        'Welcome to Pawprints! All our rescues are so friendly!',
        'Adopted pets will follow you and live happily in your Home!',
        'Remember to feed them treats and pet them often! ♥',
        'Buttercup the puppy loves playing fetch in the park!',
      ],
    })
    this.daisyNPC.setScale(0.85).setDepth(200)
  }

  private drawPetPens(): void {
    PET_DEFINITIONS.forEach((pet, index) => {
      // Arrangement in a welcoming semi-circle / row across the shop floor
      const col = index % 3
      const row = Math.floor(index / 3)
      const px = 140 + col * 185
      const py = 230 + row * 155

      const penContainer = this.add.container(px, py)
      const g = this.add.graphics()

      // Wicker / Plush Bed
      g.fillStyle(OUTLINE_LIGHT, 0.16).fillEllipse(0, 30, 130, 28)
      g.fillStyle(0xffe3d1).fillEllipse(0, 18, 126, 38).lineStyle(2.5, OUTLINE).strokeEllipse(0, 18, 126, 38)
      g.fillStyle(pet.color, 0.4).fillEllipse(0, 18, 108, 28)

      // Illustrated Pet Graphics inside Pen
      const petG = this.add.graphics()
      this.drawPetInPen(petG, pet)

      // Name & Personality Badge
      const badgeG = this.add.graphics()
      badgeG.fillStyle(0xffffff, 0.94).fillRoundedRect(-58, 38, 116, 36, 8)
      badgeG.lineStyle(1.5, 0xf2c4ce).strokeRoundedRect(-58, 38, 116, 36, 8)

      const nameText = this.add.text(0, 46, pet.name, {
        fontFamily: 'Trebuchet MS',
        fontSize: '12px',
        color: '#6e4458',
        fontStyle: 'bold',
      }).setOrigin(0.5)

      const alreadyAdopted = playerState.data.pets.some((p) => p.petId === pet.id)
      const priceText = this.add.text(0, 62, alreadyAdopted ? 'ADOPTED ✓' : `⭐ ${pet.price}`, {
        fontFamily: 'Trebuchet MS',
        fontSize: '10px',
        color: alreadyAdopted ? '#2a9d8f' : '#754c72',
        fontStyle: 'bold',
      }).setOrigin(0.5)

      penContainer.add([g, petG, badgeG, nameText, priceText])
      penContainer.setSize(126, 95).setInteractive({ useHandCursor: true })

      penContainer.on('pointerdown', () => this.handlePetTap(pet, priceText, penContainer))
      penContainer.on('pointerover', () => this.tweens.add({ targets: penContainer, scale: 1.08, duration: 100 }))
      penContainer.on('pointerout', () => this.tweens.add({ targets: penContainer, scale: 1, duration: 100 }))
    })
  }

  private drawPetInPen(g: Phaser.GameObjects.Graphics, pet: PetDefinition): void {
    const baseColor = pet.color
    const accent = pet.accent

    if (pet.species === 'bunny') {
      g.fillStyle(baseColor).fillRoundedRect(-14, -36, 10, 24, 4).fillRoundedRect(4, -36, 10, 24, 4)
      g.lineStyle(2, OUTLINE).strokeRoundedRect(-14, -36, 10, 24, 4).strokeRoundedRect(4, -36, 10, 24, 4)
      g.fillStyle(0xffa8d3).fillRoundedRect(-11, -33, 4, 18, 2).fillRoundedRect(7, -33, 4, 18, 2)
      g.fillStyle(baseColor).fillCircle(0, 4, 22).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 22)
      g.fillStyle(0x3a2312).fillCircle(-7, 0, 3).fillCircle(7, 0, 3)
      g.fillStyle(0xffffff).fillCircle(-8, -1.5, 1).fillCircle(6, -1.5, 1)
      g.fillStyle(0xff7ab8).fillTriangle(-3, 5, 3, 5, 0, 8)
    } else if (pet.species === 'kitten') {
      g.fillStyle(baseColor).fillTriangle(-18, -6, -10, -28, -2, -6).fillTriangle(2, -6, 10, -28, 18, -6)
      g.lineStyle(2, OUTLINE).strokeTriangle(-18, -6, -10, -28, -2, -6).strokeTriangle(2, -6, 10, -28, 18, -6)
      g.fillStyle(0xffa8d3).fillTriangle(-15, -7, -10, -22, -4, -7).fillTriangle(4, -7, 10, -22, 15, -7)
      g.fillStyle(baseColor).fillCircle(0, 4, 22).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 22)
      g.fillStyle(0x3a2312).fillCircle(-7, 1, 3).fillCircle(7, 1, 3)
      g.fillStyle(0xffffff).fillCircle(-8, -0.5, 1).fillCircle(6, -0.5, 1)
      g.fillStyle(0xff7ab8).fillCircle(0, 5, 2)
    } else if (pet.species === 'panda') {
      g.fillStyle(0x2b2d42).fillCircle(-16, -16, 8).fillCircle(16, -16, 8)
      g.lineStyle(2, OUTLINE).strokeCircle(-16, -16, 8).strokeCircle(16, -16, 8)
      g.fillStyle(0xffffff).fillCircle(0, 4, 23).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 23)
      g.fillStyle(0x2b2d42).fillEllipse(-8, 2, 6, 9).fillEllipse(8, 2, 6, 9)
      g.fillStyle(0xffffff).fillCircle(-8, 1, 2.5).fillCircle(8, 1, 2.5)
      g.fillStyle(0x2b2d42).fillCircle(0, 8, 2)
    } else if (pet.species === 'hamster') {
      g.fillStyle(accent).fillCircle(-14, -14, 6).fillCircle(14, -14, 6)
      g.fillStyle(baseColor).fillCircle(0, 4, 22).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 22)
      g.fillStyle(0xffecd9).fillCircle(-11, 8, 8).fillCircle(11, 8, 8)
      g.fillStyle(0x3a2312).fillCircle(-6, 0, 2.5).fillCircle(6, 0, 2.5)
      g.fillStyle(0xff7ab8).fillCircle(0, 4, 2)
    } else {
      // Puppy
      g.fillStyle(accent).fillEllipse(-18, -4, 9, 16).fillEllipse(18, -4, 9, 16)
      g.lineStyle(2, OUTLINE).strokeEllipse(-18, -4, 9, 16).strokeEllipse(18, -4, 9, 16)
      g.fillStyle(baseColor).fillCircle(0, 4, 22).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 22)
      g.fillStyle(0xffeed9).fillEllipse(0, 8, 14, 10)
      g.fillStyle(0x3a2312).fillCircle(0, 4, 3)
      g.fillStyle(0x3a2312).fillCircle(-8, -1, 3.5).fillCircle(8, -1, 3.5)
      g.fillStyle(0xffffff).fillCircle(-9, -2, 1.2).fillCircle(7, -2, 1.2)
    }

    g.fillStyle(0xff8fc4, 0.6).fillEllipse(-12, 8, 6, 3.5).fillEllipse(12, 8, 6, 3.5)
  }

  private handlePetTap(pet: PetDefinition, priceLabel: Phaser.GameObjects.Text, container: Phaser.GameObjects.Container): void {
    const alreadyAdopted = playerState.data.pets.some((p) => p.petId === pet.id)
    if (alreadyAdopted) {
      showToast(`${pet.name} is waiting for you in your Home! ♥`)
      audioManager.play('button')
      this.character?.updateStat('happiness', 10)
      this.character?.updateStat('fun', 5)
      playerState.data.character = this.character.toSave()
      playerState.save(true)
      this.tweens.add({ targets: container, y: container.y - 12, duration: 120, yoyo: true })
      return
    }

    confirmModal.ask({
      title: `Adopt ${pet.name}?`,
      message: `${pet.name} costs ${pet.price} Star Coins and will move into your Home.`,
      confirmLabel: `Adopt · ${pet.price} ⭐`,
      cancelLabel: 'Not yet',
      onConfirm: () => this.adoptPet(pet, priceLabel, container),
    })
  }

  private adoptPet(pet: PetDefinition, priceLabel: Phaser.GameObjects.Text, container: Phaser.GameObjects.Container): void {
    if (playerState.data.pets.some((p) => p.petId === pet.id)) return
    if (!playerState.currency.spend(pet.price)) {
      showToast(`Need more ⭐ to adopt ${pet.name}`)
      audioManager.play('button')
      return
    }
    playerState.data.pets.push({
      instanceId: `pet_${pet.id}_${Date.now()}`,
      petId: pet.id,
      name: pet.name,
      location: 'home',
      x: 420 + playerState.data.pets.length * 60,
      y: 430,
      hunger: 85,
      happiness: 95,
    })
    playerState.data.progress.firstPetAdopted = true
    this.character?.updateStat('happiness', 25)
    this.character?.updateStat('fun', 20)
    playerState.data.character = this.character.toSave()
    playerState.save(true)

    priceLabel.setText('ADOPTED ✓').setColor('#2a9d8f')
    audioManager.play('purchase')
    showToast(`Adopted ${pet.name}! They moved into your Home! +Happiness!`)

    // Celebration hearts
    for (let i = 0; i < 7; i++) {
      const heart = this.add.text(container.x + (i - 3) * 20, container.y - 20, '♥', {
        fontSize: '26px',
        color: i % 2 ? '#ff7fac' : '#ffd96f',
      }).setDepth(5000)
      this.tweens.add({
        targets: heart,
        y: heart.y - 70,
        alpha: 0,
        scale: 1.4,
        duration: 900,
        onComplete: () => heart.destroy(),
      })
    }

    this.daisyNPC?.playTapGreeting()
    this.character?.playCelebrate()
  }

  private bindActions(): void {
    const map = (): void => { locationManager.navigate(this, 'town', playerState.data.unlockedLocations) }
    const home = (): void => { locationManager.navigate(this, 'home', playerState.data.unlockedLocations) }
    this.game.events.on('ui:map', map).on('ui:home', home)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('ui:map', map).off('ui:home', home)
    })
  }
}

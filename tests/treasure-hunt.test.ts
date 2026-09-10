import { describe, expect, it, beforeEach } from 'vitest'
import {
  TREASURE_MYSTERIES,
  generateDailyHunt,
  getMysteryById,
} from '../src/data/treasureHunt'
import { CLOTHING_DEFINITIONS } from '../src/data/clothes'
import { treasureManager } from '../src/treasure/TreasureManager'
import { playerState } from '../src/state/PlayerState'

describe('Treasure Hunt Catalog & Definitions', () => {
  it('defines 3 valid story mysteries with valid clues and rewards', () => {
    expect(TREASURE_MYSTERIES).toHaveLength(3)
    const validClothingIds = new Set(CLOTHING_DEFINITIONS.map((c) => c.id))

    TREASURE_MYSTERIES.forEach((mystery) => {
      expect(mystery.id).toBeTruthy()
      expect(mystery.title).toBeTruthy()
      expect(mystery.icon).toBeTruthy()
      expect(mystery.description.length).toBeGreaterThan(10)
      expect(mystery.steps.length).toBeGreaterThanOrEqual(2)

      // Clue steps validation
      mystery.steps.forEach((step, idx) => {
        expect(step.stepIndex).toBe(idx)
        expect(step.location).toBeTruthy()
        expect(step.locationName).toBeTruthy()
        expect(step.riddle.length).toBeGreaterThan(10)
        expect(step.hint.length).toBeGreaterThan(5)
        expect(step.propName).toBeTruthy()
        expect(step.propIcon).toBeTruthy()
        expect(step.x).toBeGreaterThan(0)
        expect(step.y).toBeGreaterThan(0)
      })

      // Reward validation
      expect(mystery.reward.starCoins).toBeGreaterThanOrEqual(50)
      mystery.reward.clothingIds.forEach((clothId) => {
        expect(validClothingIds.has(clothId)).toBe(true)
      })
    })
  })

  it('retrieves mystery by id correctly', () => {
    const mystery = getMysteryById('mystery_golden_whisker')
    expect(mystery).toBeDefined()
    expect(mystery?.title).toBe('The Case of the Golden Whisker')
  })

  it('generates reproducible daily explorer hunts', () => {
    const huntA = generateDailyHunt(1)
    const huntB = generateDailyHunt(1)
    expect(huntA.id).toBe(huntB.id)
    expect(huntA.steps).toHaveLength(2)
    expect(huntA.reward.starCoins).toBe(50)
  })
})

describe('TreasureManager Operations', () => {
  beforeEach(() => {
    playerState.data.minigames = {}
  })

  it('starts an active mystery and returns current clue', () => {
    const mystery = treasureManager.startMystery('mystery_golden_whisker')
    expect(mystery).toBeDefined()
    expect(mystery?.id).toBe('mystery_golden_whisker')

    const active = treasureManager.getActiveMystery()
    expect(active?.id).toBe('mystery_golden_whisker')

    const currentClue = treasureManager.getCurrentClue()
    expect(currentClue).toBeDefined()
    expect(currentClue?.stepIndex).toBe(0)
    expect(currentClue?.location).toBe('pet_shop')
  })

  it('tracks mystery solved status and completion count', () => {
    expect(treasureManager.isMysterySolved('mystery_golden_whisker')).toBe(false)
    expect(treasureManager.getCasesSolvedCount()).toBe(0)

    playerState.data.minigames['solved_mystery_golden_whisker'] = 1
    playerState.data.minigames.mysteriesCompleted = 1

    expect(treasureManager.isMysterySolved('mystery_golden_whisker')).toBe(true)
    expect(treasureManager.getCasesSolvedCount()).toBe(1)
  })
})

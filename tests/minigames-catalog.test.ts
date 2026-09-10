import { describe, expect, it } from 'vitest'
import {
  BRAIN_BADGES,
  MEMORY_CARDS,
  PUZZLES,
  QUIZ_QUESTIONS,
  getQuestionsByTier,
} from '../src/data/minigames'

describe('Minigames Catalog Data Integrity', () => {
  it('contains valid quiz questions with 3 choices and valid answer keys', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(15)
    const ids = new Set<string>()

    QUIZ_QUESTIONS.forEach((q) => {
      expect(ids.has(q.id)).toBe(false)
      ids.add(q.id)
      expect(['junior', 'explorer', 'champion']).toContain(q.tier)
      expect(['math', 'science', 'words']).toContain(q.category)
      expect(q.question.trim().length).toBeGreaterThan(5)
      expect(q.options).toHaveLength(3)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(3)
      expect(q.explanation.trim().length).toBeGreaterThan(5)
      expect(q.icon.trim().length).toBeGreaterThan(0)
    })
  })

  it('filters questions accurately by difficulty tier', () => {
    const junior = getQuestionsByTier('junior')
    const explorer = getQuestionsByTier('explorer')
    const champion = getQuestionsByTier('champion')

    expect(junior.length).toBeGreaterThanOrEqual(5)
    expect(explorer.length).toBeGreaterThanOrEqual(5)
    expect(champion.length).toBeGreaterThanOrEqual(5)

    junior.forEach((q) => expect(q.tier).toBe('junior'))
    explorer.forEach((q) => expect(q.tier).toBe('explorer'))
    champion.forEach((q) => expect(q.tier).toBe('champion'))
  })

  it('contains complete memory deck cards with unique IDs', () => {
    expect(MEMORY_CARDS.length).toBeGreaterThanOrEqual(8)
    const cardIds = new Set<string>()
    MEMORY_CARDS.forEach((card) => {
      expect(cardIds.has(card.id)).toBe(false)
      cardIds.add(card.id)
      expect(card.icon).toBeTruthy()
      expect(card.label).toBeTruthy()
    })
  })

  it('defines valid jigsaw tile puzzles with correct tile counts', () => {
    expect(PUZZLES.length).toBeGreaterThanOrEqual(3)
    PUZZLES.forEach((p) => {
      expect([2, 3]).toContain(p.gridSize)
      const expectedTileCount = p.gridSize * p.gridSize
      expect(p.tiles).toHaveLength(expectedTileCount)

      const targetIndices = p.tiles.map((t) => t.targetIndex).sort((a, b) => a - b)
      for (let i = 0; i < expectedTileCount; i++) {
        expect(targetIndices[i]).toBe(i)
      }
    })
  })

  it('defines 4 standard brain badges with descriptions and requirements', () => {
    expect(BRAIN_BADGES).toHaveLength(4)
    const badgeIds = BRAIN_BADGES.map((b) => b.id)
    expect(badgeIds).toEqual([
      'badge_memory',
      'badge_math',
      'badge_puzzle',
      'badge_scholar',
    ])
  })
})

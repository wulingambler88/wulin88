import { describe, expect, it } from 'vitest'
import { evaluateBadges, type MinigameStats } from '../src/data/minigames'

describe('Brain Training Badges Evaluation', () => {
  it('returns empty array when no criteria are met', () => {
    const stats: MinigameStats = {
      memoryMatches: 1,
      quizCorrect: 2,
      mathQuizCorrect: 2,
      puzzlesSolved: 1,
      brainCoinsEarned: 20,
    }
    expect(evaluateBadges(stats)).toEqual([])
  })

  it('awards badge_memory when 3 or more memory games are won', () => {
    const stats: MinigameStats = { memoryMatches: 3 }
    const badges = evaluateBadges(stats)
    expect(badges).toContain('badge_memory')
  })

  it('awards badge_math when 5 or more math questions are answered correctly', () => {
    const stats: MinigameStats = { mathQuizCorrect: 5 }
    const badges = evaluateBadges(stats)
    expect(badges).toContain('badge_math')
  })

  it('awards badge_puzzle when 2 or more puzzles are completed', () => {
    const stats: MinigameStats = { puzzlesSolved: 2 }
    const badges = evaluateBadges(stats)
    expect(badges).toContain('badge_puzzle')
  })

  it('awards badge_scholar when 50 or more brain coins are won', () => {
    const stats: MinigameStats = { brainCoinsEarned: 50 }
    const badges = evaluateBadges(stats)
    expect(badges).toContain('badge_scholar')
  })

  it('awards all 4 badges when all master milestones are attained', () => {
    const stats: MinigameStats = {
      memoryMatches: 4,
      mathQuizCorrect: 7,
      puzzlesSolved: 3,
      brainCoinsEarned: 100,
    }
    const badges = evaluateBadges(stats)
    expect(badges).toEqual([
      'badge_memory',
      'badge_math',
      'badge_puzzle',
      'badge_scholar',
    ])
  })
})

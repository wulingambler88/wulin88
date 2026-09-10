import { describe, expect, it } from 'vitest'
import { RECIPE_DEFINITIONS, findMatchingRecipe } from '../src/data/recipes'
import { getItemDefinition } from '../src/data/items'

describe('Cooking & Recipe System', () => {
  it('defines 5 unique cooking recipes', () => {
    expect(RECIPE_DEFINITIONS.length).toBe(5)
    for (const recipe of RECIPE_DEFINITIONS) {
      expect(recipe.id).toBeDefined()
      expect(recipe.name.length).toBeGreaterThan(0)
      expect(recipe.ingredients.length).toBeGreaterThanOrEqual(2)
      expect(recipe.resultItemId).toBeDefined()
      expect(['stove', 'blender']).toContain(recipe.cookware)

      const resultItem = getItemDefinition(recipe.resultItemId)
      expect(resultItem).toBeDefined()
      expect(resultItem?.category).toBe('food')
      expect(Number(resultItem?.metadata.hunger)).toBeGreaterThan(0)
    }
  })

  it('matches blender recipe regardless of ingredient order', () => {
    const match1 = findMatchingRecipe('blender', ['apple_01', 'milk_01'])
    expect(match1?.id).toBe('recipe_apple_smoothie')
    expect(match1?.resultItemId).toBe('smoothie_apple_01')

    const match2 = findMatchingRecipe('blender', ['milk_01', 'apple_01'])
    expect(match2?.id).toBe('recipe_apple_smoothie')
  })

  it('matches stove recipe regardless of ingredient order', () => {
    const match = findMatchingRecipe('stove', ['cheese_01', 'bread_01'])
    expect(match?.id).toBe('recipe_french_toast')
    expect(match?.resultItemId).toBe('french_toast_01')
  })

  it('rejects recipe when cookware does not match', () => {
    // Apple smoothie requires blender, not stove
    const match = findMatchingRecipe('stove', ['apple_01', 'milk_01'])
    expect(match).toBeUndefined()
  })

  it('returns undefined for non-matching ingredient combinations', () => {
    const match = findMatchingRecipe('blender', ['apple_01', 'water_01'])
    expect(match).toBeUndefined()
  })
})

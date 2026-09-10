export interface RecipeDefinition {
  id: string
  name: string
  ingredients: readonly string[]
  resultItemId: string
  cookware: 'stove' | 'blender'
  description: string
  icon: string
}

export const RECIPE_DEFINITIONS: readonly RecipeDefinition[] = [
  {
    id: 'recipe_apple_smoothie',
    name: 'Apple Smoothie',
    ingredients: ['apple_01', 'milk_01'],
    resultItemId: 'smoothie_apple_01',
    cookware: 'blender',
    description: 'Refreshing sweet apple blended with creamy milk!',
    icon: '🧃',
  },
  {
    id: 'recipe_strawberry_boba',
    name: 'Strawberry Boba Tea',
    ingredients: ['milk_01', 'strawberry_01'],
    resultItemId: 'boba_strawberry_01',
    cookware: 'blender',
    description: 'Fresh blended strawberry milk with chewy pearls!',
    icon: '🧋',
  },
  {
    id: 'recipe_strawberry_deluxe',
    name: 'Deluxe Strawberry Cake',
    ingredients: ['cake_01', 'strawberry_01'],
    resultItemId: 'cake_strawberry_deluxe',
    cookware: 'stove',
    description: 'Warm fluffy sponge layered with fresh strawberries!',
    icon: '🍰',
  },
  {
    id: 'recipe_french_toast',
    name: 'Golden French Toast',
    ingredients: ['bread_01', 'cheese_01'],
    resultItemId: 'french_toast_01',
    cookware: 'stove',
    description: 'Toasted golden bread baked with melted cheese!',
    icon: '🍞',
  },
  {
    id: 'recipe_caramel_latte',
    name: 'Caramel Macchiato',
    ingredients: ['cafe_latte_01', 'cookies_01'],
    resultItemId: 'latte_caramel_01',
    cookware: 'stove',
    description: 'A cozy espresso drink with sweet cookie crumble on top!',
    icon: '☕',
  },
]

export function findMatchingRecipe(cookware: 'stove' | 'blender', placedIngredients: readonly string[]): RecipeDefinition | undefined {
  const placedSorted = [...placedIngredients].sort().join(',')
  return RECIPE_DEFINITIONS.find((recipe) => {
    if (recipe.cookware !== cookware) return false
    const recipeSorted = [...recipe.ingredients].sort().join(',')
    return recipeSorted === placedSorted
  })
}

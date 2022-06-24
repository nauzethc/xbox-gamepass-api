import { CategoryData, CategoryDetail } from '../types'

function toBoolean (value: string): boolean {
  return value === 'True'
}

function toStringArray (value: string, separator = ','): string[] {
  return (value ?? '').split(separator).filter(value => value !== '')
}

export function reduceCategoryData (data: CategoryData): CategoryDetail {
  return {
    id: data.siglId,
    title: data.title,
    description: data.description,
    requiresShuffling: toBoolean(data.requiresShuffling),
    imageUrl: data.imageUrl,
    highlightedGames: toStringArray(data.highlightedProducts),
    games: (data.products ?? []).map(p => p.id)
  }
}

export function mergeCategories (categories: CategoryDetail[]): CategoryDetail {
  const id: Set<string> = new Set()
  const games: Set<string> = new Set()
  const highlightedGames: Set<string> = new Set()

  categories.forEach(category => {
    Array.isArray(category.id)
      ? category.id.forEach(catId => id.add(catId))
      : id.add(category.id)
    category.games.forEach(gameId => games.add(gameId))
    category.highlightedGames.forEach(gameId => highlightedGames.add(gameId))
  })

  const data = categories.pop()
  return {
    id: [...id],
    title: data?.title ?? '',
    description: data?.description ?? '',
    requiresShuffling: categories.some(cat => cat.requiresShuffling),
    imageUrl: data?.imageUrl ?? '',
    highlightedGames: [...highlightedGames],
    games: [...games]
  }
}

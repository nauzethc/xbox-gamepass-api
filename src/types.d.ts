export interface CategoryData {
  siglId: string
  title: string
  description: string
  highlightedProducts: string
  requiresShuffling: string
  imageUrl: string
  products: Array<{ id: string }>
}

export interface Category {
  id: string | string[]
  title: string
  description: string
  requiresShuffling: boolean
  imageUrl: string
}

export interface CategoryDetail extends Category {
  highlightedGames: string[]
  games: string[]
}

export interface Image {
  width: number
  height: number
  size: number
  url: string
  type: string
}

export interface Game {
  id: string
  productTitle: string
  shortTitle: string
  productDescription: string
  shortDescription: string
  developer: string
  publisher: string
  releaseDate: Date
  lastUpdate: Date
  images: Image[]
  features: string[]
  genres: string[]
}

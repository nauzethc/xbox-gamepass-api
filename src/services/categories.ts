import axios from 'axios'
import { CategoryData, Category, CategoryDetail } from '../types'
import { mergeCategories, reduceCategoryData } from '../reducers/categories'
import categoriesData from '../data/categories.json'

const BASE_URL = process.env.CATEGORY_BASE_URL ?? 'https://catalog.gamepass.com/sigls/v2'
const LANGUAGE = process.env.LANGUAGE ?? 'en-us'
const MARKET = process.env.MARKET ?? 'US'

export async function findCategoryById (id: string): Promise<CategoryDetail> {
  return await axios
    .get(BASE_URL, {
      params: {
        id,
        language: LANGUAGE,
        market: MARKET
      }
    })
    .then(response => {
      const [data, ...products] = response.data
      const categoryData: CategoryData = { ...data, products }
      return categoryData
    })
    .then(reduceCategoryData)
}

export async function findMergedCategoriesById (ids: string[]): Promise<CategoryDetail> {
  return await Promise
    .all(ids.map(findCategoryById))
    .then(mergeCategories)
}

export async function getEntries (): Promise<Category[]> {
  return categoriesData as Category[]
}

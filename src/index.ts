import {
  findCategoryById,
  findMergedCategoriesById,
  getEntries as getCategories
} from './services/categories'

import { findGamesByIds, findRawGamesByIds } from './services/games'

export default {
  findCategoryById,
  findMergedCategoriesById,
  getCategories,
  findGamesByIds,
  findRawGamesByIds
}

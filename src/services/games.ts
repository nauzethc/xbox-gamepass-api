import axios from 'axios'
import { reduceGame } from '../reducers/games'
import { Game } from '../types'

const BASE_URL = process.env.CATEGORY_BASE_URL ?? 'https://displaycatalog.mp.microsoft.com/v7.0/products'
const LANGUAGE = process.env.LANGUAGE ?? 'en-us'
const MARKET = process.env.MARKET ?? 'US'

export async function findRawGamesByIds (ids: string): Promise<any[]> {
  return await axios
    .get(BASE_URL, {
      params: {
        bigIds: ids,
        languages: LANGUAGE,
        market: MARKET
      }
    })
    .then(response => response.data.Products)
}

export async function findGamesByIds (ids: string): Promise<Game[]> {
  return await findRawGamesByIds(ids).then(data => data.map(reduceGame))
}

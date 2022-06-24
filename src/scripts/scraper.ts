/* eslint-disable @typescript-eslint/no-var-requires */
import 'dotenv/config'
import axios from 'axios'
import slugify from 'slugify'
import { findCategoryById } from '../services/categories'
import { Category } from '../types'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
const Spinnies = require('spinnies')

// Config
const INPUT_URL = process.env.GAMEPASS_INPUT_URL ??
  'https://www.xbox.com/en-US/xbox-game-pass/games/js/xgpcatPopulate-MWF2.js'
const OUTPUT_FILE = process.env.CATEGORIES_FILE ??
  'src/data/categories.json'

function getUUIDs (text: string): string[] {
  const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g
  return text.match(UUID_REGEX) ?? []
}

function cleanComments (text: string): string {
  return text
    .split(/[\r\n]/)
    .map(line => line.trim())
    .filter(line => !line.startsWith('//'))
    .join('\n')
}

async function requestUUIDs (url: string): Promise<string[]> {
  const XGP_GUID_REGEX = /xgpGuidArray.*=.*\[(("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"([^\]]*))+)\];/g
  return await axios.get(url)
    .then((res) => String(res.data))
    .then(data => {
      const matches = data.match(XGP_GUID_REGEX)
      const foundText: string = (matches !== null) ? matches.pop() ?? '' : ''
      return (foundText !== '')
        ? getUUIDs(cleanComments(foundText))
        : []
    })
}

// Main
void (async function () {
  const status = new Spinnies()

  // Get categories UUIDs from Xbox GamePass web
  status.add('request', { text: 'Requesting categories...' })
  const categoryUUIDs: string[] = await requestUUIDs(INPUT_URL)
  const total: number = categoryUUIDs.length
  status.succeed('request', { text: `${total} categories found` })

  const data: Category[] = []
  let current: number = 0

  // Download
  status.add('download', { text: `Downloading [${current}/${total}]` })
  for (const uuid of categoryUUIDs) {
    try {
      data.push(await findCategoryById(uuid))
      status.update('download', { text: `Downloading [${++current}/${total}]` })
    } catch (err) {
      console.error(err)
    }
  }
  status.succeed('download', { text: `${data.length} categories downloaded` })

  // Merge
  const mergedData: Map<string, any> = new Map()
  for (const next of data) {
    const slug = slugify(next.title, { lower: true })
    const prev: any | null = mergedData.get(slug) ?? null

    const id: string[] = [...(
      new Set(prev !== null ? [...prev.id, next.id] : [next.id]))
    ]
    const requiresShuffling: boolean = (
      Boolean(prev?.requiresShuffling) || Boolean(next.requiresShuffling)
    )
    mergedData.set(slug, {
      id,
      title: next.title,
      description: next.description,
      requiresShuffling,
      imageUrl: next.imageUrl ?? ''
    })
  }

  // Store
  const categories = [...mergedData.values()]
  await writeFile(
    resolve(OUTPUT_FILE),
    JSON.stringify(categories, null, 2)
  )
  console.log(`Stored to ${OUTPUT_FILE}!`)
})()

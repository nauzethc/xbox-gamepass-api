import { Game, Image } from '../types'
import { get, set, flatten } from 'lodash'

interface GameProperty {
  from: string
  to: string
  defaultValue?: any
  transform?: Function
}

const PROPERTIES: GameProperty[] = [
  {
    from: 'ProductId',
    to: 'id',
    defaultValue: '?'
  },
  {
    from: 'LocalizedProperties[0].ProductTitle',
    to: 'title',
    defaultValue: 'Unknown'
  },
  {
    from: 'LocalizedProperties[0].ShortTitle',
    to: 'shortTitle',
    defaultValue: 'Unknown'
  },
  {
    from: 'LocalizedProperties[0].ProductDescription',
    to: 'description',
    defaultValue: ''
  },
  {
    from: 'LocalizedProperties[0].ShortDescription',
    to: 'shortDescription',
    defaultValue: ''
  },
  {
    from: 'LocalizedProperties[0].DeveloperName',
    to: 'developer',
    defaultValue: ''
  },
  {
    from: 'LocalizedProperties[0].PublisherName',
    to: 'publisher',
    defaultValue: ''
  },
  {
    from: 'LocalizedProperties[0].SearchTitles',
    to: 'keywords',
    defaultValue: [],
    transform: (searchTitles: any[]) => flatten(searchTitles.map(
      ({ SearchTitleString = '' }) => SearchTitleString.split(', ')
    ))
  },
  {
    from: 'MarketProperties[0].OriginalReleaseDate',
    to: 'releaseDate',
    defaultValue: '',
    transform: (value: string) => new Date(value)
  },
  {
    from: 'LastModifiedDate',
    to: 'lastUpdate',
    defaultValue: '',
    transform: (value: string) => new Date(value)
  },
  {
    from: 'LocalizedProperties[0].Images',
    to: 'images',
    defaultValue: [],
    transform: (images: any[]): Image[] => images.map(data => {
      const image: Image = {
        width: Number(get(data, 'Width', 0)),
        height: Number(get(data, 'Height', 0)),
        size: Number(get(data, 'FileSizeInBytes', 0)),
        type: get(data, 'ImagePurpose', ''),
        url: get(data, 'Uri', '')
      }
      return image
    })
  },
  {
    from: 'Properties.Attributes',
    to: 'features',
    defaultValue: [],
    transform: (attributes: any[]) => attributes.map(({ Name = '' }) => Name)
  },
  {
    from: 'Properties.Categories',
    to: 'genres',
    defaultValue: []
  }
]

function getProperty (game: any, from: string, defaultValue: any, transform?: Function): any {
  const value = get(game, from, defaultValue)
  return transform != null ? transform(value) : value
}

export function reduceGame (game: any): Game {
  const data = {}
  PROPERTIES.forEach(({ from, to, defaultValue, transform }) => {
    set(data, to, getProperty(game, from, defaultValue, transform))
  })
  return data as Game
}

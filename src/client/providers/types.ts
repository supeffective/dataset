import type { Entity } from '../repositories'

/**
 * Native RequestInit, compatible with Next.js revalidate tags.
 *
 * @see https://nextjs.org/docs/api-reference/next.config.js/headers
 */
export type NextCompatibleRequestInit = RequestInit & {
  next?: {
    tags?: Array<string>
    revalidate?: number
  }
}

export type DatasetClientConfig = {
  baseDataUrl: string
  baseImageUrl: string
}

export type InMemoryCache<R extends Entity> = {
  collection: Map<string, R[]>
}

export interface AssetUrlResolver {
  baseUri: string
  resolveUri(relativePath: string): string
}

export interface ImageUrlResolver extends AssetUrlResolver {
  pokemonImg(nid: string, variant?: string, shiny?: boolean): string
  gameImg(id: string, variant?: string): string
  itemImg(id: string, variant?: string): string
  ribbonImg(id: string, variant?: string): string
  markImg(id: string, variant?: string): string
  typeImg(id: string, variant?: string, withBg?: boolean): string
  originMarkImg(id: string): string
}

import { type NextCompatibleRequestInit, fetchResource } from '../providers'
import type { Entity } from './_types'

export function getSiblingEntities<R extends Entity = Entity>(
  collection: R[],
  id: string,
): {
  prev: R | null
  next: R | null
} {
  const index = collection.findIndex((entity) => entity.id === id)
  const prev = index <= 0 ? null : collection[index - 1]
  const next = index < collection.length - 1 ? collection[index + 1] : null

  return {
    prev: prev ?? null,
    next: next ?? null,
  }
}

export function findResourceByField<R extends Entity = Entity>(
  collection: Array<R>,
  field: keyof R,
  value: string | number | boolean | undefined | null,
): R | undefined {
  return collection.find((ability) => ability[field] === value)
}

export function findResourceById<R extends Entity = Entity>(collection: Array<R>, id: string): R | undefined {
  return findResourceByField<R>(collection, 'id', id)
}

export function findResourcesByIds<R extends Entity = Entity>(collection: Array<R>, ids: Array<string>): Array<R> {
  return collection.filter((ability) => ids.includes(ability.id))
}

export function getResourceByField<R extends Entity = Entity>(
  collection: Array<R>,
  field: keyof R,
  id: string,
  title = 'Resource',
): R {
  const found = findResourceByField<R>(collection, field, id)

  if (!found) {
    throw new Error(`${title} with ${String(field)} = ${id} not found`)
  }

  return found
}

export function getResourceById<R extends Entity = Entity>(collection: Array<R>, id: string, title = 'Resource'): R {
  const found = findResourceById<R>(collection, id)

  if (!found) {
    throw new Error(`${title} with ID = ${id} not found`)
  }

  return found
}

export async function findResource<R extends Entity = Entity>(
  dirName: string,
  groupId: string | null | undefined,
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<R | undefined> {
  const groupSegment = groupId ? `/${groupId}` : ''

  return fetchResource<R>(`${dirName}${groupSegment}/${id}.min.json`, baseUrl, params).catch((e) => {
    if (String(e).includes('HTTP error 404')) {
      return undefined
    }

    throw e
  })
}

export async function getResource<R extends Entity = Entity>(
  dirName: string,
  groupId: string | null | undefined,
  id: string,
  baseUrl: string,
  title = 'Resource',
  params?: NextCompatibleRequestInit,
): Promise<R> {
  const found = await findResource<R>(dirName, groupId, id, baseUrl, params)

  if (!found) {
    const groupSegment = groupId ? `/${groupId}` : ''
    throw new Error(`${title} ${dirName}${groupSegment}/${id}.min.json not found`)
  }

  return found
}

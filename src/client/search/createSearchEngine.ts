import type { Entity } from '../repositories/_types'
import type {
  LegacyRepository,
  SearchEngine,
  SearchEngineIndex,
  SearchEngineIndexHydrator,
  SearchFilter,
  SearchQuery,
} from './types'

function applyFilter<R extends Entity>(entity: R, filter: SearchFilter<R>): boolean {
  const { field, value, operator } = filter
  const fieldValue = entity[field]
  const strFieldVal = String(fieldValue).toLowerCase()
  const strVal = String(value).toLowerCase()

  switch (operator) {
    case 'eq':
      return fieldValue === value
    case 'neq':
      return fieldValue !== value
    case 'gt':
      if (value === undefined) {
        return false
      }

      return fieldValue > value
    case 'lt':
      if (value === undefined) {
        return false
      }

      return fieldValue < value
    case 'gte':
      if (value === undefined) {
        return false
      }

      return fieldValue >= value
    case 'lte':
      if (value === undefined) {
        return false
      }

      return fieldValue <= value
    case 'in':
      if (!Array.isArray(value)) {
        throw new Error(`Invalid value for operator 'in': ${value}`)
      }

      return (value as Array<any>).includes(fieldValue)
    case 'notin':
      if (!Array.isArray(value)) {
        throw new Error(`Invalid value for operator 'notin': ${value}`)
      }

      return !(value as Array<any>).includes(fieldValue)
    case 'ends':
      return typeof fieldValue === 'string' && strFieldVal.endsWith(strVal)
    case 'starts':
      return typeof fieldValue === 'string' && strFieldVal.startsWith(strVal)
    case 'contains':
      return typeof fieldValue === 'string' && strFieldVal.includes(strVal)
    case 'ncontains':
      return typeof fieldValue === 'string' && !strFieldVal.includes(strVal)
    case 'isnull':
      return fieldValue === null || fieldValue === undefined
    case 'notnull':
      return fieldValue !== null && fieldValue !== undefined
    default:
      throw new Error(`Invalid operator: ${operator}`)
  }
}

function applyQuery<R extends Entity>(entities: R[], query: SearchQuery<R>): R[] {
  return entities.filter((entity) => {
    return query.some((filterGroup) => {
      // For each group of filters, check if any of them (OR) pass for the entity
      return filterGroup.every((filter) => applyFilter(entity, filter))
    })
  })
}

export const defaultSearchIndexHydrator: SearchEngineIndexHydrator<any> = async (entities, searchIndex) => {
  await searchIndex.index(entities, [
    ['id', (ent) => ent.id],
    ['name', (ent) => ent.name],
  ])
}

export default function createSearchEngine<R extends Entity>(
  repository: LegacyRepository<R>,
  searchIndex: SearchEngineIndex<R>,
  searchIndexHydrator?: SearchEngineIndexHydrator<R>,
): SearchEngine<R> {
  const hydrate = async (q: string | SearchQuery<R>) => {
    const allEntities = await repository.getAll()
    if (q === 'string' && searchIndexHydrator !== undefined && (await searchIndex.size()) === 0) {
      await searchIndexHydrator(allEntities, searchIndex, repository)
    }

    return allEntities
  }

  const repo: SearchEngine<R> = {
    id: `${repository.id}_search`,
    async search(
      q: string | SearchQuery<R>,
      limit = 0,
      offset = 0,
      sortBy?: keyof R,
      sortDir: 'asc' | 'desc' = 'asc',
    ): Promise<R[]> {
      const allEntities = await hydrate(q)

      let filteredEntities =
        typeof q === 'string' ? await searchIndex.search(q, allEntities) : applyQuery<R>(allEntities, q)

      // Sort the filtered entities if sortBy is provided
      if (sortBy) {
        filteredEntities = [...filteredEntities].sort((a, b) => {
          const aValue = String(a[sortBy] ?? '')
          const bValue = String(b[sortBy] ?? '')

          if (sortDir === 'asc') {
            return aValue.toLowerCase().localeCompare(bValue.toLowerCase())
          } else {
            return bValue.toLowerCase().localeCompare(aValue.toLowerCase())
          }
        })
      }

      // Apply pagination
      const paginatedEntities =
        limit > 0 ? filteredEntities.slice(offset, offset + limit) : filteredEntities.slice(offset)

      return paginatedEntities
    },
  }

  return repo
}

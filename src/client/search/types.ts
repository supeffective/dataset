import type { Entity } from '../repositories/_types'

/**
 * @deprecated
 */
export interface LegacyRepository<R extends Entity> {
  id: string
  getAll(): Promise<Array<R>>
  getById(id: string): Promise<R>
  findById(id: string): Promise<R | undefined>
  getManyByIds(ids: Array<string>): Promise<Array<R>>
}

export interface SearchFilter<R extends Entity> {
  field: keyof R
  value?: string | number | boolean | string[] | number[]
  operator:
    | 'neq'
    | 'eq'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'
    | 'in'
    | 'notin'
    | 'ends'
    | 'starts'
    | 'contains'
    | 'ncontains'
    | 'isnull'
    | 'notnull'
}

/**
 * SearchQuery is a 2D array of SearchFilter.
 * The first level (root) are OR conditions, the second level (nested arrays) are AND.
 *
 * e.g.: [ // people with name John OR age equal to 18 AND lastname equal to Smith:
 *  [{ field: 'name', value: 'John', operator: 'eq' }],
 *  [{ field: 'age', value: 18, operator: 'eq' }, { field: 'lastname', value: 'Smith', operator: 'eq' }]
 * ]
 */
export type SearchQuery<R extends Entity> = Array<SearchFilter<R>[]>

export interface SearchEngine<R extends Entity> {
  id: string
  search(
    q: string | SearchQuery<R>,
    limit?: number,
    offset?: number,
    sortBy?: keyof R,
    sortDir?: 'asc' | 'desc',
  ): Promise<Array<R>>
}

export type SearchEngineIndexHydrator<R extends Entity> = (
  entities: R[],
  searchEngine: SearchEngineIndex<R>,
  repository: LegacyRepository<R>,
) => Promise<void>

export type SearchEngineIndex<R extends Entity> = {
  /**
   * Index the given entities
   * @param entities Entities to index
   * @param tokens Array of [fieldName, tokenizer] tuples
   * @returns Promise
   * @example
   * const entities = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }]
   * const tokens = [['name', (item) => item.name.split(' ')]]
   * await searchEngine.index(entities, tokens)
   * // Now you can search for entities matching 'John' or 'Doe'
   * const results = await searchEngine.search('John Doe')
   * // results = Set(['1', '2'])
   * const results = await searchEngine.searchWith(entities, 'Jane')
   * // results = [{ id: '2', name: 'Jane Doe' }]
   **/
  index: (entities: R[], tokens: Array<[keyof R | string, (entity: R) => string[] | string | null]>) => Promise<void>

  /**
   * @returns Number of indexed entities
   */
  size: () => Promise<number>

  /**
   * Search for entities matching the given text
   * @param text Full text search query
   * @returns Set of ids of matching entities
   */
  searchIds: (text: string) => Promise<Set<string>>

  /**
   * Search for entities matching the given text
   * @param entities Entities to search in
   * @param text Full text search query
   * @returns The matching entities
   */
  search: (text: string, entities: R[]) => Promise<R[]>
}

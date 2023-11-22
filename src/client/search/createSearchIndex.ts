import type { Entity } from '../repositories/_types'
import type { SearchEngineIndex } from './types'

export function createSearchIndex<R extends Entity>(tokenSeparator = ':'): SearchEngineIndex<R> {
  const _index = new Map<string, string>()

  return {
    async size() {
      return _index.size
    },
    async index(entities, tokens) {
      _index.clear()
      const sep = tokenSeparator

      for (const item of entities) {
        if (_index.has(item.id)) {
          throw new Error(`The index already has the item with key: ${item.id}`)
        }

        let fullText = ''

        for (const [prop, propValueFn] of tokens) {
          const propName = prop as string

          let propValues = propValueFn(item)
          if (!propValues) {
            continue
          }
          if (!Array.isArray(propValues)) {
            propValues = [propValues]
          }

          // support many values
          for (let propValue of propValues) {
            if (typeof propValue === 'number') {
              propValue = String(propValue)
            }
            if (typeof propValue !== 'string' || propValue === '') {
              continue
            }
            const minifiedValue = propValue.replace(/\s/g, '')
            fullText = `${fullText} ${propName}${sep}${propValue}`
            if (propValue !== minifiedValue) {
              fullText = `${fullText} ${propName}${sep}${minifiedValue}`
            }
          }
        }

        fullText = fullText.trim().toLowerCase()

        if (fullText !== '') {
          _index.set(item.id, fullText)
        }
      }
    },
    async searchIds(text) {
      if (!text || text === '' || text === '*') {
        return new Set(_index.keys())
      }
      const hits: Set<string> = new Set()
      const sanitizedText = text.replace(/\s+/g, ' ').trim().toLowerCase()
      if (sanitizedText === '') {
        return hits
      }
      const tokens = sanitizedText.split(' ')

      return new Set(
        Array.from(_index)
          .filter((entry) => {
            return tokens.some((token) => {
              if (token.startsWith('!')) {
                const negatedToken = token.slice(1)

                return negatedToken.length > 0 && !entry[1].includes(negatedToken)
              }

              return entry[1].includes(token)
            })
          })
          .map((entry) => entry[0]),
      )
    },
    async search(text, entities) {
      if (!text || text === '' || text === '*') {
        return entities
      }
      const hits = await this.searchIds(text)

      if (hits.size === 0) {
        return []
      }

      return entities.filter((item) => hits.has(item.id))
    },
  }
}

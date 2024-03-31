/**
 * Converts an array of records into a compact JSON string,
 * where each record is minified and represents exactly one line.
 *
 * @param records
 * @returns
 */
export function jsonStringifyRecords(records: Array<unknown>): string {
  return `[\n${records.map((row) => `  ${JSON.stringify(row)}`).join(',\n')}\n]\n`
}

/**
 * Parses a CSV array into a JSON array.
 * The first row is used as the keys for each object.
 *
 * CSV array example:
 * [
 *  ["id", "name", "type1", "type2"],
 *  ["bulbasaur", "Bulbasaur", "grass", "poison"],
 *  ["ivysaur", "Ivysaur", "grass", "poison"],
 * [ "venusaur", "Venusaur", "grass", "poison"]
 * ]
 *
 * @param data CSV array
 * @returns
 */
export function jsonParseCsvArray<T = object>(data: Array<Array<unknown>>): Array<T> {
  if (data.length < 2) {
    return []
  }

  const [columns, ...rest] = data

  if (!Array.isArray(columns)) {
    throw new Error('Invalid CSV data: missing columns')
  }

  const rows: Array<T> = rest.map((row) => {
    const entries: Array<[string, unknown]> = []

    if (row.length !== columns.length) {
      throw new Error(`Invalid CSV data: row length does not match column length for row ${row}`)
    }

    for (const i in columns) {
      entries.push([columns[i] as string, row[i]])
    }

    return Object.fromEntries(entries) as T
  })

  return rows
}

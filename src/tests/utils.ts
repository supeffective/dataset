export async function fetchImagesIndex(baseFilename: string): Promise<
  Array<{
    id: string
    path: string
  }>
> {
  const url = `https://cdn.supeffective.com/assets/images-index/${baseFilename}.min.json`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }
  // biome-ignore lint/suspicious/noExplicitAny: any is fine here
  const json = (await response.json()) as any
  return json
}

export async function fetchImagesIndexMap(baseFilename: string): Promise<Map<string, string>> {
  const images = await fetchImagesIndex(baseFilename)
  return new Map<string, string>(images.map((image) => [image.id, image.path]))
}

import z from 'zod'

export const languageSchema = z.object({
  id: z.enum(['en', 'es', 'fr', 'de', 'it', 'ja', 'ja_ro', 'ko', 'chs', 'cht']),
  name: z.string(),
  nameEng: z.string(),
  alpha3: z.enum(['eng', 'esp', 'fra', 'deu', 'ita', 'jap', 'jap_ro', 'kor', 'chs', 'cht']),
  locale: z.string(),
  flag: z.string(),
})

export type PokeLanguage = z.infer<typeof languageSchema>
export type PokeLanguageId = PokeLanguage['id']
export type PokeLanguageAlpha3 = PokeLanguage['alpha3']

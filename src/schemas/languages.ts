import z from 'zod'

import { slugSchema } from './common'

export const languageSchema = z.object({
  id: slugSchema,
  name: z.string(),
  isoCode: z.string().max(5),
  locale: z.string().max(3).nullable(),
  urlSlug: z.string().max(5),
})

export type Language = z.infer<typeof languageSchema>

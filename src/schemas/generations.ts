import z from 'zod'

export const generationSchema = z.object({
  id: z.number().int(),
  minDexNum: z.number().int(),
  maxDexNum: z.number().int(),
})

export type Generation = z.infer<typeof generationSchema>

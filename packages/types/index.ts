import { z } from 'zod'

export type Test = string

export type * from '@prisma/client'

export const TesttSchema = z.object({
    str: z.string(),
    nested: z.object({
        val: z.number(),
    }),
})

export type Testt = z.infer<typeof TesttSchema>

import { z } from 'zod'
import type React from 'react'

export type Test = string

export type * from '@prisma/client'

export const TesttSchema = z.object({
    str: z.string(),
    nested: z.object({
        val: z.number(),
    }),
})

export type Testt = z.infer<typeof TesttSchema>

export * from './frontendRouting'
export * from './backendRouting'

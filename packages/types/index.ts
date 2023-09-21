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
type t = {
    tagName: string
    targets: { target: string | undefined; value: string }[]
}

export const MetadataSchema = z.object({
    tagName: z.string(),
    targets: z.array(
        z.object({
            target: z.string().nullable(),
            value: z.string(),
        }),
    ),
})
export type Metadata = z.infer<typeof MetadataSchema>

type RouteCallback = (path: string, queryString: string) => Metadata[]

export type Route<T extends string> = {
    path: T
    metadata?: RouteCallback
    element?: React.JSX.Element
}

export const routingFactory = <T extends string>(
    getMetaHash: Record<T, RouteCallback | undefined>,
) => {
    const routing: Route<T>[] = [
        {
            metadata: getMetaHash['/' as keyof typeof getMetaHash], //localhost/
            path: '/' as keyof typeof getMetaHash,
        },
        {
            metadata: getMetaHash['/about' as keyof typeof getMetaHash], //localhost/about
            path: '/about' as keyof typeof getMetaHash,
        },

        {
            metadata: getMetaHash['/about/me' as keyof typeof getMetaHash], //localhost/about/me
            path: '/about/me' as keyof typeof getMetaHash,
        },
        {
            metadata:
                getMetaHash[
                    '/about/product_number_one' as keyof typeof getMetaHash
                ],
            path: '/about/product_number_one' as keyof typeof getMetaHash,
        },
    ]

    return routing
}

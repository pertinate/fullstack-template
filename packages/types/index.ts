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

export const MetadataSchema = z.object({})
export type Metadata = z.infer<typeof MetadataSchema>

type RouteCallback = (path: string, queryString: string) => Metadata

export type Route<T extends string> = {
    path: T
    routes?: Route<T>[]
    metadata?: RouteCallback
}

export const routingFactory = <T extends string>(
    getMetaHash: Record<T, RouteCallback | undefined>,
) => {
    const routing: Route<T> = {
        metadata: getMetaHash['/' as keyof typeof getMetaHash], //localhost/
        path: '/' as keyof typeof getMetaHash,
        routes: [
            {
                metadata: getMetaHash['/about' as keyof typeof getMetaHash], //localhost/about
                path: '/about' as keyof typeof getMetaHash,
                routes: [
                    {
                        metadata:
                            getMetaHash[
                                '/about/me' as keyof typeof getMetaHash
                            ], //localhost/about/me
                        path: '/me' as keyof typeof getMetaHash,
                    },
                    {
                        metadata:
                            getMetaHash[
                                '/about/product_number_one' as keyof typeof getMetaHash
                            ],
                        path: '/product_number_one' as keyof typeof getMetaHash,
                    },
                ],
            },
        ],
    }

    return routing
}

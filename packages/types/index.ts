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

export const MetadataSchema = z.object({
    tagName: z.custom<keyof React.JSX.IntrinsicElements>(),
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
    getMetaHash: Record<T, RouteCallback | React.JSX.Element | undefined>,
) => {
    const routing = [
        '/',
        '/about',
        '/about/me',
        '/about/product_number_one',
    ].map<Route<T>>(entry => ({
        path: entry as T,
        metadata:
            typeof getMetaHash[entry as T] == 'function'
                ? (getMetaHash[entry as T] as RouteCallback)
                : undefined,
        element:
            typeof getMetaHash[entry as T] == 'object'
                ? (getMetaHash[entry as T] as React.JSX.Element)
                : undefined,
    }))

    return routing
}

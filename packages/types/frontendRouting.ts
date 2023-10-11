import { z } from 'zod'

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

type RouteCallback = (
    path: string,
    queryString: {
        params?: { [key: string]: any | undefined }
        query?: { [key: string]: any | undefined }
        headers?: { [key: string]: any | undefined }
    },
) => Metadata[]

const routing = [
    '/',
    '/about',
    '/about/me',
    '/about/product_number_one',
    '/products/:productId',
] as const

export type Route = {
    path: (typeof routing)[number]
    metadata?: RouteCallback
    element?: React.JSX.Element
}
export const routingFactory = (
    getMetaHash: Partial<
        Record<
            (typeof routing)[number],
            RouteCallback | React.JSX.Element | undefined
        >
    >,
) => {
    const fixedRouting = routing.map<Route>(entry => ({
        path: entry,
        metadata:
            typeof getMetaHash[entry] == 'function'
                ? (getMetaHash[entry] as RouteCallback)
                : undefined,
        element:
            typeof getMetaHash[entry] == 'object'
                ? (getMetaHash[entry] as React.JSX.Element)
                : undefined,
    }))

    return fixedRouting
}

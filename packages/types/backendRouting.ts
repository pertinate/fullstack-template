import { z } from 'zod'

export type APIResponseExample = {
    hello: 'world'
}

type METHODS = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export enum APIRoutes {
    '/api/data/:myParamOne/:myParamTwo?/:myParamThree' = '/api/data/:myParamOne/:myParamTwo?/:myParamThree',
    '/api/data' = '/api/data',
}

export const backendRouting = {
    [APIRoutes['/api/data/:myParamOne/:myParamTwo?/:myParamThree']]: {
        paramSchema: z.object({
            myParamOne: z.string(),
            myParamTwo: z.string(),
            myParamThree: z.string().optional(),
        }),
        querySchema: z.object({
            q: z.string().optional(),
        }),
        method: 'POST' as METHODS,
        bodySchema: z.object({
            hello: z.literal('world'),
        }),
        resultSchema: z.object({
            world: z.literal('hello'),
        }),
    },
    [APIRoutes['/api/data']]: {
        paramSchema: z.undefined(),
        querySchema: z.undefined(),
        method: 'GET' as METHODS,
        bodySchema: z.undefined(),
        resultSchema: z.object({
            world: z.literal('hello'),
        }),
    },
} as const

export type APIRouteName = keyof typeof backendRouting

export const getFrontendAPIRoute = (key: APIRoutes) => {
    const routing = backendRouting[key]

    return (
        params: z.infer<typeof routing.paramSchema>,
        queries: z.infer<typeof routing.querySchema>,
    ) => {
        const furthestLeft = Object.keys(params || []).reduce((acc, next) => {
            acc = key.indexOf(`/:${next}`)
            return acc
        }, -1)

        let base = key.slice(0, furthestLeft)

        if (base[base.length - 1] == '?') {
            base = key.slice(0, base.length - 1)
        }
        const parsedParams = routing.paramSchema.parse(params)
        const paramBuild = Object.keys(parsedParams || []).reduce(
            (acc, next) => {
                acc += `/${params?.[next as keyof typeof parsedParams]}`
                return acc
            },
            '',
        )

        const url = new URL(`${base}${paramBuild}`)

        const parsedQueries = routing.querySchema.parse(queries)
        if (parsedQueries) {
            ;(
                Object.keys(
                    parsedQueries || [],
                ) as (keyof typeof parsedQueries)[]
            ).forEach(query => {
                if (parsedQueries[query] == undefined) {
                    return
                }

                url.searchParams.append(query, parsedQueries[query] as string) //typescript thinks it is still undefined when it is narrowed
            })
        }
        return {
            url,
            fastifyUrl: key,
            bodySchema: routing.bodySchema,
            paramSchema: routing.paramSchema,
            querySchema: routing.querySchema,
            resultSchema: routing.resultSchema,
            method: routing.method,
        }
    }
}

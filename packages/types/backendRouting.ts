import { z } from 'zod'

export type APIResponseExample = {
    hello: 'world'
}

type METHODS = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const test = [
    '/api/data/:myParamOne/:myParamTwo?/:myParamThree',
    '/api/data',
] as const

export enum APIRoutes {
    '/api/data/:myParamOne/:myParamTwo?/:myParamThree' = '/api/data/:myParamOne/:myParamTwo?/:myParamThree',
    '/api/data' = '/api/data',
}

export const backendRouting = {
    [test[1]]: {
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
    [test[0]]: {
        paramSchema: z.undefined().optional(),
        querySchema: z.undefined().optional(),
        method: 'GET' as METHODS,
        bodySchema: z.undefined(),
        resultSchema: z.object({
            world: z.literal('hello'),
        }),
    },
} as const

export type APIRouteName = keyof typeof backendRouting

export const getFrontendAPIRoute = (key: (typeof test)[number]) => {
    const routing = backendRouting[key]

    return (
        params: z.infer<typeof routing.paramSchema>,
        queries: z.infer<typeof routing.querySchema>
    ) => {
        const furthestLeft = Object.keys(params || []).reduce((acc, next) => {
            acc = key.indexOf(`/:${next}`)
            return acc
        }, -1)

        let base = furthestLeft > -1 ? key.slice(0, furthestLeft) : key

        if (base[base.length - 1] == '?') {
            base = key.slice(0, base.length - 1)
        }

        let builder = base
        console.log(routing.paramSchema.isOptional())
        if (routing.paramSchema.isOptional() == true) {
            const parsedParams = routing.paramSchema.parse(params)
            const paramBuild = Object.keys(parsedParams || []).reduce(
                (acc, next) => {
                    acc += `/${params?.[next as keyof typeof parsedParams]}`
                    return acc
                },
                ''
            )

            builder += paramBuild
        }

        const url = new URL(
            `${window.location.protocol}//${
                window.location.hostname
            }:${'8080'}${builder}`
        )

        console.log(url)

        if (routing.querySchema.isOptional() == true) {
            const parsedQueries = routing.querySchema.parse(queries)
            if (parsedQueries) {
                ;(
                    Object.keys(
                        parsedQueries || []
                    ) as (keyof typeof parsedQueries)[]
                ).forEach(query => {
                    if (parsedQueries[query] == undefined) {
                        return
                    }

                    url.searchParams.append(
                        query,
                        parsedQueries[query] as string
                    ) //typescript thinks it is still undefined when it is narrowed
                })
            }
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

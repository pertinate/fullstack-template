import { testGet, testPost } from './controllers/controllerTest'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fs from 'fs'
import path from 'path'
import { APIResponseExample, Metadata, routingFactory } from '@local/types'
import childProcess from 'child_process'
import htmlParser from 'node-html-parser'

class CustomExternalData<T> {
    url: string
    data: T | undefined
    constructor(url: string) {
        this.url = url
    }
}

const test = {
    data: undefined,
    staleAt: 0,
    loading: false,
    error: false,
    get getData() {
        if (new Date().valueOf() > this.staleAt || this.staleAt == 0) {
            this.loading = true
            fetch('my/url')
                .then(() => {
                    //trigger update to this.data that would re-render whatever is using it
                    this.staleAt = new Date().valueOf() + 1000 //maybe not correct way to implement
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                    this.error = true
                })
        }
        return this.data
    },
}

const defaultMeta: Metadata[] = [
    {
        tagName: 'title',
        targets: [
            {
                target: null,
                value: 'new custom title',
            },
        ],
    },
]

export const routes = routingFactory({
    '/about/product_number_one': (path, routeData) => {
        return [
            {
                tagName: 'title',
                targets: [
                    {
                        target: null,
                        value: `Product Number One`,
                    },
                ],
            },
            {
                tagName: 'meta',
                targets: [
                    {
                        target: 'property',
                        value: 'og:title',
                    },
                    {
                        target: 'content',
                        value: 'Custom SEO Title',
                    },
                ],
            },
        ]
    },
    '/products/:productId': (path, routeData) => {
        return [
            {
                tagName: 'title',
                targets: [
                    {
                        target: null,
                        value: `Product: ${routeData.params?.productId} Q:${routeData.query?.q}`,
                    },
                ],
            },
            {
                tagName: 'meta',
                targets: [
                    {
                        target: 'property',
                        value: 'og:title',
                    },
                    {
                        target: 'content',
                        value: 'Custom SEO Title',
                    },
                ],
            },
        ]
    },
})

const fastify = Fastify({ logger: true })

fastify.setErrorHandler(function (error, request, reply) {
    if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        // Log error
        // this.log.error(error);
        // Send error response
    } else {
        // fastify will use parent error handler to handle this
    }
    reply.status(500).send({ ok: false })
})

fastify.register(
    (fastify, opts, done) => {
        fastify.get('/', testGet)
        fastify.post('/', testPost)
        fastify.get('/data_example', (req, reply) => {
            console.log('>>>test')
            try {
                return JSON.stringify({ hello: 'world' } as APIResponseExample)
            } catch (error) {
                console.error(error)
                reply.code(500).send()
            }
        })
        done()
    },
    { prefix: '/api' },
)

if (process.env.ENVIRONMENT == 'development') {
    fs.watch(path.resolve(`./../client/src`), undefined, (event, filename) => {
        console.log(event, filename)
        childProcess.exec('npm run build', {
            cwd: './../client',
        })
    })
}

fastify.register(fastifyStatic, {
    root: path.resolve('./../client/dist'), //update so production is covered
    prefix: '/', // optional: default '/'
    constraints: {},
})

const getHtmlFile = () => {
    try {
        return fs.readFileSync(path.resolve('./../client/dist/index.html'))
    } catch {
        return fs.readFileSync(path.resolve('./index.html')) //will need to change based on production build structure
    }
}

routes.forEach(route => {
    fastify.get(route.path, (req, res) => {
        console.log(
            `loop: ${route.path} ${JSON.stringify(req.params)} ${JSON.stringify(
                req.query,
            )}`,
        )
        const rawHtml = getHtmlFile()
        const html = htmlParser.parse(rawHtml.toString())
        const htmlHead = html.querySelector('head')
        const meta = route.metadata?.(req.routerPath, {
            params: req.params || {},
            query: req.query || {},
            headers: req.headers || {},
        })

        if (meta) {
            meta.forEach(metadata => {
                const idx = metadata.targets.findIndex(
                    data => data.target == null,
                )
                htmlHead?.appendChild(
                    htmlParser.parse(
                        `<${metadata.tagName} ${metadata.targets
                            .filter((_, index) => index != idx)
                            .map(entry => `${entry.target}="${entry.value}"`)
                            .join(' ')}>${
                            idx > -1 ? metadata.targets[idx].value : ''
                        }</${metadata.tagName}>`,
                    ),
                )
            })
        }
        res.header('Content-Type', 'text/html')
        return html.toString()
    })
})
fastify.setNotFoundHandler((request, reply) => {
    const rawHtml = getHtmlFile()
    const html = htmlParser.parse(rawHtml.toString())
    const htmlHead = html.querySelector('head')
    defaultMeta.forEach(metadata => {
        const idx = metadata.targets.findIndex(data => data.target == null)
        htmlHead?.appendChild(
            htmlParser.parse(
                `<${metadata.tagName} ${metadata.targets
                    .filter((_, index) => index != idx)
                    .map(entry => `${entry.target}="${entry.value}"`)
                    .join(' ')}>${
                    idx > -1 ? metadata.targets[idx].value : ''
                }</${metadata.tagName}>`,
            ),
        )
    })
    reply.header('Content-Type', 'text/html')
    reply.status(200).send(html.toString())
})
fastify.get('/sdfg', (req, res) => {
    console.log(`catch: ${req.url}`)
    const rawHtml = getHtmlFile()
    const html = htmlParser.parse(rawHtml.toString())
    const htmlHead = html.querySelector('head')
    defaultMeta.forEach(metadata => {
        const idx = metadata.targets.findIndex(data => data.target == null)
        htmlHead?.appendChild(
            htmlParser.parse(
                `<${metadata.tagName} ${metadata.targets
                    .filter((_, index) => index != idx)
                    .map(entry => `${entry.target}="${entry.value}"`)
                    .join(' ')}>${
                    idx > -1 ? metadata.targets[idx].value : ''
                }</${metadata.tagName}>`,
            ),
        )
    })
    res.header('Content-Type', 'text/html')
    return html.toString()
})
// Declare a route

// Run the server!
fastify.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
})

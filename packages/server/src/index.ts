import { testGet, testPost } from './controllers/controllerTest'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fs from 'fs'
import path from 'path'
import { Metadata, routingFactory } from '@local/types'
import childProcess from 'child_process'
import htmlParser, { Node } from 'node-html-parser'

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
    '/': () => defaultMeta,
    '/about': () => defaultMeta,
    '/about/me': () => defaultMeta,
    '/about/product_number_one': (path, queryString) => {
        return [
            {
                tagName: 'title',
                targets: [
                    {
                        target: null,
                        value: 'Product Number One',
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
        done()
    },
    { prefix: '/api' },
)

if (process.env.ENVIRONMENT == 'production') {
} else {
    fastify.register(fastifyStatic, {
        root: path.resolve('./../client/dist'),
        prefix: '/public', // optional: default '/'
        constraints: {},
    })

    childProcess.exec('npm run build', { cwd: '../client' })

    routes.forEach(route => {
        fastify.get(route.path, (req, res) => {
            const rawHtml = fs.readFileSync(
                path.resolve('./../client/dist/index.html'),
            )
            const html = htmlParser.parse(rawHtml.toString())
            const htmlHead = html.querySelector('head')
            const meta = route.metadata?.(req.routerPath, '')

            if (meta) {
                meta.forEach(metadata => {
                    const idx = metadata.targets.findIndex(
                        data => data.target == null,
                    )
                    htmlHead?.appendChild(
                        htmlParser.parse(
                            `<${metadata.tagName} ${metadata.targets
                                .filter((_, index) => index != idx)
                                .map(
                                    entry => `${entry.target}="${entry.value}"`,
                                )
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
}
// Declare a route

// Run the server!
fastify.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
})

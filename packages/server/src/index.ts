import { testGet, testPost } from './controllers/controllerTest'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fs from 'fs'
import path from 'path'
import { Metadata, routingFactory } from '@local/types'

const defaultMeta: Metadata = {}

export const routes = routingFactory({
    '/': () => defaultMeta,
    '/about': () => defaultMeta,
    '/about/me': () => defaultMeta,
    '/about/product_number_one': () => defaultMeta,
    '/about/:productId': (path, queryString) => {
        return {}
    },
})

const fastify = Fastify({ logger: true })

fastify.register(fastifyStatic, {
    root: path.resolve('./../client/dist'),
    prefix: '/public', // optional: default '/'
    constraints: {},
})

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

fastify.get('/', (req, res) => {
    console.log(path.resolve('./../client/dist/index.html'))
    res.header('Content-Type', 'text/html')
    return fs.readFileSync(path.resolve('./../client/dist/index.html'))
})

// Declare a route

// Run the server!
fastify.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
    // Server is now listening on ${address}
})

console.log('>>>', routes.routes?.[0])

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var controllerTest_1 = require("./controllers/controllerTest");
var fastify_1 = __importDefault(require("fastify"));
var static_1 = __importDefault(require("@fastify/static"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var fastify = (0, fastify_1.default)({ logger: true });
fastify.register(static_1.default, {
    root: path_1.default.resolve("./../client/dist"),
    prefix: "/public",
    constraints: {},
});
fastify.setErrorHandler(function (error, request, reply) {
    if (error instanceof fastify_1.default.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        // Log error
        // this.log.error(error);
        // Send error response
    }
    else {
        // fastify will use parent error handler to handle this
    }
    reply.status(500).send({ ok: false });
});
fastify.register(function (fastify, opts, done) {
    fastify.get("/", controllerTest_1.testGet);
    fastify.post("/", controllerTest_1.testPost);
    done();
}, { prefix: "/api" });
fastify.get("/", function (req, res) {
    console.log(path_1.default.resolve("./../client/dist/index.html"));
    res.header("Content-Type", "text/html");
    return fs_1.default.readFileSync(path_1.default.resolve("./../client/dist/index.html"));
});
// Declare a route
// Run the server!
fastify.listen({ port: 8080, host: "0.0.0.0" }, function (err, address) {
    if (err)
        throw err;
    // Server is now listening on ${address}
});

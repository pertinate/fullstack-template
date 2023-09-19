import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../util/prisma";

export const testGet = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    return await prisma.test.findMany();
  } catch (error) {
    console.error(error);
    reply.code(500).send();
  }
};

export const testPost = async (
  req: FastifyRequest<{ Body: { text: string } }>,
  reply: FastifyReply
) => {
  try {
    return await prisma.test.create({
      data: {
        text: req.body.text,
      },
    });
  } catch (error) {
    console.error(error);
    reply.code(500).send();
  }
};

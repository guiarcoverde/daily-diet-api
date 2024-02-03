import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId
  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
  const user = await knex('users').where({ sessionId }).first()

  request.user = user
}

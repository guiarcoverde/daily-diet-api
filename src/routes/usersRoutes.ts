import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function postUserRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 60 * 24 * 7,
      })
    }

    const { name, email } = createUserBodySchema.parse(request.body)

    const userByEmail = await knex('users').where({ email }).first()

    if (userByEmail) {
      return reply.status(401).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      sessionId,
    })

    return reply.status(201).send({ message: 'User added successfully' })
  })
}

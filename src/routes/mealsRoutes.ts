import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exists'

export async function mealRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealSchema = z.object({
        mealName: z.string(),
        mealDescription: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { mealName, mealDescription, isOnDiet, date } =
        createMealSchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        mealName,
        mealDescription,
        isOnDiet,
        mealDate: date.getTime(),
        userId: request.user?.id,
      })

      return reply.status(201).send({ message: 'Meal added!' })
    },
  )

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .select('*')
        .where('userId', request.user?.id)

      return reply.send({ meals })
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals').select('*').where('id', id).first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found!' })
      }

      const meals = await knex('meals')
        .select('*')
        .where({ userId: request.user?.id, id })

      return reply.send({ meals })
    },
  )
  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals').select('*').where('id', id).first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found!' })
      }

      await knex('meals')
        .select('*')
        .where({ userId: request.user?.id, id })
        .delete()

      return reply.status(204).send({ message: 'Meal successfully deleted!' })
    },
  )

  app.patch(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const updateMealSchema = z.object({
        mealName: z.string(),
        mealDescription: z.string(),
        date: z.coerce.date(),
      })

      const { mealName, mealDescription, date } = updateMealSchema.parse(
        request.body,
      )

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals').select('*').where('id', id).first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found!' })
      }

      await knex('meals')
        .select()
        .where({ userId: request.user?.id, id })
        .update({
          mealName,
          mealDescription,
          mealDate: date.getTime(),
        })

      return reply.status(201).send({
        message: 'Meal Successfully updated',
      })
    },
  )

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const onDietMeals = await knex('meals')
        .count('isOnDiet as Diet Meals')
        .where({ isOnDiet: true, userId: request.user?.id })

      const cheatMeals = await knex('meals')
        .count('isOnDiet as Cheat Meals')
        .where({ isOnDiet: false, userId: request.user?.id })

      const totalMeals = await knex('meals').where({ userId: request.user?.id })

      const { bestOnDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.isOnDiet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }
          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return reply.status(200).send({
        totalMeals: totalMeals.length,
        onDietMeals: onDietMeals.length,
        cheatMeals: cheatMeals.length,
        bestOnDietSequence,
      })
    },
  )
}

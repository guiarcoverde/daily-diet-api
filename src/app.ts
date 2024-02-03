import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { postUserRoute } from './routes/usersRoutes'
import { mealRoutes } from './routes/mealsRoutes'

export const app = fastify()

app.register(cookie)
app.register(postUserRoute, {
  prefix: 'users',
})
app.register(mealRoutes, {
  prefix: 'meals',
})

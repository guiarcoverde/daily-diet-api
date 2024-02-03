import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      sessionId: string
      email: string
      created_at: string
      updated_at: string
    }

    meals: {
      id: string
      userId: string
      mealName: string
      mealDescription: string
      isOnDiet: boolean
      mealDate: number
      created_at: string
      updated_at: string
    }
  }
}

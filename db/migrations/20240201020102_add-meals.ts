import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary
    table.string('userId').references('users.id').notNullable()
    table.string('mealName').notNullable()
    table.string('mealDescription').notNullable()
    table.boolean('isOnDiet').notNullable()
    table.date('mealDate').notNullable()
    table.timestamps(true, true)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}


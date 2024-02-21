import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('username', 255).notNullable().unique()
      table.string('role', 255).notNullable().defaultTo('user')
      table.boolean('banned').notNullable().defaultTo(false)
      table.boolean('online').notNullable().defaultTo(false)
      // ISO-639 language code
      table.string('language').notNullable().defaultTo('en')
      table.boolean('shadow_banned').notNullable().defaultTo(false)
      table.boolean('staff_user').notNullable().defaultTo(false)
      table.boolean('dashboard_user').notNullable().defaultTo(false)
      table.string('image').nullable().defaultTo(null)
      table.string('password').notNullable()
      table.string('remember_me_token').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

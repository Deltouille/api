import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.timestamp('birthdate', { useTz: true }).notNullable()
      table.string('gender').notNullable()
      table.string('self_introduction').nullable().defaultTo(null)
      table.string('audio_introduction').nullable().defaultTo(null)
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE') // delete profile when user is deleted

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

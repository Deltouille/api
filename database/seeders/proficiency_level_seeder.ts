import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import ProficiencyLevel from '#models/proficiency_level'

export default class extends BaseSeeder {
  async run() {
    await ProficiencyLevel.createMany([
      {
        name: 'BEGINNER',
        createdAt: DateTime.now(),
      },
      {
        name: 'ELEMENTARY',
        createdAt: DateTime.now(),
      },
      {
        name: 'INTERMEDIATE',
        createdAt: DateTime.now(),
      },
      {
        name: 'UPPER_INTERMEDIATE',
        createdAt: DateTime.now(),
      },
      {
        name: 'PROFICIENT',
        createdAt: DateTime.now(),
      },
    ])
  }
}

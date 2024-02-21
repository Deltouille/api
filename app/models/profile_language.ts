import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Profile from '#models/profile'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Language from '#models/language'
import ProficiencyLevel from '#models/proficiency_level'

export default class ProfileLanguage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({
    serializeAs: null,
  })
  declare profileId: number

  @column({ serializeAs: null })
  declare languageId: number

  @column({ serializeAs: null })
  declare levelId: number

  @column()
  declare isNative: boolean

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>

  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @belongsTo(() => ProficiencyLevel, {
    foreignKey: 'levelId',
  })
  declare level: BelongsTo<typeof ProficiencyLevel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import Location from '#models/location'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import ProfileLanguage from '#models/profile_language'
import Language from '#models/language'

export default class Profile extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column.dateTime()
  declare birthdate: DateTime

  @column()
  declare gender: string

  @column()
  declare selfIntroduction: string | null

  @column()
  declare audioIntroduction: string | null

  @column({ serializeAs: null })
  declare userId: number

  @hasOne(() => Location)
  declare location: HasOne<typeof Location>

  @hasMany(() => ProfileLanguage)
  declare profileLanguages: HasMany<typeof ProfileLanguage>

  @manyToMany(() => Language, {
    pivotTable: 'target_language_profile',
  })
  declare targetLanguages: ManyToMany<typeof Language>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(profile: Profile) {
    profile.uuid = uuidv4()
  }
}

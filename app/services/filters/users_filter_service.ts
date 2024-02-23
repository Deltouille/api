import User from '#models/user'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { GenderEnum } from '#constants/gender_enum'
import logger from '@adonisjs/core/services/logger'

export class UsersFilterService {
  async filterByAge(value: any, query: ModelQueryBuilderContract<any, User>) {
    const [minAge, maxAge] = value.map(Number)

    const minDateOfBirth = new Date()
    minDateOfBirth.setFullYear(minDateOfBirth.getFullYear() - maxAge - 1)

    const maxDateOfBirth = new Date()
    maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - minAge)

    return query.whereHas('profile', (builder) => {
      builder.whereBetween('birthDate', [
        minDateOfBirth.toISOString(),
        maxDateOfBirth.toISOString(),
      ])
    })
  }

  async filterNewUsers(value: any, query: ModelQueryBuilderContract<any, User>) {
    if (value === 'true') {
      return query.where('createdAt', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    }
  }

  async filterByGender(value: any, query: ModelQueryBuilderContract<any, User>) {
    const isGenderEnumValue = Object.values(GenderEnum).includes(value as GenderEnum)

    if (!isGenderEnumValue) {
      logger.error(`${value} is not a valid gender value.`)
      throw new Error(`${value} is not a valid gender value`)
    }

    return query.whereHas('profile', (builder) => {
      builder.where('gender', value)
    })
  }

  async filterByNativeLanguage(value: any, query: ModelQueryBuilderContract<any, User>) {
    return query.where('nativeLanguage', value)
  }

  async filterByTargetLanguage(value: any, query: ModelQueryBuilderContract<any, User>) {
    return query.where('targetLanguage', value)
  }

  async filterByLevel(value: any, query: ModelQueryBuilderContract<any, User>) {
    const levelRange = value.split(',')
    return query.whereBetween('level', levelRange)
  }

  async filterByRegion(value: any, query: ModelQueryBuilderContract<any, User>) {
    return query.whereHas('profile', (profileQuery) => {
      // builder.where('gender', value)
      profileQuery.whereHas('location', (locationQuery) => {
        locationQuery.where('country', value)
      })
    })
  }

  async filterByCity(value: any, query: ModelQueryBuilderContract<any, User>) {
    return query.whereLike('city', `%${value}%`)
  }
}

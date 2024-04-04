import User from '#models/user'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { GenderEnum } from '#constants/gender_enum'
import logger from '@adonisjs/core/services/logger'
import { LocationService } from '#services/locations_service'
import { inject } from '@adonisjs/core'

@inject()
export class UsersFilterService {
  constructor(private locationService: LocationService) {}

  async filterByAge(ageRange: any, query: ModelQueryBuilderContract<any, User>) {
    const [minAge, maxAge] = ageRange.map(Number)

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

  async filterNewUsers(newUsers: any, query: ModelQueryBuilderContract<any, User>) {
    if (newUsers === 'true') {
      return query.where('createdAt', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    }
  }

  async filterByGender(gender: any, query: ModelQueryBuilderContract<any, User>) {
    const isGenderEnumValue = Object.values(GenderEnum).includes(gender as GenderEnum)

    if (!isGenderEnumValue) {
      logger.error(`${gender} is not a valid gender value.`)
      throw new Error(`${gender} is not a valid gender value`)
    }

    return query.whereHas('profile', (builder) => {
      builder.where('gender', gender)
    })
  }

  async filterByNativeLanguage(nativeLanguageName: string) {
    logger.debug('Filtering by native language', nativeLanguageName)

    return await User.query()
      .whereHas('profile', (profileBuilder) => {
        profileBuilder
          .whereHas('profileLanguages', (languageBuilder) => {
            languageBuilder.where('isNative', 1).whereHas('language', (languageQuery: any) => {
              languageQuery.where('name', nativeLanguageName) // Replace argumentName with your argument variable name
            })
          })
          .preload('profileLanguages')
      })
      .preload('profile', (profileQuery) => {
        profileQuery.preload('profileLanguages', (languageQuery) => {
          languageQuery.preload('language').preload('level')
        })
      })
      .exec()
  }

  async filterByTargetLanguage(targetLanguageName: any) {
    logger.debug('Filtering by native language', targetLanguageName)

    return await User.query()
      .whereHas('profile', (profileBuilder) => {
        profileBuilder
          .whereHas('profileLanguages', (languageBuilder) => {
            languageBuilder.where('isNative', 0).whereHas('language', (languageQuery: any) => {
              languageQuery.where('name', targetLanguageName)
            })
          })
          .preload('profileLanguages')
      })
      .preload('profile', (profileQuery) => {
        profileQuery.preload('profileLanguages', (languageQuery: any) => {
          languageQuery.preload('language').preload('level')
        })
      })
      .exec()
  }

  async filterByLevel(level: any, query: ModelQueryBuilderContract<any, User>) {
    const levelRange = level.split(',')
    return query.whereBetween('level', levelRange)
  }

  async filterByRegion(value: any, query: ModelQueryBuilderContract<any, User>) {
    return query.whereHas('profile', (profileQuery) => {
      profileQuery.whereHas('location', (locationQuery: any) => {
        locationQuery.where('country', value)
      })
    })
  }

  async filterByCity(city: string, query: ModelQueryBuilderContract<any, User>) {
    try {
      const cityCoordinates: any = await this.locationService.getCityFromCoordinates(city)

      // Validate city coordinates are available
      if (!cityCoordinates) {
        logger.warn(`Invalid city: ${city}`)
        throw new Error(`Invalid city ${city}`)
      }

      // Calculate query radius in meters based on 10km distance
      const queryRadius: number = await this.locationService.calculateQueryRadius(10)

      // Build the MariaDB query using ST_Distance
      return await query.whereHas('profile', (profileQuery) => {
        profileQuery.whereHas('location', (locationQuery: any) => {
          // Assuming location contains latitude and longitude fields
          locationQuery.whereRaw(
            `
          6371 * acos(cos(radians(:latitude)) * cos(radians(latitude)) * cos(radians(longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(latitude))) <= :radius
        `,
            {
              latitude: cityCoordinates.latitude,
              longitude: cityCoordinates.longitude,
              radius: queryRadius,
            }
          )
        })
      })
    } catch (error) {
      logger.error(`Error searching users by city: ${city}`, error.message)
    }
  }
}

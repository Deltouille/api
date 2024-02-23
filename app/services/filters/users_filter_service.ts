import User from '#models/user'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { GenderEnum } from '#constants/gender_enum'
import logger from '@adonisjs/core/services/logger'
import Env from '#start/env'

export class UsersFilterService {
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

  async filterByNativeLanguage(nativeLanguage: any, query: ModelQueryBuilderContract<any, User>) {
    return query.where('nativeLanguage', nativeLanguage)
  }

  async filterByTargetLanguage(targetLanguage: any, query: ModelQueryBuilderContract<any, User>) {
    return query.where('targetLanguage', targetLanguage)
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
    // Use Google Maps Geocoding API to get city coordinates
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${Env.get('GOOGLE_MAPS_API_KEY')}`
    )
    const data: any = await response.json()

    if (data.status === 'OK') {
      const { lat, lng } = data.results[0].geometry.location

      // Filter users based on proximity to the city coordinates
      return query.whereHas('profile', (profileQuery) => {
        const earthRadius = 6371e3 // Earth radius in meters
        profileQuery
          .selectRaw(
            `acos(sin(radians(?)) * sin(radians(location.latitude)) + cos(radians(?)) * cos(radians(location.latitude)) * cos(radians(location.longitude) - radians(?))) * ? as distance`,
            [lat, lat, lng, earthRadius]
          )
          .orderBy('distance', 'asc')
          .whereRaw(`distance < ?`, [10000]) // Filter within 10km radius (adjust as needed)
      })
    } else {
      logger.warn(`Error fetching coordinates for city: ${city}`)
    }
  }
}

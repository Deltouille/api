import Env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export class LocationService {
  async getCityFromCoordinates(city: string) {
    try {
      // Use Google Maps Geocoding API to get city coordinates
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${Env.get('GOOGLE_MAPS_API_KEY')}`
      )
      const data: any = await response.json()
      if (data.status === 'OK') {
        const location = data.results[0].geometry.location
        return { latitude: location.lat, longitude: location.lng }
      } else {
        logger.warn(`Error fetching city coordinates for '${city}':`, data.error_message)
        throw new Error(`Error fetching city coordinates for '${city}': ${data.error_message}`)
      }
    } catch (error) {
      logger.error(`Error fetching city coordinates for '${city}':`, error)
      // Handle error (return default location, log, etc.)
    }

    return null
  }

  async calculateQueryRadius(distanceInKm: number) {
    // Earth's radius in kilometers
    const earthRadius = 6371

    // Convert distance to meters
    const distanceInMeters = distanceInKm * 1000

    // Calculate radius in degrees using the arc formula
    return distanceInMeters / (earthRadius * Math.PI)
  }

  async createPointGeom(latitude: number, longitude: number) {
    return `POINT(${longitude} ${latitude})`
  }
}

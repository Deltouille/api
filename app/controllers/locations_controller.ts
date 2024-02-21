import type { HttpContext } from '@adonisjs/core/http'
import Location from '#models/location'

export default class LocationsController {
  async create({ auth, request, response, logger }: HttpContext) {
    const user = auth.user

    if (auth.isAuthenticated && user) {
      if (request.hasBody()) {
        try {
          const location: Location = new Location()
          const { country, latitude, longitude } = request.body()

          location.fill({
            country,
            latitude,
            longitude,
          })
          await location.save()

          // Associate the location with the profile
          await user.profile.related('location').save(location)

          return response.created(location)
        } catch (error) {
          logger.error({
            status: 502,
            message: error,
          })
          return response.badGateway({
            status: 502,
            message: 'Something went wrong, could not create the location resource.',
          })
        }
      } else {
        logger.error({
          status: 400,
          message: 'Empty body',
        })
        return response.badRequest({
          status: 400,
          message: 'Empty body',
        })
      }
    } else {
      return response.unauthorized({
        status: 404,
        message: `User ${user} not found`,
      })
    }
  }

  async update({ auth, request, response, logger }: HttpContext) {
    const user = auth.user

    if (user) {
      if (request.hasBody()) {
        try {
          const locationId = user.profile?.location?.id
          const location = await Location.findOrFail(locationId)

          const { country, latitude, longitude } = request.body()

          location.merge({
            country,
            latitude,
            longitude,
          })
          await location.save()

          return response.created(location)
        } catch (error) {
          logger.error({
            status: 422,
            message: 'Could not update location',
            error: error,
          })
          return response.badRequest()
        }
      }
    }

    logger.info(user?.profile.location)
  }
}

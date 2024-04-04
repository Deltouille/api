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

          return response.created({
            status: 201,
            success: true,
            message: 'Your profile has been successfully created',
          })
        } catch (error) {
          if (error instanceof Error) {
            logger.error({
              status: 502,
              success: false,
              message: error,
            })
            return response.badGateway({
              status: 502,
              success: false,
              message: 'Something went wrong, could not create the location resource.',
            })
          }
        }
      } else {
        logger.error({
          status: 400,
          success: false,
          message: 'Empty body',
        })
        return response.badRequest({
          status: 400,
          success: false,
          message: 'Empty body',
        })
      }
    } else {
      logger.info({
        status: 401,
        success: false,
        message: `User ${user?.uuid} is not allowed to perform this action`,
      })
      return response.unauthorized({
        status: 401,
        success: false,
        message: `You are not allowed to perform this action`,
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

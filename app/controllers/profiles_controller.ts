import type { HttpContext } from '@adonisjs/core/http'
import Profile from '#models/profile'
import User from '#models/user'

export default class ProfilesController {
  async index({ auth, response, logger }: HttpContext) {
    const user: User = await auth.authenticate()

    if (user.profile) {
      return response.ok({ status: 200, success: true, data: user.profile })
    } else {
      logger.info('User does not have a profile')
      return response.notFound({ status: 404, success: false, message: 'Profile not found' })
    }
  }

  async create({ auth, request, response, logger }: HttpContext) {
    const user: User = await auth.authenticate()
    const profile: Profile = new Profile()

    if (user) {
      try {
        if (request.hasBody()) {
          const { firstName, lastName, birthdate, gender } = request.body()

          profile.fill({
            firstName,
            lastName,
            birthdate,
            gender,
          })
          await profile.save()

          // Associate the profile with the user
          await user?.related('profile').save(profile)

          logger.info({
            status: 201,
            success: true,
            message: `Profile ${profile.uuid} created successfully`,
          })
          return response.created({ status: 201, success: true, data: profile })
        } else {
          logger.info({ status: 400, success: false, message: 'No data provided' })
          return response.badRequest({ status: 400, success: false, message: 'No data provided' })
        }
      } catch (error) {
        if (error instanceof Error) {
          logger.error({
            status: 422,
            success: false,
            message: error.message,
          })
          return response.unprocessableEntity({
            status: 422,
            success: false,
            message: 'Could not created profile',
          })
        }
      }
    } else {
      logger.info({ status: 401, success: false, message: 'Unauthorized' })
      return response.unauthorized({ status: 401, success: false, message: 'Unauthorized' })
    }
  }

  async delete({ params, response, logger }: HttpContext) {
    try {
      const profile: Profile = await Profile.findOrFail(params.uuid)
      await profile.delete()

      return response.accepted({
        success: true,
        message: `The profile ${profile.uuid} has been successfully deleted.`,
      })
    } catch (error) {
      if (error instanceof Error) {
        logger.error({
          status: 422,
          success: false,
          message: error.message,
        })
        return response.unprocessableEntity({
          status: 422,
          success: false,
          message: 'Could not delete profile',
        })
      }
    }
  }
}

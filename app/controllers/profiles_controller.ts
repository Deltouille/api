import type { HttpContext } from '@adonisjs/core/http'
import Profile from '#models/profile'
import User from '#models/user'

export default class ProfilesController {
  async index({ auth, response }: HttpContext) {
    const user: User = await auth.authenticate()

    return response.ok(user.profile)
  }

  async create({ auth, request, response, logger }: HttpContext) {
    const user: User = await auth.authenticate()
    const profile: Profile = new Profile()

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
      }

      return response.created(profile)
    } catch (error) {
      logger.error({
        error: error,
        message: 'Could not created profile',
      })
      return response.unprocessableEntity(profile)
    }
  }
}

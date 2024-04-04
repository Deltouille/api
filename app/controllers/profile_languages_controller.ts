import type { HttpContext } from '@adonisjs/core/http'
import ProfileLanguage from '#models/profile_language'

export default class ProfileLanguagesController {
  async create({ request, response, auth, logger }: HttpContext) {
    const user = auth.user

    if (!user) {
      logger.info({
        status: 401,
        success: false,
        message: 'You are not allowed to perform this action',
      })
      return response.unauthorized({
        status: 401,
        success: false,
        message: 'You are not allowed to perform this action',
      })
    }

    // const { languageId, levelId, isNative } = request.body()

    try {
      const profileLanguages: ProfileLanguage[] = await ProfileLanguage.createMany(
        request.body().languages
      )
      return response.created({ status: 201, success: true, data: profileLanguages })
    } catch (error) {
      if (error instanceof Error) {
        logger.info({
          status: 500,
          success: false,
          message: error.message,
        })
        return response.badRequest({
          status: 500,
          success: false,
          message: error.message,
        })
      }
    }
  }

  async read({ response, auth, logger }: HttpContext) {
    const user = auth.user

    if (!user) {
      logger.info({
        status: 401,
        success: false,
        message: `User ${user!.uuid} is not allowed to perform this action`,
      })
      return response.unauthorized({
        status: 401,
        success: false,
        message: 'You are not allowed to perform this action',
      })
    }

    try {
      const userLanguages = user.profile?.profileLanguages
      return response.ok({ status: 200, success: true, data: userLanguages })
    } catch (error) {
      if (error instanceof Error) {
        logger.info({
          status: 500,
          success: false,
          message: error.message,
        })
        return response.badRequest({
          status: 500,
          success: false,
          message: 'Error fetching user languages',
        })
      }
    }
  }

  async update({}: HttpContext) {}

  async delete({}: HttpContext) {}
}

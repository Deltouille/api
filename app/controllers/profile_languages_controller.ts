import type { HttpContext } from '@adonisjs/core/http'
import ProfileLanguage from '#models/profile_language'

export default class ProfileLanguagesController {
  async create({ request, response, auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized()
    }

    // const { languageId, levelId, isNative } = request.body()

    const profileLanguages: ProfileLanguage[] = await ProfileLanguage.createMany(
      request.body().languages
    )

    return response.created({ profileLanguages })
  }

  async read({ response, auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized()
    }

    const userLanguages = user.profile?.profileLanguages

    return response.ok({ languages: userLanguages })
  }

  async update({}: HttpContext) {}

  async delete({}: HttpContext) {}
}

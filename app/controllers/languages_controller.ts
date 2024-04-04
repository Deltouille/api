import type { HttpContext } from '@adonisjs/core/http'
import Language from '#models/language'

export default class LanguagesController {
  async getLanguages({ response }: HttpContext) {
    try {
      const languages: Language[] = await Language.query().orderBy('name', 'asc')
      return response.ok({ status: 200, success: true, data: languages })
    } catch (error) {
      if (error instanceof Error) {
        return response.badRequest({ status: 500, success: false, error: error.message })
      }
    }
  }
}

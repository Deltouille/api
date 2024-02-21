import type { HttpContext } from '@adonisjs/core/http'
import Language from '#models/language'

export default class LanguagesController {
  async getLanguages({ response }: HttpContext) {
    const languages: Language[] = await Language.query().orderBy('name', 'asc')
    return response.ok(languages)
  }
}

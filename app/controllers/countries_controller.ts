import type { HttpContext } from '@adonisjs/core/http'
import { CountryService } from '#services/countries_service'
import { inject } from '@adonisjs/core'

@inject()
export default class CountriesController {
  constructor(private countryService: CountryService) {}

  async getCountries({ logger, response }: HttpContext) {
    try {
      const countries = await this.countryService.getCountries()
      return response.ok({ status: 200, success: true, data: Object.values(countries) })
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error fetching countries:', error.message)
        return response.badRequest({ status: 500, success: false, message: error.message })
      }
    }
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import { CountryService } from '#services/country_service'
import { inject } from '@adonisjs/core'

@inject()
export default class CountriesController {
  constructor(private countryService: CountryService) {}

  async getCountries({}: HttpContext) {
    return this.countryService.getCountries()
  }
}

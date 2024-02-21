import Env from '#start/env'

export class CountryService {
  async getCountries() {
    const response = await fetch(`${Env.get('REST_COUNTRIES_URL')}/all?fields=name`)
    const data = await response.json()

    if (Array.isArray(data)) {
      return this.sortAlphabetically(data)
    } else {
      throw new Error('Unexpected response structure')
    }
  }

  async sortAlphabetically(data: any[]) {
    const countrySet: Set<string> = new Set<string>()

    data.forEach((countries): void => {
      if (countries) {
        Object.values(countries).forEach((country): void => {
          countrySet.add(country?.common)
        })
      }
    })

    // Convert the set to an array and sort alphabetically
    return { countries: Array.from(countrySet).sort() }
  }
}

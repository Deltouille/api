import Env from '#start/env'

export class CountryService {
  async getCountries() {
    const url = Env.get('REST_COUNTRIES_URL') || 'http://localhost:3333/api/v1'
    const response = await fetch(`${url}/all?fields=name`)
    const data = await response.json()

    if (Array.isArray(data)) {
      return this.sortAlphabetically(data)
    } else {
      throw new Error('Unexpected response structure')
    }
  }

  sortAlphabetically(data: any[]) {
    const countrySet: Set<string> = new Set<string>()

    data.forEach((countries): void => {
      if (countries) {
        Object.values(countries).forEach((country: any): void => {
          countrySet.add(country?.common)
        })
      }
    })

    // Convert the set to an array and sort alphabetically
    return [...countrySet].sort()
  }
}

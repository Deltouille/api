import Env from '#start/env'

export class LanguageService {
  async getLanguages() {
    const response = await fetch(`${Env.get('REST_COUNTRIES_URL')}/all?fields=languages`)
    const data = await response.json()

    if (Array.isArray(data)) {
      return this.sortAlphabetically(data)
    } else {
      throw new Error('Unexpected response structure')
    }
  }

  async sortAlphabetically(data: any) {
    const languageSet: Set<string> = new Set<string>()

    data.forEach((item: { languages: { [key: string]: string } }): void => {
      const languages = item.languages
      if (languages) {
        Object.values(languages).forEach((lang): void => {
          languageSet.add(lang)
        })
      }
    })

    // Convert the set to an array and sort alphabetically
    return Array.from(languageSet).sort()
  }
}

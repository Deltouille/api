import router from '@adonisjs/core/services/router'

const CountriesController = () => import('#controllers/countries_controller')

export default function countryRoutes() {
  router.get('/countries', [CountriesController, 'getCountries'])
}

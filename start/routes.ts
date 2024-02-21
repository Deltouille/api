/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
const LocationsController = () => import('#controllers/locations_controller')
const ProfileLanguagesController = () => import('#controllers/profile_languages_controller')
const RecommendationsController = () => import('#controllers/recommendations_controller')
const LanguagesController = () => import('#controllers/languages_controller')
const CountriesController = () => import('#controllers/countries_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('/register', [AuthController, 'register'])
        router.post('/login', [AuthController, 'login'])
      })
      .prefix('users')

    router
      .group(() => {
        router.get('/', [ProfilesController, 'index'])
        router.post('/', [ProfilesController, 'create'])
        router.post('/location', [LocationsController, 'create'])
        router.patch('/location', [LocationsController, 'update'])

        // Handle profile languages
        router.post('/:userId/languages', [ProfileLanguagesController, 'create'])
        router.get('/:userId/languages', [ProfileLanguagesController, 'read'])
        router.patch('/:userId/languages', [ProfileLanguagesController, 'update'])
        router.delete('/:userId/languages', [ProfileLanguagesController, 'delete'])
      })
      .prefix('profile')
      .use(middleware.auth())

    router.get('/users/recommendations', [RecommendationsController, 'getRecommendedUsers'])
    router.get('/languages', [LanguagesController, 'getLanguages'])
    router.get('/countries', [CountriesController, 'getCountries'])
  })
  .prefix('/api/v1')

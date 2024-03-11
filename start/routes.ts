/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import usersRoutes from '#start/routes/users'
import authRoutes from '#start/routes/auth'
import profileRoutes from '#start/routes/profile'
import recommendationsRoutes from '#start/routes/recommendations'
import languagesRoutes from '#start/routes/languages'
import countryRoutes from '#start/routes/countries'
import uploadRoutes from '#start/routes/uploads'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    authRoutes()
    usersRoutes()
    profileRoutes()
    recommendationsRoutes()
    languagesRoutes()
    countryRoutes()
    uploadRoutes()
  })
  .prefix('/api/v1')

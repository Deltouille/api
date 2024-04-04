import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ProfilesController = () => import('#controllers/profiles_controller')
const ProfileLanguagesController = () => import('#controllers/profile_languages_controller')
const LocationsController = () => import('#controllers/locations_controller')

export default function profileRoutes() {
  router
    .group(() => {
      router.get('/', [ProfilesController, 'index'])
      router.post('/', [ProfilesController, 'create'])
      router.delete('/:uuid', [ProfilesController, 'delete'])
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
}

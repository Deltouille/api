import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UploadsController = () => import('#controllers/uploads_controller')

export default function uploadRoutes() {
  router
    .group(() => {
      router.post('/profile-picture', [UploadsController, 'uploadProfilePicture'])
      router.get('/profile-picture', [UploadsController, 'getProfilePicture'])
    })
    .prefix('/uploads')
    .use(middleware.auth())
}

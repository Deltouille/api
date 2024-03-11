import router from '@adonisjs/core/services/router'

const UploadsController = () => import('#controllers/uploads_controller')

export default function uploadRoutes() {
  router
    .group(() => {
      router.post('/profile-picture', [UploadsController, 'uploadProfilePicture'])
      router.get('/profile-picture', [UploadsController, 'getProfilePicture'])
    })
    .prefix('/uploads')
}

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

export default function usersRoutes() {
  router
    .group(() => {
      router.get('', [UsersController, 'index'])
      router.get('/:uuid', [UsersController, 'show'])
      router.delete('/:uuid', [UsersController, 'destroy'])
      router.get('/find/:username', [UsersController, 'findByUsername'])
    })
    .prefix('/users')
}

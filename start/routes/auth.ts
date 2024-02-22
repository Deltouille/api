import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

export default function authRoutes() {
  router
    .group(() => {
      router.post('/register', [AuthController, 'register'])
      router.post('/login', [AuthController, 'login'])
    })
    .prefix('/auth')
}

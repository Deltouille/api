import router from '@adonisjs/core/services/router'

const LanguagesController = () => import('#controllers/languages_controller')

export default function languagesRoutes() {
  router.get('/languages', [LanguagesController, 'getLanguages'])
}

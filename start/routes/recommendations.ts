import router from '@adonisjs/core/services/router'

const RecommendationsController = () => import('#controllers/recommendations_controller')

export default function recommendationsRoutes() {
  router.get('/users/recommendations', [RecommendationsController, 'getRecommendedUsers'])
}

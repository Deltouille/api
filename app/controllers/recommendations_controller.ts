import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/users_service'
import { RecommendationService } from '#services/recommendations_service'
import { inject } from '@adonisjs/core'
import type { User } from '../types.js'

@inject()
export default class RecommendationsController {
  private userService: UserService
  private recommendationService: RecommendationService

  constructor(userService: UserService, recommendationService: RecommendationService) {
    this.userService = userService
    this.recommendationService = recommendationService
  }

  async getRecommendedUsers({ response, logger }: HttpContext) {
    try {
      let loggedInUser: User | undefined
      const allUsers = await this.userService.getUsers()

      if (allUsers) {
        // @ts-ignore
        loggedInUser = allUsers[0]
      }

      const recommendations = await this.recommendationService.getRecommendations(loggedInUser!)

      return response.ok({ status: 200, success: true, data: recommendations })
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ status: 400, success: false, message: error.message })
        return response.badRequest({
          status: 400,
          success: false,
          message: 'Error getting recommended users',
        })
      }
    }
  }
}

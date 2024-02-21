import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'
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

  async getRecommendedUsers({ response }: HttpContext) {
    let loggedInUser: User | undefined
    const allUsers: User[] = await this.userService.getUsers()

    if (allUsers) {
      loggedInUser = allUsers[0]
    }

    const recommendations = await this.recommendationService.getRecommendations(loggedInUser!)

    return response.ok(recommendations)
  }
}

import { Recommendation, User } from '../types.js'
import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'

@inject()
export class RecommendationService {
  // Assume users is an array of all users in the system
  private users: User[] | null

  constructor(private usersService: UserService) {
    this.users = []
    this.usersService = new UserService()
  }

  async getRecommendations(loggedInUser: User): Promise<Recommendation[]> {
    if (this.users?.length === 0) {
      await this.fetchUsersFromApi()
    }

    const recommendations: Recommendation[] = []

    this.users?.forEach((user) => {
      if (user.id !== loggedInUser.id) {
        const matchScore = this.calculateMatchScore(loggedInUser, user)

        // Exclude non-matching profiles
        if (matchScore !== 0) {
          recommendations.push({ user, matchScore })
        }
      }
    })

    // Sort recommendations by matchScore in descending order
    recommendations.sort((a, b) => b.matchScore - a.matchScore)

    return recommendations
  }

  async fetchUsersFromApi(): Promise<User[] | null> {
    this.users = await this.usersService.getUsers()

    return this.users
  }

  calculateMatchScore(loggedInUser: User, targetUser: User): number {
    let matchScore = 0

    // Check for native language to target language match
    loggedInUser.profile?.targetLanguages.forEach((targetLanguage) => {
      targetUser.profile?.nativeLanguages.forEach((nativeLanguage) => {
        if (targetLanguage.name === nativeLanguage.name) {
          matchScore += 1
        }
      })
    })

    // Check for target language to native language match
    targetUser.profile?.targetLanguages.forEach((targetLanguage) => {
      loggedInUser.profile?.nativeLanguages.forEach((nativeLanguage) => {
        if (targetLanguage.name === nativeLanguage.name) {
          matchScore += 1
        }
      })
    })

    return matchScore
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import { UsersFilterService } from '#services/filters/users_filter_service'
import logger from '@adonisjs/core/services/logger'

@inject()
export default class UsersController {
  constructor(private usersFilterService: UsersFilterService) {}

  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    // Create an empty query object
    let query = User.query().preload('profile', (profileQuery) => {
      profileQuery.preload('location')
    })

    // Check if the request has filters
    const filters = request.qs()

    // Iterate through each filter in the query string
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const value = filters[key]

        // Apply the filter based on the key and value
        switch (key) {
          case 'nativeLanguage':
            try {
              await this.usersFilterService.filterByNativeLanguage(value, query)
            } catch (error) {
              logger.warn(`Invalid nativeLanguage filter format: ${value}`)
            }
            break
          case 'targetLanguage':
            try {
              await this.usersFilterService.filterByTargetLanguage(value, query)
            } catch (error) {
              logger.warn(`Invalid targetLanguage filter format: ${value}`)
            }
            break
          case 'level':
            try {
              await this.usersFilterService.filterByLevel(value, query)
            } catch (error) {
              logger.warn(`Invalid level filter format: ${value}`)
            }
            break
          case 'ageRange':
            try {
              await this.usersFilterService.filterByAge(value, query)
            } catch (error) {
              logger.warn(`Invalid ageRange filter format: ${value}`)
            }
            break
          case 'region':
            try {
              await this.usersFilterService.filterByRegion(value, query)
            } catch (error) {
              logger.warn(`Invalid region filter format: ${value}`)
            }
            break
          case 'city':
            try {
              await this.usersFilterService.filterByCity(value, query)
            } catch (error) {
              logger.warn(`Invalid city filter format: ${value}`)
            }
            break
          case 'gender':
            try {
              await this.usersFilterService.filterByGender(value, query)
            } catch (error) {
              logger.warn(`Invalid newUsers filter format: ${value}`)
            }
            break
          case 'newUsers':
            try {
              await this.usersFilterService.filterNewUsers(value, query)
            } catch (error) {
              logger.warn(`Invalid newUsers filter format: ${value}`)
            }
            break
          default:
            logger.warn(`Unknown filter: ${key}`)
            break
        }
      }
    }

    // Execute the query and filter users based on matching profiles (if applicable)
    const users = await query.exec()

    // Log the final SQL query
    return response.ok(users)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    if (params.uuid) {
      return response.ok(await User.findBy('uuid', params.uuid))
    } else {
      return response.badRequest('Invalid request')
    }
  }

  async findByNativeLanguage({ request }: HttpContext) {
    console.log(request.qs())
  }

  async findByUsername({ params, response }: HttpContext) {
    const username = params.username
    const user = await User.findBy('username', username)
    if (!user) {
      return response.notFound({ status: 404, message: 'User not found' })
    }
    return response.ok(user)
  }

  /**
   * Edit individual record
   */
  // async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}

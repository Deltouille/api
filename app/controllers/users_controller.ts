import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import { UsersFilterService } from '#services/filters/users_filter_service'

@inject()
export default class UsersController {
  constructor(private usersFilterService: UsersFilterService) {}

  /**
   * Display a list of resource
   */
  async index({ request, response, logger }: HttpContext) {
    try {
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
                const filteredUsers = await this.usersFilterService.filterByNativeLanguage(value)
                return response.ok(filteredUsers)
              } catch (error) {
                logger.error(`Invalid nativeLanguage filter format: ${value}`)
              }
              break
            case 'targetLanguage':
              try {
                const filteredUsers = await this.usersFilterService.filterByTargetLanguage(value)
                return response.ok(filteredUsers)
              } catch (error) {
                logger.error(`Invalid targetLanguage filter format: ${value}`)
              }
              break
            case 'level':
              try {
                const filteredUsers = await this.usersFilterService.filterByLevel(value, query)
                return response.ok(filteredUsers)
              } catch (error) {
                logger.error(`Invalid level filter format: ${value}`)
              }
              break
            case 'ageRange':
              try {
                const filteredUsers = await this.usersFilterService.filterByAge(value, query)
                return response.ok(filteredUsers)
              } catch (error) {
                logger.error(`Invalid ageRange filter format: ${value}`)
              }
              break
            case 'region':
              try {
                const filteredUsers = await this.usersFilterService.filterByRegion(value, query)
                return response.ok(filteredUsers)
              } catch (error) {
                logger.error(`Invalid region filter format: ${value}`)
              }
              break
            case 'city':
              try {
                const filteredUsers = await this.usersFilterService.filterByCity(value, query)
                return response.ok(filteredUsers)
              } catch (error) {
                logger.error({
                  message: `Invalid city filter format: ${value}`,
                  error: error.message,
                })
              }
              break
            case 'gender':
              try {
                const filteredUsers = await this.usersFilterService.filterByGender(value, query)
                return response.ok(filteredUsers)
              } catch (error) {
                logger.error(`Invalid newUsers filter format: ${value}`)
              }
              break
            case 'newUsers':
              try {
                const filteredUsers = await this.usersFilterService.filterNewUsers(value, query)
                return response.ok(filteredUsers)
              } catch (error) {
                logger.error(`Invalid newUsers filter format: ${value}`)
              }
              break
            default:
              logger.error(`Unknown filter: ${key}`)
              break
          }
        }
      }

      // Execute the query and filter users based on matching profiles (if applicable)
      const users: User[] = await query.exec()
      logger.info({
        status: 200,
        success: true,
        data: users,
        message: 'Users fetched successfully',
      })
      return response.ok({
        status: 200,
        success: true,
        message: 'Users fetched successfully',
        data: users,
      })
    } catch (error) {
      if (error instanceof Error) {
        logger.error({
          status: 500,
          success: false,
          message: 'Error fetching users',
          error: error.message,
        })
        return response.internalServerError({
          status: 500,
          success: false,
          message: 'Error fetching users',
        })
      }
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response, logger }: HttpContext) {
    if (params.uuid) {
      const user = await User.findBy('uuid', params.uuid)

      logger.info({ status: 200, success: true, data: user })
      return response.ok({ status: 200, success: true, data: user })
    } else {
      logger.error({ status: 400, success: false, message: 'Invalid request' })
      return response.badRequest('Invalid request')
    }
  }

  async findByNativeLanguage({ request }: HttpContext) {
    console.log(request.qs())
  }

  async findByUsername({ params, response, logger }: HttpContext) {
    try {
      const username = params.username
      const user = await User.findBy('username', username)
      if (!user) {
        logger.error({ status: 404, success: false, message: 'User not found' })
        return response.notFound({ status: 404, success: false, message: 'User not found' })
      }

      logger.info({ status: 200, success: true, data: user })
      return response.ok({ status: 200, success: true, data: user })
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ status: 500, success: false, error: error.message })
        return response.internalServerError({
          status: 500,
          success: false,
          message: 'Error fetching user',
        })
      }
    }
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
  async destroy({ params, response, logger }: HttpContext) {
    try {
      const user = await User.findByOrFail('uuid', params.uuid)
      const uuid = user.uuid
      await user.delete()

      return response.ok({
        status: 204,
        success: true,
        message: `User ${uuid} deleted successfully`,
      })
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ status: 404, success: false, message: error.message })
        return response.notFound({
          status: 404,
          success: false,
          message: `User ${params.uuid} not found`,
        })
      }
    }
  }
}

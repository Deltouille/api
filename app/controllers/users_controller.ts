import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    // Create an empty query object
    let query = User.query().preload('profile')

    // Check if the request has filters
    const filters = request.qs()

    // Iterate through each filter in the query string
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const value = filters[key]

        // Apply the filter based on the key and value
        switch (key) {
          case 'nativeLanguage':
            query = query.where('nativeLanguage', value)
            break
          case 'targetLanguage':
            query = query.where('targetLanguage', value)
            break
          case 'level':
            // Example for range filter
            const levelRange = value.split(',')
            query = query.whereBetween('level', levelRange)
            break
          case 'ageRange':
            try {
              const ageRange = value.split(',')
              query = query.whereBetween('age', ageRange)
            } catch (error) {
              console.warn(`Invalid ageRange filter format: ${value}`)
            }
            break
          case 'region':
            query = query.whereLike('region', `%${value}%`)
            break
          case 'city':
            query = query.whereLike('city', `%${value}%`)
            break
          case 'gender':
            query = query.whereHas('profile', (builder) => {
              builder.where('gender', value)
            })
            break
          case 'newUsers':
            if (value === 'true') {
              query = query.where('createdAt', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            }
            break
          // Add more cases for other filters
          default:
            console.warn(`Unknown filter: ${key}`)
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

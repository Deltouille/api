import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    // Check if the request has filters
    if (Object.keys(request.qs()).length > 0) {
      // Find users corresponding to the filters
      console.log(request.qs())
      // TODO: Implement the logic to filter users
      return response.ok(await User.all())
    } else {
      return response.ok(await User.all())
    }
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

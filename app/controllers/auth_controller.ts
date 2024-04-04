import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator } from '#validators/user'
import User from '#models/user'
import { errors } from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async register({ request, response, logger }: HttpContext) {
    const data = request.all()
    try {
      const payload = await createUserValidator.validate(data)
      const user: User = await User.create(payload)

      return response.created({
        user: user,
        success: true,
        status: 201,
        message: `User ${user.uuid} created successfully.`,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        logger.error(error.messages)
        return response.badRequest({
          status: 400,
          success: false,
          errors: error.messages,
        })
      }
    }
  }

  async login({ request, response, logger }: HttpContext) {
    logger.debug({ request: request.all() })
    const { email, password } = request.only(['email', 'password'])

    try {
      const user: User | null = await User.findBy('email', email)

      if (!user) {
        response.abort('Invalid credentials')
      }

      const isValidPassword = await hash.verify(user!.password, password)

      if (isValidPassword) {
        const token = await User.accessTokens.create(user!)
        logger.debug(`User ${user!.uuid} successfully logged-in.`)
        return response.ok({
          status: 200,
          success: true,
          message: `User ${user!.uuid} successfully logged-in.`,
          token,
        })
      } else {
        return response.badRequest({
          status: 200,
          success: false,
          message: `Invalid credentials for user ${email}`,
        })
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        logger.error(error)
        return response.badRequest({
          error: {
            success: false,
            message: 'Invalid credentials.',
            error: error.message,
            status: 400,
          },
        })
      }
    }
  }
}

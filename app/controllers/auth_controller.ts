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

      return response.created(user)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        logger.error(error.messages)
        return response.badRequest()
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

      await hash.verify(user!.password, password)
      const token = await User.accessTokens.create(user!)

      return response.ok(token)
    } catch (error) {
      logger.error(error)
      return response.badRequest({
        error: {
          message: 'User with provided credentials could not be found',
          context: error,
          status: 400,
        },
      })
    }
  }
}

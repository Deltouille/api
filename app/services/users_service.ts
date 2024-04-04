import Env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export class UserService {
  async getUsers() {
    const env: string | undefined = process.env.NODE_ENV

    switch (env) {
      case 'development':
        return fetch(`${Env.get('MOCK_SERVER_URL')}/users`)
          .then((response: Response) => response.json())
          .then((users) => users)
      case 'production':
        logger.error({
          message: 'Production not supported yet',
          statusCode: 501,
          data: { env },
        })
        throw new Error('Production not supported yet')
      default:
        logger.error({
          message: 'Unsupported environment',
          statusCode: 501,
          data: { env },
        })
        throw new Error('Unsupported environment')
    }
  }
}

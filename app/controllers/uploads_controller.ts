import type { HttpContext } from '@adonisjs/core/http'
import { minioClient } from '#config/drive'
import Env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export default class UploadsController {
  async uploadProfilePicture({ response }: HttpContext) {
    // File to upload
    const sourceFile: string = 'uploads/img.png'

    // Destination bucket
    const bucket = Env.get('S3_BUCKET') || ''

    // Destination object name
    const destinationObject: string = 'img.png'

    // Check if the bucket exists
    // If it doesn't, create it
    const exists = await minioClient.bucketExists(bucket)
    if (exists) {
      logger.warn('Bucket ' + bucket + ' exists.')
    } else {
      await minioClient.makeBucket(bucket, 'us-east-1')
      logger.info('Bucket ' + bucket + ` created in ${Env.get('S3_REGION')}.`)
    }

    // Set the object metadata
    const metaData = {
      'Content-Type': 'multipart/form-data',
    }

    // Upload the file with fPutObject
    // If an object with the same name exists,
    // it is updated with new data
    await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)

    logger.info(`File ${sourceFile} uploaded as object ${destinationObject} in bucket ${bucket}`)

    return response.created({
      message: 'File uploaded successfully',
      status: 201,
      file: {
        name: destinationObject,
        bucket: bucket,
      },
    })
  }

  async getProfilePicture({ response }: HttpContext) {
    const objectName = 'img.png'
    const filePath = 'uploads/img.png'

    await minioClient.fGetObject(Env.get('S3_BUCKET'), objectName, filePath)

    return response.ok({
      message: 'File downloaded successfully',
      status: 201,
      file: {
        name: objectName,
        filePath: filePath,
      },
    })
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import { minioClient } from '#config/drive'
import Env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import User from '#models/user'

export default class UploadsController {
  async uploadProfilePicture({ request, response, auth }: HttpContext) {
    // File to upload
    const imageFile = request.file('profile_picture')

    // Validate the file (size, type, etc.)
    if (!imageFile) {
      return response.badRequest({ message: 'No image file uploaded' })
    }

    // Generate a unique filename with an extension using a secure method (e.g., UUID or cryptographic hash)
    const uniqueFilename = crypto.randomUUID() + '.' + imageFile.extname
    const filePath = imageFile.tmpPath

    // Destination bucket
    const bucket = Env.get('S3_BUCKET') || ''

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
      'Content-Type': imageFile.headers['content-type'] || 'image/png',
    }

    const uploadedProfilePicture = await minioClient.fPutObject(
      bucket,
      uniqueFilename,
      filePath || '',
      metaData
    )

    // Set the user's profile picture to the uploaded file
    const currentUser = auth.user as User
    currentUser.image = uniqueFilename
    await currentUser.save()

    return response.created({
      status: 201,
      message: 'File uploaded successfully',
      file: {
        etag: uploadedProfilePicture.etag,
        versionId: uploadedProfilePicture.versionId,
        name: uniqueFilename,
        filePath: filePath,
      },
    })
  }

  async getProfilePicture({ response, auth }: HttpContext) {
    // Retrieve user data, including profilePictureFilename
    const currentUser = auth.user as User
    const objectName = currentUser.image || ''

    // Check if the object exists in the bucket
    const objectStat = await minioClient.statObject(Env.get('S3_BUCKET'), objectName)
    if (!objectStat) {
      return response.notFound({ message: 'Profile picture not found' })
    }

    // Generate a pre-signed URL for temporary access
    const presignedUrl = await minioClient.presignedGetObject(
      Env.get('S3_BUCKET'),
      objectName,
      // Set a reasonable expiration time (e.g., 60 seconds)
      60
    )

    return response.ok({
      message: 'Profile picture retrieved successfully',
      url: presignedUrl,
    })
  }
}

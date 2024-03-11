import * as Minio from 'minio'
import Env from '#start/env'

export const minioClient = new Minio.Client({
  endPoint: Env.get('S3_ENDPOINT_URL') || '',
  port: Env.get('S3_ENDPOINT_PORT') || 9000,
  useSSL: false,
  accessKey: Env.get('S3_KEY') || '',
  secretKey: Env.get('S3_SECRET') || '',
})

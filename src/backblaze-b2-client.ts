import { ReadStream } from "fs"

// Setup B2 with extension upload-any call
const B2 = require("backblaze-b2")
require("@gideo-llc/backblaze-b2-upload-any").install(B2)

// For additional options, see https://github.com/softonic/axios-retry
export interface IAxiosRetryConfig {
  retry: {
    retries: number
    retryDelay: (retryCount: number, error: any) => number
  }
}

export interface IBackblazeB2ClientCredentials {
  applicationKeyId: string
  applicationKey: string
  bucketName: string
  bucketId?: string
  retry?: IAxiosRetryConfig
}

export interface IBackblazeB2Client {
  upload: (
    fileName: string,
    data: Buffer | string | ReadStream,
    credentials?: IBackblazeB2ClientCredentials
  ) => Promise<void>
  download: (
    filePath: string,
    credentials?: IBackblazeB2ClientCredentials
  ) => Promise<void>
  downloadDir: (
    dirPath: string,
    credentials?: IBackblazeB2ClientCredentials
  ) => Promise<void>
  copy: (
    oldFilePath: string,
    newFilePath: string,
    credentials?: IBackblazeB2ClientCredentials
  ) => Promise<void>
  listDir: (
    dirPath: string,
    batchSize: number,
    iteratorCallback: () => string[],
    credentials?: IBackblazeB2ClientCredentials
  ) => Promise<void>
  remove: (
    fileName: string,
    credentials?: IBackblazeB2ClientCredentials
  ) => Promise<void>
  removeDir: (
    dirPath: string,
    credentials?: IBackblazeB2ClientCredentials
  ) => Promise<void>
  testCredentials: (
    credentials?: IBackblazeB2ClientCredentials
  ) => Promise<boolean>
}

/** BucketId is an optional optimzation parameter in credentials, this fills it in if not included */
const fillInCredentials = async (
  credentials: IBackblazeB2ClientCredentials
): Promise<IBackblazeB2ClientCredentials> => {
  if (credentials.bucketId) {
    return credentials
  }
  const b2 = new B2({ credentials })
  b2.authorize()
  const bucketResponse = await b2.getBucket({
    bucketName: credentials.bucketName
  })
  if (bucketResponse.data.buckets.length != 1) {
    throw new Error("Unable to get bucketId")
  }
  const bucketId = bucketResponse.data.buckets[0].bucketId
  return { ...credentials, bucketId }
}

export const BackblazeB2Client = (
  credentials: IBackblazeB2ClientCredentials
): IBackblazeB2Client => {
  const b2 = new B2({ credentials })
  const cachedCredentials = credentials

  return {
    upload: async (
      fileName: string,
      data: Buffer | string | ReadStream,
      credentials?: IBackblazeB2ClientCredentials
    ) => {},
    download: async (
      filePath: string,
      credentials?: IBackblazeB2ClientCredentials
    ) => {},
    downloadDir: async (
      dirPath: string,
      credentials?: IBackblazeB2ClientCredentials
    ) => {},
    copy: async (
      oldFilePath: string,
      newFilePath: string,
      credentials?: IBackblazeB2ClientCredentials
    ) => {},
    listDir: async (
      dirPath: string,
      batchSize: number,
      iteratorCallback: () => string[],
      credentials?: IBackblazeB2ClientCredentials
    ) => {},
    remove: async (
      fileName: string,
      credentials?: IBackblazeB2ClientCredentials
    ) => {},
    removeDir: async (
      dirPath: string,
      credentials?: IBackblazeB2ClientCredentials
    ) => {},
    testCredentials: async (credentials?: IBackblazeB2ClientCredentials) => {
      const { bucketId } = await fillInCredentials(
        credentials || cachedCredentials
      )
      const testFileName = "backblaze-b2-client-testfile"
      const uploadResponse = await b2.authorize().then(() =>
        b2.uploadAny({
          bucketId,
          fileName: testFileName,
          data: `src/${testFileName}`
        })
      )
      const deleteResponse = await b2.deleteFileVersion({
        fileId: uploadResponse.data.fileId,
        fileName: uploadResponse.data.fileName
      })
      return uploadResponse.data.fileName == deleteResponse.data.fileName
    }
  }
}

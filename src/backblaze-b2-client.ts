import { ReadStream } from "fs"

// Setup B2 with extension upload-any call
const B2 = require("@gideo-llc/backblaze-b2-upload-any").install(
  require("backblaze-b2")
)
// B2.prototype.uploadAny = require("@gideo-llc/backblaze-b2-upload-any")

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
  bucketId: string
  retry?: IAxiosRetryConfig
}

export interface IBackblazeB2Client {
  upload: (
    credentials: IBackblazeB2ClientCredentials,
    fileName: string,
    data: Buffer | string | ReadStream
  ) => Promise<void>
  download: (
    credentials: IBackblazeB2ClientCredentials,
    filePath: string
  ) => Promise<void>
  downloadDir: (
    credentials: IBackblazeB2ClientCredentials,
    dirPath: string
  ) => Promise<void>
  copy: (
    credentials: IBackblazeB2ClientCredentials,
    oldFilePath: string,
    newFilePath: string
  ) => Promise<void>
  listDir: (
    credentials: IBackblazeB2ClientCredentials,
    dirPath: string,
    batchSize: number,
    iteratorCallback: () => string[]
  ) => Promise<void>
  remove: (
    credentials: IBackblazeB2ClientCredentials,
    fileName: string
  ) => Promise<void>
  removeDir: (
    credentials: IBackblazeB2ClientCredentials,
    dirPath: string
  ) => Promise<void>
  testCredentials: (
    credentials: IBackblazeB2ClientCredentials
  ) => Promise<boolean>
}

export const BackblazeB2Client = (): IBackblazeB2Client => {
  return {
    upload: async (
      credentials: IBackblazeB2ClientCredentials,
      fileName: string,
      data: Buffer | string | ReadStream
    ) => {
      const b2 = new B2(credentials)
      const { bucketId } = credentials
      const authorizeResponse = await b2.authorize()
      await b2.uploadAny({
        bucketId,
        fileName,
        partSize: authorizeResponse.data.recommendedPartSize,
        data
      })
    },
    download: async (
      credentials: IBackblazeB2ClientCredentials,
      filePath: string
    ) => {
      const b2 = new B2(credentials)
      const { bucketId } = credentials
      const authorizeResponse = await b2.authorize()
    },
    downloadDir: async (
      credentials: IBackblazeB2ClientCredentials,
      dirPath: string
    ) => {
      const b2 = new B2(credentials)
      const { bucketId } = credentials
      const authorizeResponse = await b2.authorize()
    },
    copy: async (
      credentials: IBackblazeB2ClientCredentials,
      oldFilePath: string,
      newFilePath: string
    ) => {
      const b2 = new B2(credentials)
      const { bucketId } = credentials
      const authorizeResponse = await b2.authorize()
    },
    listDir: async (
      credentials: IBackblazeB2ClientCredentials,
      dirPath: string,
      batchSize: number,
      iteratorCallback: () => string[]
    ) => {
      const b2 = new B2(credentials)
      const { bucketId } = credentials
      const authorizeResponse = await b2.authorize()
    },
    remove: async (
      credentials: IBackblazeB2ClientCredentials,
      fileName: string
    ) => {
      const b2 = new B2(credentials)
      const { bucketId } = credentials
      const authorizeResponse = await b2.authorize()
    },
    removeDir: async (
      credentials: IBackblazeB2ClientCredentials,
      dirPath: string
    ) => {
      const b2 = new B2(credentials)
      const { bucketId } = credentials
      const authorizeResponse = await b2.authorize()
    },
    testCredentials: async (credentials: IBackblazeB2ClientCredentials) => {
      const b2 = new B2(credentials)
      const { bucketId } = credentials
      const testFileName = "backblaze-b2-client-testfile"
      const authorizeResponse = await b2.authorize()
      const uploadData = await b2.uploadAny({
        bucketId,
        fileName: testFileName,
        partSize: authorizeResponse.data.recommendedPartSize,
        data: `src/${testFileName}`
      })
      const deleteResponse = await b2.deleteFileVersion({
        fileId: uploadData.fileId,
        fileName: uploadData.fileName
      })
      return uploadData.fileName == deleteResponse.data.fileName
    }
  }
}

import { ReadStream } from "fs"
import { IB2ApiConfig } from "./api"

// Setup B2 with extension upload-any call
const B2 = require("@gideo-llc/backblaze-b2-upload-any").install(
  require("backblaze-b2")
)
// B2.prototype.uploadAny = require("@gideo-llc/backblaze-b2-upload-any")

export interface IB2ClientConfig extends IB2ApiConfig {}

export interface IB2Client {
  upload: (
    config: IB2ClientConfig,
    fileName: string,
    data: Buffer | string | ReadStream
  ) => Promise<void>
  download: (config: IB2ClientConfig, filePath: string) => Promise<void>
  downloadDir: (config: IB2ClientConfig, dirPath: string) => Promise<void>
  copy: (
    config: IB2ClientConfig,
    oldFilePath: string,
    newFilePath: string
  ) => Promise<void>
  listDir: (
    config: IB2ClientConfig,
    dirPath: string,
    batchSize: number,
    iteratorCallback: () => string[]
  ) => Promise<void>
  remove: (config: IB2ClientConfig, fileName: string) => Promise<void>
  removeDir: (config: IB2ClientConfig, dirPath: string) => Promise<void>
  testconfig: (config: IB2ClientConfig) => Promise<boolean>
}

export const B2Client = (): IB2Client => {
  return {
    upload: async (
      config: IB2ClientConfig,
      fileName: string,
      data: Buffer | string | ReadStream
    ) => {
      const b2 = new B2(config)
      const { bucketId } = config
      const authorizeResponse = await b2.authorize()
      await b2.uploadAny({
        bucketId,
        fileName,
        partSize: authorizeResponse.data.recommendedPartSize,
        data
      })
    },
    download: async (config: IB2ClientConfig, filePath: string) => {
      const b2 = new B2(config)
      const { bucketId } = config
      const authorizeResponse = await b2.authorize()
    },
    downloadDir: async (config: IB2ClientConfig, dirPath: string) => {
      const b2 = new B2(config)
      const { bucketId } = config
      const authorizeResponse = await b2.authorize()
    },
    copy: async (
      config: IB2ClientConfig,
      oldFilePath: string,
      newFilePath: string
    ) => {
      const b2 = new B2(config)
      const { bucketId } = config
      const authorizeResponse = await b2.authorize()
    },
    listDir: async (
      config: IB2ClientConfig,
      dirPath: string,
      batchSize: number,
      iteratorCallback: () => string[]
    ) => {
      const b2 = new B2(config)
      const { bucketId } = config
      const authorizeResponse = await b2.authorize()
    },
    remove: async (config: IB2ClientConfig, fileName: string) => {
      const b2 = new B2(config)
      const { bucketId } = config
      await b2.authorize()

      try {
        let versions = await b2.listFileVersions({
          bucketId,
          startFileName: fileName,
          maxFileCount: 1
        })

        if (versions.data.files.length >= 1) {
          let fileId = versions.data.files[0].fileId

          await b2.deleteFileVersion({
            fileId: fileId,
            fileName: fileName
          })
        }
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.code &&
          e.response.data.code == "file_not_present"
        ) {
          // Nothin to do, the file we wanted to delete is already gone
        } else {
          throw e
        }
      }
    },
    removeDir: async (config: IB2ClientConfig, dirPath: string) => {
      const b2 = new B2(config)
      const { bucketId } = config
      const authorizeResponse = await b2.authorize()
    },
    testconfig: async (config: IB2ClientConfig) => {
      const b2 = new B2(config)
      const { bucketId } = config
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

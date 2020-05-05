require("dotenv").config()
import { B2Api, IB2ApiConfig, IB2ApiCopyFileRequest } from "../../src"
const B2 = require("@gideo-llc/backblaze-b2-upload-any").install(
  require("backblaze-b2")
)
import * as fs from "fs-extra"
import { testFixtures } from "../fixtures"
const dayjs = require("dayjs")

describe("BackblazeB2Client", () => {
  // Set longer timeout since we're actually doing network calls
  jest.setTimeout(15000)

  const applicationKeyId = process.env.BACKBLAZE_B2_API_KEY_ID
  expect(applicationKeyId).toBeDefined()
  const applicationKey = process.env.BACKBLAZE_B2_API_KEY
  expect(applicationKey).toBeDefined()
  const bucketName = process.env.BACKBLAZE_B2_BUCKET_NAME
  expect(bucketName).toBeDefined()
  const bucketId = process.env.BACKBLAZE_B2_BUCKET_ID
  expect(bucketId).toBeDefined()
  const config = {
    applicationKeyId,
    applicationKey,
    bucketName,
    bucketId
  } as IB2ApiConfig

  // TODO add per test cleanup of uploaded test files
  // beforeEach(() => {
  //   testFixtures.forEach(async ({ fileName, filePath }: any) => {
  //     const b2raw = new B2(config)
  //     await b2raw.authorize()
  //     const listResponse = await b2raw.listFileNames({
  //       ...config,
  //       startFileName: fileName,
  //       maxFileCount: 100,
  //       delimiter: "",
  //       prefix: ""
  //     })
  //     const listedFile = listResponse.data.files.filter(
  //       (file: any) => file.fileName == fileName
  //     )
  //     if (listedFile) {
  //       await b2raw.authorize()
  //       await b2raw.deleteFileVersion({
  //         ...config,
  //         fileName,
  //         fileId: listedFile.fileId
  //       })
  //     }
  //   })
  // })

  it("upload filepath", async () => {
    const datePrefix = dayjs().format("YYYY-MM-DDTHH:mm:ss")
    const testFile = testFixtures[0]
    const fileName = `${datePrefix}-${testFile.fileName}`

    const b2 = new B2Api(config)
    const copyFileOptions: IB2ApiCopyFileRequest = {
      sourceFileId,
      
    }
    await b2.copyFile()

    const b2raw = new B2(config)
    await b2raw.authorize()
    const listResponse = await b2raw.listFileNames({
      ...config,
      startFileName: fileName,
      maxFileCount: 100,
      delimiter: "",
      prefix: ""
    })
    const file = listResponse.data.files.filter(
      (file: any) => file.fileName == fileName
    )
    expect(file).toBeDefined()
  })
)

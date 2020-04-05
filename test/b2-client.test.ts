require("dotenv").config()
import { B2Client, IB2ClientConfig } from "../src"
const B2 = require("@gideo-llc/backblaze-b2-upload-any").install(
  require("backblaze-b2")
)
import * as fs from "fs-extra"
const dayjs = require("dayjs")

const testFiles = [
  {
    fileName: "alpha.txt",
    filePath: "./test/fixtures/alpha.txt"
  },
  {
    fileName: "bravo.txt",
    filePath: "./test/fixtures/bravo.txt"
  },
  {
    fileName: "charlie.txt",
    filePath: "./test/fixtures/charlie.txt"
  }
]

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
  } as IB2ClientConfig

  // TODO add per test cleanup of uploaded test files
  // beforeEach(() => {
  //   testFiles.forEach(async ({ fileName, filePath }: any) => {
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

  it("testconfig happy path", async () => {
    const b2 = B2Client()
    expect(await b2.testconfig(config)).toBeTruthy()
  })

  it("upload filepath", async () => {
    const datePrefix = dayjs().format("YYYY-MM-DDTHH:mm:ss")
    const testFile = testFiles[0]
    const fileName = `${datePrefix}-${testFile.fileName}`

    const b2 = B2Client()
    await b2.upload(config, fileName, testFile.filePath)

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

  it("upload stream", async () => {
    const datePrefix = dayjs().format("YYYY-MM-DDTHH:mm:ss")
    const testFile = testFiles[1]
    const fileName = `${datePrefix}-${testFile.fileName}`

    const b2 = B2Client()
    await b2.upload(config, fileName, fs.createReadStream(testFile.filePath))

    const b2raw = new B2(config)
    await b2raw.authorize()
    const listResponse = await b2raw.listFileNames({
      ...config,
      startFileName: fileName,
      maxFileCount: 100,
      delimiter: "",
      prefix: ""
    })
    const files = listResponse.data.files.filter(
      (file: any) => file.fileName == fileName
    )
    expect(files).toHaveLength(1)
  })

  it("remove happy path", async () => {
    const datePrefix = dayjs().format("YYYY-MM-DDTHH:mm:ss")
    const testFile = testFiles[0]
    const fileName = `${datePrefix}-${testFile.fileName}`

    const b2 = B2Client()
    await b2.upload(config, fileName, testFile.filePath)

    await b2.remove(config, fileName)

    const b2raw = new B2(config)
    await b2raw.authorize()
    const listResponse = await b2raw.listFileNames({
      ...config,
      startFileName: fileName,
      maxFileCount: 100,
      delimiter: "",
      prefix: ""
    })
    const files = listResponse.data.files.filter(
      (file: any) => file.fileName == fileName
    )
    expect(files).toHaveLength(0)
  })
})

require("dotenv").config()
import { BackblazeB2Client, IBackblazeB2ClientCredentials } from "../src"
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
  const credentials = {
    applicationKeyId,
    applicationKey,
    bucketName,
    bucketId
  } as IBackblazeB2ClientCredentials

  // TODO add per test cleanup of uploaded test files
  // beforeEach(() => {
  //   testFiles.forEach(async ({ fileName, filePath }: any) => {
  //     const b2raw = new B2(credentials)
  //     await b2raw.authorize()
  //     const listResponse = await b2raw.listFileNames({
  //       ...credentials,
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
  //         ...credentials,
  //         fileName,
  //         fileId: listedFile.fileId
  //       })
  //     }
  //   })
  // })

  it("testCredentials happy path", async () => {
    const b2 = BackblazeB2Client()
    expect(await b2.testCredentials(credentials)).toBeTruthy()
  })

  it("upload filepath", async () => {
    const datePrefix = dayjs().format("YYYY-MM-DDTHH:mm:ss")
    const testFile = testFiles[0]
    const fileName = `${datePrefix}-${testFile.fileName}`

    const b2 = BackblazeB2Client()
    await b2.upload(credentials, fileName, testFile.filePath)

    const b2raw = new B2(credentials)
    await b2raw.authorize()
    const listResponse = await b2raw.listFileNames({
      ...credentials,
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

    const b2 = BackblazeB2Client()
    await b2.upload(
      credentials,
      fileName,
      fs.createReadStream(testFile.filePath)
    )

    const b2raw = new B2(credentials)
    await b2raw.authorize()
    const listResponse = await b2raw.listFileNames({
      ...credentials,
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

    const b2 = BackblazeB2Client()
    await b2.upload(credentials, fileName, testFile.filePath)

    await b2.remove(credentials, fileName)

    const b2raw = new B2(credentials)
    await b2raw.authorize()
    const listResponse = await b2raw.listFileNames({
      ...credentials,
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

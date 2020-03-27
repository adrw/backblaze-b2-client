require("dotenv").config()
import { BackblazeB2Client, IBackblazeB2ClientCredentials } from "../src"
import * as fs from "fs-extra"

describe("BackblazeB2Client", () => {
  // Set longer timeout since we're actually doing network calls
  jest.setTimeout(60000)

  const applicationKeyId = process.env.BACKBLAZE_B2_API_KEY_ID
  expect(applicationKeyId).toBeDefined()
  const applicationKey = process.env.BACKBLAZE_B2_API_KEY
  expect(applicationKey).toBeDefined()
  const bucketName = process.env.BACKBLAZE_B2_BUCKET_NAME
  expect(bucketName).toBeDefined()
  const bucketId = process.env.BACKBLAZE_B2_BUCKET_ID
  expect(bucketId).toBeDefined()

  it("testCredentials happy path", async () => {
    const credentials = {
      applicationKeyId,
      applicationKey,
      bucketName,
      bucketId
    } as IBackblazeB2ClientCredentials

    const b2 = BackblazeB2Client()
    expect(await b2.testCredentials(credentials)).toBeTruthy()
  })

  it("upload filepath", async () => {
    const credentials = {
      applicationKeyId,
      applicationKey,
      bucketName,
      bucketId
    } as IBackblazeB2ClientCredentials

    const b2 = BackblazeB2Client()
    await b2.upload(credentials, "alpha.txt", "./test/fixtures/alpha.txt")
  })

  it("upload stream", async () => {
    const credentials = {
      applicationKeyId,
      applicationKey,
      bucketName,
      bucketId
    } as IBackblazeB2ClientCredentials

    const b2 = BackblazeB2Client()
    await b2.upload(
      credentials,
      "bravo.txt",
      fs.createReadStream("./test/fixtures/bravo.txt")
    )
  })
})

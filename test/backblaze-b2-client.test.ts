require("dotenv").config()
import { BackblazeB2Client, IBackblazeB2ClientCredentials } from "../src"

describe("BackblazeB2Client", () => {
  const applicationKeyId = process.env.BACKBLAZE_B2_API_KEY_ID
  expect(applicationKeyId).toBeDefined()
  const applicationKey = process.env.BACKBLAZE_B2_API_KEY
  expect(applicationKey).toBeDefined()
  const bucketName = process.env.BACKBLAZE_B2_BUCKET_NAME
  expect(bucketName).toBeDefined()
  const bucketId = process.env.BACKBLAZE_B2_BUCKET_ID
  expect(bucketName).toBeDefined()

  it("testCredentials happy path", async () => {
    const credentials = {
      applicationKeyId,
      applicationKey,
      bucketName,
      bucketId
    } as IBackblazeB2ClientCredentials

    const b2 = BackblazeB2Client(credentials)
    expect(await b2.testCredentials()).toBeTruthy()
  })

  it("testCredentials no bucket id", async () => {
    const credentials = {
      applicationKeyId,
      applicationKey,
      bucketName
    } as IBackblazeB2ClientCredentials

    const b2 = BackblazeB2Client(credentials)
    expect(await b2.testCredentials()).toBeTruthy()
  })
})

require("dotenv").config()
const { BackblazeB2Client } = require("../dist/src/backblaze-b2-client")

const main = async () => {
  const applicationKeyId = process.env.BACKBLAZE_B2_API_KEY_ID
  const applicationKey = process.env.BACKBLAZE_B2_API_KEY
  const bucketName = process.env.BACKBLAZE_B2_BUCKET_NAME
  console.log(applicationKeyId, applicationKey, bucketName)
  const credentials = {
    applicationKeyId,
    applicationKey,
    bucketName
  }

  const b2 = BackblazeB2Client(credentials)
  const result = await b2.testCredentials()
  console.log(result)
}

main()

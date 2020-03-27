require("dotenv").config()
const { BackblazeB2Client } = require("../dist/backblaze-b2-client")

const main = async () => {
  const applicationKeyId = process.env.BACKBLAZE_B2_API_KEY_ID
  const applicationKey = process.env.BACKBLAZE_B2_API_KEY
  const bucketName = process.env.BACKBLAZE_B2_BUCKET_NAME
  const credentials = {
    applicationKeyId,
    applicationKey,
    bucketName
  }
  const b2 = BackblazeB2Client()
  const result = await b2.testCredentials(credentials)
  console.log(result)
}

main()

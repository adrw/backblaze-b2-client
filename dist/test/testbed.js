require("dotenv").config();
import { BackblazeB2Client } from "../src";
const applicationKeyId = process.env.BACKBLAZE_B2_API_KEY_ID;
const applicationKey = process.env.BACKBLAZE_B2_API_KEY;
const bucketName = process.env.BACKBLAZE_B2_BUCKET_NAME;
const credentials = {
    applicationKeyId,
    applicationKey,
    bucketName
};
const b2 = BackblazeB2Client(credentials);
console.log(await b2.testCredentials());
//# sourceMappingURL=testbed.js.map
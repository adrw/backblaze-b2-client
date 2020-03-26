require('dotenv').config();
const b2 = require('./backblaze-b2.js');

b2.testConfig(
    {
        applicationKeyId: process.env.BACKBLAZE_B2_API_KEY_ID,
        applicationKey: process.env.BACKBLAZE_B2_API_KEY,
        bucket: process.env.BUCKET
    },
    (error, credentials) => {
        expectThat(credentials).isEqualTo({
            applicationKeyId: process.env.BACKBLAZE_B2_API_KEY_ID,
            applicationKey: process.env.BACKBLAZE_B2_API_KEY,
            bucket: process.env.BUCKET
        });
    }
);

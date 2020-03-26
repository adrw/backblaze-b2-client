require('dotenv').config();
const b2 = require('src/backblaze-b2.js');

describe('backblaze-b2 integration test', () => {
    it('testConfig', () => {
        b2.testConfig(
            {
                applicationKeyId: process.env.BACKBLAZE_B2_API_KEY_ID,
                applicationKey: process.env.BACKBLAZE_B2_API_KEY,
                bucket: process.env.BUCKET
            },
            (error, credentials) => {
                expect(credentials).toBe({
                    applicationKeyId: process.env.BACKBLAZE_B2_API_KEY_ID,
                    applicationKey: process.env.BACKBLAZE_B2_API_KEY,
                    bucket: process.env.BUCKET
                });
            }
        );
    });
});

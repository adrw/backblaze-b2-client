require('dotenv').config();
const b2 = require('src/backblaze-b2.js');

describe('backblaze-b2 integration test', () => {
    it('testConfig', () => {
        const applicationKeyId = process.env.BACKBLAZE_B2_API_KEY_ID;
        expect(applicationKeyId).toBeDefined();
        const applicationKey = process.env.BACKBLAZE_B2_API_KEY;
        expect(applicationKey).toBeDefined();
        const bucket = process.env.BUCKET;
        expect(bucket).toBeDefined();
        const params = {
            applicationKeyId,
            applicationKey,
            bucket
        };
        const testConfigResponse = b2.testConfig(params, error => error);
        console.log(testConfigResponse);
        expect().toBeUndefined();
    });
});

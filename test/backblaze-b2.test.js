const b2 = require('src/backblaze-b2.js');

describe('backblaze-b2 integration test', () => {
    it('testConfig', () => {
        b2.testConfig({}, () => null);
    });
});

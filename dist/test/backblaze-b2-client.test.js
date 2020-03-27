"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const src_1 = require("../src");
describe("BackblazeB2Client integration test", () => {
    it("testCredentials", () => __awaiter(void 0, void 0, void 0, function* () {
        const applicationKeyId = process.env.BACKBLAZE_B2_API_KEY_ID;
        expect(applicationKeyId).toBeDefined();
        const applicationKey = process.env.BACKBLAZE_B2_API_KEY;
        expect(applicationKey).toBeDefined();
        const bucketName = process.env.BACKBLAZE_B2_BUCKET_NAME;
        expect(bucketName).toBeDefined();
        const credentials = {
            applicationKeyId,
            applicationKey,
            bucketName
        };
        const b2 = src_1.BackblazeB2Client(credentials);
        expect(yield b2.testCredentials()).toBeTruthy();
    }));
});
//# sourceMappingURL=backblaze-b2-client.test.js.map
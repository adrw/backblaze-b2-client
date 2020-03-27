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
// Setup B2 with extension upload-any call
const B2 = require("backblaze-b2");
require("@gideo-llc/backblaze-b2-upload-any").install(B2);
/** BucketId is an optional optimzation parameter in credentials, this fills it in if not included */
const fillInCredentials = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    if (credentials.bucketId) {
        return credentials;
    }
    const b2 = new B2({ credentials });
    b2.authorize();
    const bucketResponse = yield b2.getBucket({
        bucketName: credentials.bucketName
    });
    if (bucketResponse.data.buckets.length != 1) {
        throw new Error("Unable to get bucketId");
    }
    const bucketId = bucketResponse.data.buckets[0].bucketId;
    return Object.assign(Object.assign({}, credentials), { bucketId });
});
exports.BackblazeB2Client = (credentials) => {
    const b2 = new B2({ credentials });
    const cachedCredentials = credentials;
    return {
        upload: (fileName, data, credentials) => __awaiter(void 0, void 0, void 0, function* () { }),
        download: (filePath, credentials) => __awaiter(void 0, void 0, void 0, function* () { }),
        downloadDir: (dirPath, credentials) => __awaiter(void 0, void 0, void 0, function* () { }),
        copy: (oldFilePath, newFilePath, credentials) => __awaiter(void 0, void 0, void 0, function* () { }),
        listDir: (dirPath, batchSize, iteratorCallback, credentials) => __awaiter(void 0, void 0, void 0, function* () { }),
        remove: (fileName, credentials) => __awaiter(void 0, void 0, void 0, function* () { }),
        removeDir: (dirPath, credentials) => __awaiter(void 0, void 0, void 0, function* () { }),
        testCredentials: (credentials) => __awaiter(void 0, void 0, void 0, function* () {
            const { bucketId } = yield fillInCredentials(credentials || cachedCredentials);
            const testFileName = "backblaze-b2-client-testfile";
            const uploadResponse = yield b2.uploadAny({
                bucketId,
                fileName: testFileName,
                data: `src/${testFileName}`
            });
            const deleteResponse = yield b2.deleteFileVersion({
                fileId: uploadResponse.data.fileId,
                fileName: uploadResponse.data.fileName
            });
            return uploadResponse.data.fileName == deleteResponse.data.fileName;
        })
    };
};
//# sourceMappingURL=backblaze-b2-client.js.map
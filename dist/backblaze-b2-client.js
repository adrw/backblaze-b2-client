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
const B2 = require("@gideo-llc/backblaze-b2-upload-any").install(require("backblaze-b2"));
exports.BackblazeB2Client = () => {
    return {
        upload: (credentials, fileName, data) => __awaiter(void 0, void 0, void 0, function* () { }),
        download: (credentials, filePath) => __awaiter(void 0, void 0, void 0, function* () { }),
        downloadDir: (credentials, dirPath) => __awaiter(void 0, void 0, void 0, function* () { }),
        copy: (credentials, oldFilePath, newFilePath) => __awaiter(void 0, void 0, void 0, function* () { }),
        listDir: (credentials, dirPath, batchSize, iteratorCallback) => __awaiter(void 0, void 0, void 0, function* () { }),
        remove: (credentials, fileName) => __awaiter(void 0, void 0, void 0, function* () { }),
        removeDir: (credentials, dirPath) => __awaiter(void 0, void 0, void 0, function* () { }),
        testCredentials: (credentials) => __awaiter(void 0, void 0, void 0, function* () {
            const b2 = new B2(credentials);
            const { bucketId } = credentials;
            const testFileName = "backblaze-b2-client-testfile";
            const authorizeResponse = yield b2.authorize();
            const uploadData = yield b2.uploadAny({
                bucketId,
                fileName: testFileName,
                partSize: authorizeResponse.data.recommendedPartSize,
                data: `src/${testFileName}`
            });
            const deleteResponse = yield b2.deleteFileVersion({
                fileId: uploadData.fileId,
                fileName: uploadData.fileName
            });
            return uploadData.fileName == deleteResponse.data.fileName;
        })
    };
};

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Setup B2 with extension upload-any call
var B2 = require("backblaze-b2");
require("@gideo-llc/backblaze-b2-upload-any").install(B2);
/** BucketId is an optional optimzation parameter in credentials, this fills it in if not included */
var fillInCredentials = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
    var b2, bucketResponse, bucketId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (credentials.bucketId) {
                    return [2 /*return*/, credentials];
                }
                b2 = new B2({ credentials: credentials });
                b2.authorize();
                return [4 /*yield*/, b2.getBucket({
                        bucketName: credentials.bucketName
                    })];
            case 1:
                bucketResponse = _a.sent();
                if (bucketResponse.data.buckets.length != 1) {
                    throw new Error("Unable to get bucketId");
                }
                bucketId = bucketResponse.data.buckets[0].bucketId;
                return [2 /*return*/, __assign(__assign({}, credentials), { bucketId: bucketId })];
        }
    });
}); };
export var BackblazeB2Client = function (credentials) {
    var b2 = new B2({ credentials: credentials });
    var cachedCredentials = credentials;
    return {
        upload: function (fileName, data, credentials) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        download: function (filePath, credentials) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        downloadDir: function (dirPath, credentials) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        copy: function (oldFilePath, newFilePath, credentials) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        listDir: function (dirPath, batchSize, iteratorCallback, credentials) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        remove: function (fileName, credentials) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        removeDir: function (dirPath, credentials) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        testCredentials: function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
            var bucketId, testFileName, uploadResponse, deleteResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fillInCredentials(credentials || cachedCredentials)];
                    case 1:
                        bucketId = (_a.sent()).bucketId;
                        testFileName = "backblaze-b2-client-testfile";
                        return [4 /*yield*/, b2.uploadAny({
                                bucketId: bucketId,
                                fileName: testFileName,
                                data: "src/" + testFileName
                            })];
                    case 2:
                        uploadResponse = _a.sent();
                        return [4 /*yield*/, b2.deleteFileVersion({
                                fileId: uploadResponse.data.fileId,
                                fileName: uploadResponse.data.fileName
                            })];
                    case 3:
                        deleteResponse = _a.sent();
                        return [2 /*return*/, uploadResponse.data.fileName == deleteResponse.data.fileName];
                }
            });
        }); }
    };
};
//# sourceMappingURL=backblaze-b2-client.js.map
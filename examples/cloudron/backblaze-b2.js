'use strict';

exports = module.exports = {
    upload: upload,
    download: download,
    copy: copy,

    listDir: listDir,

    remove: remove,
    removeDir: removeDir,

    testConfig: testConfig,
    removePrivateFields: removePrivateFields,
    injectPrivateFields: injectPrivateFields
};

var assert = require('assert'),
    async = require('async'),
    B2 = require('backblaze-b2'),
    // backups = require('../backups.js'),
    BoxError = require('./boxerror.js'),
    chunk = require('lodash.chunk'),
    debug = require('debug')('cloudron-backblaze-b2-storage'),
    EventEmitter = require('events'),
    fs = require('fs').promises,
    https = require('https'),
    PassThrough = require('stream').PassThrough,
    path = require('path');

function removePrivateFields(apiConfig) {
    // in-place removal of tokens and api keys with domains.SECRET_PLACEHOLDER
    return apiConfig;
}

// eslint-disable-next-line no-unused-vars
function injectPrivateFields(newConfig, currentConfig) {
    // in-place injection of tokens and api keys which came in with domains.SECRET_PLACEHOLDER
}

function upload(apiConfig, backupFilePath, sourceStream, callback) {
    assert.strictEqual(typeof apiConfig, 'object');
    assert.strictEqual(typeof backupFilePath, 'string');
    assert.strictEqual(typeof sourceStream, 'object');
    assert.strictEqual(typeof callback, 'function');

    getB2Config(apiConfig, async (error, credentials) => {
        if (error) return callback(error);

        var b2 = new B2(credentials);
        var bucketId;
        try {
            await b2.authorize();
            const bucketResponse = await b2.getBucket({
                bucketName: credentials.bucket
            });
            bucketId = bucketResponse.data.buckets[0].bucketId;
        } catch (error) {
            callback(
                new BoxError(
                    BoxError.EXTERNAL_ERROR,
                    error.message || error.code
                )
            ); // DO sets 'code'
        }

        uploadB2File(b2, bucketId, backupFilePath, sourceStream);
    });
}

function download(apiConfig, backupFilePath, callback) {
    assert.strictEqual(typeof apiConfig, 'object');
    assert.strictEqual(typeof backupFilePath, 'string');
    assert.strictEqual(typeof callback, 'function');

    // Result: download stream
    callback(
        new BoxError(BoxError.NOT_IMPLEMENTED, 'download is not implemented')
    );
}

function downloadDir(apiConfig, backupFilePath, destDir) {
    assert.strictEqual(typeof apiConfig, 'object');
    assert.strictEqual(typeof backupFilePath, 'string');
    assert.strictEqual(typeof destDir, 'string');

    var events = new EventEmitter();
    process.nextTick(function() {
        events.emit('done', null);
    });
    return events;
}

function copy(apiConfig, oldFilePath, newFilePath) {
    assert.strictEqual(typeof apiConfig, 'object');
    assert.strictEqual(typeof oldFilePath, 'string');
    assert.strictEqual(typeof newFilePath, 'string');

    var events = new EventEmitter();
    process.nextTick(function() {
        events.emit('done', null);
    });
    return events;
}

function listDir(apiConfig, dir, batchSize, iteratorCallback, callback) {
    assert.strictEqual(typeof apiConfig, 'object');
    assert.strictEqual(typeof dir, 'string');
    assert.strictEqual(typeof batchSize, 'number');
    assert.strictEqual(typeof iteratorCallback, 'function');
    assert.strictEqual(typeof callback, 'function');

    callback(
        new BoxError(BoxError.NOT_IMPLEMENTED, 'listDir is not implemented')
    );
}

function remove(apiConfig, filename, callback) {
    assert.strictEqual(typeof apiConfig, 'object');
    assert.strictEqual(typeof filename, 'string');
    assert.strictEqual(typeof callback, 'function');

    // Result: none

    callback(
        new BoxError(BoxError.NOT_IMPLEMENTED, 'remove is not implemented')
    );
}

function removeDir(apiConfig, pathPrefix) {
    assert.strictEqual(typeof apiConfig, 'object');
    assert.strictEqual(typeof pathPrefix, 'string');

    // Result: none
    var events = new EventEmitter();
    process.nextTick(function() {
        events.emit(
            'done',
            new BoxError(
                BoxError.NOT_IMPLEMENTED,
                'removeDir is not implemented'
            )
        );
    });
    return events;
}

function testConfig(apiConfig, callback) {
    assert.strictEqual(typeof apiConfig, 'object');
    assert.strictEqual(typeof callback, 'function');

    // Result: none - first callback argument error if config does not pass the test

    if (typeof apiConfig.applicationKeyId !== 'string')
        return callback(
            new BoxError(
                BoxError.BAD_FIELD,
                'applicationKeyId must be a string',
                { field: 'applicationKeyId' }
            )
        );
    if (typeof apiConfig.applicationKey !== 'string')
        return callback(
            new BoxError(
                BoxError.BAD_FIELD,
                'applicationKey must be a string',
                { field: 'applicationKey' }
            )
        );
    if (typeof apiConfig.bucket !== 'string')
        return callback(
            new BoxError(BoxError.BAD_FIELD, 'bucket must be a string', {
                field: 'bucket'
            })
        );
    // the node module seems to incorrectly accept bucket name with '/'
    if (apiConfig.bucket.includes('/'))
        return callback(
            new BoxError(BoxError.BAD_FIELD, 'bucket name cannot contain "/"', {
                field: 'bucket'
            })
        );

    // attempt to upload and delete a file with new credentials
    getB2Config(apiConfig, async (error, credentials) => {
        if (error) return callback(error);

        var b2 = new B2(credentials);
        var bucketId;
        try {
            await b2.authorize();
            const bucketResponse = await b2.getBucket({
                bucketName: credentials.bucket
            });
            bucketId = bucketResponse.data.buckets[0].bucketId;
        } catch (error) {
            callback(
                new BoxError(
                    BoxError.EXTERNAL_ERROR,
                    error.message || error.code
                )
            ); // DO sets 'code'
        }

        Promise.all([
            b2.getUploadUrl({ bucketId }),
            fs.readFile('src/cloudron-testfile')
        ]).then(([response, file]) => {
            return b2
                .uploadFile({
                    uploadUrl: response.data.uploadUrl,
                    uploadAuthToken: response.data.authorizationToken,
                    fileName: 'cloudron-testfile',
                    data: file
                })
                .then(uploadResponse => {
                    console.log(
                        `Upload /${credentials.bucket}/${uploadResponse.data.fileName}`
                    );
                    b2.deleteFileVersion({
                        fileId: uploadResponse.data.fileId,
                        fileName: uploadResponse.data.fileName + '2'
                    })
                        .then(deleteResponse => {
                            console.log(
                                `Delete /${credentials.bucket}/${deleteResponse.data.fileName}`
                            );
                            callback();
                        })
                        .catch(error =>
                            callback(
                                new BoxError(
                                    BoxError.EXTERNAL_ERROR,
                                    error.message || error.code
                                )
                            )
                        ); // DO sets 'code'
                })
                .catch(error =>
                    callback(
                        new BoxError(
                            BoxError.EXTERNAL_ERROR,
                            error.message || error.code
                        )
                    )
                ); // DO sets 'code'
        });
    });
}

function getB2Config(apiConfig, callback) {
    assert.strictEqual(typeof apiConfig, 'object');
    assert.strictEqual(typeof callback, 'function');

    var credentials = {
        applicationKeyId: apiConfig.applicationKeyId,
        applicationKey: apiConfig.applicationKey,
        bucket: apiConfig.bucket,
        retry: {
            retries: 5, // for additional options, see https://github.com/softonic/axios-retry
            retryDelay: () => 20000 // constant backoff
        }
    };

    callback(null, credentials);
}

async function uploadB2File(
    b2,
    bucketId,
    filePath,
    fileName,
    multiPartSizeLimit = 5242880 // 5MB
) {
    let stats = fs.statSync(filePath);
    if (stats.size > multiPartSizeLimit) {
        let fileData = await fs.readFileAsync(filePath);
        let fileChunks = chunks(fileData, multiPartSizeLimit);

        await b2.authorize();

        let largeFileData = await b2.startLargeFile({
            bucketId,
            fileName
        });
        let fileId = largeFileData.data.fileId;

        /* eslint-disable arrow-body-style */
        await Promise.all(
            fileChunks.map((data, index) => {
                return b2.getUploadPartUrl({ fileId: fileId }).then(urlInfo => {
                    return b2.uploadPart({
                        partNumber: index + 1,
                        uploadUrl: urlInfo.data.uploadUrl,
                        uploadAuthToken: urlInfo.data.authorizationToken,
                        data: data
                    });
                });
            })
        );

        let uploadInfo = await b2.finishLargeFile({
            fileId: fileId,
            partSha1Array: fileChunks.map(data => {
                let hash = crypto.createHash('sha1');
                hash.update(data);
                return hash.digest('hex');
            })
        });

        return `${uploadInfo.data.fileName}`;
    }

    await b2.authorize();

    let urlInfo = await b2.getUploadUrl(bucketId);
    let uploadInfo = await b2.uploadFile({
        uploadUrl: urlInfo.data.uploadUrl,
        uploadAuthToken: urlInfo.data.authorizationToken,
        filename: fileName,
        data: await fs.readFileAsync(filePath)
    });

    return `${uploadInfo.data.fileName}`;
}

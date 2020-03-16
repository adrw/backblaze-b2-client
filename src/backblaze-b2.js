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
    BoxError = require('./cloudron/boxerror.js'),
    chunk = require('lodash.chunk'),
    debug = require('debug')('cloudron-backblaze-b2-storage'),
    EventEmitter = require('events'),
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

    // Result: none
    // sourceStream errors are handled upstream

    callback(
        new BoxError(BoxError.NOT_IMPLEMENTED, 'upload is not implemented')
    );
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

    callback(
        new BoxError(BoxError.NOT_IMPLEMENTED, 'testConfig is not implemented')
    );
}

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
    injectPrivateFields: injectPrivateFields,

    // Used to mock AWS
    _mockInject: mockInject,
    _mockRestore: mockRestore
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


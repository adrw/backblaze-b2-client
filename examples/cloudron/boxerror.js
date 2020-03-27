/* jslint node:true */

'use strict';

const assert = require('assert'),
    HttpError = require('connect-lastmile').HttpError,
    util = require('util'),
    _ = require('underscore');

exports = module.exports = BoxError;

function BoxError(reason, errorOrMessage, details) {
    assert.strictEqual(typeof reason, 'string');
    assert(errorOrMessage instanceof Error || typeof errorOrMessage === 'string' || typeof errorOrMessage === 'undefined');
    assert(typeof details === 'object' || typeof details === 'undefined');

    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.reason = reason;
    this.details = details || {};

    if (typeof errorOrMessage === 'undefined') {
        this.message = reason;
    } else if (typeof errorOrMessage === 'string') {
        this.message = errorOrMessage;
    } else { // error object
        this.message = errorOrMessage.message;
        this.nestedError = errorOrMessage;
        _.extend(this.details, errorOrMessage); // copy enumerable properies
    }
}
util.inherits(BoxError, Error);
BoxError.ACCESS_DENIED = 'Access Denied';
BoxError.ADDONS_ERROR = 'Addons Error';
BoxError.ALREADY_EXISTS = 'Already Exists';
BoxError.BAD_FIELD = 'Bad Field';
BoxError.BAD_STATE = 'Bad State';
BoxError.BUSY = 'Busy';
BoxError.COLLECTD_ERROR = 'Collectd Error';
BoxError.CONFLICT = 'Conflict';
BoxError.CRYPTO_ERROR = 'Crypto Error';
BoxError.DATABASE_ERROR = 'Database Error';
BoxError.DNS_ERROR = 'DNS Error';
BoxError.DOCKER_ERROR = 'Docker Error';
BoxError.EXTERNAL_ERROR = 'External Error'; // use this for external API errors
BoxError.FEATURE_DISABLED = 'Feature Disabled';
BoxError.FS_ERROR = 'FileSystem Error';
BoxError.INACTIVE = 'Inactive';
BoxError.INTERNAL_ERROR = 'Internal Error';
BoxError.INVALID_CREDENTIALS = 'Invalid Credentials';
BoxError.LICENSE_ERROR = 'License Error';
BoxError.LOGROTATE_ERROR = 'Logrotate Error';
BoxError.MAIL_ERROR = 'Mail Error';
BoxError.NETWORK_ERROR = 'Network Error';
BoxError.NGINX_ERROR = 'Nginx Error';
BoxError.NOT_FOUND = 'Not found';
BoxError.NOT_IMPLEMENTED = 'Not implemented';
BoxError.NOT_SIGNED = 'Not Signed';
BoxError.OPENSSL_ERROR = 'OpenSSL Error';
BoxError.PLAN_LIMIT = 'Plan Limit';
BoxError.SPAWN_ERROR = 'Spawn Error';
BoxError.TASK_ERROR = 'Task Error';
BoxError.TIMEOUT = 'Timeout';
BoxError.TRY_AGAIN = 'Try Again';

BoxError.prototype.toPlainObject = function () {
    return _.extend({}, { message: this.message, reason: this.reason }, this.details);
};

// this is a class method for now in case error is not a BoxError
BoxError.toHttpError = function (error) {
    switch (error.reason) {
    case BoxError.BAD_FIELD:
        return new HttpError(400, error);
    case BoxError.LICENSE_ERROR:
        return new HttpError(402, error);
    case BoxError.NOT_FOUND:
        return new HttpError(404, error);
    case BoxError.FEATURE_DISABLED:
        return new HttpError(405, error);
    case BoxError.ALREADY_EXISTS:
    case BoxError.BAD_STATE:
    case BoxError.CONFLICT:
        return new HttpError(409, error);
    case BoxError.INVALID_CREDENTIALS:
        return new HttpError(412, error);
    case BoxError.EXTERNAL_ERROR:
    case BoxError.NETWORK_ERROR:
    case BoxError.FS_ERROR:
    case BoxError.MAIL_ERROR:
    case BoxError.DOCKER_ERROR:
    case BoxError.ADDONS_ERROR:
        return new HttpError(424, error);
    case BoxError.DATABASE_ERROR:
    case BoxError.INTERNAL_ERROR:
    default:
        return new HttpError(500, error);
    }
};

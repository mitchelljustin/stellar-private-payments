"use strict";

const Async = require('async')

const redis = require('../integration/redis')


module.exports.entry = (event, context, done) => {
    const id = event.pathParameters.id
    Async.waterfall([

    ], done)
}
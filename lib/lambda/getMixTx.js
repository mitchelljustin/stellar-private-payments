"use strict";

const Async = require('async')

const redis = require('../integration/redis')


module.exports.entry = ( event, context, done) => {
    const id = event.pathParameters.id
    Async.waterfall([
        cb => {
            redis.get(`privPmt:${id}:mixTx`, (err, mixTdId) => {
                if (err) {
                    return cb({
                        statusCode: 500,
                        body: `Error: ${err}`,
                    })
                }
                if (mixTdId === null) {
                    return cb({
                        statusCode: 404,
                        body: `Transaction not found for payment: ${id}`,
                    })
                }
                cb(null, mixTdId)
            })
        },
        (mixTxId, cb) => {
            let batch = redis.multi()
            batch.get(`mixTx:${mixTxId}`)
            batch.hgetall(`mixTx:${mixTxId}:signatures`)
            batch.exec(cb)
        },
        ([tx, signatures], cb) => {
            cb(null, {
                tx, signatures
            })
        }
    ], (err, ret) => {
        if (err) {
            return done(null, err)
        }
        done(null, {
            statusCode: 200,
            body: JSON.stringify(ret)
        })
    })
}
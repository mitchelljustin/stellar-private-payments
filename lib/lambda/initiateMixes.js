"use strict";

const Async = require('async')
const UUID = require('uuid')
const Request = require('request')

const redis = require('../integration/redis')
const generateMixes = require('../helpers/generateMixes')
const constants = require('../constants')

function startMixes(queueKey, payments, done) {
    console.log(`Flushing ${payments.length} payments`)
    const startMixUri = process.env.START_MIX_URI
    let {mixes, remainingPmts} = generateMixes({payments, paymentsPerMix: constants.NUM_PMTS_PER_MIX})
    console.log(`Generated ${mixes.length} mixes for ${queueKey}. ${remainingPmts.length} remaining payments`)
    Async.parallel({
        readdPayments: (cb) => {
            let batch = redis.multi()
            remainingPmts.forEach(pmt => {
                batch.lpush(queueKey, pmt)
            })
            batch.exec(cb)
        },
        startMixes: (cb) => {
            Async.map(
                mixes,
                (mix, ccb) => {
                    Request.post({
                        uri: startMixUri,
                        method: 'POST',
                        body: JSON.stringify(mix),
                        json: true,
                    }, ccb)
                },
                cb
            )
        },
    }, done)
}

function flushQueue(queueKey, done) {
    console.log(`Flushing queue ${queueKey}`)
    Async.waterfall([
        (cb) => {
            redis.multi()
                .lrange(queueKey, 0, -1)
                .del(queueKey)
                .exec(cb)
        },
        ([pmts, _], cb) => {
            if (pmts.length < constants.NUM_PMTS_PER_MIX) {
                return cb()
            }
            startMixes(queueKey, pmts, cb)
        },
    ], done)
}

module.exports.entry = (event, context, done) => {
    Async.waterfall([
        (cb) => {
            redis.keys('pmtQueue:*', cb)
        },
        (queueKeys, cb) => {
            Async.each(queueKeys, flushQueue, cb)
        }
    ], (err) => {
        if (err) {
            return done(err)
        }
        done(null, {
            statusCode: 200,
            body: 'OK',
        })
    })
}
"use strict";

const Async = require('async')
const BigInt = require('big-integer')
const UUID = require('uuid')

const redis = require('../integration/redis')

const validateParams = require('../helpers/validateParams')
const splitPaymentSize = require('../helpers/splitPaymentSize')
const convertStroops = require('../helpers/convertStroops')
const constants = require('../constants')
const signingPrivPmt = require('../helpers/signingPrivPmt')

module.exports.entry = (event, context, done) => {
    let payment;
    try {
        payment = JSON.parse(event.body)
    } catch (e) {
        return done(null, {
            statusCode: 400,
            body: 'Invalid JSON body',
        })
    }

    const missing = validateParams(payment, ['source', 'destination', 'size', 'signature'])
    if (missing.length > 0) {
        const error = `Missing params: ${missing.join(',')}`;
        return done(null, {
            statusCode: 400,
            body: error,
        })
    }
    if (!payment.size instanceof String) {
        return done(null, {
            statusCode: 400,
            body: "Payment size must be string",
        })
    }
    try {
        if (!signingPrivPmt.verify(payment)) {
            return done(null, {
                statusCode: 400,
                body: "Signature does not match payment source"
            })
        }
    } catch (e) {
        return done(null, {
            statusCode: 400,
            body: `Error verifying signature: ${e}`
        })
    }
    let totalPaymentSize = convertStroops.fromString(payment.size)
    let paymentSizes
    try {
        paymentSizes = splitPaymentSize({
            paymentSize: totalPaymentSize,
            denominations: constants.SUPPORTED_DENOMINATIONS,
            limit: constants.DEFAULT_SPLIT_LIMIT,
        })
    } catch (e) {
        return done(null, {
            statusCode: 400,
            body: `Error splitting payments: ${e}`
        })
    }
    if (paymentSizes.length === 0) {
        return done(null, {
            statusCode: 400,
            body: `Payment size too low: ${payment.size}`
        })
    }
    let totalAfterSplitting = convertStroops.toString(paymentSizes.reduce((a, s) => a.plus(s), BigInt(0)))
    const rootUid = UUID.v4()
    let privPmts = paymentSizes.map(paymentSize => {
        const chunkUid = UUID.v4()
        const privPmtId = `${rootUid}_${chunkUid}`
        return {
            id: privPmtId,
            source: payment.source,
            destination: payment.destination,
            size: convertStroops.toString(paymentSize),
        }
    })
    Async.each(
        privPmts,
        (privPmt, cb) => {
            Async.series({
                setPrivPmt: tcb =>
                    redis.setex(`privPmt:${privPmt.id}`, constants.REDIS_TTL, JSON.stringify(privPmt), tcb),
                addToPmtQueue: tcb =>
                    redis.rpush(`pmtQueue:${privPmt.size}`, privPmt.id, tcb),
                checkPmtQueue: tcb => {
                    redis.llen(`pmtQueue:${privPmt.size}`, (err, len) => {
                        console.log(`${len} queued payments of size ${privPmt.size}`)
                        tcb(err)
                    })
                }
            }, (err) => {
                if (err) {
                    return cb(err)
                }
                cb()
            })
        },
        (err) => {
            if (err) {
                return done(err)
            }
            const httpResponse = {
                statusCode: 200,
                body: JSON.stringify({
                    total: totalAfterSplitting.toString(),
                    id: rootUid,
                }),
            }
            done(null, httpResponse)
        })
}
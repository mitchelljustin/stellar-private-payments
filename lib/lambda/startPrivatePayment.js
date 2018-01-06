"use strict";

const Async = require('async')
const BigInt = require('big-integer')
const UUID = require('uuid')

const redis = require('../integration/redis')
const stellar = require('../integration/stellar')

const validateParams = require('../helpers/validateParams')
const splitPaymentSize = require('../helpers/splitPaymentSize')
const constants = require('../constants')

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

    const missing = validateParams(payment, ['source', 'destination', 'size'])
    if (missing.length > 0) {
        const error = `Missing params: ${missing.join(',')}`;
        return done(null, {
            statusCode: 400,
            body: error,
        })
    }
    let paymentSizes
    try {
        paymentSizes = splitPaymentSize({
            paymentSize: payment.size,
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
    let totalAfterSplitting = paymentSizes.reduce((a, s) => a.plus(s), BigInt(0))
    let privPmts = paymentSizes.map(paymentSize => {
        const privPmtId = UUID.v4()
        return {
            id: privPmtId,
            source: payment.source,
            destination: payment.destination,
            size: paymentSize.toString(),
        }
    })
    Async.map(
        privPmts,
        (privPmt, cb) => {
            redis.setex(`privPmt:${privPmt.id}`, constants.PAYMENT_TTL,  JSON.stringify(privPmt),(err) => {
                cb(err, privPmt.id)
            })
        },
        (err, privPmtIds) => {
            if (err) {
                done(err)
            } else {
                const httpResponse = {
                    statusCode: 200,
                    body: JSON.stringify({
                        total: totalAfterSplitting.toString(),
                        privPmtIds: privPmtIds,
                    }),
                };
                done(null, httpResponse)
            }
        })
}
"use strict";

const Async = require('async')
const UUID = require('uuid')
const Stellar = require('stellar-sdk')
const shuffleArray = require('shuffle-array')
const {encode: encodeBuffer} = require('base64-arraybuffer')

const redis = require('../integration/redis')
const {stellar} = require('../integration/stellar')
const generateMixes = require('../helpers/generateMixes')
const constants = require('../constants')

function createMixTx(mix, done) {
    let sources, destinations, size
    Async.waterfall([
        (cb) => {
            let batch = redis.multi()
            for (let pmtId of mix.payments) {
                batch.get(`privPmt:${pmtId}`)
            }
            batch.exec(cb)
        },
        (payments, cb) => {
            payments = payments.map(JSON.parse)
            sources = payments.map(p => p.source)
            destinations = payments.map(p => p.destination)
            size = payments[0].size
            shuffleArray(sources)
            shuffleArray(destinations)
            let transactionSource = sources[0];
            stellar.loadAccount(transactionSource)
                .then((acc) => cb(null, acc), (err) => cb(err))
        },
        (account, cb) => {
            let builder = new Stellar.TransactionBuilder(account)
            let jsonTx = []
            for (let i = 0; i < sources.length; i++) {
                let source = sources[i]
                let destination = destinations[i]
                builder.addOperation(Stellar.Operation.payment({
                    source: source,
                    destination: destination,
                    amount: size,
                    asset: Stellar.Asset.native(),
                }))
                jsonTx.push({source, destination, amount: size})
            }
            let tx = builder.build()
            let xdr = encodeBuffer(tx.toEnvelope().toXDR())
            let mixTxId = UUID.v4()
            console.log(`Created mixTx:${mixTxId} for payments: ${mix.payments.join(', ')}.\nXDR: ${xdr}`)

            let batch = redis.multi()
            for (let pmtId of mix.payments) {
                batch.setex(`privPmt:${pmtId}:mixTx`, constants.REDIS_TTL, mixTxId)
            }
            batch.setex(`mixTx:${mixTxId}`, constants.REDIS_TTL, xdr);
            batch.exec(cb)
        }
    ], done)
}

function startMixes(queueKey, payments, done) {
    console.log(`Flushing ${payments.length} payments`)
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
            Async.map(mixes, createMixTx, cb)
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
"use strict";

const Async = require('async')
const Stellar = require('stellar-sdk')
const UUID = require('uuid')
const shuffleArray = require('shuffle-array')
const {encode: encodeBuffer} = require('base64-arraybuffer')

const redis = require('../integration/redis')
const stellar = require('../integration/stellar')

module.exports.entry = (event, context, done) => {
    console.log("Starting mix")
    done(null, {
        statusCode: 200,
        body: 'OK',
    })
    const mix = JSON.parse(event['body'])
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

            let batch = redis.multi()
            for (let pmtId of mix.payments) {
                batch.set(`privPmt:${pmtId}:mixTx`, mixTxId)
            }
            batch.set(`mixTx:${mixTxId}`, xdr)
            batch.exec(cb)
        }
    ], (err) => {
        if (err) {
            console.error(err)
        }
    })
}
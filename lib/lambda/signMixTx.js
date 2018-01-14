"use strict";

const Async = require("async");
const Base64 = require('base64-arraybuffer')

const {Stellar, stellar} = require('../integration/stellar')
const redis = require('../integration/redis')
const validateParams = require('../helpers/validateParams')
const constants = require('../constants')

module.exports.entry = (event, context, done) => {
    const privPmtId = event.pathParameters.id
    let body
    try {
        body = JSON.parse(event.body)
    } catch (e) {
        return done(null, {
            statusCode: 400,
            body: 'Invalid JSON body',
        })
    }

    let missing = validateParams(body, ['signature'])
    if (missing.length > 0) {
        return done(null, {
            statusCode: 400,
            body: `Missing parameters: ${missing}`
        })
    }
    const signatureXdr = body.signature;
    let signature
    try {
        signature = Stellar.xdr.DecoratedSignature.fromXDR(Base64.decode(signatureXdr))
    } catch (e) {
        return done(null, {
            statusCode: 400,
            body: `Invalid signature. Signature must be an XDR of a DecoratedSignature`
        })
    }
    let mixTxId, tx
    Async.waterfall([
        cb => {
            redis.get(`privPmt:${privPmtId}:mixTx`, (err, txId) => {
                if (err) {
                    return cb({
                        statusCode: 500,
                        body: `Error: ${err}`,
                    })
                }
                if (txId === null) {
                    return cb({
                        statusCode: 404,
                        body: `Transaction not found for payment: ${privPmtId}`,
                    })
                }
                mixTxId = txId
                cb()
            })
        },
        (cb) => {
            redis.get(`mixTx:${mixTxId}`, cb)
        },
        (txXdr, cb) => {
            if (txXdr === '') {
                return cb({
                    statusCode: 400,
                    body: "Transaction already submitted"
                })
            }
            tx = new Stellar.Transaction(txXdr)
            let signedPayment = null
            for (let payment of tx.operations) {
                let pubKey = Stellar.Keypair.fromPublicKey(payment.source)
                if (pubKey.verify(tx.hash(), signature.signature())) {
                    signedPayment = payment
                    break
                }
            }
            if (signedPayment === null) {
                return cb({
                    statusCode: 400,
                    body: "Signature does not match any public keys in transaction"
                })
            }
            let batch = redis.multi()
            batch.hset(`mixTx:${mixTxId}:signatures`, signedPayment.source, signatureXdr)
            batch.expire(`mixTx:${mixTxId}:signatures`, constants.REDIS_TTL)
            batch.hlen(`mixTx:${mixTxId}:signatures`)
            batch.hgetall(`mixTx:${mixTxId}:signatures`)
            batch.exec(cb)
        },
        ([_1, _2, numSignatures, signatureMap], cb) => {
            if (numSignatures === tx.operations.length) {
                console.log(`Transaction ${mixTxId} is signed`)
                tx.signatures = Object.values(signatureMap)
                    .map(sig => Stellar.xdr.DecoratedSignature.fromXDR(Base64.decode(sig)))
                stellar.submitTransaction(tx)
                    .then(() => {
                        console.log(`Transaction ${mixTxId} submitted to network`)
                        redis.setex(`mixTx:${mixTxId}`, constants.REDIS_TTL, '', cb)
                    })
                    .catch((e) => {
                        console.error(`Error submitting transaction: ${JSON.stringify(e.data.extras.result_codes)}`)
                        cb({
                            statusCode: 500,
                            body: "Error submitting transaction"
                        })
                    })
            } else {
                cb()
            }
        }
    ], (err) => {
        if (err) {
            return done(null, err)
        }
        done(null, {
            statusCode: 200,
            body: 'OK'
        })
    })
}
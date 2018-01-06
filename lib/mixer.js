"use strict";

const Redlock = require('redlock')
const Stellar = require('stellar-sdk')
const shuffleArray = require('shuffle-array')
const uuidv4 = require('uuid/v4')

const stellar = require('./stellar')
const db = require('./redis')

const RINGSIZE = 4
const MIX_TRANSACTION_EXPIRY_SECS = 60 * 10

const SUPPORTED_PAYMENT_AMOUNTS = [
    100,
    1000,
]

class Mixer {
    constructor(db, stellar) {
        this.db = db
        this.redlock = new Redlock([this.db])
        this.stellar = stellar
    }

    _addPaymentToRing(paymentId, pmtSize) {
        console.log(`Adding payment ${paymentId} to ${pmtSize}XLM queue`)
        return this.db.rpushAsync(`pmtSize:${pmtSize}:queue`, paymentId)

    }

    closeRing(paymentIds) {
        console.log(`Mixing payments: ${paymentIds.map(id => id.slice(0, 8))}`)
        let mixTxId = uuidv4()
        let batchGet = this.db.multi()
        paymentIds.forEach((paymentId) => {
            batchGet.get(`payment:${paymentId}`)
        })
        batchGet.execAsync()
            .then((payments) => {
                if (payments.some(pmt => pmt === null)) {
                    throw `Payment in ring has expired. Cancelling mix transaction`
                }
                payments = payments.map(pmt => JSON.parse(pmt))
                let amount = payments[0].amount
                let senders = payments.map(pmt => pmt.sender)
                let receivers = payments.map(pmt => pmt.receiver)
                shuffleArray(senders)
                shuffleArray(receivers)
                let mixedPmts = senders.map((sender, i) => {
                    return {
                        sender: sender,
                        receiver: receivers[i],
                    }
                })
                let sourceAcctId = senders[0]
                return Promise.all([
                    Promise.resolve(amount),
                    Promise.resolve(mixedPmts),
                    this.stellar.loadAccount(sourceAcctId),
                ])
            })
            .then(([amount, payments, sourceAcct]) => {
                let transaction = new Stellar.TransactionBuilder(sourceAcct, {
                    fee: 100,
                })
                console.log(`Mixed ${amount}XLM transaction:`)
                payments.forEach((pmt) => {
                    console.log(`${pmt.sender} -> ${pmt.receiver}`)
                    transaction.addOperation(Stellar.Operation.payment({
                        source: pmt.sender,
                        destination: pmt.receiver,
                        amount: amount,
                        asset: Stellar.Asset.native(),
                    }))
                })
                let txRaw = transaction.build()
                let envelope = txRaw.toEnvelope()
                let envelopeStr = JSON.stringify(envelope)
                let batch = this.db.multi()
                batch.setex(`mix_tx:${mixTxId}`, MIX_TRANSACTION_EXPIRY_SECS, envelopeStr)
                paymentIds.forEach(pmtId => {
                    batch.setex(`payment:${pmtId}:tx`, MIX_TRANSACTION_EXPIRY_SECS, mixTxId)
                    batch.del(`payment:${pmtId}`)
                })
                return batch.execAsync()
            })
            .then(() => {
                console.log(`Created mix transaction mix_tx:${mixTxId}`)
            })
    }

    startPrivatePayment(args) {
        const sender = args.sender
        const receiver = args.receiver
        const amount = parseInt(args.amount)
        if (SUPPORTED_PAYMENT_AMOUNTS.indexOf(amount) === -1) {
            return Promise.reject(`Unsupported payment amount: ${amount}`)
        }
        const ringId = `ring:${amount}`
        const paymentId = uuidv4()
        const payment = JSON.stringify({
            sender, receiver, amount,
        })
        return db.setexAsync(`payment:${paymentId}`, 3600, payment)
            .then(() => {
                return this.redlock.lock(`${ringId}:lock`, 1000)
            })
            .then((lock) => {
                return this._addPaymentToRing(paymentId, ringId)
                    .then(() => {
                        return lock.unlock()
                    })
            })
            .then(() => {
                return paymentId
            })
    }

    getPrivatePayment(args) {
        const paymentId = args.paymentId
        return this.db.getAsync(`payment:${paymentId}`)
            .then((payment) => {
                if (payment === null) {
                    throw 'Payment does not exist'
                }
                return payment
            })
    }

    getMixTransaction(args) {
        const paymentId = args.paymentId
        return this.db.getAsync(`payment:${paymentId}:tx`)
            .then((mixTxId) => {
                if (mixTxId === null) {
                    return null
                }
                return this.db.getAsync(`mix_tx:${mixTxId}`)
            })
            .then((envelopeStr) => {
                if (envelopeStr === null) {
                    return "null"
                }
                return envelopeStr
            })

    }

    signMixTransaction(args) {
        const mixTxId = args.mixTxId
        const signature = args.signature


        return Promise.resolve()
    }
}

module.exports = new Mixer(db, stellar)
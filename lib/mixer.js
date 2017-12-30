"use strict";

const Redlock = require('redlock')
const Stellar = require('stellar-sdk')
const shuffleArray = require('shuffle-array')
const uuidv4 = require('uuid/v4')

const stellar = require('./stellar')
const db = require('./redis');

const RINGSIZE = 2

const SUPPORTED_PAYMENT_AMOUNTS = [
    1000,
]

class Mixer {
    constructor(db, stellar) {
        this.db = db
        this.redlock = new Redlock([this.db])
        this.stellar = stellar
    }

    _addPaymentToRing(paymentId, ringId) {
        console.log(`Adding payment ${paymentId} to ${ringId}`)
        return this.db.rpushAsync(`${ringId}:payments`, paymentId)
            .then(() => {
                return this.db.lrangeAsync(`${ringId}:payments`, 0, -1)
            })
            .then((paymentIds) => {
                if (paymentIds.length === RINGSIZE) {
                    this._closeRing(paymentIds)
                    return this.db.delAsync(`${ringId}:payments`)
                } else {
                    console.log(`${ringId} at ${paymentIds.length}/${RINGSIZE}`)
                    return Promise.resolve()
                }
            })
    }

    _closeRing(paymentIds) {
        console.log(`Closing ring with payments: ${paymentIds}`)
        let mixTxId = uuidv4()
        let batchGet = this.db.multi()
        paymentIds.forEach((paymentId) => {
            batchGet.get(`payment:${paymentId}`)
        })
        batchGet.execAsync()
            .then((payments) => {
                payments = payments.map(pmt => JSON.parse(pmt))
                let amount = payments[0].amount;
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
                let sourceAcctId = senders[0];
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
                return this.db.set(`tx:${mixTxId}`, envelope)
            })
            .then(() => {
                let batchSet = this.db.multi()
                paymentIds.forEach(pmtId => {
                    batchSet.set(`payment:${pmtId}:tx`, mixTxId)
                    batchSet.del(`payment:${pmtId}`)
                })
                return batchSet.execAsync()
            })
            .then(() => {
                console.log(`Created mix transaction tx:${mixTxId}`)
            })
    }

    startPrivatePayment(args) {
        const sender = args.sender
        const receiver = args.receiver
        const amount = args.amount
        const amountInt = parseInt(amount)
        if (SUPPORTED_PAYMENT_AMOUNTS.indexOf(amountInt) === -1) {
            return Promise.reject(`Unsupported payment amount: ${amount}`)
        }
        const ringId = `ring:${amountInt}`
        const paymentId = uuidv4()
        const payment = JSON.stringify({
            sender, receiver, amount,
        });
        return db.setAsync(`payment:${paymentId}`, payment)
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
                return JSON.parse(payment)
            })
    }

    getMixTransaction(args) {
        return Promise.resolve()
    }

    postSignedTransaction(args) {
        return Promise.resolve()
    }
}

module.exports = new Mixer(db, stellar)
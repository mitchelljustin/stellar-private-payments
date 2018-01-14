#!/usr/bin/env node
"use strict";

const program = require('commander')

const {Stellar} = require('../lib/integration/stellar')
const Base64 = require('base64-arraybuffer')

program
    .option('-x, --xdr [string]')
    .option('-s, --secret [string]')
    .parse(process.argv)

const tx = new Stellar.Transaction(program.xdr)
const keypair = Stellar.Keypair.fromSecret(program.secret)

let signature = keypair.signDecorated(tx.hash())
console.log(Base64.encode(signature.toXDR()))



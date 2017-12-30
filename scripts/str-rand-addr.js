#!/usr/bin/env node
"use strict";
const Stellar = require('stellar-sdk')

console.log(Stellar.Keypair.random().publicKey())
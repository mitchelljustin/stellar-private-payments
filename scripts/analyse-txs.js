"use strict";

const minAmt = parseFloat(process.argv[2])
const power = parseFloat(process.argv[3])

const Stellar = require('stellar-sdk')
const FS = require('fs')


Stellar.Network.useTestNetwork()
const stellar = new Stellar.Server('https://horizon.stellar.org')

let distrib = {}
const powerLog = Math.log(power);
const minAmtLog = Math.log(minAmt);

let i = 0
stellar.payments()
    .cursor('65571752912388096')

    .stream({
        onmessage(pmt) {
            let amount = parseFloat(pmt.amount || pmt.starting_balance)
            let pmtCat
            if (amount < minAmt) {
                pmtCat = `0 - ${minAmt}`
            } else {
                let pmtCatFloat = (Math.log(amount) - minAmtLog) / powerLog
                let pmtCatNum = Math.floor(pmtCatFloat)
                const lower = minAmt * Math.pow(power, pmtCatNum);
                const upper = minAmt * Math.pow(power, pmtCatNum + 1);
                pmtCat = `${lower.toFixed(1)} - ${upper}`
            }
            distrib[pmtCat] = (distrib[pmtCat] || 0) + 1
            console.log(`${amount} in ${pmtCat} (${distrib[pmtCat]})`)
            i += 1
            if (i % 20 === 0) {
                FS.writeFileSync(`distrib-${minAmt}-${power}.json`, JSON.stringify(distrib, null, 2))
            }
        },
    })
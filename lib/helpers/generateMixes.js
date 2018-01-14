"use strict";


module.exports = function startMixes({payments, paymentsPerMix}) {
    let mixes = []
    let remainingPmts = payments.slice(0)
    while (true) {
        let includedRootIds = {}
        let mix = {
            payments: [],
        }
        let skippedPmts = []
        while (remainingPmts.length > 0) {
            let pmtId = remainingPmts.shift()
            let [rootUid, _] = pmtId.split('_')
            if (!includedRootIds[rootUid]) {
                includedRootIds[rootUid] = true
                mix.payments.push(pmtId)
                if (mix.payments.length === paymentsPerMix) {
                    break
                }
            } else {
                skippedPmts.push(pmtId)
            }
        }
        remainingPmts = remainingPmts.concat(skippedPmts)
        if (mix.payments.length === paymentsPerMix) {
            mixes.push(mix)
        } else {
            remainingPmts = remainingPmts.concat(mix.payments)
            break
        }
    }
    return {
        mixes,
        remainingPmts,
    }
}
"use strict";

const BigInt = require('big-integer')

module.exports = ({paymentSize, denominations, limit}) => {
    if (limit === undefined) {
        limit = 5
    }
    let totalSize = BigInt(paymentSize)
    let sizes = []
    for (let denom of denominations) {
        const size = BigInt(denom);
        let {quotient, remainder} = totalSize.divmod(size)
        while (quotient.greater(0)) {
            sizes.push(size)
            if (sizes.length > limit) {
                throw new Error(`Number of payments over limit=${limit}`)
            }
            quotient = quotient.prev()
        }
        totalSize = remainder
    }
    return sizes
}
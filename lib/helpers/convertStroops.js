'use strict'
const BigInt = require('big-integer')

module.exports = {
    fromString(str) {
        if (!str instanceof String) {
            throw new Error("Input must be string")
        }
        let parts = str.split('.')
        let integer, mantissa
        if (parts.length === 1) {
            [integer] = parts
            mantissa = 0
        } else if (parts.length === 2) {
            [integer, mantissa] = parts
            if (mantissa.length > 7) {
                throw new Error(`Mantissa too long: ${str}`)
            }
            while (mantissa.length < 7) {
                mantissa += '0'
            }
        } else {
            throw new Error(`Invalid size string: ${str}`)
        }
        let stroops = BigInt(integer).multiply(1e7).add(BigInt(mantissa))
        if (stroops < 0) {
            throw new Error(`Amount of stroops can't be negative: ${str}`)
        }
        return stroops
    },
    toString(size) {
        let {quotient, remainder} = BigInt(size).divmod(1e7)
        let integer = quotient.toString()
        let mantissa = remainder.toString()
        while (mantissa.length < 7) {
            mantissa += '0'
        }
        return `${integer}.${mantissa}`
    }
}
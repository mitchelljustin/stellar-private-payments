"use strict";

module.exports = function validateParams(params, requiredParams) {
    let missing = []

    requiredParams.forEach(reqParam => {
        if (params[reqParam] === undefined) {
            missing.push(reqParam)
        }
    })
    return missing
}
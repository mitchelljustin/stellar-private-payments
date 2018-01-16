"use strict";

const convertStroops = require("./helpers/convertStroops")

module.exports = {
    SUPPORTED_DENOMINATIONS: [
        "100.0",
        "25.0",
        "5.0",
    ].map(convertStroops.fromString),
    DEFAULT_SPLIT_LIMIT: 8,
    REDIS_TTL: 24 * 60 * 60,

    NUM_PMTS_PER_MIX: 4,
}


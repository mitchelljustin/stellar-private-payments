"use strict";

module.exports = {
    SUPPORTED_DENOMINATIONS: [
        "100e7",
        "25e7",
        "5e7",
    ],
    DEFAULT_SPLIT_LIMIT: 8,
    REDIS_TTL: 24 * 60 * 60,

    NUM_PMTS_PER_MIX: 4,
}


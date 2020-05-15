'use strict'

const adParser = require('./ad-parser')

function parseSingleMessage(textMsg) {
    const match = textMsg.match(/^\$(.+),([0-9a-fA-F]{12}),([0-9a-fA-F]{12}),(-?\d+),([0-9a-fA-F,.]+)$/)
    if (match) {
        const log = {
            type: match[1],
            beacon: match[2],
            gateway: match[3],
            rssi: parseInt(match[4], 10),
            fullMessage: textMsg,
            timestamp: Date.now() // UTC millinseconds
        }
        let payload = match[5]
        const tsmatch = match[5].match(/^([0-9a-fA-F]+),([0-9.]+)/)
        if (tsmatch) {
            payload = tsmatch[1]
            log.timestamp = parseInt(tsmatch[2], 0)
            if (log.timestamp < Math.floor(Date.now()) + (365 * 24 * 3600)) {
                // the unit of textMsg's timestamp is second, convert it
                log.timestamp = log.timestamp * 1000
            }
        }
        log.advertisement = new adParser(payload)
        return log
    }
    throw new Error(`Invalid format: ${textMsg}`)
}

/**
 * Parse Ingics gateway message(s)
 * @param text Full text from Ingis gateway reported
 * @param callback CB for each single message parsed with single parameter (data, index)
 */
exports.parse = (text, callback) => {
    var data = []
    try {
        // Try to parse messages in JSON string format
        data = JSON.parse(text).data
    } catch (err) {
        // JSON parse fail, assum its simple text message splite by (CR)LF
        data = text.split(/\r?\n/)
    }
    // pase all messages
    var index = 0
    for (const msg of data) {
        if (msg.length === 0) {
            continue
        }
        callback(parseSingleMessage(msg), index++)
    }
}

const time = require('time')
const payloadParser = require('./payload-parser')

function parseSingleMessage(textMsg) {
    const match = textMsg.match(/^\$(.+),([0-9a-fA-F]{12}),([0-9a-fA-F]{12}),(-?\d+),([0-9a-fA-F,.]+)$/)
    if (match) {
        const log = {
            type: match[1],
            beacon: match[2],
            gateway: match[3],
            rssi: parseInt(match[4], 10),
            payload: match[5],
            raw: textMsg,
            timestamp: Date.now() // UTC millinseconds
        }
        const tsmatch = match[5].match(/^([0-9a-fA-F]+),([0-9.]+)/)
        if (tsmatch) {
            log.payload = tsmatch[1]
            log.timestamp = parseInt(tsmatch[2], 0)
            if (log.timestamp < time.time() + (365 * 24 * 3600)) {
                // the unit of textMsg's timestamp is second, convert it
                log.timestamp = log.timestamp * 1000
            }
        }
        try {
            var parsedData = payloadParser.parse(log.payload)
            log.parsedPayload = parsedData
        } catch (err) {
            log.parsedPayload = ''
        }
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

const payloadParser = require('./payload-parser')

function parseSingleMessage(msg) {
    const match = msg.match(/^\$(.+),([0-9a-fA-F]{12}),([0-9a-fA-F]{12}),(-?\d+),([0-9a-fA-F,.]+)$/)
    if (match) {
        var log = {
            type: match[1],
            beacon: match[2],
            gateway: match[3],
            rssi: parseInt(match[4], 10),
            payload: match[5],
            raw: msg,
            timestamp: ''
        }
        const tsmatch = match[5].match(/^([0-9a-fA-F]+),([0-9.]+)/)
        if (tsmatch) {
            log.payload = tsmatch[1]
            log.timestamp = tsmatch[2]
        }
        try {
            var parsedData = payloadParser.parse(log.payload)
            log.parsedPayload = parsedData
        } catch (err) {
            log.parsedPayload = ''
        }
        return log
    }
    throw new Error(`Invalid message format: ${msg}`)
}

/**
 * Parse Ingics gateway message(s)
 * @param message Full text message from Ingis Gateway
 * @param callback CB for each single message parsed with single parameter (data, index)
 */
exports.parse = (message, callback) => {
    var data = []
    try {
        // Try to parse messages in JSON string format
        data = JSON.parse(message).data
    } catch (err) {
        // JSON parse fail, assum its simple text message splite by (CR)LF
        data = message.split(/\r?\n/)
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

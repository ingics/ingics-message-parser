'use strict'

const adParser = require('./ad-parser')
const gnssParser = require('./gnss-parser')

const bleMessageTypes = [
    'GPRP', // BLE4.2 General Purpose Report
    'RSPR', // BLE4.2 Scan Response Report
    'LRAD', // BLE 5 Long Range ADV
    'LRSR', // BLE 5 Long Range Scan Response
    '1MAD', // BLE 5 1M ADV
    '1MSR'  // BLE 5 1M Scan Response
]

/**
 * Note:
 * Actually there is one more type called SRRP (BLE4.2 Scan Response Report for iGS02X)
 * The payload contaions ADV + Scan Response, that cause there maybe duplicated MSD in payload.
 * Current parser cannot handle this case, so we ignore the SRRP here.
 */

function parseSingleMessage(textMsg) {
    const match = textMsg.match(/^\$(.+),([0-9a-fA-F]{12}),([0-9a-fA-F]{12}),(-?\d+),(.*)$/)
    if (match) {
        const log = {
            type: match[1],
            beacon: match[2],
            gateway: match[3],
            rssi: parseInt(match[4], 10),
            fullMessage: textMsg,
            timestamp: Date.now() // UTC millinseconds
        }
        // Parse BLE Payload
        if (bleMessageTypes.includes(log.type)) {
            let payload = match[5]
            const tsmatch = match[5].match(/^([0-9a-fA-F]*),([0-9..]+)$/)
            if (tsmatch) {
                if (tsmatch[2].indexOf('.') !== -1) {
                    log.timestamp = parseInt(tsmatch[2].replace('.', ''), 10)
                } else {
                    log.timestamp = parseInt(tsmatch[2], 10) * 1000
                }
                payload = tsmatch[1]
            }
            log.advertisement = new adParser(payload)
        }
        // Parse GPS (GNSS) Record
        else if (log.type === 'GPSR') {
            log.gnss = new gnssParser(match[5])
            if ('timestamp' in log.gnss) {
                log.timestamp = log.gnss.timestamp
                delete(log.gnss.timestamp)
            }
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
    let messages = []
    try {
        // Try to parse messages in JSON string format
        messages = JSON.parse(text).data
    } catch (err) {
        // JSON parse fail, assum its simple text message splite by (CR)LF
        messages = text.split(/\r?\n/)
    }
    // pase all messages
    const result = [] 
    for (const msg of messages) {
        if (msg.length === 0) {
            continue
        }
        const parsed = parseSingleMessage(msg)
        result.push(parsed)
        if (callback) {
            callback(parsed, result.length - 1)
        }
    }
    return result
}

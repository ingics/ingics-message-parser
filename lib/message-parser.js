'use strict'

const ibs = require('./ibs-parser')
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
 * The payload contains ADV + Scan Response, that cause there maybe duplicated MSD in payload.
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
            timestamp: Date.now() // UTC milliseconds
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
 * Mapping for iGS03 new JSON to parser object
 * @param {object} obj iGS03 new JSON format (build-in parser)
 * @returns Parsed result
 */
function mappingIgsJson(obj) {
    const keys = Object.keys(obj)
    if (keys.includes('reader') && keys.includes('tag') && keys.includes('rssi') && keys.includes('type')) {
        const log = {
            type: 'JSON',
            beacon: obj.tag,
            gateway: obj.reader,
            rssi: obj.rssi,
            fullMessage: JSON.stringify(obj),
            timestamp: Object.keys(obj).includes('ts') ? obj.ts * 1000 : Date.now(),
            advertisement: {
                raw: Object.keys(obj).includes('raw_data') ? obj.raw_data : null,
                flags: undefined,
                localName: undefined,
                txPowerLevel: undefined,
                serviceData: [],
                serviceUuids: [],
                serviceSolicitationUuids: [],
                manufacturerData: {
                    type: obj.type,
                    company: undefined
                }
            }
        }
        if (obj.type.startsWith('iBS') || obj.type.startsWith('iRS')) {
            log.advertisement.manufacturerData.company = 'Ingics'
        } else if (obj.type === 'iBeacon') {
            log.advertisement.manufacturerData.company = 'Apple, Inc.'
        }
        // sensor attributes
        if (Object.keys(obj).includes('temperature_ext')) {
            obj.tempertatureExt = obj.tempertature_ext
        }
        ibs.supportSensorList().forEach((k) => {
            if (Object.keys(obj).includes(k)) {
                log.advertisement.manufacturerData[k] = obj[k]
            }
        })
        // event attributes
        if (Object.keys(obj).includes('move')) {
            obj.moving = obj.mov
        }
        ibs.supportEventList().forEach((k) => {
            if (Object.keys(obj).includes(k)) {
                if (typeof log.advertisement.manufacturerData.events === 'undefined') {
                    log.advertisement.manufacturerData.events = {}
                }
                log.advertisement.manufacturerData.events[k] = obj[k]
            }
        })
        // accel & accels
        if (Object.keys(obj).includes('accel')) {
            log.advertisement.manufacturerData.accel = obj.accel
        }
        if (Object.keys(obj).includes('accels')) {
            log.advertisement.manufacturerData.accels = obj.accels
        }
        return log
    }
    throw new Error(`Invalid format: ${JSON.stringify(obj)}`)
}

/**
 * Parse Ingics gateway message(s)
 * @param text Full text from Ingics gateway reported
 * @param callback CB for each single message parsed with single parameter (data, index)
 */
exports.parse = (text, callback) => {
    let messages = []
    try {
        // Try to parse messages in JSON string format
        const fullMsgObj = JSON.parse(text)
        const objKeys = Object.keys(fullMsgObj)
        if (objKeys.includes('data') && Array.isArray(fullMsgObj.data)) {
            messages = fullMsgObj.data
        } else if (objKeys.includes('reader') && objKeys.includes('tag') && objKeys.includes('rssi') && objKeys.includes('type')) {
            messages.push(fullMsgObj)
        }
    } catch (err) {
        // JSON parse fail, assume its simple text message split by (CR)LF
        messages = text.split(/\r?\n/)
    }
    // pase all messages
    const result = []
    for (const msg of messages) {
        if (msg.length === 0) {
            continue
        }
        if (typeof msg === 'string') {
            const parsed = parseSingleMessage(msg)
            result.push(parsed)
            if (callback) {
                callback(parsed, result.length - 1)
            }
        } else {
            const parsed = mappingIgsJson(msg)
            result.push(parsed)
            if (callback) {
                callback(parsed, result.length - 1)
            }
        }
    }
    return result
}

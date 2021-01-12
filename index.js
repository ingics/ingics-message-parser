const messageParser = require('./lib/message-parser')
const ad = require('./lib/ad-parser')
const msd = require('./lib/msd-parser')
const ibs = require('./lib/ibs-parser')

function parsePayload (payload) {
    return new ad(payload)
}

function parseMsd (data) {
    if (typeof data === 'string') {
        return new msd(Buffer.from(data, 'hex'))
    } else if (Buffer.isBuffer(data)) {
        return new msd(data)
    }
}

function supportEventList () {
    return ibs.supportEventList()
}

function supportSensorList () {
    return ibs.supportSensorList()
}

module.exports = {
    parseMessage: messageParser.parse,
    parsePayload,
    parseMsd,
    supportSensorList,
    supportEventList
}

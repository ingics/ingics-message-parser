const messageParser = require('./lib/message-parser')
const ad = require('./lib/ad-parser')
const msd = require('./lib/msd-parser')

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

module.exports = {
    parseMessage: messageParser.parse,
    parsePayload,
    parseMsd
}

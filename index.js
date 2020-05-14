const messageParser = require('./lib/message-parser')
const adParser = require('./lib/ad-parser')

function parsePayload (payload) {
    return new adParser(payload)
}

module.exports = {
    parseMessage: messageParser.parse,
    parsePayload: parsePayload
}

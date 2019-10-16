const messageParser = require('./lib/message-parser');
const payloadParser = require('./lib/payload-parser');

module.exports = {
    parseMessage: messageParser.parse,
    parsePayload: payloadParser.parse
}

const payloadParser = require('./payload-parser');

function parseSingleMessage(msg) {
    const match = msg.match(/^\$(.+),([0-9a-fA-F]{12}),([0-9a-fA-F]{12}),(-?\d+),([0-9a-fA-F]+)(,(.+))?/);
    if (match) {
        const log = {
            type: match[1],
            beacon: match[2],
            gateway: match[3],
            rssi: parseInt(match[4], 10),
            payload: match[5],
            timestamp: (match[7]) ? parseInt(match[7], 10) : Math.round(Date.now() / 1000) // in second
        };
        try {
            var parsedData = payloadParser.parse(log.payload);
            log.parsedPayload = parsedData;
        } catch (err) {
            log.parsedPayload = '';
        }
        return log;
    }
    throw new Error('Invalid message format');
}

/**
 * Parse Ingics gateway message(s)
 * @param message Full text message from Ingis Gateway
 * @param callback CB for each single message parsed with single parameter (data, index)
 */
exports.parse = (message, callback) => {
    var data = [];
    try {
        // Try to parse messages in JSON string format
        data = JSON.parse(message).data;
    } catch (err) {
        // JSON parse fail, assum its simple text message splite by (CR)LF
        data = message.split(/\r?\n/);
    }
    // pase all messages
    var index = 0;
    for (const msg of data) {
        callback(parseSingleMessage(msg), index++);
    }
}

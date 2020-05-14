'use strict'

exports.buffToUuid = function (buffer) {
    return (
        buffer.slice(0, 4).toString('hex') + '-' +
        buffer.slice(4, 6).toString('hex') + '-' +
        buffer.slice(6, 8).toString('hex') + '-' +
        buffer.slice(8, 10).toString('hex') + '-' +
        buffer.slice(10).toString('hex')
    ).toUpperCase()
}

exports.companyName = function (id) {
    // https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/
    const companyIds = require('./company-identifiers.json')
    if (id in companyIds) {
        return companyIds[id].name
    }
    return undefined
}

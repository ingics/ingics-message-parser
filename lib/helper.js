'use strict'

exports.buffToUuid = function (b) {
    return (
        b.slice(0, 4).toString('hex') + '-' +
        b.slice(4, 6).toString('hex') + '-' +
        b.slice(6, 8).toString('hex') + '-' +
        b.slice(8, 10).toString('hex') + '-' +
        b.slice(10).toString('hex')
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

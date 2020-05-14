'use strict'

const helper = require('./helper')
const msdParser = require('./msd-parser')

function ad (payload) {
    this.raw = Buffer.from(payload, 'hex')
    this.flags = undefined
    this.localName = undefined
    this.txPowerLevel = undefined
    this.manufacturerData = undefined
    this.serviceData = []
    this.serviceUuids = []
    this.serviceSolicitationUuids = []
    this.parse()
}

ad.prototype.parse = function () {
    let i = 0
    let length = this.raw.length
    while (i < length) {
        const packetLength = this.raw[i++]
        const adType = this.raw[i++]
        const adData = this.raw.slice(i, i + packetLength - 1)
        switch (adType) {
        case 0x01:
            this.flags = adData.readUInt8()
            break
        case 0x03:
            this.serviceUuids.push(adData.reverse().toString('hex').toUpperCase())
            break
        case 0x07:
            helper.buffToUuid(adData)
            break
        case 0x08:
        case 0x09:
            this.localName = adData.toString('utf8')
            break
        case 0x0A:
            this.txPowerLevel = adData.readInt8()
            break
        case 0x16:
            this.serviceData.push({
                uuid: adData.slice(0, 2).reverse().toString('hex').toUpperCase(),
                data: adData.slice(2)
            })
            break
        case 0x14:
        case 0x1F:
            this.serviceSolicitationUuids.push(adData.reverse().toString('hex').toUpperCase())
            break
        case 0x15:
            this.serviceSolicitationUuids.push(helper.buffToUuid(adData))
            break
        case 0x20:
            this.serviceData.push({
                uuid: adData.alice(0, 4).reverse().toString('hex').toUpperCase(),
                data: adData.alice(4)
            })
            break
        case 0x21:
            this.serviceData.push({
                uuid: helper.buffToUuid(adData.alice(0, 16)),
                data: adData.alice(16)
            })
            break
        case 0xFF:
            this.manufacturerData = new msdParser(adData)
            break
        }
        i += packetLength - 1
    }
}

module.exports = ad

// https://www.bluetooth.com/specifications/assigned-numbers/generic-access-profile/
// exports.adTypeName = function (adType) {
//     switch (adType) {
//     case 0x01: return 'Flags'
//     case 0x03: return 'Complete List of 16-bit Service Class UUIDs'
//     case 0x07: return 'Complete List of 128-bit Service Class UUIDs'
//     case 0x08: return 'Shortened Local Name'
//     case 0x09: return 'Complete Local Name'
//     case 0x0A: return 'Tx Power Level'
//     case 0x0D: return 'Class of Device'
//     case 0x14: return 'List of 16-bit Service Solicitation UUIDs'
//     case 0x15: return 'List of 128 bit Service Solicitation UUIDs'
//     case 0x16: return 'Service Data - 16-bit UUID'
//     case 0x1F: return 'List of 32-bit Service Solicitation UUIDs'
//     case 0x20: return 'Service Data - 32-bit UUID'
//     case 0x21: return 'Service Data - 128-bit UUID'
//     case 0xFF: return 'Manufacturer Specific Data'
//     default: return `Unknown ${adType}`
//     }
// }

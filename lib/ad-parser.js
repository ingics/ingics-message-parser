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
        if (packetLength === 0) {
            // special handling to 00 length,
            // seems some beacon will append some 00 at the end of payload
            continue
        }
        const adType = this.raw[i++]
        const adData = this.raw.slice(i, i + packetLength - 1)
        if (adData.length != packetLength -1) {
            this.error = `Incomplete adv detected: ${this.raw.slice(i - 2, i + packetLength - 1).toString('hex').toUpperCase()}`
            break
        }
        switch (adType) {
        case 0x01:
            this.flags = adData.readUInt8(0)
            break
        case 0x02:
        case 0x03:
            console.log(`adData length: ${adData.length}`)
            if (adData.length % 2 != 0) {
                this.error = `Invalid 16bit UUID List: ${adData.toString('hex').toUpperCase()}`
                break
            }
            for (let j = 0; j < adData.length; j += 2) {
                this.serviceUuids.push(adData.slice(j, j+2).reverse().toString('hex').toUpperCase())
            }
            break
        case 0x04:
        case 0x05:
            if (adData.length % 4 != 0) {
                this.error = `Invalid 32bit UUID List: ${adData.toString('hex').toUpperCase()}`
                break
            }
            for (let j = 0; j < adData.length; j += 4) {
                this.serviceUuids.push(adData.slice(j, j+4).reverse().toString('hex').toUpperCase())
            }
            break
        case 0x06:
        case 0x07:
            if (adData.length % 16 != 0) {
                this.error = `Invalid 128bit UUID List: ${adData.toString('hex').toUpperCase()}`
                break
            }
            for (let j = 0; j < adData.length; j += 16) {
                this.serviceUuids.push(helper.buffToUuid(adData.slice(j, j+16)))
            }
            break
        case 0x08:
        case 0x09:
            this.localName = adData.toString('utf8')
            break
        case 0x0A:
            this.txPowerLevel = adData.readInt8(0)
            break
        case 0x16:
            {
                const uuid = adData.readUInt16LE(0)
                this.serviceData.push({
                    uuid: uuid,
                    data: adData.slice(2)
                })
                switch (uuid) {
                case 0x2AC3:
                    // org.bluetooth.characteristic.object_id
                    this.objectId = adData.slice(2).reverse().toString('hex').toUpperCase()
                    break
                case 0x2A6E:
                    // org.bluetooth.characteristic.temperature
                    this.temperature = adData.readInt16LE(2) / 100
                    this.temperatureUnit = 'C'
                    break
                case 0x2A1F:
                    // org.bluetooth.unit.thermodynamic_temperature.degree_celsius
                    this.temperature = adData.readInt16LE(2) / 10
                    this.temperatureUnit = 'C'
                    break
                case 0x2A20:
                    // org.bluetooth.unit.thermodynamic_temperature.degree_fahrenheit
                    this.temperature = adData.readInt16LE(2) / 10
                    this.temperatureUnit = 'F'
                    break
                case 0x2A6F:
                    // org.bluetooth.characteristic.humidity
                    this.humidity = adData.readInt16LE(2) / 100
                    break
                }
            }
            break
        case 0x14:
        case 0x1F:
            this.serviceSolicitationUuids.push(adData.reverse().toString('hex').toUpperCase())
            break
        case 0x15:
            this.serviceSolicitationUuids.push(helper.buffToUuid(adData))
            break
        case 0x19:
            this.appearance = (function (val) {
                const appearances = require('./appearance.json')
                return (`${val}` in appearances) ? appearances[`${val}`] : `${val}`
            })(adData.readUInt16LE(0))
            break
        case 0x20:
            this.serviceData.push({
                uuid: adData.slice(0, 4).reverse().toString('hex').toUpperCase(),
                data: adData.slice(4)
            })
            break
        case 0x21:
            this.serviceData.push({
                uuid: helper.buffToUuid(adData.slice(0, 16)),
                data: adData.slice(16)
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
//     case 0x02: return 'Incomplete List of 16-bit Service Class UUIDs'
//     case 0x03: return 'Complete List of 16-bit Service Class UUIDs'
//     case 0x04: return 'Incomplete List of 32-bit Service Class UUIDs'
//     case 0x05: return 'Complete List of 32-bit Service Class UUIDs'
//     case 0x06: return 'Incomplete List of 128-bit Service Class UUIDs'
//     case 0x07: return 'Complete List of 128-bit Service Class UUIDs'
//     case 0x08: return 'Shortened Local Name'
//     case 0x09: return 'Complete Local Name'
//     case 0x0A: return 'Tx Power Level'
//     case 0x0D: return 'Class of Device'
//     case 0x14: return 'List of 16-bit Service Solicitation UUIDs'
//     case 0x15: return 'List of 128 bit Service Solicitation UUIDs'
//     case 0x16: return 'Service Data - 16-bit UUID'
//     case 0x19: return 'Appearance'
//     case 0x1F: return 'List of 32-bit Service Solicitation UUIDs'
//     case 0x20: return 'Service Data - 32-bit UUID'
//     case 0x21: return 'Service Data - 128-bit UUID'
//     case 0xFF: return 'Manufacturer Specific Data'
//     default: return `Unknown ${adType}`
//     }
// }

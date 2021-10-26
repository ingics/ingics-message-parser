'use strict'

const helper = require('./helper')

function msd (msdBuf) {
    if (Buffer.isBuffer(msdBuf)) {
        this.raw = msdBuf
        this.mfg = msdBuf.readUInt16LE(0)
        this.company = helper.companyName(this.mfg)
        if (this.mfg === 0x06) {
            this.microsoft()
        } else if (this.mfg === 0x4C) {
            this.apple()
        } else {
            // try alt beacon parser
            this.altBeacon()
            // try ingics beacon parser
            const ibs = require('./ibs-parser').parse.bind(this)
            ibs()
        }
    } else if (typeof msdBuf === 'object') {
        const obj = msdBuf
        this.type = (obj.type === 'Unknown') ? undefined : obj.type,
        this.company = undefined
        if (obj.type.startsWith('iBS') || obj.type.startsWith('iRS')) {
            const ibs = require('./ibs-parser')
            this.company = 'Ingics'
            // sensor attributes
            if (Object.keys(obj).includes('temperature_ext')) {
                obj.tempertatureExt = obj.tempertature_ext
            }
            ibs.supportSensorList().forEach((k) => {
                if (Object.keys(obj).includes(k)) {
                    this[k] = obj[k]
                }
            })
            // event attributes
            if (Object.keys(obj).includes('move')) {
                obj.moving = obj.mov
            }
            ibs.supportEventList().forEach((k) => {
                if (Object.keys(obj).includes(k)) {
                    if (typeof this.events === 'undefined') {
                        this.events = {}
                    }
                    this.events[k] = obj[k]
                }
            })
            // accel & accels
            if (Object.keys(obj).includes('accel')) {
                this.accel = obj.accel
            }
            if (Object.keys(obj).includes('accels')) {
                this.accels = obj.accels
            }
        } else if (obj.type === 'iBeacon') {
            this.company = 'Apple, Inc.'
            this.uuid = obj.uuid.substr(0, 8) + '-' +
                obj.uuid.substr(8, 4) + '-' +
                obj.uuid.substr(12, 4) + '-' +
                obj.uuid.substr(16, 4) + '-' + obj.uuid.substr(20)
            this.major = obj.major
            this.minor = obj.minor
            this.tx = obj.tx_power
        }
    } else {
        throw new Error('Invalid MSD buffer')
    }
}

// parse microsoft device type
// https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cdp/77b446d0-8cea-4821-ad21-fabdf4d9a569
msd.prototype.microsoft = function () {
    this.scenario = this.raw.readUInt8(2)
    this.typeId = this.raw.readUInt8(3) & 0x3F
    this.type = (v => {
        switch (v) {
        case 1: return 'XBox One'
        case 6: return 'Apple Phone'
        case 7: return 'Apple iPad'
        case 8: return 'Android device'
        case 9: return 'Windows 10 Desktop'
        case 11: return 'Windows 10 Phone'
        case 12: return 'Linus device'
        case 13: return 'Windows IoT'
        case 14: return 'Surface Hub'
        default: return ''
        }
    })(this.typeId)
    this.slat = this.raw.slice(6, 10).toString('hex').toUpperCase()
    this.deviceHash = this.raw.slice(10).toString('hex').toUpperCase()
}

// parser for iBeacon
msd.prototype.apple = function () {
    this.typeId = this.raw.readUInt8(2)
    this.type = undefined
    if (this.typeId === 0x02 && this.raw.length === 25) {
        this.type = 'iBeacon'
        this.uuid = helper.buffToUuid(this.raw.slice(4, 20))
        this.major = this.raw.readUInt16BE(20)
        this.minor = this.raw.readUInt16BE(22)
        this.tx = this.raw.readInt8(24)
    } else {
        // unknown device type ...
    }
}

// helper funciton for checking device type
msd.prototype.is = function (target) {
    target = target.toLowerCase()
    if (target === 'ingics') {
        return (this.company === 'Ingics')
    } else {
        return (this.type && this.type.toLowerCase().startsWith(target.toLowerCase()))
    }
}

// parser for altBeacon
// https://github.com/AltBeacon/spec
msd.prototype.altBeacon = function () {
    if (this.raw.length >=4 && this.raw.readUInt16LE(2) === 0xACBE) {
        this.type = 'altBeacon'
        this.code = 0xACBE
        this.id = this.raw.slice(4, 24).toString('hex').toUpperCase()
        this.refrssi = this.raw.readInt8(24)
        this.mfgReserved = this.raw.slice(25).toString('hex').toUpperCase()
    }
}

module.exports = msd

'use strict'

const bitButton = 0
const bitMoving = 1
const bitHall = 2
const bitFall = 3
const bitPIR = 4
const bitIR = 5
const bitMatt = 6

const ibsEventMap = new Map([
    [ bitButton, 'button' ],
    [ bitMoving, 'moving' ],
    [ bitHall, 'hall' ],
    [ bitFall, 'fall' ],
    [ bitPIR, 'detect' ],
    [ bitIR, 'detect' ],
    [ bitMatt, 'matt' ]
])

const ibsFeatureMap = new Map([
    [ 0x01, { name: 'iBS02PIR', temp: false, humidity: false, events: [ bitPIR ] } ],
    [ 0x02, { name: 'iBS02IR', temp: false, humidity: false, events: [ bitIR ] } ],
    [ 0x03, { name: 'iBS01', temp: false, humidity: false, events: [] } ],
    [ 0x04, { name: 'iBS01H', temp: false, humidity: false, events: [ bitHall ] } ],
    [ 0x05, { name: 'iBS01T', temp: true, humidity: true, events: [] } ],
    [ 0x06, { name: 'iBS01G', temp: false, humidity: false, events: [ bitMoving, bitFall ] } ],
    [ 0x07, { name: 'iBS01T', temp: true, humidity: false, events: [] } ],
    [ 0x10, { name: 'iBS03', temp: false, humidity: false, events: [ bitButton, bitHall ] } ],
    [ 0x14, { name: 'iBS03T', temp: true, humidity: true, events: [ bitButton ] } ],
    [ 0x15, { name: 'iBS03T', temp: true, humidity: false, events: [ bitButton ] } ],
    [ 0x16, { name: 'iBS03G', temp: false, humidity: false, events: [ bitButton, bitMoving, bitFall ] } ],
    [ 0x17, { name: 'iBS03TP', temp: true, humidity: true, events: [ bitButton ] } ],
    [ 0x18, { name: 'iBS04i', temp: false, humidity: false, events: [ bitButton ] } ],
    [ 0x19, { name: 'iBS04', temp: false, humidity: false, events: [ bitButton ] } ],
    [ 0x20, { name: 'iRS02', temp: true, humidity: false, events: [ bitHall ] } ],
    [ 0x21, { name: 'iRS02TP', temp: true, humidity: true, events: [ bitHall ] } ],
    [ 0x22, { name: 'iRS02RG', temp: false, humidity: false, events: [ bitHall ], accel: true } ]
])

// common ibs parser
function ibs () {
    this.company = 'Ingics'
    this.code = this.raw.readUInt16LE(2)
    this.battery = this.raw.readInt16LE(4) / 100
    this.user = this.raw.readInt16LE(11)
    this.events = {}
    this.eventFlag = 0

    const subtype = this.raw.readUInt8(13)
    const feature = ibsFeatureMap.get(subtype)
    if (feature) {
        this.type = feature.name
        if (feature.temp) {
            this.temperature = this.raw.readInt16LE(7) / 100
        }
        if (feature.humidity) {
            // dirty code for special handle TP
            // (dual temperature sensors, but reuse humidity fields)
            if (subtype === 0x17 || subtype === 0x21) {
                this.temperatureExt = this.raw.readInt16LE(9) / 100
            } else {
                this.humidity = this.raw.readInt16LE(9)
            }
        }
        if (feature.events) {
            this.eventFlag = this.raw.readUInt8(6)
            ibsEventMap.forEach((value, key) => {
                if (feature.events.includes(key)) {
                    this.events[value] = (this.eventFlag & (1 << key)) !== 0
                }
            })
        }
        if (feature.accel) {
            this.accel = {
                x: this.raw.readInt16LE(7),
                y: this.raw.readInt16LE(9),
                z: this.raw.readInt16LE(11)
            }
        }
    } else {
        this.type = 'Unknown'
    }

    const extraFlag = this.raw.readUInt8(14)
    this.events['boot'] = (extraFlag & 0x10) !== 0x00
}

// special parser for IBS02 Series for RS
function rs () {
    const subtype = this.raw.readUInt8(13)
    const eventFlag = this.raw.readUInt8(6)
    const extraFlag = this.raw.readUInt8(14)
    this.company = 'Ingics'
    this.code = this.raw.readUInt16LE(2)
    this.type = (function (subtype) {
        switch (subtype) {
        case 0x01: return 'iBS02PIR-RS'
        case 0x02: return 'iBS02IR-RS'
        case 0x04: return 'iBS02HM'
        default: return 'iBS02RS'
        }
    })(subtype)
    this.battery = this.raw.readUInt16LE(4) / 100
    this.user = this.raw.readUInt16LE(11)
    this.eventFlag = eventFlag
    this.events = {
        sensor: (eventFlag & 0x04) !== 0x00,
        boot: (extraFlag & 0x10) !== 0x00
    }
}

// iBSXXRG (3 accel data) parser
function rg () {
    this.company = 'Ingics'
    // 5900 81BC -> iBS01RG
    // 0D00 81BC -> iBS03RG
    this.code = this.raw.readUInt16LE(2)
    this.type = (function (mfg) {
        return (mfg === 0x59) ? 'iBS01RG' : 'iBS03RG'
    })(this.mfg)
    const battActFlag = this.raw.readUInt16LE(4)
    this.battery = (battActFlag & 0x0FFF) / 100
    this.eventFlag = (battActFlag & 0xF000) >> 12
    this.events = {
        button: (battActFlag & 0x2000) !== 0,
        moving: (battActFlag & 0x1000) !== 0
    }
    this.accel = [
        {
            x: this.raw.readInt16LE(6),
            y: this.raw.readInt16LE(8),
            z: this.raw.readInt16LE(10)
        },{
            x: this.raw.readInt16LE(12),
            y: this.raw.readInt16LE(14),
            z: this.raw.readInt16LE(16)
        },{
            x: this.raw.readInt16LE(18),
            y: this.raw.readInt16LE(20),
            z: this.raw.readInt16LE(22)
        }
    ]
}

// ibs01 parser
function ibs01 () {
    const subtype = this.raw.readUInt8(13)
    if (subtype === 0xff || subtype === 0x00) {
        // old iBS1 firmware, subtype is not avaiable
        this.company = 'Ingics'
        this.code = this.raw.readUInt16LE(2)
        this.battery = this.raw.readUInt16LE(4) / 100
        this.events = {}
        this.eventFlag = 0
        if ((this.raw.length > 7) && this.raw[7] !== 0xFF && this.raw[8] !== 0xFF) {
            // has temperature, should be iBS01T (including humidity sensor)
            this.type = 'iBS01T'
            this.temperature = this.raw.readInt16LE(7) / 100
            this.humidity = this.raw.readInt16LE(9)
        } else {
            // others, I cannot detect the real type from payload
            // collect all possible sensor data
            this.eventFlag = this.raw.readUInt8(6)
            this.type = 'iBS01'
            this.events = {
                button: (this.eventFlag & (1 << bitButton)) !== 0,
                moving: (this.eventFlag & (1 << bitMoving)) !== 0,
                hall: (this.eventFlag & (1 << bitHall)) !== 0,
                fall: (this.eventFlag & (1 << bitFall)) !== 0
            }
        }
    } else {
        /// good, goto normal payload parser
        ibs.bind(this)()
    }
}

exports.parse = function () {
    if (this.raw.length >= 4) {
        const code = this.raw.readUInt16LE(2)
        if (this.mfg === 0x59 && code === 0xBC80) {
            // iBS01(H/G/T)
            ibs01.bind(this)()
        } else if (this.mfg === 0x59 && code === 0xBC81) {
            // iBS01RG
            rg.bind(this)()
        } else if (this.mfg === 0x0D && code === 0xBC83) {
            // iBS02/iBS03/iBS04
            ibs.bind(this)()
        } else if (this.mfg === 0x0D && code === 0xBC82) {
            // iBS02 for RS
            rs.bind(this)()
        } else if (this.mfg === 0x0D && code === 0xBC81) {
            // iBS03RG
            rg.bind(this)()
        }
    }
}

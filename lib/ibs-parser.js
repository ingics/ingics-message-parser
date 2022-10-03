'use strict'

const bitButton = 0
const bitMoving = 1
const bitHall = 2
const bitFall = 3
const bitPIR = 4
const bitIR = 5
const bitDin = 6

const ibsEventMap = new Map([
    [ bitButton, 'button' ],
    [ bitMoving, 'moving' ],
    [ bitHall, 'hall' ],
    [ bitFall, 'fall' ],
    [ bitPIR, 'pir' ],
    [ bitIR, 'ir' ],
    [ bitDin, 'din' ]
])

const fieldDefs = new Map([
    [ 'humidity', { name: 'humidity', divisor: 1 } ],
    [ 'tempExt', { name: 'temperatureExt', divisor: 100 } ],
    [ 'tof', { name: 'range', divisor: 1 } ],
    [ 'counter', { name: 'counter', divisor: 1 } ],
    [ 'co2', { name: 'co2', divisor: 1 } ]
])

const ibs01FeatureMap = new Map([
    [ 0x03, { name: 'iBS01', temp: false, humidity: false, events: [ bitButton ] } ],
    [ 0x04, { name: 'iBS01H', temp: false, humidity: false, events: [ bitButton, bitHall ] } ],
    [ 0x05, { name: 'iBS01T', temp: true, humidity: 'humidity', events: [ bitButton ] } ],
    [ 0x06, { name: 'iBS01G', temp: false, humidity: false, events: [ bitButton, bitMoving, bitFall ] } ],
    [ 0x07, { name: 'iBS01T', temp: true, humidity: false, events: [ bitButton ] } ]
])

const ibsFeatureMap = new Map([
    [ 0x01, { name: 'iBS02PIR2', temp: false, humidity: false, events: [ bitPIR ] } ],
    [ 0x02, { name: 'iBS02IR2', temp: false, humidity: 'counter', events: [ bitIR ] } ],
    [ 0x04, { name: 'iBS02M2', temp: false, humidity: 'counter', events: [ bitDin ] } ],
    [ 0x10, { name: 'iBS03', temp: false, humidity: false, events: [ bitButton, bitHall ] } ],
    [ 0x12, { name: 'iBS03P', temp: true, humidity: 'tempExt', events: [] }],
    [ 0x13, { name: 'iBS03R', temp: false, humidity: 'tof', events: [] } ],
    [ 0x14, { name: 'iBS03T', temp: true, humidity: 'humidity', events: [ bitButton ] } ],
    [ 0x15, { name: 'iBS03T', temp: true, humidity: false, events: [ bitButton ] } ],
    [ 0x16, { name: 'iBS03G', temp: false, humidity: false, events: [ bitButton, bitMoving, bitFall ] } ],
    [ 0x17, { name: 'iBS03TP', temp: true, humidity: 'tempExt', events: [] } ],
    [ 0x18, { name: 'iBS04i', temp: false, humidity: false, events: [ bitButton ] } ],
    [ 0x19, { name: 'iBS04', temp: false, humidity: false, events: [ bitButton ] } ],
    [ 0x1A, { name: 'iBS03RS', temp: false, humidity: 'tof', events: [] } ],
    [ 0x20, { name: 'iRS02', temp: true, humidity: false, events: [ bitHall ] } ],
    [ 0x21, { name: 'iRS02TP', temp: true, humidity: 'tempExt', events: [ bitHall ] } ],
    [ 0x22, { name: 'iRS02RG', temp: false, humidity: false, events: [ bitHall ], accel: true } ],
    [ 0x30, { name: 'iBS05', temp: false, humidity: false, events: [ bitButton ] } ],
    [ 0x31, { name: 'iBS05H', temp: false, humidity: false, events: [ bitButton, bitHall ] }],
    [ 0x32, { name: 'iBS05T', temp: true, humidity: false, events: [ bitButton ] } ],
    [ 0x33, { name: 'iBS05G', temp: false, humidity: false, events: [ bitButton, bitMoving ] } ],
    [ 0x34, { name: 'iBS05CO2', temp: false, humidity: 'co2', events: [ bitButton ]} ],
    [ 0x35, { name: 'iBS05i', temp: false, humidity: false, events: [ bitButton ] }],
    [ 0x36, { name: 'iBS06i', temp: false, humidity: false, events: [ bitButton ] }],
    [ 0x39, { name: 'iWS01', temp: true, humidity: 'humidity', events: [ bitButton ]}],
    [ 0x40, { name: 'iBS06', temp: false, humidity: false, events: [] }]
])

// common ibs parser
function ibs (featureMap) {
    this.company = 'Ingics'
    this.code = this.raw.readUInt16LE(2)
    this.battery = this.raw.readInt16LE(4) / 100
    this.user = this.raw.readInt16LE(11)
    this.events = {}
    this.eventFlag = 0

    const subtype = this.raw.readUInt8(13)
    const feature = featureMap.get(subtype)
    if (feature) {
        this.type = feature.name
        if (feature.temp) {
            if (this.raw[7] != 0xAA || this.raw[8] != 0xAA) {
                this.temperature = this.raw.readInt16LE(7) / 100
            }
        }
        if (feature.humidity) {
            const field = fieldDefs.get(feature.humidity)
            if (field && this.raw[9] != 0xFF && this.raw[10] != 0xFF) {
                this[field.name] = this.raw.readInt16LE(9) / field.divisor
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

function ibs07 () {
    this.company = 'Ingics'
    this.code = this.raw.readUInt16LE(2)
    this.battery = this.raw.readInt16LE(4) / 100

    const subtype = this.raw.readUInt8(19)
    if (subtype === 0x50) {
        this.type = 'iBS07'
        if (this.raw[7] != 0xAA || this.raw[8] != 0xAA) {
            this.temperature = this.raw.readInt16LE(7) / 100
            this.humidity = this.raw.readInt16LE(9)
            this.lux = this.raw.readInt16LE(11)
        }
        this.accel = {
            x: this.raw.readInt16LE(13),
            y: this.raw.readInt16LE(15),
            z: this.raw.readInt16LE(17),
        }
    }

    this.events = {}
    this.eventFlag = this.raw.readUInt8(6)
    this.events['button'] = (this.eventFlag & (1 << bitButton)) !== 0

    const extraFlag = this.raw.readUInt8(20)
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
        din: (eventFlag & 0x04) !== 0x00,
        boot: (extraFlag & 0x10) !== 0x00
    }
}

// iBSXXRG (3 accel data) parser
function rg () {
    this.company = 'Ingics'
    // 5900 81BC -> iBS01RG
    // 0D00 81BC -> iBS03RG
    // 0D00 85BC -> iBS03GP
    // 2C81 86BC -> iBS05RG
    this.code = this.raw.readUInt16LE(2)
    this.type = (function (mfg, code) {
        if (mfg === 0x59) {
            return 'iBS01RG'
        } else if (code == 0xBC81) {
            return 'iBS03RG'
        } else if (code == 0xBC86) {
            return 'iBS05RG'
        } else if (code == 0xBC85) {
            return 'iBS03GP'
        } else {
            return 'iBSXXRG'
        }
    })(this.mfg, this.code)
    const battActFlag = this.raw.readUInt16LE(4)
    this.battery = (battActFlag & 0x0FFF) / 100
    this.eventFlag = (battActFlag & 0xF000) >> 12
    this.events = {
        button: (battActFlag & 0x2000) !== 0,
        moving: (battActFlag & 0x1000) !== 0
    }
    this.accels = [
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
    if (this.type === 'iBS03GP') {
        this.gp = this.raw.readUInt16LE(24) / 50
    }
    if (this.type === 'iBS05RG') {
        const extraFlag = this.raw.readUInt8(24)
        this.events['boot'] = (extraFlag & 0x10) !== 0x00
    }
}

// ibs01 parser
function ibs01 () {
    const subtype = this.raw.readUInt8(13)
    if (subtype === 0xff || subtype === 0x00) {
        // old iBS1 firmware, subtype is not available
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
        ibs.bind(this)(ibs01FeatureMap)
    }
}

exports.parse = function () {
    if (this.raw.length >= 4) {
        const code = this.raw.readUInt16LE(2)
        if (this.mfg === 0x59 && code === 0xBC80) {
            // iBS01(H/G/T)
            ibs01.bind(this)()
        } else if (code === 0xBC81 || code == 0xBC85 || code == 0xBC86) {
            // 0xBC81: iBS01RG & iBS03RG
            // 0xBC85: iBS03GP
            // 0xBC86: iBS05RG
            rg.bind(this)()
        } else if (code === 0xBC82) {
            // iBS02 for RS
            rs.bind(this)()
        } else if (this.mfg === 0x0D && code === 0xBC83) {
            // iBS02/iBS03/iBS04
            ibs.bind(this)(ibsFeatureMap)
        } else if (this.mfg === 0x082C && code === 0xBC83) {
            // iBS05/iBS06
            ibs.bind(this)(ibsFeatureMap)
        } else if (this.mfg === 0x082C && code === 0xBC87) {
            // iBS07
            ibs07.bind(this)()
        }
    }
}

function supportEventList () {
    const events = []
    ibsEventMap.forEach((value, /*key*/) => {
        events.push(value)
    })
    // events.push('boot')
    return events
}

function supportSensorList () {
    return [ 'battery', 'temperature', 'temperatureExt', 'humidity', 'range', 'gp', 'counter', 'co2', 'lux' ]
}

exports.supportEventList = supportEventList
exports.supportSensorList = supportSensorList

exports.igsMapping = function (obj) {
    const mappings = {
        'temp': 'temperature',
        'xtemp': 'temperatureExt',
        'temp_ext': 'temperatureExt',
        'temperature_ext': 'temperatureExt',
        'vbatt': 'battery',
        'rh': 'humidity',
        'move': 'moving',
        'btn': 'button'
    }
    Object.keys(mappings).forEach(k => {
        if (Object.keys(obj).includes(k)) {
            obj[mappings[k]] = obj[k]
        }
    })
    this.company = 'Ingics'
    supportSensorList().forEach((k) => {
        if (Object.keys(obj).includes(k)) {
            this[k] = obj[k]
        }
    })
    supportEventList().forEach((k) => {
        if (Object.keys(obj).includes(k)) {
            if (typeof this.events === 'undefined') {
                this.events = {}
            }
            this.events[k] = obj[k]
        }
    })
    if (Object.keys(obj).includes('accel')) {
        this.accel = obj.accel
    }
    if (Object.keys(obj).includes('accels')) {
        this.accels = obj.accels
    }
}

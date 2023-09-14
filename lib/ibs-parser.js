'use strict'

const bitButton = 0
const bitMoving = 1
const bitHall = 2
const bitFall = 3
const bitPIR = 4
const bitIR = 5
const bitDin = 6
const bitDin2 = 3 // same bit as fall for iBS03QY
const bitDetect = 5 // same bit as IR for iBS08

const ibsEventMap = new Map([
    [ 'button', bitButton ],
    [ 'moving', bitMoving ],
    [ 'hall', bitHall ],
    [ 'fall', bitFall ],
    [ 'pir', bitPIR ],
    [ 'ir', bitIR ],
    [ 'din', bitDin ],
    [ 'detect', bitDetect ],
    [ 'din2', bitDin2 ],
    []
])

// eslint-disable-next-line no-unused-vars
function fieldDummy(_idx) {
    return 2
}

function fieldCo2(idx) {
    this.co2 = this.raw.readInt16LE(idx)
    if (this.co2 < 0) {
        delete this.co2 // invalid, remove it
    }
    return 2
}

function fieldCounter(idx) {
    this.counter = this.raw.readInt16LE(idx)
    if (this.counter < 0) {
        delete this.counter // invalid, remove it
    }
    return 2
}

function fieldRange(idx) {
    this.range = this.raw.readInt16LE(idx)
    if (this.range < 0) {
        delete this.range // invalid, remove it
    }
    return 2
}

function fieldTemp(idx) {
    if (this.raw.readUInt16LE(idx) !== 0xAAAA) {
        this.temperature = this.raw.readInt16LE(idx) / 100
    }
    return 2
}

function fieldTempEnv(idx) {
    if (this.raw.readUInt16LE(idx) !== 0xAAAA) {
        this.temperatureEnv = this.raw.readInt16LE(idx) / 100
    }
    return 2
}

function fieldTempExt(idx) {
    if (this.raw.readUInt16LE(idx) !== 0xAAAA) {
        this.temperatureExt = this.raw.readInt16LE(idx) / 100
    }
    return 2
}

function fieldHumidity(idx) {
    this.humidity = this.raw.readInt16LE(idx)
    if (this.humidity < 0 || this.humidity > 100) {
        delete this.humidity // invalid, remove it
    }
    return 2
}

function fieldHumidity1D(idx) {
    this.humidity = this.raw.readInt16LE(idx) / 10
    if (this.humidity < 0 || this.humidity > 100) {
        delete this.humidity // invalid, remove it
    }
    return 2
}

function fieldLux(idx) {
    this.lux = this.raw.readInt16LE(idx)
    if (this.lux < 0) {
        delete this.lux // invalid, remove it
    }
    return 2
}

function fieldUser(idx) {
    this.user = this.raw.readInt16LE(idx)
    return 2
}

function fieldAccel(idx) {
    this.accel = {
        x: this.raw.readInt16LE(idx),
        y: this.raw.readInt16LE(idx + 2),
        z: this.raw.readInt16LE(idx + 4)
    }
    return 6
}

function fieldsAccels(idx) {
    this.accels = []
    for (var i = 0; i < 3; i++) {
        this.accels.push({
            x: this.raw.readInt16LE(idx + i * 6),
            y: this.raw.readInt16LE(idx + i * 6 + 2),
            z: this.raw.readInt16LE(idx + i * 6 + 4)
        })
    }
    return 18
}


const ibs01FeatureMap = new Map([
    [ 0x03, { name: 'iBS01', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button' ] } ],
    [ 0x04, { name: 'iBS01H', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button', 'hall' ] } ],
    [ 0x05, { name: 'iBS01T', fields: [fieldTemp, fieldHumidity, fieldUser], events: [ 'button' ] } ],
    [ 0x06, { name: 'iBS01G', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button', 'moving', 'fall' ] } ],
    [ 0x07, { name: 'iBS01T', fields: [fieldTemp, fieldDummy, fieldUser], events: [ 'button' ] } ]
])

const ibsFeatureMap = new Map([
    [ 0x01, { name: 'iBS02PIR2', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'pir' ] } ],
    [ 0x02, { name: 'iBS02IR2', fields: [fieldDummy, fieldCounter, fieldUser], events: [ 'ir' ] } ],
    [ 0x04, { name: 'iBS02M2', fields: [fieldDummy, fieldCounter, fieldUser], events: [ 'din' ] } ],
    [ 0x10, { name: 'iBS03', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button', 'hall' ] } ],
    [ 0x12, { name: 'iBS03P', fields: [fieldTemp, fieldTempExt, fieldUser], events: [] }],
    [ 0x13, { name: 'iBS03R', fields: [fieldDummy, fieldRange, fieldUser], events: [] } ],
    [ 0x14, { name: 'iBS03T', fields: [fieldTemp, fieldHumidity, fieldUser], events: [ 'button' ] } ],
    [ 0x15, { name: 'iBS03T', fields: [fieldTemp, fieldDummy, fieldUser], events: [ 'button' ] } ],
    [ 0x16, { name: 'iBS03G', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button', 'moving', 'fall' ] } ],
    [ 0x17, { name: 'iBS03TP', fields: [fieldTemp, fieldTempExt, fieldUser], events: [] } ],
    [ 0x18, { name: 'iBS04i', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button' ] } ],
    [ 0x19, { name: 'iBS04', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button' ] } ],
    [ 0x1A, { name: 'iBS03RS', fields: [fieldDummy, fieldRange, fieldUser], events: [] } ],
    [ 0x1B, { name: 'iBS03F', fields: [fieldDummy, fieldCounter, fieldUser], events: [ 'din' ] } ],
    [ 0x1C, { name: 'iBS03Q', fields: [fieldDummy, fieldCounter, fieldUser], events: [ 'din'] } ],
    [ 0x1D, { name: 'iBS03QY', fields: [fieldDummy, fieldCounter, fieldUser], events: [ 'din', 'din2' ] } ],
    [ 0x20, { name: 'iRS02', fields: [fieldTemp, fieldDummy, fieldUser], events: [ 'hall' ] } ],
    [ 0x21, { name: 'iRS02TP', fields: [fieldTemp, fieldTempExt, fieldUser], events: [ 'hall' ] } ],
    [ 0x22, { name: 'iRS02RG', fields: [fieldAccel], events: [ 'hall' ] } ],
    [ 0x23, { name: 'iBS03NT', fields: [fieldDummy, fieldTempExt, fieldUser], events: [] } ],
    [ 0x30, { name: 'iBS05', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button' ] } ],
    [ 0x31, { name: 'iBS05H', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button', 'hall' ] }],
    [ 0x32, { name: 'iBS05T', fields: [fieldTemp, fieldDummy, fieldUser], events: [ 'button' ] } ],
    [ 0x33, { name: 'iBS05G', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button', 'moving' ] } ],
    [ 0x34, { name: 'iBS05CO2', fields: [fieldDummy, fieldCo2, fieldUser], events: [ 'button' ]} ],
    [ 0x35, { name: 'iBS05i', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button' ] }],
    [ 0x36, { name: 'iBS06i', fields: [fieldDummy, fieldDummy, fieldUser], events: [ 'button' ] }],
    [ 0x39, { name: 'iWS01', fields: [fieldTemp, fieldHumidity1D, fieldUser], events: [ 'button' ]}], // deprecated, reserved for backward compatibility
    [ 0x40, { name: 'iBS06', fields: [fieldDummy, fieldDummy, fieldUser], events: [] }],
    [ 0x48, { name: 'iBS08', fields: [fieldTempEnv, fieldTemp, fieldUser], events: [ 'detect' ] }],
])


// common ibs parser
function ibs (featureMap) {
    this.company = 'Ingics'
    this.code = this.raw.readUInt16LE(2)
    this.battery = this.raw.readInt16LE(4) / 100
    this.events = {}
    this.eventFlag = 0

    const subtype = this.raw.readUInt8(13)
    const feature = featureMap.get(subtype)
    if (feature) {
        this.type = feature.name
        let idx = 7
        feature.fields.forEach((field) => {
            idx += field.bind(this)(idx)
        })
        if (feature.events) {
            this.eventFlag = this.raw.readUInt8(6)
            ibsEventMap.forEach((value, key) => {
                if (feature.events.includes(key)) {
                    this.events[key] = (this.eventFlag & (1 << value)) !== 0
                }
            })
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
    switch (subtype) {
    case 0x39:
        this.type = 'iWS01'
        fieldTemp.bind(this)(7)
        fieldHumidity1D.bind(this)(9, 10)
        break
    case 0x50:
        this.type = 'iBS07'
        fieldTemp.bind(this)(7)
        if (Object.keys(this).includes('temperature')) {
            // normally means the sensor rod is not connected
            fieldHumidity.bind(this)(9, 1)
            fieldLux.bind(this)(11)
        }
        fieldAccel.bind(this)(13)
        break
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
        case 0x01: return 'iBS02PIR2-RS'
        case 0x02: return 'iBS02IR2-RS'
        case 0x04: return 'iBS02M2-RS'
        default: return 'iBS02-RS'
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
    fieldsAccels.bind(this)(6)
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
            // iBS05/iBS06/iBS08
            ibs.bind(this)(ibsFeatureMap)
        } else if (this.mfg === 0x082C && code === 0xBC87) {
            // iBS07/iWS01
            ibs07.bind(this)()
        }
    }
}

function supportEventList () {
    const events = []
    ibsEventMap.forEach((value, key) => {
        events.push(key)
    })
    return events
}

function supportSensorList () {
    return [
        'battery',
        'temperature',
        'temperatureExt',
        'temperatureEnv',
        'humidity',
        'range',
        'gp',
        'counter',
        'co2',
        'lux',
    ]
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

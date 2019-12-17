function findMsd(payload) {
    const payloadBuf = Buffer.from(payload, 'hex');
    var i = 0;
    var length = payloadBuf.length;
    while (i < length) {
        var packetLength = payloadBuf[i++];
        var type = payloadBuf[i++];
        var dataLen = packetLength - 1;
        if (type === 0xFF) {
            // found
            return payloadBuf.slice(i, i + dataLen);
        }
        i += dataLen;
    }
    return null;
}

const bitButton = 0
const bitMoving = 1
const bitHall = 2
const bitFall = 3
const bitPIR = 4
const bitIR = 5
const bitMatt = 6

function parseIBS01(data, mfgCode) {
    const subtype = data.readUInt8(13)
    if (subtype === 0xff || subtype === 0x00) {
        // old iBS1 firmware, subtype is not avaiable
        var result = {
            mfg: 'Ingics',
            mfgCode: mfgCode,
            battery: data.readUInt16LE(4),
            events: {},
            eventFlag: 0
        }
        if ((data.length > 7) && data[7] !== 0xFF && data[8] !== 0xFF) {
            // has temperature, should be iBS01T (including humidity sensor)
            result.type = 'iBS01T'
            result.temperature = data.readInt16LE(7)
            result.humidity = data.readInt16LE(9)
        } else {
            // others, I cannot detect the real type from payload
            // collect all possible sensor data
            const eventFlag = data.readUInt8(6)
            result.type = 'iBS01'
            result.events = {
                button: (eventFlag & (1 << bitButton)) !== 0,
                moving: (eventFlag & (1 << bitMoving)) !== 0,
                hall: (eventFlag & (1 << bitHall)) !== 0,
                fall: (eventFlag & (1 << bitFall)) !== 0
            }
            result.eventFlag = eventFlag
        }
        return result
    } else {
        /// good, goto normal payload parser
        return parseIBS(data, mfgCode)
    }
}

function parseIBSXXRG (data, mfgCode, beaconType) {
    const battActFlag = data.readUInt16LE(4)
    return {
        mfg: 'Ingics',
        mfgCode: mfgCode,
        type: beaconType,
        battery: (battActFlag & 0x3FFF),
        eventFlag: (battActFlag & 0xC000) >> 8,
        events: {
            button: (battActFlag & 0x8000) !== 0,
            moving: (battActFlag & 0x4000) !== 0
        },
        accel: [
            {
                x: data.readInt16LE(6),
                y: data.readInt16LE(8),
                z: data.readInt16LE(10)
            },
            {
                x: data.readInt16LE(12),
                y: data.readInt16LE(14),
                z: data.readInt16LE(16)
            },
            {
                x: data.readInt16LE(18),
                y: data.readInt16LE(20),
                z: data.readInt16LE(22)
            }
        ]
    }
}

function parseIBS (data, mfgCode) {
    const eventMap = new Map([
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
        [ 0x15, { name: 'iBS03T', temp: true, humidity: false, events: [ bitButton ] } ],
        [ 0x16, { name: 'iBS03G', temp: false, humidity: false, events: [ bitButton, bitMoving, bitFall ] } ],
        [ 0x17, { name: 'iBS03TP', temp: true, humidity: true, events: [ bitButton ] } ],
        [ 0x18, { name: 'iBS04i', temp: false, humidity: false, events: [ bitButton ] } ],
        [ 0x19, { name: 'iBS04', temp: false, humidity: false, events: [ bitButton ] } ],
        [ 0x20, { name: 'iRS02', temp: true, humidity: false, events: [ bitHall ] } ],
        [ 0x21, { name: 'iRS02TP', temp: true, humidity: true, events: [ bitHall ] } ],
        [ 0x22, { name: 'iRS02RG', temp: false, humidity: false, events: [ bitHall ], accel: true } ]
    ])

    var result = {
        mfg: 'Ingics',
        mfgCode: mfgCode,
        battery: data.readUInt16LE(4),
        user: data.readUInt16LE(11),
        events: {},
        eventFlag: 0,
        raw: data.toString('hex')
    }

    const subtype = data.readUInt8(13)
    const eventFlag = data.readUInt8(6)
    const extraFlag = data.readUInt8(14)
    const feature = ibsFeatureMap.get(subtype)

    result.events['boot'] = (extraFlag & 0x10) !== 0x00

    if (feature) {
        result.type = feature.name
        if (feature.temp) {
            result.temperature = data.readInt16LE(7)
        }
        if (feature.humidity) {
            // dirty code for special handle TP
            // (dual temperature sensors, but reuse humidity fields)
            if (subtype === 0x17 || subtype === 0x21) {
                result.temperature_ext = data.readInt16LE(9)
            } else {
                result.humidity = data.readInt16LE(9)
            }
        }
        if (feature.events) {
            result.eventFlag = eventFlag
            eventMap.forEach((value, key) => {
                if (feature.events.includes(key)) {
                    result.events[value] = (eventFlag & (1 << key)) !== 0
                }
            })
        }
        if (feature.accel) {
            result.accel = {
                x: data.readInt16LE(7),
                y: data.readInt16LE(9),
                z: data.readInt16LE(11)
            }
        }
    } else {
        // unknown subtype
        result.type = 'Unkonwn Tag'
    }

    return result
}

function parseIBSRS (data, mfgCode) {
    // special parser for IBS02 Series for RS
    const subtype = data.readUInt8(13)
    const eventFlag = data.readUInt8(6)
    const extraFlag = data.readUInt8(14)
    return {
        mfg: 'Ingics',
        mfgCode: mfgCode,
        type: (function (subtype) {
            switch (subtype) {
            case 0x01: return 'iBS02PIR-RS'
            case 0x02: return 'iBS02IR-RS'
            case 0x04: return 'iBS02HM'
            default: return 'iBS02RS'
            }
        })(subtype),
        battery: data.readUInt16LE(4),
        user: data.readUInt16LE(11),
        eventFlag: eventFlag,
        events: { sensor: (eventFlag & 0x04) !== 0x00, boot: (extraFlag & 0x10) !== 0x00 },
        raw: data.toString('hex')
    }
}

function parseMicrosoft (data, mfgCode) {
    return {
        mfg: 'Microsoft',
        mfgCode: mfgCode,
        type: ((v) => {
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
        })(data.readUInt8(3)),
        raw: data.toString('hex')
    }
}

function mfgDecode (value) {
    // decode some mfg codes, full list in below link
    // https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/
    switch (value) {
    case 0: return 'Ericsson'
    case 1: return 'Nokia'
    case 2: return 'Intel'
    case 3: return 'IBM'
    case 4: return 'Toshiba'
    case 6: return 'Microsoft'
    case 8: return 'Motorola'
    case 10: return 'Qualcomm'
    case 11: return 'Silicon Wave'
    case 13: return 'Texas Instruments'
    case 15: return 'Broadcom'
    case 29: return 'Qualcomm'
    case 37: return 'NXP'
    case 49: return 'Synopsys'
    case 76: return 'Apple'
    default:
        return '0x' + value.toString(16)
    }
}

function parseMsd(data) {
    const mfg = data.readUInt16LE(0);
    const type = (data.length >= 4) ? data.readUInt16LE(2) : 0;
    if (mfg === 0x59 && type === 0xBC80) {
        // iBS01(H/G/T)
        return parseIBS01(data, mfg)
    } else if (mfg === 0x59 && type === 0xBC81) {
        // iBS01RG
        return parseIBSXXRG(data, mfg, 'iBS01RG')
    } else if (mfg === 0x0D && type === 0xBC83) {
        // iBS02/iBS03/iBS04
        return parseIBS(data, mfg)
    } else if (mfg === 0x0D && type === 0xBC82) {
        // iBS02 for RS
        return parseIBSRS(data, mfg)
    } else if (mfg === 0x0D && type === 0xBC81) {
        // iBS03RG
        return parseIBSXXRG(data, mfg, 'iBS03RG')
    } else if (mfg === 0x4C && type === 0x1502) {
        // special handle for iBeacon
        const uuid = data.slice(4, 20).toString('hex')
        const major = data.readUInt16LE(20)
        const minor = data.readUInt16LE(22)
        const tx = data.readInt8(24)
        return {
            mfg: 'Apple',
            type: 'iBeacon',
            mfgCode: mfg,
            uuid: uuid,
            major: major,
            minor: minor,
            tx: tx,
            raw: data.toString('hex')
        }
    } else if (type === 0xACBE) {
        // special handle for altBeacon
        // https://github.com/AltBeacon/spec
        return {
            mfg: mfgDecode(mfg),
            mfgCode: mfg,
            type: 'altBeacon',
            id: data.slice(4, 24).toString('hex'),
            refrssi: data.readInt8(24),
            raw: data.toString('hex'),
            mfgReserved: data.slice(25).toString('hex')
        }
    } else if (mfg === 0x06) {
        // decode microsoft device type
        // https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cdp/77b446d0-8cea-4821-ad21-fabdf4d9a569
        return parseMicrosoft(data, mfg)
    } else {
        return {
            mfg: mfgDecode(mfg),
            mfgCode: mfg,
            type: '',
            raw: data.toString('hex')
        }
    }
}

/**
 *  Parse BLE payload from Ingics Beacon
 *  @param payload BLE payload in string format
 *  @return Parsed object
 */
exports.parse = (payload) => {
    const msdBuf = findMsd(payload);
    if (!msdBuf) {
        throw new Error('Cannot find MSD packet')
    }
    const parsedData = parseMsd(msdBuf);
    return parsedData;
}

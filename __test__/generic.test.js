const parser = require('..')

describe('generic ad test', () => {

    it ('LocalName', () => {
        const payload = '0B09506978656C203420584C'
        const advertisement = parser.parsePayload(payload)
        expect(advertisement.localName).toBe('Pixel 4 XL')
    })

    it ('TxPowerLevel', () => {
        const payload = '0B09506978656C203420584C020AF5'
        const advertisement = parser.parsePayload(payload)
        expect(advertisement.txPowerLevel).toBe(-11)
    })

    it ('org.bluetooth.characteristic.temperature', () => {
        const payload = '0B09506978656C203420584C05166E2A1111'
        const advertisement = parser.parsePayload(payload)
        expect(advertisement.serviceData[0].uuid).toBe(0x2A6E)
        expect(advertisement.serviceData[0].data.readInt16LE()).toBe(4369)
        expect(advertisement.temperature).toBe(43.69)
        expect(advertisement.temperatureUnit).toBe('C')
    })

    it ('org.bluetooth.characteristic.humidity', () => {
        const payload = '0B09506978656C203420584C05166F2A1111'
        const advertisement = parser.parsePayload(payload)
        expect(advertisement.serviceData[0].uuid).toBe(0x2A6F)
        expect(advertisement.serviceData[0].data.readInt16LE()).toBe(4369)
        expect(advertisement.humidity).toBe(43.69)
    })

    it ('16bit Service UUID', () => {
        const payload = '0B09506978656C203420584C0303011805166E2A1111'
        const advertisement = parser.parsePayload(payload)
        expect(advertisement.serviceUuids[0]).toBe('1801')
        const payload2 = '0B09506978656C203420584C05030118456705166E2A1111'
        const advertisement2 = parser.parsePayload(payload2)
        expect(advertisement2.serviceUuids[0]).toBe('1801')
        expect(advertisement2.serviceUuids[1]).toBe('6745')
    })

    it ('32bit Service UUID', () => {
        const payload = '0B09506978656C203420584C05050118456705166E2A1111'
        const advertisement = parser.parsePayload(payload)
        expect(advertisement.serviceUuids[0]).toBe('67451801')
        const payload2 = '0B09506978656C203420584C090501184567AABBCCDD05166E2A1111'
        const advertisement2 = parser.parsePayload(payload2)
        expect(advertisement2.serviceUuids[0]).toBe('67451801')
        expect(advertisement2.serviceUuids[1]).toBe('DDCCBBAA')
    })

    it ('128bit Service UUID', () => {
        const payload = '0201061107B4DF5A1C3F6BF4BFEA4A820304901A02'
        const advertisement = parser.parsePayload(payload)
        expect(advertisement.serviceUuids[0]).toBe('021A9004-0382-4AEA-BFF4-6B3F1C5ADFB4')
    })

    it ('Appearance', () => {
        const payload = '031980000201060E094E6F726469635F426C696E6B79'
        const advertisement = parser.parsePayload(payload)
        expect(advertisement.appearance).toBe('Generic Computer.')
    })

    it ('multi messages', () => {
        const messages = [
            '$GPRP,7ABA6F20ACCF,806172C89C09,-2,02010612FF590080BCFF00007A0D4300FFFFFFFFFFFF',
            '$GPRP,F704B6D48BE8,1173AE7325A2,-24,02010612FF590080BC2B0104FFFFFFFFFFFFFFFFFFFF'
        ]
        const logs = parser.parseMessage(messages.join('\r\n'))
        expect(logs).toHaveLength(2)
        expect(logs[0].advertisement.manufacturerData.humidity).toBe(67)
        expect(logs[0].advertisement.manufacturerData.temperature).toBe(34.50)
        expect(logs[1].advertisement.manufacturerData.battery).toBe(2.99)
        expect(logs[1].advertisement.manufacturerData.events.hall).toBe(true)
    })

    it ('multi message with cb', () => {
        const messages = [
            '$GPRP,7ABA6F20ACCF,806172C89C09,-2,02010612FF590080BCFF00007A0D4300FFFFFFFFFFFF',
            '$GPRP,F704B6D48BE8,1173AE7325A2,-24,02010612FF590080BC2B0104FFFFFFFFFFFFFFFFFFFF'
        ]
        parser.parseMessage(messages.join('\r\n'), (log, index) => {
            if (index === 0) {
                expect(log.advertisement.manufacturerData.humidity).toBe(67)
                expect(log.advertisement.manufacturerData.temperature).toBe(34.50)
            } else if (index === 1) {
                expect(log.advertisement.manufacturerData.battery).toBe(2.99)
                expect(log.advertisement.manufacturerData.events.hall).toBe(true)
            } else {
                expect(true).toBe(false)
            }
        })
    })

    it ('multi messages in JSON', () => {
        const messages = [
            '$GPRP,7ABA6F20ACCF,806172C89C09,-2,02010612FF590080BCFF00007A0D4300FFFFFFFFFFFF',
            '$GPRP,F704B6D48BE8,1173AE7325A2,-24,02010612FF590080BC2B0104FFFFFFFFFFFFFFFFFFFF'
        ]
        const logs = parser.parseMessage(JSON.stringify({ data: messages }))
        expect(logs).toHaveLength(2)
        expect(logs[0].advertisement.manufacturerData.humidity).toBe(67)
        expect(logs[0].advertisement.manufacturerData.temperature).toBe(34.50)
        expect(logs[1].advertisement.manufacturerData.battery).toBe(2.99)
        expect(logs[1].advertisement.manufacturerData.events.hall).toBe(true)
    })

    it ('empty payload', () => {
        const message = '$GPRP,7ABA6F20ACCF,806172C89C09,-2,'
        parser.parseMessage(message, (log) => {
            expect(log.advertisement.manufacturerData).toBeUndefined()
        })
        const message2 = '$GPRP,7ABA6F20ACCF,806172C89C09,-2,,1575440728'
        parser.parseMessage(message2, (log) => {
            expect(log.advertisement.manufacturerData).toBeUndefined()
            expect(log.timestamp).toBe(1575440728000)
        })
    })

    it ('msd parser hex string', () => {
        const msdtext = '0D0083BC2801020A09FFFF000015030000'
        const msd = parser.parseMsd(msdtext)
        expect(msd.type).toBe('iBS03T')
        expect(msd.temperature).toBe(23.14)
        expect(typeof msd.humidity).toBe('undefined')
        expect(typeof msd.events.button).not.toBe('undefined')
    })

    it ('msd parser Buffer array', () => {
        const msdbuf = Buffer.from([0x0d, 0x00, 0x83, 0xbc, 0x28, 0x01, 0x02, 0x0a, 0x09, 0xff, 0xff, 0x00, 0x00, 0x15, 0x03, 0x00, 0x00])
        const msd = parser.parseMsd(msdbuf)
        expect(msd.type).toBe('iBS03T')
        expect(msd.temperature).toBe(23.14)
        expect(typeof msd.humidity).toBe('undefined')
        expect(typeof msd.events.button).not.toBe('undefined')
    })
})

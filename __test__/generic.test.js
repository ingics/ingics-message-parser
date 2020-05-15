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
    })
})

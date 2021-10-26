const parser = require('..')

describe('igs decoded format', () => {

    it ('Single payload with data', () => {
        const message = '{"data":[{"ts":1635216015.634,"reader":"F008D178943C","tag":"0081F96B918D","rssi":-54,"type":"iBS03T","battery":3.01,"button":false,"temperature":25.05,"humidity":70}]}'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(data.timestamp).toBe(1635216015634)
            expect(data.gateway).toBe('F008D178943C')
            expect(data.beacon).toBe('0081F96B918D')
            expect(data.rssi).toBe(-54)
            expect(msd.type).toBe('iBS03T')
            expect(msd.company).toBe('Ingics')
            expect(msd.battery).toBe(3.01)
            expect(msd.temperature).toBe(25.05)
            expect(msd.humidity).toBe(70)
            expect(msd.events.button).toBe(false)
        })
    })

    it ('payload json only', () => {
        const message = '{"ts":1635216015.563,"reader":"F008D178943C","tag":"F88A5EB8CDC7","rssi":-55,"type":"iBS03GP","battery":2.64,"accels": [{"x":0,"y":0,"z":-264},{"x":0,"y":0,"z":-264},{"x":0,"y":0,"z":-264}],"gp":1016.02,"button":false,"act":false}'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(data.timestamp).toBe(1635216015563)
            expect(data.gateway).toBe('F008D178943C')
            expect(data.beacon).toBe('F88A5EB8CDC7')
            expect(data.rssi).toBe(-55)
            expect(msd.type).toBe('iBS03GP')
            expect(msd.is('ingics')).toBe(true)
            expect(msd.battery).toBe(2.64)
            expect(msd.accels[0].x).toBe(0)
            expect(msd.accels[0].y).toBe(0)
            expect(msd.accels[0].z).toBe(-264)
        })
    })

    it ('Unknown beacon type', () => {
        const message = '{"data":[{"ts":1635216015.787,"reader":"F008D178943C","tag":"493E7AA0AABB","rssi":-45,"type":"Unknown","raw_data":"1EFF06000109200256550FCFD42400F3086F51FCD0BFCAAAAB498B33997FFE"}]}'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(data.timestamp).toBe(1635216015787)
            expect(data.gateway).toBe('F008D178943C')
            expect(data.beacon).toBe('493E7AA0AABB')
            expect(data.rssi).toBe(-45)
            expect(msd.type).toBeUndefined()
            expect(Buffer.isBuffer(data.advertisement.raw)).toBe(true)
        })
    })

    it ('iBeacon mapping', () => {
        const message = '{"ts":1635233134.415,"reader":"F008D178943C","tag":"D42202001BEB","rssi":-67,"type":"iBeacon","uuid":"E2C56DB5DFFB48D2B060D0F5A71096E0","major":10,"minor":100,"ref_tx":-59}'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.is('ibeacon')).toBe(true)
            expect(msd.type).toBe('iBeacon')
            expect(msd.uuid).toBe('E2C56DB5-DFFB-48D2-B060-D0F5A71096E0')
            expect(msd.major).toBe(10)
            expect(msd.minor).toBe(100)
            expect(msd.tx).toBe(-59)
        })
    })

    it ('Shorter attribute name', () => {
        const message = '{"data":[{"ts":1635216015.634,"gw":"F008D178943C","tag":"0081F96B918D","rssi":-54,"type":"iBS03T","vbatt":3.01,"btn":false,"temp":25.05,"rh":70}]}'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(data.timestamp).toBe(1635216015634)
            expect(data.gateway).toBe('F008D178943C')
            expect(data.beacon).toBe('0081F96B918D')
            expect(data.rssi).toBe(-54)
            expect(msd.type).toBe('iBS03T')
            expect(msd.company).toBe('Ingics')
            expect(msd.battery).toBe(3.01)
            expect(msd.temperature).toBe(25.05)
            expect(msd.humidity).toBe(70)
            expect(msd.events.button).toBe(false)
        })
    })
})

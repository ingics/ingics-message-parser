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
            expect(msd.company).toBe('Ingics')
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
})

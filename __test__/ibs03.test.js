const parser = require('..')

describe('various ibs03 payload test', () => {

    it('iBS03T', () => {
        const message = '$GPRP,0C61CFC14A4E,E3C33FF55AEC,-50,02010612FF0D0083BC2801020A09FFFF000015030000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03T')
            expect(msd.temperature).toBe(23.14)
            expect(typeof msd.humidity).toBe('undefined')
            expect(typeof msd.events.button).not.toBe('undefined')
        })
    })

    it('iBS03T (NEW)', () => {
        const message = '$GPRP,CDCB34E2D0A2,77AE1C1DC33D,-91,02010612FF0D0083BCAD0000A20B4700FFFF14000000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03T')
            expect(msd.temperature).toBe(29.78)
            expect(msd.humidity).toBe(71)
        })
    })

    it('iBS03RG', () => {
        const message = '$GPRP,806FB0C9963F,C3674946C293,-71,02010619FF0D0081BC3E110A00F4FF00FF1600F6FF00FF1400F6FF08FF,1586245829'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03RG')
            expect(msd.battery).toBe(3.18)
            expect(msd.events.moving).toBe(true)
        })
    })

    it ('iBS03TP', () => {
        const message = '$GPRP,1804ED7D9C00,C82B96AE3B04,-48,02010612FF0D0083BC280100D809060A640017040000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.company).toBe('Ingics')
            expect(msd.type).toBe('iBS03TP')
            expect(msd.battery).toBe(2.96)
            expect(msd.temperature).toBe(25.20)
            expect(msd.temperatureExt).toBe(25.66)
        })
    })
})

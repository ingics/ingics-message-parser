const parser = require('..')

describe('special data for iGS05', () => {

    it('iBS05', () => {
        const message = '$GPRP,EAC653D3AA8E,CCB97E7361A4,-44,02010612FF2C0883BC290101AAAAFFFF000030000000'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            const msd = ad.manufacturerData
            expect(msd.type).toBe('iBS05')
            expect(msd.events['button']).toBe(true)
        })
    })

    it('iBS05T', () => {
        const message = '$GPRP,EAC653D3AA8D,CCB97E7361A4,-44,02010612FF2C0883BC4A0100A10AFFFF000032000000'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            const msd = ad.manufacturerData
            expect(msd.type).toBe('iBS05T')
            expect(msd.battery).toBe(3.3)
            expect(msd.temperature).toBe(27.21)
        })
    })

    it('iBS05G', () => {
        const message = '$GPRP,EAC653D3AA8C,CCB97E7361A4,-44,02010612FF2C0883BC290102AAAAFFFF000033000000'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            const msd = ad.manufacturerData
            expect(msd.type).toBe('iBS05G')
            expect(msd.events['moving']).toBe(true)
        })
    })

    it('iBS05CO2', () => {
        const message = '$GPRP,C8B629D6DAC3,F008D1789294,-35,02010612FF2C0883BC270100AAAA6804000034010000'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            const msd = ad.manufacturerData
            expect(msd.type).toBe('iBS05CO2')
            expect(msd.temperature).toBeUndefined()
        })
    })
})

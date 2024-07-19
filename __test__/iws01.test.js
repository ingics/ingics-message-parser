const parser = require('..')

describe('various iWS01 payload test', () => {

    it('iWS01', () => {
        const message = '$GPRP,EAC653D3AA8D,CCB97E7361A4,-44,02010618FF2C0887BC4A0100A10A3100000000000000000039000000'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            const msd = ad.manufacturerData
            expect(msd.type).toBe('iWS01')
            expect(msd.battery).toBe(3.3)
            expect(msd.temperature).toBe(27.21)
            expect(msd.humidity).toBe(4.9)
        })
    })
})

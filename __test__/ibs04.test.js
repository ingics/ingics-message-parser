const parser = require('..')

describe('various ibs04 payload test', () => {
    it('text mode, button pressed', () => {
        const message = '$GPRP,1804ED7048F5,E3C33FF55AEC,-55,02010612FF0D0083BC3A0101AAAAFFFF000019070000'
        parser.parseMessage(message, (data) => {
            expect(data.beacon).toBe('1804ED7048F5')
            expect(data.gateway).toBe('E3C33FF55AEC')
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS04')
            expect(msd.battery).toBe(3.14)
            expect(msd.events.button).toBe(true)
        })
    })

    it('scan respose for ibs04i', () => {
        const message = '$RSPR,0081F986452C,F008D1789208,-61,02010612FF0D0083BC1F0100AAAAFFFF000018030000'
        parser.parseMessage(message, (data) => {
            expect(data.beacon).toBe('0081F986452C')
            expect(data.gateway).toBe('F008D1789208')
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS04i')
            expect(msd.battery).toBe(2.87)
            expect(msd.events.button).toBe(false)
        })
    })
})

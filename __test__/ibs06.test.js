const parser = require('..')

describe('various ibs06 payload test', () => {
    it('ibs06', () => {
        const message = '$GPRP,1804ED7048F5,E3C33FF55AEC,-55,02010612FF2C0883BC4A0100AAAAFFFF000040110000'
        parser.parseMessage(message, (data) => {
            expect(data.beacon).toBe('1804ED7048F5')
            expect(data.gateway).toBe('E3C33FF55AEC')
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS06')
            expect(msd.battery).toBe(3.3)
        })
    })
    it('ibs06i', () => {
        const message = '$RSPR,EB8C79A8F138,F008D1789200,-89,12FF2C0883BC350100AAAAFFFF000036030000,1639557006.811'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS06i')
            expect(msd.battery).toBe(3.09)
        })
    })
})

const parser = require('..')

describe('various ibs04 payload test', () => {
    it('text mode, button pressed', () => {
        const message = '$GPRP,1804ED7048F5,E3C33FF55AEC,-55,02010612FF0D0083BC3A0101AAAAFFFF000019070000'
        parser.parseMessage(message, (data) => {
            expect(data.beacon).toBe('1804ED7048F5')
            expect(data.gateway).toBe('E3C33FF55AEC')
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS04')
            expect(msd.battery).toBe(314)
            expect(msd.events.button).toBe(true)
        })
    })
})

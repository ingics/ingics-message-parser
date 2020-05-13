const parser = require('..')

describe('various ibs04 payload test', () => {
    it('text mode, button pressed', () => {
        const message = '$GPRP,1804ED7048F5,E3C33FF55AEC,-55,02010612FF0D0083BC3A0101AAAAFFFF000019070000'
        parser.parseMessage(message, (data) => {
            expect(data.parsedPayload.type).toBe('iBS04')
            expect(data.beacon).toBe('1804ED7048F5')
            expect(data.gateway).toBe('E3C33FF55AEC')
            expect(data.parsedPayload.battery).toBe(314)
            expect(data.parsedPayload.events.button).toBe(true)
        })
    })
})

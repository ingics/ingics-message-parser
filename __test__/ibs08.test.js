const parser = require('..')

describe('various ibs08 payload test', () => {

    it('iBS08', () => {
        const message = '$GPRP,F83060BC466E,98F4AB891854,-82,02010612FF2C0883BC380120C0086608000048080400'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS08')
            expect(msd.temperature).toBe(21.5)
            expect(msd.temperatureEnv).toBe(22.4)
            expect(msd.events.detect).toBe(true)
        })
    })

    it('iBS08T', () => {
        const payload = '02010612FF2C0883BC4C0100CF080B02000041010C00'
        let msd = parser.parsePayload(payload).manufacturerData        
        expect(msd.type).toBe('iBS08T')
        expect(msd.battery).toBe(3.32)
        expect(msd.temperature).toBe(22.55)
        expect(msd.humidity).toBe(52.3)
        expect(msd.user).toBe(0)
    })

    it('iBS09R', () => {
        const payload = '02010612FF2C0883BC280100AAAA7200000042090000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09R')
        expect(msd.battery).toBe(2.96)
        expect(msd.range).toBe(114)
        expect(msd.user).toBe(0)
    })

    it('iBS09PS', () => {
        let payload = '02010612FF2C0883BC1E012021071E00000043010100'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PS')
        expect(msd.battery).toBe(2.86)
        expect(msd.value).toBe(1825)
        expect(msd.counter).toBe(30)
        expect(msd.user).toBe(0)
        expect(msd.events.detect).toBe(true)
        payload = '02010612FF2C0883BC170100B2FF1800000043010100'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PS')
        expect(msd.battery).toBe(2.79)
        expect(msd.value).toBe(-78)
        expect(msd.counter).toBe(24)
        expect(msd.user).toBe(0)
        expect(msd.events.detect).toBe(false)
    })

    it('iBS08PIR', () => {
        const payload = '02010612FF2C0883BC4A0110AAAAFFFF000044040000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PIR')
        expect(msd.battery).toBe(3.3)
        expect(msd.events.pir).toBe(true)
        expect(msd.user).toBe(0)
    })

    it('iBS09LX', () => {
        const payload = '02010612FF2C0883BC280100AAAA7200000045090000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09LX')
        expect(msd.battery).toBe(2.96)
        expect(msd.lux).toBe(114)
        expect(msd.user).toBe(0)
    })
})

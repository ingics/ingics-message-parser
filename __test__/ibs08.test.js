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
        let payload = '02010618FF2C0887BC2C01000B0BA301000000000000000041000000'
        let msd = parser.parsePayload(payload).manufacturerData        
        expect(msd.type).toBe('iBS08T')
        expect(msd.battery).toBe(3)
        expect(msd.temperature).toBe(28.27)
        expect(msd.humidity).toBe(41.9)
        expect(msd.events.button).toBe(false)
        payload = '02010618FF2C0887BCE600016E281300000000000000000041000000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08T')
        expect(msd.battery).toBe(2.3)
        expect(msd.temperature).toBe(103.5)
        expect(msd.humidity).toBe(1.9)
        expect(msd.events.button).toBe(true)
    })

    it('iBS09R', () => {
        const payload = '02010618FF2C0887BC470100AAAA7400000000000000000042100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09R')
        expect(msd.battery).toBe(3.27)
        expect(msd.range).toBe(116)
    })

    it('iBS09PS', () => {
        let payload = '02010618FF2C0887BC470120AAAA0100000000000000000043100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PS')
        expect(msd.battery).toBe(3.27)
        expect(msd.counter).toBe(1)
        expect(msd.events.detect).toBe(true)
        payload = '02010618FF2C0887BC470100AAAA0000000000000000000043100000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PS')
        expect(msd.battery).toBe(3.27)
        expect(msd.counter).toBe(0)
        expect(msd.events.detect).toBe(false)
    })

    it('iBS08PIR', () => {
        let payload = '02010618FF2C0887BC470110AAAAFFFF000000000000000044100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PIR')
        expect(msd.battery).toBe(3.27)
        expect(msd.events.pir).toBe(true)
        payload = '02010618FF2C0887BCFA0000AAAAFFFF000000000000000044100000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PIR')
        expect(msd.battery).toBe(2.50)
        expect(msd.events.pir).toBe(false)
    })

    it('iBS08TL', () => {
        let payload = '02010618FF2C0887BC4701010B0BA301010200000000000045100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08TL')
        expect(msd.battery).toBe(3.27)
        expect(msd.temperature).toBe(28.27)
        expect(msd.humidity).toBe(41.9)
        expect(msd.lux).toBe(513)
        expect(msd.events.button).toBe(true)
        payload = '02010618FF2C0887BC2001006E281300B90700000000000045100000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08TL')
        expect(msd.battery).toBe(2.88)
        expect(msd.temperature).toBe(103.5)
        expect(msd.humidity).toBe(1.9)
        expect(msd.lux).toBe(1977)
        expect(msd.events.button).toBe(false)
    })
})

const parser = require('..')

describe('various ibs08 payload test', () => {

    it('iBS08 (deprecated)', () => {
        const message = '$GPRP,F83060BC466E,98F4AB891854,-82,02010612FF2C0883BC380120C0086608000048080400'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS08')
            expect(msd.temperature).toBe(21.5)
            expect(msd.temperatureEnv).toBe(22.4)
            expect(msd.events.detect).toBe(true)
        })
    })

    it('iBS08T (deprecated)', () => {
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

    it('iBS09R (deprecated)', () => {
        const payload = '02010618FF2C0887BC470100AAAA7400000000000000000042100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09R')
        expect(msd.battery).toBe(3.27)
        expect(msd.range).toBe(116)
    })

    it('iBS09PS (deprecated)', () => {
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

    it('iBS08PIR (deprecated)', () => {
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

    it('iBS08TL (deprecated)', () => {
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

    it('iBS08T', () => {
        let payload = '0201061AFF2C0888BC2C01000B0BA3010000000000000000000041000000'
        let msd = parser.parsePayload(payload).manufacturerData        
        expect(msd.type).toBe('iBS08T')
        expect(msd.battery).toBe(3)
        expect(msd.temperature).toBe(28.27)
        expect(msd.humidity).toBe(41.9)
        expect(msd.events.button).toBe(false)
        payload = '0201061AFF2C0888BCE600016E2813000000000000000000000041000000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08T')
        expect(msd.battery).toBe(2.3)
        expect(msd.temperature).toBe(103.5)
        expect(msd.humidity).toBe(1.9)
        expect(msd.events.button).toBe(true)
    })

    it('iBS09R', () => {
        const payload = '0201061AFF2C0888BC470100AAAA74000000000000000000000042100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09R')
        expect(msd.battery).toBe(3.27)
        expect(msd.range).toBe(116)
    })

    it('iBS09PS', () => {
        let payload = '0201061AFF2C0888BC250120FBFF01000000000000000000000043060000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PS')
        expect(msd.battery).toBe(2.93)
        expect(msd.counter).toBe(1)
        expect(msd.value).toBe(-5)
        expect(msd.events.detect).toBe(true)
        payload = '0201061AFF2C0888BC250100010006000000000000000000000043060000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PS')
        expect(msd.battery).toBe(2.93)
        expect(msd.counter).toBe(6)
        expect(msd.value).toBe(1)
        expect(msd.events.detect).toBe(false)
    })

    it('iBS08PIR', () => {
        let payload = '0201061AFF2C0888BC470110AAAAFFFF0000000000000000000044100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PIR')
        expect(msd.battery).toBe(3.27)
        expect(msd.events.pir).toBe(true)
        payload = '0201061AFF2C0888BCFA0000AAAAFFFF0000000000000000000044100000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09PIR')
        expect(msd.battery).toBe(2.50)
        expect(msd.events.pir).toBe(false)
    })

    it('iBS08TL', () => {
        let payload = '0201061AFF2C0888BC4701010B0BA3010102000000000000000045100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08TL')
        expect(msd.battery).toBe(3.27)
        expect(msd.temperature).toBe(28.27)
        expect(msd.humidity).toBe(41.9)
        expect(msd.lux).toBe(513)
        expect(msd.events.button).toBe(true)
        payload = '0201061AFF2C0888BC2001006E281300B907000000000000000045100000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08TL')
        expect(msd.battery).toBe(2.88)
        expect(msd.temperature).toBe(103.5)
        expect(msd.humidity).toBe(1.9)
        expect(msd.lux).toBe(1977)
        expect(msd.events.button).toBe(false)
    })

    it('iBS08IAQ', () => {
        let payload = '0201061AFF2C0888BC4901000F091F025A0232004C00DE030A0046040000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08IAQ')
        expect(msd.battery).toBe(3.29)
        expect(msd.temperature).toBe(23.19)
        expect(msd.humidity).toBe(54.3)
        expect(msd.co2).toBe(602)
        expect(msd.pm2p5).toBe(5.0)
        expect(msd.pm10p0).toBe(7.6)
        expect(msd.voc).toBe(99.0)
        expect(msd.nox).toBe(1.0)
        expect(msd.events.button).toBe(false)
        // init state, some sensors not ready
        payload = '0201061AFF2C0888BC4701001A091C02FFFFFFFFFFFF0000FFFF46041000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08IAQ')
        expect(msd.battery).toBe(3.27)
        expect(msd.temperature).toBe(23.30)
        expect(msd.humidity).toBe(54.0)
        expect(msd.co2).toBeUndefined()
        expect(msd.pm2p5).toBeUndefined()
        expect(msd.pm10p0).toBeUndefined()
        expect(msd.voc).toBe(0)
        expect(msd.nox).toBeUndefined()
        expect(msd.events.button).toBe(false)        
    })
})

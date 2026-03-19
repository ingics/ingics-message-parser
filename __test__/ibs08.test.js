const parser = require('..')

describe('various ibs08 payload test', () => {

    it('iBS09R', () => {
        let payload = '0201061AFF2C0888BC470100AAAA74000000000000000000000042100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09R')
        expect(msd.battery).toBe(3.27)
        expect(msd.range).toBe(116)
        expect(msd.events.detect).toBe(false)
        payload = '0201061AFF2C0888BC470120AAAA74000000000000000000000042100000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09R')
        expect(msd.battery).toBe(3.27)
        expect(msd.range).toBe(116)
        expect(msd.events.detect).toBe(true)
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

    it('iBS08T', () => {
        let payload = '0201061AFF2C0888BC4701010B0BA3010102000000000000000045100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08T')
        expect(msd.battery).toBe(3.27)
        expect(msd.temperature).toBe(28.27)
        expect(msd.humidity).toBe(41.9)
        expect(msd.lux).toBe(513)
        expect(msd.events.button).toBe(true)
        payload = '0201061AFF2C0888BC2001006E281300B907000000000000000045100000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08T')
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

    it('iBS09IR', () => {
        let payload = '0201061AFF2C0888BC390120AAAAD1000000060000000000000047080000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09IR')
        expect(msd.battery).toBe(3.13)
        expect(msd.events.button).toBe(false)
        expect(msd.events.ir).toBe(true)
        expect(msd.counter).toBe(209)
        payload = '0201061AFF2C0888BC390101AAAAD0000000040000000000000047080000'
        msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09IR')
        expect(msd.battery).toBe(3.13)
        expect(msd.events.button).toBe(true)
        expect(msd.events.ir).toBe(false)
        expect(msd.counter).toBe(208)
    })

    it('iBS08TP', () => {
        let payload = '0201061AFF2C0888BC2C0101C40988130000000000000000000049100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08TP')
        expect(msd.battery).toBe(3.00)
        expect(msd.temperature).toBe(25.00)
        expect(msd.temperatureExt).toBe(50.00)
        expect(msd.events.button).toBe(true)
    })

    it('iBS08P', () => {
        let payload = '0201061AFF2C0888BC2C0100D0071027000000000000000000004B100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08P')
        expect(msd.battery).toBe(3.00)
        expect(msd.temperature).toBe(20.00)
        expect(msd.temperatureExt).toBe(100.00)
        expect(msd.events.button).toBe(false)
    })

    it('iBS08AD-NTC', () => {
        let payload = '0201061AFF2C0888BCCC00010000C409000000000000000000004A100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08AD-NTC')
        expect(msd.battery).toBe(2.04)
        expect(msd.temperatureExt).toBe(25.00)
        expect(msd.events.button).toBe(true)
    })

    it('iBS08AD-V', () => {
        let payload = '0201061AFF2C0888BC2C0100000088130000000000000000000051100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08AD-V')
        expect(msd.battery).toBe(3.00)
        expect(msd.voltage).toBe(5000)
        expect(msd.events.button).toBe(false)
    })

    it('iBS08AD-D', () => {
        let payload = '0201061AFF2C0888BC2C01400000D2040000000000000000000052100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08AD-D')
        expect(msd.battery).toBe(3.00)
        expect(msd.counter).toBe(1234)
        expect(msd.events.din).toBe(true)
        expect(msd.events.button).toBe(false)
    })

    it('iBS08AD-A', () => {
        let payload = '0201061AFF2C0888BC2C01000000983A0000000000000000000053100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08AD-A')
        expect(msd.battery).toBe(3.00)
        expect(msd.current).toBe(15000)
        expect(msd.events.button).toBe(false)
    })

    it('iBS08F', () => {
        let payload = '0201061AFF2C0888BC2C010800003702000000000000000000004D100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08F')
        expect(msd.battery).toBe(3.00)
        expect(msd.counter).toBe(567)
        expect(msd.events.fall).toBe(true)
        expect(msd.events.button).toBe(false)
    })

    it('iBS08Q', () => {
        let payload = '0201061AFF2C0888BC2C014000007803000000000000000000004E100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS08Q')
        expect(msd.battery).toBe(3.00)
        expect(msd.counter).toBe(888)
        expect(msd.events.din).toBe(true)
        expect(msd.events.button).toBe(false)
    })

    it('iBS09', () => {
        let payload = '0201061AFF2C0888BC2C0101000000000000000000000000000054100000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS09')
        expect(msd.battery).toBe(3.00)
        expect(msd.events.button).toBe(true)
    })
})

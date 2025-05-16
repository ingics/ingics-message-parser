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
})

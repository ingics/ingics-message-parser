const parser = require('..')

describe('various ibs02 payload test', () => {

    it('iBS02IR', () => {
        const message = '$GPRP,0081F9889BF9,DB024BFC4863,-44,02010612FF0D0083BC200120AAAAFFFF000002070000,1604900604'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS02IR2')
            expect(msd.counter).toBeUndefined()
            expect(msd.battery).toBe(2.88)
            expect(msd.events.ir).toBe(true)
        })
    })

    it('iBS02IR with counter', () => {
        const message = '$GPRP,0081F9889BF9,F008D1789294,-42,02010612FF0D0083BC4D0120AAAA05000000020A0600'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS02IR2')
            expect(msd.battery).toBe(3.33)
            expect(msd.counter).toBe(5)
            expect(msd.events.ir).toBe(true)
        })
    })

    it('iBS02PIR', () => {
        const message = '$GPRP,607771FCD6FB,DB024BFC4863,-49,02010612FF0D0083BC4A0110AAAAFFFF000001140000,1604900518'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS02PIR2')
            expect(msd.battery).toBe(3.3)
            expect(msd.events.pir).toBe(true)
        })
    })

    it('iBS02M2', () => {
        let msd = parser.parsePayload('02010612FF0D0083BC3E0140AAAAFFFF000004070000').manufacturerData
        expect(msd.type).toBe('iBS02M2')
        expect(msd.counter).toBeUndefined()
        expect(msd.events.din).toBe(true)
        expect(msd.events.button).toBeUndefined()
        msd = parser.parsePayload('02010612FF0D0083BC3E0100AAAAFFFF000004070000').manufacturerData
        expect(msd.counter).toBeUndefined()
        expect(msd.events.din).toBe(false)
        expect(msd.events.hall).toBeUndefined()
    })

    it('iBS02M2 with Counter', () => {
        let msd = parser.parsePayload('02010612FF0D0083BC240100AAAA37060000040B0600').manufacturerData
        expect(msd.type).toBe('iBS02M2')
        expect(msd.counter).toBe(1591)
        expect(msd.events.din).toBe(false)
    })
})

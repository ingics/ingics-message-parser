const parser = require('..')

describe('various iBS05 payload test', () => {

    it('iBS05', () => {
        const message = '$GPRP,EAC653D3AA8E,CCB97E7361A4,-44,02010612FF2C0883BC290101AAAAFFFF000030000000'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            const msd = ad.manufacturerData
            expect(msd.type).toBe('iBS05')
            expect(msd.events['button']).toBe(true)
        })
    })

    it('iBS05H', () => {
        const messages = [
            '$GPRP,FDB69134E063,F008D1789200,-75,02010612FF2C0883BC2D0100AAAA04000000310A1000',
            '$GPRP,FDB69134E063,F008D1789200,-75,02010612FF2C0883BC2D0101AAAA04000000310A1000',
            '$GPRP,FDB69134E063,F008D1789200,-75,02010612FF2C0883BC2D0104AAAA01800000310A1000',
        ]
        for (const [i, message] of messages.entries()) {
            parser.parseMessage(message, (data) => {
                const ad = data.advertisement
                const msd = ad.manufacturerData                
                expect(msd.type).toBe('iBS05H')
                expect(msd.battery).toBe(3.01)
                if (i === 0) {
                    expect(msd.counter).toBe(4)
                    expect(msd.events['button']).toBe(false)
                    expect(msd.events['hall']).toBe(false)
                } else if (i === 1) {
                    expect(msd.counter).toBe(4)
                    expect(msd.events['button']).toBe(true)
                    expect(msd.events['hall']).toBe(false)
                } else if (i === 2) {
                    expect(msd.counter).toBe(32769)
                    expect(msd.events['button']).toBe(false)
                    expect(msd.events['hall']).toBe(true)
                }
            })
        }
    })

    it('iBS05T', () => {
        const message = '$GPRP,EAC653D3AA8D,CCB97E7361A4,-44,02010612FF2C0883BC4A0100A10AFFFF000032000000'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            const msd = ad.manufacturerData
            expect(msd.type).toBe('iBS05T')
            expect(msd.battery).toBe(3.3)
            expect(msd.temperature).toBe(27.21)
        })
    })

    it('iBS05G', () => {
        const message = '$GPRP,EAC653D3AA8C,CCB97E7361A4,-44,02010612FF2C0883BC290102AAAAFFFF000033000000'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            const msd = ad.manufacturerData
            expect(msd.type).toBe('iBS05G')
            expect(msd.events['moving']).toBe(true)
        })
    })

    it('iBS05G-Flip', () => {
        const messages = [
            '$GPRP,FD40E805B277,F008D1789200,-62,02010612FF2C0883BC3C012002FF000000003A0A1000',
            '$GPRP,FDB69134E063,F008D1789200,-75,02010612FF2C0883BC3A0101F200000000003A0A1000',
        ]
        for (const [i, message] of messages.entries()) {
            parser.parseMessage(message, (data) => {
                const ad = data.advertisement
                const msd = ad.manufacturerData
                expect(msd.type).toBe('iBS05G-Flip')
                switch (i) {
                case 0:
                    expect(msd.battery).toBe(3.16)
                    expect(msd.events['button']).toBe(false)
                    expect(msd.events['flip']).toBe(true)
                    break
                case 1:
                    expect(msd.battery).toBe(3.14)
                    expect(msd.events['button']).toBe(true)
                    expect(msd.events['flip']).toBe(false)
                    break
                }
            })
        }
    })

    it('iBS05CO2', () => {
        const message = '$GPRP,C8B629D6DAC3,F008D1789294,-35,02010612FF2C0883BC270100AAAA6804000034010000'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            const msd = ad.manufacturerData
            expect(msd.type).toBe('iBS05CO2')
            expect(msd.temperature).toBeUndefined()
        })
    })

    it('iBS05 CFG RSPR', () => {
        const message = '$RSPR,C8FDEF6AD8BB,F008D1798BA4,-64,11072B3264B41C6D1A84BD4698B200004E1B0B0969425330352D44384242,1646903203'
        parser.parseMessage(message, (data) => {
            const ad = data.advertisement
            expect(ad.localName).toBe('iBS05-D8BB')
            expect(ad.serviceUuids[0]).toBe('1B4E0000-B298-46BD-841A-6D1CB464322B')
        })
    })

    it('iBS05RG', () => {
        const message = '$GPRP,806FB0C9963F,C3674946C293,-71,0201061BFF2C0886BC3E110A00F4FF00FF1600F6FF00FF1400F6FF08FF1704,1586245829'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS05RG')
            expect(msd.battery).toBe(3.18)
            expect(msd.events.moving).toBe(true)
            expect(msd.events.boot).toBe(true)
            expect(msd.accels[0]['x']).toBe(10)
            expect(msd.accels[1]['y']).toBe(-10)
            expect(msd.accels[2]['z']).toBe(-248)
        })
    })
})

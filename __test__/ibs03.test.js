const parser = require('..')

describe('various ibs03 payload test', () => {

    it('iBS03T', () => {
        const message = '$GPRP,0C61CFC14A4E,E3C33FF55AEC,-50,02010612FF0D0083BC2801020A09FFFF000015030000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03T')
            expect(msd.temperature).toBe(23.14)
            expect(typeof msd.humidity).toBe('undefined')
            expect(typeof msd.events.button).not.toBe('undefined')
        })
    })

    it('iBS03T_RH', () => {
        const message = '$GPRP,0081F96B8F51,98F4AB891854,-66,02010612FF0D0083BC3E0100AA073100000014130000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03T')
            expect(msd.temperature).toBe(19.62)
            expect(msd.humidity).toBe(49)
        })
    })

    it('iBS03RG', () => {
        const message = '$GPRP,806FB0C9963F,C3674946C293,-71,02010619FF0D0081BC3E110A00F4FF00FF1600F6FF00FF1400F6FF08FF,1586245829'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03RG')
            expect(msd.battery).toBe(3.18)
            expect(msd.events.moving).toBe(true)
            expect(msd.accels[0]['x']).toBe(10)
            expect(msd.accels[1]['y']).toBe(-10)
            expect(msd.accels[2]['z']).toBe(-248)
        })
    })

    it ('iBS03TP', () => {
        const message = '$GPRP,1804ED7D9C00,C82B96AE3B04,-48,02010612FF0D0083BC280100D809060A640017040000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.company).toBe('Ingics')
            expect(msd.type).toBe('iBS03TP')
            expect(msd.battery).toBe(2.96)
            expect(msd.temperature).toBe(25.20)
            expect(msd.temperatureExt).toBe(25.66)
        })
    })

    it('iBS03R', () => {
        const message = '$GPRP,0C61CFC14A4E,E3C33FF55AEC,-50,02010612FF0D0083BC280100AAAA7200000013090000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03R')
            expect(msd.range).toBe(114)
            expect(typeof msd.humidity).toBe('undefined')
        })
    })

    it('iBS03P', () => {
        // const message = '$GPRP,0C61CFC14745,E7DAE08E6FC3,-67,02010612FF0D0083BC280100AAAAD207000012080000,1608516227'
        const message = '$GPRP,607771FCD5F0,F008D1789294,-49,02010612FF0D0083BC2C0100BF0AD00A0000120A0600'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03P')
            expect(msd.temperature).toBe(27.51)
            expect(msd.temperatureExt).toBe(27.68)
            expect(typeof msd.humidity).toBe('undefined')
        })
    })

    it('iBS03GP', () => {
        const message = '$GPRP,806FB0C9963F,C3674946C293,-71,0201061BFF0D0085BC3111160082FF9EFE4E001200D2FE10003A005CFFD9C5'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03GP')
            expect(msd.battery).toBe(3.05)
            expect(msd.events.moving).toBe(true)
            expect(msd.accels[0]['x']).toBe(22)
            expect(msd.accels[1]['y']).toBe(18)
            expect(msd.accels[2]['z']).toBe(-164)
            expect(msd.gp).toBe(1012.98)
        })
    })

    it('iBS03RS', () => {
        const message = '$GPRP,F88A5EB8F226,F008D1798C68,-62,02010612FF0D0083BC430100AAAA150000001A040600'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03RS')
            expect(msd.range).toBe(21)
            expect(msd.battery).toBe(3.23)
        })
    })

    it('iBS03F', () => {
        const message = '$GPRP,70B9507273F0,F008D1789200,-65,02010612FF0D0083BC290140AAAA0A0000001B090000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS03F')
            expect(msd.counter).toBe(10)
            expect(msd.events.din).toBe(true)
        })
    })

    it('iBS03Q', () => {
        const ad = parser.parsePayload('02010612FF0D0083BC330140AAAA030000001C090000')
        expect(ad.manufacturerData.type).toBe('iBS03Q')
        expect(ad.manufacturerData.battery).toBe(3.07)
        expect(ad.manufacturerData.counter).toBe(3)
        expect(ad.manufacturerData.events.din).toBe(true)
    })

    it('iBS03QY', () => {
        let ad = parser.parsePayload('02010612FF0D0083BC290148AAAA050000001D090000')
        expect(ad.manufacturerData.type).toBe('iBS03QY')
        expect(ad.manufacturerData.battery).toBe(2.97)
        expect(ad.manufacturerData.counter).toBe(5)
        expect(ad.manufacturerData.events.din).toBe(true)
        expect(ad.manufacturerData.events.din2).toBe(true)
        ad = parser.parsePayload('02010612FF0D0083BC290108AAAAFF0000001D090000')
        expect(ad.manufacturerData.type).toBe('iBS03QY')
        expect(ad.manufacturerData.battery).toBe(2.97)
        expect(ad.manufacturerData.counter).toBe(255)
        expect(ad.manufacturerData.events.din).toBe(false)
        expect(ad.manufacturerData.events.din2).toBe(true)
    })

    it ('iBS03AD-NT', () => {
        const message = '$GPRP,1804ED7D9C00,C82B96AE3B04,-48,02010612FF0D0083BC280100D809060A640023040000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.company).toBe('Ingics')
            expect(msd.type).toBe('iBS03AD-NT')
            expect(msd.battery).toBe(2.96)
            expect(msd.temperature).toBeUndefined()
            expect(msd.temperatureExt).toBe(25.66)
            expect(msd.user).toBe(100)
        })
    })

    it ('iBS03AD-V', () => {
        const message = '$GPRP,1804ED7D9C00,C82B96AE3B04,-48,02010612FF0D0083BC280100D809060A640024040000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.company).toBe('Ingics')
            expect(msd.type).toBe('iBS03AD-V')
            expect(msd.battery).toBe(2.96)
            expect(msd.temperature).toBeUndefined()
            expect(msd.voltage).toBe(2566)
            expect(msd.user).toBe(100)
        })
    })

    it ('iBS03AD-D', () => {
        const message = '$GPRP,1804ED7D9C00,C82B96AE3B04,-48,02010612FF0D0083BC280140D809060A640025040000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.company).toBe('Ingics')
            expect(msd.type).toBe('iBS03AD-D')
            expect(msd.battery).toBe(2.96)
            expect(msd.temperature).toBeUndefined()
            expect(msd.events.din).toBe(true)
            expect(msd.user).toBe(100)
            expect(msd.counter).toBe(2566)
        })
    })

    it ('iBS03AD-A', () => {
        const payload = '02010612FF0D0083BC280140D809060A640026040000'
        let msd = parser.parsePayload(payload).manufacturerData
        expect(msd.type).toBe('iBS03AD-A')
        expect(msd.battery).toBe(2.96)
        expect(msd.current).toBe(2566)
        expect(msd.user).toBe(100)
    })
})

const parser = require('..')

describe('various ibs07 payload test', () => {
    it('ibs07', () => {
        const message = '$GPRP,C7B3D4AE866D,F008D1789200,-57,02010618FF2C0887BC330100110B31005A002AFF02007B0050070000'
        parser.parseMessage(message, (data) => {
            console.log(data)
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS07')
            expect(msd.battery).toBe(3.07)
            expect(msd.temperature).toBe(28.33)
            expect(msd.humidity).toBe(49)
            expect(msd.lux).toBe(90)
            expect(msd.accel['x']).toBe(-214)
            expect(msd.accel['y']).toBe(2)
            expect(msd.accel['z']).toBe(123)
            expect(msd.events.button).toBe(false)
        })
    })

    it('ibs07 without sensor', () => {
        const message = '$GPRP,C7B3D4AE866D,F008D1789200,-57,02010618FF2C0887BC330101AAAAFFFF00002AFF02007B0050070000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS07')
            expect(msd.battery).toBe(3.07)
            expect(msd.temperature).toBeUndefined()
            expect(msd.humidity).toBeUndefined()
            expect(msd.lux).toBeUndefined()
            expect(msd.accel['x']).toBe(-214)
            expect(msd.accel['y']).toBe(2)
            expect(msd.accel['z']).toBe(123)
            expect(msd.events.button).toBe(true)
        })
    })
})

const parser = require('..')

describe('various ibs08 payload test', () => {

    it('iBS03T', () => {
        const message = '$GPRP,F83060BC466E,98F4AB891854,-82,02010612FF2C0883BC380120C0086608000048080400'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS08')
            expect(msd.temperature).toBe(21.5)
            expect(msd.temperatureEnv).toBe(22.4)
            expect(msd.events.ir).toBe(true)
        })
    })

})

const parser = require('..')

describe('various ibs02 payload test', () => {

    it('iBS02HM', () => {
        const message = '$GPRP,F0F8F2CADCCF,C82B96AE3B04,-52,02010612FF0D0082BC280100AAAAFFFF000004050000'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iBS02HM')
            expect(msd.battery).toBe(2.96)
        })
    })
})

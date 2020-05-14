const parser = require('..')

describe('verious irs02xx test cases', () => {

    it ('test iRS02RG', () => {
        const message = '$GPRP,0C61CFC14B58,CC4B73906F8C,-21,02010612FF0D0083BC4D010000002400FCFE22074B58,1575440728'
        parser.parseMessage(message, (data) => {
            const msd = data.advertisement.manufacturerData
            expect(msd.type).toBe('iRS02RG')
            expect(msd.accel.x).toBe(0)
            expect(msd.accel.z).toBe(-260)
        })
    })
})

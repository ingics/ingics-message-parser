const parser = require('..')

describe('real failure case set', () => {
    it ('test iRS02RG', () => {
        const message = '$GPRP,0C61CFC14B58,CC4B73906F8C,-21,02010612FF0D0083BC4D010000002400FCFE22074B58,1575440728'
        parser.parseMessage(message, (data) => {
            expect(data.parsedPayload.type).toBe('iRS02RG')
            expect(data.parsedPayload.accel.x).toBe(0)
            expect(data.parsedPayload.accel.z).toBe(-260)
        })
    })
    it ('test windows 10 desktop', () => {
        const message = '$GPRP,3D0A662DC412,C3674946C293,-62,1EFF0600010920025E294E5E30809130E56E2CA4701DC8EBED5396B6320B8F'
        parser.parseMessage(message, (data) => {
            expect(data.parsedPayload.mfg).toBe('Microsoft')
            expect(data.parsedPayload.type).toBe('Windows 10 Desktop')
        })
    })
})

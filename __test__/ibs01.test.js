const parser = require('..')

describe('various ibs01 payload test', () => {
    it('text mode, button pressed', () => {
        const message = '$GPRP,FE581D9DB308,2F9203AFA66B,-21,02010612FF590080BC360101FFFFFFFFFFFFFFFFFFFF'
        parser.parseMessage(message, (data) => {
            expect(data.parsedPayload.type).toBe('iBS01')
            expect(data.beacon).toBe('FE581D9DB308')
            expect(data.gateway).toBe('2F9203AFA66B')
            expect(data.parsedPayload.battery).toBe(310)
            expect(data.parsedPayload.events.button).toBe(true)
        })
    })
    it('text mode, hall sensor', () => {
        const message = '$GPRP,F704B6D48BE8,1173AE7325A2,-24,02010612FF590080BC2B0104FFFFFFFFFFFFFFFFFFFF'
        parser.parseMessage(message, (data) => {
            expect(data.parsedPayload.type).toBe('iBS01')
            expect(data.parsedPayload.battery).toBe(299)
            expect(data.parsedPayload.events.hall).toBe(true)
        })
    })
    it('text mode, payload parser, moving and fall', () => {
        const payload = '02010612FF590080BC2B010AFFFFFFFFFFFFFFFFFFFF'
        const data = parser.parsePayload(payload)
        expect(data.type).toBe('iBS01')
        expect(data.events.fall).toBe(true)
        expect(data.events.moving).toBe(true)
    })
    it('json mode, temperature sensor', () => {
        const message = '{"data":["$GPRP,7ABA6F20ACCF,806172C89C09,-2,02010612FF590080BCFF00007A0D4300FFFFFFFFFFFF"]}'
        parser.parseMessage(message, (data) => {
            expect(data.parsedPayload.type).toBe('iBS01T')
            expect(data.parsedPayload.humidity).toBe(67)
            expect(data.parsedPayload.temperature).toBe(3450)
        })
    })
    it('text mode, mutiple messages', () => {
        const messages = [
            '$GPRP,7ABA6F20ACCF,806172C89C09,-2,02010612FF590080BCFF00007A0D4300FFFFFFFFFFFF',
            '$GPRP,F704B6D48BE8,1173AE7325A2,-24,02010612FF590080BC2B0104FFFFFFFFFFFFFFFFFFFF'
        ]
        parser.parseMessage(messages.join('\n'), (data, index) => {
            if (index === 0) {
                expect(data.parsedPayload.type).toBe('iBS01T')
                expect(data.parsedPayload.humidity).toBe(67)
                expect(data.parsedPayload.temperature).toBe(3450)
            } else if (index === 1) {
                expect(data.parsedPayload.type).toBe('iBS01')
                expect(data.parsedPayload.battery).toBe(299)
                expect(data.parsedPayload.events.hall).toBe(true)
            }
        })
    })
    it('json mode, multiple messages', () => {
        const message = {
            data: [
                '$GPRP,7ABA6F20ACCF,806172C89C09,-2,02010612FF590080BCFF00007A0D4300FFFFFFFFFFFF',
                '$GPRP,F704B6D48BE8,1173AE7325A2,-24,02010612FF590080BC2B0104FFFFFFFFFFFFFFFFFFFF'
            ]
        }
        parser.parseMessage(JSON.stringify(message), (data, index) => {
            if (index === 0) {
                expect(data.parsedPayload.type).toBe('iBS01T')
                expect(data.parsedPayload.humidity).toBe(67)
                expect(data.parsedPayload.temperature).toBe(3450)
            } else if (index === 1) {
                expect(data.parsedPayload.type).toBe('iBS01')
                expect(data.parsedPayload.battery).toBe(299)
                expect(data.parsedPayload.events.hall).toBe(true)
            }
        })
    })
})

const parser = require('..');

describe('various ibs03 payload test', () => {
    it('iBS03T', (done) => {
        const message = '$GPRP,0C61CFC14A4E,E3C33FF55AEC,-50,02010612FF0D0083BC2801020A09FFFF000015030000';
        parser.parseMessage(message, (data) => {
            console.log(data)
            expect(data.parsedPayload.type).toBe('iBS03T');
            //expect(data.beacon).toBe('FE581D9DB308');
            //expect(data.gateway).toBe('2F9203AFA66B');
            //expect(data.parsedPayload.battery).toBe(310);
            //expect(data.parsedPayload.events.button).toBe(true);
            done();
        });
    })
})

const parser = require('..');

describe('various ibs03 payload test', () => {
    it('iBS03T', (done) => {
        const message = '$GPRP,0C61CFC14A4E,E3C33FF55AEC,-50,02010612FF0D0083BC2801020A09FFFF000015030000';
        parser.parseMessage(message, (data) => {
            expect(data.parsedPayload.type).toBe('iBS03T');
            expect(data.parsedPayload.temperature).toBe(2314);
            expect(typeof data.parsedPayload.humidity).toBe('undefined');
            expect(typeof data.parsedPayload.events.button).not.toBe('undefined');
            done();
        });
    })
    it('iBS03T (NEW)', (done) => {
        const message = '$GPRP,CDCB34E2D0A2,77AE1C1DC33D,-91,02010612FF0D0083BCAD0000A20B4700FFFF14000000';
        parser.parseMessage(message, (data) => {
            expect(data.parsedPayload.type).toBe('iBS03T');
            expect(data.parsedPayload.temperature).toBe(2978);
            expect(data.parsedPayload.humidity).toBe(71);
            done();
        });
    })
    it('iBS03RG', (done) => {
        const message = '$GPRP,806FB0C9963F,C3674946C293,-71,02010619FF0D0081BC3E110A00F4FF00FF1600F6FF00FF1400F6FF08FF,1586245829'
        parser.parseMessage(message, (data) => {
            expect(data.parsedPayload.type).toBe('iBS03RG');
            expect(data.parsedPayload.battery).toBe(318)
            expect(data.parsedPayload.events.moving).toBe(true)
            done();
        });
    })
})

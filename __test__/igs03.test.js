const parser = require('..')

describe('special data for iGS03', () => {

    it('GPS', () => {
        const message = '$GPSR,C82B96AE3B04,C82B96AE3B04,-127,200608,073549,-24.993477,121.422981,0.0,3.5'
        parser.parseMessage(message, (data) => {
            const gnss = data.gnss
            expect(gnss.latitude).toBe(-24.993477)
            expect(gnss.longitude).toBe(121.422981)
            expect(gnss.speed).toBe(0)
            expect(gnss.hdop).toBe(3.5)
            const fixDate = new Date(gnss.fixTimestamp)
            expect(fixDate.getUTCFullYear()).toBe(2020)
            expect(fixDate.getUTCMonth()).toBe(5)
            expect(fixDate.getUTCDate()).toBe(8)
            expect(fixDate.getUTCHours()).toBe(7)
            expect(fixDate.getUTCMinutes()).toBe(35)
        })
    })

    it('GPS, with timestamp', () => {
        const message = '$GPSR,C82B96AE3B04,C82B96AE3B04,-127,200608,073549.00,-24.993477,121.422981,0.0,3.5,1591609841'
        parser.parseMessage(message, (data) => {
            expect(data.timestamp).toBe(1591609841000)
            const gnss = data.gnss
            expect(gnss.latitude).toBe(-24.993477)
            expect(gnss.longitude).toBe(121.422981)
            expect(gnss.speed).toBe(0)
            expect(gnss.hdop).toBe(3.5)
            const fixDate = new Date(gnss.fixTimestamp)
            expect(fixDate.getUTCFullYear()).toBe(2020)
            expect(fixDate.getUTCMonth()).toBe(5)
            expect(fixDate.getUTCDate()).toBe(8)
            expect(fixDate.getUTCHours()).toBe(7)
            expect(fixDate.getUTCMinutes()).toBe(35)
        })
    })

    it('GPS, with ms timestamp', () => {
        const message = '$GPSR,C82B96AE3B04,C82B96AE3B04,-127,200608,073549,-24.993477,121.422981,0.0,3.5,1591609841.895'
        parser.parseMessage(message, (data) => {
            expect(data.timestamp).toBe(1591609841895)
            const gnss = data.gnss
            expect(gnss.latitude).toBe(-24.993477)
            expect(gnss.longitude).toBe(121.422981)
            expect(gnss.speed).toBe(0)
            expect(gnss.hdop).toBe(3.5)
            const fixDate = new Date(gnss.fixTimestamp)
            expect(fixDate.getUTCFullYear()).toBe(2020)
            expect(fixDate.getUTCMonth()).toBe(5)
            expect(fixDate.getUTCDate()).toBe(8)
            expect(fixDate.getUTCHours()).toBe(7)
            expect(fixDate.getUTCMinutes()).toBe(35)
        })
    })

    it('HBRP, without timestamp', () => {
        const message = '$HBRP,F008D1798C60,F008D1798C60,-127,00000000'
        parser.parseMessage(message, (data) => {
            expect(data.type).toBe('HBRP')
            expect(data.gateway).toBe('F008D1798C60')
        })
    })

    it('HBRP, with timestamp', () => {
        const message = '$HBRP,F008D1798C60,F008D1798C60,-127,00000000,1635322857'
        parser.parseMessage(message, (data) => {
            expect(data.type).toBe('HBRP')
            expect(data.gateway).toBe('F008D1798C60')
            expect(data.timestamp).toBe(1635322857000)
        })
    })
})

'use strict'

function gnss (data) {
    this.raw = data
    this.fixTimestamp = undefined // utc Date
    this.latitude = undefined
    this.longitude = undefined
    this.speed = 0
    this.hdop = 0
    this.parse()
}

const dateFmt = '([0-9]{2})([0-9]{2})([0-9]{2})'
const timeFmt = '([0-9]{2})([0-9]{2})([0-9]{2})(\\.([0-9]{2}))?'
const locationFmt = '(-?[0-9.]+)'
const speedFmt = '([0-9.]+)'
const hdopFmt = '([0-9.]+)'
const tsFmt = '([0-9.]+)'

gnss.prototype.parse = function () {
    const match = this.raw.match(`^${dateFmt},${timeFmt},${locationFmt},${locationFmt},${speedFmt},${hdopFmt}(,${tsFmt})?$`)
    // console.log(match)
    /*
        [ '200608,073549.00,24.993477,121.422981,0.0,3.5',
          '20',
          '06',
          '08',
          '07',
          '35',
          '49',
          '.00',
          '00',
          '24.993477',
          '121.422981',
          '0.0',
          '3.5',
          undefined,
          undefined,
          index: 0,
          input: '200608,073549.00,24.993477,121.422981,0.0,3.5',
          groups: undefined ]
    */
    if (match) {
        this.fixTimestamp = Date.UTC(
            parseInt(match[1]) + 2000,
            parseInt(match[2]) - 1,
            parseInt(match[3]),
            parseInt(match[4]),
            parseInt(match[5]),
            parseInt(match[6]),
            match[8] === undefined ? 0 : parseInt(match[8]))
        this.latitude = parseFloat(match[9])
        this.longitude = parseFloat(match[10])
        this.speed = parseFloat(match[11])
        this.hdop = parseFloat(match[12])
        if (typeof match[14] !== 'undefined') {
            if (match[14].indexOf('.') !== -1) {
                this.timestamp = parseInt(match[14].replace('.', ''), 10)
            } else {
                this.timestamp = parseInt(match[14], 10) * 1000
            }
        }
    }
}

module.exports = gnss

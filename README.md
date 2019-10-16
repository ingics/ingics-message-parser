# Package @ingics/message-parser

Parser library for Ingics BLE beacon and beacon gateway products.

## Library Usage

### Parse full message got from Ingics gateway

#### Example:
```
const parser = require('@ingics/message-parser');
// message string got from Ingics Gateway (for example: iGS01S)
const message = '$GPRP,3C253BC92ABB,C0563D4FF278,-56,02010612FF590080BCD200000E161600FFFFFFFFFFFF';
// send it to parser and print out the result
parser.parseMessage(message, (data) => {
	console.log(data);
});
```

#### Output:
```
{ type: 'GPRP',
  beacon: '3C253BC92ABB',
  gateway: 'C0563D4FF278',
  rssi: -56,
  payload: '02010612FF590080BCD200000E161600FFFFFFFFFFFF',
  parsedPayload:
   { mfg: 'Ingics',
     mfgCode: 89,
     battery: 210,
     events: {},
     type: 'iBS01T',
     temperature: 5646,
     humidity: 22 } }
```

### Parse BLE payload got from Ingics beacon

#### Example:
```
const parser = require('@ingics/message-parser');
// payload string got from Ingics beacon (for example: iGS03T)
const payload = '02010612FF590080BCD200000E161600FFFFFFFFFFFF';
// send it to parser and print out the result
console.log(parser.parsePayload(payload);
```

#### Output:
```
{ mfg: 'Ingics',
  mfgCode: 89,
  battery: 210,
  events: {},
  type: 'iBS01T',
  temperature: 5646,
  humidity: 22 }
```

## Command Line Usage

### Example for parse gateway message:
`node bin/parse.js message '$GPRP,3C253BC92ABB,C0563D4FF278,-56,02010612FF590080BCD200000E161600FFFFFFFFFFFF'`

### EXample for parse BLE payload:
`node bin/parse.js payload '02010612FF590080BCD200000E161600FFFFFFFFFFFF'`

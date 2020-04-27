# Package @ingics/message-parser

Parser library for Ingics BLE beacon and beacon gateway products.

## Installation

#### Npm Install with Github
```bash
npm install --save ingics/ingics-message-parser
```

#### Local Settup
Link package to local npm store, under message-parser folder
```bash
npm link
```
Link parser library to your project
```bash
npm link @ingics/message-parser
```

## Usage

### Parse BLE payload got from Ingics beacon

#### Example:
```bash
const parser = require('@ingics/message-parser');
// payload string got from Ingics beacon (for example: iGS03T)
const payload = '02010612FF590080BCD200000E161600FFFFFFFFFFFF';
// send it to parser and print out the result
console.log(parser.parsePayload(payload);
```

#### Output:
```bash
{ mfg: 'Ingics',
  mfgCode: 89,
  battery: 210,
  events: {},
  type: 'iBS01T',
  temperature: 5646,
  humidity: 22 }
```

### Parse full message got from Ingics gateway

#### Example:
```bash
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

## Command Line Usage

### Set up Env
```bash
npm link
npm link @ingics/message-parser
```

### Example for parse gateway message:
`node bin/parse.js message '$GPRP,3C253BC92ABB,C0563D4FF278,-56,02010612FF590080BCD200000E161600FFFFFFFFFFFF'`

### Example for parse BLE payload:
`node bin/parse.js payload '02010612FF590080BCD200000E161600FFFFFFFFFFFF'`

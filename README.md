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

### Parse BLE payload (advertisement) got from Ingics beacon

#### Example (iBS01T):
```bash
const parser = require('@ingics/message-parser');
// payload string got from Ingics beacon (for example: iBS01T)
const payload = '02010612FF590080BCD200000E161600FFFFFFFFFFFF';
// send it to parser and print out the result
console.log(parser.parsePayload(payload);
```

#### Output:
```bash
ad {
  raw:
   <Buffer 02 01 06 12 ff 59 00 80 bc d2 00 00 0e 16 16 00 ff ff ff ff ff ff>,
  flags: 6,
  localName: undefined,
  txPowerLevel: undefined,
  manufacturerData:
   msd {
     raw: <Buffer 59 00 80 bc d2 00 00 0e 16 16 00 ff ff ff ff ff ff>,
     mfg: 89,
     company: 'Ingics',
     code: 48256,
     battery: 210,
     events: {},
     eventFlag: 0,
     type: 'iBS01T',
     temperature: 5646,
     humidity: 22 },
  serviceData: [],
  serviceUuids: [],
  serviceSolicitationUuids: [] }
```

### Parse full message got from Ingics gateway

#### Example (iBS01T):
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
  fullMessage:
   '$GPRP,3C253BC92ABB,C0563D4FF278,-56,02010612FF590080BCD200000E161600FFFFFFFFFFFF',
  timestamp: 1589449428889,
  advertisement:
   ad {
     raw:
      <Buffer 02 01 06 12 ff 59 00 80 bc d2 00 00 0e 16 16 00 ff ff ff ff ff ff>,
     flags: 6,
     localName: undefined,
     txPowerLevel: undefined,
     manufacturerData:
      msd {
        raw: <Buffer 59 00 80 bc d2 00 00 0e 16 16 00 ff ff ff ff ff ff>,
        mfg: 89,
        company: 'Ingics',
        code: 48256,
        battery: 210,
        events: {},
        eventFlag: 0,
        type: 'iBS01T',
        temperature: 5646,
        humidity: 22 },
     serviceData: [],
     serviceUuids: [],
     serviceSolicitationUuids: [] } }
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

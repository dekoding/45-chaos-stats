## 45chaos NodeJS API

### Requirements

  * node >= 10.11.0
  * `sequelize-cli` (npm install -g sequelize-cli)

### Running locally

```bash
$> git clone https://github.com/tinyzimmer/45chaos-node-api
$> cd 45chaos-node-api
$> npm install
$> npm start # runs 'sequelize db:migrate' then starts the web server
```

#### Optional .env

Some configurations can be modified with a `.env` file in the root of the directory.
Currently the following configuration options are available (with shown values at their default):

```bash
NODE_ENV=development
PORT=3000
UPDATE_INTERVAL=300000 # in milliseconds (default: 5 minutes)
```

#### Using Docker

You can also use Docker to build and run the API.

```bash
$> docker build . -t mooch-api
$> docker run --rm -p 3000:3000 mooch-api
```

### Routes

The following routes are currently available.

```
GET /api/departures             - Returns an Array of all Departures and their Values
GET /api/definitions            - Returns an Array of all Terms and their Definitions

GEt /api/stats                  - Returns a Dict of all the available statistics

GET /api/stats/affiliations     - Returns the Departure Count by Department
                                - Will also list departures and their meta underneath each group
GET /api/stats/leavetypes       - Returns the Departure Count by Fired/Resigned/Resigned Under Pressure
                                - Will also list departures and their meta underneath each group
GET /api/stats/perdaystr        - Returns the Average Departures Per Day String
GET /api/stats/avgtrumptime     - Returns Average Days Under Trump for all Departures
GET /api/stats/avgtrumphiretime - Returns Average Days Under Trump for Trump Appointee
GET /api/stats/avgrollovertime  - Returns Average Days Under Trump for Rollover Employee
```

## 45-chaos-stats

### Requirements

  * node >= 12.0.0
  * `angular-cli` (npm install -g @angular/cli)

### Running locally

```bash
$> git clone https://github.com/dekoding/45-chaos-stats
$> cd 45-chaos-stats/ui
$> npm install # install front-end dependencies
$> cd ../
$> npm install # install back-end dependencies
$> npm start # runs tsc and tslint, then starts the web server
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

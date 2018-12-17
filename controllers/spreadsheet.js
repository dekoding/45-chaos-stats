const config = require(__dirname + '/../config/config.json');
const parse = require('csv-parse/lib/sync')
const request = require('request')
const departure = require('./departure')
const definition = require('./definition')

const departureUrl = config.spreadsheetUrlBase + config.departuresGid
const definitionUrl = config.spreadsheetUrlBase + config.definitionsGid

const retrieveCsv = function(url, cb) {
  request(url, function (error, response, body) {
    if (error) {
      cb(null, error)
      return
    } else {
      cb(response.body, null)
    }
  })
}

const csvToDict = function(url, startIndex, cb) {
  retrieveCsv(url, function (response, error) {
    if (error) {
      console.error(error);
      return
    }
    splitStr = response.split('\n')
    stripHead = splitStr.slice(startIndex, splitStr.length).join('\n')
    records = parse(stripHead, {
      columns: true,
      skip_empty_lines: true
    })
    cb(records)
  })
}

const addDepartures = function(data) {
  var promises = []
  for (var i = 0; i < data.length; i++) {
    promises.push(departure.add(data[i], function(err) {
      if (err) {
        console.error(err)
      }
    }))
  }
  Promise.all(promises).then(function(values) {
    console.log(Date() + ' Finished departure sync: ' + promises.length + ' records')
  }).catch(function(error) {
    console.error(error)
  })
}

module.exports = {
  legendSeed() {
    destroy = definition.destroyAll()
    Promise.all([destroy]).then(function(values) {
      console.log(Date() + ' Destroyed existing definitions: ' + values + ' records')
      var promises = []
      retrieveCsv(definitionUrl, function (response, error) {
        if (error) {
          console.error(error);
          return
        }
        splitStr = response.split('\n')
        stripHead = splitStr.slice(2, splitStr.length - 1)
        for (var i = 0; i < stripHead.length; i++) {
          promises.push(definition.add(stripHead[i], function(err) {
            if (err) {
              console.error(err)
            }
          }))
        }
        Promise.all(promises).then(function(values) {
          console.log(Date() + ' Finished definitions sync: ' + promises.length + ' records')
        }).catch(function(error) {
          console.error(error)
        })
      })
    })
  },

  departureSeed() {
    destroy = departure.destroyAll()
    Promise.all([destroy]).then(function(values) {
      console.log(Date() + ' Destroyed existing departures: ' + values + ' records')
      csvToDict(departureUrl, 3, function(records) {
        addDepartures(records)
      })
    }).catch(function(error) {
      console.error(error)
    })
  }
}

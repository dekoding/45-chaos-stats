const Departure = require('../models').Departure;

const trumpInaugural = new Date(Date.parse("2017-01-20"));
const oneDay = 24*60*60*1000;

const getAllStats = function (departures, cb) {

  allStats = {}
  calcPerDayStr(departures, function (response) {
    allStats['perDayStr'] = response
  })
  calcLeaveTypes(false, departures, function (leaveTypes) {
    allStats['leaveTypes'] = leaveTypes
  })
  calcAffStats(false, departures, function (affStats) {
    allStats['affiliationStats'] = affStats
  })
  calcAverage(departures, function (trumpTime) {
    allStats['avgTrumpTime'] = trumpTime
  })

  rollovers = []
  hires = []
  for (var i = 0; i < departures.length; i++) {
    if (departures[i].DateHired.getTime() < trumpInaugural.getTime()) {
      rollovers.push(departures[i])
    } else {
      hires.push(departures[i])
    }
  }

  calcAverage(rollovers, function (avgRolloverDays) {
    allStats['avgRolloverTime'] = avgRolloverDays
  })
  calcAverage(hires, function (avgHireDays) {
    allStats['avgTrumpHireTime'] = avgHireDays
  })

  cb(allStats)

}

const calcPerDayStr = function (departures, cb) {
  // calculate the difference in days between now and the trump inauguration
  trumpDays = Math.round(
    Math.abs(
      (new Date().getTime() - trumpInaugural.getTime())/(oneDay)
    )
  )

  // Calculate the average departures per day in loop until perDay value is greater than 1
  perDay = 0
  dayUnit = 1
  while (perDay < 1) {
    perDay = Math.abs(
      ((departures.length / trumpDays) * dayUnit)
    ).toFixed(2)
    if (perDay < 1) {
      dayUnit++
    }
  }

  // fancies
  if (dayUnit == 1) {
    responseStr = perDay + ' people per day'
  } else {
    responseStr = perDay + ' people every ' + dayUnit.toString() + ' days'
  }

  cb(responseStr)
}

const calcLeaveTypes = function (countMembers, departures, cb) {
  leaveDict = {}
  for (var i = 0; i < departures.length; i++) {
    key = departures[i].LeaveType
    if ( leaveDict[key] ) {
      if ( countMembers ) {
        leaveDict[key]['count'] += 1
        leaveDict[key]['members'].push(departures[i].rendered)
      } else {
        leaveDict[key] += 1
      }
    } else {
      if ( countMembers ) {
        leaveDict[key] = {}
        leaveDict[key]['count'] = 1
        leaveDict[key]['members'] = []
        leaveDict[key]['members'].push(departures[i].rendered)
      } else {
        leaveDict[key] = 1
      }
    }
  }
  returnResults = []
  for (var key in leaveDict) {
    if ( countMembers ) {
      keyDict = {
        'label': key,
        'count': leaveDict[key]['count'],
        'members': leaveDict[key]['members']
      }
    } else {
      keyDict = {
        'label': key,
        'count': leaveDict[key]
      }
    }
    returnResults.push(keyDict)
  }

  cb(returnResults)
}

const calcAffStats = function (countMembers, departures, cb) {
  affDict = {}
  for (var i = 0; i < departures.length; i++) {
    if ( affDict[departures[i].Affiliation] ) {
      if ( countMembers ) {
        affDict[departures[i].Affiliation]['count'] += 1
        affDict[departures[i].Affiliation]['members'].push(departures[i].rendered)
      } else {
        affDict[departures[i].Affiliation] += 1
      }
    } else {
      if ( countMembers ) {
        affDict[departures[i].Affiliation] = {}
        affDict[departures[i].Affiliation]['count'] = 1
        affDict[departures[i].Affiliation]['members'] = []
        affDict[departures[i].Affiliation]['members'].push(departures[i].rendered)
      } else {
        affDict[departures[i].Affiliation] = 1
      }
    }
  }

  returnResults = []
  for (var key in affDict) {
    if ( countMembers ) {
      keyDict = {
        'label': key,
        'count': affDict[key]['count'],
        'members': affDict[key]['members']
      }
    } else {
      keyDict = {
        'label': key,
        'count': affDict[key]
      }
    }
    returnResults.push(keyDict)
  }

  cb(returnResults)
}

const calcAverage = function (departures, cb) {
  total = 0
  for (var i = 0; i < departures.length; i++) {
    total += departures[i].TrumpTime
  }
  avg = Math.abs(
    (total / departures.length).toFixed(2)
  )
  cb(avg)
}

module.exports = {

  /*
  Calculate to the closest value greater than 1, how many people departure every x days
  */

  all(req, res) {
    return Departure
      .findAll()
      .then(function (departures) {
        getAllStats(departures, function (stats) {
          res.status(200).send(stats)
        })
      })
      .catch((error) => { console.error(error); res.status(400).send(error); })
  },

  perDayStr(req, res) {
    return Departure
      .findAll()
      .then(function (departures) {
        calcPerDayStr(departures, function(response) {
          res.status(200).send(response)
        })
      })
      .catch((error) => { console.error(error); res.status(400).send(error); });
  },

  /*
  Count how many departures from each affiliation and return dict of values in following format
  {'DepartmentName': numDepartures}
  */

  affStats(req, res) {
    return Departure
      .findAll()
      .then(function (departures) {
        calcAffStats(true, departures, function (affDict) {
          res.status(200).send(affDict)
        })
       })
      .catch((error) => { console.error(error); res.status(400).send(error); });
  },

  /*
  Count how many departures from how they left and return dict of values in following format
  {'LeaveType': numDepartures}
  */

  leaveTypes(req, res) {
    return Departure
      .findAll()
      .then(function (departures) {
        calcLeaveTypes(true, departures, function (leaveStats) {
          res.status(200).send(leaveStats)
        })
      })
      .catch((error) => { console.error(error); res.status(400).send(error); });
  },

  /*
  Calculate the average time in days any employee has lasted while trump is in office
  */

  avgTrumpTime(req, res) {
    return Departure
      .findAll()
      .then(function (departures) {
        calcAverage(departures, function (average) {
          res.status(200).send(average.toString())
        })
      })
      .catch((error) => { console.error(error); res.status(400).send(error); });
  },

  /*
  The same as avgTrumpTime, but only with those hired the day of or after his inauguration
  */

  avgTrumpHireTime(req, res) {
    return Departure
      .findAll({
        where: {
          DateHired: {
            "$gte": trumpInaugural
          }
        }
      })
      .then(function (departures) {
        calcAverage(departures, function (average) {
          res.status(200).send(average.toString())
        })
      })
      .catch((error) => { console.error(error); res.status(400).send(error); });
  },

  /*
  The same as avgTrumpTime, but only with those hired before Trump took office
  */

  avgRolloverTime(req, res) {
    return Departure
      .findAll({
        where: {
          DateHired: {
            "$lt": trumpInaugural
          }
        }
      })
      .then(function (departures) {
        calcAverage(departures, function (average) {
          res.status(200).send(average.toString())
        })
      })
      .catch((error) => { console.error(error); res.status(400).send(error); });
  }

}

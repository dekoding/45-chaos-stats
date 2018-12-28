const Departure = require('../models').Departure;

const trumpInaugural = new Date(Date.parse("2017-01-20"));
const oneDay = 24*60*60*1000;

module.exports = {
    list(req, res) {
        return Departure
        .findAll({
            order: [
                ['LastName', 'ASC'],
            ]
        })
        .then(function (departures) {
            res.status(200).send(departures.map(i => i.rendered));
        })
        .catch((error) => { console.error(error); res.status(400).send(error); });
    },

    add(rec, cb) {
        parsedLeft = new Date(Date.parse(rec['Date Left']));
        parsedHired = new Date(Date.parse(rec['Date Hired']));
        totalTime = Math.round(
            Math.abs(
                (parsedLeft.getTime() - parsedHired.getTime())/(oneDay)
            )
        );
        if (parsedHired.getTime() < trumpInaugural.getTime()) {
            trumpTime = Math.round(
                Math.abs(
                    (parsedLeft.getTime() - trumpInaugural.getTime())/(oneDay)
                )
            );
        } else {
            trumpTime = Math.round(
                Math.abs(
                    (parsedLeft.getTime() - parsedHired.getTime())/(oneDay)
                )
            );
        }
        parsedSources = new Array(rec['Source 1'], rec['Source 2']);
        return Departure
        .create({
            LastName: rec['Last Name'],
            FirstName: rec['First Name'],
            Affiliation: rec['Affiliation'],
            Position: rec['Position'],
            DateHired: rec['Date Hired'],
            DateLeft: rec['Date Left'],
            TotalTime: totalTime,
            TrumpTime: trumpTime,
            MoochesTime: (trumpTime / 10).toFixed(1),
            LeaveType: rec['Fired/Resigned /Resigned under pressure'],
            Notes: rec['Notes'],
            Image: rec['Technical stuff for the website (coming soon)'],
            Sources: parsedSources.join('\n')
        })
        .catch((error) => cb(error));
    },

    destroyAll() {
        return Departure
        .destroy(
            {
                where: {}
            }
        )
        .then(rows_affected => {
            console.log(Date() + ' Destroyed existing definitions: ' + rows_affected + ' records');
            return true;
        })
        .catch(error => {
            console.error(error);
            return false;
        });
    }
}

const Definition = require('../models').Definition;

module.exports = {
    list(req, res) {
        return Definition
        .findAll()
        .then(function (definitions) {
            defDict = {}
            for (var i = 0; i < definitions.length; i++) {
                defDict[definitions[i].Name] = definitions[i].Definition
            }
            res.status(200).send(defDict);
        })
        .catch((error) => { res.status(400).send(error); });
    },

    add(rec, cb) {
        splitRec = rec.split(',')
        return Definition
        .create({
            Name: splitRec[0],
            Definition: splitRec[1],
        })
        .catch((error) => cb(error));
    },

    destroyAll() {
        return Definition
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

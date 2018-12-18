var express = require('express');
var router = express.Router();

const departureController = require('../controllers').departure;
const definitionController = require('../controllers').definition;
const statisticsController = require('../controllers').statistics;
const imageController = require('../controllers').images

/* GET routes */

// departures/definitions
router.get('/api/departures', departureController.list);
router.get('/api/definitions', definitionController.list);

// stats
router.get('/api/stats', statisticsController.all)
router.get('/api/stats/perdaystr', statisticsController.perDayStr)
router.get('/api/stats/affiliations', statisticsController.affStats)
router.get('/api/stats/avgtrumptime', statisticsController.avgTrumpTime)
router.get('/api/stats/leavetypes', statisticsController.leaveTypes)
router.get('/api/stats/avgtrumphiretime', statisticsController.avgTrumpHireTime)
router.get('/api/stats/avgrollovertime', statisticsController.avgRolloverTime)

// images
router.get('/api/images/:id', imageController.sendImage)

// HTML5 routing
router.get('*', (req, res) => {
        res.sendFile('index.html', { root: `${__dirname}/../public/` });
    });
module.exports = router;

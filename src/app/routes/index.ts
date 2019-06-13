import express from "express";
const router = express.Router();

import {
    DefinitionController,
    DepartureController,
    ImageController,
    StatisticsController
} from "../controllers";

import routes from "../config/routes.json";

/* GET routes */

// departures/definitions
router.get(routes.DEPARTURES, DepartureController.list);
router.get(routes.DEFINITIONS, DefinitionController.list);

// stats
router.get(routes.STATS, StatisticsController.all);
router.get(routes.STATS_PER_DAY, StatisticsController.perDayStr);
router.get(routes.AFFILIATIONS, StatisticsController.affStats);
router.get(routes.AVG_TRUMP_TIME, StatisticsController.avgTrumpTime);
router.get(routes.LEAVE_TYPES, StatisticsController.leaveTypes);
router.get(routes.AVG_TRUMP_HIRE_TIME, StatisticsController.avgTrumpHireTime);
router.get(routes.AVG_ROLLOVER_TIME, StatisticsController.avgRolloverTime);

// images
router.get(routes.IMAGES, ImageController.sendImage);

// HTML5 routing
router.get("*", (_req, res) => {
    res.sendFile("index.html", { root: `${__dirname}/../public/` });
});

export default router;

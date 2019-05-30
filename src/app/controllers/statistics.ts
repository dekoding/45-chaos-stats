import { Request, Response } from "express";
import config from "../config/config";
import { IDepartureRecord } from "../interfaces/departure-record";
import { IStatsRecord } from "../interfaces/stats-record";
import { DepartureController } from "./departure";
const { client } = config;

const trumpInaugural: Date = new Date(Date.parse("2017-01-20"));
const oneDay: number = 24 * 60 * 60 * 1000;

const getAllStats = async (departures: IDepartureRecord[]) => {
    const rollovers: IDepartureRecord[] = [];
    const hires: IDepartureRecord[] = [];

    departures.forEach((departure) => {
        const hired = new Date(Date.parse(departure.DateHired)).getTime();
        if (hired < trumpInaugural.getTime()) {
            rollovers.push(departure);
        } else {
            hires.push(departure);
        }
    });

    const allStats: IStatsRecord = {
        perDayStr: calcPerDayStr(departures),
        leaveTypes: calcLeaveTypes(false, departures),
        affiliationStats: calcAffStats(false, departures),
        avgTrumpTime: calcAverage(departures),
        avgRolloverTime: calcAverage(rollovers),
        avgTrumpHireTime: calcAverage(hires)
    };

    return allStats;
};

const calcPerDayStr = (departures: IDepartureRecord[]) => {
    // calculate the difference in days between now and the trump inauguration
    const trumpDays: number = Math.round(
        Math.abs(
            (new Date().getTime() - trumpInaugural.getTime()) / (oneDay)
        )
    );

    // Calculate the average departures per day in loop until perDay value is greater than 1
    let perDay: number = 0;
    let dayUnit: number = 1;
    while (perDay < 1) {
        perDay = Math.round(Math.abs(((departures.length / trumpDays) * dayUnit)) * 100) / 100;
        if (perDay < 1) {
            dayUnit++;
        }
    }

    // fancies
    let responseStr: string;
    if (dayUnit === 1) {
        responseStr = perDay + " people per day";
    } else {
        responseStr = perDay + " people every " + dayUnit.toString() + " days";
    }

    return responseStr;
};

const calcLeaveTypes = (countMembers: boolean, departures: IDepartureRecord[]) => {
    const leaveDict: any = {};
    departures.forEach((departure) => {
        const key = departure.LeaveType;
        if (leaveDict[key]) {
            if ( countMembers ) {
                leaveDict[key].count += 1;
                leaveDict[key].members.push(departure);
            } else {
                leaveDict[key] += 1;
            }
        } else {
            if ( countMembers ) {
                leaveDict[key] = {
                    count: 1,
                    members: [ departure ]
                };
            } else {
                leaveDict[key] = 1;
            }
        }
    });
    const returnResults = [];
    for (const key in leaveDict) {
        if (key) {
            let keyDict: any;
            if ( countMembers ) {
                keyDict = {
                    label: key,
                    count: leaveDict[key].count,
                    members: leaveDict[key].members
                };
            } else {
                keyDict = {
                    label: key,
                    count: leaveDict[key]
                };
            }
            returnResults.push(keyDict);
        }
    }

    return returnResults;
};

const calcAffStats = (countMembers: boolean, departures: IDepartureRecord[]) => {
    const affDict: any = {};
    departures.forEach((departure) => {
        if ( affDict[departure.Affiliation] ) {
            if ( countMembers ) {
                affDict[departure.Affiliation].count += 1;
                affDict[departure.Affiliation].members.push(departure);
            } else {
                affDict[departure.Affiliation] += 1;
            }
        } else {
            if ( countMembers ) {
                affDict[departure.Affiliation] = {};
                affDict[departure.Affiliation].count = 1;
                affDict[departure.Affiliation].members = [];
                affDict[departure.Affiliation].members.push(departure);
            } else {
                affDict[departure.Affiliation] = 1;
            }
        }
    });
    const returnResults: any[] = [];
    for (const key in affDict) {
        if (key) {
            let keyDict;
            if ( countMembers ) {
                keyDict = {
                    label: key,
                    count: affDict[key].count,
                    members: affDict[key].members
                };
            } else {
                keyDict = {
                    label: key,
                    count: affDict[key]
                };
            }
            returnResults.push(keyDict);
        }
    }

    return returnResults;
};

const calcAverage = (departures: IDepartureRecord[]) => {
    let total = 0;
    departures.forEach((departure) => {
        total += departure.TrumpTime;
    });
    return Math.abs(
        Math.round((total / departures.length) * 100) / 100 // toFixed(2)
    );
};

export const StatisticsController = {

    /*
    Calculate to the closest value greater than 1, how many people departure every x days
    */

    async all(req: Request, res: Response) {
        try {
            const departures: IDepartureRecord[] = await DepartureController.fetchDepartures();
            const stats = await getAllStats(departures);

            res.status(200).json(stats);
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    },

    async perDayStr(req: Request, res: Response) {
        try {
            const departures: IDepartureRecord[] = await DepartureController.fetchDepartures();
            const stats = calcPerDayStr(departures);

            res.status(200).send(stats);
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    },

    /*
    Count how many departures from each affiliation and return dict of values in following format
    {'DepartmentName': numDepartures}
    */

    async affStats(req: Request, res: Response) {
        try {
            const departures: IDepartureRecord[] = await DepartureController.fetchDepartures();
            const stats = await calcAffStats(true, departures);

            res.status(200).json(stats);
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    },

    /*
    Count how many departures from how they left and return dict of values in following format
    {'LeaveType': numDepartures}
    */

    async leaveTypes(req: Request, res: Response) {
        try {
            const departures: IDepartureRecord[] = await DepartureController.fetchDepartures();
            const stats = calcLeaveTypes(true, departures);

            res.status(200).json(stats);
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    },

    /*
    Calculate the average time in days any employee has lasted while trump is in office
    */

    async avgTrumpTime(req: Request, res: Response) {
        try {
            const departures: IDepartureRecord[] = await DepartureController.fetchDepartures();
            const stats = calcAverage(departures);

            res.status(200).json(stats);
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    },

    /*
    The same as avgTrumpTime, but only with those hired the day of or after his inauguration
    */

    async avgTrumpHireTime(req: Request, res: Response) {
        try {
            const departures: IDepartureRecord[] = await DepartureController.fetchDepartures();
            const filtered = departures.filter((departure) => {
                const hired: number = new Date(Date.parse(departure.DateHired)).getTime();
                return hired > trumpInaugural.getTime();
            });
            const stats = calcAverage(filtered);

            res.status(200).json(stats);
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    },

    /*
    The same as avgTrumpTime, but only with those hired before Trump took office
    */

    async avgRolloverTime(req: Request, res: Response) {
        try {
            const departures: IDepartureRecord[] = await DepartureController.fetchDepartures();
            const filtered = departures.filter((departure) => {
                const hired: number = new Date(Date.parse(departure.DateHired)).getTime();
                return hired < trumpInaugural.getTime();
            });
            const stats = calcAverage(filtered);

            res.status(200).json(stats);
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    }
};

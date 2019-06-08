import { Request, Response } from "express";
import config from "../config/config";
import { IDepartureRecord, IDepartureRecordRaw } from "../interfaces/departure-record";
import { toTitleCase } from "../lib/utilities";
import { ImageController } from "./images";
const { client, trumpInaugural, oneDay } = config;

const getDeparturesFromCache = async () => {
    const keys = await client.keys("Departure-*");
    const records: IDepartureRecord[] = [];

    for (const k in keys) {
        if (k) {
            const record: IDepartureRecord = JSON.parse(await client.get(keys[k])) as IDepartureRecord;
            records.push(record);
        }
    }
    return records;
};

const convertToDepartureRecords = (raw: IDepartureRecordRaw[]) => {
    const records: IDepartureRecord[] = [];
    raw.forEach((record) => {
        const parsedLeft: Date = new Date(Date.parse(record["Date Left"]));
        const parsedHired: Date = new Date(Date.parse(record["Date Hired"]));
        const totalTime = Math.round(
            Math.abs(
                (parsedLeft.getTime() - parsedHired.getTime()) / (oneDay)
            )
        );
        let trumpTime: number;
        if (parsedHired.getTime() < trumpInaugural.getTime()) {
            trumpTime = Math.round(
                Math.abs(
                    (parsedLeft.getTime() - trumpInaugural.getTime()) / (oneDay)
                )
            );
        } else {
            trumpTime = Math.round(
                Math.abs(
                    (parsedLeft.getTime() - parsedHired.getTime()) / (oneDay)
                )
            );
        }
        const parsedSources: any[] = [ record["Source 1"], record["Source 2"] ];
        const finalRecord: IDepartureRecord = {
            LastName: record["Last Name"],
            FirstName: record["First Name"],
            Affiliation: record.Affiliation,
            Position: record.Position,
            DateHired: record["Date Hired"],
            DateLeft: record["Date Left"],
            TotalTime: totalTime,
            TrumpTime: trumpTime,
            MoochesTime: (trumpTime / 10).toFixed(1),
            LeaveType: record["Fired/Resigned /Resigned under pressure"],
            Notes: toTitleCase(record.Notes),
            Image: record["Technical stuff for the website (coming soon)"],
            Sources: parsedSources.join("\n")
        };
        records.push(finalRecord);
    });
    return records;
};

export const DepartureController = {
    async fetchDepartures() {
        const records = await getDeparturesFromCache();
        return records;
    },
    async list(req: Request, res: Response) {
        try {
            const records = await getDeparturesFromCache();
            res.status(200).json(records);
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    },
    async update(rawRecords: IDepartureRecordRaw[]) {
        const records: IDepartureRecord[] = convertToDepartureRecords(rawRecords);
        records.forEach(async (record) => {
            const jsonRecord: string = JSON.stringify(record);
            const key: string = `Departure-${record.LastName}_${record.FirstName}`;
            try {
                const result: string = await client.get(key);
                if (result !== jsonRecord) {
                    await client.set(key, jsonRecord);
                }
            } catch (err) {
                // Record is not in Redis. Add it.
                await client.set(key, jsonRecord);
            }

            const imageExists = await ImageController.checkImage(record.Image);
            if (!imageExists) {
                await ImageController.getImage(record.Image);
            }
        });
    },
    async destroyAll() {
        const keys: string[] = await client.keys("Departure-*");
        for (const k in keys) {
            if (k) {
                await client.del(keys[k]);
            }
        }
        return true;
    }
};

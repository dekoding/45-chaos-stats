import { Request, Response } from "express";
import config from "../config/config";
import { IDefinitionRecord } from "../interfaces/definition-record";
const { client } = config;

const getDefinitionsFromCache = async () => {
    const keys = await client.keys("Definition-*");
    const records: IDefinitionRecord[] = [];

    for (const k in keys) {
        if (k) {
            const record: IDefinitionRecord = JSON.parse(await client.get(keys[k])) as IDefinitionRecord;
            records.push(record);
        }
    }
    return records;
};

export const DefinitionController = {
    async list(req: Request, res: Response) {
        try {
            const records = await getDefinitionsFromCache();
            res.status(200).json(records);
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    },
    update(records: IDefinitionRecord[]) {
        records.forEach(async (record) => {
            const jsonRecord: string = JSON.stringify(record);
            const key: string = `Definition-${record.Name}`;
            try {
                const result: string = await client.get(key);
                if (result !== jsonRecord) {
                    await client.set(key, jsonRecord);
                }
            } catch (err) {
                // Record is not in Redis. Add it.
                await client.set(key, jsonRecord);
            }
        });
    },
    async destroyAll() {
        const keys: string[] = await client.keys("Definition-*");
        for (const k in keys) {
            if (k) {
                await client.del(keys[k]);
            }
        }
        return true;
    }
};

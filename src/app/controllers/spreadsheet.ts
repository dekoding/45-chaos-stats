import axios, { AxiosResponse } from "axios";
import parse from "csv-parse/lib/sync";
import { IDefinitionRecord } from "../interfaces/definition-record";
import { IDepartureRecordRaw } from "../interfaces/departure-record";
import { DefinitionController } from "./definition";
import { DepartureController } from "./departure";

export const retrieveCsvDefinitions = async (url: string) => {
    const response: AxiosResponse = await axios.get(url);
    const raw: any[][] = parse(response.data);

    raw.shift();
    raw.shift();

    const results = raw.map((entry: any[]) => {
        return {
            Name: entry[0],
            Definition: entry[1]
        };
    });
    return results;
};

export const retrieveCsvDepartures = async (url: string, index: number) => {
    const response: AxiosResponse = await axios.get(url);
    const splitStr: any[] = response.data.split("\n");
    const stripHead: string = splitStr.slice(index, splitStr.length).join("\n");
    const records: any[] = parse(stripHead, {
        columns: true,
        skip_empty_lines: true
    });
    return records;
};

export const SpreadsheetController = {
    async legendSeed(definitionUrl: string, purge: boolean) {
        try {
            if (purge) {
                await DefinitionController.destroyAll();
            }
            const records: IDefinitionRecord[] = await retrieveCsvDefinitions(definitionUrl);
            await DefinitionController.update(records);
            console.log(Date() + " Finished definition sync: " + records.length + " records");
        } catch (error) {
            console.error(Date() + " Unable to sync definitions!");
        }
    },

    async departureSeed(departureUrl: string, purge: boolean) {
        try {
            if (purge) {
                await DepartureController.destroyAll();
            }
            const records: IDepartureRecordRaw[] = await retrieveCsvDepartures(departureUrl, 3);
            await DepartureController.update(records);
            console.log(Date() + " Finished departure sync: " + records.length + " records");
        } catch (error) {
            console.error(Date() + " Unable to sync departures!");
        }
    }
};

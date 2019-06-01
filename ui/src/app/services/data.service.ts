import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Chaos } from '../interfaces/chaos';
import { IDefinitionRecord } from '../../../../src/app/interfaces/definition-record';
import { Stat } from '../interfaces/stat';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(
        public http: HttpClient
    ) { }

    departures:string = './api/departures';
    definitions:string = './api/definitions';
    stats:string = './api/stats';

    startOfMadness:number = new Date(Date.parse('01/20/2017')).getTime();

    averages = {
        avgPerDay: './api/stats/perdaystr',
        avgTrumpTime: './api/stats/avgtrumptime',
        avgTrumpHireTime: './api/stats/avgtrumphiretime',
        avgRolloverTime: './api/stats/avgrollovertime'
    };

    dataSource:MatTableDataSource<any>;

    getDepartures():Observable<Chaos[]> {
        return this.http.get(this.departures)
            .pipe(map((response: Chaos[]) => {
                response.forEach(chaos => {
                    chaos.TotalTime = parseInt(String(chaos.TotalTime).replace(',',''));
                    const hireTime:number = new Date(Date.parse(chaos.DateHired)).getTime();
                    if (hireTime > this.startOfMadness) {
                        chaos.HiredUnderTrump = 'Y';
                    } else {
                        chaos.HiredUnderTrump = 'N';
                    }
                });
                return response;
            }));
    }

    getDefinitions():Observable<IDefinitionRecord[]> {
        return this.http.get(this.definitions)
            .pipe(map((response:IDefinitionRecord[]) => {
                return response;
            }));
    }

    getStats():Observable<Stat> {
        return this.http.get(this.stats)
            .pipe(map((response: Stat) => response));
    }

    getAverage(type:string):Observable<string> {
        return this.http.get(this.averages[type], { responseType: 'text' })
            .pipe(map((response: string) => response));
    }
}

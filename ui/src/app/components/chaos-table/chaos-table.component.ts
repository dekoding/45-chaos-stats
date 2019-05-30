import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Chaos } from '../../interfaces/chaos';
import { DataService } from '../../services/data.service';

import { DetailComponent } from './detail/detail.component';

@Component({
    selector: 'app-chaos-table',
    templateUrl: './chaos-table.component.html',
    styleUrls: ['./chaos-table.component.css']
})
export class ChaosTableComponent implements OnInit {
    constructor(
        public dialog: MatDialog,
        public data: DataService
    ) { }

    ngOnInit() {
        this.data.getDepartures()
            .subscribe(results => {
                results.forEach(element => this.list.push(element));
                this.data.dataSource = new MatTableDataSource<any>(this.list);
                this.data.dataSource.sort = this.sort;
                this.data.dataSource.paginator = this.paginator;
                this.data.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case 'DateHired': return new Date(item.DateHired);
                        case 'DateLeft': return new Date(item.DateLeft);
                        case 'TotalTime': return +item.TotalTime;
                        case 'TrumpTime': return +item.TrumpTime;
                        case 'MootchesTime': return +item.MoochesTime;
                        default: return item[property];
                    }
                };
                this.data.dataSource.filterPredicate = (data: Chaos, filter: string) => {
                    let match = false;
                    Object.entries(data).forEach(([key, value]) => {
                        if (
                            key !== 'Notes' &&
                            value.toString().toLowerCase().includes(filter.toLowerCase())
                        ) {
                            match = true;
                        }
                    });
                    return match;
                };
            });
    }

    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    list:any[] = [];

    displayedColumns = [
        'LastName',
        'Affiliation',
        'Position',
        'HiredUnderTrump',
        'DateHired',
        'DateLeft',
        'TotalTime',
        'TrumpTime',
        'MoochesTime',
        'LeaveType'
    ];

    openDialog(element: Chaos): void {
        this.dialog.open(DetailComponent, {
            width: '80%',
            data: element
        });
    }

    applyFilter(filterValue:string) {
        this.data.dataSource.filter = filterValue.trim().toLowerCase();
    }
}

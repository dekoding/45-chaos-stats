import { Component, ViewChild, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatDialogRef } from '@angular/material';

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

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    list:any[] = [];

    displayedColumns = [
        'LastName',
        'Affiliation',
        'Position',
        'DateHired',
        'DateLeft',
        'TotalTime',
        'TrumpTime',
        'MoochesTime',
        'LeaveType'
    ];

    isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
    expandedElement: any;

    openDialog(element: Chaos): void {
        const dialogRef = this.dialog.open(DetailComponent, {
            width: '80%',
            data: element
        });
    }

    applyFilter(filterValue:string) {
        this.data.dataSource.filter = filterValue.trim().toLowerCase();
    }
}

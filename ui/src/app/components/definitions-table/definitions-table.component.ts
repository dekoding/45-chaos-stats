import { Component, ViewChild, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { MatTableDataSource, MatSort } from '@angular/material';

import { Definition } from '../../interfaces/definition';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-definitions-table',
  templateUrl: './definitions-table.component.html',
  styleUrls: ['./definitions-table.component.css']
})
export class DefinitionsTableComponent implements OnInit {

  constructor(
      public data: DataService
  ) { }

  ngOnInit() {
      this.data.getDefinitions()
          .subscribe(results => {
              results.forEach(element => this.list.push(element));
              this.dataSource = new MatTableDataSource<any>(this.list);
              this.dataSource.sort = this.sort;
          });
  }

  @ViewChild(MatSort) sort: MatSort;

  list:any[] = [];

  dataSource:MatTableDataSource<any>;

  displayedColumns = [ 'label', 'explanation' ];

}

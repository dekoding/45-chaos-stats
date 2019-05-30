import { Component, ViewChild, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { IDefinitionRecord } from '../../../../../src/app/interfaces/definition-record';
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
              results.forEach(element => {
                  this.list.push(element);
              });
              this.dataSource = new MatTableDataSource<IDefinitionRecord>(this.list);
              this.dataSource.sort = this.sort;
          });
  }

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  list:IDefinitionRecord[] = [];

  dataSource:MatTableDataSource<IDefinitionRecord>;

  displayedColumns = [ 'Name', 'Definition' ];

}

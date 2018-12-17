import { Component, ViewChild, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material';

import { Stat, StatEntry } from '../../interfaces/stat';
import { DataService } from '../../services/data.service';
import { Chart } from 'chart.js';

const labelKeys:Object = {
    'R': 'Resigned',
    'R-UP': 'Resigned - Under Pressure',
    'F': 'Fired',
    '?': 'Unknown'
};

@Component({
    selector: 'app-mooch-stats-table',
    templateUrl: './mooch-stats-table.component.html',
    styleUrls: ['./mooch-stats-table.component.css']
})
export class MoochStatsTableComponent implements OnInit {
    @ViewChild('leaveChart') leaveChartElem: ElementRef;
    @ViewChild('affiliationsChart') affiliationsChartElem: ElementRef;

    constructor(
        public renderer: Renderer2,
        public data: DataService
    ) { }

    getRandomColors(count:number) {
        const letters:string = '0123456789ABCDEF';

        const colors:string[] = [];

        for (let a = 0; a < count; a++) {
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            colors.push(color);
        }

        return(colors);
    }

    charts = {
        leaveTypes: Chart,
        affiliations: Chart
    };

    chartOptions = {
        leaveTypes: {
            config: {
        		type: 'pie',
        		data: {
        			datasets: [],
        			labels: []
        		},
        		options: {
        			responsive: true
        		}
        	}
        },
        affiliations: {
            config: {
        		type: 'horizontalBar',
        		data: {
        			datasets: [],
        			labels: []
        		},
        		options: {
        			responsive: true,
                    legend: {
                        display: false
                    }
        		}
        	}
        }
    }

    statsTable:Array<{string: string|number}> = [];

    leaveTypes:StatEntry[] = [];
    affiliations:StatEntry[] = [];

    ngOnInit() {
        this.data.getStats()
            .subscribe(results => {
                this.leaveTypes = results.leaveTypes;
                this.affiliations = results.affiliationStats;

                const leaveTypesData = {
                    data: [],
    				backgroundColor: ['red','blue','yellow','green'],
    				label: 'By Leave Types'
                };

                const leaveTypesLabels = [];

                results.leaveTypes.forEach(entry => {
                    leaveTypesData.data.push(entry.count);
                    leaveTypesLabels.push(labelKeys[entry.label]);
                });

                this.chartOptions.leaveTypes.config.data.datasets.push(leaveTypesData);
                this.chartOptions.leaveTypes.config.data.labels = leaveTypesLabels;

                const ctxLeaveTypes = this.leaveChartElem.nativeElement.getContext('2d');
                ctxLeaveTypes.height = 400;

                this.charts.leaveTypes = new Chart(this.leaveChartElem.nativeElement, this.chartOptions.leaveTypes.config);

                const affiliationsData = {
                    data: [],
                    backgroundColor: this.getRandomColors(results.affiliationStats.length),
                };

                const affiliationsLabels = [];

                results.affiliationStats.forEach(entry => {
                    affiliationsData.data.push(entry.count);
                    affiliationsLabels.push(entry.label);
                });

                this.chartOptions.affiliations.config.data.datasets.push(affiliationsData);
                this.chartOptions.affiliations.config.data.labels = affiliationsLabels;


                const ctxAffiliations = this.affiliationsChartElem.nativeElement.getContext('2d');
                ctxLeaveTypes.height = 800;

                this.charts.affiliations = new Chart(this.affiliationsChartElem.nativeElement, this.chartOptions.affiliations.config);
            });
    }
}

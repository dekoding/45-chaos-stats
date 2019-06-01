import { Component, ViewChild, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

import { Stat, StatEntry } from '../../interfaces/stat';
import { DataService } from '../../services/data.service';
import { Chart } from 'chart.js';

const labelKeys:Object = {
    'R': 'Resigned',
    'R-UP': 'Resigned - Under Pressure',
    'F': 'Fired',
    '?': 'Unknown'
};

const affiliationKeys:Object = {
    'State Dept': 'State Department',
    'WH': 'White House',
    'FBI': 'Federal Bureau of Investigation',
    'EPA': 'Environmental Protection Agency',
    'OPM': 'Office of Personnel Management',
    'Commerce': 'Department of Commerce',
    'DHS': 'Department of Homeland Security',
    'CFPB': 'Consumer Financial Protection Bureau',
    'Defense': 'Department of Defense',
    'CIA': 'Central Intelligence Agency',
    'FWS': 'U.S. Fish and Wildlife Service',
    'HHS': 'Health and Human Services',
    'DOJ': 'Department of Justice',
    'HSAC': 'Homeland Security Advisory Council',
    'ICE': 'Immigration and Customs',
    'HUD': 'Department of Housing and Urban Development',
    'VA': 'Veterans Affairs',
    'FDIC': 'Federal Deposit Insurance Corporation',
    'Treasury': 'Department of the Treasury',
    'USDA': 'U.S. Department of Agriculture',
    'NASA': 'National Aeronautics and Space Administration',
    'BIA': 'Bureau of Indian Affairs',
    'Trump': 'Trump',
    'Forest Service': 'U.S. Forest Service',
    'Interior': 'U.S. Department of the Interior',
    'Dept of Interior': 'U.S. Department of the Interior', // Dupe
    'Elections': 'Federal Elections Commission',
    'Fed Reserve': 'Federal Reserve',
    'CDC': 'Centers for Disease Control',
    'USGS': 'U.S. Geological Survey',
    'CNCS': 'Corporation for National and Community Service',
    'NPS': 'National Parks Service',
    'PACHA': 'Presidential Advisory Council on HIV/AIDS',
    'DEA': 'Drug Enforcement Agency',
    'NDC': 'National Diverstiy Coalition',
    'RNC': 'Republican National Committee',
    'NIAC': 'National Infrastructure Advisory Council',
    'PCAH': "President's Committee on the Arts & Humanities",
    'DEBA': 'DEBA',
    'AMC': 'American Manufacturing Council',
    'SPF': 'Strategic and Policy Forum',
    'DOE': 'Department of Energy',
    'ITC': 'U.S. International Trade Commission',
    'Census': 'Census Bureau',
    'Patent Office': 'U.S. Patent Office',
    'SPF & AMC': 'SPF & AMC',
    'NEH': 'National Endowment for the Humanities',
    'Public Health ': 'Public Health',
    'AAPI': "President's Advisory Commission on Asian Americans and Pacific Islanders",
    'Border Patrol': 'Border Patrol',
    'FDA': 'U.S. Food and Drug Administration',
    'FEMA': 'Federal Emergency Management Agency',
    'Labor': 'U.S. Department of Labor'
};

@Component({
    selector: 'app-mooch-stats-table',
    templateUrl: './mooch-stats-table.component.html',
    styleUrls: ['./mooch-stats-table.component.css']
})
export class MoochStatsTableComponent implements OnInit {
    @ViewChild('leaveChart', {static: false}) leaveChartElem: ElementRef;
    @ViewChild('affiliationsChart', {static: false}) affiliationsChartElem: ElementRef;

    constructor(
        public renderer: Renderer2,
        public data: DataService
    ) { }

    avgPerDay:string = '';
    avgTrumpTime:string = '';
    avgTrumpHireTime:string = '';
    avgRolloverTime:string = '';

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

    leaveTypesChart:Chart;
    affiliationsChart:Chart;

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
                this.leaveTypes = results.leaveTypes.sort((a,b) => {
                    if (a.count < b.count) {
                        return 1;
                    }
                    return -1;
                });
                this.affiliations = results.affiliationStats.sort((a,b) => {
                    if (a.count < b.count) {
                        return 1;
                    }
                    return -1;
                });

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
                ctxLeaveTypes.height = 800;

                this.leaveTypesChart = new Chart(this.leaveChartElem.nativeElement, this.chartOptions.leaveTypes.config);

                const affiliationsData = {
                    data: [],
                    backgroundColor: this.getRandomColors(results.affiliationStats.length),
                };

                const affiliationsLabels = [];

                results.affiliationStats.forEach(entry => {
                    affiliationsData.data.push(entry.count);
                    affiliationsLabels.push(affiliationKeys[entry.label]);
                });

                this.chartOptions.affiliations.config.data.datasets.push(affiliationsData);
                this.chartOptions.affiliations.config.data.labels = affiliationsLabels;

                this.affiliationsChart = new Chart(this.affiliationsChartElem.nativeElement, this.chartOptions.affiliations.config);
            });

        Object.keys(this.data.averages).forEach(type => {
            this.data.getAverage(type)
                .subscribe(result => {
                    this[type] = result;
                });
        });
    }
}

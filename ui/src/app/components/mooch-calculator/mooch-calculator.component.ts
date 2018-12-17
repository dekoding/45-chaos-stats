import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
    selector: 'app-mooch-calculator',
    templateUrl: './mooch-calculator.component.html',
    styleUrls: ['./mooch-calculator.component.css']
})
export class MoochCalculatorComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
    calculateMooches(event:any) {
        console.log(event);
    }

    parseDate(str) {
        const mdy = str.split('/');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
    }

    getMooches(event: MatDatepickerInputEvent<Date>) {
        const input = event.value.getTime();
        const now = new Date().getTime();

        const first = now > input ? input : now;
        const second = now > input ? now : input;
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        const days = Math.round((second-first)/(1000*60*60*24));
        console.log(days / 10);
        if (now > input && days !== 0) {
            this.moochCount = `That was ${days / 10} Mooches ago!`;
        } else if (now < input && days !== 0) {
            this.moochCount = `That is ${days / 10} Mooches from now!`;
        } else {
            this.moochCount = `That's not even 1/10 of a Mooch away!`;
        }
    }

    moochCount:string = 'Waiting for Calculation!';
}

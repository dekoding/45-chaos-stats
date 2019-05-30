import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chaos } from '../../../interfaces/chaos';
@Component({
    selector: 'chaos-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent {

    constructor(
        public dialogRef: MatDialogRef<DetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Chaos
    ) {}

    okClick(): void {
        this.dialogRef.close();
    }
}

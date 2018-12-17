import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
} from '@angular/material';

import { DeferLoadModule } from '@trademe/ng-defer-load';

import { HeaderComponent } from './components/header/header.component';
import { ChaosTableComponent } from './components/chaos-table/chaos-table.component';
import { MoochStatsTableComponent } from './components/mooch-stats-table/mooch-stats-table.component';
import { DefinitionsTableComponent } from './components/definitions-table/definitions-table.component';
import { MoochCalculatorComponent } from './components/mooch-calculator/mooch-calculator.component';
import { DetailComponent } from './components/chaos-table/detail/detail.component';
import { FooterComponent } from './components/footer/footer.component';

const appRoutes: Routes = [
    { path: 'keys', component: DefinitionsTableComponent },
    { path: 'mooches', component: MoochCalculatorComponent },
    { path: 'stats', component: MoochStatsTableComponent },
    { path: '', component: ChaosTableComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ChaosTableComponent,
        MoochStatsTableComponent,
        DefinitionsTableComponent,
        MoochCalculatorComponent,
        DetailComponent,
        FooterComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        DeferLoadModule,
        RouterModule.forRoot(appRoutes)
    ],
    entryComponents: [DetailComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

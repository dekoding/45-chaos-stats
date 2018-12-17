import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoochStatsTableComponent } from './mooch-stats-table.component';

describe('MoochStatsTableComponent', () => {
  let component: MoochStatsTableComponent;
  let fixture: ComponentFixture<MoochStatsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoochStatsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoochStatsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

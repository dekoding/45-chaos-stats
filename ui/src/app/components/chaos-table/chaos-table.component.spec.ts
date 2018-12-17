import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaosTableComponent } from './chaos-table.component';

describe('ChaosTableComponent', () => {
  let component: ChaosTableComponent;
  let fixture: ComponentFixture<ChaosTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChaosTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChaosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

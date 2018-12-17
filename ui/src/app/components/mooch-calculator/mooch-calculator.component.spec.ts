import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoochCalculatorComponent } from './mooch-calculator.component';

describe('MoochCalculatorComponent', () => {
  let component: MoochCalculatorComponent;
  let fixture: ComponentFixture<MoochCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoochCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoochCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

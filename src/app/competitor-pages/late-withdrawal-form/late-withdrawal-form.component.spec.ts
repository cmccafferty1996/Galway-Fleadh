import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateWithdrawalFormComponent } from './late-withdrawal-form.component';

describe('LateWithdrawalFormComponent', () => {
  let component: LateWithdrawalFormComponent;
  let fixture: ComponentFixture<LateWithdrawalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateWithdrawalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateWithdrawalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageRegistrationComponent } from './manage-registration.component';

describe('ManageRegistrationComponent', () => {
  let component: ManageRegistrationComponent;
  let fixture: ComponentFixture<ManageRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

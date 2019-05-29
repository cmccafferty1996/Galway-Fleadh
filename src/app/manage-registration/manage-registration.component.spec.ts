import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRegistrationComponent } from './manage-registration.component';

describe('ManageRegistrationComponent', () => {
  let component: ManageRegistrationComponent;
  let fixture: ComponentFixture<ManageRegistrationComponent>;

  beforeEach(async(() => {
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

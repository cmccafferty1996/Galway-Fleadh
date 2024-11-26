import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageSlipsComponent } from './manage-slips.component';

describe('ManageSlipsComponent', () => {
  let component: ManageSlipsComponent;
  let fixture: ComponentFixture<ManageSlipsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSlipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSlipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

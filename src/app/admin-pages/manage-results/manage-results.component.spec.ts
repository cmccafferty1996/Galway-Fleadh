import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageResultsComponent } from './manage-results.component';

describe('ManageResultsComponent', () => {
  let component: ManageResultsComponent;
  let fixture: ComponentFixture<ManageResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

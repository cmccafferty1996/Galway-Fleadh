import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhotoRecordingPermitComponent } from './photo-recording-permit.component';

describe('PhotoRecordingPermitComponent', () => {
  let component: PhotoRecordingPermitComponent;
  let fixture: ComponentFixture<PhotoRecordingPermitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoRecordingPermitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoRecordingPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

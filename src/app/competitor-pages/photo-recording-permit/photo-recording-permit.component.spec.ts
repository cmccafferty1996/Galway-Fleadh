import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoRecordingPermitComponent } from './photo-recording-permit.component';

describe('PhotoRecordingPermitComponent', () => {
  let component: PhotoRecordingPermitComponent;
  let fixture: ComponentFixture<PhotoRecordingPermitComponent>;

  beforeEach(async(() => {
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SlipsComponent } from './slips.component';

describe('SlipsComponent', () => {
  let component: SlipsComponent;
  let fixture: ComponentFixture<SlipsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
